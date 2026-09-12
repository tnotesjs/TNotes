<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Crepe } from '@milkdown/crepe'
import {
  editorViewCtx,
  commandsCtx,
  remarkPluginsCtx,
  remarkStringifyOptionsCtx,
  serializerCtx
} from '@milkdown/kit/core'
import { uploadConfig } from '@milkdown/kit/plugin/upload'
import { blockConfig } from '@milkdown/kit/plugin/block'
import { Plugin, TextSelection } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'
import {
  buildTNotesSlashGroup,
  installSlashMenuPresentation,
  TN_NOTES_SLASH_ITEMS
} from './slashMenu'
import { buildExcalidrawSource } from '../editor/markdown/excalidrawComponent'
import { createExcalidrawClipboardPlugin } from './excalidrawClipboardPlugin'
import { noteRelativeAssetPath } from './noteAssetPath'
import { useWorkspaceStore } from '../stores/workspace'
import { documentKey, type DocumentSession } from '../stores/workspace/helpers'
import type { SlashMenuItem } from './slashMenu'
import {
  createBlockShortcutPlugin,
  createMarkdownShortcutInputRules,
  replaceCurrentParagraphWithItem
} from './markdownInputRules'
import { clearRawBlockSelectionState, createRawBlockSelectionPlugin } from './rawBlockInteractions'
import { createTableCaretPlugin } from './tableCaretVisibility'
import { breakMarkdown, remarkHtmlBreakToBreak } from '../editor/markdown/htmlBreak'
import { isEditorBlankTarget } from './editorFocusReclaim'
import { createReadonlyTransactionGuard } from './readonlyGuard'
import { clearLineStylesPlugin } from './clearLineStyles'
import { createInlineCodeInteractionPlugin, toggleDeskInlineCode } from './inlineCodeInteractions'
import { wrapInTaskList } from './taskList'
import { insertDefaultTable } from './insertDefaultTable'
import { formatIconSvg } from '../components/formatIcons'
import {
  createCodeBlockCommand,
  toggleEmphasisCommand,
  toggleLinkCommand,
  toggleStrongCommand,
  turnIntoTextCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInHeadingCommand,
  wrapInOrderedListCommand,
  clearTextInCurrentBlockCommand
} from '@milkdown/kit/preset/commonmark'
import { strikethroughKeymap, toggleStrikethroughCommand } from '@milkdown/kit/preset/gfm'
import { $prose, callCommand, insert, insertPos, replaceAll } from '@milkdown/kit/utils'
import GithubSlugger from 'github-slugger'

import BlockActionMenu from './BlockActionMenu.vue'
import NoteOutline from './NoteOutline.vue'
import {
  activeOutlineHeadingId,
  collectNoteOutlineHeadings,
  headingElementById,
  type NoteOutlineHeading
} from './noteOutline'
import type { BlockAction } from './BlockActionMenu.vue'
import {
  canShowBlockHandle,
  createBlockDeleteTransaction,
  installBlockHandleClickController,
  resolveBlockActionTarget,
  serializeBlockForClipboard,
  type BlockHandleClickTarget
} from './blockActionMenu'
import { createDocumentSelectAllPlugin } from './documentSelection'
import { createCodeBlockTitlePlugin } from './codeBlockTitlePlugin'
import { createCodeBlockLatexPreviewPlugin } from './codeBlockLatexPreview'
import { createCodeBlockHighlightBundle } from './codeBlockHighlightPlugin'
import { CHECK_ICON, COPY_ICON } from './copyIcons'
import { exitCodeBlockFullscreen, toggleCodeBlockFullscreen } from './codeBlockFullscreen'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'

import { deskCodeMirrorLanguages } from '../editor/markdown/codeMirrorLanguages'
import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins
} from '../editor/markdown/rawBlockProjection'
import { serializeDeskCalloutMdast } from '../editor/markdown/deskCallout'
import { reconcileMarkdownSource } from '../editor/markdown/sourcePreservation'
import { findAbsorbedBlocks } from '../editor/markdown/projectionFidelity'
import { renumberHeadings, stripHeadingNumbers } from '../editor/markdown/headingNumbering'
import { clampViewPosition } from '../editor/markdown/noteViewPosition'
import { flushPendingEdits } from '../editor/markdown/pendingEdits'
import { createDeskRawBlockView } from './createDeskRawBlockView'
import { createDeskCalloutView, deskCalloutKeymapPlugin } from './deskCalloutView'
import { imageAttrPlugins } from '../editor/markdown/imageAttrs'
import { createDeskImageView } from '../editor/markdown/deskImageView'
import { resolvePastedImageWidth } from '../editor/markdown/pasteImageWidth'
import { standaloneImageParagraphPlugin } from '../editor/markdown/standaloneImageParagraph'
import {
  applyHeadingFoldCommand,
  createHeadingSectionCollapsePlugin,
  expandCollapsedSectionsContaining,
  type HeadingFoldCommand
} from './headingSectionCollapse'
import {
  createListItemCollapsePlugin,
  expandCollapsedListItemsContaining
} from './listItemCollapse'
import { createBlockBoundaryCaretPlugin } from './blockBoundaryCaret'
import {
  createBlockBoundaryNavigationPlugin,
  type BlockBoundaryNavigationOptions
} from './blockBoundaryNavigation'

import type { NotePageWidth, NoteTocDisplay, NoteViewMode } from '../../../shared/contracts'

const props = withDefaults(
  defineProps<{
    content: string
    mode: NoteViewMode
    pageWidth?: NotePageWidth
    outlineVisible?: boolean
    tocDisplay?: NoteTocDisplay
    readOnly: boolean
    knowledgeBaseId: string
    noteUuid: string
    active: boolean
    uploadImage: (file: File) => Promise<{ src: string; alt: string }>
  }>(),
  { pageWidth: 'standard', outlineVisible: true, tocDisplay: 'expanded' }
)

const emit = defineEmits<{
  change: [content: string]
  openLink: [url: string]
  openNote: [noteUuid: string]
  fatal: [message: string]
  headingLevelChange: [level: number | null]
}>()

