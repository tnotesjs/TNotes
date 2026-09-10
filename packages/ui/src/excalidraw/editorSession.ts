/**
 * 画布编辑会话（宿主无关）。
 *
 * 计划 E3 的硬约束：
 * - 内容变化自动写盘，无保存按钮；连续变化合并（200ms）但有最大等待上限（1s），
 *   避免一直拖动手势导致永不落盘
 * - 写入严格有序：同一文件的写请求串行；旧完成的回调不能清掉更新的状态
 * - 没有手动保存流程，但必须有 pending/writing/failed/conflict 状态，
 *   失败时保留最新内存场景，不能显示成"已持久化"
 * - 只有真正需要持久化的内容变化才触发写入（平移/缩放/选中不算）
 */
import { ref, type Ref } from 'vue'

import { parseExcalidrawScene } from './scene'

export type ExcalidrawWriteState = 'idle' | 'pending' | 'writing' | 'failed' | 'conflict'

export interface ExcalidrawSaveInput {
  content: string
  expectedRevision: string
}

export type ExcalidrawSaveResult =
  { ok: true; revision: string } | { ok: false; code: 'conflict' | 'error'; message: string }

export interface ExcalidrawSessionOptions {
  initialContent: string
  initialRevision: string
  save: (input: ExcalidrawSaveInput) => Promise<ExcalidrawSaveResult>
  debounceMs?: number
  maxWaitMs?: number
}

export interface ExcalidrawSession {
  state: Ref<ExcalidrawWriteState>
  lastError: Ref<string>
  revision: Ref<string>
  /** 编辑器内容变化回调（只在持久化内容真的变了时才调用） */
  update(content: string): void
  /** 立即写入：失去焦点、关闭入口、切换承载位置时调用 */
  flush(): Promise<void>
  /** 失败后重试（内容仍在内存里） */
  retry(): Promise<void>
  /**
   * 把一段内容当作「已持久化」的基线：丢弃待写队列、更新 revision。
   *
   * 用途：编辑器首帧会把磁盘场景规范化（补齐 groupIds/roundness/gridSize 等字段），
   * 那不是用户编辑，不能因此回写一份「规范化副本」；也可能用于放弃本地修改。
   */
  adopt(content: string, revision?: string): void
  currentContent(): string
  pendingContent(): string | null
  hasPending(): boolean
  dispose(): void
}

/**
 * 只有元素 / 内嵌文件 / 与文档语义有关的 appState 才算"需要持久化"。
 * 平移、缩放、选中、当前工具、滚动位置都属于展示状态，改了不该写盘。
 */
const PERSISTED_APP_STATE_KEYS = [
  'viewBackgroundColor',
  'gridSize',
  'currentItemFontFamily',
  'currentItemStrokeColor',
  'currentItemBackgroundColor',
  'currentItemFillStyle',
  'currentItemStrokeWidth',
  'currentItemRoughness',
  'currentItemOpacity',
  'name'
] as const

/** 提取用于比较的持久化指纹；解析失败时退回整串内容（保证坏数据也会被写回报告）。 */
export function persistedSceneSignature(content: string): string {
  const parsed = parseExcalidrawScene(content)
  if (!parsed.ok) return content
  const appState: Record<string, unknown> = {}
  for (const key of PERSISTED_APP_STATE_KEYS) {
    if (key in parsed.scene.appState) appState[key] = parsed.scene.appState[key]
  }
  return JSON.stringify({ elements: parsed.scene.elements, files: parsed.scene.files, appState })
}

export function createExcalidrawSession(options: ExcalidrawSessionOptions): ExcalidrawSession {
  const debounceMs = options.debounceMs ?? 200
  const maxWaitMs = options.maxWaitMs ?? 1000
  const state = ref<ExcalidrawWriteState>('idle')
  const lastError = ref('')
  const revision = ref(options.initialRevision)

  let savedSignature = persistedSceneSignature(options.initialContent)
  let savedContent = options.initialContent
  let queued: string | null = null
  let writing = false
  let writeAgain = false
  let disposed = false
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let maxTimer: ReturnType<typeof setTimeout> | null = null

  function clearTimers(): void {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (maxTimer) clearTimeout(maxTimer)
    debounceTimer = null
    maxTimer = null
  }

  function schedule(): void {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debounceTimer = null
      void flush()
    }, debounceMs)
    // 最大等待：连续编辑时至少每 maxWaitMs 落盘一次
    if (!maxTimer) {
      maxTimer = setTimeout(() => {
        maxTimer = null
        void flush()
      }, maxWaitMs)
    }
  }

  function update(content: string): void {
    if (disposed) return
    const signature = persistedSceneSignature(content)
    if (signature === savedSignature && queued === null) return // 展示状态变化，不写盘
    queued = content
    if (state.value !== 'writing') state.value = 'pending'
    schedule()
  }

  async function runWrite(): Promise<void> {
    if (writing || disposed) {
      if (writing) writeAgain = true
      return
    }
    const content = queued
    if (content === null) return
    if (persistedSceneSignature(content) === savedSignature) {
      queued = null
      state.value = 'idle'
      return
    }

    writing = true
    state.value = 'writing'
    const writingSignature = persistedSceneSignature(content)
    try {
      const result = await options.save({ content, expectedRevision: revision.value })
      if (disposed) return
      if (result.ok) {
        revision.value = result.revision
        savedContent = content
        savedSignature = writingSignature
        lastError.value = ''
        // 旧回调不能清掉更新的状态：只有当前队列就是刚写成功的内容才算干净
        if (queued !== null && persistedSceneSignature(queued) === writingSignature) {
          queued = null
        }
        state.value = queued === null ? 'idle' : 'pending'
      } else if (result.code === 'conflict') {
        state.value = 'conflict'
        lastError.value = result.message
      } else {
        state.value = 'failed'
        lastError.value = result.message
      }
    } catch (error) {
      if (!disposed) {
        state.value = 'failed'
        lastError.value = error instanceof Error ? error.message : String(error)
      }
    } finally {
      writing = false
      if (writeAgain) {
        writeAgain = false
        void runWrite()
      }
    }
  }

  async function flush(): Promise<void> {
    if (disposed) return
    clearTimers()
    await runWrite()
  }

  async function retry(): Promise<void> {
    if (disposed) return
    if (state.value === 'failed' && queued === null) queued = savedContent
    await flush()
  }

  function adopt(content: string, nextRevision?: string): void {
    if (disposed) return
    clearTimers()
    queued = null
    savedContent = content
    savedSignature = persistedSceneSignature(content)
    if (nextRevision !== undefined) revision.value = nextRevision
    lastError.value = ''
    state.value = 'idle'
  }

  function dispose(): void {
    disposed = true
    clearTimers()
    queued = null
  }

  return {
    state,
    lastError,
    revision,
    update,
    flush,
    retry,
    adopt,
    currentContent: () => queued ?? savedContent,
    pendingContent: () => queued,
    hasPending: () => queued !== null,
    dispose
  }
}
