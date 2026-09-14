/**
 * 画布编辑控制器（渲染端，宿主无关）。
 *
 * 标签页（E4）与笔记内嵌卡片（E5）需要完全同一套行为，因此把「读受限 IPC →
 * E3 会话 → 挂载编辑器宿主 → 自动写盘 → 失效检测 → 主题跟随 → flush/丢弃」
 * 抽到这里，两处只负责各自的 DOM 外壳与 UI。
 *
 * 关键约定（都由真实 Electron 端到端验证过）：
 * - 挂载点必须是被搬运的节点本身，承载容器是另一个稳定元素（否则交接时
 *   会 append 到自己身上）
 * - 承载容器挂载期间要有真实高度，不能 `hidden`（否则画布算成 0 高）
 * - 编辑器挂载后的第一次 onChange 是「规范化」，作为基线 adopt，不回写
 * - 交接后等布局就绪再重建键盘焦点
 * - 写入失败/冲突保留内存内容，只有重试或丢弃才结束
 */
import { ref, shallowRef, watch, type Ref } from 'vue'

import type { ExcalidrawSession, ExcalidrawWriteState } from '@tnotesjs/ui/excalidraw-editor'

import { notifyExcalidrawContent, registerExcalidrawSession } from './sessionRegistry'

/**
 * 官方字体基址。主进程的 `tnotes-asset://app/` 路由只暴露渲染端产物目录，
 * 字体在构建时复制到 `out/renderer/excalidraw/fonts`（见 electron.vite.config.ts）。
 * 不设置的话 Excalidraw 会去 esm.sh 取字体，被 CSP 拦掉并回退字体。
 */
export const EXCALIDRAW_FONT_BASE = 'tnotes-asset://app/excalidraw/'

/** 应用主题写在 `documentElement.dataset.theme`（见 App.vue applyAppearance）。 */
export function currentAppTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export type ExcalidrawCanvasPhase = 'loading' | 'ready' | 'invalid'

export interface ExcalidrawCanvasControllerOptions {
  knowledgeBaseId: () => string
  relPath: () => string
  /** 稳定的承载容器（控制器在内部创建可搬运的挂载点） */
  container: () => HTMLElement | null
  /** 覆盖主题来源；缺省跟随应用 `data-theme` */
  theme?: () => 'light' | 'dark'
  /** 跟随应用主题变化（默认 true） */
  followAppTheme?: boolean
  /** 脏状态变化（未写完/失败/冲突都算脏）；用于标签点或卡片状态条 */
  onDirtyChange?: (dirty: boolean) => void
  /** 文件缺失/损坏；宿主应停止任何「按旧路径重建」的动作 */
  onInvalid?: (message: string) => void
}

export interface ExcalidrawCanvasController {
  phase: Ref<ExcalidrawCanvasPhase>
  message: Ref<string>
  notice: Ref<string>
  state: Ref<ExcalidrawWriteState>
  lastError: Ref<string>
  isUnsaved(): boolean
  boot(): Promise<void>
  /** 重新可见时确认磁盘上还是原来那个文件 */
  revalidate(): Promise<void>
  flush(): Promise<void>
  /** flush 并等到真的写完（IPC 进行中的那次不能算已落盘） */
  settle(): Promise<void>
  retry(): Promise<void>
  /** 放弃本地修改：销毁会话，之后不得再写盘 */
  discard(): void
  setTheme(theme: 'light' | 'dark'): void
  /** 把承载节点接回容器并重建键盘焦点 */
  transferTo(): void
  focusCanvas(): void
  destroy(): void
}

