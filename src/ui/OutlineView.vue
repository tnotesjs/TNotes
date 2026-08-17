<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { MindmapNode, MindmapSession } from '../engine'

const props = defineProps<{
  session: MindmapSession
  /** 每次文档/选中/折叠/聚焦变化时 +1，驱动本组件重算 */
  version: number
}>()

const emit = defineEmits<{ imagePreview: [src: string] }>()

const ROW_HEIGHT = 28
const PADDING_TOP = 8

interface Row {
  node: MindmapNode
  depth: number
  index: number
}

const rows = computed<Row[]>(() => {
  // version 恒 >= 0；引用它仅为与 session 事件建立响应式依赖
  if (props.version < 0) return []
  const session = props.session
  const root = session.focusRootNode
  const out: Row[] = [{ node: root, depth: 0, index: 0 }]
  const walk = (n: MindmapNode, depth: number) => {
    if (n.collapsed) return
    for (const c of n.children) {
      out.push({ node: c, depth, index: out.length })
      walk(c, depth + 1)
    }
  }
  walk(root, 1)
  return out
})

const selectedId = computed(() => {
  if (props.version < 0) return null
  return props.session.selectedNode?.id ?? null
})

const matches = computed(() => {
  if (props.version < 0) return new Set<string>()
  return props.session.matches
})

// ---------- 虚拟滚动 ----------

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)
const viewportH = ref(600)

const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / ROW_HEIGHT) - 10))
const endIndex = computed(() =>
  Math.min(rows.value.length, Math.ceil((scrollTop.value + viewportH.value) / ROW_HEIGHT) + 10),
)
const visibleRows = computed(() => rows.value.slice(startIndex.value, endIndex.value))

function onScroll() {
  scrollTop.value = containerRef.value?.scrollTop ?? 0
}

let resizeObserver: ResizeObserver | null = null
onMounted(() => {
  if (containerRef.value) {
    viewportH.value = containerRef.value.clientHeight
    resizeObserver = new ResizeObserver(() => {
      viewportH.value = containerRef.value?.clientHeight ?? 600
    })
    resizeObserver.observe(containerRef.value)
  }
})
onBeforeUnmount(() => resizeObserver?.disconnect())

// 聚焦切换后回到顶部
const focusPathLen = computed(() => {
  if (props.version < 0) return 0
  return props.session.focusPath.length
})
watch(focusPathLen, () => {
  scrollTop.value = 0
  if (containerRef.value) containerRef.value.scrollTop = 0
})

// ---------- 内联编辑（幕布式行编辑） ----------

const editingId = ref<string | null>(null)
const editInput = ref<HTMLInputElement>()
let committing = false

