<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import type { MarkdownDiagnostic } from '@tnotesjs/mindmap-core'

const props = withDefaults(defineProps<{ modelValue: string; diagnostics?: readonly MarkdownDiagnostic[] }>(), {
  diagnostics: () => [],
})
const emit = defineEmits<{
  'update:modelValue': [value: string]
  pasteImage: [blob: Blob, selectionStart: number, selectionEnd: number]
}>()

const draft = ref(props.modelValue)
const textarea = ref<HTMLTextAreaElement>()
let timer: ReturnType<typeof setTimeout> | null = null
let typing = false

watch(
  () => props.modelValue,
  (md) => {
    // 正在输入时不打断用户，输入停顿后由其它视图变更回流
    if (!typing) draft.value = md
  },
)

function onInput(e: Event) {
  const value = (e.target as HTMLTextAreaElement).value
  draft.value = value
  typing = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    typing = false
    emit('update:modelValue', value)
  }, 300)
}

function flushDraft() {
  if (!typing) return
  if (timer) clearTimeout(timer)
  timer = null
  typing = false
  emit('update:modelValue', draft.value)
}

function goToDiagnostic(item: MarkdownDiagnostic) {
  const input = textarea.value
  if (!input) return
  const lines = draft.value.split(/\r?\n/)
  let offset = 0
  for (let i = 0; i < item.line - 1; i++) offset += (lines[i]?.length ?? 0) + 1
  const start = Math.min(draft.value.length, offset + Math.max(0, item.column - 1))
  input.focus()
  input.setSelectionRange(start, Math.min(draft.value.length, start + 1))
}

function selectAllFromHost(): void {
  const input = textarea.value
  if (!input) return
  input.focus()
  input.setSelectionRange(0, input.value.length)
}

defineExpose({ selectAllFromHost })

function onPaste(e: ClipboardEvent) {
  const image = [...(e.clipboardData?.items ?? [])]
    .find((item) => item.kind === 'file' && item.type.startsWith('image/'))
    ?.getAsFile()
  if (!image) return
  e.preventDefault()
  const input = e.currentTarget as HTMLTextAreaElement
  draft.value = input.value
  flushDraft()
  emit('pasteImage', image, input.selectionStart, input.selectionEnd)
}

onBeforeUnmount(() => {
  flushDraft()
})
</script>

<template>
  <div class="markdown-view">
    <div v-if="diagnostics.length > 0" class="source-diagnostics" role="alert">
      <div class="diagnostic-title">源码格式不合法；修复前只能停留在源码视图</div>
      <button
        v-for="(item, index) in diagnostics"
        :key="`${item.line}:${item.column}:${item.code}:${index}`"
        class="diagnostic-item"
        type="button"
        @click="goToDiagnostic(item)"
      >
        第 {{ item.line }} 行，第 {{ item.column }} 列：{{ item.message }}
      </button>
    </div>
    <textarea
      ref="textarea"
      class="md-textarea"
      :value="draft"
      spellcheck="false"
      placeholder="# 根节点&#10;&#10;- 子节点&#10;  - 孙节点"
      @input="onInput"
      @paste="onPaste"
    />
  </div>
</template>

<style scoped>
.markdown-view {
  height: 100%;
  background: var(--mm-panel-bg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.source-diagnostics {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 34%;
  overflow: auto;
  padding: 10px 16px;
  border-bottom: 1px solid rgb(207 76 76 / 0.28);
  background: rgb(207 76 76 / 0.08);
}
.diagnostic-title {
  color: #b33b3b;
  font-size: 13px;
  font-weight: 650;
}
.diagnostic-item {
  width: fit-content;
  max-width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--mm-text);
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}
.diagnostic-item:hover {
  color: #b33b3b;
  text-decoration: underline;
}
.md-textarea {
  flex: 1;
  resize: none;
  border: none;
  outline: none;
  padding: 16px 20px;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.7;
  background: transparent;
  color: var(--mm-text);
  /* Nested under ProseMirror.virtual-cursor-enabled (caret-color: transparent). */
  caret-color: var(--mm-accent, var(--mm-text, #3b82f6));
  min-height: 0;
}
</style>
