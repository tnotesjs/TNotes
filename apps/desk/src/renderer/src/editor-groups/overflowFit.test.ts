import { describe, expect, it } from 'vitest'

import { computeVisibleCount } from './overflowFit'

describe('computeVisibleCount', () => {
  it('keeps every item when they fit without a more button', () => {
    expect(computeVisibleCount(168, [32, 32, 32, 32, 32], 2, 32)).toBe(5)
  })

  it('hides trailing items and reserves the more button', () => {
    // 3×32 + 2 gaps + more + gap = 96 + 4 + 32 + 2 = 134
    expect(computeVisibleCount(134, [32, 32, 32, 32, 32], 2, 32)).toBe(3)
    expect(computeVisibleCount(133, [32, 32, 32, 32, 32], 2, 32)).toBe(2)
  })

  it('returns 0 when even the first item plus more does not fit', () => {
    expect(computeVisibleCount(40, [32, 32, 32], 2, 32)).toBe(0)
  })

  it('keeps a single item when it fits beside the more button', () => {
    expect(computeVisibleCount(66, [32, 32, 32], 2, 32)).toBe(1)
  })

  it('returns 0 for empty input or no available width', () => {
    expect(computeVisibleCount(200, [], 2, 32)).toBe(0)
    expect(computeVisibleCount(0, [32, 32], 2, 32)).toBe(0)
  })
})
