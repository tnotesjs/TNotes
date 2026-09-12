// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorStateCtx, editorViewCtx, rootCtx } from '@milkdown/kit/core'
import { NodeSelection, Selection, TextSelection } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'
import { CellSelection } from '@milkdown/kit/prose/tables'
import { EditorState as CodeMirrorState, EditorSelection } from '@codemirror/state'
import { EditorView as CodeMirrorView } from '@codemirror/view'
import { BlockRangeSelection, verticalBlockSelectionKey } from './verticalBlockSelection'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'

import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins
} from '../editor/markdown/rawBlockProjection'
import { BlockBoundaryCaret, activeBlockBoundaryTarget } from './blockBoundaryCaret'
import {
  codeBlockWholeSelectPosition,
  createRawBlockSelectionPlugin,
  isRawBlockPreviewInteractive
} from './rawBlockInteractions'

const editors: Editor[] = []
const codeEditors: CodeMirrorView[] = []

const tableMarkdown = '| Header A | Header B |\n| --- | --- |\n| Cell A | Cell B |'

afterEach(async () => {
  codeEditors.splice(0).forEach((editor) => editor.destroy())
  await Promise.all(editors.splice(0).map((editor) => editor.destroy()))
  document.body.replaceChildren()
})

async function createEditor(
  source = '上方段落\n\n<B id="selection" />\n\n下方段落\n'
): Promise<Editor> {
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

function positions(editor: Editor): { beforeEnd: number; raw: number; afterStart: number } {
  const result = { beforeEnd: -1, raw: -1, afterStart: -1 }
  editor.action((ctx) => {
    const state = ctx.get(editorStateCtx)
    let textIndex = 0
    state.doc.descendants((node, position) => {
      if (node.type.name === 'deskRawBlock') result.raw = position
      if (node.type.name === 'paragraph') {
        if (textIndex === 0) result.beforeEnd = position + 1 + node.content.size
        else result.afterStart = position + 1
        textIndex += 1
      }
    })
  })
  return result
}

function codePositions(editor: Editor): {
  beforeEnd: number
  code: number
  afterStart: number
} {
  const result = { beforeEnd: -1, code: -1, afterStart: -1 }
  editor.action((ctx) => {
    const state = ctx.get(editorStateCtx)
    let textIndex = 0
    state.doc.descendants((node, position) => {
      if (node.type.name === 'code_block') result.code = position
      if (node.type.name === 'paragraph') {
        if (textIndex === 0) result.beforeEnd = position + 1 + node.content.size
        else result.afterStart = position + 1
        textIndex += 1
      }
    })
  })
  return result
}

describe('leaving embedded code at its final caret', () => {
  async function setup(
    kind: 'code' | 'group',
    after = '下方段落'
  ): Promise<{
    view: EditorView
    cm: CodeMirrorView
    press: (key: string, modifiers?: KeyboardEventInit) => KeyboardEvent
    code: string
    host: HTMLElement
  }> {
    const code = 'const first = 1\nconst last = 2'
    const fence = '```js\n' + code + '\n```'
    const source = kind === 'group' ? '::: code-group\n\n' + fence + '\n\n:::' : fence
    const editor = await createEditor('上方段落\n\n' + source + (after ? '\n\n' + after : ''))
    const view = editor.action((ctx) => ctx.get(editorViewCtx))
    view.setProps({
      nodeViews: {
        [kind === 'group' ? 'deskRawBlock' : 'code_block']: () => {
          const dom = document.createElement('div')
          dom.className = kind === 'group' ? 'desk-raw-block' : 'milkdown-code-block'
          dom.contentEditable = 'false'
          return { dom, ignoreMutation: () => true, stopEvent: () => true }
        }
      }
    })
    let position = -1
    view.state.doc.descendants((node, pos) => {
      if (node.type.name === (kind === 'group' ? 'deskRawBlock' : 'code_block')) position = pos
    })
    const block = view.nodeDOM(position) as HTMLElement
    block.classList.add(kind === 'group' ? 'desk-raw-block' : 'milkdown-code-block')
    const host = document.createElement('div')
    host.className = 'desk-code-tab'
    host.contentEditable = 'false'
    block.append(host)
    // Raw node views leave the outer selection on the atom during inner editing.
    view.dispatch(
      view.state.tr.setSelection(
        kind === 'group'
          ? NodeSelection.create(view.state.doc, position)
          : TextSelection.create(view.state.doc, position + 1 + code.length)
      )
    )
    const cm = new CodeMirrorView({
      parent: host,
      state: CodeMirrorState.create({
        doc: code,
        selection: { anchor: code.length },
        extensions: [CodeMirrorState.allowMultipleSelections.of(true)]
      })
    })
    codeEditors.push(cm)
    /**
     * 真实交互里按键总是落在「当前持有焦点」的地方：CM 里编辑时目标是 .cm-content，
     * 落到块边界光标后焦点回到 ProseMirror。这里照同样规则合成事件。
     */
    const press = (key: string, modifiers: KeyboardEventInit = {}): KeyboardEvent => {
      const boundaryActive = view.state.selection instanceof BlockBoundaryCaret
      const target = boundaryActive ? view.dom : cm.contentDOM
      const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
        ...modifiers
      })
      target.dispatchEvent(event)
      return event
    }
    return { view, cm, press, code, host }
  }

  for (const kind of ['code', 'group'] as const) {
    for (const after of ['下方段落', '## 下方标题', '- 下方列表']) {
      it.each(['ArrowDown', 'ArrowRight'])(
        `${kind} → ${after}: %s exits to 块后光标，再进文本开头`,
        async (key) => {
          const { view, cm, press } = await setup(kind, after)
          const doc = view.state.doc
          // 第一下：落到「块后光标」（块边界光标，不改文档）
          expect(press(key).defaultPrevented).toBe(true)
          expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
          expect(activeBlockBoundaryTarget(view.state)?.side).toBe('after')
          expect(view.state.doc.eq(doc)).toBe(true)
          // 第二下：进下一段开头
          press(key)
          expect(view.state.selection).toBeInstanceOf(TextSelection)
          expect(view.state.selection.empty).toBe(true)
          expect(view.state.selection.$head.parentOffset).toBe(0)
          expect(view.state.selection.$head.parent.textContent).toBe(after.replace(/^(## |- )/, ''))
          expect(view.hasFocus()).toBe(true)
          expect(cm.hasFocus).toBe(false)
          expect(view.state.doc.eq(doc)).toBe(true)
        }
      )
    }

    it.each(['ArrowDown', 'ArrowRight'])(
      `${kind}: %s 先到块后光标，再按一次补一个可编辑尾段落`,
      async (key) => {
        const { view, press } = await setup(kind, '')
        const count = view.state.doc.childCount
        press(key)
        expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
        expect(view.state.doc.childCount).toBe(count)
        press(key)
        expect(view.state.doc.childCount).toBe(count + 1)
        expect(view.state.doc.lastChild?.type.name).toBe('paragraph')
        expect(view.state.selection.$head.parentOffset).toBe(0)
        expect(view.state.selection.$head.parent.content.size).toBe(0)
      }
    )

    it(`${kind}: interior caret, selections, modifiers and composition stay inside CM`, async () => {
      const { view, cm, press, code } = await setup(kind)
      const original = view.state.selection
      cm.dispatch({ selection: { anchor: code.length - 1 } })
      press('ArrowRight')
      expect(view.state.selection.eq(original)).toBe(true)
      cm.dispatch({ selection: { anchor: 0, head: code.length } })
      press('ArrowDown')
      expect(view.state.selection.eq(original)).toBe(true)
      cm.dispatch({
        selection: EditorSelection.create(
          [EditorSelection.cursor(0), EditorSelection.cursor(code.length)],
          1
        )
      })
      press('ArrowRight')
      expect(view.state.selection.eq(original)).toBe(true)
      cm.dispatch({ selection: { anchor: code.length - 1 } })
      for (const modifiers of [
        { shiftKey: true },
        { altKey: true },
        { metaKey: true },
        { ctrlKey: true },
        { isComposing: true }
      ]) {
        press('ArrowDown', modifiers)
        expect(view.state.selection.eq(original)).toBe(true)
      }
      // 末尾行尾的 ↓（无修饰键）才交回 PM：落到块后光标
      cm.dispatch({ selection: { anchor: code.length } })
      press('ArrowDown')
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      expect(activeBlockBoundaryTarget(view.state)?.side).toBe('after')
    })
  }

  it('does not skip the empty paragraph after a code group', async () => {
    const { view, press } = await setup('group', '<br />\n\n下方段落')
    press('ArrowDown')
    expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
    press('ArrowDown')
    expect(view.state.selection.$head.parent.type.name).toBe('paragraph')
    expect(view.state.selection.$head.parent.content.size).toBe(0)
  })

  it('does not intercept the raw-source editor or readonly notes', async () => {
    const { view, press, host } = await setup('group')
    const original = view.state.selection
    host.className = 'desk-raw-block__editor-cm'
    press('ArrowDown')
    expect(view.state.selection.eq(original)).toBe(true)
    host.className = 'desk-code-tab'
    view.setProps({ editable: () => false })
    press('ArrowRight')
    expect(view.state.selection.eq(original)).toBe(true)
  })
})

describe('raw block keyboard selection', () => {
  it.each(['ArrowLeft', 'ArrowRight'])(
    '%s stays within a heading between a generated TOC and a raw block',
    async (key) => {
      const editor = await createEditor(
        '# 标题\n\n<!-- region:toc -->\n- [1. 概述](#1-概述)\n<!-- endregion:toc -->\n\n## 1. 概述\n\n<B id="selection" />\n'
      )
      editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        let headingStart = -1
        let headingLength = 0
        view.state.doc.descendants((node, position) => {
          if (node.type.name === 'heading') {
            headingStart = position + 1
            headingLength = node.content.size
          }
        })
        const offsets =
          key === 'ArrowLeft'
            ? Array.from({ length: headingLength }, (_, index) => index + 1)
            : Array.from({ length: headingLength }, (_, index) => index)
        for (const offset of offsets) {
          const position = headingStart + offset
          view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, position)))
          view.dom.dispatchEvent(
            new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
          )
          // happy-dom does not execute browser caret movement. Desk must leave
          // the text caret alone here instead of replacing it with NodeSelection.
          expect(view.state.selection).toBeInstanceOf(TextSelection)
          expect(view.state.selection.head).toBe(position)
        }
      })
    }
  )

  it.each([
    ['raw', '<B id="selection" />'],
    ['code', '```js\nconst value = 1\n```']
  ])('only crosses horizontal text boundaries next to a %s block', async (_kind, block) => {
    const editor = await createEditor(`上方段落\n\n${block}\n\n下方段落\n`)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const first = view.state.doc.firstChild!
      const blockPosition = first.nodeSize
      const blockNode = view.state.doc.child(1)
      const afterStart = blockPosition + blockNode.nodeSize + 1
      const afterEnd = blockPosition + blockNode.nodeSize
      for (const [key, caret, expected, side] of [
        ['ArrowRight', first.content.size, null, null],
        ['ArrowRight', first.content.size + 1, blockPosition, 'before'],
        ['ArrowLeft', afterStart + 1, null, null],
        ['ArrowLeft', afterStart, afterEnd, 'after']
      ] as const) {
        view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, caret)))
        // 新模型：方向键进入相邻特殊块先落到块前/块后光标（不再整块选中）
        const event = new KeyboardEvent('keydown', { key, cancelable: true })
        view.someProp('handleKeyDown', (handle) => handle(view, event))
        if (expected === null) {
          expect(view.state.selection).toBeInstanceOf(TextSelection)
          expect(view.state.selection.head).toBe(caret)
        } else {
          expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
          expect(view.state.selection.head).toBe(expected)
          expect(activeBlockBoundaryTarget(view.state)?.side).toBe(side)
        }
      }
    })
  })

  it('keeps horizontal movement between list items inside the list', async () => {
    const editor = await createEditor('<B />\n\n- 第一项\n- 第二项\n\n<B />\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const state = ctx.get(editorStateCtx)
      const paragraphs: Array<{ start: number; end: number }> = []
      state.doc.descendants((node, position) => {
        if (node.type.name === 'paragraph') {
          paragraphs.push({ start: position + 1, end: position + 1 + node.content.size })
        }
      })
      // 列表项内部还有兄弟节点：横向移动不出块，也不该落块边界光标。
      view.dispatch(
        view.state.tr.setSelection(TextSelection.create(view.state.doc, paragraphs[0].end))
      )
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
      expect(view.state.selection).not.toBeInstanceOf(BlockBoundaryCaret)
      expect(view.state.selection.from).toBe(paragraphs[0].end)
      view.dispatch(
        view.state.tr.setSelection(TextSelection.create(view.state.doc, paragraphs[1].start))
      )
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
      expect(view.state.selection).not.toBeInstanceOf(BlockBoundaryCaret)
      expect(view.state.selection.from).toBe(paragraphs[1].start)
    })
  })

  it('ArrowDown from an empty line selects the next standalone image, then exits past it', async () => {
    const editor = await createEditor(
      '上方段落\n\n<br />\n\n![](https://example.com/a.png)\n\n下方段落\n'
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let emptyStart = -1
      let imagePos = -1
      let afterStart = -1
      view.state.doc.descendants((node, position) => {
        if (node.type.name === 'image') imagePos = position
        if (node.type.name !== 'paragraph') return
        if (node.childCount === 0) emptyStart = position + 1
        else if (node.childCount === 1 && node.firstChild?.type.name === 'image') return
        else if (node.textContent.includes('下方')) afterStart = position + 1
      })
      expect(emptyStart).toBeGreaterThan(-1)
      expect(imagePos).toBeGreaterThan(-1)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, emptyStart)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      // 新模型：方向键先落到「块前光标」，Shift+方向键才整块选中
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true })
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(imagePos)
      expect((view.state.selection as NodeSelection).node.type.name).toBe('image')
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(view.state.selection.from).toBe(afterStart)
    })
  })

  it('ArrowDown from the last image inserts a visible empty line instead of hiding the caret', async () => {
    const editor = await createEditor('![](https://example.com/a.png)\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let imagePos = -1
      view.state.doc.descendants((node, position) => {
        if (node.type.name === 'image') imagePos = position
      })
      expect(imagePos).toBeGreaterThan(-1)
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, imagePos)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      const $head = view.state.selection.$head
      expect($head.parent.type.name).toBe('paragraph')
      expect($head.parent.content.size).toBe(0)
      expect($head.parentOffset).toBe(0)
    })
  })

  it('ArrowUp from a selected image returns to the empty line, not the previous image', async () => {
    const editor = await createEditor(
      '![](https://example.com/a.png)\n\n<br />\n\n![](https://example.com/b.png)\n'
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const images: number[] = []
      let emptyStart = -1
      view.state.doc.descendants((node, position) => {
        if (node.type.name === 'image') images.push(position)
        if (node.type.name === 'paragraph' && node.childCount === 0) emptyStart = position + 1
      })
      expect(images).toHaveLength(2)
      expect(emptyStart).toBeGreaterThan(-1)
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, images[1]!)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(view.state.selection.from).toBe(emptyStart)
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, shiftKey: true })
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(images[0])
    })
  })

  it('Enter on a selected image deletes it and leaves one empty line', async () => {
    const editor = await createEditor('上方段落\n\n![](https://example.com/a.png)\n\n下方段落\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let imagePos = -1
      view.state.doc.descendants((node, position) => {
        if (node.type.name === 'image') imagePos = position
      })
      expect(imagePos).toBeGreaterThan(-1)
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, imagePos)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(view.state.doc.toString()).not.toContain('image')
      expect(view.state.doc.textContent).toBe('上方段落下方段落')
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(view.state.selection.$head.parent.type.name).toBe('paragraph')
      expect(view.state.selection.$head.parent.content.size).toBe(0)
      let emptyParagraphs = 0
      view.state.doc.forEach((node) => {
        if (node.type.name === 'paragraph' && node.content.size === 0) emptyParagraphs += 1
      })
      expect(emptyParagraphs).toBe(1)
    })
  })

  it('Enter on two range-selected images deletes both and leaves one empty line', async () => {
    const editor = await createEditor(
      '上方段落\n\n![](https://example.com/a.png)\n\n![](https://example.com/b.png)\n\n下方段落\n'
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const { doc } = view.state
      const anchor = doc.firstChild!.nodeSize - 1
      view.dispatch(view.state.tr.setSelection(TextSelection.create(doc, anchor)))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
      )
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
      )
      expect(view.state.selection).toBeInstanceOf(BlockRangeSelection)
      expect(view.dom.querySelectorAll('.desk-block--range-selected')).toHaveLength(2)
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(view.state.doc.toString()).not.toContain('image')
      expect(view.state.doc.textContent).toBe('上方段落下方段落')
      expect(view.state.selection.$head.parent.content.size).toBe(0)
      let emptyParagraphs = 0
      view.state.doc.forEach((node) => {
        if (node.type.name === 'paragraph' && node.content.size === 0) emptyParagraphs += 1
      })
      expect(emptyParagraphs).toBe(1)
    })
  })

  it('Enter in an image caption does not delete the image', async () => {
    const editor = await createEditor('![](https://example.com/a.png)\n\n下方段落\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let imagePos = -1
      view.state.doc.descendants((node, position) => {
        if (node.type.name === 'image') imagePos = position
      })
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, imagePos)))
      const input = document.createElement('input')
      view.dom.append(input)
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(view.state.doc.toString()).toContain('image')
    })
  })

  it('ArrowDown 到块前光标后 Delete 删整块', async () => {
    const editor = await createEditor()
    const pos = positions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos.beforeEnd)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      expect(activeBlockBoundaryTarget(view.state)?.side).toBe('before')
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))
      expect(view.state.doc.toString()).not.toContain('deskRawBlock')
    })
  })

  it('ArrowUp 到块后光标后 Backspace 删整块', async () => {
    const editor = await createEditor()
    const pos = positions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(
        view.state.tr.setSelection(TextSelection.create(view.state.doc, pos.afterStart))
      )
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      expect(activeBlockBoundaryTarget(view.state)?.side).toBe('after')
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }))
      expect(view.state.doc.toString()).not.toContain('deskRawBlock')
    })
  })

  it('selected atom: Backspace and Delete both remove it; ArrowDown exits past it', async () => {
    const editor = await createEditor()
    const pos = positions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos.beforeEnd)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      // 新模型：方向键先落到「块前光标」，Shift+方向键才整块选中
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true })
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }))
      expect(view.state.doc.toString()).not.toContain('deskRawBlock')
    })

    const editor2 = await createEditor()
    const pos2 = positions(editor2)
    editor2.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(
        view.state.tr.setSelection(TextSelection.create(view.state.doc, pos2.beforeEnd))
      )
      // 不可进入内部的原子：块前 → 块后 → 下一行文本，两个停靠点都在。
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      expect(activeBlockBoundaryTarget(view.state)?.side).toBe('before')
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      expect(activeBlockBoundaryTarget(view.state)?.side).toBe('after')
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(view.state.selection.head).toBe(pos2.afterStart)
      expect(view.state.doc.toString()).toContain('deskRawBlock')
    })
  })

  it('ArrowDown from a selected details atom lands on the following blank before text', async () => {
    const editor = await createEditor(
      [
        '## 2. 评价',
        '',
        '<br />',
        '',
        '::: details DETAILS',
        '',
        '这是输入的内容',
        '',
        ':::',
        '',
        '<br />',
        '',
        '上面这是空行',
        '',
        '```js',
        'console.log(123)',
        '```',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let infoPos = -1
      let emptyBefore = -1
      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'deskRawBlock' && node.attrs.hidden !== true && infoPos < 0) {
          infoPos = pos
        }
        if (node.type.name === 'paragraph' && node.content.size === 0 && infoPos < 0) {
          emptyBefore = pos + 1
        }
      })
      expect(infoPos).toBeGreaterThan(-1)
      expect(emptyBefore).toBeGreaterThan(-1)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, emptyBefore)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      // 新模型：方向键先落到「块前光标」，Shift+方向键才整块选中
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true })
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(infoPos)
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(view.state.selection.from).toBeGreaterThan(infoPos)
      expect((view.state.selection as TextSelection).$head.parent.content.size).toBe(0)
      // Must not jump onto the code fence past the blank + following text.
      expect(codeBlockWholeSelectPosition(view.state)).toBeNull()
    })
  })

  it('marks visible raw atoms crossed by a text range', async () => {
    const editor = await createEditor('上方段落\n\n<B id="selection" />\n\n下方段落\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(
        view.state.tr.setSelection(
          TextSelection.create(view.state.doc, 1, view.state.doc.content.size - 1)
        )
      )

      expect(
        view.dom
          .querySelector('[data-kind="raw-component"]')
          ?.classList.contains('desk-raw-block--range-selected')
      ).toBe(true)
    })
  })

  it('marks the whole atom with Shift+ArrowDown while retaining the text anchor', async () => {
    const editor = await createEditor()
    const pos = positions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos.beforeEnd)))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
      )
    })
    editor.action((ctx) => {
      const selection = ctx.get(editorStateCtx).selection
      expect(selection).toBeInstanceOf(BlockRangeSelection)
      expect(selection.anchor).toBe(pos.beforeEnd)
      expect(selection.head).toBeGreaterThan(pos.raw)
      expect(selection.empty).toBe(false)
      expect(
        ctx.get(editorViewCtx).dom.querySelectorAll('.desk-raw-block--range-selected')
      ).toHaveLength(1)
    })
  })

  it('Shift+ArrowDown from an empty line continues past a single details atom', async () => {
    const editor = await createEditor(
      [
        '## 2. 评价',
        '',
        '<br />',
        '',
        '::: details DETAILS',
        '',
        'body',
        '',
        ':::',
        '',
        '<br />',
        '',
        '上面这是空行',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let emptyBefore = -1
      let infoPos = -1
      let infoSize = 0
      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'deskRawBlock' && infoPos < 0) {
          infoPos = pos
          infoSize = node.nodeSize
        }
        if (node.type.name === 'paragraph' && node.content.size === 0 && infoPos < 0) {
          emptyBefore = pos + 1
        }
      })
      expect(emptyBefore).toBeGreaterThan(-1)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, emptyBefore)))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
      )
      expect(view.state.selection.empty).toBe(false)
      expect(view.dom.querySelectorAll('.desk-raw-block--range-selected')).toHaveLength(1)
      const firstHead = view.state.selection.head
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
      )
      expect(view.state.selection.empty).toBe(false)
      expect(view.state.selection.head).toBeGreaterThan(firstHead)
      expect(Math.max(view.state.selection.from, view.state.selection.to)).toBeGreaterThanOrEqual(
        infoPos + infoSize
      )
    })
  })

  it('Shift+ArrowDown from text before a fence covers the code block', async () => {
    const editor = await createEditor('123\n\n```js\nconsole.log(123)\n```\n\n222\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let textEnd = -1
      let codePos = -1
      let codeSize = 0
      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'code_block' && codePos < 0) {
          codePos = pos
          codeSize = node.nodeSize
        }
        if (node.type.name === 'paragraph' && node.textContent === '123') {
          textEnd = pos + 1 + node.content.size
        }
      })
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, textEnd)))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
      )
      expect(view.state.selection.empty).toBe(false)
      expect(Math.max(view.state.selection.from, view.state.selection.to)).toBeGreaterThanOrEqual(
        codePos + codeSize
      )
      const $from = view.state.doc.resolve(view.state.selection.from)
      const $to = view.state.doc.resolve(view.state.selection.to)
      expect($from.parent.type.name).not.toBe('code_block')
      expect($to.parent.type.name).not.toBe('code_block')
      expect(view.dom.querySelector('.desk-code-block--whole-selected')).toBeTruthy()
    })
  })

  it('Shift+ArrowUp from text below a fence keeps the below anchor and parks above', async () => {
    const editor = await createEditor('123\n\n```js\nconsole.log(123)\n```\n\n222\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let below = -1
      let codePos = -1
      let codeSize = 0
      view.state.doc.descendants((node, pos) => {
        if (node.type.name === 'code_block' && codePos < 0) {
          codePos = pos
          codeSize = node.nodeSize
        }
        if (node.type.name === 'paragraph' && node.textContent === '222') below = pos + 1
      })
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, below)))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true, bubbles: true })
      )
      const { selection } = view.state
      expect(selection.empty).toBe(false)
      expect(selection.from).toBeLessThanOrEqual(below)
      expect(selection.to).toBeGreaterThanOrEqual(below)
      expect(selection.from).toBeLessThanOrEqual(codePos)
      expect(selection.to).toBeGreaterThanOrEqual(codePos + codeSize)
      const $from = view.state.doc.resolve(selection.from)
      const $to = view.state.doc.resolve(selection.to)
      expect($from.parent.type.name).not.toBe('code_block')
      expect($to.parent.type.name).not.toBe('code_block')
    })
  })

  it('marks the whole atom with Shift+ArrowUp while retaining the text anchor', async () => {
    const editor = await createEditor()
    const pos = positions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(
        view.state.tr.setSelection(TextSelection.create(view.state.doc, pos.afterStart))
      )
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true, bubbles: true })
      )
    })
    editor.action((ctx) => {
      const selection = ctx.get(editorStateCtx).selection
      expect(selection).toBeInstanceOf(BlockRangeSelection)
      expect(selection.anchor).toBe(pos.afterStart)
      expect(selection.head).toBe(pos.raw)
      expect(selection.empty).toBe(false)
      expect(
        ctx.get(editorViewCtx).dom.querySelectorAll('.desk-raw-block--range-selected')
      ).toHaveLength(1)
    })
  })

  it('does not hijack ArrowDown from a non-last visual line', async () => {
    const editor = await createEditor(
      '第一行\n第二行还在段内\n\n<B id="selection" />\n\n下方段落\n'
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      // Caret after first character of a multi-line paragraph (still on first line).
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 2)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).not.toBeInstanceOf(BlockBoundaryCaret)
      expect(view.state.selection.from).toBe(2)
    })
  })

  it('maps standalone breaks to empty paragraphs instead of desk raw atoms', async () => {
    const editor = await createEditor('上方段落\n\n<br />\n\n下方段落\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let deskRawBlocks = 0
      let emptyParagraphs = 0
      view.state.doc.descendants((node) => {
        if (node.type.name === 'deskRawBlock') deskRawBlocks += 1
        if (node.type.name === 'paragraph' && node.content.size === 0) {
          emptyParagraphs += 1
        }
      })
      expect(deskRawBlocks).toBe(0)
      expect(emptyParagraphs).toBeGreaterThanOrEqual(1)
      expect(view.dom.querySelector('[data-type="desk-raw-block"]')).toBeNull()
    })
  })
})

