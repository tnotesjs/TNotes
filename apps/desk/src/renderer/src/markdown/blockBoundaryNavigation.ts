/**
 * 块边界光标的键盘导航（对齐语雀的 T1–T6）。
 *
 * 状态机（每个「可停靠块」都有块前/块后两个位置）：
 *
 *   上一段 ─↓/→→ [块前] ─↓/→→ 内部首位置 … 内部末位置 ─↓/→→ [块后] ─↓/→→ 下一段
 *   不可进内部的块：上一段 ─↓/→→ [块前] ─↓/→→ [块后] ─↓/→→ 下一段
 *   反向完全对称（↑/←）。
 *
 * 边界上的键位（用户实测的语雀行为）：
 * - 打字/回车：在块上/下方实体化一个空段落（纯导航不改文档，只有输入才落盘）；
 * - 块前 Delete 删整块；块后 Backspace 删整块；
 * - 块前 Backspace：上一行空 → 删空行；上一行段落 → 光标到其末尾（=←）；上一行是块 → 删上一个块；
 * - 块后 Delete：下一行空 → 删空行；下一行段落 → 光标到其开头（=→）；下一行是块 → 删下一个块。
 *
 * Shift+方向键与「整块选中」不走这里（仍由 rawBlockInteractions 的 whole-select 通道处理）。
 */
import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import type { Node as ProseMirrorNode, ResolvedPos } from '@milkdown/kit/prose/model'
import { Plugin, PluginKey, TextSelection } from '@milkdown/kit/prose/state'
import type { Selection } from '@milkdown/kit/prose/state'
import type { EditorState, Transaction } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'
import { EditorSelection } from '@codemirror/state'
import { EditorView as CodeMirrorView } from '@codemirror/view'
import { findTable, selectedRect, TableMap } from '@milkdown/kit/prose/tables'

import {
  BlockBoundaryCaret,
  activeBlockBoundaryTarget,
  blockBoundaryCaretAt,
  blockBoundaryTargetAt,
  isBoundaryStopBlock,
  type BlockBoundarySide,
  type BlockBoundaryTarget
} from './blockBoundaryCaret'
import { parseContainerSource } from '../editor/markdown/containerBody'
import { isDeskCalloutNode } from '../editor/markdown/deskCallout'

export type BoundaryArrow = 'up' | 'down' | 'left' | 'right'

export const blockBoundaryNavigationKey = new PluginKey('desk-block-boundary-navigation')

export interface BlockBoundaryNavigationOptions {
  /** 复制/剪切整块（宿主用 Milkdown 的 serializer 序列化 markdown 后写剪贴板）。 */
  copyBlockAt?: (view: EditorView, position: number, cut: boolean) => boolean
}

/* ------------------------------------------------------------------ */
/* 基础工具                                                            */
/* ------------------------------------------------------------------ */

function isForward(direction: BoundaryArrow): boolean {
  return direction === 'down' || direction === 'right'
}

function isHiddenBlock(node: ProseMirrorNode | null | undefined): boolean {
  return node?.type.name === 'deskRawBlock' && node.attrs.hidden === true
}

interface BlockLocation {
  pos: number
  node: ProseMirrorNode
}

/** 找到 `blockPos` 处节点所在的父节点与下标（支持嵌套在 callout 等容器里）。 */
function parentOf(
  doc: ProseMirrorNode,
  blockPos: number,
  node: ProseMirrorNode
): { parent: ProseMirrorNode; index: number } | null {
  const $pos = doc.resolve(blockPos)
  for (let depth = $pos.depth; depth >= 0; depth -= 1) {
    const parent = $pos.node(depth)
    const index = $pos.index(depth)
    if (index < parent.childCount && parent.child(index) === node) return { parent, index }
  }
  return null
}

