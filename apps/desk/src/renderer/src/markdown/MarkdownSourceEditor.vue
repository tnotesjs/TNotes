<script setup lang="ts">
/**
 * 笔记源码视图（Monaco）。
 *
 * 与可视化编辑器共用同一份 markdown：内容只在用户真的输入时 emit `change`，
 * 外部同步（磁盘重载 / 视图切换回流）不 emit，避免"回声"把父组件状态搅乱。
 *
 * 保留的既有行为（e2e 与用户习惯都依赖）：
 * - 暴露给工具栏的同一组方法（插入 / 包裹 / 行前缀 / 标题编号 / 全选）
 * - 只读时所有入口都被挡住
 * - 粘贴图片交给宿主落地（emit `pasteImage` + 当前插入偏移）
 * - `Mod-\` 剥掉选区内的 Markdown 样式标记
 * - 页宽（标准 / 超宽）与明暗主题跟随应用
 * - 应用菜单的"全选"走 DESK_SELECT_ALL_EVENT
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import {
  loadMonaco,
  monacoThemeName,
  readOnlyEditorOptions,
  refreshMonacoTheme
} from '../monaco/monaco'

import { sourceLineStyleChangesFor } from './clearSourceLineStyles'
import { DESK_SELECT_ALL_EVENT, shouldHandleDeskSelectAll } from './documentSelection'
import { renumberHeadings, stripHeadingNumbers } from '../editor/markdown/headingNumbering'
import {
  insertTextEdit,
  prefixLinesEdit,
  replaceAllEdit,
  setLinePrefixEdit,
  wrapSelectionEdit,
  type TextEdit
} from './sourceEdits'

import type { NotePageWidth, NoteViewMode } from '../../../shared/contracts'
import type * as MonacoApi from 'monaco-editor'

const props = withDefaults(
  defineProps<{
    content: string
    mode: NoteViewMode
    pageWidth?: NotePageWidth
    readOnly: boolean
    knowledgeBaseId: string
    noteUuid: string
    active: boolean
  }>(),
  { pageWidth: 'standard' }
)

const emit = defineEmits<{
  change: [content: string]
  openLink: [url: string]
  openNote: [noteUuid: string]
  pasteImage: [file: File, insertAt: number]
}>()

const host = ref<HTMLElement | null>(null)
let monaco: Awaited<ReturnType<typeof loadMonaco>> | null = null
let editor: MonacoApi.editor.IStandaloneCodeEditor | null = null
let appearanceObserver: MutationObserver | null = null
let resizeObserver: ResizeObserver | null = null
let pasteListener: ((event: ClipboardEvent) => void) | null = null
let disposing = false
/** 外部同步期间不回抛 change（初始化与 props 回流都算） */
let syncing = false

const isEffectivelyReadOnly = (): boolean => props.readOnly || props.mode === 'readonly'

function model(): MonacoApi.editor.ITextModel | null {
  return editor?.getModel() ?? null
}

/** 选区（0 基偏移）→ 供纯函数使用的区间 */
function selectionOffsets(): { from: number; to: number } {
  const current = editor?.getSelection()
  if (!current) return { from: 0, to: 0 }
  return { from: offsetOf(current.getStartPosition()), to: offsetOf(current.getEndPosition()) }
}

function offsetOf(position: MonacoApi.IPosition): number {
  return model()?.getOffsetAt(position) ?? 0
}

function selectionEnd(): number {
  const current = editor?.getSelection()
  if (!current || !model()) return 0
  return model()!.getOffsetAt(current.getEndPosition())
}

/** 应用一次纯函数算出来的编辑，并把选区放回去 */
function applyEdit(edit: TextEdit): void {
  const instance = editor
  const textModel = model()
  if (!instance || !textModel) return
  instance.executeEdits('desk-source', [{ range: rangeOf(edit.from, edit.to), text: edit.insert }])
  instance.setSelection(rangeOf(edit.selectionFrom, edit.selectionTo))
  instance.focus()
}

