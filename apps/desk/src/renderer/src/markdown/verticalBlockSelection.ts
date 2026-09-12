import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import type { Node as ProseNode, ResolvedPos } from '@milkdown/kit/prose/model'
import {
  NodeSelection,
  Plugin,
  PluginKey,
  Selection,
  TextSelection
} from '@milkdown/kit/prose/state'
import type { EditorState, SelectionBookmark } from '@milkdown/kit/prose/state'
import type { Mappable } from '@milkdown/kit/prose/transform'
import { Decoration, DecorationSet } from '@milkdown/kit/prose/view'
import type { EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'
import { isIndependentBlock } from './independentBlock'
import { BlockBoundaryCaret } from './blockBoundaryCaret'

type Direction = -1 | 1

export const verticalBlockSelectionKey = new PluginKey('desk-vertical-block-selection')

/** Real contiguous selection with an endpoint BETWEEN blocks, not inside a
 * table cell/CodeMirror. The standard Selection slice/replacement operations
 * keep copy, cut, typing and deletion consistent with the displayed range. */
export class BlockRangeSelection extends Selection {
  eq(other: Selection): boolean {
    return (
      other instanceof BlockRangeSelection &&
      other.anchor === this.anchor &&
      other.head === this.head
    )
  }

  map(doc: ProseNode, mapping: Mappable): Selection {
    return this.getBookmark().map(mapping).resolve(doc)
  }

  toJSON(): { type: string; anchor: number; head: number } {
    return { type: 'desk-block-range', anchor: this.anchor, head: this.head }
  }

  static fromJSON(doc: ProseNode, json: { anchor: number; head: number }): Selection {
    return blockRange(doc, json.anchor, json.head)
  }

  getBookmark(): SelectionBookmark {
    return new BlockRangeBookmark(this.anchor, this.head)
  }
}

class BlockRangeBookmark implements SelectionBookmark {
  constructor(
    readonly anchor: number,
    readonly head: number
  ) {}

  map(mapping: Mappable): SelectionBookmark {
    const direction = this.head >= this.anchor ? 1 : -1
    return new BlockRangeBookmark(
      mapping.map(this.anchor, direction),
      mapping.map(this.head, -direction)
    )
  }

  resolve(doc: ProseNode): Selection {
    return blockRange(
      doc,
      Math.min(this.anchor, doc.content.size),
      Math.min(this.head, doc.content.size)
    )
  }
}

Selection.jsonID('desk-block-range', BlockRangeSelection)

function blockRange(doc: ProseNode, anchor: number, head: number): Selection {
  const $anchor = doc.resolve(anchor)
  const $head = doc.resolve(head)
  if (anchor === head) return Selection.near($head)
  if ($anchor.parent.inlineContent && $head.parent.inlineContent)
    return new TextSelection($anchor, $head)
  return new BlockRangeSelection($anchor, $head)
}

export function createBlockRangeSelection(doc: ProseNode, anchor: number, head: number): Selection {
  if (anchor === head) return Selection.near(doc.resolve(head))
  // Always a block range — unlike `blockRange()`, which falls back to
  // TextSelection when both ends sit in paragraphs (image / empty lines).
  return new BlockRangeSelection(doc.resolve(anchor), doc.resolve(head))
}

/**
 * Mouse drag often lands on the leading edge of a node-view atom (image, table,
 * fence). That position is *before* the block, so the last image in a note can
 * never be covered — there is no later text to drag into. Snap the head to the
 * far side of the independent block, matching Shift+Arrow.
 */
function snapHeadAroundIndependentBlock($anchor: ResolvedPos, $head: ResolvedPos): number {
  for (let depth = $head.depth; depth > 0; depth -= 1) {
    const node = $head.node(depth)
    if (!isIndependentBlock(node)) continue
    const start = $head.before(depth)
    const end = $head.after(depth)
    if ($anchor.pos <= start) return end
    if ($anchor.pos >= end) return start
  }
  if ($head.parent === $head.doc) {
    const after = $head.nodeAfter
    if (after && isIndependentBlock(after) && $anchor.pos <= $head.pos) {
      return $head.pos + after.nodeSize
    }
    const before = $head.nodeBefore
    if (before && isIndependentBlock(before) && $anchor.pos >= $head.pos) {
      return $head.pos - before.nodeSize
    }
  }
  return $head.pos
}

function isInsideIndependentBlock(selection: Selection): boolean {
  for (let depth = selection.$head.depth; depth > 0; depth -= 1) {
    if (isIndependentBlock(selection.$head.node(depth))) return true
  }
  return false
}

/** Use rendered line coordinates, including soft wrapping and hard breaks. */
function atVisualEdge(view: EditorView, direction: Direction): boolean {
  const { $head } = view.state.selection
  const caret = view.coordsAtPos($head.pos)
  const edge = view.coordsAtPos(direction > 0 ? $head.end() : $head.start(), direction)
  if (caret.bottom > caret.top && edge.bottom > edge.top) {
    // Inline code/emphasis can have different font metrics on the same line.
    return caret.bottom > edge.top + 1 && caret.top < edge.bottom - 1
  }
  // Non-layout hosts (unit tests): retain explicit line-break semantics.
  return !$head.parent
    .textBetween(
      direction > 0 ? $head.parentOffset : 0,
      direction > 0 ? $head.parent.content.size : $head.parentOffset,
      '\n',
      '\n'
    )
    .includes('\n')
}

/** Enter the next ordinary textblock by selecting its first/last visual line. */
function enterTextLine(view: EditorView, boundary: number, direction: Direction): number | null {
  const found = Selection.findFrom(view.state.doc.resolve(boundary), direction, true)
  if (!found || isInsideIndependentBlock(found)) return null
  const { $head } = found
  const start = $head.start()
  const end = $head.end()
  const edge = view.coordsAtPos(direction > 0 ? start : end, direction)
  if (edge.bottom <= edge.top) return direction > 0 ? end : start
  let low = start
  let high = end
  while (low < high) {
    const mid = direction > 0 ? Math.ceil((low + high) / 2) : Math.floor((low + high) / 2)
    const rect = view.coordsAtPos(mid, direction > 0 ? -1 : 1)
    if (direction > 0) {
      if (rect.top < edge.bottom - 1) low = mid
      else high = mid - 1
    } else {
      if (rect.bottom <= edge.top + 1) low = mid + 1
      else high = mid
    }
  }
  return low
}

interface Step {
  before: Selection
  after: Selection
  direction: Direction
}

/** One controller per editor view; ordinary text movement stays native. */
function controller(view: EditorView): {
  keydown: (event: KeyboardEvent) => boolean
  update: (previous: EditorState) => void
  reset: () => void
} {
  const steps: Step[] = []
  let pending: { before: Selection; direction: Direction } | null = null
  let dispatching = false
  const reset = (): void => {
    steps.length = 0
    pending = null
  }
  const dispatch = (selection: Selection): void => {
    dispatching = true
    try {
      view.dispatch(view.state.tr.setSelection(selection).scrollIntoView())
    } finally {
      dispatching = false
    }
  }
  return {
    reset,
    update(previous) {
      if (dispatching) return
      if (previous.doc !== view.state.doc || !view.editable) {
        reset()
        return
      }
      const current = view.state.selection
      if (current.eq(previous.selection)) return
      if (pending) {
        if (pending.before.anchor === current.anchor) steps.push({ ...pending, after: current })
        else reset()
        pending = null
      } else if (!steps.at(-1)?.after.eq(current)) reset()
    },
    keydown(event) {
      // Releasing/re-pressing Shift (or using Copy) must not lose the path that
      // reverse arrows retrace. Real edits and external selection changes reset it.
      if (['Shift', 'Control', 'Meta', 'Alt'].includes(event.key)) return false
      if (!view.editable || event.isComposing || event.altKey || event.ctrlKey || event.metaKey) {
        pending = null
        return false
      }
      const target = event.target as Element | null
      if (
        target?.closest?.(
          '.cm-editor, .mm-editor, .is-mindmap-island-active, input, textarea, select'
        )
      ) {
        reset()
        return false
      }
      const { selection, doc } = view.state
      // 块边界光标（T1–T6）上的 Shift+↑/↓ 由 rawBlockInteractions 转成
      // 「整块选中」（代码块/原子 → NodeSelection，表格 → BlockRangeSelection）。
      // 这里先让路，否则本插件会把它当普通文本边缘扩成一个范围选区。
      if (selection instanceof BlockBoundaryCaret) {
        pending = null
        return false
      }
      if (!event.shiftKey && selection instanceof BlockRangeSelection) {
        if (event.key === 'Backspace' || event.key === 'Delete') {
          reset()
          view.dispatch(view.state.tr.deleteSelection().scrollIntoView())
          return true
        }
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
          const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown'
          reset()
          dispatch(
            Selection.near(doc.resolve(forward ? selection.to : selection.from), forward ? 1 : -1)
          )
          return true
        }
      }
      if (!event.shiftKey || !['ArrowUp', 'ArrowDown'].includes(event.key)) {
        pending = null
        return false
      }
      const direction: Direction = event.key === 'ArrowDown' ? 1 : -1
      const last = steps.at(-1)
      if (last && last.after.eq(selection) && last.direction !== direction) {
        steps.pop()
        pending = null
        dispatch(last.before)
        return true
      }
      pending = null
      if (last && !last.after.eq(selection)) reset()
      // A caret/selection originating in a cell or an embedded editor retains
      // that editor's normal text/cell selection behavior.
      if (isInsideIndependentBlock(selection)) {
        reset()
        return false
      }
      let boundary: number
      let anchor = selection.anchor
      if (selection instanceof NodeSelection) {
        if (!isIndependentBlock(selection.node)) return false
        boundary = direction > 0 ? selection.to : selection.from
        anchor = direction > 0 ? selection.from : selection.to
      } else if (selection.$head.parent.inlineContent) {
        const { $head } = selection
        if (!atVisualEdge(view, direction)) {
          if (steps.length) pending = { before: selection, direction }
          return false
        }
        // Do not skip remaining list items / nested paragraphs.
        for (let depth = $head.depth; depth > 1; depth -= 1) {
          const index = $head.index(depth - 1)
          if (direction > 0 ? index < $head.node(depth - 1).childCount - 1 : index > 0) {
            if (steps.length) pending = { before: selection, direction }
            return false
          }
        }
        boundary = direction > 0 ? $head.after(1) : $head.before(1)
      } else {
        boundary = selection.head
      }
      let $boundary = doc.resolve(boundary)
      let neighbor = direction > 0 ? $boundary.nodeAfter : $boundary.nodeBefore
      while (neighbor?.attrs.hidden === true) {
        boundary += direction * neighbor.nodeSize
        $boundary = doc.resolve(boundary)
        neighbor = direction > 0 ? $boundary.nodeAfter : $boundary.nodeBefore
      }
      let head: number | null = null
      if (neighbor && isIndependentBlock(neighbor)) head = boundary + direction * neighbor.nodeSize
      else if (!selection.$head.parent.inlineContent || selection instanceof NodeSelection) {
        head = enterTextLine(view, boundary, direction)
      }
      if (head == null || head === selection.head) {
        if (selection instanceof BlockRangeSelection && !selection.$head.parent.inlineContent)
          return true // document edge
        if (steps.length) pending = { before: selection, direction }
        return false
      }
      const next = blockRange(doc, anchor, head)
      steps.push({ before: selection, after: next, direction })
      dispatch(next)
      return true
    }
  }
}