describe('contiguous vertical block ranges', () => {
  it.each([
    ['table', tableMarkdown],
    ['video', '<B id="range" />'],
    ['image', '![image](./pixel.svg)'],
    ['code', '```js\nconst selected = 1\n```'],
    ['divider', '---']
  ])(
    'extends through a whole %s, enters the next paragraph, then reverses each step',
    async (_name, markdown) => {
      const editor = await createEditor(`before\n\n${markdown}\n\nafter\n`)
      editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        const { doc } = view.state
        const anchor = doc.firstChild!.nodeSize - 1
        const blockEnd = doc.firstChild!.nodeSize + doc.child(1).nodeSize
        const press = (key: string): void => {
          view.dom.dispatchEvent(
            new KeyboardEvent('keydown', { key, shiftKey: true, bubbles: true, cancelable: true })
          )
        }
        view.dispatch(view.state.tr.setSelection(TextSelection.create(doc, anchor)))
        press('ArrowDown')
        expect(view.state.selection.anchor).toBe(anchor)
        expect(view.state.selection.head).toBe(blockEnd)
        expect(view.state.selection.content().content.toString()).toContain(doc.child(1).type.name)
        expect(view.dom.querySelectorAll('.desk-block--range-selected')).toHaveLength(1)
        press('ArrowDown')
        expect(view.state.selection.head).toBe(doc.content.size - 1)
        press('ArrowUp')
        expect(view.state.selection.head).toBe(blockEnd)
        press('ArrowUp')
        expect(view.state.selection.eq(TextSelection.create(doc, anchor))).toBe(true)
        expect(view.dom.querySelectorAll('.desk-block--range-selected')).toHaveLength(0)
      })
    }
  )

  it('mouse-drag onto the last standalone image includes the whole image', async () => {
    const editor = await createEditor('上方段落\n\n![](https://example.com/a.png)\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const { doc } = view.state
      const textEnd = doc.firstChild!.nodeSize - 1
      const imageBlock = doc.firstChild!.nodeSize
      expect(doc.childCount).toBe(2)
      const $anchor = doc.resolve(textEnd)
      const fromLeadingEdge = view.someProp('createSelectionBetween', (create) =>
        create(view, $anchor, doc.resolve(imageBlock))
      )
      expect(fromLeadingEdge?.to).toBe(doc.content.size)
      expect(fromLeadingEdge?.content().content.toString()).toContain('image')
      const imagePos = imageBlock + 1
      expect(doc.nodeAt(imagePos)?.type.name).toBe('image')
      const fromImageNode = view.someProp('createSelectionBetween', (create) =>
        create(view, $anchor, doc.resolve(imagePos))
      )
      expect(fromImageNode?.to).toBe(doc.content.size)
      expect(fromImageNode?.content().content.toString()).toContain('image')
      const insideText = view.someProp('createSelectionBetween', (create) =>
        create(view, doc.resolve(1), doc.resolve(Math.max(2, textEnd - 1)))
      )
      expect(insideText ?? null).toBeNull()
    })
  })

  it('expands upward from below a table without moving the anchor, then collapses downward', async () => {
    const editor = await createEditor(`before\n\n${tableMarkdown}\n\nafter\n`)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const { doc } = view.state
      const anchor = doc.content.size - doc.lastChild!.nodeSize + 1
      view.dispatch(view.state.tr.setSelection(TextSelection.create(doc, anchor)))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true, bubbles: true })
      )
      expect(view.state.selection.anchor).toBe(anchor)
      expect(view.state.selection.head).toBe(doc.firstChild!.nodeSize)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
      )
      expect(view.state.selection.eq(TextSelection.create(doc, anchor))).toBe(true)
    })
  })

  it('adds consecutive different blocks one at a time, including at the document edge', async () => {
    const editor = await createEditor(
      `before\n\n${tableMarkdown}\n\n<B id="range" />\n\n\`\`\`js\ncode\n\`\`\`\n`
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const { doc } = view.state
      const anchor = doc.firstChild!.nodeSize - 1
      const heads = [anchor]
      let edge = doc.firstChild!.nodeSize
      view.dispatch(view.state.tr.setSelection(TextSelection.create(doc, anchor)))
      for (let index = 1; index < doc.childCount; index += 1) {
        edge += doc.child(index).nodeSize
        view.dom.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
        )
        expect(view.state.selection.head).toBe(edge)
        expect(view.dom.querySelectorAll('.desk-block--range-selected')).toHaveLength(index)
        heads.push(edge)
      }
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
      )
      expect(view.state.selection.head).toBe(doc.content.size)
      for (const head of heads.slice(0, -1).reverse()) {
        view.dom.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true, bubbles: true })
        )
        expect(view.state.selection.head).toBe(head)
      }
    })
  })

  it.each(['Delete', 'Backspace'])(
    '%s removes the selected table and no following text',
    async (key) => {
      const editor = await createEditor(`before\n\n${tableMarkdown}\n\nafter\n`)
      editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 7)))
        view.dom.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
        )
        const selection = view.state.selection
        expect(Selection.fromJSON(view.state.doc, selection.toJSON()).eq(selection)).toBe(true)
        expect(selection.getBookmark().resolve(view.state.doc).eq(selection)).toBe(true)
        view.dom.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
        expect(view.state.doc.toString()).not.toContain('table')
        expect(view.state.doc.textContent).toBe('beforeafter')
      })
    }
  )

  it('preserves an existing multiline text anchor and does not expand from the wrong end', async () => {
    const editor = await createEditor(`first\n\nsecond\n\n${tableMarkdown}\n\nafter\n`)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const before = TextSelection.create(view.state.doc, 3, 14)
      view.dispatch(view.state.tr.setSelection(before))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, bubbles: true })
      )
      expect(view.state.selection.anchor).toBe(3)
      expect(view.state.selection.content().content.toString()).toContain('table')
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', shiftKey: true, bubbles: true })
      )
      expect(view.state.selection.eq(before)).toBe(true)
    })
  })

  it('does not hijack cell text, mouse cell selections, modified keys or readonly editors', async () => {
    const editor = await createEditor(`before\n\n${tableMarkdown}\n\nafter\n`)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let cell = 0
      view.state.doc.descendants((node, pos) => {
        if (node.textContent === 'Cell A' && node.type.name === 'paragraph') cell = pos + 2
      })
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, cell)))
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true })
      const plugin = verticalBlockSelectionKey.get(view.state)!
      expect(plugin.props.handleKeyDown!.call(plugin, view, event)).toBe(false)
      expect(view.state.selection.empty).toBe(true)
      view.dispatch(
        view.state.tr.setSelection(
          CellSelection.create(view.state.doc, view.state.doc.firstChild!.nodeSize + 2)
        )
      )
      expect(
        plugin.props.handleKeyDown!.call(
          plugin,
          view,
          new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true })
        )
      ).toBe(false)
      expect(view.state.selection).toBeInstanceOf(CellSelection)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 7)))
      expect(
        plugin.props.handleKeyDown!.call(
          plugin,
          view,
          new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true, metaKey: true })
        )
      ).toBe(false)
      view.setProps({ editable: () => false })
      expect(
        plugin.props.handleKeyDown!.call(
          plugin,
          view,
          new KeyboardEvent('keydown', { key: 'ArrowDown', shiftKey: true })
        )
      ).toBe(false)
    })
  })
})

