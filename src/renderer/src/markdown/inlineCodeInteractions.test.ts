// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorViewCtx, rootCtx } from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { joinBackward } from '@milkdown/kit/prose/commands'
import { TextSelection } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'

import {
  INLINE_CODE_PLACEHOLDER,
  createInlineCodeInteractionPlugin,
  findInlineCodeSpan,
  inlineCodeCaretKind,
  inlineCodeCaretOffset,
  isInsideInlineCode,
  moveOrSelectTextblockEdge,
  prepareInlineCodeComposition,
  repairInlineCodeAfterComposition,
  splitInlineCodeOnEnter,
  toggleDeskInlineCode
} from './inlineCodeInteractions'

const editors: Editor[] = []

afterEach(async () => {
  await Promise.all(editors.splice(0).map((editor) => editor.destroy()))
  document.body.replaceChildren()
})

async function createEditor(source = ''): Promise<Editor> {
  const root = document.createElement('div')
  document.body.append(root)
  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, source)
    })
    .use(commonmark)
    .use(createInlineCodeInteractionPlugin())
  editors.push(editor)
  await editor.create()
  return editor
}

function viewOf(editor: Editor): EditorView {
  return editor.action((ctx) => ctx.get(editorViewCtx))
}

function codeType(view: EditorView) {
  return view.state.schema.marks.inlineCode
}

function press(view: EditorView, key: string, modifiers: KeyboardEventInit = {}): boolean {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...modifiers })
  return Boolean(view.someProp('handleKeyDown', (handle) => handle(view, event)))
}

function applyCode(view: EditorView, from: number, to: number): void {
  const type = codeType(view)
  view.dispatch(view.state.tr.addMark(from, to, type.create()))
}

describe('toggleDeskInlineCode', () => {
  it('inserts selected `code` when the caret is empty', async () => {
    const editor = await createEditor('hello\n')
    const view = viewOf(editor)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 1)))
    expect(toggleDeskInlineCode(view.state, view.dispatch)).toBe(true)
    expect(view.state.doc.textContent).toBe(`${INLINE_CODE_PLACEHOLDER}hello`)
    expect(view.state.selection.from).toBe(1)
    expect(view.state.selection.to).toBe(1 + INLINE_CODE_PLACEHOLDER.length)
    expect(view.state.doc.rangeHasMark(1, 1 + INLINE_CODE_PLACEHOLDER.length, codeType(view))).toBe(
      true
    )
  })

  it('lets typing replace the selected placeholder', async () => {
    const editor = await createEditor()
    const view = viewOf(editor)
    toggleDeskInlineCode(view.state, view.dispatch)
    const { from, to } = view.state.selection
    expect(
      view.someProp('handleTextInput', (handle) => handle(view, from, to, '123'))
    ).toBe(true)
    expect(view.state.doc.textContent).toBe('123')
    expect(view.state.doc.rangeHasMark(1, 4, codeType(view))).toBe(true)
  })

  it('keeps each keystroke inside the pill after replacing the placeholder', async () => {
    const editor = await createEditor()
    const view = viewOf(editor)
    toggleDeskInlineCode(view.state, view.dispatch)
    const start = view.state.selection
    expect(
      view.someProp('handleTextInput', (handle) => handle(view, start.from, start.to, '1'))
    ).toBe(true)
    expect(
      view.someProp('handleTextInput', (handle) =>
        handle(view, view.state.selection.from, view.state.selection.to, '2')
      )
    ).toBe(true)
    expect(
      view.someProp('handleTextInput', (handle) =>
        handle(view, view.state.selection.from, view.state.selection.to, '3')
      )
    ).toBe(true)
    expect(view.state.doc.textContent).toBe('123')
    expect(view.state.doc.rangeHasMark(1, 4, codeType(view))).toBe(true)
  })

  it('stays inside the pill after Backspace at the end', async () => {
    const editor = await createEditor('123456\n')
    const view = viewOf(editor)
    const type = codeType(view)
    applyCode(view, 1, 7)
    view.dispatch(
      view.state.tr.setSelection(TextSelection.create(view.state.doc, 7)).setStoredMarks([type.create()])
    )
    expect(inlineCodeCaretKind(view.state)).toBe('inside-end')
    view.dispatch(view.state.tr.delete(6, 7))
    expect(view.state.doc.textContent).toBe('12345')
    expect(view.state.doc.rangeHasMark(1, 6, type)).toBe(true)
    expect(isInsideInlineCode(view.state)).toBe(true)
    expect(inlineCodeCaretKind(view.state)).toBe('inside-end')
    expect(view.dom.dataset.inlineCodeCaret).toBe('inside-end')
  })

  it('does not extend the pill after ArrowRight has left it', async () => {
    const editor = await createEditor('12\n')
    const view = viewOf(editor)
    applyCode(view, 1, 3)
    view.dispatch(
      view.state.tr.setSelection(TextSelection.create(view.state.doc, 3)).setStoredMarks([])
    )
    expect(
      view.someProp('handleTextInput', (handle) => handle(view, 3, 3, '3')) ?? false
    ).toBe(false)
  })

  it('unwraps the whole span when the caret is inside', async () => {
    const editor = await createEditor('hello\n')
    const view = viewOf(editor)
    applyCode(view, 1, 6)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 3)))
    expect(isInsideInlineCode(view.state)).toBe(true)
    expect(toggleDeskInlineCode(view.state, view.dispatch)).toBe(true)
    expect(view.state.doc.textContent).toBe('hello')
    expect(view.state.doc.rangeHasMark(1, 6, codeType(view))).toBe(false)
  })

  it('toggles a non-empty selection', async () => {
    const editor = await createEditor('hello\n')
    const view = viewOf(editor)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 1, 6)))
    toggleDeskInlineCode(view.state, view.dispatch)
    expect(view.state.doc.rangeHasMark(1, 6, codeType(view))).toBe(true)
    toggleDeskInlineCode(view.state, view.dispatch)
    expect(view.state.doc.rangeHasMark(1, 6, codeType(view))).toBe(false)
  })
})

