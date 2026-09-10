import { searchKeymap } from '@codemirror/search'
import {
  EditorSelection,
  EditorState,
  Prec,
  type Extension,
  type SelectionRange
} from '@codemirror/state'
import { crosshairCursor, drawSelection, EditorView, keymap, ViewPlugin } from '@codemirror/view'

import {
  selectAllInCodeMirrorView,
  shouldPreserveCodeMirrorSelectAll,
  trackNestedCodeMirrorFocus
} from '../../selectAll'

/** Option+left-drag (CodeMirror default) or middle-button drag. */
export function isRectangularSelectionEvent(event: MouseEvent): boolean {
  return (event.altKey && event.button === 0) || event.button === 1
}

export function addCursorToSelection(selection: EditorSelection, pos: number): EditorSelection {
  const index = selection.ranges.findIndex((range) => range.empty && range.head === pos)
  if (index >= 0) {
    if (selection.ranges.length === 1) return selection
    const ranges = selection.ranges.filter((_, i) => i !== index)
    const main =
      selection.mainIndex === index
        ? ranges.length - 1
        : selection.mainIndex > index
          ? selection.mainIndex - 1
          : selection.mainIndex
    return EditorSelection.create(ranges, main)
  }
  return selection.addRange(EditorSelection.cursor(pos), true)
}

export function rectangleRangesForPositions(
  doc: { line: (n: number) => { from: number; length: number } },
  start: { line: number; col: number },
  end: { line: number; col: number }
): EditorSelection {
  const top = Math.min(start.line, end.line)
  const bottom = Math.max(start.line, end.line)
  const left = Math.min(start.col, end.col)
  const right = Math.max(start.col, end.col)
  const ranges: SelectionRange[] = []
  for (let number = top; number <= bottom; number += 1) {
    const line = doc.line(number)
    const from = line.from + Math.min(left, line.length)
    const to = line.from + Math.min(right, line.length)
    ranges.push(from === to ? EditorSelection.cursor(from) : EditorSelection.range(from, to))
  }
  return EditorSelection.create(ranges)
}

function pointInView(
  view: EditorView,
  clientX: number,
  clientY: number
): { line: number; col: number } | null {
  const offset = view.posAtCoords({ x: clientX, y: clientY }, false)
  if (offset == null) return null
  const line = view.state.doc.lineAt(offset)
  return { line: line.number, col: offset - line.from }
}

const DRAG_THRESHOLD_PX = 4

/**
 * Alt+click adds a cursor (VS Code). Alt+drag is a column rectangle.
 * Must own the gesture: CodeMirror's rectangularSelection would replace
 * the selection on mousedown, so a click could not accumulate cursors.
 */
function altButtonMultiCursor(): Extension {
  return ViewPlugin.fromClass(
    class {
      private start: { line: number; col: number } | null = null
      private origin: EditorSelection | null = null
      private startX = 0
      private startY = 0
      private dragged = false

      constructor(readonly view: EditorView) {
        this.onPointerDown = this.onPointerDown.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onUp = this.onUp.bind(this)
        view.dom.addEventListener('pointerdown', this.onPointerDown, true)
        view.dom.addEventListener('mousedown', this.onMouseDown, true)
      }

      private begin(event: MouseEvent): boolean {
        if (this.start || event.button !== 0 || !event.altKey) return false
        const start = pointInView(this.view, event.clientX, event.clientY)
        if (!start) return false
        event.preventDefault()
        event.stopPropagation()
        this.start = start
        this.origin = this.view.state.selection
        this.startX = event.clientX
        this.startY = event.clientY
        this.dragged = false
        const doc = this.view.dom.ownerDocument
        doc.addEventListener('pointermove', this.onMove)
        doc.addEventListener('mousemove', this.onMove)
        doc.addEventListener('pointerup', this.onUp)
        doc.addEventListener('pointercancel', this.onUp)
        doc.addEventListener('mouseup', this.onUp)
        return true
      }

      private onPointerDown(event: PointerEvent): void {
        if (!this.begin(event)) return
        try {
          this.view.dom.setPointerCapture(event.pointerId)
        } catch {
          /* capture is optional */
        }
      }

      private onMouseDown(event: MouseEvent): void {
        this.begin(event)
      }

      private onMove(event: MouseEvent): void {
        if (!this.start || (event.buttons & 1) === 0) return
        if (
          !this.dragged &&
          Math.hypot(event.clientX - this.startX, event.clientY - this.startY) < DRAG_THRESHOLD_PX
        ) {
          return
        }
        this.dragged = true
        const current = pointInView(this.view, event.clientX, event.clientY)
        if (!current) return
        this.view.dispatch({
          selection: rectangleRangesForPositions(this.view.state.doc, this.start, current),
          userEvent: 'select.pointer'
        })
      }

      private onUp(): void {
        this.finish(true)
      }

      private finish(commitClick: boolean): void {
        if (commitClick && this.start && this.origin && !this.dragged) {
          const line = this.view.state.doc.line(this.start.line)
          const pos = line.from + Math.min(this.start.col, line.length)
          this.view.dispatch({
            selection: addCursorToSelection(this.origin, pos),
            userEvent: 'select.pointer'
          })
        }
        this.start = null
        this.origin = null
        this.dragged = false
        const doc = this.view.dom.ownerDocument
        doc.removeEventListener('pointermove', this.onMove)
        doc.removeEventListener('mousemove', this.onMove)
        doc.removeEventListener('pointerup', this.onUp)
        doc.removeEventListener('pointercancel', this.onUp)
        doc.removeEventListener('mouseup', this.onUp)
      }

      destroy(): void {
        this.view.dom.removeEventListener('pointerdown', this.onPointerDown, true)
        this.view.dom.removeEventListener('mousedown', this.onMouseDown, true)
        this.finish(false)
      }
    }
  )
}

