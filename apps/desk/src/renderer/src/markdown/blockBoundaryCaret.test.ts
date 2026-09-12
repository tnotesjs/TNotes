// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorViewCtx, rootCtx } from '@milkdown/kit/core'
import { TextSelection } from '@milkdown/kit/prose/state'
import type { Node as ProseMirrorNode } from '@milkdown/kit/prose/model'
import type { EditorView } from '@milkdown/kit/prose/view'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'

import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins
} from '../editor/markdown/rawBlockProjection'
import {
  BlockBoundaryCaret,
  activeBlockBoundaryTarget,
  blockBoundaryCaretAt,
  blockBoundaryTargetAt,
  createBlockBoundaryCaretPlugin,
  isBoundaryStopBlock
} from './blockBoundaryCaret'
import {
  adjacentBoundaryCaretPosition,
  createBlockBoundaryNavigationPlugin,
  materializeLineAt,
  placeBoundaryCaret
} from './blockBoundaryNavigation'

const editors: Editor[] = []

afterEach(async () => {
  await Promise.all(editors.splice(0).map((editor) => editor.destroy()))
  document.body.replaceChildren()
})

async function setup(source: string): Promise<EditorView> {
  const root = document.createElement('div')
  root.className = 'milkdown'
  document.body.append(root)
  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, projectRawBlocksForMilkdown(source))
    })
    .use(commonmark)
    .use(gfm)
    .use(rawBlockProjectionPlugins)
    .use(createBlockBoundaryCaretPlugin())
    .use(createBlockBoundaryNavigationPlugin())
  editors.push(editor)
  await editor.create()
  return editor.action((ctx) => ctx.get(editorViewCtx))
}

function childPositions(doc: ProseMirrorNode): { pos: number; node: ProseMirrorNode }[] {
  const children: { pos: number; node: ProseMirrorNode }[] = []
  doc.forEach((node, pos) => children.push({ pos, node }))
  return children
}

function caretSides(view: EditorView): string[] {
  const host = view.dom.parentElement ?? view.dom.ownerDocument
  return [...host.querySelectorAll('.desk-block-boundary-caret')].map(
    (element) => element.getAttribute('data-side') ?? ''
  )
}

describe('block boundary caret', () => {
  it('recognises which blocks get a boundary caret', async () => {
    const view = await setup('前段\n\n```js\nconst a = 1\n```\n\n<B id="x" />\n\n后段\n')
    const children = childPositions(view.state.doc)
    const code = children.find((child) => child.node.type.name === 'code_block')
    const raw = children.find((child) => child.node.type.name === 'deskRawBlock')
    const paragraph = children.find((child) => child.node.type.name === 'paragraph')
    expect(code && isBoundaryStopBlock(code.node)).toBe(true)
    expect(raw && isBoundaryStopBlock(raw.node)).toBe(true)
    expect(paragraph && isBoundaryStopBlock(paragraph.node)).toBe(false)
  })

  it('keeps the side explicit when two stops share one position', async () => {
    const view = await setup('前段\n\n<B id="x" />\n')
    const raw = childPositions(view.state.doc).find(
      (child) => child.node.type.name === 'deskRawBlock'
    )!
    const before = raw.pos
    const after = raw.pos + raw.node.nodeSize

    const beforeCaret = blockBoundaryCaretAt(view.state.doc, before, 'before')
    const afterCaret = blockBoundaryCaretAt(view.state.doc, after, 'after')
    expect(beforeCaret?.side).toBe('before')
    expect(afterCaret?.side).toBe('after')
    expect(beforeCaret?.eq(afterCaret!)).toBe(false)
    // 相邻两个块共用位置时，可以按 side 精确取到各自的目标块
    const twoBlocks = await setup('前段\n\n<B id="x" />\n\n```js\nconst a = 1\n```\n')
    const nodes = childPositions(twoBlocks.state.doc)
    const rawNode = nodes.find((child) => child.node.type.name === 'deskRawBlock')!
    const codeNode = nodes.find((child) => child.node.type.name === 'code_block')!
    const shared = rawNode.pos + rawNode.node.nodeSize
    expect(shared).toBe(codeNode.pos)
    expect(blockBoundaryTargetAt(twoBlocks.state.doc, shared, 'after')?.node).toBe(rawNode.node)
    expect(blockBoundaryTargetAt(twoBlocks.state.doc, shared, 'before')?.node).toBe(codeNode.node)
  })

  it('falls back to a text selection when the mapped position is gone', async () => {
    const view = await setup('前段\n\n<B id="x" />\n')
    const raw = childPositions(view.state.doc).find(
      (child) => child.node.type.name === 'deskRawBlock'
    )!
    placeBoundaryCaret(view, raw.pos, 'before')
    expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
    // 删掉块：状态里的位置不再贴着可停靠块，map 回退成文本光标
    view.dispatch(view.state.tr.delete(raw.pos, raw.pos + raw.node.nodeSize))
    expect(view.state.selection).not.toBeInstanceOf(BlockBoundaryCaret)
  })

  it('独立图片段落：光标画在可编辑 DOM 之外，不会被 PM 的 DOMObserver 重置', async () => {
    // 回归：之前把光标 <span> append 进目标块 DOM。独立图片段落只是普通 paragraph，
    // 它的 contentDOM 就是 <p>，PM 会把多出来的子节点当成 DOM 变更，readDOMChange
    // 立刻把选区重置回文本光标并抹掉光标元素——真实浏览器里表现成「按 ↓ 没反应」。
    const view = await setup('## 标题\n\n![图](../assets/a.png)\n\n尾段\n')
    const children = childPositions(view.state.doc)
    const heading = children[0]!
    const imageParagraph = children[1]!
    expect(heading.node.type.name).toBe('heading')
    expect(imageParagraph.node.firstChild?.type.name).toBe('image')

    view.dispatch(
      view.state.tr.setSelection(
        TextSelection.create(view.state.doc, heading.pos + 1 + heading.node.content.size)
      )
    )
    const pos = adjacentBoundaryCaretPosition(view.state, 'down')
    expect(pos).toBe(imageParagraph.pos)
    expect(placeBoundaryCaret(view, pos!)).toBe(true)
    expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)

    const host = view.dom.parentElement!
    const caret = host.querySelector('.desk-block-boundary-caret')
    expect(caret).toBeTruthy()
    expect(caret?.getAttribute('data-side')).toBe('before')
    expect(activeBlockBoundaryTarget(view.state)?.node.firstChild?.type.name).toBe('image')
    // 关键契约：可编辑 DOM 里不能有光标元素。
    expect(view.dom.contains(caret)).toBe(false)
    expect(host.contains(caret)).toBe(true)

    await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
    expect(host.querySelector('.desk-block-boundary-caret')).toBe(caret)
  })

  it('相邻代码块（中间没有空行）：块前 ↑ / 块后 ↓ 在两个块之间来回', async () => {
    const view = await setup(
      '```js\nconst first = 1\n```\n```css\n.demo {\n  color: red;\n}\n```\n'
    )
    const children = childPositions(view.state.doc)
    expect(children.map((child) => child.node.type.name)).toEqual(['code_block', 'code_block'])
    const [first, second] = children

    // 第二块块前 ↑ → 第一块块后
    placeBoundaryCaret(view, second!.pos, 'before')
    expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }))
    expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
    expect(activeBlockBoundaryTarget(view.state)?.side).toBe('after')
    expect(view.state.selection.from).toBe(first!.pos + first!.node.nodeSize)

    // 第一块块后 ↓ → 第二块块前
    view.dom.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    expect(view.state.selection).toBeInstanceOf(BlockBoundaryCaret)
    expect(activeBlockBoundaryTarget(view.state)?.side).toBe('before')
    expect(view.state.selection.from).toBe(second!.pos)
  })

  it('renders exactly one visible caret element', async () => {
    const view = await setup('前段\n\n<B id="x" />\n\n后段\n')
    const raw = childPositions(view.state.doc).find(
      (child) => child.node.type.name === 'deskRawBlock'
    )!
    placeBoundaryCaret(view, raw.pos, 'before')
    const before = caretSides(view)
    expect(before).toHaveLength(1)
    placeBoundaryCaret(view, raw.pos + raw.node.nodeSize, 'after')
    const after = caretSides(view)
    expect(after).toHaveLength(1)
    expect(after[0]).toBe('after')
    expect(activeBlockBoundaryTarget(view.state)?.side).toBe('after')
  })
})

