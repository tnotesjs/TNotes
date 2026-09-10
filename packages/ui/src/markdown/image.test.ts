import { describe, expect, it } from 'vitest'

import {
  formatImageAttrs,
  formatImageWidthAttr,
  normalizeImageAlign,
  normalizeImageWidth,
  parseImageAttrs,
  parseImageWidthAttr,
  pasteDisplayWidthPx,
  serializeImageMarkdown
} from './image'

describe('image markdown helpers', () => {
  it('accepts w and width, with or without a percent sign', () => {
    expect(parseImageWidthAttr(' {w=50%} ')).toEqual({ width: '50%', rest: '' })
    expect(parseImageWidthAttr('{width=33}')).toEqual({ width: '33%', rest: '' })
    expect(parseImageWidthAttr('not-an-attr')).toEqual({
      width: '',
      rest: 'not-an-attr'
    })
  })

  it('folds pasted bitmap width by device pixel ratio', () => {
    expect(pasteDisplayWidthPx(800, 2)).toBe('400px')
    expect(pasteDisplayWidthPx(400, 1)).toBe('400px')
    expect(pasteDisplayWidthPx(20, 2)).toBe('')
    expect(pasteDisplayWidthPx(0, 2)).toBe('')
  })

  it('accepts pixel widths from drag-resize', () => {
    expect(parseImageWidthAttr('{w=400px}')).toEqual({ width: '400px', rest: '' })
    expect(normalizeImageWidth('400px')).toBe('400px')
    expect(normalizeImageWidth('8px')).toBe('')
  })

  it('parses alignment beside width in one brace group', () => {
    expect(parseImageAttrs('{w=50% align=center}')).toEqual({
      width: '50%',
      align: 'center',
      rest: ''
    })
    expect(parseImageAttrs('{align=right}')).toEqual({
      width: '',
      align: 'right',
      rest: ''
    })
    expect(parseImageAttrs('{w=400px,align=center}')).toEqual({
      width: '400px',
      align: 'center',
      rest: ''
    })
    expect(normalizeImageAlign('middle')).toBe('center')
    expect(formatImageAttrs({ width: '400px', align: 'center' })).toBe('{w=400px align=center}')
    expect(formatImageAttrs({ align: 'left' })).toBe('')
  })

  it('rejects empty, zero, and over-wide values', () => {
    expect(normalizeImageWidth('')).toBe('')
    expect(normalizeImageWidth('0%')).toBe('')
    expect(normalizeImageWidth('120%')).toBe('')
    expect(normalizeImageWidth('auto')).toBe('')
  })

  it('serializes caption as alt and omits natural width', () => {
    expect(
      serializeImageMarkdown({
        alt: '知识库资源示意',
        src: '../assets/pixel.svg',
        width: '50%'
      })
    ).toBe('![知识库资源示意](../assets/pixel.svg) {w=50%}')
    expect(serializeImageMarkdown({ alt: '', src: '../assets/pixel.svg' })).toBe(
      '![](../assets/pixel.svg)'
    )
    expect(formatImageWidthAttr('100')).toBe('{w=100%}')
    expect(
      serializeImageMarkdown({
        alt: '',
        src: '../assets/shot.png',
        width: '400px',
        align: 'right'
      })
    ).toBe('![](../assets/shot.png) {w=400px align=right}')
  })
})
