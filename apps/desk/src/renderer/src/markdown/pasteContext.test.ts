import { describe, expect, it } from 'vitest'

import { stripContainerPasteContext } from './pasteContext'

/** 复制提示块内部文字时 Chromium 给我们的 HTML（属性值是转义过的）。 */
const CALLOUT_CONTEXT_HTML =
  '<meta charset=\'utf-8\'><p data-pm-slice="1 1 [&quot;deskCallout&quot;,{&quot;calloutType&quot;:&quot;danger&quot;,&quot;title&quot;:&quot;❌ ERROR&quot;,&quot;openColons&quot;:&quot;:::&quot;}]">错误块正文。</p>'

describe('stripContainerPasteContext', () => {
  it('摘掉提示块上下文，正文与 openStart/openEnd 原样保留', () => {
    const next = stripContainerPasteContext(CALLOUT_CONTEXT_HTML)
    expect(next).toContain('data-pm-slice="1 1 []"')
    expect(next).toContain('错误块正文。')
    expect(next).not.toContain('deskCallout')
  })

  it('没有 data-pm-slice 的普通 HTML 不动', () => {
    const html = '<p>普通文本</p>'
    expect(stripContainerPasteContext(html)).toBe(html)
  })

  it('context 为空（整块复制）不动：粘贴仍应是容器', () => {
    const html = '<div data-pm-slice="0 0 []"><div data-type="desk-callout">正文</div></div>'
    expect(stripContainerPasteContext(html)).toBe(html)
  })

  it('不认识的上下文（列表等）不动，交回 ProseMirror 自己处理', () => {
    const html = '<ul data-pm-slice="1 1 [&quot;bullet_list&quot;,null]"><li><p>一</p></li></ul>'
    expect(stripContainerPasteContext(html)).toBe(html)
  })

  it('保留其它上下文，只摘容器那一层', () => {
    const html =
      '<p data-pm-slice="2 2 [&quot;deskCallout&quot;,{&quot;calloutType&quot;:&quot;tip&quot;},&quot;blockquote&quot;,null]">引用里的字</p>'
    const next = stripContainerPasteContext(html)
    expect(next).toContain('2 2')
    expect(next).not.toContain('deskCallout')
    expect(next).toContain('blockquote')
  })

  it('带 -wrappers 的写法也能处理', () => {
    const html =
      '<p data-pm-slice="1 1 -1 [&quot;deskCallout&quot;,{&quot;calloutType&quot;:&quot;tip&quot;}]">x</p>'
    expect(stripContainerPasteContext(html)).toContain('data-pm-slice="1 1 -1 []"')
  })

  it('坏 JSON 不抛异常，原样返回', () => {
    const html = '<p data-pm-slice="1 1 [not-json">x</p>'
    expect(stripContainerPasteContext(html)).toBe(html)
  })
})
