/**
 * 缩进列表折叠（交互对齐语雀）。
 *
 * 语雀的交互（实测其线上文档 + CSS 归纳）：
 * - 只有「带子列表」的列表项才出现折叠按钮；
 * - 按钮在编号/项目符号左侧的缩进空档里（贴着 marker 列左侧留 4px），16×16、圆角 4px；
 * - 平时 `opacity: 0`，鼠标悬停该项（或该项已折叠）时才显形，按钮自身悬停有浅灰底；
 * - 图标是实心三角：展开时朝下，折叠后朝右；
 * - 折叠 = 把子列表从布局里去掉（`display: none`），父项文字与 marker 不动；
 * - 折叠状态只在视图层，绝不写进文档 / markdown。
 *
 * 这里的实现沿用 Desk 标题折叠（`headingSectionCollapse.ts`）的架构：plugin state 存
 * 折叠项的文档位置、node decoration 打标记（`desk-list-item--collapsed`）由 CSS 隐藏
 * 子树、widget 画按钮、上下箭头跳过隐藏子树。
 */
import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import type { Node as ProseMirrorNode } from '@milkdown/kit/prose/model'
import {
  Plugin,
  PluginKey,
  TextSelection,
  type EditorState,
  type Transaction
} from '@milkdown/kit/prose/state'
import { Decoration, DecorationSet, type EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'

export const listItemCollapseKey = new PluginKey<ListItemCollapseState>('desk-list-item-collapse')

export interface ListItemCollapseState {
  /** 处于折叠状态的 list_item 起始位置。 */
  collapsed: Set<number>
}

export interface ListItemChildRange {
  from: number
  to: number
}

function isListNode(node: ProseMirrorNode | null | undefined): boolean {
  return node?.type.name === 'bullet_list' || node?.type.name === 'ordered_list'
}

export function isListItemNode(node: ProseMirrorNode | null | undefined): node is ProseMirrorNode {
  return node?.type.name === 'list_item'
}

/** 列表项里第一段嵌套列表的 range（含其后的兄弟列表）；没有子列表返回 null。 */
export function listItemChildRange(doc: ProseMirrorNode, pos: number): ListItemChildRange | null {
  const item = doc.nodeAt(pos)
  if (!isListItemNode(item)) return null
  let from: number | null = null
  item.forEach((child, offset) => {
    if (from === null && isListNode(child) && child.childCount > 0) from = pos + 1 + offset
  })
  return from === null ? null : { from, to: pos + item.nodeSize - 1 }
}

export function listItemHasCollapsibleChild(doc: ProseMirrorNode, pos: number): boolean {
  return listItemChildRange(doc, pos) !== null
}

export function collapsedListItemSet(state: EditorState): Set<number> {
  return listItemCollapseKey.getState(state)?.collapsed ?? new Set<number>()
}

/** 该项当前处于折叠状态时返回被隐藏的子列表 range，否则 null。 */
export function collapsedListItemChildRange(
  state: EditorState,
  pos: number
): ListItemChildRange | null {
  if (!collapsedListItemSet(state).has(pos)) return null
  return listItemChildRange(state.doc, pos)
}

export function toggleListItemCollapsed(state: EditorState, pos: number): Transaction | null {
  const range = listItemChildRange(state.doc, pos)
  if (!range) return null
  const willCollapse = !collapsedListItemSet(state).has(pos)
  const tr = state.tr.setMeta(listItemCollapseKey, { toggle: pos })
  // 光标落在即将被隐藏的子树里时，先把它收回到父项文字末尾。
  if (willCollapse && state.selection.from >= range.from && state.selection.from < range.to) {
    tr.setSelection(TextSelection.near(tr.doc.resolve(range.from), -1))
  }
  return tr
}

/** 折叠全部可折叠项（含嵌套项）。 */
export function applyListItemFoldCommand(
  state: EditorState,
  command: 'fold-all' | 'unfold-all'
): Transaction | null {
  const next: number[] = []
  if (command === 'fold-all') {
    state.doc.descendants((node, pos) => {
      if (isListItemNode(node) && listItemHasCollapsibleChild(state.doc, pos)) next.push(pos)
      return true
    })
  }
  const current = [...collapsedListItemSet(state)].sort((a, b) => a - b)
  const sorted = [...next].sort((a, b) => a - b)
  if (current.length === sorted.length && current.every((pos, index) => pos === sorted[index])) {
    return null
  }
  return state.tr.setMeta(listItemCollapseKey, { set: next })
}

function mapCollapsedPositions(
  doc: ProseMirrorNode,
  collapsed: Set<number>,
  tr: Transaction
): Set<number> {
  const next = new Set<number>()
  for (const pos of collapsed) {
    const mapped = tr.mapping.mapResult(pos, 1)
    if (mapped.deleted) continue
    // 子列表被删掉 / 被移走后就不再可折叠，丢掉这条状态。
    if (isListItemNode(doc.nodeAt(mapped.pos)) && listItemHasCollapsibleChild(doc, mapped.pos)) {
      next.add(mapped.pos)
    }
  }
  return next
}

/** 光标进入某个被隐藏的子树时，把它上层的折叠项依次展开。 */
export function expandCollapsedListItemsContaining(view: EditorView, pos: number): boolean {
  const collapsed = collapsedListItemSet(view.state)
  if (collapsed.size === 0) return false
  const ancestors: number[] = []
  for (const itemPos of collapsed) {
    const range = listItemChildRange(view.state.doc, itemPos)
    if (range && range.from <= pos && pos <= range.to) ancestors.push(itemPos)
  }
  if (ancestors.length === 0) return false
  let { state } = view
  for (const itemPos of ancestors.sort((a, b) => b - a)) {
    if (!collapsedListItemSet(state).has(itemPos)) continue
    const tr = toggleListItemCollapsed(state, itemPos)
    if (!tr) continue
    view.dispatch(tr)
    state = view.state
  }
  return true
}

function listItemPosAtCaret(doc: ProseMirrorNode, pos: number): number | null {
  const $pos = doc.resolve(pos)
  for (let depth = $pos.depth; depth > 0; depth -= 1) {
    if (isListItemNode($pos.node(depth))) return $pos.before(depth)
  }
  return null
}

/** 若光标落在某个折叠项子树后面的那个兄弟项里，返回该折叠项位置（取最靠后的一个）。 */
function collapsedItemBeforeCaret(
  doc: ProseMirrorNode,
  collapsed: Set<number>,
  pos: number
): number | null {
  let latest: number | null = null
  for (const itemPos of collapsed) {
    const item = doc.nodeAt(itemPos)
    if (!item) continue
    const next = doc.nodeAt(itemPos + item.nodeSize)
    const own = next?.firstChild
    if (
      isListItemNode(next) &&
      own &&
      pos >= itemPos + item.nodeSize + 1 &&
      pos <= itemPos + item.nodeSize + 1 + own.nodeSize &&
      (!latest || itemPos > latest)
    ) {
      latest = itemPos
    }
  }
  return latest
}

function skipCollapsedListItems(view: EditorView, direction: 1 | -1): boolean {
  const collapsed = collapsedListItemSet(view.state)
  if (collapsed.size === 0) return false
  const { doc, selection } = view.state
  if (direction > 0) {
    const itemPos = listItemPosAtCaret(doc, selection.head)
    if (itemPos == null || !collapsed.has(itemPos)) return false
    const range = listItemChildRange(doc, itemPos)
    if (!range || range.to <= selection.head) return false
    view.dispatch(
      view.state.tr.setSelection(TextSelection.near(doc.resolve(range.to), 1)).scrollIntoView()
    )
    return true
  }
  const itemPos = collapsedItemBeforeCaret(doc, collapsed, selection.head)
  if (itemPos == null) return false
  const range = listItemChildRange(doc, itemPos)
  if (!range) return false
  // 回到父项自己那段文字的末尾（range.from - 1 就是它最后一个可放光标的位置）
  view.dispatch(
    view.state.tr.setSelection(TextSelection.near(doc.resolve(range.from - 1), -1)).scrollIntoView()
  )
  return true
}

/**
 * 列表项里按回车（只有「有子列表」的项需要特殊处理，语雀交互）：
 * - 光标在**尾部**：在整棵子树之后插入一个空的同级项，子列表留在原项上，
 *   折叠状态保持不变（折叠时新项出现在折叠项下方，不展开）；
 * - 光标在**开头**：在项之前插入一个空的同级项（子列表仍留在原项上），并展开这一项；
 * - 光标在**中间**：展开这一项后交给默认的 `splitListItem`：拆成「前半」+「后半（含子列表）」。
 * 三种情况都不会把子列表挪到新建的空项里。
 */
function handleListItemEnter(view: EditorView): boolean {
  const { state } = view
  const { selection } = state
  if (!selection.empty) return false
  const itemPos = listItemPosAtCaret(state.doc, selection.head)
  if (itemPos == null) return false
  const range = listItemChildRange(state.doc, itemPos)
  if (!range) return false
  // 光标必须在这一项自己那段文字里（不在隐藏的子列表里）
  if (selection.head > range.from - 1 || selection.head < itemPos + 2) return false

  if (selection.head >= range.from - 1) {
    insertEmptySibling(view, itemPos, 'after')
    return true
  }
  if (selection.head <= itemPos + 2) {
    insertEmptySibling(view, itemPos, 'before')
    return true
  }
  if (collapsedListItemSet(state).has(itemPos)) {
    view.dispatch(state.tr.setMeta(listItemCollapseKey, { unfold: itemPos }))
  }
  return false
}

function insertEmptySibling(view: EditorView, itemPos: number, side: 'before' | 'after'): void {
  const { state } = view
  const item = state.doc.nodeAt(itemPos)
  const paragraph = item?.firstChild
  if (!item || !paragraph) return
  const attrs = { ...item.attrs }
  // 任务列表里回车得到的是「未勾选」的新项，而不是继承勾选状态
  if (typeof attrs.checked === 'boolean') attrs.checked = false
  const sibling = item.type.create(attrs, paragraph.type.create())
  const at = side === 'before' ? itemPos : itemPos + item.nodeSize
  const tr = state.tr.insert(at, sibling)
  // 行首回车要展开这一项；行尾回车保持折叠状态（新项在折叠项外面，本来就可见）
  if (side === 'before') tr.setMeta(listItemCollapseKey, { unfold: itemPos })
  tr.setSelection(TextSelection.near(tr.doc.resolve(at + 2), 1)).scrollIntoView()
  view.dispatch(tr)
}

function toggleButton(pos: number, collapsed: boolean): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'desk-list-item-toggle'
  button.dataset.listItemPos = String(pos)
  button.setAttribute('aria-label', collapsed ? '展开列表' : '折叠列表')
  button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
  button.tabIndex = -1
  button.innerHTML = collapsed
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 6.5v11L18 12z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.5 9h11L12 18z"/></svg>'
  return button
}