const host = ref<HTMLElement | null>(null)
const outlineHeadings = ref<NoteOutlineHeading[]>([])
const outlineActiveId = ref<string | null>(null)
let crepe: Crepe | null = null
let destroyed = false
let ready = false
let synchronizing = false
let originalSource = props.content
let baselineCanonical = ''
let lastEmitted: string | null = null
let contentSyncQueued = false
let slashMenuPresentationCleanup: (() => void) | null = null
let blockHandleClickCleanup: (() => void) | null = null
const rawSourceReadonlyListeners = new Set<(readOnly: boolean) => void>()

interface BlockActionMenuState extends BlockHandleClickTarget {
  x: number
  y: number
}

const blockActionMenu = ref<BlockActionMenuState | null>(null)
let addBelowMenuOpened = false

function isEffectivelyReadOnly(): boolean {
  return props.readOnly || props.mode === 'readonly'
}

/** 当前笔记的文档会话（剪贴板归属判断与相对路径都要用）。 */
function currentNoteSession(): DocumentSession | undefined {
  const workspace = useWorkspaceStore()
  return workspace.documents[documentKey(props.knowledgeBaseId, props.noteUuid)]
}

function editorView(): EditorView | null {
  return crepe?.editor.action((ctx) => ctx.get(editorViewCtx)) ?? null
}

function reportHeadingLevel(view: EditorView): void {
  const node = view.state.selection.$from.parent
  emit(
    'headingLevelChange',
    node.type.name === 'heading'
      ? Number(node.attrs.level)
      : node.type.name === 'paragraph'
        ? 0
        : null
  )
}

function positionBlockActionMenu(target: BlockHandleClickTarget): BlockActionMenuState {
  const width = 224
  const estimatedHeight = 176
  const gap = 6
  const x = Math.max(8, Math.min(target.handleRect.left, window.innerWidth - width - 8))
  const below = target.handleRect.bottom + gap
  const y =
    below + estimatedHeight <= window.innerHeight - 8
      ? below
      : Math.max(8, target.handleRect.top - estimatedHeight - gap)
  return {
    ...target,
    x,
    y
  }
}

function openBlockActionMenu(target: BlockHandleClickTarget): void {
  if (isEffectivelyReadOnly()) return
  addBelowMenuOpened = false
  blockActionMenu.value = positionBlockActionMenu(target)
}

function closeBlockActionMenu(focusEditor = true): void {
  if (!blockActionMenu.value) return
  blockActionMenu.value = null
  addBelowMenuOpened = false
  if (focusEditor) editorView()?.focus()
}

function currentBlockTarget(): { view: EditorView; position: number; dom: HTMLElement } | null {
  const menu = blockActionMenu.value
  const view = editorView()
  if (!menu || !view) return null
  const target = resolveBlockActionTarget(view, menu)
  return target ? { view, ...target } : null
}

function deleteCurrentBlock(): void {
  if (isEffectivelyReadOnly()) return closeBlockActionMenu(false)
  const target = currentBlockTarget()
  if (!target) return closeBlockActionMenu()
  const transaction = createBlockDeleteTransaction(target.view.state, target.position)
  if (transaction) target.view.dispatch(transaction)
  closeBlockActionMenu()
}

async function writeClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // Electron can expose Clipboard without granting the renderer's async
      // Clipboard permission. Fall through to the synchronous user-gesture
      // path so the menu action still works.
    }
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.append(textarea)
  textarea.select()
  document.execCommand('copy')
  textarea.remove()
}

/** CodeMirror splits lines into `.cm-line` divs; parent textContent drops newlines. */
function readCodeBlockPlainText(block: Element): string {
  const lines = block.querySelectorAll('.cm-line')
  if (lines.length > 0) {
    return Array.from(lines, (line) => line.textContent ?? '').join('\n')
  }
  return block.querySelector('pre, code')?.textContent ?? ''
}

/** 块边界光标上的 Mod+C / Mod+X：复制/剪切整块的 markdown 源码。 */
const boundaryOptions: BlockBoundaryNavigationOptions = {
  copyBlockAt: (view, position, cut) => {
    if (!crepe) return false
    const text = crepe.editor.action((ctx) =>
      serializeBlockForClipboard(view.state, position, ctx.get(serializerCtx))
    )
    if (text === null || text === undefined) return false
    void writeClipboard(text)
    if (cut) {
      const tr = createBlockDeleteTransaction(view.state, position)
      if (tr) view.dispatch(tr)
    }
    return true
  }
}

async function copyCurrentBlock(cut = false): Promise<boolean> {
  const menu = blockActionMenu.value
  const target = currentBlockTarget()
  const node = target?.view.state.doc.nodeAt(target.position)
  if (!target || !node || !crepe) return false
  const text = crepe.editor.action((ctx) =>
    serializeBlockForClipboard(target.view.state, target.position, ctx.get(serializerCtx))
  )
  if (text === null) return false
  await writeClipboard(text)
  if (cut && blockActionMenu.value === menu) {
    const current = resolveBlockActionTarget(target.view, target)
    if (current?.node.eq(node)) deleteCurrentBlock()
  }
  return true
}

function openAddBelowMenu(): void {
  if (isEffectivelyReadOnly() || addBelowMenuOpened || !blockActionMenu.value || !host.value) return
  const addButton = host.value.querySelector<HTMLElement>(
    '.milkdown-block-handle[data-show="true"] .operation-item:first-child'
  )
  if (!addButton) return
  addBelowMenuOpened = true
  addButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }))
}

async function handleBlockAction(action: BlockAction): Promise<void> {
  if (isEffectivelyReadOnly()) return closeBlockActionMenu(false)
  if (action === 'delete') return deleteCurrentBlock()
  if (action === 'copy') {
    await copyCurrentBlock()
    return closeBlockActionMenu()
  }
  if (action === 'cut') {
    await copyCurrentBlock(true)
    return
  }
  if (action === 'add-below') openAddBelowMenu()
}