function startEdit(node: MindmapNode) {
  if (editingId.value) return
  editingId.value = node.id
  nextTick(() => {
    const input = editInput.value
    if (input) {
      input.value = node.content.raw
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  })
}

function commitEdit(removeIfEmpty = true) {
  if (!editingId.value || committing) return
  committing = true
  const session = props.session
  const id = editingId.value
  const input = editInput.value
  editingId.value = null
  committing = false
  if (!session || !input) return
  const node = session.document.find(id)
  if (!node) return
  const raw = input.value.trim()
  if (raw && raw !== node.content.raw) {
    session.updateNodeRaw(id, raw)
  } else if (!raw && node.content.raw === '' && removeIfEmpty && node !== session.document.root) {
    session.removeNode(id)
  }
}

function onEditKeydown(e: KeyboardEvent, node: MindmapNode) {
  const session = props.session
  e.stopPropagation()
  if (e.key === 'Enter') {
    e.preventDefault()
    const id = node.id
    commitEdit()
    // 幕布式连续录入：新建同级并继续编辑
    const created = session.insertSiblingOf(id)
    if (created) {
      session.select(created.id)
      nextTick(() => {
        const n = session.document.find(created.id)
        if (n) startEdit(n)
      })
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    editingId.value = null
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const id = node.id
    commitEdit(false)
    if (e.shiftKey) session.outdentNode(id)
    else session.indentNode(id)
    session.select(id)
    nextTick(() => {
      const n = session.document.find(id)
      if (n) startEdit(n)
    })
  }
}

// ---------- 行交互 ----------

function onRowClick(node: MindmapNode) {
  props.session.select(node.id)
  containerRef.value?.focus()
}

function onRowDblClick(node: MindmapNode) {
  startEdit(node)
}

function onBulletClick(node: MindmapNode, e: MouseEvent) {
  e.stopPropagation()
  // 幕布：点击 bullet 进入主题（聚焦）
  props.session.focusNode(node.id)
}

function onArrowClick(node: MindmapNode, e: MouseEvent) {
  e.stopPropagation()
  props.session.toggleCollapse(node.id)
}

function onCheckboxClick(node: MindmapNode, e: MouseEvent) {
  e.stopPropagation()
  props.session.toggleChecked(node.id)
}

function onLinkClick(node: MindmapNode, e: MouseEvent) {
  e.stopPropagation()
  if (node.content.link) window.open(node.content.link, '_blank', 'noopener')
}

function onImageClick(node: MindmapNode, e: MouseEvent) {
  e.stopPropagation()
  if (node.content.image) emit('imagePreview', node.content.image.src)
}

/** 搜索/外部定位：展开祖先、选中并滚动到该行 */
function locateNode(id: string) {
  const session = props.session
  session.expandAncestors(id)
  session.select(id)
  nextTick(() => {
    const idx = rows.value.findIndex((r) => r.node.id === id)
    if (idx < 0 || !containerRef.value) return
    const target = idx * ROW_HEIGHT
    const el = containerRef.value
    if (target < el.scrollTop || target > el.scrollTop + el.clientHeight - ROW_HEIGHT) {
      el.scrollTop = Math.max(0, target - el.clientHeight / 2)
    }
  })
}

defineExpose({ locateNode })

// ---------- 键盘导航（非编辑态） ----------

function onKeydown(e: KeyboardEvent) {
  if (editingId.value) return
  const session = props.session
  const sel = session.selectedNode
  const mod = e.metaKey || e.ctrlKey

  if (mod && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    if (e.shiftKey) session.redo()
    else session.undo()
    return
  }
  if (mod && e.key.toLowerCase() === 'y') {
    e.preventDefault()
    session.redo()
    return
  }

  const list = rows.value
  const idx = sel ? list.findIndex((r) => r.node.id === sel.id) : -1

  switch (e.key) {
    case 'Enter':
      e.preventDefault()
      if (sel) startEdit(sel)
      break
    case 'Tab':
      e.preventDefault()
      if (sel) {
        // 幕布大纲：Tab 降级 / Shift+Tab 升级
        if (e.shiftKey) session.outdentNode(sel.id)
        else session.indentNode(sel.id)
        session.select(sel.id)
      }
      break
    case 'Delete':
    case 'Backspace':
      e.preventDefault()
      if (sel) session.removeNode(sel.id)
      break
    case 'ArrowUp':
    case 'ArrowDown': {
      e.preventDefault()
      if (list.length === 0) return
      const next =
        idx < 0
          ? list[0]
          : list[Math.max(0, Math.min(list.length - 1, idx + (e.key === 'ArrowDown' ? 1 : -1)))]
      session.select(next.node.id)
      // 滚动到选中行
      const target = next.index * ROW_HEIGHT
      const el = containerRef.value
      if (el && (target < el.scrollTop || target > el.scrollTop + el.clientHeight - ROW_HEIGHT)) {
        el.scrollTop = target - ROW_HEIGHT
      }
      break
    }
    case 'ArrowLeft':
      e.preventDefault()
      if (sel) {
        if (sel.children.length > 0 && !sel.collapsed) session.toggleCollapse(sel.id)
        else if (sel.parent) session.select(sel.parent.id)
      }
      break
    case 'ArrowRight':
      e.preventDefault()
      if (sel) {
        if (sel.collapsed) session.toggleCollapse(sel.id)
        else if (sel.children.length > 0) session.select(sel.children[0].id)
      }
      break
  }
}

// ---------- 拖拽移动 ----------

interface DragState {
  id: string
  startY: number
  dragging: boolean
  indicator: { type: 'before' | 'after' | 'child'; targetId: string; top: number; left: number; width: number } | null
}

const drag = ref<DragState | null>(null)

function onRowPointerDown(node: MindmapNode, e: PointerEvent) {
  if (e.button !== 0 || editingId.value) return
  drag.value = { id: node.id, startY: e.clientY, dragging: false, indicator: null }
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragUp, { once: true })
}

function rowIndexAt(clientY: number): number {
  const el = containerRef.value
  if (!el) return -1
  const rect = el.getBoundingClientRect()
  const y = clientY - rect.top - PADDING_TOP + el.scrollTop
  return Math.max(0, Math.min(rows.value.length - 1, Math.floor(y / ROW_HEIGHT)))
}

function onDragMove(e: PointerEvent) {
  const d = drag.value
  if (!d) return
  if (!d.dragging) {
    if (Math.abs(e.clientY - d.startY) < 5) return
    d.dragging = true
    props.session.select(d.id)
  }
  const el = containerRef.value
  if (!el) return
  const idx = rowIndexAt(e.clientY)
  const row = rows.value[idx]
  if (!row || row.node.id === d.id) {
    d.indicator = null
    return
  }
  // 不允许拖到自身后代
  let p = row.node.parent
  let intoSelf = false
  const dragNode = props.session.document.find(d.id)
  while (p && dragNode) {
    if (p.id === d.id) intoSelf = true
    p = p.parent
  }
  if (intoSelf) {
    d.indicator = null
    return
  }
  const rect = el.getBoundingClientRect()
  const rowTop = idx * ROW_HEIGHT + PADDING_TOP - el.scrollTop
  const ratio = (e.clientY - rect.top - rowTop) / ROW_HEIGHT
  const type = ratio < 0.3 ? 'before' : ratio > 0.7 ? 'after' : 'child'
  const depthIndent = type === 'child' ? row.depth + 1 : row.depth
  d.indicator = {
    type,
    targetId: row.node.id,
    top: type === 'before' ? rowTop : type === 'after' ? rowTop + ROW_HEIGHT : rowTop + ROW_HEIGHT / 2,
    left: 24 + depthIndent * 20,
    width: 200,
  }
}

function onDragUp() {
  window.removeEventListener('pointermove', onDragMove)
  const d = drag.value
  drag.value = null
  if (!d?.dragging || !d.indicator) return
  const session = props.session
  const target = session.document.find(d.indicator.targetId)
  if (!target) return
  if (d.indicator.type === 'child') {
    session.moveNode(d.id, target.id, target.children.length)
  } else if (target.parent) {
    const idx = target.parent.children.indexOf(target)
    session.moveNode(d.id, target.parent.id, d.indicator.type === 'before' ? idx : idx + 1)
  }
  session.select(d.id)
}
</script>

<template>
  <div ref="containerRef" class="outline-view" tabindex="0" @scroll="onScroll" @keydown="onKeydown">
    <div class="outline-spacer" :style="{ height: `${rows.length * ROW_HEIGHT}px` }">
      <div
        v-for="row in visibleRows"
        :key="row.node.id"
        class="outline-row"
        :class="{
          'is-selected': row.node.id === selectedId,
          'is-matched': matches.has(row.node.id),
          'is-focus-root': row.index === 0,
        }"
        :style="{ top: `${row.index * ROW_HEIGHT}px`, height: `${ROW_HEIGHT}px` }"
        @click="onRowClick(row.node)"
        @dblclick="onRowDblClick(row.node)"
        @pointerdown="onRowPointerDown(row.node, $event)"
      >
        <span class="row-indent" :style="{ width: `${row.depth * 20}px` }" />
        <span
          v-if="row.node.children.length > 0"
          class="row-arrow"
          :class="{ collapsed: row.node.collapsed }"
          @click="onArrowClick(row.node, $event)"
          >▸</span
        >
        <span v-else class="row-arrow-placeholder" />
        <span
          class="row-bullet"
          :class="{ 'has-children': row.node.children.length > 0 }"
          title="点击进入主题"
          @click="onBulletClick(row.node, $event)"
        >
          <i />{{ row.node.collapsed ? row.node.children.length : '' }}
        </span>
        <span
          v-if="row.node.content.checked !== null"
          class="row-checkbox"
          :class="{ checked: row.node.content.checked }"
          @click="onCheckboxClick(row.node, $event)"
          >{{ row.node.content.checked ? '☑' : '☐' }}</span
        >
        <input
          v-if="editingId === row.node.id"
          ref="editInput"
          class="row-edit"
          :default-value="row.node.content.raw"
          @keydown="onEditKeydown($event, row.node)"
          @blur="commitEdit()"
          @click.stop
        />
        <span v-else class="row-text" :class="{ 'is-task-done': row.node.content.checked === true }">
          {{ row.node.content.text }}
        </span>
        <span v-if="row.node.content.link" class="row-badge" title="打开链接" @click="onLinkClick(row.node, $event)">↗</span>
        <span v-if="row.node.content.image" class="row-badge" title="查看图片" @click="onImageClick(row.node, $event)">🖼</span>
      </div>
    </div>

    <div
      v-if="drag?.dragging && drag.indicator"
      class="drop-indicator"
      :class="`is-${drag.indicator.type}`"
      :style="{ top: `${drag.indicator.top}px`, left: `${drag.indicator.left}px`, width: drag.indicator.type === 'child' ? '160px' : `${drag.indicator.width}px` }"
    />
  </div>