/** 0 基偏移 → Monaco 区间（用 model 自带换算，避免自己数行） */
function rangeOf(from: number, to: number): MonacoApi.IRange {
  const textModel = model()
  if (!textModel) {
    return { startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 }
  }
  const start = textModel.getPositionAt(from)
  const end = textModel.getPositionAt(to)
  return {
    startLineNumber: start.lineNumber,
    startColumn: start.column,
    endLineNumber: end.lineNumber,
    endColumn: end.column
  }
}

function runEdit(build: (text: string, from: number, to: number) => TextEdit): boolean {
  const textModel = model()
  if (!textModel || isEffectivelyReadOnly()) return false
  const { from, to } = selectionOffsets()
  applyEdit(build(textModel.getValue(), from, to))
  return true
}

function insertTextAt(text: string, position?: number): void {
  const textModel = model()
  if (!textModel || isEffectivelyReadOnly()) return
  const { from } = selectionOffsets()
  applyEdit(insertTextEdit(textModel.getValue(), text, position, from))
}

function wrapSelection(prefix: string, suffix: string, placeholder = '文字'): void {
  runEdit((text, from, to) => wrapSelectionEdit(text, from, to, prefix, suffix, placeholder))
}

function prefixSelection(prefix: string): void {
  runEdit((text, from, to) => prefixLinesEdit(text, from, to, prefix))
}

function setLinePrefix(prefix: string): void {
  runEdit((text, from, to) => setLinePrefixEdit(text, from, to, prefix))
}

function insertTable(): void {
  insertTextAt('\n|  |  |\n| --- | --- |\n|  |  |\n')
}

/** 标题编号：重排（先剥再按上限重编）与剥除，都是单次编辑 → 一步撤销 */
function addHeadingNumbers(maxDepth: number): void {
  const textModel = model()
  if (!textModel || isEffectivelyReadOnly()) return
  const result = renumberHeadings(textModel.getValue(), maxDepth)
  if (!result.changed) return
  applyEdit(replaceAllEdit(textModel.getValue(), result.text))
}

function removeHeadingNumbers(): void {
  const textModel = model()
  if (!textModel || isEffectivelyReadOnly()) return
  const result = stripHeadingNumbers(textModel.getValue())
  if (!result.changed) return
  applyEdit(replaceAllEdit(textModel.getValue(), result.text))
}

/** 清掉选区内行的 Markdown 样式标记（`Mod-\`） */
function clearLineStyles(): boolean {
  const textModel = model()
  if (!textModel || isEffectivelyReadOnly()) return false
  const { from, to } = selectionOffsets()
  const changes = sourceLineStyleChangesFor(textModel.getValue(), from, to)
  if (changes.length === 0) return true
  editor?.executeEdits(
    'desk-clear-line-styles',
    changes.map((change) => ({
      range: rangeOf(change.from, change.to),
      text: change.insert
    }))
  )
  editor?.focus()
  return true
}

/**
 * 定位一处资源引用：在源码里找该相对路径，选中它并滚动到中间。
 *
 * 源码视图的位置就是 markdown 偏移，所以这里可以直接用 indexOf 的偏移。
 */
function revealReference(rawPath: string): boolean {
  const textModel = model()
  if (!editor || !textModel || !rawPath) return false
  const index = textModel.getValue().indexOf(rawPath)
  if (index < 0) return false
  const range = rangeOf(index, index + rawPath.length)
  editor.setSelection(range)
  editor.revealRangeInCenter(range)
  editor.focus()
  return true
}

function selectAll(): void {
  const textModel = model()
  if (!editor || !textModel || !shouldHandleDeskSelectAll(host.value, props.active)) return
  editor.setSelection(textModel.getFullModelRange())
  editor.focus()
}

