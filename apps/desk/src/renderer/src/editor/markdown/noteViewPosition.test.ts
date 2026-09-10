import { describe, expect, it } from 'vitest'

import { clampOffsets, clampScrollTop, clampViewPosition } from './noteViewPosition'

describe('clampOffsets', () => {
  it('keeps a caret inside the new document length', () => {
    expect(clampOffsets(12, 12, 10)).toEqual({ from: 10, to: 10 })
    expect(clampOffsets(2, 8, 20)).toEqual({ from: 2, to: 8 })
    expect(clampOffsets(-4, 99, 5)).toEqual({ from: 0, to: 5 })
  })
})

describe('clampViewPosition', () => {
  it('clamps selection and scroll independently', () => {
    expect(clampScrollTop(80, 50)).toBe(50)
    expect(clampScrollTop(-4, 50)).toBe(0)
    expect(clampViewPosition({ from: 12, to: 40, scrollTop: 99 }, 10, 20)).toEqual({
      from: 10,
      to: 10,
      scrollTop: 20
    })
  })
})
