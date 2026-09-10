import { describe, expect, it } from 'vitest'
import sharp from 'sharp'

import { encodeImage, outputRelPath } from './imageEncode'

async function samplePng(): Promise<Uint8Array> {
  return new Uint8Array(
    await sharp({
      create: {
        width: 64,
        height: 64,
        channels: 4,
        background: { r: 20, g: 80, b: 200, alpha: 1 }
      }
    })
      .png()
      .toBuffer()
  )
}

async function noisyPng(): Promise<Uint8Array> {
  const width = 160
  const height = 160
  const raw = Buffer.alloc(width * height * 3)
  for (let i = 0; i < raw.length; i++) raw[i] = (i * 37 + (i % 251)) % 256
  return new Uint8Array(
    await sharp(raw, { raw: { width, height, channels: 3 } })
      .png({ compressionLevel: 0 })
      .toBuffer()
  )
}

describe('encodeImage (sharp, lossy)', () => {
  it('shrinks a PNG via WebP and labels the result lossy', async () => {
    const input = await samplePng()
    const result = await encodeImage(input, 'shot.png', {
      quality: 80,
      maxDimension: null,
      outputFormat: 'webp'
    })
    expect(result.skipped).toBeUndefined()
    expect(result.lossy).toBe(true)
    expect(result.encoder).toBe('sharp')
    expect(result.outputExt).toBe('.webp')
    expect(result.bytesAfter).toBeLessThan(result.bytesBefore)
    expect(result.output?.byteLength).toBe(result.bytesAfter)
  })

  it('shrinks a noisy PNG in-place with the keep path', async () => {
    const input = await noisyPng()
    const result = await encodeImage(input, 'noise.png', {
      quality: 80,
      maxDimension: null,
      outputFormat: 'keep'
    })
    expect(result.skipped).toBeUndefined()
    expect(result.lossy).toBe(true)
    expect(result.outputExt).toBe('.png')
    expect(result.bytesAfter).toBeLessThan(result.bytesBefore)
  })

  it('skips GIF and SVG without writing', async () => {
    const gif = await encodeImage(new Uint8Array([0, 1, 2]), 'a.gif', {
      quality: 80,
      maxDimension: null,
      outputFormat: 'keep'
    })
    expect(gif.skipped).toMatch(/GIF/)
    const svg = await encodeImage(new Uint8Array([0, 1, 2]), 'a.svg', {
      quality: 80,
      maxDimension: null,
      outputFormat: 'keep'
    })
    expect(svg.skipped).toMatch(/矢量/)
  })

  it('refuses transparent PNG → JPEG without a background', async () => {
    const png = new Uint8Array(
      await sharp({
        create: {
          width: 16,
          height: 16,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      })
        .png()
        .toBuffer()
    )
    const result = await encodeImage(png, 'alpha.png', {
      quality: 80,
      maxDimension: null,
      outputFormat: 'jpeg'
    })
    expect(result.skipped).toMatch(/背景色/)
  })

  it('maps converted extensions onto the original path', () => {
    expect(outputRelPath('assets/0001-a.png', '.webp')).toBe('assets/0001-a.webp')
    expect(outputRelPath('assets/0001-a.png', '.png')).toBe('assets/0001-a.png')
  })

  it('returns skipped for corrupt bytes', async () => {
    const result = await encodeImage(new Uint8Array([1, 2, 3, 4, 5]), 'broken.png', {
      quality: 80,
      maxDimension: null,
      outputFormat: 'keep'
    })
    expect(result.skipped).toBeTruthy()
  })
})

describe('encodeImage (oxipng, lossless)', () => {
  it('optimises a PNG and labels the result lossless', async () => {
    const input = await noisyPng()
    const result = await encodeImage(input, 'noise.png', {
      encoder: 'oxipng',
      oxipngLevel: 2,
      quality: 80,
      maxDimension: null,
      outputFormat: 'keep'
    })
    expect(result.skipped).toBeUndefined()
    expect(result.lossy).toBe(false)
    expect(result.encoder).toBe('oxipng')
    expect(await sharp(Buffer.from(result.output!)).ensureAlpha().raw().toBuffer()).toEqual(
      await sharp(Buffer.from(input)).ensureAlpha().raw().toBuffer()
    )
    expect(result.outputExt).toBe('.png')
    expect(result.bytesAfter).toBeLessThan(result.bytesBefore)
    expect(result.output?.byteLength).toBe(result.bytesAfter)
  })

  it('trusts the bytes, not the extension, and skips non-PNG input', async () => {
    const jpeg = new Uint8Array(
      await sharp({ create: { width: 8, height: 8, channels: 3, background: '#123456' } })
        .jpeg()
        .toBuffer()
    )
    const result = await encodeImage(jpeg, 'liar.png', {
      encoder: 'oxipng',
      oxipngLevel: 2,
      quality: 80,
      maxDimension: null,
      outputFormat: 'keep'
    })
    expect(result.skipped).toMatch(/仅支持 PNG/)
  })

  it('skips when a format conversion is requested', async () => {
    const input = await noisyPng()
    const result = await encodeImage(input, 'noise.png', {
      encoder: 'oxipng',
      oxipngLevel: 2,
      quality: 80,
      maxDimension: null,
      outputFormat: 'webp'
    })
    expect(result.skipped).toMatch(/不支持转码/)
  })
})
