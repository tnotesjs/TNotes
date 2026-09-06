// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest'

import { pastedImageMarkdown, resolvePastedImageWidth } from './pasteImageWidth'

describe('paste image width', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('writes logical CSS pixels from the bitmap and device pixel ratio', async () => {
    Object.defineProperty(globalThis, 'devicePixelRatio', { configurable: true, value: 2 })
    Object.defineProperty(globalThis, 'createImageBitmap', {
      configurable: true,
      value: vi.fn(async () => ({ width: 800, height: 600, close: vi.fn() }))
    })
    const file = new File([new Uint8Array([1, 2, 3])], 'shot.png', { type: 'image/png' })

    expect(await resolvePastedImageWidth(file)).toBe('400px')
    expect(await pastedImageMarkdown(file, '../assets/shot.png')).toBe(
      '![](../assets/shot.png) {w=400px}'
    )
  })

  it('omits width when the image size cannot be read', async () => {
    vi.stubGlobal(
      'createImageBitmap',
      vi.fn(async () => {
        throw new Error('unsupported')
      })
    )
    vi.stubGlobal(
      'Image',
      class {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        set src(_value: string) {
          queueMicrotask(() => this.onerror?.())
        }
      }
    )
    const file = new File([new Uint8Array([1])], 'bad.png', { type: 'image/png' })

    expect(await resolvePastedImageWidth(file, 2)).toBe('')
    expect(await pastedImageMarkdown(file, '../assets/bad.png')).toBe('![](../assets/bad.png)')
  })
})
