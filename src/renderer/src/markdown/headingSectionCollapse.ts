import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import type { Node as ProseMirrorNode } from '@milkdown/kit/prose/model'
import { NodeSelection, Plugin, PluginKey, TextSelection, type EditorState, type Transaction } from '@milkdown/kit/prose/state'
import { Decoration, DecorationSet, type EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'

export const headingSectionCollapseKey = new PluginKey<HeadingSectionCollapseState>(
  'desk-heading-section-collapse'
)

export interface HeadingSectionCollapseState {
  collapsed: Set<number>
}

export interface HeadingSectionRange {
  from: number
  to: number
  level: number
}

function isDocHeading(doc: ProseMirrorNode, pos: number, node: ProseMirrorNode | null): node is ProseMirrorNode {
  return Boolean(node?.type.name === 'heading' && doc.resolve(pos).parent === doc)
}

/** Heading plus following blocks until the next heading of the same or higher level. */
export function headingSectionRange(doc: ProseMirrorNode, headingPos: number): HeadingSectionRange | null {
  const heading = doc.nodeAt(headingPos)
  if (!isDocHeading(doc, headingPos, heading)) return null
  const level = Number(heading.attrs.level)
  let to = doc.content.size
  doc.forEach((node, offset) => {
    if (offset <= headingPos) return
    if (node.type.name === 'heading' && Number(node.attrs.level) <= level && offset < to) {
      to = offset
    }
  })
  return { from: headingPos, to, level }
}

export function headingHasCollapsibleSection(doc: ProseMirrorNode, headingPos: number): boolean {
  const heading = doc.nodeAt(headingPos)
  const range = headingSectionRange(doc, headingPos)
  return Boolean(heading && range && range.to > headingPos + heading.nodeSize)
}

export function collapsedHeadingSet(state: EditorState): Set<number> {
  return headingSectionCollapseKey.getState(state)?.collapsed ?? new Set()
}

/** Full section range when this heading is currently collapsed; otherwise null. */
export function collapsedHeadingSectionRange(
  state: EditorState,
  headingPos: number
): HeadingSectionRange | null {
  if (!collapsedHeadingSet(state).has(headingPos)) return null
  return headingSectionRange(state.doc, headingPos)
}

export type HeadingFoldLevel = 1 | 2 | 3 | 4 | 5 | 6
export type HeadingFoldCommand =
  | 'fold-all'
  | 'unfold-all'
  | `fold-level-${HeadingFoldLevel}`
  | `unfold-level-${HeadingFoldLevel}`

export function collectDocHeadings(doc: ProseMirrorNode): { pos: number; level: number }[] {
  const headings: { pos: number; level: number }[] = []
  doc.forEach((node, offset) => {
    if (isDocHeading(doc, offset, node)) headings.push({ pos: offset, level: Number(node.attrs.level) })
  })
  return headings
}

function headingLevelAt(doc: ProseMirrorNode, pos: number): number | null {
  const node = doc.nodeAt(pos)
  if (node?.type.name !== 'heading') return null
  return Number(node.attrs.level)
}

export function applyHeadingFoldCommand(
  state: EditorState,
  command: HeadingFoldCommand
): Transaction | null {
  const headings = collectDocHeadings(state.doc)
  const collapsed = [...collapsedHeadingSet(state)]
  let next: number[]
  if (command === 'unfold-all') {
    next = []
  } else if (command === 'fold-all') {
    next = headings
      .filter((heading) => headingHasCollapsibleSection(state.doc, heading.pos))
      .map((heading) => heading.pos)
  } else if (command.startsWith('unfold-level-')) {
    const level = Number(command.slice('unfold-level-'.length))
    next = collapsed.filter((pos) => headingLevelAt(state.doc, pos) !== level)
  } else {
    const level = Number(command.slice('fold-level-'.length))
    const keep = collapsed.filter((pos) => headingLevelAt(state.doc, pos) !== level)
    const add = headings
      .filter(
        (heading) =>
          heading.level === level && headingHasCollapsibleSection(state.doc, heading.pos)
      )
      .map((heading) => heading.pos)
    next = [...new Set([...keep, ...add])]
  }
  const current = [...collapsedHeadingSet(state)].sort((a, b) => a - b)
  const sorted = [...next].sort((a, b) => a - b)
  if (current.length === sorted.length && current.every((pos, index) => pos === sorted[index])) {
    return null
  }
  return state.tr.setMeta(headingSectionCollapseKey, { set: next })
}

function mapCollapsedPositions(doc: ProseMirrorNode, collapsed: Set<number>, tr: Transaction): Set<number> {
  const next = new Set<number>()
  for (const pos of collapsed) {
    const mapped = tr.mapping.mapResult(pos, 1)
    if (mapped.deleted) continue
    if (isDocHeading(doc, mapped.pos, doc.nodeAt(mapped.pos))) next.add(mapped.pos)
  }
  return next
}

export function toggleHeadingSectionCollapsed(
  state: EditorState,
  headingPos: number
): Transaction | null {
  if (!headingHasCollapsibleSection(state.doc, headingPos)) return null
  const heading = state.doc.nodeAt(headingPos)
  const range = headingSectionRange(state.doc, headingPos)
  if (!heading || !range) return null
  const collapsed = collapsedHeadingSet(state)
  const willCollapse = !collapsed.has(headingPos)
  const tr = state.tr.setMeta(headingSectionCollapseKey, { toggle: headingPos })
  const bodyFrom = headingPos + heading.nodeSize
  if (willCollapse && state.selection.from >= bodyFrom && state.selection.from < range.to) {
    tr.setSelection(TextSelection.near(tr.doc.resolve(headingPos + 1)))
  }
  return tr
}

export function expandCollapsedSectionsContaining(view: EditorView, pos: number): boolean {
  const collapsed = collapsedHeadingSet(view.state)
  if (collapsed.size === 0) return false
  const ancestors: number[] = []
  for (const headingPos of collapsed) {
    const range = headingSectionRange(view.state.doc, headingPos)
    if (range && headingPos < pos && pos < range.to) ancestors.push(headingPos)
  }
  if (ancestors.length === 0) return false
  let { state } = view
  for (const headingPos of ancestors.sort((a, b) => b - a)) {
    const mapped = headingSectionRange(state.doc, headingPos) ? headingPos : -1
    if (mapped < 0 || !collapsedHeadingSet(state).has(mapped)) continue
    const tr = toggleHeadingSectionCollapsed(state, mapped)
    if (!tr) continue
    view.dispatch(tr)
    state = view.state
  }
  return true
}

function headingPosAtCaret(doc: ProseMirrorNode, pos: number): number | null {
  const $pos = doc.resolve(pos)
  for (let depth = $pos.depth; depth > 0; depth -= 1) {
    if ($pos.node(depth).type.name === 'heading') return $pos.before(depth)
  }
  const node = doc.nodeAt(pos)
  return isDocHeading(doc, pos, node) ? pos : null
}

function collapsedSectionEndingAt(
  doc: ProseMirrorNode,
  collapsed: Set<number>,
  pos: number
): number | null {
  let latest: number | null = null
  for (const headingPos of collapsed) {
    const range = headingSectionRange(doc, headingPos)
    if (range?.to === pos && (!latest || headingPos > latest)) latest = headingPos
  }
  return latest
}

function skipCollapsedSection(view: EditorView, direction: 1 | -1): boolean {
  const collapsed = collapsedHeadingSet(view.state)
  if (collapsed.size === 0) return false
  const { doc, selection } = view.state
  if (direction > 0) {
    const headingPos = headingPosAtCaret(doc, selection.head)
    if (headingPos == null || !collapsed.has(headingPos)) return false
    const range = headingSectionRange(doc, headingPos)
    if (!range || range.to <= selection.head) return false
    view.dispatch(view.state.tr.setSelection(TextSelection.near(doc.resolve(range.to), 1)).scrollIntoView())
    return true
  }
  const headingPos = collapsedSectionEndingAt(doc, collapsed, selection.head)
  if (headingPos == null) return false
  view.dispatch(
    view.state.tr.setSelection(TextSelection.near(doc.resolve(headingPos + 1), 1)).scrollIntoView()
  )
  return true
}

function toggleButton(pos: number, collapsed: boolean): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'desk-heading-toggle'
  button.dataset.headingPos = String(pos)
  button.setAttribute('aria-label', collapsed ? '展开' : '收起')
  button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
  button.tabIndex = -1
  button.innerHTML = collapsed
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 6.5v11L18 12z"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.5 9h11L12 18z"/></svg>'
  return button
}