/**
 * Middle-button rectangle must be owned here. Calling preventDefault on
 * CodeMirror's own mousedown handler makes it skip mouseSelectionStyle.
 */
function middleButtonRectangularSelection(): Extension {
  return ViewPlugin.fromClass(
    class {
      private start: { line: number; col: number } | null = null

      constructor(readonly view: EditorView) {
        this.onPointerDown = this.onPointerDown.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMove = this.onMove.bind(this)
        this.onUp = this.onUp.bind(this)
        view.dom.addEventListener('pointerdown', this.onPointerDown, true)
        view.dom.addEventListener('mousedown', this.onMouseDown, true)
      }

      private begin(event: MouseEvent): boolean {
        if (this.start || event.button !== 1 || event.altKey) return false
        const start = pointInView(this.view, event.clientX, event.clientY)
        if (!start) return false
        event.preventDefault()
        event.stopPropagation()
        this.start = start
        const doc = this.view.dom.ownerDocument
        doc.addEventListener('pointermove', this.onMove)
        doc.addEventListener('mousemove', this.onMove)
        doc.addEventListener('pointerup', this.onUp)
        doc.addEventListener('pointercancel', this.onUp)
        doc.addEventListener('mouseup', this.onUp)
        return true
      }

      private onPointerDown(event: PointerEvent): void {
        if (!this.begin(event)) return
        try {
          this.view.dom.setPointerCapture(event.pointerId)
        } catch {
          /* capture is optional */
        }
      }

      private onMouseDown(event: MouseEvent): void {
        this.begin(event)
      }

      private onMove(event: MouseEvent): void {
        if (!this.start || (event.buttons & 4) === 0) return
        const current = pointInView(this.view, event.clientX, event.clientY)
        if (!current) return
        this.view.dispatch({
          selection: rectangleRangesForPositions(this.view.state.doc, this.start, current),
          userEvent: 'select.pointer'
        })
      }

      private onUp(): void {
        this.start = null
        const doc = this.view.dom.ownerDocument
        doc.removeEventListener('pointermove', this.onMove)
        doc.removeEventListener('mousemove', this.onMove)
        doc.removeEventListener('pointerup', this.onUp)
        doc.removeEventListener('pointercancel', this.onUp)
        doc.removeEventListener('mouseup', this.onUp)
      }

      destroy(): void {
        this.view.dom.removeEventListener('pointerdown', this.onPointerDown, true)
        this.view.dom.removeEventListener('mousedown', this.onMouseDown, true)
        this.onUp()
      }
    }
  )
}

/**
 * Nested CodeMirror (fences, code groups) lives inside a contenteditable.
 * Focusing the parent — or remounting after leaving source view — makes the
 * browser select the whole nested document. drawSelection then paints a
 * full-line wash that looks like a broken fence highlight.
 */
export function collapseBrowserSelectAllOnFocus(): Extension {
  return EditorView.domEventHandlers({
    focus(event, view) {
      const related = event.relatedTarget
      const fromOutside = !(related instanceof Node) || !view.dom.contains(related)
      if (!fromOutside) return false
      const { main } = view.state.selection
      const wholeDoc = !main.empty && main.from === 0 && main.to === view.state.doc.length
      if (!wholeDoc) return false
      requestAnimationFrame(() => {
        if (view.hasFocus === false) return
        if (shouldPreserveCodeMirrorSelectAll(view)) return
        const current = view.state.selection.main
        if (current.empty || current.from !== 0 || current.to !== view.state.doc.length) return
        view.dispatch({
          selection: EditorSelection.cursor(0),
          userEvent: 'select.focus'
        })
      })
      return false
    }
  })
}

function preventMiddleClickPaste(): Extension {
  return EditorView.domEventHandlers({
    auxclick(event) {
      if (event.button === 1) {
        event.preventDefault()
        return true
      }
      return false
    }
  })
}

function nestedCodeMirrorSelectAllKeymap(): Extension {
  return Prec.highest(
    keymap.of([
      {
        key: 'Mod-a',
        run: (view) => selectAllInCodeMirrorView(view)
      }
    ])
  )
}

export function codeMirrorRectangularSelection(): Extension {
  return [
    altButtonMultiCursor(),
    middleButtonRectangularSelection(),
    preventMiddleClickPaste(),
    collapseBrowserSelectAllOnFocus(),
    trackNestedCodeMirrorFocus(),
    nestedCodeMirrorSelectAllKeymap()
  ]
}

/** Multi-cursor, Alt/middle-drag rectangles, and Cmd+D (select next occurrence). */
export function codeMirrorMultiCursorExtensions(): Extension[] {
  return [
    EditorState.allowMultipleSelections.of(true),
    // Native ::selection only paints the primary range. Extra Cmd+D ranges
    // need CodeMirror's selection layer.
    drawSelection(),
    codeMirrorRectangularSelection(),
    crosshairCursor(),
    keymap.of(searchKeymap)
  ]
}