/** 跳过隐藏块，取同一父节点里的上一个/下一个可见块。 */
function siblingBlock(
  doc: ProseMirrorNode,
  blockPos: number,
  node: ProseMirrorNode,
  direction: -1 | 1
): BlockLocation | null {
  const found = parentOf(doc, blockPos, node)
  if (!found) return null
  let index = found.index + direction
  // 向后：下一个兄弟的起点 = 当前块末尾；向前：每次先减掉那个兄弟自己的 nodeSize。
  let pos = direction === 1 ? blockPos + node.nodeSize : blockPos
  while (index >= 0 && index < found.parent.childCount) {
    const sibling = found.parent.child(index)
    if (direction === -1) pos -= sibling.nodeSize
    if (!isHiddenBlock(sibling)) return { pos, node: sibling }
    if (direction === 1) pos += sibling.nodeSize
    index += direction
  }
  return null
}

function isEmptyLine(node: ProseMirrorNode): boolean {
  if (!node.isTextblock) return false
  if (node.content.size === 0) return true
  let onlyBreaks = true
  node.forEach((child) => {
    if (child.type.name !== 'hardbreak') onlyBreaks = false
  })
  return onlyBreaks
}

function textBetweenInParent(
  $head: EditorState['selection']['$head'],
  from: number,
  to: number
): string {
  return $head.parent.textBetween(from, to, '\n', '\n')
}

/** 光标在文本块最后一条视觉行上（↓ 可以走出该块）。 */
function isOnLastLineOfTextblock($head: EditorState['selection']['$head']): boolean {
  return !textBetweenInParent($head, $head.parentOffset, $head.parent.content.size).includes('\n')
}

/** 光标在文本块第一条视觉行上（↑ 可以走出该块）。 */
function isOnFirstLineOfTextblock($head: EditorState['selection']['$head']): boolean {
  return !textBetweenInParent($head, 0, $head.parentOffset).includes('\n')
}

/**
 * 键盘归属（每个编辑器一份）。
 *
 * 光看 `document.activeElement` 判断「现在在不在代码编辑器里」是不可靠的：
 * 块边界光标贴着代码块时，PM 的 `selectionToDOM` 会把 DOM 选区放进代码块的
 * contentDOM，Chromium 于是把焦点也带进 `.cm-content`（实测 blur + view.focus()
 * 之后 activeElement 仍然回到 cm-content）。此时方向键必须归边界分支，
 * 否则会在同一个边界位置上反复落位——「相邻两个代码块，从下面那个按 ↑ 上不去」。
 *
 * 所以由我们自己记账：刚把 PM 选区放到边界上 = 'boundary'；主动进代码编辑器
 * （↓/→ 进块）或用户自己点进代码块 = 'code'。
 */
const keyboardOwner = new WeakMap<EditorView, 'boundary' | 'code'>()

/**
 * 我们自己发起、只改选区的 dispatch。
 *
 * 贴着代码块的边界光标会被 PM 的 `selectionToDOM` 写进代码块的 contentDOM，
 * CM 于是把它当成自己的选区变化、回同步一次 PM 选区，把边界光标顶掉。所以
 * appendTransaction 里有一道守卫把这些「外部同步」还原；守卫必须放行我们自己
 * 的这次 dispatch，用这个标记区分。
 */
const pendingSelectionTransactions = new WeakSet<EditorView>()

function dispatchSelection(view: EditorView, ...args: Parameters<EditorView['dispatch']>): void {
  pendingSelectionTransactions.add(view)
  try {
    view.dispatch(...args)
  } finally {
    pendingSelectionTransactions.delete(view)
  }
}

/** 选区是否落在代码块内部（CM 回同步 PM 选区的特征）。 */
function isInsideCodeBlock(selection: Selection): boolean {
  const $head = selection.$head
  for (let depth = $head.depth; depth > 0; depth -= 1) {
    if ($head.node(depth).type.name === 'code_block') return true
  }
  return false
}

function focusProseMirror(view: EditorView): void {
  keyboardOwner.set(view, 'boundary')
  view.focus()
}

function placeText(view: EditorView, pos: number, bias: -1 | 1): boolean {
  const doc = view.state.doc
  const clamped = Math.max(0, Math.min(pos, doc.content.size))
  const selection = TextSelection.near(doc.resolve(clamped), bias)
  dispatchSelection(view, view.state.tr.setSelection(selection).scrollIntoView())
  focusProseMirror(view)
  return true
}

