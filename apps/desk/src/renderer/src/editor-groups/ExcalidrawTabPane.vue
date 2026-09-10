<script setup lang="ts">
/**
 * 画布源文件标签页（计划 E4）。
 *
 * - 直接进入编辑状态，通过 E3 的会话与宿主接管写入；本机不出现第二个会话
 * - 文件缺失/损坏/被回收时只显示失效状态，**不按旧路径自动重建**空画布
 * - 失焦（切到别的标签）与卸载时立即 flush，未写完的内容不丢
 * - 内容变化自动落盘，没有保存按钮；失败/冲突在状态条上给出原因与重试
 * - 关闭/退出把本标签注册成 ClosingResource：先 flush，写入真的失败才让用户
 *   选择重试（保存）或丢弃本地修改
 */
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'

import { useEditorStore } from '../stores/editor'
import { registerExcalidrawCloseHandler } from '../stores/workspace/excalidrawCloseRegistry'

import type { ExcalidrawEditorTab as ExcalidrawTab } from '../../../shared/contracts'
import type { ExcalidrawSession } from '@tnotesjs/ui/excalidraw-editor'

const props = defineProps<{ tab: ExcalidrawTab; active: boolean; groupId: string }>()

/**
 * 官方字体基址。主进程的 `tnotes-asset://app/` 路由只暴露 `out/renderer`，
 * 字体在构建时复制到 `out/renderer/excalidraw/fonts`（见 electron.vite.config.ts）。
 * 不设置的话 Excalidraw 会去 esm.sh 取字体，被 CSP 拦掉并回退字体。
 */
const EXCALIDRAW_FONT_BASE = 'tnotes-asset://app/excalidraw/'

const editor = useEditorStore()
const phase = ref<'loading' | 'ready' | 'invalid' | 'error'>('loading')
const message = ref('')
const notice = ref('')
const state = ref<'idle' | 'pending' | 'writing' | 'failed' | 'conflict'>('idle')
const lastError = ref('')
const hostRef = ref<HTMLDivElement | null>(null)
const mountRef = ref<HTMLDivElement | null>(null)

let host: { transferTo: () => void; destroy: () => void } | null = null
const session = shallowRef<ExcalidrawSession | null>(null)
let disposed = false
/** 用户已明确丢弃本地修改：会话销毁后不得再写盘 */
let abandoned = false
/** 挂载后的第一次 onChange 是「规范化」而不是编辑，已按基线处理 */
let baselineAdopted = false
/** 用户是否已经碰过画布（指针/键盘/粘贴/滚轮） */
let interacted = false

/** 第一次真实交互之后，onChange 才可以当作编辑。 */
function markInteracted(): void {
  interacted = true
}

/** 内存里还有没写进磁盘的内容（进行中、待写、失败或冲突都算）。 */
function isUnsaved(): boolean {
  const current = session.value
  if (abandoned || !current) return false
  return current.hasPending() || current.state.value !== 'idle'
}

/** 把 dirty / invalid 报给标签：标签点与关闭流程都依赖这两个标记。 */
function syncTabState(): void {
  editor.updateExcalidrawTabMeta(props.tab.id, {
    dirty: isUnsaved(),
    invalid: phase.value === 'invalid'
  })
}

function markInvalid(reason: string): void {
  phase.value = 'invalid'
  message.value = reason
  notice.value = ''
  // 文件已经不在原路径：立刻停止写入，避免按旧路径把文件重建出来
  session.value?.dispose()
  session.value = null
  syncTabState()
}

