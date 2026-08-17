<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const draft = ref(props.modelValue)
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

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div class="markdown-view">
    <textarea
      class="md-textarea"
      :value="draft"
      spellcheck="false"
      placeholder="# 根节点&#10;&#10;- 子节点&#10;  - 孙节点"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
.markdown-view {
  height: 100%;
  background: var(--mm-panel-bg);
  overflow: hidden;
  display: flex;
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
}
</style>
