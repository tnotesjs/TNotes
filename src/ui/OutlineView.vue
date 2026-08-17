<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { cloneSubtree, parseMarkdown, serializeSubtree } from '../engine'
import type { MindmapNode, MindmapSession } from '../engine'

const props = defineProps<{
  session: MindmapSession
  /** 每次文档/选中/折叠/聚焦变化时 +1，驱动本组件重算 */
  version: number
}>()

const emit = defineEmits<{
  imagePreview: [src: string]
  requestSearch: []
}>()

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

// ---------- 行焦点（焦点 = 选中 = 编辑态，幕布式） ----------

const focusedId = ref<string | null>(null)

function inputOf(id: string): HTMLInputElement | null {
  return containerRef.value?.querySelector(`input.row-input[data-id="${id}"]`) ?? null
}

/** 聚焦某行并放置光标（col 省略时到末尾） */
function focusRow(id: string, col?: number) {
  nextTick(() => {
    const input = inputOf(id)
    if (!input) return
    input.focus()
    const pos = col === undefined ? input.value.length : Math.min(col, input.value.length)
    input.setSelectionRange(pos, pos)
  })
}

function scrollRowIntoView(index: number) {
  const el = containerRef.value
  if (!el) return
  const target = index * ROW_HEIGHT
  if (target < el.scrollTop || target > el.scrollTop + el.clientHeight - ROW_HEIGHT) {
    el.scrollTop = Math.max(0, target - el.clientHeight / 2)
  }
}

/** 搜索/外部定位：展开祖先、选中、滚动到该行 */
function locateNode(id: string) {
  const session = props.session
  session.expandAncestors(id)
  session.select(id)
  nextTick(() => {
    const idx = rows.value.findIndex((r) => r.node.id === id)
    if (idx >= 0) scrollRowIntoView(idx)
  })
}

defineExpose({ locateNode })

// ---------- 行内编辑行为（光标感知，对齐幕布） ----------

/** 提交行文本；空行且无子节点时删除（幕布行为）。返回是否有文档变化 */
function commitRow(node: MindmapNode, input: HTMLInputElement): boolean {
  const session = props.session
  const raw = input.value.trim()
  if (raw && raw !== node.content.raw) {
    session.updateNodeRaw(node.id, raw)
    return true
  }
  if (!raw && node.content.raw === '' && node.children.length === 0 && node !== session.document.root) {
    session.removeNode(node.id)
    return true
  }
  return false
}

