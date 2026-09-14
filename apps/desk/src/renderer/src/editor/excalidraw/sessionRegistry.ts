/**
 * 打开中的画布会话登记表（按知识库 + 路径）。
 *
 * 三个用途：
 * 1. 跨笔记复制前必须先 flush 源画布，否则复制到的是过时的磁盘内容（计划 E7）
 * 2. 笔记里那张图要知道「画布是否正在标签页里编辑」（笔图标）——见订阅会话开关
 * 3. 派生产物（`.svg`）要跟着画布内容实时更新 —— 见订阅内容变化
 *
 * 标签页与（已移除的）内嵌卡片都通过 `canvasController` 注册，所以这里一处登记
 * 就覆盖所有入口。
 */
export interface ExcalidrawSessionHandle {
  /** flush 并等到真的写完 */
  settle(): Promise<void>
  /** 内存里的当前场景（可能还没落盘）；用于派生图实时预览 */
  currentContent?: () => string
}

const sessions = new Map<string, Set<ExcalidrawSessionHandle>>()
/** 内容变化订阅（每个打开的画布一张表） */
const contentListeners = new Map<string, Set<(content: string) => void>>()
/** 会话开关订阅（打开/关闭，含会话数变化） */
const sessionListeners = new Map<string, Set<(open: boolean) => void>>()

export function excalidrawSessionKey(knowledgeBaseId: string, relPath: string): string {
  return `${knowledgeBaseId}\u0000${relPath}`
}

function addListener<T>(
  table: Map<string, Set<(value: T) => void>>,
  key: string,
  listener: (value: T) => void
): () => void {
  const bucket = table.get(key) ?? new Set<(value: T) => void>()
  bucket.add(listener)
  table.set(key, bucket)
  return () => {
    const current = table.get(key)
    if (!current) return
    current.delete(listener)
    if (current.size === 0) table.delete(key)
  }
}

function emit<T>(table: Map<string, Set<(value: T) => void>>, key: string, value: T): void {
  for (const listener of [...(table.get(key) ?? [])]) {
    try {
      listener(value)
    } catch (error) {
      console.error('[tnotes] excalidraw listener failed', error)
    }
  }
}

export function registerExcalidrawSession(
  knowledgeBaseId: string,
  relPath: string,
  handle: ExcalidrawSessionHandle
): () => void {
  const key = excalidrawSessionKey(knowledgeBaseId, relPath)
  const bucket = sessions.get(key) ?? new Set<ExcalidrawSessionHandle>()
  const first = bucket.size === 0
  bucket.add(handle)
  sessions.set(key, bucket)
  if (first) emit(sessionListeners, key, true)
  return () => {
    const current = sessions.get(key)
    if (!current) return
    current.delete(handle)
    if (current.size === 0) {
      sessions.delete(key)
      emit(sessionListeners, key, false)
    }
  }
}

/** 会话内容变化（渲染端内存里的最新场景，不保证已落盘）。 */
export function notifyExcalidrawContent(
  knowledgeBaseId: string,
  relPath: string,
  content: string
): void {
  emit(contentListeners, excalidrawSessionKey(knowledgeBaseId, relPath), content)
}

/** 订阅某个画布的内容变化；返回取消订阅。 */
export function subscribeExcalidrawContent(
  knowledgeBaseId: string,
  relPath: string,
  listener: (content: string) => void
): () => void {
  return addListener(contentListeners, excalidrawSessionKey(knowledgeBaseId, relPath), listener)
}

/** 订阅「该画布是否有打开中的会话」；订阅时会立刻回调一次当前状态。 */
export function subscribeExcalidrawSession(
  knowledgeBaseId: string,
  relPath: string,
  listener: (open: boolean) => void
): () => void {
  const key = excalidrawSessionKey(knowledgeBaseId, relPath)
  const unsubscribe = addListener(sessionListeners, key, listener)
  listener((sessions.get(key)?.size ?? 0) > 0)
  return unsubscribe
}

/** 该文件是否有打开中的会话（含未写完内容）。 */
export function hasExcalidrawSession(knowledgeBaseId: string, relPath: string): boolean {
  return (sessions.get(excalidrawSessionKey(knowledgeBaseId, relPath))?.size ?? 0) > 0
}

/** 取某个打开中的会话的当前内存内容（画布没打开时返回 null）。 */
export function currentExcalidrawContent(knowledgeBaseId: string, relPath: string): string | null {
  const bucket = sessions.get(excalidrawSessionKey(knowledgeBaseId, relPath))
  for (const handle of bucket ?? []) {
    const content = handle.currentContent?.()
    if (content) return content
  }
  return null
}

export interface SettleAllSessionsResult {
  /** 已成功写完的路径 */
  settled: string[]
  /** 写不完的路径与原因：恢复必须因此停下，不能拿半份状态去备份 */
  failures: Array<{ relPath: string; message: string }>
}

/**
 * flush 某个知识库里所有打开中的画布会话并等到真的写完（计划 H4 恢复前 flush）。
 *
 * 历史恢复要「先把最后一笔画布写进备份」，而恢复计划在拿到快照前还不知道会涉及
 * 哪些资源，所以这里按知识库整体 settle；单个失败不影响其它会话，但会回报给调用方。
 */
export async function settleExcalidrawSessions(
  knowledgeBaseId: string
): Promise<SettleAllSessionsResult> {
  const prefix = `${knowledgeBaseId}\u0000`
  const targets: Array<{ relPath: string; handle: ExcalidrawSessionHandle }> = []
  for (const [key, bucket] of sessions) {
    if (!key.startsWith(prefix)) continue
    for (const handle of bucket) targets.push({ relPath: key.slice(prefix.length), handle })
  }
  const settled: string[] = []
  const failures: Array<{ relPath: string; message: string }> = []
  await Promise.all(
    targets.map(async (target) => {
      try {
        await target.handle.settle()
        settled.push(target.relPath)
      } catch (error) {
        failures.push({
          relPath: target.relPath,
          message: error instanceof Error ? error.message : String(error)
        })
      }
    })
  )
  return { settled, failures }
}

/** 把所有打开中的该文件会话写完（失败不抛，交给各自的 UI 报错）。 */
export async function flushExcalidrawSessions(
  knowledgeBaseId: string,
  relPath: string
): Promise<void> {
  const bucket = sessions.get(excalidrawSessionKey(knowledgeBaseId, relPath))
  if (!bucket) return
  for (const handle of [...bucket]) {
    try {
      await handle.settle()
    } catch {
      // 单个会话写失败不应阻断复制；调用方之后会读到磁盘上的最新内容
    }
  }
}