/** 放置块边界光标（目标位置必须贴着可停靠块；side 指定贴哪一侧）。 */
export function placeBoundaryCaret(
  view: EditorView,
  pos: number,
  side?: 'before' | 'after'
): boolean {
  const caret = blockBoundaryCaretAt(view.state.doc, pos, side)
  if (!caret) return false
  dispatchSelection(view, view.state.tr.setSelection(caret).scrollIntoView())
  focusProseMirror(view)
  return true
}

/** 删除一段内容后，把光标放回删除点：能停靠就停靠，否则就近放文本光标。 */
function placeAfterDelete(tr: Transaction, pos: number): Transaction {
  const clamped = Math.max(0, Math.min(pos, tr.doc.content.size))
  const caret = blockBoundaryCaretAt(tr.doc, clamped)
  if (caret) return tr.setSelection(caret).scrollIntoView()
  return tr.setSelection(TextSelection.near(tr.doc.resolve(clamped), 1)).scrollIntoView()
}

/** 在边界位置实体化一个空段落（打字 / 回车用）。 */
export function materializeLineAt(view: EditorView, boundaryPos: number): boolean {
  const { state } = view
  const paragraph = state.schema.nodes.paragraph
  if (!paragraph) return false
  const pos = Math.max(0, Math.min(boundaryPos, state.doc.content.size))
  const $pos = state.doc.resolve(pos)
  if (!$pos.parent.canReplaceWith($pos.index(), $pos.index(), paragraph)) return false
  const tr = state.tr.insert(pos, paragraph.create())
  tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1), 1))
  dispatchSelection(view, tr.scrollIntoView())
  focusProseMirror(view)
  return true
}

/** 文档末尾（或当前块之后）补一个可编辑空段落。 */
function growTrailingParagraph(view: EditorView, afterPos: number): boolean {
  const { state } = view
  const paragraph = state.schema.nodes.paragraph
  if (!paragraph) return false
  const pos = Math.max(0, Math.min(afterPos, state.doc.content.size))
  const $pos = state.doc.resolve(pos)
  if (!$pos.parent.canReplaceWith($pos.index(), $pos.index(), paragraph)) return false
  const tr = state.tr.insert(pos, paragraph.create())
  tr.setSelection(TextSelection.near(tr.doc.resolve(pos + 1), 1))
  dispatchSelection(view, tr.scrollIntoView())
  focusProseMirror(view)
  return true
}

/* ------------------------------------------------------------------ */
/* 从普通文本选区进入边界                                              */
/* ------------------------------------------------------------------ */

/**
 * 光标在文本块边缘、相邻块又是「可停靠块」时，返回应该停靠的边界位置。
 * 取代旧的「方向键 → 整块 NodeSelection」。
 */
export function adjacentBoundaryCaretPosition(
  state: EditorState,
  direction: BoundaryArrow
): number | null {
  const { selection } = state
  if (!(selection instanceof TextSelection) || !selection.empty) return null
  const { $head } = selection
  if ($head.depth < 1 || !$head.parent.isTextblock) return null
  if ($head.parent.type.name === 'code_block') return null
  const forward = isForward(direction)

  if (forward) {
    if (
      direction === 'right'
        ? $head.parentOffset !== $head.parent.content.size
        : !isOnLastLineOfTextblock($head)
    ) {
      return null
    }
    for (let depth = $head.depth; depth > 1; depth -= 1) {
      if ($head.index(depth - 1) < $head.node(depth - 1).childCount - 1) return null
    }
    return neighborBoundaryPosition(state, $head.after(1), 'down')
  }

  if (direction === 'left' ? $head.parentOffset !== 0 : !isOnFirstLineOfTextblock($head)) {
    return null
  }
  for (let depth = $head.depth; depth > 1; depth -= 1) {
    if ($head.index(depth - 1) > 0) return null
  }
  return neighborBoundaryPosition(state, $head.before(1), 'up')
}

function neighborBoundaryPosition(
  state: EditorState,
  boundary: number,
  direction: 'up' | 'down'
): number | null {
  const doc = state.doc
  const resolved = doc.resolve(Math.max(0, Math.min(boundary, doc.content.size)))
  const neighbor = direction === 'down' ? resolved.nodeAfter : resolved.nodeBefore
  if (!neighbor || !isBoundaryStopBlock(neighbor)) return null
  return boundary
}