describe('code_block keyboard selection', () => {
  it('ArrowDown whole-selects the code block with NodeSelection; ArrowDown again exits', async () => {
    const editor = await createEditor('上方段落\n\n```js\nconst x = 1\n```\n\n下方段落\n')
    const pos = codePositions(editor)
    expect(pos.code).toBeGreaterThan(-1)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos.beforeEnd)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      // 新模型：方向键先落到「块前光标」，Shift+方向键才整块选中
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true })
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(pos.code)
      expect(codeBlockWholeSelectPosition(view.state)).toBe(pos.code)
      expect(view.dom.querySelector('.desk-code-block--whole-selected')).toBeTruthy()
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(view.state.selection.head).toBe(pos.afterStart)
      expect(codeBlockWholeSelectPosition(view.state)).toBeNull()
      expect(view.state.doc.toString()).toContain('code_block')
    })
  })

  it('ArrowDown from mid-line on the last visual line whole-selects the code block', async () => {
    const editor = await createEditor('上方段落\n\n```js\nconst x = 1\n```\n\n下方段落\n')
    const pos = codePositions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      // Not at absolute end — one character before the end of the single-line paragraph.
      const midLastLine = pos.beforeEnd - 1
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, midLastLine)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      // 新模型：方向键先落到「块前光标」，Shift+方向键才整块选中
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true })
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(pos.code)
      expect(codeBlockWholeSelectPosition(view.state)).toBe(pos.code)
      expect(view.state.doc.toString()).toContain('code_block')
    })
  })

  it('does not skip an empty paragraph between text and the next code block', async () => {
    // Desk preserves blank lines as standalone <br /> → empty paragraphs.
    const editor = await createEditor('哈哈哈\n\n<br />\n\n```js\nconsole.log(123)\n```\n')
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const state = view.state
      let textEnd = -1
      let emptyPos = -1
      let codePos = -1
      state.doc.descendants((node, position) => {
        if (node.type.name === 'code_block' && codePos < 0) codePos = position
        if (node.type.name === 'paragraph') {
          if (node.textContent === '哈哈哈') textEnd = position + 1 + node.content.size
          else if (node.content.size === 0 && emptyPos < 0) emptyPos = position
        }
      })
      expect(textEnd).toBeGreaterThan(-1)
      expect(emptyPos).toBeGreaterThan(-1)
      expect(codePos).toBeGreaterThan(-1)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, textEnd)))
      // 紧邻的是空行：我们自己接管方向键（不再交给 PM/gapcursor），落点必须是空行本身，
      // 不能跳过它直接停到代码块，也不该落块边界光标。
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).not.toBeInstanceOf(BlockBoundaryCaret)
      expect(view.state.selection.$head.parent.content.size).toBe(0)
      // 空行上的 ↓ 才落到代码块的「块前光标」。
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, emptyPos + 1)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      expect(activeBlockBoundaryTarget(view.state)?.blockPos).toBe(codePos)
      expect(activeBlockBoundaryTarget(view.state)?.side).toBe('before')
    })
  })

  it('whole-selected code block: Enter deletes it and leaves one empty line', async () => {
    const editor = await createEditor('上方段落\n\n```js\nconst x = 1\n```\n\n下方段落\n')
    const pos = codePositions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos.beforeEnd)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      // 新模型：↓ 先到块前光标，Shift+↓ 才整块选中（本用例验证选中后的 Enter 语义）
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true })
      )
      expect(codeBlockWholeSelectPosition(view.state)).toBe(pos.code)
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
      expect(view.state.doc.toString()).not.toContain('code_block')
      expect(view.state.doc.textContent).toBe('上方段落下方段落')
      expect(view.state.selection.$head.parent.content.size).toBe(0)
    })
  })

  it('whole-selected code block: Delete and Backspace both remove it', async () => {
    const editor = await createEditor('上方段落\n\n```js\nconst x = 1\n```\n\n下方段落\n')
    const pos = codePositions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos.beforeEnd)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      // 新模型：↓ 先到块前光标，Shift+↓ 才整块选中（本用例验证选中后的删除语义）
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true })
      )
      expect(codeBlockWholeSelectPosition(view.state)).toBe(pos.code)
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }))
      expect(view.state.doc.toString()).not.toContain('code_block')
    })

    const editor2 = await createEditor('上方段落\n\n```js\nconst x = 1\n```\n\n下方段落\n')
    const pos2 = codePositions(editor2)
    editor2.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(
        view.state.tr.setSelection(TextSelection.create(view.state.doc, pos2.afterStart))
      )
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, shiftKey: true })
      )
      expect(codeBlockWholeSelectPosition(view.state)).toBe(pos2.code)
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }))
      expect(view.state.doc.toString()).not.toContain('code_block')
    })
  })

  it('ArrowDown from a selected code-group lands on the empty line before the next fence', async () => {
    const editor = await createEditor(
      [
        '上方段落',
        '',
        '::: code-group',
        '',
        '```js [setup.js]',
        'export const title = "docs";',
        '```',
        '',
        ':::',
        '',
        '<br />',
        '',
        '```txt',
        'next',
        '```',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let groupPos = -1
      let emptyPos = -1
      let codePos = -1
      view.state.doc.descendants((node, position) => {
        if (node.type.name === 'deskRawBlock' && groupPos < 0) groupPos = position
        if (node.type.name === 'code_block' && codePos < 0) codePos = position
        if (
          node.type.name === 'paragraph' &&
          node.content.size === 0 &&
          groupPos >= 0 &&
          emptyPos < 0
        ) {
          emptyPos = position
        }
      })
      expect(groupPos).toBeGreaterThan(-1)
      expect(emptyPos).toBeGreaterThan(-1)
      expect(codePos).toBeGreaterThan(-1)
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, groupPos)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(TextSelection)
      expect(view.state.selection.$head.parent.type.name).toBe('paragraph')
      expect(view.state.selection.$head.parent.content.size).toBe(0)
      expect(view.state.selection.$head.before()).toBe(emptyPos)
      expect(codeBlockWholeSelectPosition(view.state)).toBeNull()
    })
  })

  it('ArrowDown from a whole-selected code chains into the next adjacent code', async () => {
    const editor = await createEditor('上方\n\n```js\none\n```\n\n```ts\ntwo\n```\n\n下方\n')
    const codes: number[] = []
    editor.action((ctx) => {
      ctx.get(editorStateCtx).doc.descendants((node, position) => {
        if (node.type.name === 'code_block') codes.push(position)
      })
    })
    expect(codes.length).toBe(2)
    let beforeEnd = -1
    editor.action((ctx) => {
      const state = ctx.get(editorStateCtx)
      state.doc.descendants((node, position) => {
        if (node.type.name === 'paragraph' && beforeEnd < 0) {
          beforeEnd = position + 1 + node.content.size
        }
      })
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, beforeEnd)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      // 新模型：方向键先落到「块前光标」，Shift+方向键才整块选中
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true })
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(codes[0])
      expect(codeBlockWholeSelectPosition(view.state)).toBe(codes[0])
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      // 新模型：方向键先落到「块前光标」，Shift+方向键才整块选中
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true })
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(codes[1])
      expect(codeBlockWholeSelectPosition(view.state)).toBe(codes[1])
      expect(view.state.doc.toString()).toContain('code_block')
    })
  })

  it('ArrowUp whole-selects the code block and leaves the caret off the following line', async () => {
    const editor = await createEditor('上方段落\n\n```js\nconst x = 1\n```\n\n下方段落\n')
    const pos = codePositions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(
        view.state.tr.setSelection(TextSelection.create(view.state.doc, pos.afterStart))
      )
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, shiftKey: true })
      )
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(pos.code)
      expect(view.state.selection.head).not.toBe(pos.afterStart)
      expect(codeBlockWholeSelectPosition(view.state)).toBe(pos.code)
    })
  })

  it('ArrowUp from the first callout body line does not whole-select the previous fence', async () => {
    const editor = await createEditor(
      [
        '```js',
        'const x = 1',
        '```',
        '',
        '::: tip 提示题',
        '',
        '这是 PowerShell 的经典坑',
        '',
        ':::',
        ''
      ].join('\n')
    )
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let codePos = -1
      let bodyMid = -1
      let bodyStart = -1
      view.state.doc.descendants((node, position) => {
        if (node.type.name === 'code_block') codePos = position
        if (node.type.name === 'paragraph' && node.textContent.includes('经典坑')) {
          bodyStart = position + 1
          bodyMid = position + 1 + 8
        }
      })
      expect(codePos).toBeGreaterThan(-1)
      expect(bodyMid).toBeGreaterThan(bodyStart)

      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, bodyMid)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
      expect(codeBlockWholeSelectPosition(view.state)).toBeNull()
      expect(view.state.selection).not.toBeInstanceOf(NodeSelection)
      expect(view.state.selection.from).not.toBe(codePos)

      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, bodyStart)))
      view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
      expect(codeBlockWholeSelectPosition(view.state)).toBeNull()
      expect(view.state.selection.from).not.toBe(codePos)
    })
  })

  it('active mindmap island keeps NodeSelection on ArrowDown (does not exit the fence)', async () => {
    const editor = await createEditor('上方段落\n\n```mindmap\n# root\n```\n\n下方段落\n')
    const pos = positions(editor)
    expect(pos.raw).toBeGreaterThan(-1)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const block = view.nodeDOM(pos.raw)
      expect(block).toBeInstanceOf(HTMLElement)
      const host = block as HTMLElement
      host.classList.add('is-mindmap-island-active')
      const canvas = document.createElement('div')
      canvas.className = 'mm-editor'
      canvas.tabIndex = 0
      host.append(canvas)

      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos.raw)))
      canvas.focus()
      expect(document.activeElement).toBe(canvas)

      canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
      expect(view.state.selection).toBeInstanceOf(NodeSelection)
      expect((view.state.selection as NodeSelection).from).toBe(pos.raw)
      expect(document.activeElement).toBe(canvas)
    })
  })
})

