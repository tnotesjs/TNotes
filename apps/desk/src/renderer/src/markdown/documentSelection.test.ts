// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorViewCtx, rootCtx } from '@milkdown/kit/core'
import { GapCursor } from '@milkdown/kit/prose/gapcursor'
import { AllSelection, TextSelection } from '@milkdown/kit/prose/state'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'

import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins
} from '../editor/markdown/rawBlockProjection'
import { createRawBlockSelectionPlugin } from './rawBlockInteractions'
import {
  DESK_SELECT_ALL_EVENT,
  applyClearEntireDocument,
  applySelectEntireDocument,
  clearEntireDocument,
  createDocumentSelectAllPlugin,
  selectEntireDocument,
  selectionCoversEntireDocument,
  shouldHandleDeskSelectAll
} from './documentSelection'

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
    .use(createDocumentSelectAllPlugin())
    .use(createRawBlockSelectionPlugin())
  editors.push(editor)
  await editor.create()
  return editor
}

const mixedNote = [
  '# 认识 webpack',
  '',
  'Webpack 是一个打包工具。',
  '',
  '- 依赖管理',
  '- 资源优化',
  '',
  '结尾段落'
].join('\n')

describe('shouldHandleDeskSelectAll', () => {
  it('treats standalone hosts as active and split groups by .active', () => {
    const host = document.createElement('div')
    expect(shouldHandleDeskSelectAll(host, true)).toBe(true)
    expect(shouldHandleDeskSelectAll(host, false)).toBe(false)

    const group = document.createElement('div')
    group.className = 'editor-group'
    group.append(host)
    document.body.append(group)
    expect(shouldHandleDeskSelectAll(host, true)).toBe(false)
    group.classList.add('active')
    expect(shouldHandleDeskSelectAll(host, true)).toBe(true)
  })
})

describe('document select-all', () => {
  it('covers a spanning text selection and AllSelection', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const { doc } = view.state
      expect(selectionCoversEntireDocument(new AllSelection(doc), doc)).toBe(true)
      view.dispatch(selectEntireDocument(view.state))
      expect(selectionCoversEntireDocument(view.state.selection, view.state.doc)).toBe(true)
      expect(view.state.selection).toBeInstanceOf(TextSelection)
    })
  })

  it('does not treat a caret or a single-block range as the whole note', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      expect(selectionCoversEntireDocument(view.state.selection, view.state.doc)).toBe(false)
      const start = TextSelection.atStart(view.state.doc)
      const inFirst = TextSelection.create(
        view.state.doc,
        start.from,
        Math.min(start.from + 4, start.$from.end())
      )
      expect(selectionCoversEntireDocument(inFirst, view.state.doc)).toBe(false)
    })
  })

  it('replaces a fully selected mixed note with one empty paragraph', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(selectEntireDocument(view.state))
      const cleared = clearEntireDocument(view.state)
      expect(cleared).not.toBeNull()
      view.dispatch(cleared!)
      expect(view.state.doc.childCount).toBe(1)
      expect(view.state.doc.firstChild?.type.name).toBe('paragraph')
      expect(view.state.doc.textContent).toBe('')
    })
  })

  it('clears the note on Backspace/Delete after select-all', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      applySelectEntireDocument(view)
      expect(applyClearEntireDocument(view)).toBe(true)
      expect(view.state.doc.textContent).toBe('')
      expect(view.state.doc.childCount).toBe(1)
    })
  })

  it('selects the note when the application menu dispatches desk:select-all', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      expect(selectionCoversEntireDocument(view.state.selection, view.state.doc)).toBe(false)
      window.dispatchEvent(new Event(DESK_SELECT_ALL_EVENT))
      expect(selectionCoversEntireDocument(view.state.selection, view.state.doc)).toBe(true)
    })
  })

  it('keeps locked frontmatter when clearing a note that starts with YAML', async () => {
    const editor = await createEditor(
      [
        '---',
        'id: c9b10d0b-e8f9-4b98-8199-8a2156f439ea',
        '---',
        '',
        '# 认识 webpack',
        '',
        'Webpack 是一个打包工具。',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      expect(view.state.doc.toString()).toContain('deskRawBlock')
      applySelectEntireDocument(view)
      expect(applyClearEntireDocument(view)).toBe(true)
      expect(view.state.doc.textContent).toBe('')
      expect(view.state.doc.toString()).toContain('deskRawBlock')
      expect(
        [...Array(view.state.doc.childCount)].map(
          (_, index) => view.state.doc.child(index).type.name
        )
      ).toEqual(['deskRawBlock', 'paragraph'])
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(view.state.selection.$head.parent.type.name).toBe('paragraph')
      expect(view.state.selection.empty).toBe(true)
    })
  })

  it('clears author HTML comments with the note but keeps frontmatter', async () => {
    const editor = await createEditor(
      [
        '---',
        'id: c9b10d0b-e8f9-4b98-8199-8a2156f439ea',
        '---',
        '',
        '<!-- leftover todo -->',
        '',
        '# 认识 webpack',
        '',
        'Webpack 是一个打包工具。',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      applySelectEntireDocument(view)
      expect(applyClearEntireDocument(view)).toBe(true)
      expect(view.state.doc.textContent).toBe('')
      const raw: Array<{ kind: unknown; source: unknown }> = []
      view.state.doc.descendants((node) => {
        if (node.type.name === 'deskRawBlock') {
          raw.push({ kind: node.attrs.kind, source: node.attrs.source })
        }
      })
      expect(raw.some((block) => block.kind === 'raw-frontmatter')).toBe(true)
      expect(raw.some((block) => String(block.source).includes('leftover todo'))).toBe(false)
    })
  })

  it('moves a gap cursor off hidden frontmatter into the empty line', async () => {
    const editor = await createEditor(
      ['---', 'id: c9b10d0b-e8f9-4b98-8199-8a2156f439ea', '---', '', '正文', ''].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      applySelectEntireDocument(view)
      applyClearEntireDocument(view)
      view.dispatch(view.state.tr.setSelection(new GapCursor(view.state.doc.resolve(0))))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(view.state.selection.$head.parent.type.name).toBe('paragraph')
      expect(view.state.selection.$head.parent.content.size).toBe(0)
    })
  })

  it('handles Mod-a and Backspace through the keymap', async () => {
    const editor = await createEditor(mixedNote)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const selectAll = new KeyboardEvent('keydown', {
        key: 'a',
        metaKey: true,
        bubbles: true,
        cancelable: true
      })
      expect(view.someProp('handleKeyDown', (handle) => handle(view, selectAll)) ?? false).toBe(
        true
      )
      expect(selectionCoversEntireDocument(view.state.selection, view.state.doc)).toBe(true)

      const backspace = new KeyboardEvent('keydown', {
        key: 'Backspace',
        bubbles: true,
        cancelable: true
      })
      expect(view.someProp('handleKeyDown', (handle) => handle(view, backspace)) ?? false).toBe(
        true
      )
      expect(view.state.doc.textContent).toBe('')
    })
  })
})