/* ------------------------------------------------------------------ */
/* 块内部：代码块/代码组（CodeMirror）与表格                            */
/* ------------------------------------------------------------------ */

function isCodeGroupBlock(node: ProseMirrorNode): boolean {
  if (node.type.name !== 'deskRawBlock') return false
  try {
    return parseContainerSource(String(node.attrs.source ?? '')).name === 'code-group'
  } catch {
    return false
  }
}

function canEnterInterior(node: ProseMirrorNode): boolean {
  return node.type.name === 'code_block' || node.type.name === 'table' || isCodeGroupBlock(node)
}

function visibleCodeMirror(blockDom: HTMLElement): CodeMirrorView | null {
  const candidates = [...blockDom.querySelectorAll('.cm-editor')].filter(
    (element): element is HTMLElement => element instanceof HTMLElement
  )
  const visible = candidates.find((element) => element.offsetParent !== null) ?? candidates[0]
  return visible ? CodeMirrorView.findFromDOM(visible) : null
}

function focusCodeMirror(view: EditorView, blockDom: HTMLElement, forward: boolean): boolean {
  const cm = visibleCodeMirror(blockDom)
  if (!cm) {
    // 代码块在视口外时 CodeMirror 可能还没初始化：先滚进视口，下一帧再进。
    blockDom.scrollIntoView({ block: 'center' })
    requestAnimationFrame(() => {
      if (!(view.state.selection instanceof BlockBoundaryCaret)) return
      const next = visibleCodeMirror(blockDom)
      if (!next) return
      keyboardOwner.set(view, 'code')
      next.focus()
      next.dispatch({
        selection: EditorSelection.cursor(forward ? 0 : next.state.doc.length),
        scrollIntoView: true
      })
    })
    return true
  }
  keyboardOwner.set(view, 'code')
  cm.focus()
  cm.dispatch({
    selection: EditorSelection.cursor(forward ? 0 : cm.state.doc.length),
    scrollIntoView: true
  })
  return true
}

function enterInterior(
  view: EditorView,
  target: BlockBoundaryTarget,
  direction: BoundaryArrow
): boolean {
  const forward = isForward(direction)
  if (target.node.type.name === 'table') return enterTable(view, target, forward)
  const dom = view.nodeDOM(target.blockPos)
  if (!(dom instanceof HTMLElement)) return false
  return focusCodeMirror(view, dom, forward)
}

function enterTable(view: EditorView, target: BlockBoundaryTarget, forward: boolean): boolean {
  const { state } = view
  const tableNode = state.doc.nodeAt(target.blockPos)
  if (!tableNode) return false
  const map = TableMap.get(tableNode)
  const row = forward ? 0 : map.height - 1
  const col = forward ? 0 : map.width - 1
  // TableMap.map 是「宽 × 高的一维数组」，取单元格要用 positionAt（原来写
  // `map.map[row][col]` 永远是 undefined，一直是靠 PM 默认的 → 蒙混过去的）。
  if (row < 0 || col < 0) return false
  const offset = map.positionAt(row, col, tableNode)
  if (offset == null) return false
  return placeText(view, target.blockPos + 1 + offset + 1, 1)
}

/** 末行（忽略末尾空白行）的结束位置：←/→ 直接穿出、↑/↓ 逐行穿过。 */
function lastContentLineEnd(text: string): number {
  let end = text.length
  while (end > 0 && (text[end - 1] === '\n' || text[end - 1] === ' ' || text[end - 1] === '\t')) {
    end -= 1
  }
  return end
}

function blockPositionForDom(view: EditorView, dom: Element): number | null {
  let found: number | null = null
  view.state.doc.descendants((_node, pos) => {
    if (found != null) return false
    if (view.nodeDOM(pos) === dom) {
      found = pos
      return false
    }
    return true
  })
  return found
}

/** 从 CM 的 DOM 往上找最近的「节点视图 DOM」（代码组里中间可能还套了几层）。 */
function blockPositionForInteriorDom(view: EditorView, cmDom: Element): number | null {
  let element: Element | null = cmDom
  while (element && element !== view.dom) {
    const found = blockPositionForDom(view, element)
    if (found != null) return found
    element = element.parentElement
  }
  return null
}

