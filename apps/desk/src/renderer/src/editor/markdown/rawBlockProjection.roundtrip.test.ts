// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'
import { replaceAll } from '@milkdown/kit/utils'

import { projectRawBlocksForMilkdown, rawBlockProjectionPlugins } from './rawBlockProjection'
import { createTestDeskEditor } from '../../markdown/deskEditorTestKit'
import { reconcileMarkdownSource } from './sourcePreservation'

describe('自组装配的源码保全往返', () => {
  it('preserves an inline Badge in a paragraph', async () => {
    const source = 'item <Badge type="warning" text="TODO" />\n'
    const { root, handle } = await createTestDeskEditor({
      defaultValue: projectRawBlocksForMilkdown(source),
      configure: (editor) => editor.use(rawBlockProjectionPlugins)
    })
    try {
      expect(handle.getMarkdown()).toBe(source)
      expect(root.querySelector('.tn-badge')?.textContent).toBe('TODO')
      expect(root.querySelector('.tn-badge')?.classList.contains('tn-badge--warning')).toBe(true)
    } finally {
      await handle.destroy()
    }
  })

  it('retains code metadata and a latex fence after their bodies change', async () => {
    const root = document.createElement('div')
    document.body.append(root)
    const source = [
      '```ts:line-numbers=30 {30-51}',
      'const x = 1',
      '```',
      '',
      '```latex',
      '$$',
      'x^2',
      '$$',
      '```',
      '',
      '$$',
      'y^2',
      '$$',
      ''
    ].join('\n')
    const { handle } = await createTestDeskEditor({
      defaultValue: projectRawBlocksForMilkdown(source),
      configure: (editor) => editor.use(rawBlockProjectionPlugins)
    })
    try {
      const baseline = handle.getMarkdown()
      const edited = source
        .replace('const x = 1', 'const x = 2')
        .replace('x^2', 'x^3')
        .replace('y^2', 'y^3')
      handle.editor.action(replaceAll(projectRawBlocksForMilkdown(edited), true))
      const current = handle.getMarkdown()

      expect(baseline).toBe(
        '```ts:line-numbers=30 {30-51}\nconst x = 1\n```\n\n```latex\n$$\nx^2\n$$\n```\n\n$$\ny^2\n$$\n'
      )
      expect(reconcileMarkdownSource(source, baseline, current)).toBe(edited)
    } finally {
      await handle.destroy()
    }
  })
})