function listItemFoldDecorations(state: EditorState): DecorationSet {
  const collapsed = collapsedListItemSet(state)
  const decorations: Decoration[] = []
  state.doc.descendants((node, pos) => {
    if (!isListItemNode(node)) return true
    const range = listItemChildRange(state.doc, pos)
    const isCollapsed = collapsed.has(pos)
    if (!range && !isCollapsed) return true
    decorations.push(
      Decoration.node(pos, pos + node.nodeSize, {
        class: isCollapsed
          ? 'desk-list-item--collapsible desk-list-item--collapsed'
          : 'desk-list-item--collapsible'
      })
    )
    decorations.push(
      Decoration.widget(pos + 1, () => toggleButton(pos, isCollapsed), {
        side: -1,
        ignoreSelection: true,
        key: `desk-list-item-toggle:${pos}:${isCollapsed ? 'on' : 'off'}`,
        stopEvent: (event) =>
          event.target instanceof Element && Boolean(event.target.closest('.desk-list-item-toggle'))
      })
    )
    return true
  })
  return DecorationSet.create(state.doc, decorations)
}

function listItemPosFromToggle(target: EventTarget | null): number | null {
  const button = target instanceof Element ? target.closest('.desk-list-item-toggle') : null
  if (!button) return null
  const pos = Number(button.getAttribute('data-list-item-pos'))
  return Number.isInteger(pos) ? pos : null
}

