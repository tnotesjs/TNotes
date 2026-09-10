import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import { GapCursor } from '@milkdown/kit/prose/gapcursor'
import { Fragment, type Node as ProseNode } from '@milkdown/kit/prose/model'
import {
  AllSelection,
  NodeSelection,
  Plugin,
  PluginKey,
  Selection,
  TextSelection,
  type EditorState,
  type Transaction
} from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'

import { isHiddenRawBlock, isImmutableRawBlock } from '../editor/markdown/rawBlockProjection'
import { textSelectionSpanningDocument } from './selectionKind'

export const DESK_SELECT_ALL_EVENT = 'desk:select-all'

export const documentSelectAllKey = new PluginKey('desk-document-select-all')

const NESTED_EDITOR_SELECTOR = '.cm-editor, input, textarea, select, .mm-editor'

/** True when this host is the visible pane in the focused split group. */
export function shouldHandleDeskSelectAll(host: HTMLElement | null, paneActive: boolean): boolean {
  if (!paneActive || !host) return false
  const group = host.closest('.editor-group')
  if (!group) return true
  return group.classList.contains('active')
}

export function selectionCoversEntireDocument(selection: Selection, doc: ProseNode): boolean {
  if (selection.empty) return false
  if (selection instanceof AllSelection) return true
  const from = Math.min(selection.from, selection.to)
  const to = Math.max(selection.from, selection.to)
  if (from === 0 && to === doc.content.size) return true
  const start = Selection.atStart(doc)
  const end = Selection.atEnd(doc)
  return from <= start.from && to >= end.to
}

export function selectEntireDocument(state: EditorState): Transaction {
  const spanning = textSelectionSpanningDocument(state.doc)
  return state.tr.setSelection(spanning ?? new AllSelection(state.doc))
}

function isVisuallyEmptyNote(doc: ProseNode): boolean {
  let editable = 0
  let emptyParagraphs = 0
  doc.forEach((node) => {
    if (isImmutableRawBlock(node)) return
    editable += 1
    if (node.type.name === 'paragraph' && node.content.size === 0) emptyParagraphs += 1
  })
  return editable === 0 || (editable === 1 && emptyParagraphs === 1)
}

/** Keep locked cards (frontmatter, ref defs, …); replace the rest with one empty paragraph. */
function contentAfterClearEntireDocument(doc: ProseNode, paragraph: ProseNode): ProseNode[] {
  const leading: ProseNode[] = []
  const trailing: ProseNode[] = []
  let seenEditable = false
  doc.forEach((node) => {
    if (!isImmutableRawBlock(node)) {
      seenEditable = true
      return
    }
    if (seenEditable) trailing.push(node)
    else leading.push(node)
  })
  return [...leading, paragraph, ...trailing]
}

function isHiddenAtom(node: ProseNode | null | undefined): boolean {
  return Boolean(node && isHiddenRawBlock(node))
}

/** First caret position inside a real textblock, skipping locked/hidden cards. */
export function firstEditableTextPosition(doc: ProseNode): number | null {
  let position: number | null = null
  doc.descendants((node, pos) => {
    if (position != null) return false
    if (isImmutableRawBlock(node) || isHiddenRawBlock(node)) return false
    if (!node.isTextblock) return true
    position = pos + 1
    return false
  })
  return position
}

export function isCaretStuckOnHiddenAtom(state: EditorState): boolean {
  const { selection, doc } = state
  if (selection instanceof NodeSelection && isHiddenAtom(selection.node)) return true
  if (selection instanceof GapCursor) {
    const $pos = selection.$head
    return (
      isHiddenAtom($pos.nodeBefore) || isHiddenAtom($pos.nodeAfter) || isHiddenAtom(doc.firstChild)
    )
  }
  return false
}

export function coerceCaretOffHiddenAtom(state: EditorState): Transaction | null {
  if (!isCaretStuckOnHiddenAtom(state)) return null
  let tr = state.tr
  let pos = firstEditableTextPosition(state.doc)
  if (pos == null) {
    const paragraph = state.schema.nodes.paragraph?.create()
    if (!paragraph) return null
    let insertAt = 0
    state.doc.forEach((node, offset) => {
      if (isImmutableRawBlock(node)) insertAt = offset + node.nodeSize
    })
    tr = tr.insert(insertAt, paragraph)
    pos = insertAt + 1
  }
  const next = TextSelection.create(tr.doc, pos)
  if (tr.doc.eq(state.doc) && next.eq(state.selection)) return null
  return tr.setSelection(next).scrollIntoView()
}

