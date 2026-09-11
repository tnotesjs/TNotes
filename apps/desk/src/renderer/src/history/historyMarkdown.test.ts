// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'

import { createHistoryCommitContext } from './commitContext'
import { renderHistoryMarkdown } from './historyMarkdown'

const COMMIT = 'a'.repeat(40)
const PNG_OID = 'b'.repeat(40)
const CANVAS_OID = 'c'.repeat(40)

const context = createHistoryCommitContext({
  knowledgeBaseId: 'kb',
  commit: COMMIT,
  noteRelPath: 'notes/0042. 笔记/0042. 笔记.md',
  entries: [
    { relPath: 'assets/0042-old.png', oid: PNG_OID },
    { relPath: 'assets/0042-drawing.excalidraw', oid: CANVAS_OID },
    { relPath: 'notes/0042. 笔记/0043. 兄弟.md', oid: 'd'.repeat(40) }
  ]
})

function render(source: string) {
  return renderHistoryMarkdown(source, context)
}

/** 用 DOM 解析返回的 HTML，避免手工解码 `&amp;`。 */
function dom(html: string): HTMLElement {
  const host = document.createElement('div')
  host.innerHTML = html
  return host
}

describe('历史正文只读渲染', () => {
  it('历史图片指向 commit 内 blob，并带 OID 标记', () => {
    const result = render('![旧图](../../assets/0042-old.png)\n')
    expect(result.diagnostics).toEqual([])
    expect(result.html).toContain('tnotes-asset://history?')
    expect(result.html).toContain(`data-tn-history-oid="${PNG_OID}"`)
    const url = new URL(dom(result.html).querySelector('img')!.getAttribute('src')!)
    expect(url.searchParams.get('commit')).toBe(COMMIT)
    expect(url.searchParams.get('path')).toBe('assets/0042-old.png')
  })

  it('历史里已删除的图片不回退当前磁盘，改报缺失', () => {
    const result = render('![x](../../assets/0042-gone.png)\n')
    expect(result.html).not.toContain('tnotes-asset://asset')
    expect(result.html).toContain('data-tn-history-skip="missing"')
    expect(result.diagnostics.map((item) => item.code)).toContain('missing-resource')
  })

  it('远程图片标记为当前网络内容而不是历史归档', () => {
    const result = render('![x](https://example.com/live.png)\n')
    expect(result.html).toContain('data-tn-history-skip="remote"')
    expect(result.diagnostics[0]?.message).toContain('远程')
  })

  it('不执行历史文件里的 script/iframe，按源码占位', () => {
    const result = render(
      [
        '# 标题',
        '',
        '<script>window.__pwned = 1</script>',
        '',
        '<iframe src="https://x.test"></iframe>',
        ''
      ].join('\n')
    )
    expect(result.html).not.toContain('<script')
    expect(result.html).not.toContain('<iframe')
    expect((globalThis as { __pwned?: number }).__pwned).toBeUndefined()
    expect(result.diagnostics.filter((item) => item.code === 'blocked-script')).toHaveLength(2)
    expect(result.html).toContain('data-tn-history-unsupported')
  })

  it('不允许历史文件里的自定义组件偷读当前知识库', () => {
    const result = render('<NotesTable noteUuid="x" />\n')
    expect(result.html).not.toContain('<NotesTable')
    expect(result.diagnostics.map((item) => item.code)).toContain('unsupported-component')
    expect(result.html).toContain('data-tn-history-unsupported')
  })

  it('历史画布输出仅在 commit 内可按需挂载的占位', () => {
    const result = render(
      '<Excalidraw path="../../assets/0042-drawing.excalidraw" height="360" />\n'
    )
    const mount = result.mounts.find((item) => item.kind === 'excalidraw')
    expect(mount).toMatchObject({ relPath: 'assets/0042-drawing.excalidraw', height: 360 })
    expect(mount?.url).toContain(`commit=${COMMIT}`)
    expect(result.html).toContain(`data-tn-history-mount="${mount?.id}"`)
    // 正文里不能出现可编辑画布或写回入口
    expect(result.html).not.toContain('contenteditable')
  })

  it('历史里不存在的画布只给占位与原因', () => {
    const result = render('<Excalidraw path="../../assets/0042-gone.excalidraw" />\n')
    const mount = result.mounts.find((item) => item.kind === 'excalidraw')
    expect(mount?.url).toBe('')
    expect(mount?.missingReason).toContain('0042-gone.excalidraw')
    expect(result.html).toContain('data-missing')
  })

  it('Mermaid 只在挂载数据里保留源码，不进 DOM 属性', () => {
    const result = render('```mermaid\ngraph TD\nA-->B\n```\n')
    const mount = result.mounts.find((item) => item.kind === 'mermaid')
    expect(mount?.text.trim()).toBe('graph TD\nA-->B')
    expect(result.html).toContain('data-tn-history-mermaid')
    expect(result.html).not.toContain('A-->B')
  })

  it('相对链接带同一 commit 的路径标记，不指向当前磁盘', () => {
    // 目标里的空格按 CommonMark 必须编码；解析后要解码再查快照
    const result = render('[兄弟笔记](./0043.%20兄弟.md)\n')
    const anchor = dom(result.html).querySelector('a')!
    expect(anchor.getAttribute('data-tn-history-link')).toBe('notes/0042. 笔记/0043. 兄弟.md')
    expect(anchor.getAttribute('href')).toBeNull()
  })

  it('编码过的中文/空格图片路径仍能命中同一 commit 的资源', () => {
    const result = render('![图](<../../assets/0042-%E5%9B%BE%20(1).png>)\n')
    // 该提交里没有这张图 —— 关键是报「缺失」而不是回退当前磁盘
    expect(result.html).not.toContain('tnotes-asset://asset')
    expect(result.diagnostics.map((item) => item.code)).toContain('missing-resource')
    expect(result.diagnostics[0]?.message).toContain('0042-图 (1).png')
  })

  it('链接目标缺失时去掉 href 并给诊断', () => {
    const result = render('[没了](./0099.%20缺失.md)\n')
    expect(result.html).not.toContain('href=')
    expect(result.diagnostics.map((item) => item.code)).toContain('missing-resource')
  })

  it('去掉 frontmatter，正文里的水平线保留', () => {
    const result = render('---\nid: uuid-1\ntitle: x\n---\n\n# 标题\n\n正文\n\n---\n\n后段\n')
    expect(result.html).not.toContain('uuid-1')
    expect(result.html).toContain('标题')
    expect(result.html).toContain('<hr>')
  })

  it('普通 Markdown、表格与任务列表仍按只读方式渲染', () => {
    const result = render('- [x] 完成\n- [ ] 未完成\n\n| a | b |\n| - | - |\n| 1 | 2 |\n')
    expect(result.html).toContain('<table>')
    expect(result.html).toContain('type="checkbox"')
    expect(result.html).not.toContain('contenteditable')
  })
})