function handleBlockMenuOutsidePointer(event: PointerEvent): void {
  if (!blockActionMenu.value) return
  const target = event.target as Element | null
  if (target?.closest('.desk-block-action-menu, .milkdown-block-handle, .milkdown-slash-menu'))
    return
  closeBlockActionMenu(false)
}

function handleBlockMenuDocumentPointerUp(event: PointerEvent): void {
  const target = event.target as Element | null
  if (target?.closest('.milkdown-slash-menu li[data-index]')) {
    closeBlockActionMenu(false)
  }
}

function run(action: (editor: Crepe) => void): boolean {
  if (!crepe || !ready || isEffectivelyReadOnly()) return false
  action(crepe)
  focus()
  return true
}

function command(commandKey: { key: unknown }, payload?: unknown): boolean {
  return run((editor) => {
    editor.editor.action(callCommand(commandKey.key as never, payload as never))
  })
}

function insertTextAt(text: string, position?: number): void {
  run((editor) => {
    if (typeof position === 'number' && position >= 0) {
      editor.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        const safePosition = Math.min(position, view.state.doc.content.size)
        insertPos(text, safePosition, true)(ctx)
      })
      return
    }
    editor.editor.action(insert(text))
  })
}

function wrapSelection(prefix: string, suffix: string, placeholder = '文字'): void {
  const marker = `${prefix}\u0000${suffix}`
  if (marker === '**\u0000**') {
    command(toggleStrongCommand)
    return
  }
  if (marker === '*\u0000*') {
    command(toggleEmphasisCommand)
    return
  }
  if (marker === '`\u0000`') {
    run((editor) => {
      editor.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        toggleDeskInlineCode(view.state, view.dispatch)
      })
    })
    return
  }
  if (marker === '~~\u0000~~') {
    command(toggleStrikethroughCommand)
    return
  }
  if (prefix === '[' && suffix.startsWith('](')) {
    const hasSelection = crepe?.editor.action(
      (ctx) => !ctx.get(editorViewCtx).state.selection.empty
    )
    if (!hasSelection) {
      insertTextAt(`${prefix}${placeholder}${suffix}`)
      return
    }
    command(toggleLinkCommand, { href: 'https://', title: '' })
    return
  }
  insertTextAt(`${prefix}${placeholder}${suffix}`)
}

function prefixSelection(prefix: string): void {
  if (prefix.trim() === '>') command(wrapInBlockquoteCommand)
  else insertTextAt(prefix)
}

function setLinePrefix(prefix: string): void {
  const heading = prefix.match(/^(#{1,6})\s$/)
  if (heading) {
    command(wrapInHeadingCommand, heading[1].length)
    return
  }
  if (!prefix) {
    command(turnIntoTextCommand)
    return
  }
  if (prefix === '> ') {
    command(wrapInBlockquoteCommand)
    return
  }
  if (prefix === '- ') {
    command(wrapInBulletListCommand)
    return
  }
  if (prefix === '- [ ] ') {
    run((editor) =>
      editor.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        wrapInTaskList(view.state, view.dispatch, view)
      })
    )
    return
  }
  if (prefix === '1. ') {
    command(wrapInOrderedListCommand)
    return
  }
  insertTextAt(prefix)
}

function insertCodeBlock(language = 'ts'): void {
  command(createCodeBlockCommand, language)
}

function insertTable(): void {
  run((editor) => editor.editor.action((ctx) => insertDefaultTable(ctx)))
}

/**
 * 0005：斜杠菜单的 TNotes 项被选中时插入内容。
 * - tip/info/warning/danger：插入 deskCallout（标题可编辑，正文走普通块）。
 * - details / 导图 / 组件 / 代码组 / swiper：插入 deskRawBlock，
 *   并自动打开新插入块的「编辑源码」。
 * - 普通代码块：走 Crepe 代码块（createCodeBlockCommand）。
 */
function runSlashItemInsert(item: SlashMenuItem): void {
  if (item.id === 'excalidraw') {
    void insertExcalidrawComponent()
    return
  }
  if (item.kind === 'code') {
    run((editor) => {
      editor.editor.action((ctx) => {
        const commands = ctx.get(commandsCtx)
        // The toolbar command intentionally preserves paragraph text. A slash
        // insertion must first remove its `/query`, just like Crepe's own menu.
        commands.call(clearTextInCurrentBlockCommand.key)
        commands.call(createCodeBlockCommand.key, 'js')
      })
    })
    return
  }

  // 斜杠菜单和块级快捷输入必须保留同一份 insert（包括末尾换行），
  // 因而两条入口都直接用 replaceCurrentParagraphWithItem 创建节点。
  // 新块定位：插入前后各取一次 deskRawBlock 原子的文档 pos 列表，
  // 通过「前缀 + 后缀」对齐找出新增原子（插入发生在文档任意位置，不能
  // 假设在末尾——例如用户在文档中间的空段落里打 `/`）。
  let newBlockPos: number | null = null
  run((editor) => {
    editor.editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const before = rawBlockPositions(view.state.doc)
      const transaction = replaceCurrentParagraphWithItem(
        view.state,
        item,
        view.state.selection.from
      )
      if (!transaction) return
      view.dispatch(transaction)
      const after = rawBlockPositions(view.state.doc)
      newBlockPos = findAddedBlockPos(before, after)
    })
  })

  if (newBlockPos != null) openRawSourceEditorAt(newBlockPos)
}

/**
 * 插入 Excalidraw 画布（计划 E6）。
 *
 * 顺序固定为「先让主进程建文件，成功后再定点插入组件」：
 * - 笔记必须有四位编号，否则不创建（文件名归属靠它）
 * - 创建成功但插入失败时报告文件位置，文件保留（不自动删除）
 * - 撤销/重做只作用在组件调用上，不会删资源、也不会再建第二份文件
 */
