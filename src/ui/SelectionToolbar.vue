<script setup lang="ts">
import AppIcon from './AppIcon.vue'
import type { InlineFormat } from '@tnotesjs/mindmap-core'
import { altShortcut, primaryShortcut } from './platform'

defineProps<{
  mode: 'text' | 'nodes'
  position: { left: number; top: number }
  activeFormats?: Partial<Record<InlineFormat, boolean>>
}>()

const emit = defineEmits<{
  format: [format: InlineFormat]
  task: []
  image: []
  link: []
  copy: []
  clear: []
  delete: []
}>()

const formats: Array<{ id: InlineFormat; text: string; label: string }> = [
  { id: 'bold', text: 'B', label: `加粗 (${primaryShortcut('B')})` },
  { id: 'italic', text: 'I', label: `斜体 (${primaryShortcut('I')})` },
  { id: 'underline', text: 'U', label: `下划线 (${primaryShortcut('U')})` },
  { id: 'strike', text: 'S', label: `删除线 (${primaryShortcut('Enter')})` },
  { id: 'highlight', text: '▰', label: '高亮' },
]
</script>

<template>
  <Teleport to="body">
    <div
      class="selection-toolbar"
      :style="{ left: `${position.left}px`, top: `${position.top}px` }"
      role="toolbar"
      :aria-label="mode === 'text' ? '文字格式工具栏' : '多主题工具栏'"
      @pointerdown.prevent
    >
      <button
        v-for="item in formats"
        :key="item.id"
        type="button"
        class="format-button"
        :class="[{ active: activeFormats?.[item.id] }, `is-${item.id}`]"
        :title="item.label"
        :aria-label="item.label"
        @click="emit('format', item.id)"
      >
        <AppIcon v-if="item.id === 'highlight'" name="highlight" :size="21" />
        <template v-else>{{ item.text }}</template>
      </button>
      <span class="toolbar-divider" />
      <button type="button" class="tool-button" :title="`添加/取消待办 (${primaryShortcut('L', { shift: true })})`" aria-label="添加或取消待办" @click="emit('task')">
        <AppIcon name="check" :size="20" />
      </button>
      <template v-if="mode === 'text'">
        <button type="button" class="tool-button" :title="`添加图片 (${altShortcut('Enter')})`" aria-label="添加图片" @click="emit('image')"><AppIcon name="image" :size="20" /></button>
        <button type="button" class="tool-button" :title="`添加链接 (${primaryShortcut('K')})`" aria-label="添加链接" @click="emit('link')"><AppIcon name="link" :size="20" /></button>
        <button type="button" class="tool-button code-button" :title="`行内代码 (${altShortcut('L')})`" aria-label="行内代码" @click="emit('format', 'code')">&lt;/&gt;</button>
      </template>
      <button v-else type="button" class="tool-button" :title="`复制 (${primaryShortcut('C')})`" aria-label="复制所选主题" @click="emit('copy')"><AppIcon name="copy" :size="20" /></button>
      <span class="toolbar-divider" />
      <button type="button" class="tool-button" :title="`清除样式 (${primaryShortcut('\\')})`" aria-label="清除样式" @click="emit('clear')"><AppIcon name="clearFormat" :size="20" /></button>
      <button type="button" class="tool-button danger" :title="`删除 (${primaryShortcut('D', { shift: true })})`" aria-label="删除" @click="emit('delete')"><AppIcon name="trash" :size="20" /></button>
    </div>
  </Teleport>
</template>

<style scoped>
.selection-toolbar {
  position: fixed;
  z-index: 120;
  display: flex;
  align-items: center;
  gap: 2px;
  min-height: 46px;
  padding: 5px 7px;
  border: 1px solid color-mix(in srgb, var(--mm-border) 85%, transparent);
  border-radius: 11px;
  background: color-mix(in srgb, var(--mm-panel-bg) 94%, #545760 6%);
  color: var(--mm-text);
  box-shadow: 0 10px 30px rgb(0 0 0 / .24);
  transform: translate(-50%, -100%);
}
.format-button, .tool-button {
  display: inline-flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 21px;
}
.format-button:hover, .tool-button:hover, .format-button.active { background: var(--mm-hover); color: var(--mm-accent); }
.format-button.is-bold { font-weight: 800; }
.format-button.is-italic { font-family: Georgia, serif; font-style: italic; }
.format-button.is-underline { text-decoration: underline; text-underline-offset: 4px; }
.format-button.is-strike { text-decoration: line-through; }
.format-button.is-highlight { color: #d3c900; }
.tool-button.code-button { font-family: ui-monospace, monospace; font-size: 15px; font-weight: 700; }
.tool-button.danger { color: #e14f5b; }
.toolbar-divider { width: 1px; height: 25px; margin: 0 3px; background: var(--mm-border); }
</style>
