import { describe, expect, it } from 'vitest'
import { assetRelativePath, createAssetFileName, extensionForMime, referencedAssetPaths } from './assets'

describe('VSCode 图片资源', () => {
  it('根据 MIME 生成稳定且安全的 assets 路径', () => {
    const name = createAssetFileName('image/jpeg', new Date('2026-08-20T12:34:56.000Z'), 0.5)
    expect(name).toBe('image-20260820-123456Z-7fffff.jpg')
    expect(assetRelativePath('../不安全 name.jpg')).toBe('assets/----name.jpg')
    expect(extensionForMime('image/unknown')).toBe('png')
  })

  it('只提取受支持的相对 assets 图片引用并去重', () => {
    const md = '# demo\n- ![a](assets/a.png)\n- ![b](https://example.com/b.png)\n- ![a](assets/a.png)\n'
    expect(referencedAssetPaths(md)).toEqual(['assets/a.png'])
  })
})