async function insertExcalidrawComponent(): Promise<void> {
  const workspace = useWorkspaceStore()
  const session = workspace.documents[documentKey(props.knowledgeBaseId, props.noteUuid)]
  const noteRelPath = session?.document.relPath
  const noteIndex = session?.document.index ?? ''
  if (!noteRelPath) {
    workspace.error = '无法定位当前笔记，画布未创建'
    return
  }
  if (!/^\d{4}$/.test(noteIndex)) {
    workspace.error = '当前笔记缺少四位编号，画布未创建（文件名归属需要它）'
    return
  }
  const created = await window.desk.excalidraw.create({
    knowledgeBaseId: props.knowledgeBaseId,
    noteUuid: props.noteUuid
  })
  if (!created.ok) {
    workspace.error = `无法创建画布：${created.error.message}`
    return
  }
  const createdRelPath = created.value.relPath
  const relative = noteRelativeAssetPath(noteRelPath, createdRelPath)
  if (!relative) {
    workspace.error = `画布已创建但无法计算相对路径，请在资源面板找到它：${createdRelPath}`
    return
  }
  const position = insertRawBlockSource(buildExcalidrawSource({ path: relative }))
  if (position == null) {
    workspace.error = `画布已创建但插入组件失败，请在资源面板找到它：${createdRelPath}`
    return
  }
  workspace.status = `已创建画布 ${createdRelPath}`
  openExcalidrawEditorAt(position)
}

/** 用给定源码插入一个 raw 原子；返回新原子位置（失败返回 null）。 */
function insertRawBlockSource(source: string): number | null {
  let newBlockPos: number | null = null
  run((editor) => {
    editor.editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const before = rawBlockPositions(view.state.doc)
      const transaction = replaceCurrentParagraphWithItem(
        view.state,
        {
          ...(TN_NOTES_SLASH_ITEMS.find((entry) => entry.id === 'excalidraw') as SlashMenuItem),
          insert: source
        },
        view.state.selection.from
      )
      if (!transaction) return
      view.dispatch(transaction)
      const after = rawBlockPositions(view.state.doc)
      newBlockPos = findAddedBlockPos(before, after)
    })
  })
  return newBlockPos
}

/** 新插入的画布卡片直接进入编辑（与其它组件插入后打开编辑一致）。 */
function openExcalidrawEditorAt(position: number): void {
  if (isEffectivelyReadOnly()) return
  let attempts = 0
  const tryOpen = (): void => {
    attempts += 1
    const view = crepe?.editor.action((ctx) => ctx.get(editorViewCtx))
    const dom = view?.nodeDOM(position)
    if (!(dom instanceof HTMLElement)) {
      if (attempts >= 20) window.clearInterval(pollTimer)
      return
    }
    const editButton = dom.querySelector<HTMLButtonElement>('.desk-excalidraw [data-action="edit"]')
    if (!editButton) {
      if (attempts >= 20) window.clearInterval(pollTimer)
      return
    }
    editButton.click()
    window.clearInterval(pollTimer)
  }
  const pollTimer = window.setInterval(tryOpen, 50)
  tryOpen()
}

/**
 * Raw NodeViews mount after their insertion transaction. Poll briefly, then
 * open and focus the inline source editor. Both slash insertion (0005) and
 * block shortcuts (0006) use this exact interaction path.
 */
function openRawSourceEditorAt(position: number): void {
  if (isEffectivelyReadOnly()) return
  let attempts = 0
  const tryOpen = (): void => {
    attempts += 1
    const view = crepe?.editor.action((ctx) => ctx.get(editorViewCtx))
    if (!view) {
      if (attempts >= 20) window.clearInterval(pollTimer)
      return
    }
    const dom = view.nodeDOM(position)
    if (!(dom instanceof HTMLElement)) {
      if (attempts >= 20) window.clearInterval(pollTimer)
      return
    }
    const editButton = dom.querySelector<HTMLButtonElement>('.desk-raw-block__edit')
    if (!editButton) {
      if (attempts >= 20) window.clearInterval(pollTimer)
      return
    }
    editButton.click()
    window.clearInterval(pollTimer)
  }
  const pollTimer = window.setInterval(tryOpen, 50)
  tryOpen()
}

/** 文档中所有 deskRawBlock 原子的 (pos, kind, source, hidden)，按文档序。 */
function rawBlockPositions(doc: {
  descendants: (
    fn: (node: { type: { name: string }; attrs: Record<string, unknown> }, pos: number) => void
  ) => void
}): Array<{ pos: number; signature: string }> {
  const found: Array<{ pos: number; signature: string }> = []
  doc.descendants((node, pos) => {
    if (node.type.name !== 'deskRawBlock') return
    found.push({
      pos,
      signature: `${String(node.attrs.kind)}\u0000${String(node.attrs.hidden)}\u0000${String(node.attrs.source)}`
    })
  })
  return found
}

/**
 * 插入前后 pos 列表 diff：返回第一个新增原子的 pos。
 * 用「前缀相同 + 后缀相同」对齐：新增项位于两者之间。
 */
function findAddedBlockPos(
  before: Array<{ pos: number; signature: string }>,
  after: Array<{ pos: number; signature: string }>
): number | null {
  const beforeSigs = before.map((item) => item.signature)
  const afterSigs = after.map((item) => item.signature)
  // 前缀对齐
  let prefix = 0
  while (
    prefix < beforeSigs.length &&
    prefix < afterSigs.length &&
    beforeSigs[prefix] === afterSigs[prefix]
  ) {
    prefix += 1
  }
  // 后缀对齐（不含已对齐前缀）
  let suffix = 0
  while (
    suffix < beforeSigs.length - prefix &&
    suffix < afterSigs.length - prefix &&
    beforeSigs[beforeSigs.length - 1 - suffix] === afterSigs[afterSigs.length - 1 - suffix]
  ) {
    suffix += 1
  }
  const addedCount = afterSigs.length - beforeSigs.length
  if (addedCount <= 0) return null
  // 插入位置 = 前缀 + 新增项序号；返回第一个新增的 pos。
  const index = prefix
  if (index >= after.length) return null
  return after[index].pos
}