describe('组件预览区的光标与输入守卫', () => {
  it('预览里的链接/按钮算交互，正文与 ProseMirror 根都算可点击', () => {
    const preview = document.createElement('div')
    preview.className = 'desk-raw-block__component-preview'
    preview.innerHTML = '<p>正文</p><a href="https://example.com">链接</a><button>按钮</button>'
    const paragraph = preview.querySelector('p')
    const link = preview.querySelector('a')
    const button = preview.querySelector('button')
    // `.ProseMirror` 是 contenteditable=true 的祖先：以前把它当「交互元素」会导致
    // 预览里任何点击都判定为交互，整块选中永远不生效（这次修掉的坑）。
    const proseMirror = document.createElement('div')
    proseMirror.className = 'ProseMirror'
    proseMirror.contentEditable = 'true'
    proseMirror.append(preview)

    expect(isRawBlockPreviewInteractive(paragraph)).toBe(false)
    expect(isRawBlockPreviewInteractive(preview)).toBe(false)
    expect(isRawBlockPreviewInteractive(proseMirror)).toBe(false)
    expect(isRawBlockPreviewInteractive(link)).toBe(true)
    expect(isRawBlockPreviewInteractive(button)).toBe(true)
    expect(isRawBlockPreviewInteractive(null)).toBe(false)
  })

  it('整块选中后回车打开源码编辑，而不是把组件替换成空行', async () => {
    const editor = await createEditor('上方段落\n\n<B id="selection" />\n\n下方段落\n')
    const { raw } = positions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const dom = view.nodeDOM(raw) as HTMLElement | null
      expect(dom).toBeTruthy()
      const pill = document.createElement('button')
      pill.className = 'desk-raw-block__edit'
      let clicks = 0
      pill.addEventListener('click', () => {
        clicks += 1
      })
      dom?.append(pill)

      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, raw)))
      view.dom.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      )

      expect(clicks).toBe(1)
      let rawLeft = 0
      view.state.doc.descendants((node) => {
        if (node.type.name === 'deskRawBlock') rawLeft += 1
      })
      expect(rawLeft).toBe(1)
      expect(view.state.doc.textContent).toContain('下方段落')
    })
  })

  it('整块选中组件时吞掉打字与粘贴，普通文本选区不吞', async () => {
    const editor = await createEditor('上方段落\n\n<B id="selection" />\n\n下方段落\n')
    const { raw, beforeEnd } = positions(editor)
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, raw)))
      expect(view.someProp('handleTextInput', (handle) => handle(view, raw, raw, 'X'))).toBe(true)
      expect(view.someProp('handlePaste', (handle) => handle(view, raw, raw))).toBe(true)

      view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, beforeEnd)))
      expect(
        view.someProp('handleTextInput', (handle) => handle(view, beforeEnd, beforeEnd, 'X'))
      ).toBeFalsy()
    })
  })
})
