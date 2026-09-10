/**
 * User-facing compression strength → encoder knobs.
 * 低 = less compression (clearer / faster lossless);
 * 高 = more compression (smaller / slower lossless).
 */

import type { EncodeImageOptions } from './imageEncode'
import type {
  AssetOptimizeEncoder,
  AssetOptimizeOutputFormat,
  AssetOptimizeSettings,
  AssetOptimizeStrength
} from '../shared/contracts'

export const OPTIMIZE_STRENGTH_PRESETS: Record<
  AssetOptimizeStrength,
  { quality: number; oxipngLevel: number }
> = {
  low: { quality: 90, oxipngLevel: 1 },
  medium: { quality: 80, oxipngLevel: 2 },
  high: { quality: 60, oxipngLevel: 4 }
}

export function strengthFromLegacyQuality(quality: number): AssetOptimizeStrength {
  if (quality >= 85) return 'low'
  if (quality <= 70) return 'high'
  return 'medium'
}

export function strengthFromLegacyOxipngLevel(level: number): AssetOptimizeStrength {
  if (level <= 1) return 'low'
  if (level >= 4) return 'high'
  return 'medium'
}

export function toEncodeImageOptions(
  settings: Pick<
    AssetOptimizeSettings,
    'encoder' | 'strength' | 'maxDimension' | 'outputFormat'
  > & { encoder?: AssetOptimizeEncoder; outputFormat?: AssetOptimizeOutputFormat }
): EncodeImageOptions {
  const preset = OPTIMIZE_STRENGTH_PRESETS[settings.strength]
  return {
    encoder: settings.encoder,
    quality: preset.quality,
    maxDimension: settings.maxDimension,
    outputFormat: settings.outputFormat,
    oxipngLevel: preset.oxipngLevel
  }
}
