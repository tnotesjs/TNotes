<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

export type BlockAction = 'delete' | 'copy' | 'cut' | 'add-below'

const props = defineProps<{
  x: number
  y: number
}>()

const emit = defineEmits<{
  action: [action: BlockAction]
  addBelow: []
  close: []
}>()

const root = ref<HTMLElement | null>(null)
const focusedIndex = ref(0)

const actionable = (): HTMLButtonElement[] => [
  ...(root.value?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
]

function focusAt(index: number): void {
  const buttons = actionable()
  if (!buttons.length) return
  focusedIndex.value = Math.max(0, Math.min(index, buttons.length - 1))
  buttons[focusedIndex.value]?.focus()
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    focusAt((focusedIndex.value + 1) % actionable().length)
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    const buttons = actionable()
    focusAt((focusedIndex.value - 1 + buttons.length) % buttons.length)
    return
  }
  if (event.key === 'ArrowRight' && document.activeElement?.matches('[data-add-below]')) {
    event.preventDefault()
    emit('addBelow')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown, { capture: true })
  void nextTick(() => focusAt(0))
})

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown, { capture: true }))
</script>

<template>
  <div
    ref="root"
    class="desk-block-action-menu"
    role="menu"
    aria-label="块操作"
    :style="{ left: `${props.x}px`, top: `${props.y}px` }"
    @pointerdown.stop
  >
    <div class="desk-block-action-menu__group">
      <button type="button" role="menuitem" @click="emit('action', 'delete')">
        <svg viewBox="0 0 512 512" aria-hidden="true">
          <path
            d="M227.313 363.313L312 278.627l84.687 84.686l22.626-22.626L334.627 256l84.686-84.687l-22.626-22.626L312 233.373l-84.687-84.686l-22.626 22.626L289.373 256l-84.686 84.687z"
          />
          <path
            d="M472 64H194.644a24.1 24.1 0 0 0-17.42 7.492L16 241.623v28.754l161.224 170.131a24.1 24.1 0 0 0 17.42 7.492H472a24.03 24.03 0 0 0 24-24V88a24.03 24.03 0 0 0-24-24m-8 352H198.084L48 257.623v-3.246L198.084 96H464Z"
          />
        </svg>
        <span>删除</span>
      </button>
      <button type="button" role="menuitem" @click="emit('action', 'copy')">
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
          />
        </svg>
        <span>复制</span>
      </button>
      <button type="button" role="menuitem" @click="emit('action', 'cut')">
        <svg viewBox="0 0 1024 1024" aria-hidden="true">
          <path
            d="m567.1 512l318.5-319.3c5-5 1.5-13.7-5.6-13.7h-90.5c-2.1 0-4.2.8-5.6 2.3l-273.3 274l-90.2-90.5c12.5-22.1 19.7-47.6 19.7-74.8c0-83.9-68.1-152-152-152s-152 68.1-152 152s68.1 152 152 152c27.7 0 53.6-7.4 75.9-20.3l90 90.3l-90.1 90.3A151.04 151.04 0 0 1 288 582c-83.9 0-152 68.1-152 152s68.1 152 152 152s152-68.1 152-152c0-27.2-7.2-52.7-19.7-74.8l90.2-90.5l273.3 274c1.5 1.5 3.5 2.3 5.6 2.3H880c7.1 0 10.7-8.6 5.6-13.7zM288 370c-44.1 0-80-35.9-80-80s35.9-80 80-80s80 35.9 80 80s-35.9 80-80 80m0 444c-44.1 0-80-35.9-80-80s35.9-80 80-80s80 35.9 80 80s-35.9 80-80 80"
          />
        </svg>
        <span>剪切</span>
      </button>
    </div>

    <div class="desk-block-action-menu__group">
      <button
        type="button"
        role="menuitem"
        data-add-below
        @mouseenter="emit('addBelow')"
        @focus="emit('addBelow')"
        @click="emit('action', 'add-below')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4Z" />
        </svg>
        <span>在下方添加</span><span class="desk-block-action-menu__arrow">›</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.desk-block-action-menu {
  position: fixed;
  z-index: 80;
  box-sizing: border-box;
  width: 224px;
  padding: 6px;
  color: var(--editor-text);
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--crepe-shadow-2, 0 10px 28px rgba(0, 0, 0, 0.28));
}

.desk-block-action-menu__group {
  padding: 4px 0;
}

.desk-block-action-menu__group + .desk-block-action-menu__group {
  border-top: 1px solid var(--border);
}

button {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 34px;
  padding: 6px 9px;
  color: inherit;
  font: inherit;
  font-size: 13px;
  text-align: left;
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

button:hover,
button:focus-visible {
  outline: none;
  background: var(--hover);
}

button:disabled {
  color: var(--muted);
  cursor: not-allowed;
  opacity: 0.6;
}

svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
  color: var(--text);
}

.desk-block-action-menu__arrow {
  color: var(--muted);
  font-size: 11px;
}

.desk-block-action-menu__arrow {
  font-size: 20px;
  line-height: 1;
}
</style>
