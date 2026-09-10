import { describe, expect, it } from 'vitest'

import {
  OPTIMIZE_STRENGTH_PRESETS,
  strengthFromLegacyOxipngLevel,
  strengthFromLegacyQuality,
  toEncodeImageOptions
} from './optimizeStrength'

describe('optimizeStrength', () => {
  it('maps low/medium/high to sharp quality and oxipng level', () => {
    expect(OPTIMIZE_STRENGTH_PRESETS.low).toEqual({ quality: 90, oxipngLevel: 1 })
    expect(OPTIMIZE_STRENGTH_PRESETS.medium).toEqual({ quality: 80, oxipngLevel: 2 })
    expect(OPTIMIZE_STRENGTH_PRESETS.high).toEqual({ quality: 60, oxipngLevel: 4 })
  })

  it('migrates legacy quality and oxipng level into strength tiers', () => {
    expect(strengthFromLegacyQuality(90)).toBe('low')
    expect(strengthFromLegacyQuality(80)).toBe('medium')
    expect(strengthFromLegacyQuality(60)).toBe('high')
    expect(strengthFromLegacyOxipngLevel(1)).toBe('low')
    expect(strengthFromLegacyOxipngLevel(2)).toBe('medium')
    expect(strengthFromLegacyOxipngLevel(5)).toBe('high')
  })

  it('expands settings into encode options', () => {
    expect(
      toEncodeImageOptions({
        encoder: 'sharp',
        strength: 'high',
        maxDimension: 1280,
        outputFormat: 'webp'
      })
    ).toEqual({
      encoder: 'sharp',
      quality: 60,
      maxDimension: 1280,
      outputFormat: 'webp',
      oxipngLevel: 4
    })
  })
})
