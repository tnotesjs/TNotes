<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import type { MindmapNode, MindmapSession } from '@tnotesjs/mindmap-core'

const props = defineProps<{
  session: MindmapSession
  /** Session is not reactive; host bumps this when focus/doc changes. */
  version: number
}>()

const OPEN_DELAY = 180
const CLOSE_DELAY = 180
const MENU_WIDTH = 248
const VIEWPORT_GAP = 8

interface OpenMenu {
  nodeId: string
  depth: number
}

const root = ref<HTMLElement>()
const scroller = ref<HTMLElement>()
const menu = ref<HTMLElement>()
const openMenu = ref<OpenMenu | null>(null)
const menuPosition = ref({ left: 0, top: 0 })
const menuId = `focus-siblings-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

let trigger: HTMLButtonElement | null = null
let openTimer: ReturnType<typeof setTimeout> | null = null
let closeTimer: ReturnType<typeof setTimeout> | null = null
let pendingFocus: 'first' | 'last' | 'current' | null = null

const focusPath = computed(() => {
  void props.version
  return props.session.focusPath
})

const openNode = computed(() => {
  void props.version
  const id = openMenu.value?.nodeId
  return id ? props.session.document.find(id) : null
})

const openSiblings = computed(() => openNode.value?.parent?.children ?? [])

const menuStyle = computed(() => ({
  left: `${menuPosition.value.left}px`,
  top: `${menuPosition.value.top}px`,
  width: `${MENU_WIDTH}px`,
}))

function hasSiblingMenu(node: MindmapNode): boolean {
  return (node.parent?.children.length ?? 0) > 1
}

function clearOpenTimer() {
  if (openTimer) clearTimeout(openTimer)
  openTimer = null
}

function clearCloseTimer() {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = null
}

function updateMenuPosition() {
  if (!trigger) return
  const rect = trigger.getBoundingClientRect()
  const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  const left = Math.max(VIEWPORT_GAP, Math.min(rect.left, viewportWidth - MENU_WIDTH - VIEWPORT_GAP))
  const estimatedHeight = Math.min(360, Math.max(44, openSiblings.value.length * 40 + 12))
  const below = rect.bottom + 6
  const top = below + estimatedHeight <= viewportHeight - VIEWPORT_GAP
    ? below
    : Math.max(VIEWPORT_GAP, rect.top - estimatedHeight - 6)
  menuPosition.value = { left, top }
}

function menuItems(): HTMLButtonElement[] {
  return [...(menu.value?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [])]
}

function focusMenuItem(where: 'first' | 'last' | 'current') {
  const items = menuItems()
  if (items.length === 0) return
  const currentIndex = items.findIndex((item) => item.getAttribute('aria-checked') === 'true')
  const index = where === 'first'
    ? 0
    : where === 'last'
      ? items.length - 1
      : Math.max(0, currentIndex)
  items[index]?.focus()
}

async function showMenu(node: MindmapNode, depth: number, target: HTMLButtonElement) {
  if (!hasSiblingMenu(node)) return
  trigger = target
  openMenu.value = { nodeId: node.id, depth }
  await nextTick()
  updateMenuPosition()
  if (pendingFocus) focusMenuItem(pendingFocus)
  pendingFocus = null
}

function requestHoverMenu(node: MindmapNode, depth: number, event: MouseEvent) {
  if (!hasSiblingMenu(node)) return
  clearOpenTimer()
  clearCloseTimer()
  const target = event.currentTarget as HTMLButtonElement
  if (openMenu.value?.nodeId === node.id) {
    trigger = target
    return
  }
  openMenu.value = null
  openTimer = setTimeout(() => {
    openTimer = null
    void showMenu(node, depth, target)
  }, OPEN_DELAY)
}

function requestKeyboardMenu(
  node: MindmapNode,
  depth: number,
  event: KeyboardEvent,
  where: 'first' | 'last' | 'current',
) {
  if (!hasSiblingMenu(node)) return
  event.preventDefault()
  clearOpenTimer()
  clearCloseTimer()
  pendingFocus = where
  void showMenu(node, depth, event.currentTarget as HTMLButtonElement)
}

function scheduleClose() {
  clearOpenTimer()
  clearCloseTimer()
  if (!openMenu.value) return
  closeTimer = setTimeout(() => {
    closeTimer = null
    openMenu.value = null
    trigger = null
  }, CLOSE_DELAY)
}

function closeMenu(restoreFocus = false) {
  clearOpenTimer()
  clearCloseTimer()
  const target = trigger
  openMenu.value = null
  trigger = null
  pendingFocus = null
  if (restoreFocus) nextTick(() => target?.focus())
}

function onMenuEnter() {
  clearCloseTimer()
}

function navigateAll() {
  closeMenu()
  props.session.select(null)
  props.session.exitFocusTo(0)
}

function navigateAncestor(node: MindmapNode, depth: number) {
  closeMenu()
  props.session.select(node.id)
  props.session.exitFocusTo(depth + 1)
}

function switchSibling(node: MindmapNode) {
  closeMenu()
  props.session.switchFocusNode(node.id)
}

function onTriggerKeydown(node: MindmapNode, depth: number, event: KeyboardEvent) {
  if (event.key === 'ArrowDown') requestKeyboardMenu(node, depth, event, 'first')
  else if (event.key === 'ArrowUp') requestKeyboardMenu(node, depth, event, 'last')
  else if (event.key === 'Escape' && openMenu.value) {
    event.preventDefault()
    closeMenu(true)
  }
}

function onMenuKeydown(event: KeyboardEvent) {
  const items = menuItems()
  const current = items.indexOf(document.activeElement as HTMLButtonElement)
  let next: number
  if (event.key === 'ArrowDown') next = current < 0 ? 0 : (current + 1) % items.length
  else if (event.key === 'ArrowUp') next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = items.length - 1
  else if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    closeMenu(true)
    return
  } else if (event.key === 'Tab') {
    closeMenu()
    return
  } else {
    return
  }
  if (items.length > 0) {
    event.preventDefault()
    items[next]?.focus()
  }
}

function onDocumentPointerDown(event: PointerEvent) {
  const target = event.target as Node
  if (root.value?.contains(target) || menu.value?.contains(target)) return
  closeMenu()
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && openMenu.value) closeMenu(true)
}

function onViewportChange() {
  if (openMenu.value) updateMenuPosition()
}

watch(focusPath, () => {
  closeMenu()
  nextTick(() => {
    const current = scroller.value?.querySelector<HTMLElement>('[aria-current="page"]')
    current?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
  })
}, { immediate: true, flush: 'post' })

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown)
  document.addEventListener('keydown', onDocumentKeydown)
  window.addEventListener('resize', onViewportChange)
  document.addEventListener('scroll', onViewportChange, true)
})

onBeforeUnmount(() => {
  clearOpenTimer()
  clearCloseTimer()
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onDocumentKeydown)
  window.removeEventListener('resize', onViewportChange)
  document.removeEventListener('scroll', onViewportChange, true)
})
</script>

<template>
  <nav
    v-if="focusPath.length > 0"
    ref="root"
    class="focus-breadcrumbs"
    aria-label="主题导航"
  >
    <div ref="scroller" class="focus-breadcrumbs-scroller">
      <div class="focus-breadcrumbs-track">
        <button
          type="button"
          class="focus-crumb focus-crumb-root"
          :data-node-id="session.document.root.id"
          title="返回全部主题"
          @click="navigateAll"
        >
          全部
        </button>
        <template v-for="(node, depth) in focusPath" :key="node.id">
          <span class="focus-crumb-separator" aria-hidden="true">/</span>
          <button
            type="button"
            class="focus-crumb"
            :class="{ 'is-current': depth === focusPath.length - 1 }"
            :data-node-id="node.id"
            :aria-current="depth === focusPath.length - 1 ? 'page' : undefined"
            :aria-haspopup="hasSiblingMenu(node) ? 'menu' : undefined"
            :aria-expanded="hasSiblingMenu(node) ? openMenu?.nodeId === node.id : undefined"
            :aria-controls="hasSiblingMenu(node) && openMenu?.nodeId === node.id ? menuId : undefined"
            :title="node.content.text"
            @click="navigateAncestor(node, depth)"
            @mouseenter="requestHoverMenu(node, depth, $event)"
            @mouseleave="scheduleClose"
            @keydown="onTriggerKeydown(node, depth, $event)"
          >
            {{ node.content.text || '未命名主题' }}
          </button>
        </template>
      </div>
    </div>
  </nav>

  <Teleport to="body">
    <div
      v-if="openMenu && openNode && openSiblings.length > 1"
      :id="menuId"
      ref="menu"
      class="focus-sibling-menu"
      :style="menuStyle"
      role="menu"
      :aria-label="`${openNode.content.text || '未命名主题'}的同层主题`"
      @mouseenter="onMenuEnter"
      @mouseleave="scheduleClose"
      @keydown="onMenuKeydown"
    >
      <button
        v-for="node in openSiblings"
        :key="node.id"
        type="button"
        role="menuitemradio"
        :aria-checked="node.id === openNode.id"
        :class="{ 'is-current': node.id === openNode.id }"
        :data-node-id="node.id"
        @click="switchSibling(node)"
      >
        <span>{{ node.content.text || '未命名主题' }}</span>
        <span v-if="node.id === openNode.id" class="focus-menu-check" aria-hidden="true">✓</span>
      </button>
    </div>
  </Teleport>
</template>

<style scoped>
.focus-breadcrumbs {
  min-width: 0;
  border-bottom: 1px solid var(--tn-c-divider);
  background: var(--tn-c-bg-soft, var(--tn-c-bg));
  flex: none;
}

.focus-breadcrumbs-scroller {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
}

.focus-breadcrumbs-track {
  display: flex;
  width: max-content;
  min-width: 100%;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  white-space: nowrap;
}

.focus-crumb {
  flex: none;
  max-width: 260px;
  overflow: hidden;
  padding: 3px 6px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: var(--tn-c-brand);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.focus-crumb:hover,
.focus-crumb:focus-visible,
.focus-crumb[aria-expanded="true"] {
  background: var(--tn-c-default-soft);
  outline: none;
}

.focus-crumb.is-current {
  color: var(--tn-c-text);
  font-weight: 600;
}

.focus-crumb-separator {
  flex: none;
  color: var(--tn-c-text-2);
  font-size: 12px;
}

.focus-sibling-menu {
  position: fixed;
  /* Above Desk CSS fullscreen overlay (200000) and mindmap chrome. */
  z-index: 200010;
  max-height: min(360px, calc(100vh - 16px));
  overflow-y: auto;
  padding: 6px;
  border: 1px solid var(--tn-c-divider);
  border-radius: 10px;
  background: var(--tn-c-bg-elv, var(--tn-c-bg));
  box-shadow: var(--tn-shadow-2, 0 14px 38px rgb(0 0 0 / .24));
  color: var(--tn-c-text);
}

.focus-sibling-menu button {
  display: flex;
  width: 100%;
  min-height: 38px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  overflow: hidden;
  padding: 0 10px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  text-align: left;
}

.focus-sibling-menu button > span:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.focus-sibling-menu button:hover,
.focus-sibling-menu button:focus-visible {
  background: var(--tn-c-default-soft);
  outline: none;
}

.focus-sibling-menu button.is-current {
  color: var(--tn-c-brand);
}

.focus-menu-check {
  flex: none;
  font-size: 12px;
}
</style>
