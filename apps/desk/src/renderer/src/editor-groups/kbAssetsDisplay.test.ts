import { describe, expect, it } from 'vitest'

import type { AssetRecordDto } from '../../../shared/contracts'
import {
  assetThumbSrc,
  canPreviewAsset,
  canPreviewThumb,
  formatBytes,
  kindBadge,
  kindLabel,
  protectionLabel,
  statusLabel
} from './kbAssetsDisplay'

function asset(kind: string): AssetRecordDto {
  return {
    relPath: `assets/x.${kind}`,
    name: `x.${kind}`,
    size: 1,
    mtimeMs: 0,
    kind,
    status: 'referenced',
    references: [],
    protection: [],
    renameAllowed: true
  }
}

describe('kbAssetsDisplay', () => {
  it('按量级格式化体积', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(1023)).toBe('1023 B')
    expect(formatBytes(1024)).toBe('1.0 KB')
    expect(formatBytes(1024 * 1024)).toBe('1.0 MB')
  })

  it('标签覆盖已知取值，未知值原样返回', () => {
    expect(kindLabel('svg')).toBe('SVG')
    expect(kindLabel('excalidraw')).toBe('Excalidraw')
    expect(kindLabel('unknown')).toBe('其他')
    expect(statusLabel('idle-candidate')).toBe('疑似闲置')
    expect(statusLabel('weird')).toBe('weird')
    expect(protectionLabel('kb-icon')).toBe('知识库图标')
    expect(protectionLabel('other')).toBe('other')
    expect(kindBadge('image')).toBe('图')
  })

  it('位图可做缩略图；详情与网格允许用 <img> 安全预览 SVG', () => {
    expect(canPreviewThumb(asset('image'))).toBe(true)
    expect(canPreviewThumb(asset('gif'))).toBe(true)
    expect(canPreviewThumb(asset('svg'))).toBe(false)
    expect(canPreviewAsset(asset('svg'))).toBe(true)
    expect(canPreviewAsset(asset('html'))).toBe(false)
    expect(canPreviewAsset(asset('excalidraw'))).toBe(false)
  })

  it('缩略图 URL 带知识库、路径与缓存失效版本', () => {
    const url = assetThumbSrc('kb-a', 'assets/图 1.png', 7)
    expect(url.startsWith('tnotes-asset://asset?')).toBe(true)
    const params = new URLSearchParams(url.slice('tnotes-asset://asset?'.length))
    expect(params.get('knowledgeBaseId')).toBe('kb-a')
    expect(params.get('path')).toBe('assets/图 1.png')
    expect(params.get('v')).toBe('7')
  })
})