export function createExcalidrawCanvasController(
  options: ExcalidrawCanvasControllerOptions
): ExcalidrawCanvasController {
  const phase = ref<ExcalidrawCanvasPhase>('loading')
  const message = ref('')
  const notice = ref('')
  const state = ref<ExcalidrawWriteState>('idle')
  const lastError = ref('')

  const session = shallowRef<ExcalidrawSession | null>(null)
  let host: {
    transferTo: (target: HTMLElement) => void
    focus: () => void
    setTheme: (theme: 'light' | 'dark') => void
    destroy: () => void
  } | null = null
  let mountPoint: HTMLDivElement | null = null
  let disposed = false
  let abandoned = false
  /** 挂载后的第一次 onChange 是「规范化」而不是编辑，已按基线处理 */
  let baselineAdopted = false
  /** 用户是否已经碰过画布（指针/键盘/粘贴/滚轮） */
  let interacted = false
  let themeObserver: MutationObserver | null = null
  let lastDirty: boolean | null = null
  let unregisterSession: (() => void) | null = null

  const readTheme = (): 'light' | 'dark' => options.theme?.() ?? currentAppTheme()

  function isUnsaved(): boolean {
    const current = session.value
    if (abandoned || !current) return false
    return current.hasPending() || current.state.value !== 'idle'
  }

  function syncDirty(): void {
    const dirty = isUnsaved()
    state.value = session.value?.state.value ?? 'idle'
    lastError.value = session.value?.lastError.value ?? ''
    if (dirty === lastDirty) return
    lastDirty = dirty
    options.onDirtyChange?.(dirty)
  }

  function markInvalid(reason: string): void {
    phase.value = 'invalid'
    message.value = reason
    notice.value = ''
    // 文件已经不在原路径：立刻停止写入，避免按旧路径把文件重建出来
    session.value?.dispose()
    session.value = null
    syncDirty()
    options.onInvalid?.(reason)
  }

  /** 用户碰过画布之后，onChange 才能当成编辑（挂载首帧的规范化另有处理） */
  function markInteracted(): void {
    interacted = true
  }

  // 会话状态是异步推进的（写入完成后自己回到 idle）：跟随它刷新状态条与脏标记
  watch(
    [() => session.value?.state.value, () => session.value?.lastError.value],
    () => syncDirty(),
    { immediate: true }
  )

  function bindInteraction(container: HTMLElement): void {
    const events = ['pointerdown', 'keydown', 'paste', 'cut', 'drop', 'wheel']
    for (const type of events) {
      container.addEventListener(type, markInteracted, { capture: true, passive: true })
    }
  }

  async function boot(): Promise<void> {
    const container = options.container()
    if (!container) return
    const response = await window.desk.excalidraw.read({
      knowledgeBaseId: options.knowledgeBaseId(),
      relPath: options.relPath()
    })
    if (disposed) return
    if (!response.ok) {
      markInvalid(response.error.message)
      return
    }
    if (!response.value.valid) {
      // 损坏内容只报告：宿主不得修复后覆盖原件
      markInvalid('画布内容不是合法的 Excalidraw 场景，已停止写入')
      return
    }

    const { createExcalidrawSession, loadExcalidrawHost } =
      await import('@tnotesjs/ui/excalidraw-editor')
    const { mountExcalidrawHost } = await loadExcalidrawHost()
    if (disposed) return

    // 重开（改名后修复失效状态）时先丢掉旧会话与旧宿主，避免两个实例并存
    session.value?.dispose()
    host?.destroy()
    host = null
    abandoned = false
    baselineAdopted = false
    interacted = false
    // 承载容器保持稳定；被搬运的是它内部的挂载点（两者不能是同一个元素）
    container.replaceChildren()
    mountPoint = document.createElement('div')
    mountPoint.className = 'excalidraw-mount'
    mountPoint.style.cssText = 'position:absolute;inset:0'
    container.append(mountPoint)
    bindInteraction(container)

    session.value = createExcalidrawSession({
      initialContent: response.value.content,
      initialRevision: response.value.revision,
      save: async ({ content, expectedRevision }) => {
        const result = await window.desk.excalidraw.write({
          knowledgeBaseId: options.knowledgeBaseId(),
          relPath: options.relPath(),
          content,
          expectedRevision
        })
        if (result.ok) return { ok: true as const, revision: result.value.revision }
        return {
          ok: false as const,
          code:
            result.error.code === 'REVISION_CONFLICT' ? ('conflict' as const) : ('error' as const),
          message: result.error.message
        }
      }
    })
    syncDirty()

    const mounted = mountExcalidrawHost({
      host: mountPoint,
      content: response.value.content,
      theme: readTheme(),
      fontBase: EXCALIDRAW_FONT_BASE,
      onChange: (content: string) => {
        // Excalidraw 载入磁盘场景后会把字段补齐（groupIds/roundness/gridSize…），
        // 挂载后的第一次回调就是这份规范化结果。用户还没碰过画布，说明不是编辑：
        // 把它当新基线（adopt），否则「只读打开」也会回写一份规范化副本。
        if (!baselineAdopted && !interacted) {
          baselineAdopted = true
          session.value?.adopt(content)
          notifyExcalidrawContent(options.knowledgeBaseId(), options.relPath(), content)
          syncDirty()
          return
        }
        baselineAdopted = true
        session.value?.update(content)
        // 笔记里那张派生图靠这条通知实时重绘（只读视图不碰磁盘）
        notifyExcalidrawContent(options.knowledgeBaseId(), options.relPath(), content)
        syncDirty()
      }
    })
    host = mounted

    if (options.followAppTheme !== false && typeof MutationObserver !== 'undefined') {
      themeObserver?.disconnect()
      themeObserver = new MutationObserver((changes) => {
        if (!changes.some((change) => change.attributeName === 'data-theme')) return
        host?.setTheme(readTheme())
      })
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      })
    }
    // 登记到会话表：跨笔记复制前会先把这里 settle 掉，避免复制到过时磁盘内容
    unregisterSession?.()
    unregisterSession = registerExcalidrawSession(options.knowledgeBaseId(), options.relPath(), {
      settle,
      currentContent: () => session.value?.currentContent() ?? ''
    })
    phase.value = 'ready'
    syncDirty()
  }

  /**
   * 重新可见时确认磁盘上还是原来那个文件：外部改名/删除后只报失效。
   * 有未写入内容时不在这里抢修——那条路径由写入冲突给出准确原因。
   */
  async function revalidate(): Promise<void> {
    if (disposed || abandoned || phase.value !== 'ready') return
    const response = await window.desk.excalidraw.read({
      knowledgeBaseId: options.knowledgeBaseId(),
      relPath: options.relPath()
    })
    if (disposed) return
    if (!response.ok) {
      markInvalid(`画布文件已不可用：${response.error.message}`)
      return
    }
    if (!response.value.valid) {
      markInvalid('画布内容不是合法的 Excalidraw 场景，已停止写入')
      return
    }
    const current = session.value
    if (!isUnsaved() && current && response.value.revision !== current.revision.value) {
      notice.value = '磁盘上的画布已被其他入口修改，重新打开可载入最新内容'
    } else {
      notice.value = ''
    }
  }

  async function settle(): Promise<void> {
    await session.value?.flush()
    while (session.value?.state.value === 'writing') {
      await new Promise((resolve) => setTimeout(resolve, 25))
    }
    syncDirty()
  }

  function discard(): void {
    abandoned = true
    session.value?.dispose()
    session.value = null
    notice.value = '已丢弃未写入的本地修改'
    syncDirty()
  }

  function destroy(): void {
    disposed = true
    unregisterSession?.()
    unregisterSession = null
    themeObserver?.disconnect()
    themeObserver = null
    void session.value?.flush()
    session.value?.dispose()
    session.value = null
    host?.destroy()
    host = null
    mountPoint = null
  }

  return {
    phase,
    message,
    notice,
    state,
    lastError,
    isUnsaved,
    boot,
    revalidate,
    flush: async () => {
      await session.value?.flush()
      syncDirty()
    },
    settle,
    retry: async () => {
      await session.value?.retry()
      syncDirty()
    },
    discard,
    setTheme: (theme) => host?.setTheme(theme),
    transferTo: () => {
      const container = options.container()
      if (host && container) host.transferTo(container)
    },
    focusCanvas: () => host?.focus(),
    destroy
  }
}
