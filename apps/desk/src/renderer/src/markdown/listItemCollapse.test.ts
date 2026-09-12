// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorViewCtx, rootCtx } from '@milkdown/kit/core'
import { TextSelection } from '@milkdown/kit/prose/state'
import type { Node as ProseMirrorNode } from '@milkdown/kit/prose/model'
import type { EditorView } from '@milkdown/kit/prose/view'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'

import {
  applyListItemFoldCommand,
  collapsedListItemChildRange,
  collapsedListItemSet,
  createListItemCollapsePlugin,
  expandCollapsedListItemsContaining,
  listItemChildRange,
  listItemHasCollapsibleChild,
  toggleListItemCollapsed
} from './listItemCollapse'

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
      ctx.set(defaultValueCtx, source)
    })
    .use(commonmark)
    .use(gfm)
    .use(createListItemCollapsePlugin())
  editors.push(editor)
  await editor.create()
  return editor.action((ctx) => ctx.get(editorViewCtx))
}

/** 每个 list_item（含嵌套）的起始位置与「本项自己的第一段文字」。 */
function listItems(doc: ProseMirrorNode): { pos: number; own: string; all: string }[] {
  const items: { pos: number; own: string; all: string }[] = []
  doc.descendants((node, pos) => {
    if (node.type.name !== 'list_item') return true
    items.push({
      pos,
      own: node.firstChild?.textContent ?? '',
      all: node.textContent
    })
    return true
  })
  return items
}

/** 现在仍可见（没有被折叠项遮住）的列表项文字。 */
function visibleItems(view: EditorView): string[] {
  const collapsed = [...view.dom.querySelectorAll('.desk-list-item--collapsed')]
  return [...view.dom.querySelectorAll('li')]
    .filter((element) => !collapsed.some((node) => node !== element && node.contains(element)))
    .map((element) => element.querySelector('p')?.textContent?.trim() ?? '')
    .filter(Boolean)
}

/** 把光标放到某个列表项自己那段文字里。 */
function caretInOwnText(view: EditorView, itemPos: number): void {
  const text = view.state.doc.nodeAt(itemPos)?.firstChild
  expect(text?.textContent?.length ?? 0).toBeGreaterThan(0)
  view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, itemPos + 2)))
}

describe('list item child range', () => {
  it('reports nested lists and ignores items without children', async () => {
    const view = await setup('- A\n  - A1\n    - A1a\n- B\n')
    const items = listItems(view.state.doc)
    expect(items.map((item) => item.own)).toEqual(['A', 'A1', 'A1a', 'B'])
    expect(listItemHasCollapsibleChild(view.state.doc, items[0]!.pos)).toBe(true)
    expect(listItemHasCollapsibleChild(view.state.doc, items[1]!.pos)).toBe(true)
    expect(listItemHasCollapsibleChild(view.state.doc, items[2]!.pos)).toBe(false)
    expect(listItemHasCollapsibleChild(view.state.doc, items[3]!.pos)).toBe(false)
    const range = listItemChildRange(view.state.doc, items[0]!.pos)!
    expect(view.state.doc.textBetween(range.from, range.to, ' ')).toContain('A1')
  })

  it('offers a toggle only for items with children', async () => {
    const view = await setup('- A\n  - A1\n- B\n')
    const items = listItems(view.state.doc)
    expect(view.dom.querySelector(`[data-list-item-pos="${items[0]!.pos}"]`)).toBeTruthy()
    // 第二个项（嵌套的 A1）自己没有子列表，不该有按钮
    expect(view.dom.querySelector(`[data-list-item-pos="${items[1]!.pos}"]`)).toBeNull()
    expect(view.dom.querySelector(`[data-list-item-pos="${items[2]!.pos}"]`)).toBeNull()
  })
})