function exitCodeMirror(view: EditorView, cmDom: Element, side: BlockBoundarySide): boolean {
  const blockPos = blockPositionForInteriorDom(view, cmDom)
  if (blockPos == null) return false
  const node = view.state.doc.nodeAt(blockPos)
  if (!node) return false
  return side === 'before'
    ? placeBoundaryCaret(view, blockPos, 'before')
    : placeBoundaryCaret(view, blockPos + node.nodeSize, 'after')
}

/** 首个非空白行的起点（← 跳过前导空行直接出块用）。 */
function firstContentLineStart(text: string): number {
  let start = 0
  while (
    start < text.length &&
    (text[start] === '\n' || text[start] === ' ' || text[start] === '\t')
  ) {
    start += 1
  }
  return start
}

/**
 * 代码块/代码组内部的 ↑/↓/←/→ 边界；命中返回 true。
 *
 * ↑/↓ 逐行穿过 fence 首/末的空行，←/→ 直接跳过这些空行出块（用户 T4→T5「两次 ↓ 或一次 →」）。
 * Crepe 自己的 CodeMirror keymap 会在末行/首行直接出块，所以这些边界必须在捕获阶段先接管。
 */
function handleCodeMirrorKey(view: EditorView, event: KeyboardEvent, cmDom: Element): boolean {
  const cm = CodeMirrorView.findFromDOM(cmDom as HTMLElement)
  if (!cm) return false
  const { main } = cm.state.selection
  if (!main.empty) return false
  // 多光标（多选区）是 CM 内部的编辑操作：只有单光标才在边缘出块。
  if (cm.state.selection.ranges.length > 1) return false
  const doc = cm.state.doc
  const text = doc.toString()
  const contentEnd = lastContentLineEnd(text)
  const contentStart = firstContentLineStart(text)

  if (event.key === 'ArrowDown') {
    if (main.head >= doc.length) return exitCodeMirror(view, cmDom, 'after')
    const line = doc.lineAt(main.head)
    const lastContentLine = doc.lineAt(contentEnd)
    if (line.number === lastContentLine.number && doc.length > main.head) {
      cm.dispatch({
        selection: EditorSelection.cursor(Math.min(doc.length, line.to + 1)),
        scrollIntoView: true
      })
      return true
    }
    return false
  }

  if (event.key === 'ArrowRight') {
    return main.head >= contentEnd ? exitCodeMirror(view, cmDom, 'after') : false
  }

  if (event.key === 'ArrowUp') {
    return doc.lineAt(main.head).number === 1 ? exitCodeMirror(view, cmDom, 'before') : false
  }

  if (event.key === 'ArrowLeft') {
    return main.head <= contentStart ? exitCodeMirror(view, cmDom, 'before') : false
  }

  return false
}

function isInTableCaret(state: EditorState): boolean {
  const { selection } = state
  if (!(selection instanceof TextSelection) || !selection.empty) return false
  return Boolean(findTable(selection.$head))
}

/** 表格首/末行与首/末单元格的边界；命中返回 true。 */
function handleTableKey(view: EditorView, event: KeyboardEvent): boolean {
  const { selection } = view.state
  if (!(selection instanceof TextSelection) || !selection.empty) return false
  const $head = selection.$head
  const found = findTable($head)
  if (!found) return false
  const rect = selectedRect(view.state)
  const tablePos = found.pos
  if (event.key === 'ArrowUp' && rect.top === 0) return placeBoundaryCaret(view, tablePos, 'before')
  if (event.key === 'ArrowDown' && rect.bottom >= rect.map.height) {
    return placeBoundaryCaret(view, tablePos + found.node.nodeSize, 'after')
  }
  if (event.key === 'ArrowLeft' && $head.parentOffset === 0 && rect.left === 0) {
    return placeBoundaryCaret(view, tablePos, 'before')
  }
  if (
    event.key === 'ArrowRight' &&
    $head.parentOffset === $head.parent.content.size &&
    rect.right >= rect.map.width
  ) {
    return placeBoundaryCaret(view, tablePos + found.node.nodeSize, 'after')
  }
  return false
}