function onEditKeydown(node: MindmapNode, e: KeyboardEvent) {
  const session = props.session
  const input = e.target as HTMLInputElement
  e.stopPropagation()

  const mod = e.metaKey || e.ctrlKey
  if (mod) {
    const key = e.key.toLowerCase()
    const col = input.selectionStart ?? 0
    if (key === 'z' || key === 'y') {
      e.preventDefault()
      commitRow(node, input)
      if (key === 'z' && !e.shiftKey) session.undo()
      else session.redo()
    } else if (key === 'f') {
      e.preventDefault()
      emit('requestSearch')
    } else if (key === ']') {
      e.preventDefault()
      commitRow(node, input)
      session.indentNode(node.id)
      focusRow(node.id, col)
    } else if (key === '[') {
      e.preventDefault()
      commitRow(node, input)
      session.outdentNode(node.id)
      focusRow(node.id, col)
    }
    return
  }

  const start = input.selectionStart ?? 0
  const end = input.selectionEnd ?? 0
  const collapsedSelection = start === end
  const value = input.value
  const list = rows.value
  const rowIndex = list.findIndex((r) => r.node.id === node.id)
  const prevRow = rowIndex > 0 ? list[rowIndex - 1] : null
  const nextRow = rowIndex >= 0 && rowIndex < list.length - 1 ? list[rowIndex + 1] : null

  switch (e.key) {
    case 'Enter': {
      e.preventDefault()
      if (start === 0 && end === 0 && value.length > 0) {
        // 行首 Enter：上方插入空行并进入
        const created = session.insertBeforeOf(node.id)
        if (created) focusRow(created.id, 0)
      } else if (end < value.length) {
        // 文本中间 Enter：分裂节点（前段留当前行，后段进新行）
        const before = value.slice(0, start)
        const after = value.slice(end)
        // 先同步 input 值，防止 blur 兜底提交覆盖分裂结果
        input.value = before
        let created: MindmapNode | null = null
        session.transact((doc) => {
          doc.updateRaw(node, before)
          created = doc.insertAfter(node, after)
        })
        if (created) {
          session.select((created as MindmapNode).id)
          focusRow((created as MindmapNode).id, 0)
        }
      } else if (node.children.length > 0 && !node.collapsed) {
        // 幕布：有可见子节点时 Enter 新建第一个子节点
        commitRow(node, input)
        const created = session.insertChildOf(node.id, 0)
        if (created) {
          session.select(created.id)
          focusRow(created.id, 0)
        }
      } else {
        // 行尾 Enter：提交并新建同级继续录入
        commitRow(node, input)
        const created = session.insertSiblingOf(node.id)
        if (created) {
          session.select(created.id)
          focusRow(created.id, 0)
        }
      }
      break
    }
    case 'Backspace': {
      if (!collapsedSelection || start > 0) break
      e.preventDefault()
      if (!prevRow) break
      if (value.length === 0) {
        if (node.children.length > 0) break // 空行但有子节点：不删，避免丢子树
        // 空行 Backspace：删除本行，光标移到上一行末尾
        const prevId = prevRow.node.id
        const prevLen = prevRow.node.content.raw.length
        session.removeNode(node.id)
        focusRow(prevId, prevLen)
      } else if (node.parent && node.parent.children[0] === node) {
        // 首个子节点行首 Backspace：升级（根的直接子节点除外）
        if (node.parent === session.document.root) break
        session.outdentNode(node.id)
        focusRow(node.id, 0)
      } else {
        // 行首 Backspace：合并到视觉上一行，子节点并入目标行
        const prevId = prevRow.node.id
        const prevLen = prevRow.node.content.raw.length
        session.transact((doc) => {
          doc.updateRaw(prevRow.node, prevRow.node.content.raw + value)
          for (const c of [...node.children]) doc.move(c, prevRow.node, prevRow.node.children.length)
          doc.remove(node)
        })
        session.select(prevId)
        focusRow(prevId, prevLen)
      }
      break
    }
    case 'Delete': {
      // 行尾向前删除：与下一行合并（仅当下一行无子节点）
      if (!collapsedSelection || end < value.length) break
      if (!nextRow || nextRow.node.children.length > 0) break
      e.preventDefault()
      const nextRaw = nextRow.node.content.raw
      session.transact((doc) => {
        doc.updateRaw(node, value + nextRaw)
        doc.remove(nextRow.node)
      })
      focusRow(node.id, value.length)
      break
    }
    case 'Tab': {
      e.preventDefault()
      const col = input.selectionStart ?? 0
      commitRow(node, input)
      if (e.shiftKey) session.outdentNode(node.id)
      else session.indentNode(node.id)
      focusRow(node.id, col)
      break
    }
    case 'Escape': {
      e.preventDefault()
      commitRow(node, input)
      containerRef.value?.focus()
      break
    }
    case 'ArrowUp': {
      e.preventDefault()
      commitRow(node, input)
      if (prevRow) focusRow(prevRow.node.id, start)
      break
    }
    case 'ArrowDown': {
      e.preventDefault()
      commitRow(node, input)
      if (nextRow) focusRow(nextRow.node.id, start)
      break
    }
    case 'ArrowLeft': {
      if (!collapsedSelection || start > 0) break
      e.preventDefault()
      commitRow(node, input)
      if (prevRow) focusRow(prevRow.node.id)
      break
    }
    case 'ArrowRight': {
      if (!collapsedSelection || end < value.length) break
      e.preventDefault()
      commitRow(node, input)
      if (nextRow) focusRow(nextRow.node.id, 0)
      break
    }
  }
}

function onRowInputBlur(node: MindmapNode, e: FocusEvent) {
  const input = e.target as HTMLInputElement
  commitRow(node, input)
  if (focusedId.value === node.id) focusedId.value = null
}

function onRowInputFocus(node: MindmapNode) {
  focusedId.value = node.id
  props.session.select(node.id)
}

// ---------- 复制 / 剪切 / 粘贴（行级，子树为单位） ----------

const LIST_LINE_RE = /^\s*[-*+]\s+/

function onPaste(node: MindmapNode, e: ClipboardEvent) {
  const text = e.clipboardData?.getData('text/plain') ?? ''
  if (!text.includes('\n')) return // 单行走默认粘贴
  e.preventDefault()
  const session = props.session
  const input = e.target as HTMLInputElement

  // 每行规范化为列表项（保留缩进）后复用 parser 解析层级
  const fragment = text
    .split(/\r?\n/)
    .filter((l) => l.trim() !== '')
    .map((l) => {
      if (LIST_LINE_RE.test(l)) return l
      const m = /^(\s*)(.*)$/.exec(l)!
      return `${m[1]}- ${m[2]}`
    })
    .join('\n')
  const { doc: tmp } = parseMarkdown(`# _\n\n${fragment}\n`)
  const nodes = tmp.root.children.map((c) => cloneSubtree(c))
  if (nodes.length === 0) return

  const currentRaw = input.value.trim()
  session.transact((doc) => {
    let anchor = node
    // 当前行为空 → 首行内容（含其子树）填入当前行
    if (currentRaw === '' && node !== doc.root) {
      const first = nodes.shift()!
      doc.updateRaw(node, first.content.raw)
      for (const c of [...first.children]) doc.move(c, node, node.children.length)
    } else if (currentRaw !== node.content.raw) {
      doc.updateRaw(node, currentRaw)
    }
    const parent = anchor.parent ?? doc.root
    let index = parent.children.indexOf(anchor) + 1
    for (const n of nodes) {
      const inserted = doc.addNode(parent, n.content, index++)
      inserted.collapsed = n.collapsed
      for (const c of [...n.children]) doc.move(c, inserted, inserted.children.length)
    }
  })
  session.select(node.id)
}