defineExpose({
  revealReference,
  insertTextAt,
  wrapSelection,
  prefixSelection,
  setLinePrefix,
  insertTable,
  addHeadingNumbers,
  removeHeadingNumbers,
  selectAll
})

/** 应用格式快捷键（与 CodeMirror 版逐一对齐，含 `Mod-\`） */
function bindKeybindings(instance: MonacoApi.editor.IStandaloneCodeEditor): void {
  const bind = (key: number, run: () => void): void => {
    instance.addCommand(key, () => {
      if (isEffectivelyReadOnly()) return
      run()
    })
  }
  bind(monaco!.KeyMod.CtrlCmd | monaco!.KeyCode.KeyB, () => wrapSelection('**', '**'))
  bind(monaco!.KeyMod.CtrlCmd | monaco!.KeyCode.KeyI, () => wrapSelection('*', '*'))
  bind(monaco!.KeyMod.CtrlCmd | monaco!.KeyCode.KeyE, () => wrapSelection('`', '`', '代码'))
  bind(monaco!.KeyMod.CtrlCmd | monaco!.KeyMod.Shift | monaco!.KeyCode.KeyX, () =>
    wrapSelection('~~', '~~')
  )
  bind(monaco!.KeyMod.CtrlCmd | monaco!.KeyMod.Shift | monaco!.KeyCode.Digit7, () =>
    setLinePrefix('1. ')
  )
  bind(monaco!.KeyMod.CtrlCmd | monaco!.KeyMod.Shift | monaco!.KeyCode.Digit8, () =>
    setLinePrefix('- ')
  )
  bind(monaco!.KeyMod.Alt | monaco!.KeyMod.CtrlCmd | monaco!.KeyCode.KeyT, () =>
    setLinePrefix('- [ ] ')
  )
  bind(monaco!.KeyMod.Alt | monaco!.KeyMod.CtrlCmd | monaco!.KeyCode.KeyU, () =>
    setLinePrefix('> ')
  )
  bind(monaco!.KeyMod.Alt | monaco!.KeyMod.CtrlCmd | monaco!.KeyCode.KeyS, () =>
    insertTextAt('\n---\n')
  )
  for (let level = 1; level <= 6; level += 1) {
    const keyCode = monaco!.KeyCode.Digit1 + (level - 1)
    bind(monaco!.KeyMod.Alt | monaco!.KeyMod.CtrlCmd | keyCode, () =>
      setLinePrefix(`${'#'.repeat(level)} `)
    )
  }
  bind(monaco!.KeyMod.Alt | monaco!.KeyMod.CtrlCmd | monaco!.KeyCode.Digit0, () =>
    setLinePrefix('')
  )
  // `Mod-\` 不在 Monaco 默认键位表里，直接在 DOM 层兜（保 readOnly 语义）
  instance.onKeyDown((event) => {
    const isMod = event.metaKey || event.ctrlKey
    if (!isMod || event.browserEvent.key !== '\\') return
    if (clearLineStyles()) event.preventDefault()
  })
}

function handlePaste(event: ClipboardEvent): void {
  const image = [...(event.clipboardData?.items ?? [])]
    .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
    .map((item) => item.getAsFile())
    .find((item): item is File => Boolean(item))
  if (!image) return
  event.preventDefault()
  emit('pasteImage', image, selectionEnd())
}