/* ------------------------------------------------------------------ */
/* 从边界出发的方向键                                                  */
/* ------------------------------------------------------------------ */

function moveForwardFromBoundary(
  view: EditorView,
  target: BlockBoundaryTarget,
  direction: BoundaryArrow
): boolean {
  const { doc } = view.state
  if (target.side === 'before') {
    const after = target.blockPos + target.node.nodeSize
    // 表格在竖向上是「一整行」：块前 ↓ 直接穿到块后，只有 → 才进第一个单元格。
    if (target.node.type.name === 'table') {
      return direction === 'right'
        ? enterInterior(view, target, 'right')
        : placeBoundaryCaret(view, after, 'after')
    }
    if (canEnterInterior(target.node)) return enterInterior(view, target, direction)
    // 不可进入内部的块（岛 / 原子）仍保留「块前 → 块后」两个停靠点，只是不进内部。
    return placeBoundaryCaret(view, after, 'after')
  }
  // 块后：下一个可停靠块 → 它的块前光标；否则落到下一行文本（可停靠块之间的空行透明）。
  const next = siblingBlock(doc, target.blockPos, target.node, 1)
  if (!next) return growTrailingParagraph(view, target.blockPos + target.node.nodeSize)
  if (isBoundaryStopBlock(next.node)) return placeBoundaryCaret(view, next.pos, 'before')
  return placeText(view, next.pos + 1, 1)
}

/**
 * 从「块边界」继续按方向键（等价于站在块边界光标上按键）。
 * 供整块选中 / 代码编辑器末尾这类「光标其实贴在块边上」的出口复用，
 * 保证方向键永远先走边界停靠点，而不是跳过邻近的可停靠块。
 */
export function moveFromBlockEdge(
  view: EditorView,
  boundary: number,
  direction: BoundaryArrow
): boolean {
  const side: BlockBoundarySide = direction === 'up' || direction === 'left' ? 'before' : 'after'
  const target = blockBoundaryTargetAt(view.state.doc, boundary, side)
  if (!target) return false
  if (direction === 'up') return moveBackwardFromBoundary(view, target, 'up')
  if (direction === 'left') return moveBackwardFromBoundary(view, target, 'left')
  return moveForwardFromBoundary(view, target, direction)
}

function moveBackwardFromBoundary(
  view: EditorView,
  target: BlockBoundaryTarget,
  direction: BoundaryArrow
): boolean {
  const { doc } = view.state
  if (target.side === 'after') {
    // 与 ↓/→ 对称：表格块后 ↑ 直接穿回块前，只有 ← 才进最后一个单元格
    if (target.node.type.name === 'table') {
      return direction === 'left'
        ? enterInterior(view, target, 'left')
        : placeBoundaryCaret(view, target.blockPos, 'before')
    }
    if (canEnterInterior(target.node)) return enterInterior(view, target, direction)
    return placeBoundaryCaret(view, target.blockPos, 'before')
  }
  const previous = siblingBlock(doc, target.blockPos, target.node, -1)
  if (!previous) return true
  if (isBoundaryStopBlock(previous.node)) {
    return placeBoundaryCaret(view, previous.pos + previous.node.nodeSize, 'after')
  }
  return placeText(view, previous.pos + previous.node.nodeSize - 1, -1)
}

function deleteRange(view: EditorView, from: number, to: number, caretPos: number): boolean {
  if (to <= from) return false
  const tr = view.state.tr.delete(from, to)
  dispatchSelection(view, placeAfterDelete(tr, caretPos))
  focusProseMirror(view)
  return true
}

/** 块前 Backspace：上一行空 → 删空行；段落 → 移到其末尾；是块 → 删上一个块。 */
function backspaceBeforeBoundary(view: EditorView, target: BlockBoundaryTarget): boolean {
  const previous = siblingBlock(view.state.doc, target.blockPos, target.node, -1)
  if (!previous) return true
  if (isEmptyLine(previous.node) || isBoundaryStopBlock(previous.node)) {
    return deleteRange(view, previous.pos, previous.pos + previous.node.nodeSize, previous.pos)
  }
  return moveBackwardFromBoundary(view, target, 'up')
}