function headingToggleDecorations(state: EditorState): DecorationSet {
  const collapsed = collapsedHeadingSet(state)
  const decorations: Decoration[] = []
  state.doc.forEach((node, offset) => {
    if (!isDocHeading(state.doc, offset, node)) return
    if (!headingHasCollapsibleSection(state.doc, offset) && !collapsed.has(offset)) return
    const isCollapsed = collapsed.has(offset)
    decorations.push(
      Decoration.node(offset, offset + node.nodeSize, {
        class: isCollapsed ? 'has-heading-toggle is-heading-collapsed' : 'has-heading-toggle'
      })
    )
    decorations.push(
      Decoration.widget(offset + 1, () => toggleButton(offset, isCollapsed), {
        side: -1,
        ignoreSelection: true,
        key: `desk-heading-toggle:${offset}:${isCollapsed ? 'on' : 'off'}`,
        stopEvent: (event) =>
          event.target instanceof Element && Boolean(event.target.closest('.desk-heading-toggle'))
      })
    )
    if (!isCollapsed) return
    const range = headingSectionRange(state.doc, offset)
    if (!range) return
    const bodyFrom = offset + node.nodeSize
    state.doc.forEach((child, childOffset) => {
      if (childOffset < bodyFrom || childOffset >= range.to) return
      decorations.push(
        Decoration.node(childOffset, childOffset + child.nodeSize, {
          class: 'desk-heading-section--collapsed',
          nodeName: undefined
        })
      )
    })
  })
  return DecorationSet.create(state.doc, decorations)
}