describe('splitInlineCodeOnEnter', () => {
  it('splits 123 into two lines and leaves the caret outside the second pill', async () => {
    const editor = await createEditor('123\n')
    const view = viewOf(editor)
    applyCode(view, 1, 4)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 2)))
    expect(splitInlineCodeOnEnter(view.state, view.dispatch)).toBe(true)
    expect(view.state.doc.childCount).toBe(2)
    expect(view.state.doc.child(0).textContent).toBe('1')
    expect(view.state.doc.child(1).textContent).toBe('23')
    expect(view.state.doc.rangeHasMark(1, 2, codeType(view))).toBe(true)
    const secondStart = view.state.doc.child(0).nodeSize + 1
    expect(view.state.doc.rangeHasMark(secondStart, secondStart + 2, codeType(view))).toBe(true)
    expect(view.state.selection.from).toBe(secondStart)
    expect(view.state.storedMarks).toEqual([])
  })

  it('merges back into one span on Backspace', async () => {
    const editor = await createEditor('123\n')
    const view = viewOf(editor)
    applyCode(view, 1, 4)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 2)))
    splitInlineCodeOnEnter(view.state, view.dispatch)
    expect(joinBackward(view.state, view.dispatch)).toBe(true)
    expect(view.state.doc.childCount).toBe(1)
    expect(view.state.doc.textContent).toBe('123')
    expect(view.state.doc.rangeHasMark(1, 4, codeType(view))).toBe(true)
  })

  it('does not split at the span edge', async () => {
    const editor = await createEditor('123\n')
    const view = viewOf(editor)
    applyCode(view, 1, 4)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 1)))
    expect(splitInlineCodeOnEnter(view.state, view.dispatch)).toBe(false)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 4)))
    expect(splitInlineCodeOnEnter(view.state, view.dispatch)).toBe(false)
  })
})