export function createVerticalBlockSelectionPlugin(): MilkdownPlugin {
  return $prose(() => {
    const controls = new WeakMap<EditorView, ReturnType<typeof controller>>()
    const evaluated = new WeakMap<KeyboardEvent, boolean>()
    const controlFor = (view: EditorView): ReturnType<typeof controller> => {
      let control = controls.get(view)
      if (!control) {
        control = controller(view)
        controls.set(view, control)
      }
      return control
    }
    const handle = (view: EditorView, event: KeyboardEvent): boolean => {
      if (evaluated.has(event)) return evaluated.get(event)!
      const handled = controlFor(view).keydown(event)
      evaluated.set(event, handled)
      return handled
    }
    return new Plugin({
      key: verticalBlockSelectionKey,
      props: {
        handleKeyDown: handle,
        createSelectionBetween(view, $anchor, $head) {
          const snapped = snapHeadAroundIndependentBlock($anchor, $head)
          if (snapped !== $head.pos) return blockRange(view.state.doc, $anchor.pos, snapped)
          const current = view.state.selection
          return current instanceof BlockRangeSelection && current.anchor === $anchor.pos
            ? blockRange(view.state.doc, $anchor.pos, $head.pos)
            : null
        },
        decorations(state) {
          if (state.selection.empty || state.selection instanceof NodeSelection) return null
          const { from, to } = state.selection
          const decorations: Decoration[] = []
          state.doc.nodesBetween(from, to, (node, position) => {
            if (!isIndependentBlock(node)) return
            if (position >= from && position + node.nodeSize <= to) {
              decorations.push(
                Decoration.node(position, position + node.nodeSize, {
                  class: 'desk-block--range-selected'
                })
              )
            }
            return false
          })
          return DecorationSet.create(state.doc, decorations)
        }
      },
      view(view) {
        const control = controlFor(view)
        const keydown = (event: KeyboardEvent): void => {
          if (!(event.target instanceof Node) || !view.dom.contains(event.target)) return
          if (!handle(view, event)) return
          event.preventDefault()
          event.stopImmediatePropagation()
        }
        const reset = (): void => control.reset()
        const document = view.dom.ownerDocument
        document.addEventListener('keydown', keydown, true)
        document.addEventListener('pointerdown', reset, true)
        view.dom.addEventListener('blur', reset, true)
        return {
          update: (_view, previous) => control.update(previous),
          destroy() {
            document.removeEventListener('keydown', keydown, true)
            document.removeEventListener('pointerdown', reset, true)
            view.dom.removeEventListener('blur', reset, true)
            controls.delete(view)
          }
        }
      }
    })
  })
}
