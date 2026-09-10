/** @vitest-environment happy-dom */

import { describe, expect, it } from 'vitest'

import { resolveNoteAssetSrc } from '../src/client/hydrateIslands'

describe('resolveNoteAssetSrc', () => {
  it('把笔记里的相对资源解析到站点 base 下', () => {
    expect(resolveNoteAssetSrc('./assets/0002-mind.png', '/acceptance/')).toBe(
      '/acceptance/assets/0002-mind.png'
    )
    expect(resolveNoteAssetSrc('../assets/0002-mind.png', '/acceptance/')).toBe(
      '/acceptance/assets/0002-mind.png'
    )
    expect(resolveNoteAssetSrc('assets/0002-mind.png', '/acceptance/')).toBe(
      '/acceptance/assets/0002-mind.png'
    )
  })

  it('保留 query / fragment，并容忍 base 末尾缺斜杠', () => {
    expect(resolveNoteAssetSrc('./assets/x.png?w=100#frag', '/acceptance')).toBe(
      '/acceptance/assets/x.png?w=100#frag'
    )
  })

  it('默认 base 为根路径', () => {
    expect(resolveNoteAssetSrc('./assets/x.png')).toBe('/assets/x.png')
  })

  it('不改动远程、data URL 与已带 base 的绝对路径', () => {
    for (const src of [
      'https://example.com/a.png',
      'data:image/png;base64,AAAA',
      '/acceptance/assets/a.png',
      './images/a.png'
    ]) {
      expect(resolveNoteAssetSrc(src, '/acceptance/')).toBe(src)
    }
  })
})