/** 块后 Delete：下一行空 → 删空行；段落 → 移到其开头；是块 → 删下一个块。 */
function deleteAfterBoundary(view: EditorView, target: BlockBoundaryTarget): boolean {
  const next = siblingBlock(view.state.doc, target.blockPos, target.node, 1)
  if (!next) return true
  if (isEmptyLine(next.node) || isBoundaryStopBlock(next.node)) {
    const caretAt = target.blockPos + target.node.nodeSize
    return deleteRange(view, next.pos, next.pos + next.node.nodeSize, caretAt)
  }
  return moveForwardFromBoundary(view, target, 'down')
}

function isPrintableKey(event: KeyboardEvent): boolean {
  return (
    !event.isComposing &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    typeof event.key === 'string' &&
    event.key.length === 1
  )
}

function handleAtBoundary(
  view: EditorView,
  event: KeyboardEvent,
  options: BlockBoundaryNavigationOptions,
  target: BlockBoundaryTarget
): boolean {
  if (event.metaKey || event.ctrlKey) {
    const key = event.key.toLowerCase()
    if (key === 'c' || key === 'x') {
      return Boolean(options.copyBlockAt?.(view, target.blockPos, key === 'x'))
    }
    return false
  }
  if (event.altKey) return false
  // Shift+方向键走整块/范围选择；Shift+Delete 等平台快捷键也不抢。
  if (event.shiftKey && event.key !== 'Enter') return false
  switch (event.key) {
    case 'ArrowDown':
      return moveForwardFromBoundary(view, target, 'down')
    case 'ArrowRight':
      return moveForwardFromBoundary(view, target, 'right')
    case 'ArrowUp':
      return moveBackwardFromBoundary(view, target, 'up')
    case 'ArrowLeft':
      return moveBackwardFromBoundary(view, target, 'left')
    case 'Enter':
      return materializeLineAt(view, view.state.selection.from)
    case 'Delete':
      return target.side === 'before'
        ? deleteRange(
            view,
            target.blockPos,
            target.blockPos + target.node.nodeSize,
            target.blockPos
          )
        : deleteAfterBoundary(view, target)
    case 'Backspace':
      return target.side === 'after'
        ? deleteRange(
            view,
            target.blockPos,
            target.blockPos + target.node.nodeSize,
            target.blockPos
          )
        : backspaceBeforeBoundary(view, target)
    default:
      if (isPrintableKey(event)) {
        const pos = view.state.selection.from
        if (!materializeLineAt(view, pos)) return false
        view.dispatch(view.state.tr.insertText(event.key, view.state.selection.from))
        return true
      }
      return false
  }
}

const ARROW_KEYS: Record<string, BoundaryArrow> = {
  ArrowDown: 'down',
  ArrowUp: 'up',
  ArrowLeft: 'left',
  ArrowRight: 'right'
}

/** 捕获阶段调用：边界光标键位 → 内部边界 → 从文本边缘进入边界。 */
export function handleBoundaryNavigationKeyDown(
  view: EditorView,
  event: KeyboardEvent,
  options: BlockBoundaryNavigationOptions = {}
): boolean {
  if (!view.editable) return false
  if (event.isComposing) return false
  const plainArrow =
    !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey && event.key in ARROW_KEYS

  // 块内部优先：焦点在 CodeMirror 里时事件目标是 .cm-content；表格里焦点仍在
  // .ProseMirror 上，所以表格要靠状态选区判断。此时 PM 的状态选区可能还是进入前的
  // 块边界光标，绝不能让边界分支把方向键抢走。
  const element = event.target instanceof Element ? event.target : null
  const cmDom = element?.closest('.cm-content')
  // raw block 的「源码编辑器」是块外壳上的编辑器，不是块内部（代码组 tab 的
  // `.desk-raw-block__include-cm` 才是块内部，要按 T4 在末尾出块）。
  const rawSourceEditor = element?.closest('.desk-raw-block__editor-cm')
  // 边界握着键盘时，即使 DOM 焦点被浏览器留在 .cm-content 里，也走边界分支。
  if (cmDom && !rawSourceEditor && keyboardOwner.get(view) !== 'boundary') {
    if (!plainArrow) return false
    return handleCodeMirrorKey(view, event, cmDom)
  }
  if (view.state.selection instanceof TextSelection && isInTableCaret(view.state)) {
    if (!plainArrow) return false
    return handleTableKey(view, event)
  }

  const target = activeBlockBoundaryTarget(view.state)
  if (target) {
    // Shift+方向键交给「整块/跨块范围选择」通道。
    if (event.shiftKey && event.key in ARROW_KEYS) return false
    return handleAtBoundary(view, event, options, target)
  }

  if (plainArrow && view.state.selection instanceof TextSelection) {
    // callout body 与标题 input 是一套独立的键盘交互（↑ 进标题），
    // 这里不能抢：交给 deskCalloutKeymapPlugin。
    if (isInsideCalloutBody(view.state.selection.$head)) return false
    const pos = adjacentBoundaryCaretPosition(view.state, ARROW_KEYS[event.key]!)
    if (pos != null) return placeBoundaryCaret(view, pos)
  }
  return false
}

