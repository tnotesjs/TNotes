import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import type { Node as ProseNode } from '@milkdown/kit/prose/model'
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

import { isStandaloneImageParagraph } from '../editor/markdown/standaloneImageParagraph'
import { isIndependentBlock, isStandaloneImageNode } from './independentBlock'
import { createBlockRangeSelection } from './verticalBlockSelection'

export type SelectionContentKind = 'empty' | 'marks' | 'blocks' | 'mixed'

export const markVsBlockSelectionKey = new PluginKey('desk-mark-vs-block-selection')

function isFullyCovered(position: number, node: ProseNode, from: number, to: number): boolean {
  if (position >= from && position + node.nodeSize <= to) return true
  // A TextSelection cannot sit on the tokens around a textblock, so covering
  // its content (select-all ending inside a fence) still counts as the card.
  if (node.isTextblock) {
    const start = position + 1
    const end = start + node.content.size
    return from <= start && to >= end
  }
  return false
}

/** Walk a range: typed text is mark-bearing; fully covered cards are blocks.
 * Partial tables descend so cell carets stay text. Image leafText does not count. */
export function classifySelectionRange(
  doc: ProseNode,
  from: number,
  to: number
): SelectionContentKind {
  if (from === to) return 'empty'
  let hasMarks = false
  let hasBlocks = false
  doc.nodesBetween(from, to, (node, position) => {
    if (hasMarks && hasBlocks) return false
    if (isIndependentBlock(node)) {
      if (isFullyCovered(position, node, from, to)) {
        hasBlocks = true
        return false
      }
      // Tables keep cell text; fences/atoms are not mark-bearing even when
      // the range only overlaps them (select-all often ends inside a fence).
      if (node.type.spec.tableRole === 'table') return true
      if (node.type.name === 'code_block') return false
      return true
    }
    if (isStandaloneImageNode(doc, position, node)) {
      hasBlocks = true
      return false
    }
    if (node.isText && (node.text?.length ?? 0) > 0) {
      hasMarks = true
      return false
    }
    return true
  })
  if (hasMarks && hasBlocks) return 'mixed'
  if (hasMarks) return 'marks'
  if (hasBlocks) return 'blocks'
  return 'empty'
}

export function classifySelection(selection: Selection, doc: ProseNode): SelectionContentKind {
  if (selection.empty) return 'empty'
  if (selection instanceof NodeSelection) {
    const node = selection.node
    if (isIndependentBlock(node) || node.type.name === 'image') return 'blocks'
    return classifySelectionRange(doc, selection.from, selection.to)
  }
  return classifySelectionRange(doc, selection.from, selection.to)
}

function collectIndependentBlocks(
  doc: ProseNode,
  from: number,
  to: number
): Array<{ pos: number; node: ProseNode }> {
  const blocks: Array<{ pos: number; node: ProseNode }> = []
  doc.nodesBetween(from, to, (node, position) => {
    if (isIndependentBlock(node) && isFullyCovered(position, node, from, to)) {
      blocks.push({ pos: position, node })
      return false
    }
    if (isStandaloneImageNode(doc, position, node) && isFullyCovered(position, node, from, to)) {
      blocks.push({ pos: position, node })
      return false
    }
    return true
  })
  return blocks
}

function nodeSelectionFor(doc: ProseNode, pos: number, node: ProseNode): Selection {
  if (
    node.type.name === 'paragraph' &&
    node.childCount > 0 &&
    node.firstChild?.type.name === 'image'
  ) {
    return NodeSelection.create(doc, pos + 1)
  }
  if (NodeSelection.isSelectable(node)) return NodeSelection.create(doc, pos)
  return createBlockRangeSelection(doc, pos, pos + node.nodeSize)
}

function rangeFitsSingleBlock(from: number, to: number, pos: number, node: ProseNode): boolean {
  const end = pos + node.nodeSize
  return from >= pos && to <= end
}

/** Valid text endpoints so Crepe's toolbar (`instanceof TextSelection`) can show. */
export function textSelectionSpanningDocument(doc: ProseNode): TextSelection | null {
  const start = Selection.atStart(doc)
  const end = Selection.atEnd(doc)
  if (!start.$from.parent.inlineContent || !end.$to.parent.inlineContent) return null
  return new TextSelection(start.$from, end.$to)
}

/** One card exactly → NodeSelection. A wider card-only range keeps its endpoints
 * so Shift+Arrow can keep growing instead of collapsing onto the first card. */
