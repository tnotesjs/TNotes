// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'
import { Crepe } from '@milkdown/crepe'
import { getMarkdown, replaceAll } from '@milkdown/kit/utils'

import { projectRawBlocksForMilkdown, rawBlockProjectionPlugins } from './rawBlockProjection'
import { reconcileMarkdownSource } from './sourcePreservation'

describe('Crepe source preservation integration', () => {
  it('preserves an inline Badge in a paragraph', async () => {
    const root = document.createElement('div')
    document.body.append(root)
    const source = 'item <Badge type="warning" text="TODO" />\n'
    const crepe = new Crepe({ root, defaultValue: projectRawBlocksForMilkdown(source) })
    crepe.editor.use(rawBlockProjectionPlugins)
    await crepe.create()
    try {
      expect(crepe.editor.action(getMarkdown())).toBe(source)
      expect(root.querySelector('.tn-badge')?.textContent).toBe('TODO')
      expect(root.querySelector('.tn-badge')?.classList.contains('tn-badge--warning')).toBe(true)
    } finally {
      await crepe.destroy()
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
    const crepe = new Crepe({ root, defaultValue: projectRawBlocksForMilkdown(source) })
    crepe.editor.use(rawBlockProjectionPlugins)
    await crepe.create()
    try {
      const baseline = crepe.editor.action(getMarkdown())
      const edited = source
        .replace('const x = 1', 'const x = 2')
        .replace('x^2', 'x^3')
        .replace('y^2', 'y^3')
      crepe.editor.action(replaceAll(projectRawBlocksForMilkdown(edited), true))
      const current = crepe.editor.action(getMarkdown())

      expect(baseline).toBe(
        '```ts:line-numbers=30 {30-51}\nconst x = 1\n```\n\n```latex\n$$\nx^2\n$$\n```\n\n$$\ny^2\n$$\n'
      )
      expect(reconcileMarkdownSource(source, baseline, current)).toBe(edited)
    } finally {
      await crepe.destroy()
    }
  })
})