function headingPosFromToggle(target: EventTarget | null): number | null {
  const button = target instanceof Element ? target.closest('.desk-heading-toggle') : null
  if (!button) return null
  const pos = Number(button.getAttribute('data-heading-pos'))
  return Number.isInteger(pos) ? pos : null
}

/** After Milkdown's handle dragstart, expand the slice to the collapsed section. */
export function prepareCollapsedHeadingDrag(view: EditorView, event: DragEvent): boolean {
  const selection = view.state.selection
  if (!(selection instanceof NodeSelection) || selection.node.type.name !== 'heading') return false
  const headingPos = selection.from
  if (!collapsedHeadingSet(view.state).has(headingPos)) return false
  if (!headingHasCollapsibleSection(view.state.doc, headingPos)) return false
  const range = headingSectionRange(view.state.doc, headingPos)
  if (!range) return false
  const slice = view.state.doc.slice(range.from, range.to)
  const sectionSelection = TextSelection.create(view.state.doc, range.from, range.to)
  view.dispatch(view.state.tr.setSelection(sectionSelection))
  view.dragging = { slice, move: true }
  if (event.dataTransfer) {
    try {
      const serialized = view.serializeForClipboard(slice)
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData('text/html', serialized.dom.innerHTML)
      event.dataTransfer.setData('text/plain', serialized.text)
    } catch {
      // Clipboard serialization is optional; the slice on view.dragging is enough.
    }
  }
  return true
}

export function createHeadingSectionCollapsePlugin(): MilkdownPlugin {
  return $prose(() => {
    return new Plugin<HeadingSectionCollapseState>({
      key: headingSectionCollapseKey,
      state: {
        init: () => ({ collapsed: new Set<number>() }),
        apply(tr, value) {
          const collapsed = mapCollapsedPositions(tr.doc, value.collapsed, tr)
          const meta = tr.getMeta(headingSectionCollapseKey) as
            | { toggle?: number; set?: number[] }
            | undefined
          if (typeof meta?.toggle === 'number') {
            const pos = tr.docChanged ? tr.mapping.map(meta.toggle, 1) : meta.toggle
            if (collapsed.has(pos)) collapsed.delete(pos)
            else if (isDocHeading(tr.doc, pos, tr.doc.nodeAt(pos))) collapsed.add(pos)
          }
          if (Array.isArray(meta?.set)) {
            collapsed.clear()
            for (const pos of meta.set) {
              const mapped = tr.docChanged ? tr.mapping.map(pos, 1) : pos
              if (isDocHeading(tr.doc, mapped, tr.doc.nodeAt(mapped))) collapsed.add(mapped)
            }
          }
          return { collapsed }
        }
      },
      props: {
        decorations: headingToggleDecorations,
        handleKeyDown(view, event) {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return false
          if (event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return false
          return skipCollapsedSection(view, event.key === 'ArrowDown' ? 1 : -1)
        },
        handleDOMEvents: {
          mousedown(_view, event) {
            if (headingPosFromToggle(event.target) == null) return false
            event.preventDefault()
            return true
          },
          click(view, event) {
            const pos = headingPosFromToggle(event.target)
            if (pos == null) return false
            event.preventDefault()
            const tr = toggleHeadingSectionCollapsed(view.state, pos)
            if (tr) view.dispatch(tr)
            return true
          }
        }
      },
      view(view) {
        const root = view.dom.closest('.milkdown') ?? view.dom.parentElement ?? view.dom
        const onDragStart = (event: DragEvent): void => {
          prepareCollapsedHeadingDrag(view, event)
        }
        root.addEventListener('dragstart', onDragStart)
        return {
          destroy() {
            root.removeEventListener('dragstart', onDragStart)
          }
        }
      }
    })
  })
}