async function boot(): Promise<void> {
  const response = await window.desk.excalidraw.read({
    knowledgeBaseId: props.tab.knowledgeBaseId,
    relPath: props.tab.relPath
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
  if (!hostRef.value || !mountRef.value) return

  const { createExcalidrawSession, loadExcalidrawHost } =
    await import('@tnotesjs/ui/excalidraw-editor')
  const { mountExcalidrawHost } = await loadExcalidrawHost()
  if (disposed || !hostRef.value || !mountRef.value) return

  // 重开（改名后修复失效状态）时先丢掉旧会话与旧宿主，避免两个实例并存
  session.value?.dispose()
  host?.destroy()
  host = null
  abandoned = false
  baselineAdopted = false
  interacted = false
  // container 是稳定的承载容器（标签页内），mountPoint 是被搬运的节点本身：
  // 两者不能是同一个元素，否则「移回原位」会变成把元素 append 到自己身上
  const container = hostRef.value
  const mountPoint = mountRef.value
  if (!mountPoint) return
  // 重开时旧宿主已销毁，但 React 可能还留着上次的根节点
  mountPoint.replaceChildren()

  session.value = createExcalidrawSession({
    initialContent: response.value.content,
    initialRevision: response.value.revision,
    save: async ({ content, expectedRevision }) => {
      const result = await window.desk.excalidraw.write({
        knowledgeBaseId: props.tab.knowledgeBaseId,
        relPath: props.tab.relPath,
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

  const mounted = mountExcalidrawHost({
    host: mountPoint,
    content: response.value.content,
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    fontBase: EXCALIDRAW_FONT_BASE,
    onChange: (content: string) => {
      // Excalidraw 载入磁盘场景后会把字段补齐（groupIds/roundness/gridSize…），
      // 挂载后的第一次回调就是这份规范化结果。用户还没碰过画布，说明不是编辑：
      // 把它当新基线（adopt），否则「只读打开」也会回写一份规范化副本。
      if (!baselineAdopted && !interacted) {
        baselineAdopted = true
        session.value?.adopt(content)
        return
      }
      baselineAdopted = true
      session.value?.update(content)
    }
  })
  host = {
    transferTo: () => mounted.transferTo(container),
    destroy: mounted.destroy
  }
  phase.value = 'ready'
  syncTabState()
}

// 会话状态 → 面板状态 + 标签 dirty 点；写入失败/冲突保留内容，只有重试或丢弃才结束
watch(
  () => session.value?.state.value,
  (next) => {
    state.value = (next ?? 'idle') as typeof state.value
    lastError.value = session.value?.lastError.value ?? ''
    syncTabState()
  },
  { immediate: true }
)
watch(
  () => session.value?.lastError.value,
  (next) => {
    lastError.value = next ?? ''
  }
)

/**
 * 标签重新可见时确认磁盘上还是原来那个文件：外部改名/删除后只报失效。
 * 有未写入内容时不在这里抢修——那条路径由写入冲突给出准确原因。
 */
async function revalidate(): Promise<void> {
  if (disposed || abandoned || phase.value !== 'ready') return
  const response = await window.desk.excalidraw.read({
    knowledgeBaseId: props.tab.knowledgeBaseId,
    relPath: props.tab.relPath
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
  // 磁盘被别的入口改过：本地还有未写入内容时保持现状，让写入冲突去报告
  const current = session.value
  if (!isUnsaved() && current && response.value.revision !== current.revision.value) {
    notice.value = '磁盘上的画布已被其他入口修改，重新打开标签可载入最新内容'
  } else {
    notice.value = ''
  }
}

function registerCloseHandler(): void {
  /** flush 之后还要等真的写完：写入是 IPC，正在进行的那次不能算已落盘 */
  const settle = async (): Promise<void> => {
    await session.value?.flush()
    while (session.value?.state.value === 'writing') {
      await new Promise((resolve) => setTimeout(resolve, 25))
    }
  }
  registerExcalidrawCloseHandler(props.tab.id, {
    key: `excalidraw:${props.tab.id}`,
    title: props.tab.title,
    dirty: isUnsaved,
    saving: () => session.value?.state.value === 'writing',
    pauseAutosave: () => () => undefined,
    waitForSave: settle,
    save: async () => {
      await settle()
      if (isUnsaved()) throw new Error(session.value?.lastError.value || '画布仍有未写入的更改')
    },
    discard: async () => {
      abandoned = true
      session.value?.dispose()
      session.value = null
      notice.value = '已丢弃未写入的本地修改'
      syncTabState()
    }
  })
}

onMounted(() => {
  registerCloseHandler()
  // 用户碰过画布之后，onChange 才能当成编辑（挂载首帧的规范化另有处理）
  const interactiveEvents = ['pointerdown', 'keydown', 'paste', 'cut', 'drop', 'wheel']
  for (const type of interactiveEvents) {
    hostRef.value?.addEventListener(type, markInteracted, { capture: true, passive: true })
  }
  void boot()
})

// 标签可见 = 它是本组当前标签，且本组是当前分栏
const visible = computed(() => props.active && editor.activeGroupId === props.groupId)

watch(visible, async (now, before) => {
  if (now && !before && host && hostRef.value) {
    // 回到这个标签：不重建实例，只把承载节点接回并重建键盘焦点
    host.transferTo()
  }
  if (before && !now) await session.value?.flush()
  if (now && !before) await revalidate()
})

// 资源面板重命名画布后标签身份跟着换路径：内容没变，会话继续用，只重注册标题
watch(
  () => props.tab.relPath,
  async (next, previous) => {
    if (next === previous) return
    registerCloseHandler()
    if (phase.value === 'invalid') {
      phase.value = 'loading'
      message.value = ''
      notice.value = ''
      await boot()
    }
  }
)

// 文件被移入回收区/合并：store 置 invalid，这里同步停止写入
watch(
  () => props.tab.invalid,
  (invalid) => {
    if (invalid && phase.value !== 'invalid') markInvalid('画布文件已不在原路径，已停止写入')
  }
)

onBeforeUnmount(() => {
  disposed = true
  void session.value?.flush()
  session.value?.dispose()
  session.value = null
  host?.destroy()
  host = null
})

async function retry(): Promise<void> {
  await session.value?.retry()
}
</script>

<template>
  <section class="excalidraw-pane">
    <header class="pane-header">
      <div>
        <strong>{{ tab.title }}</strong>
        <span class="path">{{ tab.relPath }}</span>
      </div>
      <div class="pane-status" :data-state="state">
        <span v-if="state === 'writing'">写入中…</span>
        <span v-else-if="state === 'pending'">待写入…</span>
        <span v-else-if="state === 'failed'">写入失败：{{ lastError }}</span>
        <span v-else-if="state === 'conflict'">磁盘已被外部修改：{{ lastError }}</span>
        <span v-else>已自动保存</span>
        <button v-if="state === 'failed'" type="button" @click="retry">重试</button>
      </div>
    </header>
    <p v-if="notice" class="pane-notice">{{ notice }}</p>
    <!-- 承载容器必须一直有确定高度：挂载时若被 hidden，Excalidraw 会把画布算成 0 高 -->
    <div ref="hostRef" class="excalidraw-host">
      <!-- 被搬运的是这个挂载点；template 里的节点才带 scoped 样式标记 -->
      <div ref="mountRef" class="excalidraw-mount"></div>
    </div>
    <div v-if="phase === 'loading'" class="pane-placeholder">画布加载中…</div>
    <div v-else-if="phase !== 'ready'" class="pane-placeholder" role="alert">
      <strong>无法打开画布</strong>
      <span>{{ message }}</span>
    </div>
  </section>
</template>

<style scoped>
.excalidraw-pane {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 12px;
  border-bottom: 1px solid var(--tn-border, #3c3c3c);
}
.pane-header .path {
  margin-left: 8px;
  font-size: 12px;
  color: var(--tn-muted, #9a9a9a);
}
.pane-notice {
  margin: 0;
  padding: 4px 12px;
  font-size: 12px;
  color: var(--tn-muted, #9a9a9a);
  border-bottom: 1px solid var(--tn-border, #3c3c3c);
}
.pane-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--tn-muted, #9a9a9a);
}
.pane-status[data-state='failed'],
.pane-status[data-state='conflict'] {
  color: var(--tn-danger, #f48771);
}
.excalidraw-host {
  position: relative;
  flex: 1;
  min-height: 0;
}
/* 被搬运的挂载点：绝对定位撑满容器，交接回来时仍有确定高度 */
.excalidraw-mount {
  position: absolute;
  inset: 0;
}
.pane-placeholder {
  /* 覆盖在承载容器之上：容器需要始终保持真实高度，不能靠 hidden 隐藏 */
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  background: var(--editor-bg, #1e1e1e);
  color: var(--tn-muted, #9a9a9a);
}
</style>
