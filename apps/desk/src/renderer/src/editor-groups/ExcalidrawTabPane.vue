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
 *
 * 读写行为全部交给 `createExcalidrawCanvasController`（与笔记内嵌卡片共用）。
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { startCanvasDerivedSync } from '../editor/excalidraw/canvasImage'
import { createExcalidrawCanvasController } from '../editor/excalidraw/canvasController'
import { useEditorStore } from '../stores/editor'
import { registerExcalidrawCloseHandler } from '../stores/workspace/excalidrawCloseRegistry'

import type { ExcalidrawEditorTab as ExcalidrawTab } from '../../../shared/contracts'

const props = defineProps<{ tab: ExcalidrawTab; active: boolean; groupId: string }>()

const editor = useEditorStore()
const hostRef = ref<HTMLDivElement | null>(null)

const controller = createExcalidrawCanvasController({
  knowledgeBaseId: () => props.tab.knowledgeBaseId,
  relPath: () => props.tab.relPath,
  container: () => hostRef.value,
  onDirtyChange: (dirty) => {
    editor.updateExcalidrawTabMeta(props.tab.id, { dirty })
  },
  onInvalid: () => {
    editor.updateExcalidrawTabMeta(props.tab.id, { invalid: true })
  }
})

const { phase, message, notice, state, lastError } = controller

function registerCloseHandler(): void {
  registerExcalidrawCloseHandler(props.tab.id, {
    key: `excalidraw:${props.tab.id}`,
    title: props.tab.title,
    dirty: controller.isUnsaved,
    saving: () => state.value === 'writing',
    pauseAutosave: () => () => undefined,
    waitForSave: controller.settle,
    save: async () => {
      await controller.settle()
      if (controller.isUnsaved()) {
        throw new Error(lastError.value || '画布仍有未写入的更改')
      }
    },
    discard: async () => {
      controller.discard()
    }
  })
}

/**
 * 派生图实时同步：编辑期间笔记里那张 `.svg` 跟着变（内存预览 + 节流写盘）。
 * 与画布会话同生命周期 —— 卸载时会把最后一笔落盘。
 */
let stopDerivedSync: (() => void) | null = null

onMounted(() => {
  registerCloseHandler()
  stopDerivedSync = startCanvasDerivedSync(props.tab.knowledgeBaseId, props.tab.relPath)
  void controller.boot()
})

// 标签可见 = 它是本组当前标签，且本组是当前分栏
const visible = computed(() => props.active && editor.activeGroupId === props.groupId)

watch(
  visible,
  async (now, before) => {
    if (now && !before) {
      // 回到这个标签：不重建实例，只把承载节点接回并重建键盘焦点
      controller.transferTo()
    }
    if (before && !now) await controller.flush()
    if (now && !before) await controller.revalidate()
  },
  // flush: 'post'——必须等 v-show 真的把面板显示出来再 focus，
  // 否则 focus() 作用在 display:none 的元素上会静默失败（焦点留在 body，快捷键收不到）
  { flush: 'post' }
)

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
      await controller.boot()
    }
  }
)

// 文件被移入回收区/合并：store 置 invalid，这里同步停止写入
watch(
  () => props.tab.invalid,
  (invalid) => {
    if (invalid && phase.value !== 'invalid') {
      controller.discard()
      phase.value = 'invalid'
      message.value = '画布文件已不在原路径，已停止写入'
      notice.value = ''
    }
  }
)

onBeforeUnmount(() => {
  stopDerivedSync?.()
  stopDerivedSync = null
  controller.destroy()
})
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
        <button v-if="state === 'failed'" type="button" @click="controller.retry">重试</button>
      </div>
    </header>
    <p v-if="notice" class="pane-notice">{{ notice }}</p>
    <!-- 承载容器必须一直有确定高度：挂载时若被 hidden，Excalidraw 会把画布算成 0 高 -->
    <div ref="hostRef" class="excalidraw-host"></div>
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