function onCopy(node: MindmapNode, e: ClipboardEvent) {
  const input = e.target as HTMLInputElement
  if (input.selectionStart !== input.selectionEnd) return // 有选中文本走默认复制
  e.preventDefault()
  e.clipboardData?.setData('text/plain', serializeSubtree(node))
}

function onCut(node: MindmapNode, e: ClipboardEvent) {
  const input = e.target as HTMLInputElement
  if (input.selectionStart !== input.selectionEnd) return
  e.preventDefault()
  e.clipboardData?.setData('text/plain', serializeSubtree(node))
  if (node !== props.session.document.root) props.session.removeNode(node.id)
}

// ---------- 行点击 / bullet / 折叠 ----------

let suppressRowClick = false

function onBulletClick(node: MindmapNode, e: MouseEvent) {
  e.stopPropagation()
  if (suppressRowClick) return
  // 幕布：点击 bullet 进入主题（聚焦）
  props.session.focusNode(node.id)
}

function onArrowClick(node: MindmapNode, e: MouseEvent) {
  e.stopPropagation()
  if (suppressRowClick) return
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

// ---------- 键盘导航（焦点在容器、非编辑态时） ----------

function onKeydown(e: KeyboardEvent) {
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
      if (sel) focusRow(sel.id)
      break
    case 'Tab':
      e.preventDefault()
      if (sel) {
        if (e.shiftKey) session.outdentNode(sel.id)
        else session.indentNode(sel.id)
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
      scrollRowIntoView(next.index)
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

// ---------- 拖拽移动（仅 bullet/箭头/缩进区发起，文本区留给文本选择） ----------

interface DragState {
  id: string
  startY: number
  dragging: boolean
  indicator: { type: 'before' | 'after' | 'child'; targetId: string; top: number; left: number; width: number } | null
}

const drag = ref<DragState | null>(null)

function onGripPointerDown(node: MindmapNode, e: PointerEvent) {
  if (e.button !== 0) return
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
    suppressRowClick = true
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
  while (p) {
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
  setTimeout(() => (suppressRowClick = false), 0)
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
      >
        <span class="row-indent" :style="{ width: `${row.depth * 20}px` }" @pointerdown="onGripPointerDown(row.node, $event)" />
        <span
          v-if="row.node.children.length > 0"
          class="row-arrow"
          :class="{ collapsed: row.node.collapsed }"
          @click="onArrowClick(row.node, $event)"
          @pointerdown="onGripPointerDown(row.node, $event)"
          >▸</span
        >
        <span v-else class="row-arrow-placeholder" @pointerdown="onGripPointerDown(row.node, $event)" />
        <span
          class="row-bullet"
          :class="{ 'has-children': row.node.children.length > 0 }"
          title="点击进入主题"
          @click="onBulletClick(row.node, $event)"
          @pointerdown="onGripPointerDown(row.node, $event)"
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
          class="row-input"
          :class="{ 'is-task-done': row.node.content.checked === true }"
          :value="row.node.content.raw"
          :data-id="row.node.id"
          spellcheck="false"
          @focus="onRowInputFocus(row.node)"
          @blur="onRowInputBlur(row.node, $event)"
          @keydown="onEditKeydown(row.node, $event)"
          @paste="onPaste(row.node, $event)"
          @copy="onCopy(row.node, $event)"
          @cut="onCut(row.node, $event)"
        />
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
  user-select: none;
  white-space: nowrap;
}
.outline-row:hover {
  background: var(--mm-hover);
}
.outline-row.is-selected {
  background: var(--mm-selected-bg);
}
.outline-row.is-matched .row-input {
  background: rgb(255 213 79 / 0.4);
  border-radius: 3px;
}
.outline-row.is-focus-root .row-input {
  font-weight: 700;
  font-size: 15px;
}
.row-indent {
  flex: none;
  height: 100%;
  cursor: grab;
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
.row-input {
  flex: 1;
  min-width: 60px;
  border: none;
  outline: none;
  background: transparent;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  padding: 2px 4px;
  border-radius: 4px;
}
.row-input:focus {
  background: var(--mm-canvas-bg);
  box-shadow: 0 0 0 1px var(--mm-accent);
}
.row-input.is-task-done {
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
