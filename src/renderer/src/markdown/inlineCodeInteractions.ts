import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import type { MarkType, Node as ProseNode } from '@milkdown/kit/prose/model'
import { Plugin, PluginKey, TextSelection, type EditorState, type Transaction } from '@milkdown/kit/prose/state'
import { Decoration, DecorationSet, type EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'

export const INLINE_CODE_PLACEHOLDER = 'code'

export const inlineCodeInteractionKey = new PluginKey('desk-inline-code-interaction')

export interface InlineCodeSpan {
  from: number
  to: number
}

function inlineCodeType(state: EditorState): MarkType | null {
  return state.schema.marks.inlineCode ?? null
}

function textblockStart($pos: EditorState['selection']['$from']): number | null {
  if (!$pos.parent.inlineContent || $pos.parent.type.spec.code) return null
  return $pos.start()
}

/** Contiguous `inlineCode` run that contains `pos` (interior or a marked boundary). */
export function findInlineCodeSpan(
  doc: ProseNode,
  pos: number,
  type: MarkType
): InlineCodeSpan | null {
  const $pos = doc.resolve(pos)
  const parentStart = textblockStart($pos)
  if (parentStart == null) return null
  const runs: InlineCodeSpan[] = []
  $pos.parent.forEach((child, offset) => {
    if (!child.isText || !type.isInSet(child.marks)) return
    const from = parentStart + offset
    const to = from + child.nodeSize
    const last = runs.at(-1)
    if (last && last.to === from) last.to = to
    else runs.push({ from, to })
  })
  return (
    runs.find((run) => pos > run.from && pos < run.to) ??
    runs.find((run) => pos === run.from || pos === run.to) ??
    null
  )
}

function marksAt(state: EditorState): readonly import('@milkdown/kit/prose/model').Mark[] {
  return state.storedMarks ?? state.selection.$from.marks()
}

export function isInsideInlineCode(state: EditorState): boolean {
  const type = inlineCodeType(state)
  if (!type || !(state.selection instanceof TextSelection)) return false
  const { from, to, empty } = state.selection
  if (!empty) {
    const span = findInlineCodeSpan(state.doc, from, type)
    return Boolean(span && from >= span.from && to <= span.to)
  }
  if (!type.isInSet(marksAt(state))) {
    const span = findInlineCodeSpan(state.doc, from, type)
    return Boolean(span && from > span.from && from < span.to)
  }
  return findInlineCodeSpan(state.doc, from, type) != null
}

/** Same document position at a pill edge; only storedMarks differs. */
export type InlineCodeCaretKind =
  | 'inside'
  | 'inside-start'
  | 'inside-end'
  | 'outside-start'
  | 'outside-end'

export function inlineCodeCaretKind(state: EditorState): InlineCodeCaretKind | null {
  const type = inlineCodeType(state)
  if (!type || !(state.selection instanceof TextSelection)) return null
  const { from, to, empty } = state.selection
  if (!empty) {
    const span = findInlineCodeSpan(state.doc, from, type)
    return span && from >= span.from && to <= span.to ? 'inside' : null
  }
  const span = findInlineCodeSpan(state.doc, from, type)
  if (!span) return null
  const inside = isInsideInlineCode(state)
  if (from === span.from) return inside ? 'inside-start' : 'outside-start'
  if (from === span.to) return inside ? 'inside-end' : 'outside-end'
  return inside ? 'inside' : null
}

function isCaretInsideKind(kind: InlineCodeCaretKind | null): boolean {
  return kind === 'inside' || kind === 'inside-start' || kind === 'inside-end'
}

function activeInlineCodeDecorations(state: EditorState): DecorationSet | null {
  const type = inlineCodeType(state)
  const kind = inlineCodeCaretKind(state)
  if (!type || !isCaretInsideKind(kind)) return null
  const span =
    findInlineCodeSpan(state.doc, state.selection.from, type) ??
    findInlineCodeSpan(state.doc, state.selection.to, type)
  if (!span) return null
  return DecorationSet.create(state.doc, [
    Decoration.inline(span.from, span.to, { class: 'desk-inline-code--active' })
  ])
}

function unwrapSpan(state: EditorState, span: InlineCodeSpan): Transaction {
  return state.tr.removeMark(span.from, span.to, inlineCodeType(state)!).setStoredMarks(null)
}

function insertPlaceholder(state: EditorState): Transaction {
  const type = inlineCodeType(state)!
  const pos = state.selection.from
  const text = state.schema.text(INLINE_CODE_PLACEHOLDER, [type.create()])
  const tr = state.tr.replaceSelectionWith(text, false)
  return tr
    .setSelection(TextSelection.create(tr.doc, pos, pos + INLINE_CODE_PLACEHOLDER.length))
    .setStoredMarks([type.create()])
}

function toggleRange(state: EditorState, from: number, to: number): Transaction {
  const type = inlineCodeType(state)!
  const tr = state.tr
  if (state.doc.rangeHasMark(from, to, type)) {
    tr.removeMark(from, to, type)
  } else {
    for (const name of Object.keys(state.schema.marks)) {
      if (name !== type.name) tr.removeMark(from, to, state.schema.marks[name])
    }
    tr.addMark(from, to, type.create())
  }
  return tr.setStoredMarks(null)
}

/** Cmd+E: empty → selected `code`; caret inside a span → unwrap the whole span. */
export function toggleDeskInlineCode(
  state: EditorState,
  dispatch?: (tr: Transaction) => void
): boolean {
  const type = inlineCodeType(state)
  if (!type || !(state.selection instanceof TextSelection)) return false
  if (!state.selection.$from.parent.inlineContent || state.selection.$from.parent.type.spec.code) {
    return false
  }
  if (state.selection.empty) {
    if (isInsideInlineCode(state)) {
      const span = findInlineCodeSpan(state.doc, state.selection.from, type)
      if (!span) return false
      if (dispatch) dispatch(unwrapSpan(state, span).scrollIntoView())
      return true
    }
    if (dispatch) dispatch(insertPlaceholder(state).scrollIntoView())
    return true
  }
  if (dispatch) dispatch(toggleRange(state, state.selection.from, state.selection.to).scrollIntoView())
  return true
}

/** Enter in the middle of a span: two lines, caret before the second pill. */
export function splitInlineCodeOnEnter(
  state: EditorState,
  dispatch?: (tr: Transaction) => void
): boolean {
  const type = inlineCodeType(state)
  if (!type || !(state.selection instanceof TextSelection) || !state.selection.empty) return false
  const pos = state.selection.from
  const span = findInlineCodeSpan(state.doc, pos, type)
  if (!span || pos <= span.from || pos >= span.to) return false
  if (!state.selection.$from.parent.inlineContent || state.selection.$from.parent.type.spec.code) {
    return false
  }
  if (dispatch) {
    const tr = state.tr.split(pos)
    const after = tr.mapping.map(pos, 1)
    const $after = tr.doc.resolve(Math.min(after, tr.doc.content.size))
    const caret = $after.parent.inlineContent ? $after.start() : after
    dispatch(
      tr.setSelection(TextSelection.create(tr.doc, caret)).setStoredMarks([]).scrollIntoView()
    )
  }
  return true
}

/** Same document position at a pill edge: first arrow enters or leaves, next arrow moves. */
function stepInlineCodeOnArrow(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  direction: -1 | 1
): boolean {
  const type = inlineCodeType(state)
  if (!type || !(state.selection instanceof TextSelection) || !state.selection.empty) return false
  const pos = state.selection.from
  const spanHere = findInlineCodeSpan(state.doc, pos, type)
  const spanLeft = pos > 0 ? findInlineCodeSpan(state.doc, pos - 1, type) : null
  const spanRight = findInlineCodeSpan(state.doc, pos + 1, type)
  const marked = type.isInSet(marksAt(state))

  if (direction < 0 && spanLeft && pos === spanLeft.to + 1) {
    if (dispatch) {
      dispatch(
        state.tr.setSelection(TextSelection.create(state.doc, spanLeft.to)).setStoredMarks([])
      )
    }
    return true
  }
  if (direction > 0 && spanRight && pos === spanRight.from - 1) {
    if (dispatch) {
      dispatch(
        state.tr.setSelection(TextSelection.create(state.doc, spanRight.from)).setStoredMarks([])
      )
    }
    return true
  }

  const span = spanHere
  if (!span) return false
  const atEnd = pos === span.to
  const atStart = pos === span.from
  if (direction > 0 && atEnd && marked) {
    if (dispatch) dispatch(state.tr.setStoredMarks([]))
    return true
  }
  if (direction < 0 && atStart && marked) {
    if (dispatch) dispatch(state.tr.setStoredMarks([]))
    return true
  }
  if (direction < 0 && atEnd && !marked) {
    if (dispatch) dispatch(state.tr.setStoredMarks([type.create()]))
    return true
  }
  if (direction > 0 && atStart && !marked) {
    if (dispatch) dispatch(state.tr.setStoredMarks([type.create()]))
    return true
  }
  return false
}

/** Cmd+←/→ (and Shift+Cmd) must use the textblock, not the inline-block pill. */
export function moveOrSelectTextblockEdge(
  state: EditorState,
  dispatch: ((tr: Transaction) => void) | undefined,
  direction: -1 | 1,
  extend: boolean
): boolean {
  if (!(state.selection instanceof TextSelection)) return false
  const $head = state.selection.$head
  if (!$head.parent.inlineContent || $head.parent.type.spec.code) return false
  const edge = direction > 0 ? $head.end() : $head.start()
  const anchor = extend ? state.selection.anchor : edge
  if (state.selection.anchor === anchor && state.selection.head === edge) return false
  if (dispatch) {
    dispatch(state.tr.setSelection(TextSelection.create(state.doc, anchor, edge)).scrollIntoView())
  }
  return true
}

function isModE(event: KeyboardEvent): boolean {
  return (
    event.key.toLowerCase() === 'e' &&
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey
  )
}

function selectionCoversPlaceholder(state: EditorState): boolean {
  const type = inlineCodeType(state)
  const { from, to } = state.selection
  if (!type || to - from !== INLINE_CODE_PLACEHOLDER.length) return false
  if (state.doc.textBetween(from, to) !== INLINE_CODE_PLACEHOLDER) return false
  return state.doc.rangeHasMark(from, to, type)
}

/**
 * IME cannot compose over a selected `code` placeholder: the browser splits the
 * mark (pinyin leaks out, leftover `code` stays in). Collapse to an empty caret
 * with storedMarks so ProseMirror's markCursor wraps the composition.
 */
export function prepareInlineCodeComposition(
  state: EditorState,
  dispatch?: (tr: Transaction) => void
): boolean {
  const type = inlineCodeType(state)
  if (!type || !(state.selection instanceof TextSelection)) return false
  const { from, to, empty } = state.selection
  if (empty) return false
  if (!selectionCoversPlaceholder(state) && !isInsideInlineCode(state)) return false
  if (!dispatch) return true
  const tr = state.tr.delete(from, to)
  dispatch(tr.setSelection(TextSelection.create(tr.doc, from)).setStoredMarks([type.create()]))
  return true
}

function stripTrailingPlaceholder(tr: Transaction, from: number, to: number): number {
  const text = tr.doc.textBetween(from, to)
  if (!text.endsWith(INLINE_CODE_PLACEHOLDER) || text.length === INLINE_CODE_PLACEHOLDER.length) {
    return to
  }
  tr.delete(to - INLINE_CODE_PLACEHOLDER.length, to)
  return to - INLINE_CODE_PLACEHOLDER.length
}

/** After IME, mark leaked pinyin / confirmed text and drop a leftover placeholder. */
export function repairInlineCodeAfterComposition(
  state: EditorState,
  options: { anchor?: number | null; fromPlaceholder?: boolean } = {}
): Transaction | null {
  const type = inlineCodeType(state)
  if (!type || !(state.selection instanceof TextSelection)) return null
  const $pos = state.selection.$from
  const parentStart = textblockStart($pos)
  if (parentStart == null) return null
  const parentEnd = $pos.end()
  const caret = state.selection.from
  const floor = Math.max(parentStart, options.anchor ?? parentStart)
  const span =
    findInlineCodeSpan(state.doc, caret, type) ??
    findInlineCodeSpan(state.doc, Math.min(caret + 1, parentEnd), type)

  let from = span?.from ?? Math.min(floor, caret)
  let to = span?.to ?? Math.max(floor, caret)
  if (span) {
    while (from > floor) {
      const before = state.doc.resolve(from).nodeBefore
      if (!before?.isText || type.isInSet(before.marks)) break
      from -= before.nodeSize
    }
  } else {
    from = floor
    to = Math.max(floor, caret)
  }
  if (to <= from && !options.fromPlaceholder) return null

  const tr = state.tr
  if (to > from) tr.addMark(from, to, type.create())
  if (options.fromPlaceholder && to > from) {
    to = stripTrailingPlaceholder(tr, from, tr.mapping.map(to))
  }
  if (to <= from && !tr.docChanged) return null
  const next = Math.min(Math.max(caret, from), tr.mapping.map(to))
  return tr.setSelection(TextSelection.create(tr.doc, next)).setStoredMarks([type.create()])
}

/** After deleting at a pill edge, inclusive:false drops the mark. Stay inside unless we left on purpose. */
export function retainInlineCodeAfterEdit(
  transactions: readonly Transaction[],
  oldState: EditorState,
  newState: EditorState
): Transaction | null {
  const type = inlineCodeType(newState)
  if (!type || !isInsideInlineCode(oldState) || isInsideInlineCode(newState)) return null
  if (!(newState.selection instanceof TextSelection) || !newState.selection.empty) return null
  if (transactions.some((tr) => tr.storedMarksSet && !type.isInSet(tr.storedMarks ?? []))) {
    return null
  }
  const pos = newState.selection.from
  const span = findInlineCodeSpan(newState.doc, pos, type)
  if (!span || pos < span.from || pos > span.to) return null
  return newState.tr.setStoredMarks([type.create()])
}

export function inlineCodeCaretOffset(
  kind: InlineCodeCaretKind,
  codeRect: { left: number; right: number },
  editorLeft: number,
  padding: { left: number; right: number }
): number | null {
  switch (kind) {
    case 'inside-end':
      return codeRect.right - editorLeft - padding.right + 2
    case 'outside-end':
      return codeRect.right - editorLeft + 1
    case 'inside-start':
      return codeRect.left - editorLeft + padding.left - 1
    case 'outside-start':
      return codeRect.left - editorLeft - 2
    default:
      return null
  }
}

function codeElementAt(view: EditorView, pos: number): HTMLElement | null {
  try {
    const { node } = view.domAtPos(pos)
    const el = node instanceof Element ? node : node.parentElement
    return el?.closest('code') ?? null
  } catch {
    return null
  }
}

function placeInlineCodeCaret(view: EditorView): void {
  const kind = inlineCodeCaretKind(view.state)
  const type = inlineCodeType(view.state)
  const clear = (): void => {
    view.dom.style.removeProperty('--desk-inline-code-caret-left')
  }
  if (!kind || !type || kind === 'inside') {
    clear()
    return
  }
  const span = findInlineCodeSpan(view.state.doc, view.state.selection.from, type)
  if (!span) {
    clear()
    return
  }
  const code =
    codeElementAt(view, span.from) ??
    codeElementAt(view, Math.max(span.from, span.to - 1))
  if (!code) {
    clear()
    return
  }
  const styles = getComputedStyle(code)
  const left = inlineCodeCaretOffset(kind, code.getBoundingClientRect(), view.dom.getBoundingClientRect().left, {
    left: Number.parseFloat(styles.paddingLeft) || 0,
    right: Number.parseFloat(styles.paddingRight) || 0
  })
  if (left == null) {
    clear()
    return
  }
  view.dom.style.setProperty('--desk-inline-code-caret-left', `${left}px`)
  const cursor = view.dom.querySelector('.prosemirror-virtual-cursor')
  if (cursor instanceof HTMLElement) cursor.style.left = `${left}px`
}

function insertInlineCodeText(
  view: EditorView,
  from: number,
  to: number,
  text: string
): boolean {
  const type = inlineCodeType(view.state)
  if (!type) return false
  const span = findInlineCodeSpan(view.state.doc, from, type) ?? findInlineCodeSpan(view.state.doc, to, type)
  const replacingWhole = Boolean(span && span.from === from && span.to === to)
  const continuing =
    type.isInSet(marksAt(view.state)) &&
    Boolean(span && from >= span.from && to <= span.to)
  if (!replacingWhole && !continuing) return false
  const tr = view.state.tr.replaceWith(from, to, view.state.schema.text(text, [type.create()]))
  view.dispatch(
    tr.setSelection(TextSelection.create(tr.doc, from + text.length)).setStoredMarks([type.create()])
  )
  return true
}

export function createInlineCodeInteractionPlugin(): MilkdownPlugin {
  return $prose(() => {
    let composingFromPlaceholder = false
    let compositionAnchor: number | null = null
    let lastPillImeEnd = 0
    return new Plugin({
        key: inlineCodeInteractionKey,
        appendTransaction: (transactions, oldState, newState) =>
          retainInlineCodeAfterEdit(transactions, oldState, newState),
        props: {
          attributes(state) {
            const kind = inlineCodeCaretKind(state)
            return kind ? { 'data-inline-code-caret': kind } : {}
          },
          decorations(state) {
            return activeInlineCodeDecorations(state)
          },
          handleTextInput(view, from, to, text) {
            if (!view.editable || view.composing) return false
            return insertInlineCodeText(view, from, to, text)
          },
          handleDOMEvents: {
            compositionstart(view) {
              if (!view.editable) return false
              const fromPlaceholder = selectionCoversPlaceholder(view.state)
              const prepared = prepareInlineCodeComposition(view.state, view.dispatch)
              if (prepared || fromPlaceholder || isInsideInlineCode(view.state)) {
                composingFromPlaceholder = fromPlaceholder
                compositionAnchor = view.state.selection.from
              }
              return false
            },
            compositionend(view) {
              if (!composingFromPlaceholder && compositionAnchor == null) return false
              const fromPlaceholder = composingFromPlaceholder
              const anchor = compositionAnchor
              lastPillImeEnd = Date.now()
              composingFromPlaceholder = false
              compositionAnchor = null
              window.setTimeout(() => {
                if (view.isDestroyed) return
                const tr = repairInlineCodeAfterComposition(view.state, { anchor, fromPlaceholder })
                if (tr) view.dispatch(tr)
              }, 32)
              return false
            }
          },
          handleKeyDown(view: EditorView, event: KeyboardEvent) {
            if (!view.editable || event.isComposing) return false
            const target = event.target
            if (
              target instanceof Element &&
              target.closest('input, textarea, select, .cm-editor, .mm-editor, .is-mindmap-island-active')
            ) {
              return false
            }
            if (isModE(event)) {
              return toggleDeskInlineCode(view.state, view.dispatch)
            }
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.altKey &&
              !event.metaKey &&
              !event.ctrlKey
            ) {
              if (Date.now() - lastPillImeEnd < 80) return true
              return splitInlineCodeOnEnter(view.state, view.dispatch)
            }
            if (
              (event.key === 'ArrowRight' || event.key === 'ArrowLeft') &&
              event.metaKey &&
              !event.altKey
            ) {
              return moveOrSelectTextblockEdge(
                view.state,
                view.dispatch,
                event.key === 'ArrowRight' ? 1 : -1,
                event.shiftKey
              )
            }
            if (event.key === 'ArrowRight' && !event.shiftKey && !event.altKey && !event.metaKey && !event.ctrlKey) {
              return stepInlineCodeOnArrow(view.state, view.dispatch, 1)
            }
            if (event.key === 'ArrowLeft' && !event.shiftKey && !event.altKey && !event.metaKey && !event.ctrlKey) {
              return stepInlineCodeOnArrow(view.state, view.dispatch, -1)
            }
            return false
          }
        },
        view(view) {
          let raf = 0
          const sync = (): void => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(() => {
              if (!view.isDestroyed) placeInlineCodeCaret(view)
            })
          }
          sync()
          return {
            update: sync,
            destroy() {
              cancelAnimationFrame(raf)
            }
          }
        }
      })
  })
}
