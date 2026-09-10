<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { isApplePlatform, primaryShortcut } from './platform'

const props = withDefaults(defineProps<{
  position: { left: number; top: number }
  multiple?: boolean
  canInsertSibling?: boolean
  canInsertParent?: boolean
  canCut?: boolean
  canDuplicate?: boolean
  canDeleteOnly?: boolean
  canDeleteTree?: boolean
  canToggleSiblings?: boolean
  canFocus?: boolean
}>(), {
  multiple: false,
  canInsertSibling: true,
  canInsertParent: true,
  canCut: true,
  canDuplicate: true,
  canDeleteOnly: true,
  canDeleteTree: true,
  canToggleSiblings: true,
  canFocus: true,
})

const emit = defineEmits<{
  close: []
  insertSibling: []
  insertChild: []
  insertParent: []
  copy: []
  cut: []
  paste: []
  duplicate: []
  deleteOnly: []
  deleteTree: []
  toggleSiblings: []
  focus: []
}>()

const menu = ref<HTMLElement>()
const style = computed(() => {
  const width = 310
  const estimatedHeight = props.multiple ? 250 : 570
  const viewportWidth = typeof window === 'undefined' ? 1440 : window.innerWidth
  const viewportHeight = typeof window === 'undefined' ? 900 : window.innerHeight
  return {
    left: `${Math.max(8, Math.min(props.position.left, viewportWidth - width - 8))}px`,
    top: `${Math.max(8, Math.min(props.position.top, viewportHeight - estimatedHeight - 8))}px`,
  }
})
const shiftTab = computed(() => isApplePlatform() ? '⇧Tab' : 'Shift+Tab')

type MenuAction =
  | 'close'
  | 'insertSibling'
  | 'insertChild'
  | 'insertParent'
  | 'copy'
  | 'cut'
  | 'paste'
  | 'duplicate'
  | 'deleteOnly'
  | 'deleteTree'
  | 'toggleSiblings'
  | 'focus'

function act(event: MenuAction) {
  // Vue 的 emit 类型不能从 keyof 精确缩窄，这里统一分发无参数菜单动作。
  ;(emit as (name: string) => void)(event)
  if (event !== 'close') emit('close')
}

function onPointerDown(event: PointerEvent) {
  if (!menu.value?.contains(event.target as Node)) emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="menu" class="canvas-context-menu" :style="style" role="menu" :aria-label="multiple ? '多主题右键菜单' : '主题右键菜单'" @contextmenu.prevent>
      <template v-if="!multiple">
        <button type="button" role="menuitem" :disabled="!canInsertSibling" @click="act('insertSibling')"><span>插入同级主题</span><kbd>Enter</kbd></button>
        <button type="button" role="menuitem" @click="act('insertChild')"><span>插入下级主题</span><kbd>Tab</kbd></button>
        <button type="button" role="menuitem" :disabled="!canInsertParent" @click="act('insertParent')"><span>插入上级主题</span><kbd>{{ shiftTab }}</kbd></button>
        <span class="context-divider" />
      </template>

      <button type="button" role="menuitem" @click="act('copy')"><span>复制</span><kbd>{{ primaryShortcut('C') }}</kbd></button>
      <button type="button" role="menuitem" :disabled="!canCut" @click="act('cut')"><span>剪切</span><kbd>{{ primaryShortcut('X') }}</kbd></button>

      <template v-if="!multiple">
        <button type="button" role="menuitem" @click="act('paste')"><span>粘贴</span><kbd>{{ primaryShortcut('V') }}</kbd></button>
        <button type="button" role="menuitem" :disabled="!canDuplicate" @click="act('duplicate')"><span>创建副本</span><kbd>{{ primaryShortcut('D') }}</kbd></button>
        <button type="button" role="menuitem" :disabled="!canDeleteOnly" @click="act('deleteOnly')"><span>仅删除当前主题</span></button>
      </template>

      <button type="button" role="menuitem" class="danger" :disabled="!canDeleteTree" @click="act('deleteTree')"><span>{{ multiple ? '删除所选主题及下级主题' : '删除当前主题及下级主题' }}</span><kbd>Delete</kbd></button>
      <span class="context-divider" />
      <button type="button" role="menuitem" :disabled="!canToggleSiblings" @click="act('toggleSiblings')"><span>展开/折叠同级主题</span><kbd>{{ primaryShortcut('.', { shift: true }) }}</kbd></button>
      <button v-if="!multiple" type="button" role="menuitem" :disabled="!canFocus" @click="act('focus')"><span>进入此主题</span><kbd>{{ primaryShortcut(']') }}</kbd></button>
    </div>
</template>

<style scoped>
.canvas-context-menu {
  position: fixed;
  z-index: 150;
  display: grid;
  width: 310px;
  max-height: calc(100vh - 16px);
  overflow: auto;
  padding: 7px;
  border: 1px solid var(--mm-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--mm-panel-bg) 96%, #3e424a 4%);
  color: var(--mm-text);
  box-shadow: 0 14px 42px rgb(0 0 0 / .28);
}
.canvas-context-menu button {
  display: flex;
  min-height: 39px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}
.canvas-context-menu button:hover:not(:disabled),
.canvas-context-menu button:focus-visible { background: var(--mm-hover); outline: none; }
.canvas-context-menu button:disabled { cursor: default; opacity: .38; }
.canvas-context-menu button.danger { color: #e25a62; }
.canvas-context-menu kbd { flex: none; color: var(--mm-text-dim); font: inherit; font-size: 12px; }
.context-divider { height: 1px; margin: 6px 2px; background: var(--mm-border); }
</style>
