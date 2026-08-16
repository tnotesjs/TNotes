<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { MindmapEditor, MindmapNode } from '../engine'

const props = defineProps<{
  editor: MindmapEditor | null
  visible: boolean
  version: number
}>()

const emit = defineEmits<{ close: [] }>()

const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement>()

const matches = computed<MindmapNode[]>(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- 依赖 version 驱动重算
  props.version
  if (!props.editor || !query.value.trim()) return []
  return props.editor.document.search(query.value)
})

watch([query, matches], () => {
  activeIndex.value = 0
  const ed = props.editor
  if (!ed) return
  ed.setMatchHighlight(new Set(matches.value.map((n) => n.id)))
  if (matches.value.length > 0) {
    ed.centerOnNode(matches.value[0].id, false)
  }
})

watch(
  () => props.visible,
  (v) => {
    if (v) {
      nextTick(() => inputRef.value?.focus())
    } else {
      query.value = ''
      props.editor?.setMatchHighlight(new Set())
    }
  },
)

function step(dir: 1 | -1) {
  const list = matches.value
  if (list.length === 0) return
  activeIndex.value = (activeIndex.value + dir + list.length) % list.length
  props.editor?.centerOnNode(list[activeIndex.value].id, false)
}

function onKeydown(e: KeyboardEvent) {
  e.stopPropagation()
  if (e.key === 'Enter') {
    e.preventDefault()
    step(e.shiftKey ? -1 : 1)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
  }
}
</script>

<template>
  <div v-if="visible" class="search-bar" @keydown="onKeydown">
    <input ref="inputRef" v-model="query" class="search-input" placeholder="搜索节点文本…" />
    <span class="search-count">{{ matches.length > 0 ? `${activeIndex + 1} / ${matches.length}` : query ? '0 / 0' : '' }}</span>
    <button class="search-btn" title="上一个 (Shift+Enter)" @click="step(-1)">↑</button>
    <button class="search-btn" title="下一个 (Enter)" @click="step(1)">↓</button>
    <button class="search-btn" title="关闭 (Esc)" @click="emit('close')">×</button>
  </div>
</template>

<style scoped>
.search-bar {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 8px;
  background: var(--mm-panel-bg);
  border: 1px solid var(--mm-border);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.12);
}
.search-input {
  width: 200px;
  font-size: 13px;
  padding: 4px 8px;
  border: 1px solid var(--mm-border);
  border-radius: 6px;
  outline: none;
  background: var(--mm-canvas-bg);
  color: var(--mm-text);
}
.search-input:focus {
  border-color: var(--mm-accent);
}
.search-count {
  font-size: 12px;
  color: var(--mm-text-dim);
  min-width: 44px;
  text-align: center;
  user-select: none;
}
.search-btn {
  border: none;
  background: transparent;
  color: var(--mm-text-dim);
  cursor: pointer;
  font-size: 13px;
  padding: 2px 6px;
  border-radius: 4px;
}
.search-btn:hover {
  background: var(--mm-hover);
  color: var(--mm-text);
}
</style>