describe('block boundary navigation', () => {
  it('finds the boundary below/above a neighbouring block', async () => {
    const view = await setup('前段\n\n```js\nconst a = 1\n```\n\n后段\n')
    const children = childPositions(view.state.doc)
    const paragraph = children.find((child) => child.node.type.name === 'paragraph')!
    const code = children.find((child) => child.node.type.name === 'code_block')!
    const caret = paragraph.pos + 1 + paragraph.node.content.size
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, caret)))
    expect(adjacentBoundaryCaretPosition(view.state, 'down')).toBe(code.pos)
    expect(adjacentBoundaryCaretPosition(view.state, 'right')).toBe(code.pos)
    const after = code.pos + code.node.nodeSize
    // ↑ 只要在第一条视觉行上；← 必须严格在文本块开头
    view.dispatch(
      view.state.tr.setSelection(TextSelection.create(view.state.doc, after + 1 + '后段'.length))
    )
    expect(adjacentBoundaryCaretPosition(view.state, 'up')).toBe(after)
    expect(adjacentBoundaryCaretPosition(view.state, 'left')).toBeNull()
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, after + 1)))
    expect(adjacentBoundaryCaretPosition(view.state, 'left')).toBe(after)
  })

  it('treats a hidden block as transparent', async () => {
    const view = await setup('前段\n\n<B id="x" />\n')
    const children = childPositions(view.state.doc)
    const raw = children.find((child) => child.node.type.name === 'deskRawBlock')!
    // 隐藏块（frontmatter 投影）不算停靠块
    expect(
      isBoundaryStopBlock({ type: { name: 'deskRawBlock' }, attrs: { hidden: true } } as never)
    ).toBe(false)
    expect(blockBoundaryCaretAt(view.state.doc, raw.pos, 'before')).not.toBeNull()
  })

  it('materialises an empty paragraph above or below the block', async () => {
    const view = await setup('前段\n\n<B id="x" />\n\n后段\n')
    const raw = childPositions(view.state.doc).find(
      (child) => child.node.type.name === 'deskRawBlock'
    )!
    expect(materializeLineAt(view, raw.pos)).toBe(true)
    const afterBefore = childPositions(view.state.doc)
    expect(afterBefore[1].node.type.name).toBe('paragraph')
    expect(afterBefore[1].node.content.size).toBe(0)
    expect(afterBefore[2].node.type.name).toBe('deskRawBlock')

    const rawAfter = childPositions(view.state.doc).find(
      (child) => child.node.type.name === 'deskRawBlock'
    )!
    expect(materializeLineAt(view, rawAfter.pos + rawAfter.node.nodeSize)).toBe(true)
    const children = childPositions(view.state.doc)
    const index = children.findIndex((child) => child.node.type.name === 'deskRawBlock')
    expect(children[index + 1].node.type.name).toBe('paragraph')
    expect(children[index + 1].node.content.size).toBe(0)
  })
})