onMounted(async () => {
  const current = host.value
  if (!current) return
  monaco = await loadMonaco()
  if (disposing || !host.value) return
  syncing = true
  editor = monaco.editor.create(current, {
    ...readOnlyEditorOptions(),
    value: props.content,
    language: 'markdown',
    theme: monacoThemeName(),
    wordWrap: props.pageWidth === 'wide' ? 'off' : 'on',
    wordBasedSuggestions: 'currentDocument',
    links: true,
    readOnly: isEffectivelyReadOnly(),
    domReadOnly: isEffectivelyReadOnly(),
    fontFamily: cssFontMono()
  })
  syncing = false
  bindKeybindings(editor)
  editor.onDidChangeModelContent(() => {
    if (syncing) return
    const textModel = model()
    if (textModel) emit('change', textModel.getValue())
  })

  pasteListener = handlePaste
  editor.getContainerDomNode().addEventListener('paste', pasteListener, true)
  window.addEventListener(DESK_SELECT_ALL_EVENT, selectAll)

  appearanceObserver = new MutationObserver(async (changes) => {
    if (!changes.some((change) => change.attributeName === 'data-theme')) return
    const api = monaco ?? (await loadMonaco())
    refreshMonacoTheme(api)
  })
  appearanceObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })
  resizeObserver = new ResizeObserver(() => {
    if (props.active) editor?.layout()
  })
  resizeObserver.observe(current)
})

function cssFontMono(): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim()
  return value || 'ui-monospace, SFMono-Regular, Menlo, monospace'
}

watch(
  () => props.content,
  (content) => {
    const textModel = model()
    if (!textModel || content === textModel.getValue()) return
    const selection = editor?.getSelection()
    const scrollTop = editor?.getScrollTop() ?? 0
    syncing = true
    textModel.setValue(content)
    syncing = false
    if (selection && editor) {
      const nextSelection = clampSelection(selection)
      editor.setSelection(nextSelection)
      editor.setScrollTop(scrollTop)
    }
  }
)

/** 外部内容变短时把旧选区收进新文档，避免越界 */
function clampSelection(selection: MonacoApi.Selection): MonacoApi.Selection {
  const textModel = model()
  if (!textModel) return selection
  const maxOffset = textModel.getValueLength()
  const from = Math.min(offsetOf(selection.getStartPosition()), maxOffset)
  const to = Math.min(offsetOf(selection.getEndPosition()), maxOffset)
  const range = rangeOf(from, to)
  return new monaco!.Selection(
    range.startLineNumber,
    range.startColumn,
    range.endLineNumber,
    range.endColumn
  )
}

watch(
  () => [props.mode, props.readOnly] as const,
  () => {
    const readOnly = isEffectivelyReadOnly()
    editor?.updateOptions({ readOnly, domReadOnly: readOnly })
  }
)

watch(
  () => props.pageWidth,
  (pageWidth) => {
    editor?.updateOptions({ wordWrap: pageWidth === 'wide' ? 'off' : 'on' })
    void nextTick(() => editor?.layout())
  }
)

watch(
  () => props.active,
  (active) => {
    if (active) void nextTick(() => requestAnimationFrame(() => editor?.layout()))
  }
)

onBeforeUnmount(() => {
  disposing = true
  window.removeEventListener(DESK_SELECT_ALL_EVENT, selectAll)
  if (pasteListener && editor) {
    editor.getContainerDomNode().removeEventListener('paste', pasteListener, true)
  }
  pasteListener = null
  appearanceObserver?.disconnect()
  appearanceObserver = null
  resizeObserver?.disconnect()
  resizeObserver = null
  editor?.dispose()
  editor = null
})
</script>

<template>
  <div
    ref="host"
    class="markdown-source-editor"
    :class="{ 'is-wide': pageWidth === 'wide' }"
    data-testid="markdown-source-editor"
  />
</template>

<style scoped>
.markdown-source-editor {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--editor-bg);
  color: var(--editor-text);
}

/* 标准页宽：编辑器整体居中收窄（Monaco 的行号与内容一起居中，视觉与旧版一致） */
.markdown-source-editor :deep(.monaco-editor) {
  max-width: 940px;
  margin-inline: auto;
}

.markdown-source-editor.is-wide :deep(.monaco-editor) {
  max-width: none;
}

.markdown-source-editor :deep(.monaco-editor .margin),
.markdown-source-editor :deep(.monaco-editor .monaco-editor-background) {
  background: inherit;
}
</style>
