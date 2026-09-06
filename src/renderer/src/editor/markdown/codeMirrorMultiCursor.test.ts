// @vitest-environment happy-dom

import { selectNextOccurrence } from '@codemirror/search'
import { EditorSelection } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  addCursorToSelection,
  collapseBrowserSelectAllOnFocus,
  codeMirrorMultiCursorExtensions,
  isRectangularSelectionEvent,
  rectangleRangesForPositions
} from './codeMirrorMultiCursor'

const views: EditorView[] = []

afterEach(() => {
  for (const view of views.splice(0)) view.destroy()
})

function createView(doc: string): EditorView {
  const view = new EditorView({
    doc,
    extensions: codeMirrorMultiCursorExtensions()
  })
  views.push(view)
  return view
}

describe('rectangleRangesForPositions', () => {
  it('builds one range per line for a column rectangle', () => {
    const view = createView('abcd\nefgh\nijkl')
    const selection = rectangleRangesForPositions(view.state.doc, { line: 1, col: 1 }, { line: 3, col: 3 })
    expect(selection.ranges.map((range) => view.state.doc.sliceString(range.from, range.to))).toEqual([
      'bc',
      'fg',
      'jk'
    ])
  })

  it('clamps columns on shorter lines', () => {
    const view = createView('abcd\nab\nabcdef')
    const selection = rectangleRangesForPositions(view.state.doc, { line: 1, col: 2 }, { line: 3, col: 4 })
    expect(selection.ranges.map((range) => view.state.doc.sliceString(range.from, range.to))).toEqual([
      'cd',
      '',
      'cd'
    ])
  })
})

describe('isRectangularSelectionEvent', () => {
  it('accepts Option+left-drag and middle-button drag', () => {
    expect(isRectangularSelectionEvent(new MouseEvent('mousedown', { altKey: true, button: 0 }))).toBe(
      true
    )
    expect(isRectangularSelectionEvent(new MouseEvent('mousedown', { button: 1 }))).toBe(true)
    expect(isRectangularSelectionEvent(new MouseEvent('mousedown', { button: 0 }))).toBe(false)
  })
})

describe('addCursorToSelection', () => {
  it('appends a cursor and makes it primary', () => {
    const next = addCursorToSelection(EditorSelection.single(0), 4)
    expect(next.ranges.map((range) => range.head)).toEqual([0, 4])
    expect(next.main.head).toBe(4)
  })

  it('toggles an existing empty cursor off', () => {
    const two = addCursorToSelection(EditorSelection.single(0), 4)
    const next = addCursorToSelection(two, 4)
    expect(next.ranges.map((range) => range.head)).toEqual([0])
  })
})

describe('alt multi-cursor', () => {
  it('Alt+click adds a cursor without replacing the existing one', () => {
    const view = createView('abcdefgh')
    view.dispatch({ selection: EditorSelection.single(0) })
    vi.spyOn(view, 'posAtCoords').mockReturnValue(4)

    view.dom.dispatchEvent(
      new PointerEvent('pointerdown', { button: 0, altKey: true, clientX: 12, clientY: 8, bubbles: true })
    )
    view.dom.ownerDocument.dispatchEvent(
      new PointerEvent('pointerup', { button: 0, altKey: true, clientX: 12, clientY: 8, bubbles: true })
    )

    expect(view.state.selection.ranges.map((range) => range.head)).toEqual([0, 4])
  })

  it('Alt+drag still creates a column rectangle', () => {
    const view = createView('abcd\nefgh\nijkl')
    const start = view.state.doc.line(1).from + 1
    const end = view.state.doc.line(3).from + 3
    vi.spyOn(view, 'posAtCoords').mockImplementation((coords) => (coords.y < 20 ? start : end))

    view.dom.dispatchEvent(
      new PointerEvent('pointerdown', { button: 0, altKey: true, clientX: 8, clientY: 4, bubbles: true })
    )
    view.dom.ownerDocument.dispatchEvent(
      new PointerEvent('pointermove', {
        button: 0,
        buttons: 1,
        altKey: true,
        clientX: 24,
        clientY: 40,
        bubbles: true
      })
    )

    expect(view.state.selection.ranges.map((range) => view.state.doc.sliceString(range.from, range.to))).toEqual([
      'bc',
      'fg',
      'jk'
    ])
  })
})

describe('middle-button rectangular selection', () => {
  it('middle-button pointer drag creates one range per line', () => {
    const view = createView('abcd\nefgh\nijkl')
    const start = view.state.doc.line(1).from + 1
    const end = view.state.doc.line(3).from + 3
    vi.spyOn(view, 'posAtCoords').mockImplementation((coords) => (coords.y < 20 ? start : end))

    view.dom.dispatchEvent(
      new PointerEvent('pointerdown', { button: 1, clientX: 8, clientY: 4, bubbles: true })
    )
    view.dom.ownerDocument.dispatchEvent(
      new PointerEvent('pointermove', { button: 1, buttons: 4, clientX: 24, clientY: 40, bubbles: true })
    )

    expect(view.state.selection.ranges.map((range) => view.state.doc.sliceString(range.from, range.to))).toEqual(
      ['bc', 'fg', 'jk']
    )
  })
})

describe('collapseBrowserSelectAllOnFocus', () => {
  it('collapses a full-document selection when focus arrives from outside', async () => {
    const view = new EditorView({
      doc: 'abcd\nefgh',
      extensions: [collapseBrowserSelectAllOnFocus()]
    })
    views.push(view)
    view.dispatch({ selection: EditorSelection.range(0, view.state.doc.length) })
    const button = document.createElement('button')
    document.body.append(button, view.dom)
    Object.defineProperty(view, 'hasFocus', { configurable: true, get: () => true })
    view.contentDOM.dispatchEvent(new FocusEvent('focus', { bubbles: true, relatedTarget: button }))
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
    expect(view.state.selection.main.empty).toBe(true)
    expect(view.state.selection.main.head).toBe(0)
  })
})

describe('codeMirrorMultiCursorExtensions', () => {
  it('Cmd+D selects the next identical occurrence', () => {
    const view = createView('foo\nfoo\nbar')
    view.dispatch({ selection: EditorSelection.range(0, 3) })
    expect(selectNextOccurrence(view)).toBe(true)
    expect(view.state.selection.ranges).toHaveLength(2)
    expect(
      view.state.selection.ranges.map((range) => view.state.doc.sliceString(range.from, range.to))
    ).toEqual(['foo', 'foo'])
  })

  it('keeps adding ranges on repeated Cmd+D', () => {
    const view = createView('x x x')
    view.dispatch({ selection: EditorSelection.range(0, 1) })
    expect(selectNextOccurrence(view)).toBe(true)
    expect(selectNextOccurrence(view)).toBe(true)
    expect(view.state.selection.ranges).toHaveLength(3)
  })
})