function focus(): void {
  if (!crepe || !ready || isEffectivelyReadOnly()) return
  crepe.editor.action((ctx) => ctx.get(editorViewCtx).focus())
}

function applyReadonlyState(): void {
  const readOnly = isEffectivelyReadOnly()
  if (readOnly) {
    flushPendingEdits(props.knowledgeBaseId, props.noteUuid, { requireClean: false })
    flushCurrentContent()
  }
  crepe?.setReadonly(readOnly)
  rawSourceReadonlyListeners.forEach((listener) => listener(readOnly))
  if (!readOnly) return

  closeBlockActionMenu(false)
  // `crepe` is assigned before `editor.create()` resolves; until then the editor
  // view ctx still holds Milkdown's placeholder — a non-null object without
  // `state`. Require a ready editor with an initialized view before touching it.
  const view = editorView()
  if (!ready || !view?.state) return
  clearRawBlockSelectionState(view)
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement && view.dom.contains(activeElement)) {
    activeElement.blur()
  }
  view.dom.blur()
}

function applyGeneratedTocDisplay(): void {
  const collapsed = props.tocDisplay === 'collapsed'
  for (const toc of host.value?.querySelectorAll<HTMLElement>('.desk-generated-toc') ?? []) {
    toc.classList.toggle('is-collapsed', collapsed)
    const toggle = toc.querySelector<HTMLButtonElement>('.desk-generated-toc__toggle')
    toggle?.setAttribute('aria-expanded', String(!collapsed))
    toggle?.setAttribute('aria-label', collapsed ? '展开目录' : '折叠目录')
  }
}

defineExpose({
  insertTextAt,
  wrapSelection,
  prefixSelection,
  setLinePrefix,
  insertCodeBlock,
  insertTable,
  addHeadingNumbers,
  removeHeadingNumbers,
  applyHeadingFold,
  focus,
  flush
})

const githubSlugger = new GithubSlugger()

function headingElementText(element: HTMLElement): string {
  return (element.textContent ?? '').replace(/\s+#+\s*$/, '').trim()
}

function resolveHeadingTarget(targetId: string): HTMLElement | null {
  const root = host.value
  if (!root) return null

  // Milkdown assigns heading ids with a rule that diverges from the TOC anchors
  // (e.g. `1. 本节内容` -> `1.-本节内容` versus the canonical `1-本节内容`).
  // Prefer an exact id match, then fall back to a fresh canonical slug match.
  const byExplicitId = [...root.querySelectorAll<HTMLElement>('[id]')].find(
    (element) => element.id === targetId
  )
  if (byExplicitId) return byExplicitId

  let fallback: HTMLElement | null = null
  for (const element of [...root.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6')]) {
    if (githubSlugger.slug(headingElementText(element)) === targetId) {
      fallback = element
      break
    }
  }
  return fallback
}

function refreshOutline(): void {
  if (!ready || destroyed) return
  const root = host.value
  if (!root) {
    outlineHeadings.value = []
    outlineActiveId.value = null
    return
  }
  try {
    outlineHeadings.value = collectNoteOutlineHeadings(root)
    outlineActiveId.value = activeOutlineHeadingId(root, outlineHeadings.value)
  } catch {
    // Outline is decorative; never take down the editor.
  }
}

function syncOutlineActive(): void {
  const root = host.value
  if (!root) return
  outlineActiveId.value = activeOutlineHeadingId(root, outlineHeadings.value)
}

function scrollToOutlineHeading(id: string): void {
  const root = host.value
  const target = (root ? headingElementById(root, id) : null) ?? resolveHeadingTarget(id)
  const view = editorView()
  if (view && target) {
    try {
      expandCollapsedSectionsContaining(view, view.posAtDOM(target, 0))
    } catch {
      // posAtDOM can throw if the heading is mid-remap; scrolling still helps.
    }
  }
  target?.scrollIntoView({ block: 'start' })
  outlineActiveId.value = id
}

function handleClick(event: MouseEvent): void {
  if (!(event.target instanceof Element)) return

  // Crepe/Milkdown Copy uses navigator.clipboard.writeText and only sync-catches
  // failures, so Electron's async NotAllowedError never falls back. Intercept
  // in capture and use Desk's permission-safe path instead.
  const expandButton = event.target.closest('.milkdown-code-block .desk-code-expand')
  if (expandButton instanceof HTMLElement) {
    event.preventDefault()
    event.stopPropagation()
    const block = expandButton.closest('.milkdown-code-block')
    if (block instanceof HTMLElement) toggleCodeBlockFullscreen(block, expandButton)
    return
  }

  const copyButton = event.target.closest('.milkdown-code-block .copy-button')
  if (copyButton instanceof HTMLElement) {
    event.preventDefault()
    event.stopPropagation()
    const block = copyButton.closest('.milkdown-code-block')
    const text = block ? readCodeBlockPlainText(block) : ''
    void writeClipboard(text)
      .then(() => {
        copyButton.dataset.copied = 'true'
        copyButton.innerHTML = CHECK_ICON
        copyButton.setAttribute('aria-label', '已复制')
        window.setTimeout(() => {
          delete copyButton.dataset.copied
          copyButton.innerHTML = COPY_ICON
          copyButton.setAttribute('aria-label', '复制代码')
        }, 1200)
      })
      .catch(() => {
        /* writeClipboard already falls back; ignore residual errors */
      })
    return
  }

  const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor) return
  const href = anchor.getAttribute('href') ?? ''

  // NotesTable rows use desk-note://<uuid> so clicks open the note in Desk.
  if (href.startsWith('desk-note://')) {
    event.preventDefault()
    event.stopPropagation()
    let noteUuid = href.slice('desk-note://'.length)
    try {
      noteUuid = decodeURIComponent(noteUuid)
    } catch {
      /* keep raw */
    }
    if (noteUuid) emit('openNote', noteUuid)
    return
  }

  if (href.startsWith('#')) {
    event.preventDefault()
    let targetId = href.slice(1)
    try {
      targetId = decodeURIComponent(targetId)
    } catch {
      // Keep malformed hashes comparable to the literal heading id.
    }
    const target = resolveHeadingTarget(targetId)
    target?.scrollIntoView({ block: 'start' })
    return
  }
  if (!isEffectivelyReadOnly() && !event.metaKey && !event.ctrlKey) return
  event.preventDefault()
  emit('openLink', href)
}

/**
 * 点击编辑器面板里的空白区（可编辑区之外：正文列左右留白、上下 padding）时，
 * 浏览器会把焦点交给 `BODY` 并留下一个不响应的旧选区。这里主动把焦点收回编辑器，
 * 并把光标放到点击位置最近的文档位置——与「点正文空白继续写」的常规手感一致。
 */
function handleCanvasMousedown(event: MouseEvent): void {
  if (isEffectivelyReadOnly()) return
  const root = host.value
  if (!root || !(event.target instanceof Element)) return
  if (!isEditorBlankTarget(event.target, root)) return
  const view = editorView()
  if (!view || !view.editable) return
  event.preventDefault()
  const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
  const doc = view.state.doc
  const pos = coords ? Math.max(0, Math.min(coords.pos, doc.content.size)) : doc.content.size
  const bias = coords && pos < doc.content.size ? 1 : -1
  view.dispatch(view.state.tr.setSelection(TextSelection.near(doc.resolve(pos), bias)))
  closeBlockActionMenu(false)
  view.focus()
}

function handleKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape' || event.defaultPrevented) return
  const root = host.value
  if (!root?.querySelector('.milkdown-code-block.is-fullscreen')) return
  event.preventDefault()
  exitCodeBlockFullscreen(root)
}

