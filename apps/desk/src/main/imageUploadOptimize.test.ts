import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import sharp from 'sharp'

import { encodeImage } from './imageEncode'
import { maybeOptimizeUploadRequest } from './imageUploadOptimize'

vi.mock('./settings', () => ({
  loadSettings: vi.fn()
}))

// Paste/upload encodes through the worker seam; keep it in-process here so the
// test stays about the optimization rules rather than worker plumbing.
vi.mock('./encodeManager', () => ({
  encodeManager: { encode: vi.fn() }
}))

import { encodeManager } from './encodeManager'
import { loadSettings } from './settings'

function optimizeSettings(
  overrides: Partial<{
    encoder: 'sharp' | 'oxipng'
    strength: 'low' | 'medium' | 'high'
    maxDimension: number | null
    outputFormat: 'keep' | 'webp' | 'jpeg'
  }> = {}
) {
  return {
    imageUpload: {
      defaultTarget: 'github' as const,
      github: {
        repository: '',
        branch: 'main',
        path: '/',
        cdnTemplate: 'https://cdn.jsdelivr.net/gh/${username}/${repository}@${branch}/${filepath}',
        fileNameFormat: '${YY}-${MM}-${DD}-${HH}-${mm}-${ss}'
      },
      optimize: {
        encoder: 'sharp' as const,
        strength: 'medium' as const,
        maxDimension: null,
        outputFormat: 'webp' as const,
        ...overrides
      }
    }
  }
}

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

describe('maybeOptimizeUploadRequest', () => {
  beforeEach(() => {
    vi.mocked(loadSettings).mockReturnValue(optimizeSettings() as never)
    vi.mocked(encodeManager.encode).mockImplementation((data, fileName, options) =>
      encodeImage(data, fileName, options)
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('re-encodes paste/upload bytes to WebP when settings ask for it', async () => {
    const data = await samplePng()
    const result = await maybeOptimizeUploadRequest({
      knowledgeBaseId: 'kb',
      noteUuid: 'note',
      fileName: 'image.png',
      data
    })
    expect(encodeManager.encode).toHaveBeenCalledTimes(1)
    expect(result.fileName).toBe('image.webp')
    expect(result.data.byteLength).toBeLessThan(data.byteLength)
    expect(result.data).not.toBe(data)
    const meta = await sharp(Buffer.from(result.data)).metadata()
    expect(meta.format).toBe('webp')
  })

  it('keeps the original payload when encode skips (GIF)', async () => {
    const data = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
    const result = await maybeOptimizeUploadRequest({
      knowledgeBaseId: 'kb',
      noteUuid: 'note',
      fileName: 'anim.gif',
      data
    })
    expect(result.fileName).toBe('anim.gif')
    expect(result.data).toBe(data)
  })

  it('leaves the extension alone for keep-format PNG that still shrinks', async () => {
    vi.mocked(loadSettings).mockReturnValue(
      optimizeSettings({ outputFormat: 'keep', strength: 'high' }) as never
    )
    const width = 120
    const height = 120
    const raw = Buffer.alloc(width * height * 3)
    for (let i = 0; i < raw.length; i++) raw[i] = (i * 37 + (i % 251)) % 256
    const data = new Uint8Array(
      await sharp(raw, { raw: { width, height, channels: 3 } })
        .png({ compressionLevel: 0 })
        .toBuffer()
    )
    const result = await maybeOptimizeUploadRequest({
      knowledgeBaseId: 'kb',
      noteUuid: 'note',
      fileName: 'noise.png',
      data
    })
    expect(result.fileName).toBe('noise.png')
    expect(result.data.byteLength).toBeLessThan(data.byteLength)
  })

  it('shrinks a large noisy screenshot to WebP without leaving the original name', async () => {
    const width = 1024
    const height = 768
    const raw = Buffer.alloc(width * height * 3)
    for (let i = 0; i < raw.length; i++) raw[i] = (i * 131 + (i % 97)) % 256
    const data = new Uint8Array(
      await sharp(raw, { raw: { width, height, channels: 3 } })
        .png({ compressionLevel: 0 })
        .toBuffer()
    )
    const result = await maybeOptimizeUploadRequest({
      knowledgeBaseId: 'kb',
      noteUuid: 'note',
      fileName: 'screenshot.png',
      data
    })
    expect(result.fileName).toBe('screenshot.webp')
    expect(result.data.byteLength).toBeLessThan(data.byteLength)
    const meta = await sharp(Buffer.from(result.data)).metadata()
    expect(meta.width).toBe(width)
    expect(meta.height).toBe(height)
  })

  it('keeps the original resolution even when settings carry a max edge', async () => {
    vi.mocked(loadSettings).mockReturnValue(
      optimizeSettings({ maxDimension: 64, outputFormat: 'keep' }) as never
    )
    const width = 256
    const height = 128
    const raw = Buffer.alloc(width * height * 3)
    for (let i = 0; i < raw.length; i++) raw[i] = (i * 37 + (i % 251)) % 256
    const data = new Uint8Array(
      await sharp(raw, { raw: { width, height, channels: 3 } })
        .png({ compressionLevel: 0 })
        .toBuffer()
    )
    const result = await maybeOptimizeUploadRequest({
      knowledgeBaseId: 'kb',
      noteUuid: 'note',
      fileName: 'big.png',
      data
    })
    const meta = await sharp(Buffer.from(result.data)).metadata()
    expect(meta.width).toBe(width)
    expect(meta.height).toBe(height)
  })
})
