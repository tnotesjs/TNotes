// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorViewCtx, rootCtx } from '@milkdown/kit/core'
import { AllSelection, NodeSelection, Selection, TextSelection } from '@milkdown/kit/prose/state'
import { toggleMark } from '@milkdown/kit/prose/commands'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'

import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins
} from '../editor/markdown/rawBlockProjection'
import { createRawBlockSelectionPlugin } from './rawBlockInteractions'
import {
  classifySelection,
  classifySelectionRange,
  coerceMarkVsBlockSelection,
  isTextMarkShortcut,
  selectionForIndependentBlocks,
  textSelectionSpanningDocument
} from './selectionKind'
import { BlockRangeSelection } from './verticalBlockSelection'

const editors: Editor[] = []

afterEach(async () => {
  await Promise.all(editors.splice(0).map((editor) => editor.destroy()))
  document.body.replaceChildren()
})

async function createEditor(source: string): Promise<Editor> {
  const root = document.createElement('div')
  document.body.append(root)
  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, projectRawBlocksForMilkdown(source))
    })
    .use(commonmark)
    .use(gfm)
    .use(rawBlockProjectionPlugins)
    .use(createRawBlockSelectionPlugin())
  editors.push(editor)
  await editor.create()
  return editor
}

const mixedNote = [
  '一段正文',
  '',
  '![](https://example.com/a.png)',
  '',
  '```js',
  'const x = 1',
  '```',
  '',
  '::: info INFO',
  '',
  '高亮',
  '',
  ':::',
  '',
  '结尾'
].join('\n')

function selectAllText(view: {
  state: { doc: Parameters<typeof textSelectionSpanningDocument>[0] }
}): Selection {
  const { doc } = view.state
  return textSelectionSpanningDocument(doc) ?? new AllSelection(doc)
}

describe('classifySelectionRange', () => {
  it('treats ordinary paragraphs as mark-bearing', async () => {
    const editor = await createEditor('一段正文\n\n第二段\n')
    editor.action((ctx) => {
      const { doc } = ctx.get(editorViewCtx).state
      expect(classifySelectionRange(doc, 0, doc.content.size)).toBe('marks')
    })
  })

  it('treats images, fences and raw cards as blocks', async () => {
    const editor = await createEditor(
      '![](https://example.com/a.png)\n\n```js\nconst x = 1\n```\n\n::: info INFO\n\n高亮\n\n:::\n'
    )
    editor.action((ctx) => {
      const { doc } = ctx.get(editorViewCtx).state
      expect(classifySelectionRange(doc, 0, doc.content.size)).toBe('blocks')
    })
  })

  it('treats a mixed note as mixed', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const { doc } = ctx.get(editorViewCtx).state
      expect(classifySelectionRange(doc, 0, doc.content.size)).toBe('mixed')
    })
  })

  it('keeps a table-cell caret as marks so Cmd+B still applies inside the cell', async () => {
    const editor = await createEditor(
      '| Header A | Header B |\n| --- | --- |\n| Cell A | Cell B |\n'
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let cell = 0
      view.state.doc.descendants((node, pos) => {
        if (node.textContent === 'Cell A' && node.type.name === 'paragraph') cell = pos + 1
      })
      expect(cell).toBeGreaterThan(0)
      expect(classifySelectionRange(view.state.doc, cell, cell + 6)).toBe('marks')
    })
  })
})

describe('coerceMarkVsBlockSelection', () => {
  it('collapses a text range over one standalone image to NodeSelection', async () => {
    const editor = await createEditor('![](https://example.com/a.png)\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let imagePos = -1
      let paraPos = -1
      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image') imagePos = pos
        if (
          node.type.name === 'paragraph' &&
          node.childCount === 1 &&
          node.firstChild?.type.name === 'image'
        ) {
          paraPos = pos
        }
      })
      view.dispatch(
        view.state.tr.setSelection(
          TextSelection.create(
            view.state.doc,
            paraPos + 1,
            paraPos + view.state.doc.nodeAt(paraPos)!.nodeSize - 1
          )
        )
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(imagePos)
      expect((view.state.selection as NodeSelection).node.type.name).toBe('image')
    })
  })

  it('collapses a text range over two images to a block range', async () => {
    const editor = await createEditor(
      '![](https://example.com/a.png)\n\n![](https://example.com/b.png)\n'
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(selectAllText(view)))
      expect(view.state.selection).toBeInstanceOf(BlockRangeSelection)
      expect(classifySelection(view.state.selection, view.state.doc)).toBe('blocks')
    })
  })

  it('keeps Cmd+A on a mixed note as a text range', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(selectAllText(view)))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(classifySelection(view.state.selection, view.state.doc)).toBe('mixed')
    })
  })

  it('rewrites AllSelection on mixed notes to TextSelection so the mark toolbar can show', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(new AllSelection(view.state.doc)))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(classifySelection(view.state.selection, view.state.doc)).toBe('mixed')
    })
  })

  it('rewrites AllSelection on image-only notes to a card selection', async () => {
    const editor = await createEditor('![](https://example.com/a.png)\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(new AllSelection(view.state.doc)))
      expect(
        view.state.selection instanceof NodeSelection ||
          view.state.selection instanceof BlockRangeSelection
      ).toBe(true)
      expect(classifySelection(view.state.selection, view.state.doc)).toBe('blocks')
    })
  })
})