describe('list item collapse', () => {
  it('hides the nested list until the toggle is clicked again', async () => {
    const view = await setup('- A\n  - A1\n    - A1a\n- B\n')
    const [a] = listItems(view.state.doc)
    view.dispatch(toggleListItemCollapsed(view.state, a!.pos)!)
    expect([...collapsedListItemSet(view.state)]).toEqual([a!.pos])
    expect(visibleItems(view)).toEqual(['A', 'B'])
    expect(view.dom.querySelector('.desk-list-item--collapsed')?.className).toContain(
      'desk-list-item--collapsible'
    )
    expect(collapsedListItemChildRange(view.state, a!.pos)).not.toBeNull()

    view.dispatch(toggleListItemCollapsed(view.state, a!.pos)!)
    expect(collapsedListItemSet(view.state).size).toBe(0)
    expect(visibleItems(view)).toEqual(['A', 'A1', 'A1a', 'B'])
    expect(view.dom.querySelector('.desk-list-item--collapsed')).toBeNull()
  })

  it('keeps nested fold state while the parent is collapsed', async () => {
    const view = await setup('- A\n  - A1\n    - A1a\n- B\n')
    const [a, a1] = listItems(view.state.doc)
    view.dispatch(toggleListItemCollapsed(view.state, a1!.pos)!)
    view.dispatch(toggleListItemCollapsed(view.state, a!.pos)!)
    expect([...collapsedListItemSet(view.state)].sort((x, y) => x - y)).toEqual(
      [a!.pos, a1!.pos].sort((x, y) => x - y)
    )
    view.dispatch(toggleListItemCollapsed(view.state, a!.pos)!)
    // 父项展开后，嵌套项自己的折叠状态还在
    expect(visibleItems(view)).toEqual(['A', 'A1', 'B'])
    view.dispatch(toggleListItemCollapsed(view.state, a1!.pos)!)
    expect(visibleItems(view)).toEqual(['A', 'A1', 'A1a', 'B'])
  })

  it('renders a persistent toggle that expands on click', async () => {
    const view = await setup('- A\n  - A1\n')
    const [a] = listItems(view.state.doc)
    view.dispatch(toggleListItemCollapsed(view.state, a!.pos)!)
    const button = view.dom.querySelector('.desk-list-item-toggle')
    expect(button?.getAttribute('aria-label')).toBe('展开列表')
    expect(button?.getAttribute('aria-expanded')).toBe('false')
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(collapsedListItemSet(view.state).size).toBe(0)
    expect(visibleItems(view)).toEqual(['A', 'A1'])
    expect(view.dom.querySelector('.desk-list-item-toggle')?.getAttribute('aria-expanded')).toBe(
      'true'
    )
  })

  it('pulls the caret out of the subtree it is about to hide', async () => {
    const view = await setup('- A\n  - A1\n- B\n')
    const items = listItems(view.state.doc)
    caretInOwnText(view, items[1]!.pos)
    view.dispatch(toggleListItemCollapsed(view.state, items[0]!.pos)!)
    const range = listItemChildRange(view.state.doc, items[0]!.pos)!
    expect(view.state.selection.from).toBeLessThan(range.from)
  })

  it('expands collapsed ancestors when the selection lands inside them', async () => {
    const view = await setup('- A\n  - A1\n    - A1a\n')
    const [a, a1] = listItems(view.state.doc)
    view.dispatch(toggleListItemCollapsed(view.state, a1!.pos)!)
    view.dispatch(toggleListItemCollapsed(view.state, a!.pos)!)
    expect(expandCollapsedListItemsContaining(view, listItems(view.state.doc)[2]!.pos + 2)).toBe(
      true
    )
    expect(collapsedListItemSet(view.state).size).toBe(0)
    expect(visibleItems(view)).toEqual(['A', 'A1', 'A1a'])
  })

  it('folds and unfolds every collapsible item', async () => {
    const view = await setup('- A\n  - A1\n- B\n\n1. One\n   1. Two\n')
    const items = listItems(view.state.doc)
    // 只有「A」和「One」有子列表
    const collapsible = [items[0]!.pos, items[3]!.pos]
    view.dispatch(applyListItemFoldCommand(view.state, 'fold-all')!)
    expect([...collapsedListItemSet(view.state)].sort((x, y) => x - y)).toEqual(
      [...collapsible].sort((x, y) => x - y)
    )
    expect(visibleItems(view)).toEqual(['A', 'B', 'One'])
    view.dispatch(applyListItemFoldCommand(view.state, 'unfold-all')!)
    expect(collapsedListItemSet(view.state).size).toBe(0)
    expect(visibleItems(view)).toEqual(['A', 'A1', 'B', 'One', 'Two'])
  })

  it('moves the caret past a collapsed subtree with ArrowDown and back with ArrowUp', async () => {
    const view = await setup('- A\n  - A1\n- B\n')
    const [a] = listItems(view.state.doc)
    view.dispatch(toggleListItemCollapsed(view.state, a!.pos)!)
    const range = listItemChildRange(view.state.doc, a!.pos)!
    caretInOwnText(view, a!.pos)
    const before = view.state.selection.from

    view.dom.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    )
    // 跳过被隐藏的子树，落到下一个可见位置
    expect(view.state.selection.from).toBeGreaterThanOrEqual(range.to)

    view.dom.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })
    )
    // happy-dom 没有排版，这里只断言落点（父项自己那段文字的末尾）
    expect({ from: view.state.selection.from, end: range.from - 1, before }).toEqual({
      from: range.from - 1,
      end: range.from - 1,
      before
    })
  })

  it('drops fold state when the nested list disappears', async () => {
    const view = await setup('- A\n  - A1\n')
    const [a] = listItems(view.state.doc)
    view.dispatch(toggleListItemCollapsed(view.state, a!.pos)!)
    const range = listItemChildRange(view.state.doc, a!.pos)!
    view.dispatch(view.state.tr.delete(range.from, range.to))
    expect(listItemHasCollapsibleChild(view.state.doc, a!.pos)).toBe(false)
    expect(collapsedListItemSet(view.state).size).toBe(0)
  })
})