function flushCurrentContent(editor = crepe): void {
  if (!editor || !ready || synchronizing || destroyed) return
  const markdown = editor.getMarkdown()
  const preserved = reconcileMarkdownSource(originalSource, baselineCanonical, markdown)
  // 保存守卫：原文里某段内容被并进了别的块（吞并）—— 这是会丢数据的结构，坚决不写盘。
  // 用户的编辑仍在文档里；切到源码视图可以直接改，或把那段内容改回独立块再保存。
  const absorbed = findAbsorbedBlocks(originalSource, preserved)
  if (absorbed.length > 0) {
    console.error('[desk] 保存被拦截：检测到原文内容被并入其它块', absorbed)
    useWorkspaceStore().status = `检测到 ${absorbed.length} 处内容会被写坏，已暂停保存；你的文件没有被修改（可切到源码视图检查）`
    return
  }
  if (preserved === props.content || preserved === lastEmitted) return
  lastEmitted = preserved
  emit('change', preserved)
}

/** Commit block-local Edit drafts, then emit. Call before leaving visual mode. */
function flush(): void {
  flushPendingEdits(props.knowledgeBaseId, props.noteUuid, { requireClean: false })
  flushCurrentContent()
}

/**
 * 标题编号：重排（先剥再按上限重编）与剥除。
 * replaceAll 是单个 ProseMirror 事务，一步撤销；随后刷新基线并 emit。
 */
function addHeadingNumbers(maxDepth: number): void {
  if (!crepe || !ready || isEffectivelyReadOnly()) return
  flushPendingEdits(props.knowledgeBaseId, props.noteUuid, { requireClean: false })
  const preserved = reconcileMarkdownSource(originalSource, baselineCanonical, crepe.getMarkdown())
  const result = renumberHeadings(preserved, maxDepth)
  if (!result.changed) return
  crepe.editor.action(replaceAll(projectRawBlocksForMilkdown(result.text), true))
  originalSource = result.text
  baselineCanonical = crepe.getMarkdown()
  applyGeneratedTocDisplay()
  refreshOutline()
  flushCurrentContent()
  focus()
}

function removeHeadingNumbers(): void {
  if (!crepe || !ready || isEffectivelyReadOnly()) return
  flushPendingEdits(props.knowledgeBaseId, props.noteUuid, { requireClean: false })
  const preserved = reconcileMarkdownSource(originalSource, baselineCanonical, crepe.getMarkdown())
  const result = stripHeadingNumbers(preserved)
  if (!result.changed) return
  crepe.editor.action(replaceAll(projectRawBlocksForMilkdown(result.text), true))
  originalSource = result.text
  baselineCanonical = crepe.getMarkdown()
  applyGeneratedTocDisplay()
  refreshOutline()
  flushCurrentContent()
  focus()
}

function applyHeadingFold(command: HeadingFoldCommand): boolean {
  const view = editorView()
  if (!view) return false
  const transaction = applyHeadingFoldCommand(view.state, command)
  if (!transaction) return false
  view.dispatch(transaction)
  return true
}

function queueCurrentContentSync(): void {
  if (contentSyncQueued) return
  contentSyncQueued = true
  queueMicrotask(() => {
    contentSyncQueued = false
    flushCurrentContent()
  })
}

function editorScrollElement(view: EditorView | null): HTMLElement | null {
  if (!view) return host.value
  return (view.dom.closest('.milkdown') as HTMLElement | null) ?? host.value
}

async function syncExternalContent(content: string): Promise<void> {
  if (!crepe || !ready) return
  const previous = editorView()
  const scrollEl = editorScrollElement(previous)
  const captured = {
    from: previous?.state.selection.from ?? 0,
    to: previous?.state.selection.to ?? 0,
    scrollTop: scrollEl?.scrollTop ?? 0
  }
  synchronizing = true
  originalSource = content
  lastEmitted = null
  try {
    crepe.editor.action(replaceAll(projectRawBlocksForMilkdown(content), true))
    baselineCanonical = crepe.getMarkdown()
    applyGeneratedTocDisplay()
    refreshOutline()
    const view = editorView()
    if (view) {
      const restored = clampViewPosition(
        captured,
        view.state.doc.content.size,
        Math.max(0, (scrollEl?.scrollHeight ?? 0) - (scrollEl?.clientHeight ?? 0))
      )
      try {
        view.dispatch(
          view.state.tr.setSelection(
            TextSelection.between(
              view.state.doc.resolve(restored.from),
              view.state.doc.resolve(restored.to)
            )
          )
        )
      } catch {
        // Positions that cannot be resolved after a structural rewrite stay at the default caret.
      }
      if (scrollEl) scrollEl.scrollTop = restored.scrollTop
    }
  } finally {
    synchronizing = false
  }
}

