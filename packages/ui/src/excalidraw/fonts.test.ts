import { describe, expect, it, vi } from 'vitest'

import {
  getExcalidrawAssetPath,
  inlineExcalidrawFonts,
  resolveFontUrl,
  setExcalidrawAssetPath
} from './fonts'

const SVG = `<svg><style>@font-face{src:url(https://esm.sh/@excalidraw/excalidraw@0.18.1/dist/prod/fonts/Virgil/Virgil-Regular.woff2)}</style></svg>`

function fetchReturning(bytes: number[], ok = true) {
  return vi.fn(async () => ({
    ok,
    status: ok ? 200 : 404,
    arrayBuffer: async () => new Uint8Array(bytes).buffer
  })) as unknown as typeof fetch
}

describe('画布字体自包含', () => {
  it('把字体基址换成配置的本地目录', () => {
    expect(
      resolveFontUrl(
        'https://esm.sh/@excalidraw/excalidraw@0.18.1/dist/prod/fonts/Virgil/Virgil-Regular.woff2',
        '/excalidraw/'
      )
    ).toBe('/excalidraw/fonts/Virgil/Virgil-Regular.woff2')
    expect(resolveFontUrl('/fonts/Virgil/x.woff2')).toBe('/fonts/Virgil/x.woff2')
  })

  it('把 SVG 里的字体内联成 data URL，不再有外链', async () => {
    const result = await inlineExcalidrawFonts(SVG, {
      base: '/excalidraw/',
      fetchImpl: fetchReturning([1, 2, 3, 4])
    })

    expect(result.inlined).toBe(1)
    expect(result.remaining).toEqual([])
    expect(result.svg).toContain('data:font/woff2;base64,')
    expect(result.svg).not.toContain('esm.sh')
  })

  it('取不到字体时如实报告 remaining，不静默失败', async () => {
    const result = await inlineExcalidrawFonts(SVG, {
      base: '/excalidraw/',
      fetchImpl: fetchReturning([], false)
    })

    expect(result.inlined).toBe(0)
    expect(result.remaining).toEqual(['/excalidraw/fonts/Virgil/Virgil-Regular.woff2'])
    expect(result.svg).toBe(SVG)
  })

  it('没有字体引用时不做任何事', async () => {
    const result = await inlineExcalidrawFonts('<svg></svg>', {
      fetchImpl: fetchReturning([1])
    })
    expect(result.inlined).toBe(0)
    expect(result.remaining).toEqual([])
  })

  it('资产基址可设置与读取（离线必需）', () => {
    setExcalidrawAssetPath('/excalidraw/')
    expect(getExcalidrawAssetPath()).toBe('/excalidraw/')
  })
})
