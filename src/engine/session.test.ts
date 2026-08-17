import { beforeEach, describe, expect, it } from 'vitest'
import { resetNodeIdCounter } from './model/document'
import { MindmapSession } from './session'

beforeEach(() => resetNodeIdCounter())

function makeSession() {
  return new MindmapSession({ markdown: '# T\n\n- a\n  - a1\n- b\n', fileName: 't.tn-mindmap.md' })
}

describe('MindmapSession', () => {
  it('编辑操作触发 change 并可撤销', () => {
    const s = makeSession()
    const changes: string[] = []
    s.on('change', (md) => changes.push(md))
    const a = s.document.root.children[0]
    s.updateNodeRaw(a.children[0].id, 'a1-updated')
    expect(s.getMarkdown()).toContain('a1-updated')
    expect(changes.length).toBe(1)
    s.undo()
    expect(s.getMarkdown()).not.toContain('a1-updated')
    s.redo()
    expect(s.getMarkdown()).toContain('a1-updated')
  })

  it('transact 把多个操作合并为一条历史', () => {
    const s = makeSession()
    let changes = 0
    s.on('change', () => changes++)
    const a = s.document.root.children[0]
    const a1 = a.children[0]
    // 模拟 Enter 分裂：a1 → a1-前 + 新兄弟 a1-后
    s.transact((doc) => {
      doc.updateRaw(a1, '前半')
      doc.insertAfter(a1, '后半')
    })
    expect(changes).toBe(1)
    expect(s.getMarkdown()).toContain('- 前半')
    expect(s.getMarkdown()).toContain('- 后半')
    s.undo()
    expect(s.getMarkdown()).toContain('- a1')
    expect(s.getMarkdown()).not.toContain('前半')
  })

  it('insertBeforeOf 在指定节点之前插入同级；根节点返回 null', () => {
    const s = makeSession()
    const b = s.document.root.children[1]
    const created = s.insertBeforeOf(b.id)!
    expect(created).not.toBeNull()
    expect(s.document.root.children.map((n) => n.content.text)).toEqual(['a', '', 'b'])
    expect(s.insertBeforeOf(s.document.root.id)).toBeNull()
  })

  it('toggleCollapse 不进历史但广播 collapseChange', () => {
    const s = makeSession()
    let collapseEvents = 0
    s.on('collapseChange', () => collapseEvents++)
    const a = s.document.root.children[0]
    s.toggleCollapse(a.id)
    expect(a.collapsed).toBe(true)
    expect(collapseEvents).toBe(1)
    expect(s.canUndo).toBe(false)
  })

  it('focusNode / exitFocusTo 维护聚焦路径并广播', () => {
    const s = makeSession()
    const paths: string[][] = []
    s.on('focusChange', (titles) => paths.push(titles))
    const a = s.document.root.children[0]
    const a1 = a.children[0]
    s.focusNode(a.id)
    s.focusNode(a1.id)
    expect(s.focusRootNode).toBe(a1)
    s.exitFocusTo(1)
    expect(s.focusRootNode).toBe(a)
    expect(paths).toEqual([['a'], ['a', 'a1'], ['a']])
  })

  it('setMarkdown 清空历史并重置聚焦', () => {
    const s = makeSession()
    const a = s.document.root.children[0]
    s.focusNode(a.id)
    s.updateNodeRaw(a.id, 'a-new')
    s.setMarkdown('# X\n\n- y\n')
    expect(s.document.root.content.text).toBe('X')
    expect(s.canUndo).toBe(false)
    expect(s.focusPath).toEqual([])
  })

  it('expandAncestors 展开祖先折叠并广播', () => {
    const s = makeSession()
    const a = s.document.root.children[0]
    s.toggleCollapse(a.id)
    let events = 0
    s.on('collapseChange', () => events++)
    s.expandAncestors(a.children[0].id)
    // a 是目标节点的祖先且已折叠 → 展开一次
    expect(a.collapsed).toBe(false)
    expect(events).toBe(1)
  })
})
