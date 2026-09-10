import { describe, expect, it } from 'vitest'

import { isEmptyLatexSource, latexBackspaceAction } from './codeBlockLatexKeymap'

describe('latexBackspaceAction', () => {
  const start = { empty: true, anchor: 0 }

  it('lets CodeMirror delete a non-empty selection or a character', () => {
    expect(latexBackspaceAction(true, 'x^2', { empty: false, anchor: 0 }, 1)).toBe('pass')
    expect(latexBackspaceAction(true, 'x^2', { empty: true, anchor: 3 }, 1)).toBe('pass')
  })

  it('does not unwrap a contentful formula when the caret is at the start', () => {
    expect(latexBackspaceAction(true, 'x^2', start, 1)).toBe('swallow')
    expect(latexBackspaceAction(true, '\\begin{aligned}\n a\n\\end{aligned}', start, 1)).toBe(
      'swallow'
    )
  })

  it('deletes the formula only after the source is already empty', () => {
    expect(latexBackspaceAction(true, '', start, 1)).toBe('delete-block')
    expect(latexBackspaceAction(true, '  \n\n', start, 1)).toBe('delete-block')
  })

  it('ignores non-latex editors', () => {
    expect(latexBackspaceAction(false, '', start, 1)).toBe('pass')
  })
})

describe('isEmptyLatexSource', () => {
  it('treats whitespace-only source as empty', () => {
    expect(isEmptyLatexSource('')).toBe(true)
    expect(isEmptyLatexSource(' \n\t')).toBe(true)
    expect(isEmptyLatexSource('x')).toBe(false)
  })
})