/** 模拟在某个文档位置按回车。 */
function pressEnter(view: EditorView, pos: number): void {
  view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, pos)))
  view.dom.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
  )
}

/** 列表结构（按层级缩进）与折叠状态，便于断言。 */
function listOutline(view: EditorView): { text: string; indent: number; collapsed: boolean }[] {
  return listItems(view.state.doc).map((item) => {
    const $pos = view.state.doc.resolve(item.pos + 1)
    let lists = 0
    for (let depth = $pos.depth; depth > 0; depth -= 1) {
      if (/^(bullet|ordered)_list$/.test($pos.node(depth).type.name)) lists += 1
    }
    return {
      text: item.own,
      indent: lists - 1,
      collapsed: collapsedListItemSet(view.state).has(item.pos)
    }
  })
}

describe('list item enter (折叠时的回车语义)', () => {
  it('光标在尾部：新项插在整棵子树之后，子列表留在原项上', async () => {
    const view = await setup('- B\n  - B1\n- C\n')
    const [b] = listItems(view.state.doc)
    view.dispatch(toggleListItemCollapsed(view.state, b!.pos)!)
    const range = listItemChildRange(view.state.doc, b!.pos)!
    pressEnter(view, range.from - 1)
    expect(listOutline(view)).toEqual([
      { text: 'B', indent: 0, collapsed: true },
      { text: 'B1', indent: 1, collapsed: false },
      { text: '', indent: 0, collapsed: false },
      { text: 'C', indent: 0, collapsed: false }
    ])
    // 光标在新项里
    expect(view.state.selection.from).toBe(listItems(view.state.doc)[2]!.pos + 2)
    // 折叠状态没被破坏
    expect(collapsedListItemSet(view.state).has(b!.pos)).toBe(true)
  })

  it('光标在开头：空项插在项之前，并展开这一项', async () => {
    const view = await setup('- B\n  - B1\n- C\n')
    const [b] = listItems(view.state.doc)
    view.dispatch(toggleListItemCollapsed(view.state, b!.pos)!)
    pressEnter(view, b!.pos + 2)
    expect(listOutline(view)).toEqual([
      { text: '', indent: 0, collapsed: false },
      { text: 'B', indent: 0, collapsed: false },
      { text: 'B1', indent: 1, collapsed: false },
      { text: 'C', indent: 0, collapsed: false }
    ])
    expect(view.state.selection.from).toBe(listItems(view.state.doc)[0]!.pos + 2)
    expect(collapsedListItemSet(view.state).size).toBe(0)
  })

  it('光标在中间：展开并按默认 split 拆成「前半 + 后半（带子列表）」', async () => {
    const view = await setup('- AB\n  - B1\n- C\n')
    const [b] = listItems(view.state.doc)
    view.dispatch(toggleListItemCollapsed(view.state, b!.pos)!)
    pressEnter(view, b!.pos + 3)
    expect(listOutline(view)).toEqual([
      { text: 'A', indent: 0, collapsed: false },
      { text: 'B', indent: 0, collapsed: false },
      { text: 'B1', indent: 1, collapsed: false },
      { text: 'C', indent: 0, collapsed: false }
    ])
    expect(collapsedListItemSet(view.state).size).toBe(0)
    // 光标在「后半」的开头
    expect(view.state.selection.from).toBe(listItems(view.state.doc)[1]!.pos + 2)
  })

  it('没有子列表的项回车走默认行为（尾部新同级项、行首空项在前）', async () => {
    const end = await setup('- A\n- B\n')
    const [a] = listItems(end.state.doc)
    pressEnter(end, a!.pos + 2 + 'A'.length)
    expect(listItems(end.state.doc).map((item) => item.own)).toEqual(['A', '', 'B'])

    const start = await setup('- A\n- B\n')
    const [first] = listItems(start.state.doc)
    pressEnter(start, first!.pos + 2)
    expect(listItems(start.state.doc).map((item) => item.own)).toEqual(['', 'A', 'B'])
  })

  it('任务项回车得到未勾选的新项，子列表仍留在原项上', async () => {
    const view = await setup('- [x] A\n  - [ ] A1\n- B\n')
    const [a] = listItems(view.state.doc)
    const range = listItemChildRange(view.state.doc, a!.pos)!
    pressEnter(view, range.from - 1)
    const outline = listOutline(view)
    expect(outline.map((item) => item.text)).toEqual(['A', 'A1', '', 'B'])
    const fresh = view.state.doc.nodeAt(listItems(view.state.doc)[2]!.pos)
    expect(fresh?.attrs.checked).toBe(false)
  })
})
