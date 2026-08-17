<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { CanvasEditor } from '../engine'
import type { MindmapSession } from '../engine'

const props = defineProps<{ session: MindmapSession }>()

const emit = defineEmits<{
  ready: [editor: CanvasEditor]
  requestSearch: []
  imagePreview: [src: string]
}>()

const host = ref<HTMLElement>()
let editor: CanvasEditor | null = null

onMounted(() => {
  editor = new CanvasEditor(host.value!, props.session, {
    onRequestSearch: () => emit('requestSearch'),
    onImagePreview: (src) => emit('imagePreview', src),
  })
  emit('ready', editor)
  // 切回脑图视图：居中当前选中节点（无选中则保持 zoomToFit）
  const sel = props.session.selectedNode
  if (sel) {
    requestAnimationFrame(() => editor?.centerOnNode(sel.id, false))
    setTimeout(() => editor?.centerOnNode(sel.id, false), 80)
  }
})

onBeforeUnmount(() => {
  editor?.destroy()
  editor = null
})
</script>

<template>
  <div ref="host" class="mindmap-view-host" />
</template>

<style scoped>
.mindmap-view-host {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
  background: var(--mm-canvas-bg);
}
</style>
