<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MindmapEditor } from '../engine'

const props = withDefaults(defineProps<{ modelValue: string; fileName?: string }>(), {
  fileName: '未命名.tn-mindmap.md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  ready: [editor: MindmapEditor]
  warning: [message: string]
  requestSearch: []
  imagePreview: [src: string]
}>()

const host = ref<HTMLElement>()
let editor: MindmapEditor | null = null

onMounted(() => {
  editor = new MindmapEditor(host.value!, {
    markdown: props.modelValue,
    fileName: props.fileName,
  })
  editor.on('change', (md) => emit('update:modelValue', md))
  editor.on('warning', (msg) => emit('warning', msg))
  editor.on('requestSearch', () => emit('requestSearch'))
  editor.on('imagePreview', (src) => emit('imagePreview', src))
  emit('ready', editor)
})

watch(
  () => props.modelValue,
  (md) => {
    if (editor && md !== editor.getMarkdown()) {
      editor.setMarkdown(md)
    }
  },
)

onBeforeUnmount(() => {
  editor?.destroy()
  editor = null
})

defineExpose({
  getEditor: () => editor,
})
</script>

<template>
  <div ref="host" class="mindmap-editor-host" />
</template>

<style scoped>
.mindmap-editor-host {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  outline: none;
  background: var(--mm-canvas-bg);
}
</style>