onMounted(async () => {
  if (!host.value) return
  slashMenuPresentationCleanup = installSlashMenuPresentation(host.value)
  originalSource = props.content
  const codeBlockHighlights = createCodeBlockHighlightBundle()
  const editor = new Crepe({
    root: host.value,
    defaultValue: projectRawBlocksForMilkdown(props.content),
    features: {
      [Crepe.Feature.ImageBlock]: false
    },
    featureConfigs: {
      [Crepe.Feature.CodeMirror]: {
        languages: deskCodeMirrorLanguages,
        extensions: codeBlockHighlights.extensions,
        theme: document.documentElement.dataset.theme === 'light' ? githubLight : githubDark,
        copyText: '\u200b',
        copyIcon: COPY_ICON,
        previewOnlyByDefault: true
      },
      [Crepe.Feature.Placeholder]: {
        text: '输入 / 插入内容',
        mode: 'block'
      },
      [Crepe.Feature.Cursor]: {
        color: 'var(--accent-strong)',
        width: 4
      },
      [Crepe.Feature.BlockEdit]: {
        textGroup: {
          quote: { icon: formatIconSvg('quote') },
          divider: { icon: formatIconSvg('divider') }
        },
        listGroup: {
          bulletList: { icon: formatIconSvg('unordered-list') },
          orderedList: { icon: formatIconSvg('ordered-list') },
          taskList: { icon: formatIconSvg('checkbox') }
        },
        advancedGroup: {
          codeBlock: { icon: formatIconSvg('code-block') },
          table: { icon: formatIconSvg('table') }
        },
        buildMenu: (builder) => {
          const table = builder
            .getGroup('advanced')
            .group.items.find((item) => item.key === 'table')
          if (table) table.onRun = (ctx) => insertDefaultTable(ctx, 'slash')
          buildTNotesSlashGroup(builder, {
            groupLabel: 'TNotes',
            onRun: (item) => {
              runSlashItemInsert(item)
            }
          })
        }
      }
    }
  })
  editor.editor.use(
    createExcalidrawClipboardPlugin({
      knowledgeBaseId: () => props.knowledgeBaseId,
      noteUuid: () => props.noteUuid,
      noteIndex: () => currentNoteSession()?.document.index ?? '',
      noteRelPath: () => currentNoteSession()?.document.relPath ?? '',
      isEffectivelyReadOnly
    })
  )
  editor.editor.use(rawBlockProjectionPlugins)
  editor.editor.use(createDeskCalloutView())
  editor.editor.use(deskCalloutKeymapPlugin)
  editor.editor.use(imageAttrPlugins)
  editor.editor.use(standaloneImageParagraphPlugin)
  editor.editor.use(createCodeBlockTitlePlugin())
  editor.editor.use(createCodeBlockLatexPreviewPlugin())
  editor.editor.use(codeBlockHighlights.plugin)
  editor.editor.use(createMarkdownShortcutInputRules())
  editor.editor.use(createInlineCodeInteractionPlugin())
  editor.editor.use(createTableCaretPlugin())
  editor.editor.use(clearLineStylesPlugin)
  editor.editor.use(
    createBlockShortcutPlugin({
      onRawBlockInserted: openRawSourceEditorAt
    })
  )
  editor.editor.use(createDocumentSelectAllPlugin({ isPaneActive: () => props.active }))
  editor.editor.use(createRawBlockSelectionPlugin(boundaryOptions))
  editor.editor.use(createBlockBoundaryCaretPlugin())
  editor.editor.use(createBlockBoundaryNavigationPlugin(boundaryOptions))
  editor.editor.use(createHeadingSectionCollapsePlugin())
  editor.editor.use(createListItemCollapsePlugin())
  editor.editor.use(
    createReadonlyTransactionGuard({
      isReadOnly: isEffectivelyReadOnly,
      isExternalSync: () => synchronizing
    })
  )
  editor.editor.use(
    createDeskRawBlockView({
      isEffectivelyReadOnly,
      rawSourceReadonlyListeners,
      knowledgeBaseId: () => props.knowledgeBaseId,
      noteUuid: () => props.noteUuid,
      uploadImage: (file) => props.uploadImage(file),
      writeClipboard
    })
  )
  editor.editor.use(
    createDeskImageView({
      knowledgeBaseId: () => props.knowledgeBaseId,
      noteUuid: () => props.noteUuid,
      isReadOnly: isEffectivelyReadOnly,
      writeClipboard
    })
  )
  editor.editor.use(
    $prose(
      () =>
        new Plugin({
          view: (view) => {
            reportHeadingLevel(view)
            return {
              update: (view, previousState) => {
                if (!view.state.doc.eq(previousState.doc)) {
                  queueCurrentContentSync()
                  if (ready) queueMicrotask(refreshOutline)
                }
                if (
                  !view.state.selection.eq(previousState.selection) ||
                  !view.state.doc.eq(previousState.doc)
                ) {
                  reportHeadingLevel(view)
                }
                // 选区落进被折叠的列表子树（撤销 / 程序化定位）时自动展开；
                // 延到微任务里，避免在 view update 过程中再 dispatch。
                if (!view.state.selection.eq(previousState.selection)) {
                  queueMicrotask(() => {
                    expandCollapsedListItemsContaining(view, view.state.selection.from)
                  })
                }
              }
            }
          }
        })
    )
  )
  editor.editor.config((ctx) => {
    // Match the source editor and the shortcut shown in Desk's toolbar/settings.
    // Keep Milkdown's original binding available for existing users as well.
    ctx.update(strikethroughKeymap.key, (current) => ({
      ...current,
      ToggleStrikethrough: {
        ...current.ToggleStrikethrough,
        shortcuts: ['Mod-Shift-x', 'Mod-Alt-x']
      }
    }))
    ctx.update(blockConfig.key, (current) => ({
      ...current,
      filterNodes: (position, node) =>
        canShowBlockHandle(node) && current.filterNodes(position, node)
    }))
    // 行内 <br>（含表格单元格）解析成硬换行，并记住原始拼写（见 htmlBreak.ts）。
    ctx.update(remarkPluginsCtx, (plugins) => [
      ...plugins,
      { plugin: remarkHtmlBreakToBreak, options: {} }
    ])
    // Prefer GitHub / TNotes style list markers (`-`) over remark's default `*`.
    ctx.update(remarkStringifyOptionsCtx, (current) => ({
      ...current,
      bullet: '-' as const,
      bulletOther: '*' as const,
      handlers: {
        ...current.handlers,
        deskCallout: serializeDeskCalloutMdast,
        // 来自行内 <br> 的硬换行写回原拼写；普通硬换行沿用 mdast-util-to-markdown 的默认行为。
        // 逻辑在 htmlBreak.ts 的纯函数里（可单测），这里按上下文的 Handle 类型内联。
        break: (node, _parent, state, info) =>
          breakMarkdown(node?.data, state.stack, state.unsafe, info.before ?? '')
      }
    }))
    ctx.update(uploadConfig.key, (current) => ({
      ...current,
      enableHtmlFileUploader: true,
      // Milkdown's upload plugin keeps a mapped placeholder in the document,
      // so edits made while the image uploads cannot stale the insertion point.
      uploader: async (files, schema) => {
        if (isEffectivelyReadOnly()) return []
        const imageType = schema.nodes.image
        if (!imageType) return []
        const images = [...files].filter((file) => file.type.startsWith('image/'))
        return Promise.all(
          images.map(async (file) => {
            const uploaded = await props.uploadImage(file)
            return imageType.create({
              src: uploaded.src,
              alt: '',
              width: await resolvePastedImageWidth(file)
            })
          })
        )
      }
    }))
  })
  editor.setReadonly(isEffectivelyReadOnly())
  crepe = editor
  try {
    await editor.create()
    if (destroyed) {
      await editor.destroy()
      return
    }
    baselineCanonical = editor.getMarkdown()
    ready = true
    applyReadonlyState()
    applyGeneratedTocDisplay()
    if (host.value) {
      blockHandleClickCleanup = installBlockHandleClickController({
        root: host.value,
        getView: editorView,
        onClick: openBlockActionMenu
      })
      document.addEventListener('pointerdown', handleBlockMenuOutsidePointer, {
        capture: true
      })
      document.addEventListener('pointerup', handleBlockMenuDocumentPointerUp, {
        capture: true
      })
      document.addEventListener('keydown', handleKeydown)
    }
    if (props.content !== originalSource) await syncExternalContent(props.content)
    if (props.active) focus()
    refreshOutline()
  } catch (cause) {
    try {
      await editor.destroy()
    } catch {
      // A partially-created editor may not have every cleanup timer available.
    }
    if (crepe === editor) crepe = null
    emit('fatal', cause instanceof Error ? cause.message : String(cause))
  }
})