</template>

<style scoped>
.outline-view {
  position: relative;
  height: 100%;
  overflow: auto;
  outline: none;
  background: var(--mm-panel-bg);
  padding: 8px 0;
}
.outline-spacer {
  position: relative;
}
.outline-row {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 12px;
  font-size: 14px;
  color: var(--mm-text);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
.outline-row:hover {
  background: var(--mm-hover);
}
.outline-row.is-selected {
  background: var(--mm-selected-bg);
}
.outline-row.is-matched .row-text {
  background: rgb(255 213 79 / 0.4);
  border-radius: 3px;
}
.outline-row.is-focus-root {
  font-weight: 700;
  font-size: 15px;
}
.row-indent {
  flex: none;
  height: 100%;
}
.row-arrow {
  width: 16px;
  flex: none;
  text-align: center;
  color: var(--mm-text-dim);
  font-size: 11px;
  display: inline-block;
  transition: transform 0.12s;
  transform: rotate(90deg);
  cursor: pointer;
}
.row-arrow.collapsed {
  transform: rotate(0deg);
}
.row-arrow-placeholder {
  width: 16px;
  flex: none;
}
.row-bullet {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  color: var(--mm-text-dim);
  font-size: 11px;
  cursor: pointer;
  border-radius: 8px;
  padding: 1px 4px;
}
.row-bullet i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mm-text-dim);
}
.row-bullet:hover {
  background: var(--mm-hover);
}
.row-bullet.has-children i {
  background: var(--mm-accent);
}
.row-checkbox {
  flex: none;
  cursor: pointer;
  color: var(--mm-text-dim);
}
.row-checkbox.checked {
  color: var(--mm-accent);
}
.row-text {
  overflow: hidden;
  text-overflow: ellipsis;
}
.row-text.is-task-done {
  text-decoration: line-through;
  color: var(--mm-text-dim);
}
.row-badge {
  flex: none;
  color: var(--mm-text-dim);
  font-size: 11px;
  cursor: pointer;
}
.row-badge:hover {
  color: var(--mm-accent);
}
.row-edit {
  flex: 1;
  min-width: 60px;
  font-size: 14px;
  padding: 1px 4px;
  border: 1px solid var(--mm-accent);
  border-radius: 4px;
  outline: none;
  background: var(--mm-canvas-bg);
  color: var(--mm-text);
}
.drop-indicator {
  position: absolute;
  height: 3px;
  border-radius: 1.5px;
  background: var(--mm-accent);
  pointer-events: none;
  z-index: 10;
}
.drop-indicator.is-child {
  height: 22px;
  background: transparent;
  border: 2px dashed var(--mm-accent);
  border-radius: 6px;
  transform: translateY(-11px);
}
</style>
