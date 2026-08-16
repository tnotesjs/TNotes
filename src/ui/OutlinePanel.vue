<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import type { MindmapEditor, MindmapNode } from '../engine'

const props = defineProps<{
  editor: MindmapEditor | null
  /** 每次文档/选中/聚焦变化时 +1，驱动本组件重算 */
  version: number
}>()

interface Row {
  node: MindmapNode
  depth: number
  isRoot: boolean
}

const rows = computed<Row[]>(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- 依赖 version 驱动重算
  props.version
  const ed = props.editor
  if (!ed) return []
  const root = ed.focusRootNode
  const out: Row[] = [{ node: root, depth: 0, isRoot: root === ed.document.root && ed.focusPath.length === 0 }]
  const walk = (n: MindmapNode, depth: number) => {
    if (n.collapsed) return
    for (const c of n.children) {
      out.push({ node: c, depth, isRoot: false })
      walk(c, depth + 1)
    }
  }
  walk(root, 1)
  return out
})

const selectedId = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions -- 依赖 version 驱动重算
  props.version
  return props.editor?.selectedNode?.id ?? null
})

const editingId = ref<string | null>(null)
const editInput = ref<HTMLInputElement>()
let committing = false

function startEdit(row: Row) {
  if (editingId.value) return
  editingId.value = row.node.id
  nextTick(() => {
    const input = editInput.value
    if (input) {
      input.value = row.node.content.raw
      input.focus()
      input.setSelectionRange(input.value.length, input.value.length)
    }
  })
}

function commit() {
  if (!editingId.value || committing) return
  committing = true
  const ed = props.editor
  const input = editInput.value
  if (ed && input) {
    const raw = input.value.trim()
    if (raw) ed.updateNodeRaw(editingId.value, raw)
  }
  editingId.value = null
  committing = false
}

function cancel() {
  editingId.value = null
}

function onEditKeydown(e: KeyboardEvent, row: Row) {
  const ed = props.editor
  if (!ed) return
  e.stopPropagation()
  if (e.key === 'Enter') {
    e.preventDefault()
    const id = row.node.id
    commit()
    // 幕布式连续录入
    const created = ed.insertSiblingOf(id)
    if (created) {
      ed.select(created.id)
      nextTick(() => {
        const r = rows.value.find((r) => r.node.id === created.id)
        if (r) startEdit(r)
      })
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    cancel()
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const id = row.node.id
    commit()
    if (e.shiftKey) ed.outdentNode(id)
    else ed.indentNode(id)
    nextTick(() => {
      const r = rows.value.find((r) => r.node.id === id)
      if (r) startEdit(r)
    })
  }
}

function onRowClick(row: Row) {
  const ed = props.editor
  if (!ed) return
  ed.select(row.node.id)
  ed.centerOnNode(row.node.id, false)
}

function onRowDblClick(row: Row) {
  startEdit(row)
}

function onToggle(row: Row, e: MouseEvent) {
  e.stopPropagation()
  props.editor?.toggleCollapse(row.node.id)
}

function onCheckbox(row: Row, e: MouseEvent) {
  e.stopPropagation()
  props.editor?.toggleChecked(row.node.id)
}
</script>

<template>
  <div class="outline-panel">
    <div class="panel-title">大纲</div>
    <div class="outline-body">
      <div
        v-for="row in rows"
        :key="row.node.id"
        class="outline-row"
        :class="{ 'is-selected': row.node.id === selectedId, 'is-root-row': row.depth === 0 }"
        :style="{ paddingLeft: `${8 + row.depth * 16}px` }"
        @click="onRowClick(row)"
        @dblclick="onRowDblClick(row)"
      >
        <span
          v-if="row.node.children.length > 0"
          class="row-toggle"
          :class="{ collapsed: row.node.collapsed }"
          @click="onToggle(row, $event)"
          >▸</span
        >
        <span v-else class="row-toggle-placeholder" />
        <span
          v-if="row.node.content.checked !== null"
          class="row-checkbox"
          :class="{ checked: row.node.content.checked }"
          @click="onCheckbox(row, $event)"
          >{{ row.node.content.checked ? '☑' : '☐' }}</span
        >
        <input
          v-if="editingId === row.node.id"
          ref="editInput"
          class="row-edit"
          :default-value="row.node.content.raw"
          @keydown="onEditKeydown($event, row)"
          @blur="commit"
          @click.stop
        />
        <span v-else class="row-text">
          {{ row.node.content.text }}
          <span v-if="row.node.content.link" class="row-badge">↗</span>
          <span v-if="row.node.content.image" class="row-badge">🖼</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outline-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--mm-panel-bg);
  border-right: 1px solid var(--mm-border);
}
.panel-title {
  padding: 6px 12px;
  font-size: 12px;
  color: var(--mm-text-dim);
  border-bottom: 1px solid var(--mm-border);
  user-select: none;
}
.outline-body {
  flex: 1;
  overflow: auto;
  padding: 6px 0;
}
.outline-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  font-size: 13px;
  line-height: 1.7;
  cursor: pointer;
  white-space: nowrap;
  color: var(--mm-text);
}
.outline-row:hover {
  background: var(--mm-hover);
}
.outline-row.is-selected {
  background: var(--mm-selected-bg);
}
.outline-row.is-root-row {
  font-weight: 600;
}
.row-toggle {
  width: 14px;
  flex: none;
  color: var(--mm-text-dim);
  display: inline-block;
  transition: transform 0.12s;
  transform: rotate(90deg);
}
.row-toggle.collapsed {
  transform: rotate(0deg);
}
.row-toggle-placeholder {
  width: 14px;
  flex: none;
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
.row-badge {
  color: var(--mm-text-dim);
  font-size: 11px;
  margin-left: 2px;
}
.row-edit {
  flex: 1;
  min-width: 60px;
  font-size: 13px;
  padding: 1px 4px;
  border: 1px solid var(--mm-accent);
  border-radius: 4px;
  outline: none;
  background: var(--mm-canvas-bg);
  color: var(--mm-text);
}
</style>