function selectionInFirstEditableBlock(doc: ProseNode): Selection {
  const pos = firstEditableTextPosition(doc)
  return pos != null ? TextSelection.create(doc, pos) : TextSelection.atStart(doc)
}

/** Replace editable content with one empty paragraph. `block+` schemas reject a truly empty doc. */
export function clearEntireDocument(state: EditorState): Transaction | null {
  const paragraph = state.schema.nodes.paragraph?.create()
  if (!paragraph) return null
  if (isVisuallyEmptyNote(state.doc)) {
    if (!isCaretStuckOnHiddenAtom(state)) return null
    return coerceCaretOffHiddenAtom(state)
  }
  const nodes = contentAfterClearEntireDocument(state.doc, paragraph)
  const tr = state.tr.replaceWith(0, state.doc.content.size, Fragment.fromArray(nodes))
  return tr.setSelection(selectionInFirstEditableBlock(tr.doc)).scrollIntoView()
}

function isNestedEditorTarget(event: KeyboardEvent): boolean {
  return event.target instanceof Element && Boolean(event.target.closest(NESTED_EDITOR_SELECTOR))
}

function isClearEntireDocumentKey(event: KeyboardEvent): boolean {
  return (
    (event.key === 'Backspace' || event.key === 'Delete') &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.isComposing
  )
}

function isSelectAllKey(event: KeyboardEvent): boolean {
  return (
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey &&
    !event.isComposing &&
    event.key.toLowerCase() === 'a'
  )
}

export function applySelectEntireDocument(view: EditorView): boolean {
  view.focus()
  view.dispatch(selectEntireDocument(view.state).scrollIntoView())
  return true
}

export function applyClearEntireDocument(view: EditorView): boolean {
  if (!view.editable) return false
  if (
    !selectionCoversEntireDocument(view.state.selection, view.state.doc) &&
    !isCaretStuckOnHiddenAtom(view.state)
  ) {
    return false
  }
  const tr = clearEntireDocument(view.state)
  if (!tr) return false
  const before = view.state.doc
  view.dispatch(tr)
  const coerced = coerceCaretOffHiddenAtom(view.state)
  if (coerced) view.dispatch(coerced)
  view.focus()
  return !view.state.doc.eq(before) || view.state.selection instanceof TextSelection
}

export function createDocumentSelectAllPlugin(options?: {
  isPaneActive?: () => boolean
}): MilkdownPlugin {
  const isPaneActive = options?.isPaneActive ?? (() => true)
  return $prose(
    () =>
      new Plugin({
        key: documentSelectAllKey,
        appendTransaction: (_transactions, _oldState, newState) =>
          coerceCaretOffHiddenAtom(newState),
        props: {
          handleKeyDown(view, event) {
            if (isNestedEditorTarget(event)) return false
            if (isSelectAllKey(event)) return applySelectEntireDocument(view)
            if (isClearEntireDocumentKey(event)) return applyClearEntireDocument(view)
            return false
          }
        },
        view(view) {
          let coercing = false
          const onSelectAll = (): void => {
            if (!shouldHandleDeskSelectAll(view.dom, isPaneActive())) return
            if (view.dom.querySelector('.cm-editor.cm-focused')) return
            applySelectEntireDocument(view)
          }
          const onKeyDown = (event: KeyboardEvent): void => {
            if (event.defaultPrevented) return
            if (!(event.target instanceof Node) || !view.dom.contains(event.target)) return
            if (isNestedEditorTarget(event)) return
            if (!isClearEntireDocumentKey(event)) return
            if (!applyClearEntireDocument(view)) return
            event.preventDefault()
            event.stopImmediatePropagation()
          }
          window.addEventListener(DESK_SELECT_ALL_EVENT, onSelectAll)
          view.dom.ownerDocument.addEventListener('keydown', onKeyDown, true)
          return {
            update() {
              if (coercing) return
              const next = coerceCaretOffHiddenAtom(view.state)
              if (!next) return
              coercing = true
              view.dispatch(next)
              view.focus()
              queueMicrotask(() => {
                coercing = false
              })
            },
            destroy() {
              window.removeEventListener(DESK_SELECT_ALL_EVENT, onSelectAll)
              view.dom.ownerDocument.removeEventListener('keydown', onKeyDown, true)
            }
          }
        }
      })
  )
}
