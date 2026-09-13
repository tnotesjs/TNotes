<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import IconButton from './IconButton.vue'
import { isApplePlatform } from './platform'

const emit = defineEmits<{
  all: []
  level: [level: 1 | 2 | 3]
}>()

const root = ref<HTMLElement>()
const open = ref(false)
const modifier = computed(() => (isApplePlatform() ? '⌘⌥' : 'Ctrl+Alt+'))
const allShortcut = computed(() => (isApplePlatform() ? '⌘⌥⇧.' : 'Ctrl+Alt+Shift+.'))

function chooseAll() {
  emit('all')
  open.value = false
}

function chooseLevel(level: 1 | 2 | 3) {
  emit('level', level)
  open.value = false
}

function onDocumentPointerDown(event: PointerEvent) {
  if (open.value && !root.value?.contains(event.target as Node)) open.value = false
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <div ref="root" class="collapse-menu">
    <IconButton icon="collapse" label="展开/折叠主题" :active="open" @click="open = !open" />
    <div v-if="open" class="collapse-menu-popover" role="menu" aria-label="展开/折叠主题">
      <div class="collapse-menu-title">展开/折叠主题</div>
      <button type="button" role="menuitem" @click="chooseAll">
        <span>全部主题</span><kbd>{{ allShortcut }}</kbd>
      </button>
      <button
        v-for="level in [1, 2, 3] as const"
        :key="level"
        type="button"
        role="menuitem"
        @click="chooseLevel(level)"
      >
        <span>{{ level }} 级主题</span><kbd>{{ modifier }}{{ level }}</kbd>
      </button>
    </div>
  </div>
</template>

<style scoped>
.collapse-menu {
  position: relative;
}
.collapse-menu-popover {
  position: absolute;
  z-index: 85;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  padding: 8px;
  border: 1px solid var(--mm-border);
  border-radius: 12px;
  background: var(--mm-panel-bg);
  color: var(--mm-text);
  box-shadow: 0 14px 38px rgb(0 0 0 / 0.24);
}
.collapse-menu-title {
  padding: 7px 11px 9px;
  color: var(--mm-text-dim);
  font-size: 12px;
}
.collapse-menu-popover button {
  display: flex;
  width: 100%;
  min-height: 42px;
  align-items: center;
  justify-content: space-between;
  padding: 0 11px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.collapse-menu-popover button:hover,
.collapse-menu-popover button:focus-visible {
  background: var(--mm-hover);
  outline: none;
}
.collapse-menu-popover kbd {
  color: var(--mm-text-dim);
  font: inherit;
  font-size: 12px;
}
</style>