/** 光标在 callout 的 body 内（callout 自己的 chrome 交互优先）。 */
function isInsideCalloutBody($pos: ResolvedPos): boolean {
  for (let depth = $pos.depth; depth > 0; depth -= 1) {
    if (isDeskCalloutNode($pos.node(depth))) return true
  }
  return false
}

/** 在边界上打字（PM handleTextInput 兜底路径）。 */
export function handleBoundaryTextInput(view: EditorView, text: string): boolean {
  if (!activeBlockBoundaryTarget(view.state)) return false
  const pos = view.state.selection.from
  if (!materializeLineAt(view, pos)) return false
  dispatchSelection(view, view.state.tr.insertText(text, view.state.selection.from))
  return true
}

export function createBlockBoundaryNavigationPlugin(
  options: BlockBoundaryNavigationOptions = {}
): MilkdownPlugin {
  let currentView: EditorView | null = null
  return $prose(
    () =>
      new Plugin({
        key: blockBoundaryNavigationKey,
        appendTransaction: (transactions, oldState, newState) => {
          // 边界握着键盘时，只改选区的「外部同步」（代码块里的 CM 被 PM 写入选区后
          // 回同步）不能把边界光标顶掉。
          if (!currentView || keyboardOwner.get(currentView) !== 'boundary') return null
          if (pendingSelectionTransactions.has(currentView)) return null
          if (transactions.some((transaction) => transaction.docChanged)) return null
          if (!(oldState.selection instanceof BlockBoundaryCaret)) return null
          if (newState.selection instanceof BlockBoundaryCaret) return null
          // 只挡这一种：新选区落在代码块内部（CM 被 PM 写入选区后回同步）。
          // PM 默认的方向键移动（表格单元格、列表等）必须放行。
          if (!isInsideCodeBlock(newState.selection)) return null
          return newState.tr.setSelection(oldState.selection)
        },
        props: {
          handleKeyDown: (view, event) => handleBoundaryNavigationKeyDown(view, event, options),
          handleTextInput: (view, _from, _to, text) => handleBoundaryTextInput(view, text),
          handlePaste: (view) => {
            // 先实体化空行，再交回默认粘贴（返回 false，不吞事件）。
            if (activeBlockBoundaryTarget(view.state)) {
              materializeLineAt(view, view.state.selection.from)
            }
            return false
          },
          handleDOMEvents: {
            beforeinput: (view, event) => {
              if (event.inputType !== 'insertCompositionText') return false
              if (!activeBlockBoundaryTarget(view.state)) return false
              materializeLineAt(view, view.state.selection.from)
              return false
            }
          }
        },
        view(view) {
          currentView = view
          // 用户自己点进代码块 → 键盘归代码编辑器；点别处则清掉归属（走 PM 默认）。
          const onPointerDown = (event: Event): void => {
            const target = event.target
            if (!(target instanceof Element)) return
            if (target.closest('.cm-editor')) keyboardOwner.set(view, 'code')
            else keyboardOwner.delete(view)
          }
          const doc = view.dom.ownerDocument
          doc.addEventListener('pointerdown', onPointerDown, true)
          return {
            destroy: () => {
              doc.removeEventListener('pointerdown', onPointerDown, true)
              if (currentView === view) currentView = null
            }
          }
        }
      })
  )
}