export function createListItemCollapsePlugin(): MilkdownPlugin {
  return $prose(
    () =>
      new Plugin<ListItemCollapseState>({
        key: listItemCollapseKey,
        state: {
          init: () => ({ collapsed: new Set<number>() }),
          apply(tr, value) {
            const collapsed = mapCollapsedPositions(tr.doc, value.collapsed, tr)
            const meta = tr.getMeta(listItemCollapseKey) as
              { toggle?: number; set?: number[]; unfold?: number } | undefined
            if (typeof meta?.toggle === 'number') {
              const pos = tr.docChanged ? tr.mapping.map(meta.toggle, 1) : meta.toggle
              if (collapsed.has(pos)) collapsed.delete(pos)
              else if (listItemHasCollapsibleChild(tr.doc, pos)) collapsed.add(pos)
            }
            if (typeof meta?.unfold === 'number') {
              const pos = tr.docChanged ? tr.mapping.map(meta.unfold, 1) : meta.unfold
              collapsed.delete(pos)
            }
            if (Array.isArray(meta?.set)) {
              collapsed.clear()
              for (const pos of meta.set) {
                const mapped = tr.docChanged ? tr.mapping.map(pos, 1) : pos
                if (listItemHasCollapsibleChild(tr.doc, mapped)) collapsed.add(mapped)
              }
            }
            return { collapsed }
          }
        },
        props: {
          decorations: listItemFoldDecorations,
          handleKeyDown(view, event) {
            if (
              event.key === 'Enter' &&
              !event.shiftKey &&
              !event.metaKey &&
              !event.ctrlKey &&
              !event.altKey
            ) {
              return handleListItemEnter(view)
            }
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return false
            if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return false
            return skipCollapsedListItems(view, event.key === 'ArrowDown' ? 1 : -1)
          },
          handleDOMEvents: {
            mousedown(_view, event) {
              if (listItemPosFromToggle(event.target) == null) return false
              event.preventDefault()
              return true
            },
            click(view, event) {
              const pos = listItemPosFromToggle(event.target)
              if (pos == null) return false
              event.preventDefault()
              const tr = toggleListItemCollapsed(view.state, pos)
              if (tr) view.dispatch(tr)
              return true
            }
          }
        }
      })
  )
}