export function selectionForIndependentBlocks(
  doc: ProseNode,
  from: number,
  to: number
): Selection | null {
  const blocks = collectIndependentBlocks(doc, from, to)
  if (blocks.length === 0) return null
  if (blocks.length === 1) {
    const only = blocks[0]!
    if (rangeFitsSingleBlock(from, to, only.pos, only.node)) {
      return nodeSelectionFor(doc, only.pos, only.node)
    }
  }
  return createBlockRangeSelection(doc, from, to)
}

/** PM addMark checks the parent paragraph, so images pick up strong/em. */
export function stripMarksFromCards(state: EditorState): Transaction | null {
  let tr: Transaction | null = null
  state.doc.descendants((node, pos) => {
    if (isIndependentBlock(node) && !isStandaloneImageParagraph(node)) return false
    if (node.type.name !== 'image' || node.marks.length === 0) return true
    tr = (tr ?? state.tr).removeMark(pos, pos + node.nodeSize)
    return false
  })
  return tr
}

export function coerceMarkVsBlockSelection(state: EditorState): Transaction | null {
  const { selection, doc } = state
  const kind = classifySelection(selection, doc)

  if (selection instanceof AllSelection) {
    if (kind === 'blocks') {
      const next = selectionForIndependentBlocks(doc, selection.from, selection.to)
      return next && !next.eq(selection) ? state.tr.setSelection(next) : null
    }
    if (kind === 'marks' || kind === 'mixed') {
      const next = textSelectionSpanningDocument(doc)
      return next && !next.eq(selection) ? state.tr.setSelection(next) : null
    }
    return null
  }

  if (!(selection instanceof TextSelection) || selection.empty || kind !== 'blocks') {
    return null
  }
  const next = selectionForIndependentBlocks(doc, selection.from, selection.to)
  return next && !next.eq(selection) ? state.tr.setSelection(next) : null
}

export function isTextMarkShortcut(event: KeyboardEvent): boolean {
  if (!(event.metaKey || event.ctrlKey) || event.altKey) return false
  const key = event.key.toLowerCase()
  if (key === 'b' || key === 'i' || key === 'u' || key === 'e' || key === 'k') return true
  return event.shiftKey && (key === 's' || key === 'x')
}

function setSelectionKindAttr(view: EditorView, kind: SelectionContentKind): void {
  const root = view.dom.parentElement
  if (!root) return
  root.dataset.selectionKind = kind
}

/** Collapse card-only text ranges so the Crepe mark toolbar stays away, and
 * keep mixed / Cmd+A as a text range so bold still hits real words. */
export function createMarkVsBlockSelectionPlugin(): MilkdownPlugin {
  return $prose(() => {
    let pointerSelecting = false
    return new Plugin({
      key: markVsBlockSelectionKey,
      appendTransaction: (transactions, _oldState, newState) => {
        const stripped = transactions.some((transaction) => transaction.docChanged)
          ? stripMarksFromCards(newState)
          : null
        if (pointerSelecting) return stripped
        const coerced = coerceMarkVsBlockSelection(stripped ? newState.apply(stripped) : newState)
        if (stripped && coerced) {
          stripped.setSelection(coerced.selection)
          return stripped
        }
        return coerced ?? stripped
      },
      props: {
        handleDOMEvents: {
          mousedown(_view, event) {
            if (event.button === 0) pointerSelecting = true
            return false
          }
        },
        handleKeyDown(view, event) {
          if (!isTextMarkShortcut(event)) return false
          return classifySelection(view.state.selection, view.state.doc) === 'blocks'
        }
      },
      view(view) {
        const onPointerUp = (): void => {
          if (!pointerSelecting) return
          pointerSelecting = false
          const next = coerceMarkVsBlockSelection(view.state)
          if (next) view.dispatch(next)
        }
        const document = view.dom.ownerDocument
        document.addEventListener('mouseup', onPointerUp, true)
        document.addEventListener('pointerup', onPointerUp, true)
        setSelectionKindAttr(view, classifySelection(view.state.selection, view.state.doc))
        return {
          update() {
            setSelectionKindAttr(view, classifySelection(view.state.selection, view.state.doc))
          },
          destroy() {
            document.removeEventListener('mouseup', onPointerUp, true)
            document.removeEventListener('pointerup', onPointerUp, true)
            const root = view.dom.parentElement
            if (root) delete root.dataset.selectionKind
          }
        }
      }
    })
  })
}
