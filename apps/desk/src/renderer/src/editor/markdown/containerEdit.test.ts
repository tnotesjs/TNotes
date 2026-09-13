// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'
import { editorViewCtx } from '@milkdown/kit/core'
import { getMarkdown } from '@milkdown/kit/utils'

import { projectRawBlocksForMilkdown, rawBlockProjectionPlugins } from './rawBlockProjection'
import type { DeskEditorHandle } from '../../markdown/deskEditor'
import { createTestDeskEditor } from '../../markdown/deskEditorTestKit'
import { reconcileMarkdownSource } from './sourcePreservation'

function createEditor(source: string): Promise<{ root: HTMLElement; editor: DeskEditorHandle }> {
  return createTestDeskEditor({
    defaultValue: projectRawBlocksForMilkdown(source),
    configure: (editor) => editor.use(rawBlockProjectionPlugins)
  }).then(({ root, handle }) => ({ root, editor: handle }))
}

function findRawContainerPos(editor: DeskEditorHandle): number | null {
  return editor.editor.action((ctx) => {
    const view = ctx.get(editorViewCtx)
    let found: number | null = null
    view.state.doc.descendants((node, pos) => {
      if (
        node.type.name === 'deskRawBlock' &&
        node.attrs.kind === 'raw-container' &&
        found == null
      ) {
        found = pos
      }
    })
    return found
  })
}

describe('container source editing', () => {
  it('allows updating a raw-container source while preserving surrounding bytes', async () => {
    const source = '::: details\n\noriginal body\n\n:::\n\nplain paragraph\n'
    const { root, editor } = await createEditor(source)
    try {
      const baseline = editor.editor.action(getMarkdown())
      const pos = findRawContainerPos(editor)
      expect(pos).not.toBeNull()

      const newContainerSource = '::: details 新标题\n\n新正文\n\n:::'
      editor.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        const node = view.state.doc.nodeAt(pos!)
        expect(node?.type.name).toBe('deskRawBlock')
        view.dispatch(
          view.state.tr.setNodeMarkup(pos!, undefined, {
            ...(node!.attrs as Record<string, unknown>),
            source: newContainerSource
          })
        )
      })

      const current = editor.editor.action(getMarkdown())
      const reconciled = reconcileMarkdownSource(source, baseline, current)
      expect(reconciled).toContain(newContainerSource)
      expect(reconciled).toContain('plain paragraph')
      // The edited container source must appear verbatim, not normalized.
      expect(reconciled).toContain('::: details 新标题\n\n新正文\n\n:::')
      // The unchanged paragraph must remain byte-identical (no trailing spaces).
      expect(reconciled.endsWith('\nplain paragraph\n')).toBe(true)
    } finally {
      await editor.destroy()
      root.remove()
    }
  })

  it('keeps non-container raw blocks immutable', async () => {
    const source = '<aside data-x="1">raw</aside>\n\nplain\n'
    const { root, editor } = await createEditor(source)
    try {
      const pos = editor.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        let found: number | null = null
        view.state.doc.descendants((node, p) => {
          if (node.type.name === 'deskRawBlock' && found == null) found = p
        })
        return found
      })
      const blocked = editor.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        const node = view.state.doc.nodeAt(pos!)
        const tr = view.state.tr.setNodeMarkup(pos!, undefined, {
          ...(node!.attrs as Record<string, unknown>),
          source: 'changed'
        })
        return view.dispatch(tr)
      })
      expect(blocked).toBeUndefined() // dispatch is void; note the transaction was rejected
      const markdown = editor.editor.action(getMarkdown())
      expect(markdown).toContain('<aside data-x="1">raw</aside>')
    } finally {
      await editor.destroy()
      root.remove()
    }
  })

  it('deletes an empty tip callout (empty-Backspace path)', async () => {
    const source = 'before\n\n::: tip 💡 TIP\n\n\n\n:::\n\nafter\n'
    const { root, editor } = await createEditor(source)
    try {
      const pos = editor.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        let found: number | null = null
        view.state.doc.descendants((node, p) => {
          if (node.type.name === 'deskCallout' && found == null) found = p
        })
        return found
      })
      expect(pos).not.toBeNull()
      editor.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        const node = view.state.doc.nodeAt(pos!)
        expect(node?.type.name).toBe('deskCallout')
        view.dispatch(view.state.tr.delete(pos!, pos! + node!.nodeSize))
      })
      let remaining = 0
      editor.editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        view.state.doc.descendants((node) => {
          if (node.type.name === 'deskCallout') remaining += 1
        })
      })
      expect(remaining).toBe(0)
      const markdown = editor.editor.action(getMarkdown())
      expect(markdown).toContain('before')
      expect(markdown).toContain('after')
      expect(markdown).not.toContain('::: tip')
    } finally {
      await editor.destroy()
      root.remove()
    }
  })
})