watch(
  () => props.content,
  (content) => {
    if (!ready || !crepe) return
    if (content === lastEmitted) {
      lastEmitted = null
      return
    }
    void syncExternalContent(content)
  }
)

watch(
  () => [props.mode, props.readOnly] as const,
  () => {
    // Before `editor.create()` resolves there is no view to update; onMounted
    // applies the readonly state once ready, so skip the pre-ready window.
    if (!ready || !crepe) return
    applyReadonlyState()
  }
)

watch(
  () => props.tocDisplay,
  () => applyGeneratedTocDisplay()
)

watch(
  () => props.active,
  (active) => {
    if (active) {
      host.value?.querySelector('.ProseMirror')?.dispatchEvent(new Event('desk-code-chrome-sync'))
      focus()
    }
  }
)

onBeforeUnmount(() => {
  if (host.value) exitCodeBlockFullscreen(host.value)
  // Switching to source unmounts Crepe; flush first so pending raw-block
  // drafts and in-progress visual edits are committed.
  flushPendingEdits(props.knowledgeBaseId, props.noteUuid, { requireClean: false })
  flushCurrentContent()
  destroyed = true
  ready = false
  slashMenuPresentationCleanup?.()
  slashMenuPresentationCleanup = null
  blockHandleClickCleanup?.()
  blockHandleClickCleanup = null
  document.removeEventListener('pointerdown', handleBlockMenuOutsidePointer, {
    capture: true
  })
  document.removeEventListener('pointerup', handleBlockMenuDocumentPointerUp, {
    capture: true
  })
  document.removeEventListener('keydown', handleKeydown)
  closeBlockActionMenu(false)
  const editor = crepe
  crepe = null
  if (editor) void editor.destroy()
})
</script>

<template>
  <div
    class="milkdown-markdown-editor tn-prose"
    :class="{
      'is-readonly': isEffectivelyReadOnly(),
      'is-wide': pageWidth === 'wide',
      'is-outline-hidden': !props.outlineVisible,
      'is-toc-hidden': tocDisplay === 'hidden'
    }"
  >
    <div
      ref="host"
      class="milkdown-markdown-editor__canvas"
      v-once
      @click.capture="handleClick"
      @mousedown="handleCanvasMousedown"
      @scroll.passive="syncOutlineActive"
    />
    <NoteOutline
      v-show="props.outlineVisible"
      :headings="outlineHeadings"
      :active-id="outlineActiveId"
      @select="scrollToOutlineHeading"
    />
    <Teleport to="body">
      <BlockActionMenu
        v-if="blockActionMenu"
        :x="blockActionMenu.x"
        :y="blockActionMenu.y"
        @action="handleBlockAction"
        @add-below="openAddBelowMenu"
        @close="closeBlockActionMenu"
      />
    </Teleport>
  </div>
</template>

<style scoped src="./milkdownMarkdownEditor.scoped.css"></style>

<style src="./milkdownMarkdownEditor.global.css"></style>
