// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorViewCtx, rootCtx } from '@milkdown/kit/core'
import { NodeSelection, TextSelection } from '@milkdown/kit/prose/state'
import type { Node as ProseMirrorNode } from '@milkdown/kit/prose/model'
import type { EditorView } from '@milkdown/kit/prose/view'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'

import { createBlockDeleteTransaction } from './blockActionMenu'
import {
  applyHeadingFoldCommand,
  collapsedHeadingSet,
  createHeadingSectionCollapsePlugin,
  headingHasCollapsibleSection,
  headingSectionRange,
  prepareCollapsedHeadingDrag,
  toggleHeadingSectionCollapsed
} from './headingSectionCollapse'

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
    .use(createHeadingSectionCollapsePlugin())
  editors.push(editor)
  await editor.create()
  return editor.action((ctx) => ctx.get(editorViewCtx))
}

function headingPositions(doc: ProseMirrorNode): number[] {
  const positions: number[] = []
  doc.forEach((node, offset) => {
    if (node.type.name === 'heading') positions.push(offset)
  })
  return positions
}

function visibleText(view: EditorView): string {
  return [...view.dom.querySelectorAll('h1, h2, h3, h4, h5, h6, p')]
    .filter((element) => !element.classList.contains('desk-heading-section--collapsed'))
    .map((element) => element.textContent?.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
}

describe('heading section range', () => {
  it('stops before the next heading of the same or higher level', async () => {
    const view = await setup('# One\n\nbody\n\n## Two\n\ninner\n\n# Other\n\nafter\n')
    const [h1, h2, h3] = headingPositions(view.state.doc)
    expect(headingSectionRange(view.state.doc, h1!)?.to).toBe(h3)
    expect(headingSectionRange(view.state.doc, h2!)?.to).toBe(h3)
    expect(headingHasCollapsibleSection(view.state.doc, h1!)).toBe(true)
    expect(headingHasCollapsibleSection(view.state.doc, h3!)).toBe(true)
  })

  it('does not offer a toggle when the heading has no body', async () => {
    const view = await setup('# Empty\n\n# Next\n\nbody\n')
    const [first, second] = headingPositions(view.state.doc)
    expect(headingHasCollapsibleSection(view.state.doc, first!)).toBe(false)
    expect(headingHasCollapsibleSection(view.state.doc, second!)).toBe(true)
    expect(view.dom.querySelector(`[data-heading-pos="${first}"]`)).toBeNull()
    expect(view.dom.querySelector(`[data-heading-pos="${second}"]`)).toBeTruthy()
  })
})

describe('heading section collapse', () => {
  it('hides the section body until the toggle is clicked again', async () => {
    const view = await setup('## Title\n\nparagraph\n\n### Nested\n\ninner\n\n## Sibling\n\nlater\n')
    const [title, , sibling] = headingPositions(view.state.doc)
    const toggle = toggleHeadingSectionCollapsed(view.state, title!)
    expect(toggle).not.toBeNull()
    view.dispatch(toggle!)
    expect([...collapsedHeadingSet(view.state)]).toEqual([title])
    expect(view.dom.querySelector('h2.is-heading-collapsed')?.textContent).toContain('Title')
    expect(visibleText(view)).toContain('Title')
    expect(visibleText(view)).not.toContain('paragraph')
    expect(visibleText(view)).not.toContain('Nested')
    expect(visibleText(view)).toContain('Sibling')
    expect(visibleText(view)).toContain('later')

    const expand = toggleHeadingSectionCollapsed(view.state, title!)
    view.dispatch(expand!)
    expect(collapsedHeadingSet(view.state).size).toBe(0)
    expect(visibleText(view)).toContain('paragraph')
    expect(visibleText(view)).toContain('Nested')
    expect(sibling).toBeGreaterThan(title!)
  })

  it('renders a persistent collapsed toggle that expands on click', async () => {
    const view = await setup('# Welcome\n\nbody copy\n')
    const [heading] = headingPositions(view.state.doc)
    view.dispatch(toggleHeadingSectionCollapsed(view.state, heading!)!)
    const button = view.dom.querySelector('.desk-heading-toggle')
    expect(button).toBeTruthy()
    expect(button?.getAttribute('aria-label')).toBe('展开')
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(collapsedHeadingSet(view.state).size).toBe(0)
    expect(visibleText(view)).toContain('body copy')
  })

  it('moves a collapsed heading drag as the whole section', async () => {
    const view = await setup('# Keep\n\nkeep body\n\n## Move\n\nmove body\n')
    const [, move] = headingPositions(view.state.doc)
    view.dispatch(toggleHeadingSectionCollapsed(view.state, move!)!)
    view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, move!)))
    const event = new DragEvent('dragstart', { bubbles: true, dataTransfer: new DataTransfer() })
    expect(prepareCollapsedHeadingDrag(view, event)).toBe(true)
    expect(view.state.selection).toBeInstanceOf(TextSelection)
    expect(view.state.selection.from).toBe(move)
    expect(view.dragging?.slice.content.childCount).toBe(2)
    expect(view.dragging?.slice.content.firstChild?.type.name).toBe('heading')
    expect(view.dragging?.slice.content.lastChild?.textContent).toContain('move body')
    expect(view.dragging && 'node' in view.dragging && view.dragging.node).toBeFalsy()
  })

  it('deletes a collapsed heading together with its hidden section', async () => {
    const view = await setup('# Keep\n\nkeep body\n\n## Remove\n\nhidden body\n\n# After\n\nafter body\n')
    const [, remove] = headingPositions(view.state.doc)
    view.dispatch(toggleHeadingSectionCollapsed(view.state, remove!)!)
    view.dispatch(createBlockDeleteTransaction(view.state, remove!)!)
    expect(view.state.doc.textContent).toBe('Keepkeep bodyAfterafter body')
    expect(view.state.doc.textContent).not.toContain('Remove')
    expect(view.state.doc.textContent).not.toContain('hidden body')
  })

  it('folds every collapsible heading and can unfold them all', async () => {
    const view = await setup('# One\n\nbody\n\n## Two\n\ninner\n\n# Other\n\nafter\n')
    const [one, two, other] = headingPositions(view.state.doc)
    view.dispatch(applyHeadingFoldCommand(view.state, 'fold-all')!)
    expect([...collapsedHeadingSet(view.state)].sort((a, b) => a - b)).toEqual([one, two, other].sort((a, b) => a - b))
    view.dispatch(applyHeadingFoldCommand(view.state, 'unfold-all')!)
    expect(collapsedHeadingSet(view.state).size).toBe(0)
  })

  it('folds only the requested heading level', async () => {
    const view = await setup('# One\n\nbody\n\n## Two\n\ninner\n\n# Other\n\nafter\n')
    const [one, two, other] = headingPositions(view.state.doc)
    view.dispatch(applyHeadingFoldCommand(view.state, 'fold-level-2')!)
    expect([...collapsedHeadingSet(view.state)]).toEqual([two])
    view.dispatch(applyHeadingFoldCommand(view.state, 'fold-level-1')!)
    expect([...collapsedHeadingSet(view.state)].sort((a, b) => a - b)).toEqual(
      [one, two, other].sort((a, b) => a - b)
    )
    view.dispatch(applyHeadingFoldCommand(view.state, 'unfold-level-1')!)
    expect([...collapsedHeadingSet(view.state)]).toEqual([two])
  })

  it('deletes only the heading itself when the section is expanded', async () => {
    const view = await setup('## Remove\n\nkept body\n')
    const [heading] = headingPositions(view.state.doc)
    view.dispatch(createBlockDeleteTransaction(view.state, heading!)!)
    expect(view.state.doc.textContent).toBe('kept body')
  })
})
