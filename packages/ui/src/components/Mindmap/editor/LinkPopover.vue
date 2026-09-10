<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import AppIcon from './AppIcon.vue'

const props = withDefaults(defineProps<{
  url: string
  position: { left: number; top: number }
  startEditing?: boolean
}>(), { startEditing: false })
const emit = defineEmits<{ save: [url: string]; remove: []; keep: []; leave: []; close: [] }>()
const draft = ref(props.url)
const editing = ref(props.startEditing)
const input = ref<HTMLInputElement>()

watch([() => props.url, () => props.startEditing], ([url, startEditing]) => {
  draft.value = url
  editing.value = startEditing
})

function submit() {
  const value = draft.value.trim()
  if (value) emit('save', value)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    submit()
  } else if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
  }
}

function beginEdit() {
  editing.value = true
  nextTick(() => {
    input.value?.focus()
    input.value?.select()
  })
}

function focusInput() { beginEdit() }
defineExpose({ focusInput })
</script>

<template>
  <div
      class="link-popover"
      :style="{ left: `${position.left}px`, top: `${position.top}px` }"
      @mouseenter="emit('keep')"
      @mouseleave="emit('leave')"
    >
      <input ref="input" v-model="draft" class="link-input" :class="{ readonly: !editing }" :readonly="!editing" aria-label="链接地址" @dblclick="beginEdit" @keydown="onKeydown" />
      <button v-if="editing" type="button" class="link-action primary" title="更新链接 (Enter)" aria-label="更新链接" @click="submit">更新</button>
      <button v-else type="button" class="icon-action" title="编辑链接地址" aria-label="编辑链接地址" @click="beginEdit"><AppIcon name="edit" :size="18" /></button>
      <button type="button" class="icon-action" title="移除链接，保留文案" aria-label="移除链接" @click="emit('remove')"><AppIcon name="removeLink" :size="18" /></button>
    </div>
</template>

<style scoped>
.link-popover {
  position: fixed;
  z-index: 125;
  display: flex;
  align-items: center;
  gap: 6px;
  width: min(430px, calc(100vw - 24px));
  padding: 7px;
  border: 1px solid var(--mm-border);
  border-radius: 9px;
  background: var(--mm-panel-bg);
  box-shadow: 0 10px 28px rgb(0 0 0 / .2);
  transform: translateX(-50%);
}
.link-input { flex: 1; min-width: 0; height: 32px; padding: 0 9px; border: 1px solid var(--mm-border); border-radius: 6px; outline: 0; background: var(--mm-canvas-bg); color: var(--mm-text); font-size: 13px; }
.link-input:focus { border-color: var(--mm-accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--mm-accent) 20%, transparent); }
.link-input.readonly { border-color: transparent; color: var(--mm-text-dim); cursor: default; }
.link-action, .icon-action { height: 32px; border: 0; border-radius: 6px; cursor: pointer; }
.link-action { padding: 0 11px; background: var(--mm-accent); color: white; }
.icon-action { display: inline-flex; width: 32px; align-items: center; justify-content: center; background: transparent; color: var(--mm-text-dim); }
.icon-action:hover { background: var(--mm-hover); color: var(--mm-text); }
</style>