describe('Cmd+B on mixed vs card-only selections', () => {
  it('bolds only real text when the whole mixed note is selected', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(selectAllText(view)))
      const strong = view.state.schema.marks.strong
      expect(strong).toBeTruthy()
      expect(toggleMark(strong)(view.state, view.dispatch)).toBe(true)
      let textHasStrong = false
      let imageHasStrong = false
      view.state.doc.descendants((node) => {
        if (node.isText && node.text?.includes('正文') && strong.isInSet(node.marks)) {
          textHasStrong = true
        }
        if (node.type.name === 'image' && strong.isInSet(node.marks)) imageHasStrong = true
      })
      expect(textHasStrong).toBe(true)
      expect(imageHasStrong).toBe(false)
      expect(view.state.doc.toString()).toContain('code_block')
      expect(view.state.doc.toString()).toContain('deskRawBlock')
    })
  })

  it('does not apply bold when only cards are selected', async () => {
    const editor = await createEditor('![](https://example.com/a.png)\n\n```js\nconst x = 1\n```\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(selectAllText(view)))
      expect(classifySelection(view.state.selection, view.state.doc)).toBe('blocks')
      const strong = view.state.schema.marks.strong
      const before = view.state.doc.toJSON()
      const event = new KeyboardEvent('keydown', {
        key: 'b',
        metaKey: true,
        bubbles: true,
        cancelable: true
      })
      expect(view.someProp('handleKeyDown', (handle) => handle(view, event)) ?? false).toBe(true)
      toggleMark(strong)(view.state, view.dispatch)
      expect(view.state.doc.toJSON()).toEqual(before)
    })
  })
})

describe('selectionForIndependentBlocks', () => {
  it('selects the image node inside a standalone paragraph', async () => {
    const editor = await createEditor('![](https://example.com/a.png)\n')
    editor.action((ctx) => {
      const { doc } = ctx.get(editorViewCtx).state
      let imagePos = -1
      doc.descendants((node, pos) => {
        if (node.type.name === 'image') imagePos = pos
      })
      const next = selectionForIndependentBlocks(doc, 0, doc.content.size)
      expect(next).toBeInstanceOf(NodeSelection)
      expect(next?.from).toBe(imagePos)
    })
  })
})

describe('isTextMarkShortcut', () => {
  it('matches bold, italic, code, link and strike', () => {
    expect(isTextMarkShortcut(new KeyboardEvent('keydown', { key: 'b', metaKey: true }))).toBe(true)
    expect(isTextMarkShortcut(new KeyboardEvent('keydown', { key: 'i', ctrlKey: true }))).toBe(true)
    expect(
      isTextMarkShortcut(new KeyboardEvent('keydown', { key: 's', metaKey: true, shiftKey: true }))
    ).toBe(true)
    expect(isTextMarkShortcut(new KeyboardEvent('keydown', { key: 'c', metaKey: true }))).toBe(
      false
    )
  })
})

describe('coerceMarkVsBlockSelection helper', () => {
  it('returns null for an already-correct card NodeSelection', async () => {
    const editor = await createEditor('![](https://example.com/a.png)\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let imagePos = -1
      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'image') imagePos = pos
      })
      const selected = view.state.apply(
        view.state.tr.setSelection(NodeSelection.create(view.state.doc, imagePos))
      )
      expect(coerceMarkVsBlockSelection(selected)).toBeNull()
    })
  })
})