describe('inline code caret chrome', () => {
  it('treats a selected placeholder as inside the pill', async () => {
    const editor = await createEditor()
    const view = viewOf(editor)
    toggleDeskInlineCode(view.state, view.dispatch)
    expect(isInsideInlineCode(view.state)).toBe(true)
    expect(inlineCodeCaretKind(view.state)).toBe('inside')
    expect(view.dom.dataset.inlineCodeCaret).toBe('inside')
  })

  it('distinguishes the same edge position as inside vs outside', async () => {
    const editor = await createEditor('123\n')
    const view = viewOf(editor)
    const type = codeType(view)
    applyCode(view, 1, 4)

    view.dispatch(
      view.state.tr.setSelection(TextSelection.create(view.state.doc, 4)).setStoredMarks([type.create()])
    )
    expect(isInsideInlineCode(view.state)).toBe(true)
    expect(inlineCodeCaretKind(view.state)).toBe('inside-end')
    expect(view.dom.dataset.inlineCodeCaret).toBe('inside-end')

    expect(press(view, 'ArrowRight')).toBe(true)
    expect(isInsideInlineCode(view.state)).toBe(false)
    expect(inlineCodeCaretKind(view.state)).toBe('outside-end')
    expect(view.dom.dataset.inlineCodeCaret).toBe('outside-end')

    expect(press(view, 'ArrowLeft')).toBe(true)
    expect(view.state.selection.from).toBe(4)
    expect(isInsideInlineCode(view.state)).toBe(true)
    expect(inlineCodeCaretKind(view.state)).toBe('inside-end')
    expect(view.dom.dataset.inlineCodeCaret).toBe('inside-end')

    view.dispatch(
      view.state.tr.setSelection(TextSelection.create(view.state.doc, 1)).setStoredMarks([type.create()])
    )
    expect(inlineCodeCaretKind(view.state)).toBe('inside-start')
    expect(press(view, 'ArrowLeft')).toBe(true)
    expect(inlineCodeCaretKind(view.state)).toBe('outside-start')
    expect(view.dom.dataset.inlineCodeCaret).toBe('outside-start')

    expect(press(view, 'ArrowRight')).toBe(true)
    expect(view.state.selection.from).toBe(1)
    expect(inlineCodeCaretKind(view.state)).toBe('inside-start')
  })

  it('stops outside the pill before entering when approaching from the next character', async () => {
    const editor = await createEditor('code123\n')
    const view = viewOf(editor)
    applyCode(view, 1, 5)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 6)))
    expect(press(view, 'ArrowLeft')).toBe(true)
    expect(view.state.selection.from).toBe(5)
    expect(isInsideInlineCode(view.state)).toBe(false)
    expect(inlineCodeCaretKind(view.state)).toBe('outside-end')

    expect(press(view, 'ArrowLeft')).toBe(true)
    expect(view.state.selection.from).toBe(5)
    expect(isInsideInlineCode(view.state)).toBe(true)
    expect(inlineCodeCaretKind(view.state)).toBe('inside-end')
  })

  it('rings the live span while the caret is inside', async () => {
    const editor = await createEditor('123\n')
    const view = viewOf(editor)
    applyCode(view, 1, 4)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 2)))
    expect(view.dom.querySelector('.desk-inline-code--active')).not.toBeNull()

    view.dispatch(
      view.state.tr.setSelection(TextSelection.create(view.state.doc, 4)).setStoredMarks([])
    )
    expect(view.dom.querySelector('.desk-inline-code--active')).toBeNull()
  })
})

