/**
 * 打开中的画布会话登记表（按知识库 + 路径）。
 *
 * 用途：跨笔记复制前必须先 flush 源画布，否则复制到的是过时的磁盘内容
 * （计划 E7）。标签页与内嵌卡片都通过 `canvasController` 注册，所以这里
 * 一处登记就覆盖两种入口。
 */
export interface ExcalidrawSessionHandle {
  /** flush 并等到真的写完 */
  settle(): Promise<void>
}

const sessions = new Map<string, Set<ExcalidrawSessionHandle>>()

export function excalidrawSessionKey(knowledgeBaseId: string, relPath: string): string {
  return `${knowledgeBaseId}\u0000${relPath}`
}

export function registerExcalidrawSession(
  knowledgeBaseId: string,
  relPath: string,
  handle: ExcalidrawSessionHandle
): () => void {
  const key = excalidrawSessionKey(knowledgeBaseId, relPath)
  const bucket = sessions.get(key) ?? new Set<ExcalidrawSessionHandle>()
  bucket.add(handle)
  sessions.set(key, bucket)
  return () => {
    const current = sessions.get(key)
    if (!current) return
    current.delete(handle)
    if (current.size === 0) sessions.delete(key)
  }
}

/** 该文件是否有打开中的会话（含未写完内容）。 */
export function hasExcalidrawSession(knowledgeBaseId: string, relPath: string): boolean {
  return (sessions.get(excalidrawSessionKey(knowledgeBaseId, relPath))?.size ?? 0) > 0
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
