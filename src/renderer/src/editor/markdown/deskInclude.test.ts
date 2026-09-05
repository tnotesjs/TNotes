import { describe, expect, it } from 'vitest'

import {
  parseCodeGroupEntries,
  serializeCodeGroupEntries,
  withCodeGroupEntryHighlights,
  withCodeGroupEntryLanguage,
  withCodeGroupEntryTitle
} from './deskInclude'

describe('code-group entries', () => {
  it('parses inline fences in order', () => {
    const body = [
      '```js [a.js]',
      'const a = 1',
      '```',
      '',
      '```ts [b.ts]',
      'export const b = 2',
      '```'
    ].join('\n')
    const entries = parseCodeGroupEntries(body)
    expect(entries.map((entry) => entry.kind)).toEqual(['fence', 'fence'])
    expect(entries[0]).toMatchObject({
      kind: 'fence',
      filename: 'a.js',
      lang: 'js',
      code: 'const a = 1',
      highlights: ''
    })
    const serialized = serializeCodeGroupEntries(entries)
    expect(serialized).toContain('```js [a.js]')
    expect(serialized).toContain('const a = 1')
    expect(serialized).toContain('```ts [b.ts]')
  })

  it('ignores legacy <<< include lines (syntax removed)', () => {
    const body = ['<<< ./demos/17/1.js', '', '```js [inline.js]', 'const x = 1', '```'].join('\n')
    const entries = parseCodeGroupEntries(body)
    expect(entries.map((entry) => entry.kind)).toEqual(['fence'])
  })

  it('parses and rewrites fence highlight ranges', () => {
    const entries = parseCodeGroupEntries('```js {1,2,3} [demo]\nconst a = 1\n```\n')
    expect(entries[0]).toMatchObject({
      kind: 'fence',
      filename: 'demo',
      highlights: '{1-3}'
    })
    const updated = withCodeGroupEntryHighlights(entries[0]!, '{1,4}')
    expect(updated).toMatchObject({
      kind: 'fence',
      highlights: '{1,4}',
      info: 'js {1,4} [demo]'
    })
  })

  it('updates title and language on fence entries', () => {
    const fence: ReturnType<typeof parseCodeGroupEntries>[number] = {
      kind: 'fence',
      filename: '1',
      lang: 'js',
      info: 'js [1]',
      code: 'const a = 1',
      highlights: ''
    }
    expect(withCodeGroupEntryTitle(fence, 'alpha')).toMatchObject({
      filename: 'alpha',
      info: 'js [alpha]'
    })
    expect(withCodeGroupEntryLanguage(fence, 'ts')).toMatchObject({
      lang: 'ts',
      info: 'ts [1]'
    })
  })
})