describe('moveOrSelectTextblockEdge', () => {
  it('Shift+Cmd+→ from before a pill selects through the following text', async () => {
    const editor = await createEditor('code123\n')
    const view = viewOf(editor)
    applyCode(view, 1, 5)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 1)))
    expect(moveOrSelectTextblockEdge(view.state, view.dispatch, 1, true)).toBe(true)
    expect(view.state.selection.from).toBe(1)
    expect(view.state.selection.to).toBe(view.state.selection.$from.end())
    expect(view.state.doc.textBetween(view.state.selection.from, view.state.selection.to)).toBe(
      'code123'
    )
  })

  it('handles Shift+Mod-ArrowRight from the keyboard plugin', async () => {
    const editor = await createEditor('code123\n')
    const view = viewOf(editor)
    applyCode(view, 1, 5)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 1)))
    expect(press(view, 'ArrowRight', { metaKey: true, shiftKey: true })).toBe(true)
    expect(view.state.doc.textBetween(view.state.selection.from, view.state.selection.to)).toBe(
      'code123'
    )
  })
})

describe('inlineCodeCaretOffset', () => {
  const box = { left: 100, right: 180 }
  const padding = { left: 8, right: 8 }

  it('puts the outside caret just past the pill, not on the next glyph', () => {
    expect(inlineCodeCaretOffset('inside-end', box, 40, padding)).toBe(134)
    expect(inlineCodeCaretOffset('outside-end', box, 40, padding)).toBe(141)
    expect(inlineCodeCaretOffset('inside-start', box, 40, padding)).toBe(67)
    expect(inlineCodeCaretOffset('outside-start', box, 40, padding)).toBe(58)
    expect(inlineCodeCaretOffset('inside', box, 40, padding)).toBeNull()
  })
})

describe('inline code IME', () => {
  it('collapses a selected placeholder so composition stays in the mark', async () => {
    const editor = await createEditor()
    const view = viewOf(editor)
    toggleDeskInlineCode(view.state, view.dispatch)
    expect(prepareInlineCodeComposition(view.state, view.dispatch)).toBe(true)
    expect(view.state.doc.textContent).toBe('')
    expect(view.state.selection.empty).toBe(true)
    expect(codeType(view).isInSet(view.state.storedMarks ?? [])).toBeTruthy()
  })

  it('marks confirmed IME text that landed outside the pill', async () => {
    const editor = await createEditor('啊啊啊\n')
    const view = viewOf(editor)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 4)))
    const tr = repairInlineCodeAfterComposition(view.state, { anchor: 1, fromPlaceholder: true })
    expect(tr).not.toBeNull()
    view.dispatch(tr!)
    expect(view.state.doc.rangeHasMark(1, 4, codeType(view))).toBe(true)
    expect(isInsideInlineCode(view.state)).toBe(true)
  })

  it('absorbs leaked pinyin and drops a leftover placeholder', async () => {
    const editor = await createEditor('aacode\n')
    const view = viewOf(editor)
    applyCode(view, 3, 7)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 3)))
    const tr = repairInlineCodeAfterComposition(view.state, { anchor: 1, fromPlaceholder: true })
    expect(tr).not.toBeNull()
    view.dispatch(tr!)
    expect(view.state.doc.textContent).toBe('aa')
    expect(view.state.doc.rangeHasMark(1, 3, codeType(view))).toBe(true)
  })
})

describe('keyboard plugin', () => {
  it('handles Mod-e, Enter and boundary arrows', async () => {
    const editor = await createEditor()
    const view = viewOf(editor)
    expect(press(view, 'e', { metaKey: true })).toBe(true)
    expect(view.state.doc.textContent).toBe(INLINE_CODE_PLACEHOLDER)

    const { from, to } = view.state.selection
    expect(view.someProp('handleTextInput', (handle) => handle(view, from, to, '123'))).toBe(true)
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 2)))
    expect(press(view, 'Enter')).toBe(true)
    expect(view.state.doc.child(0).textContent).toBe('1')
    expect(view.state.doc.child(1).textContent).toBe('23')

    const type = codeType(view)
    view.dispatch(
      view.state.tr
        .setSelection(TextSelection.create(view.state.doc, 2))
        .setStoredMarks([type.create()])
    )
    expect(findInlineCodeSpan(view.state.doc, 2, type)?.to).toBe(2)
    expect(press(view, 'ArrowRight')).toBe(true)
    expect(type.isInSet(view.state.storedMarks ?? [])).toBeFalsy()
  })
})
