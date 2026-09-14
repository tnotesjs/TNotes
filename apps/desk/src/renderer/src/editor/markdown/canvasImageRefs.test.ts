import { describe, expect, it } from 'vitest'

import {
  canvasSvgRefsInHtml,
  canvasSvgRefsInText,
  mergeCanvasRefs,
  needsCanvasCopy,
  ownerIndexFromRelPath,
  sourceRelPathForSvg
} from './canvasImageRefs'

/** 笔记在 notes/ 下，资源在 assets/ 下：相对路径就是 ../assets/... */
const resolve = (rawPath: string): string | null =>
  rawPath.startsWith('../assets/') ? rawPath.slice(3) : null

describe('从 markdown 文本里挑画布引用', () => {
  it('只认 .svg，并解析出同名源画布', () => {
    const refs = canvasSvgRefsInText('![画布](../assets/0013-x.svg)', resolve)
    expect(refs).toEqual([
      {
        rawPath: '../assets/0013-x.svg',
        svgRelPath: 'assets/0013-x.svg',
        sourceRelPath: 'assets/0013-x.excalidraw',
        alt: '画布',
        width: '',
        align: 'left'
      }
    ])
  })

  it('普通图片（png / jpg / 带别的后缀）一律不返回', () => {
    const text = [
      '![图](../assets/0013-x.png)',
      '![图](../assets/0013-y.jpg)',
      '![图](https://example.com/a.svg)'
    ].join('\n')
    expect(canvasSvgRefsInText(text, resolve)).toEqual([])
  })

  it('保留描述与 {w= / align=} 属性', () => {
    const refs = canvasSvgRefsInText('![流程图](../assets/0042-y.svg){w=50% align=right}', resolve)
    expect(refs[0]).toMatchObject({ alt: '流程图', width: '50%', align: 'right' })
  })

  it('一段话里多张图都能挑出来，解析不出的跳过', () => {
    const text = [
      '前情提要 ![a](../assets/0001-a.svg) 与 ![b](./assets/0002-b.svg)',
      '![坏的](notes/0003-c.svg)'
    ].join('\n')
    expect(canvasSvgRefsInText(text, resolve).map((ref) => ref.svgRelPath)).toEqual([
      'assets/0001-a.svg'
    ])
  })
})

describe('要不要复制一份', () => {
  const ref = (svgRelPath: string) => ({
    rawPath: `../${svgRelPath}`,
    svgRelPath,
    sourceRelPath: sourceRelPathForSvg(svgRelPath),
    alt: '',
    width: '',
    align: 'left'
  })

  it('来源编号 ≠ 目标编号 → 复制（引用的资源不共享）', () => {
    expect(needsCanvasCopy(ref('assets/0013-x.svg'), '0042')).toBe(true)
  })

  it('同编号 → 不复制（还是同一张画布）', () => {
    expect(needsCanvasCopy(ref('assets/0042-x.svg'), '0042')).toBe(false)
  })

  it('缺前缀 / 目标笔记没有编号 → 不复制，保留原引用', () => {
    expect(needsCanvasCopy(ref('assets/plain.svg'), '0042')).toBe(false)
    expect(needsCanvasCopy(ref('assets/0013-x.svg'), '')).toBe(false)
    expect(needsCanvasCopy(ref('assets/0013-x.svg'), '42')).toBe(false)
  })
})

describe('路径与归属', () => {
  it('svg → excalidraw 只换后缀', () => {
    expect(sourceRelPathForSvg('assets/0013-a-b.svg')).toBe('assets/0013-a-b.excalidraw')
  })

  it('只有四位前缀才算归属', () => {
    expect(ownerIndexFromRelPath('assets/0013-x.svg')).toBe('0013')
    expect(ownerIndexFromRelPath('assets/13-x.svg')).toBeNull()
    expect(ownerIndexFromRelPath('assets/x-0013.svg')).toBeNull()
  })
})

describe('富文本剪贴板（同 App 内复制图片节点）', () => {
  const resolve = (rawPath: string): string | null =>
    rawPath.startsWith('assets/') ? rawPath : null

  it('从 tnotes-asset:// 的 path 参数里认出画布引用', () => {
    const html =
      '<p><img src="tnotes-asset://asset?knowledgeBaseId=kb&amp;noteUuid=n&amp;path=assets%2F0013-x.svg" alt="画布"></p>'
    const refs = canvasSvgRefsInHtml(html, resolve)
    expect(refs.map((ref) => ref.svgRelPath)).toEqual(['assets/0013-x.svg'])
    expect(refs[0]?.alt).toBe('画布')
    expect(refs[0]?.sourceRelPath).toBe('assets/0013-x.excalidraw')
  })

  it('普通图片（png）与不带 path 的引用一律忽略', () => {
    const html =
      '<img src="tnotes-asset://asset?path=assets%2F0013-x.png"><img src="https://example.com/a.svg">'
    expect(canvasSvgRefsInHtml(html, resolve)).toEqual([])
  })

  it('同一张图出现多次只算一条', () => {
    const html =
      '<img src="tnotes-asset://asset?path=assets%2F0013-x.svg"><img src="tnotes-asset://asset?path=assets%2F0013-x.svg">'
    expect(canvasSvgRefsInHtml(html, resolve)).toHaveLength(1)
  })

  it('合并两条来源时按 KB 路径去重，保留带 alt 的那条', () => {
    const fromText = canvasSvgRefsInText('![画布](../assets/0013-x.svg)', (raw) =>
      raw.startsWith('../') ? raw.slice(3) : null
    )
    const fromHtml = canvasSvgRefsInHtml(
      '<img src="tnotes-asset://asset?path=assets%2F0013-x.svg" alt="画布">',
      resolve
    )
    const merged = mergeCanvasRefs(fromText, fromHtml)
    expect(merged).toHaveLength(1)
    expect(merged[0]?.alt).toBe('画布')
    expect(merged[0]?.rawPath).toBe('../assets/0013-x.svg')
  })
})

describe('Desk 图片视图的剪贴板属性', () => {
  it('优先认 figure/img 上的 data-tn-src（笔记相对路径）', () => {
    const html =
      '<figure class="tn-image" data-tn-src="../assets/0013-x.svg"><img src="tnotes-asset://asset?path=assets%2F0013-x.svg" alt="画布"></figure>'
    const refs = canvasSvgRefsInHtml(html, (raw) =>
      raw.startsWith('../assets/') ? raw.slice(3) : null
    )
    expect(refs).toHaveLength(1)
    expect(refs[0]).toMatchObject({
      svgRelPath: 'assets/0013-x.svg',
      sourceRelPath: 'assets/0013-x.excalidraw',
      alt: '画布'
    })
  })

  it('data-tn-src 指向普通图片时不返回', () => {
    const html = '<figure data-tn-src="../assets/0013-x.png"></figure>'
    expect(canvasSvgRefsInHtml(html, () => null)).toEqual([])
  })
})
