<script setup lang="ts">
/**
 * 画布源文件标签页（计划 E4）。
 *
 * - 直接进入编辑状态，通过 E3 的会话与宿主接管写入；本机不出现第二个会话
 * - 文件缺失/损坏时只显示失效状态，**不按旧路径自动重建**空画布
 * - 失焦（切到别的标签）与卸载时立即 flush，未写完的内容不丢
 * - 内容变化自动落盘，没有保存按钮；失败/冲突在状态条上给出原因与重试
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { ExcalidrawEditorTab as ExcalidrawTab } from '../../../shared/contracts'

const props = defineProps<{ tab: ExcalidrawTab; active: boolean }>()

const phase = ref<'loading' | 'ready' | 'invalid' | 'error'>('loading')
const message = ref('')
const state = ref<'idle' | 'pending' | 'writing' | 'failed' | 'conflict'>('idle')
const lastError = ref('')
const hostRef = ref<HTMLDivElement | null>(null)

let host: { transferTo: (target: HTMLElement) => void; destroy: () => void } | null = null
let session: {
  state: { value: string }
  lastError: { value: string }
  update(content: string): void
  flush(): Promise<void>
  retry(): Promise<void>
  dispose(): void
  currentContent(): string
} | null = null
let disposed = false

async function boot(): Promise<void> {
  const response = await window.desk.excalidraw.read({
    knowledgeBaseId: props.tab.knowledgeBaseId,
    relPath: props.tab.relPath
  })
  if (disposed) return
  if (!response.ok) {
    phase.value = 'invalid'
    message.value = response.error.message
    return
  }
  if (!response.value.valid) {
    // 损坏内容只报告：宿主不得修复后覆盖原件
    phase.value = 'invalid'
    message.value = '画布内容不是合法的 Excalidraw 场景，已停止写入'
    return
  }
  if (!hostRef.value) return

  const { createExcalidrawSession, loadExcalidrawHost } =
    await import('@tnotesjs/ui/excalidraw-editor')
  const { mountExcalidrawHost } = await loadExcalidrawHost()
  if (disposed || !hostRef.value) return

  session = createExcalidrawSession({
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
  watch(
    () => session?.state.value,
    (next) => {
      state.value = (next ?? 'idle') as typeof state.value
      lastError.value = session?.lastError.value ?? ''
    },
    { immediate: true }
  )
  watch(
    () => session?.lastError.value,
    (next) => {
      lastError.value = next ?? ''
    }
  )

  const mounted = mountExcalidrawHost({
    host: hostRef.value,
    content: response.value.content,
    theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    onChange: (content: string) => session?.update(content)
  })
  host = {
    transferTo: mounted.transferTo,
    destroy: mounted.destroy
  }
  phase.value = 'ready'
}

onMounted(() => {
  void boot()
})

watch(
  () => props.active,
  async (active, wasActive) => {
    if (!wasActive && active && host && hostRef.value) {
      // 回到这个标签：不重建实例，只把承载节点接回并重建键盘焦点
      host.transferTo(hostRef.value)
    }
    if (wasActive && !active) await session?.flush()
  }
)

onBeforeUnmount(() => {
  disposed = true
  void session?.flush()
  session?.dispose()
  session = null
  host?.destroy()
  host = null
})

async function retry(): Promise<void> {
  await session?.retry()
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
    <div ref="hostRef" class="excalidraw-host" :hidden="phase !== 'ready'"></div>
    <div v-if="phase === 'loading'" class="pane-placeholder">画布加载中…</div>
    <div v-else-if="phase !== 'ready'" class="pane-placeholder" role="alert">
      <strong>无法打开画布</strong>
      <span>{{ message }}</span>
    </div>
  </section>
</template>

<style scoped>
.excalidraw-pane {
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
.pane-placeholder {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  color: var(--tn-muted, #9a9a9a);
}
</style>
