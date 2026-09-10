import { describe, expect, it } from 'vitest'
import { MindmapSession } from '@tnotesjs/mindmap-core'
import { pasteCanvasOutline } from './canvasClipboard'

describe('pasteCanvasOutline', () => {
  it('把 Markdown 列表作为当前主题后的同级子树插入', () => {
    const session = new MindmapSession({ markdown: '# T\n\n- a\n- b\n' })
    const a = session.document.root.children[0]
    const ids = pasteCanvasOutline(session, a.id, '- x\n  - x1\n- y')
    expect(ids).toHaveLength(2)
    expect(session.document.root.children.map((node) => node.content.text)).toEqual([
      'a',
      'x',
      'y',
      'b'
    ])
    expect(session.document.root.children[1].children[0].content.text).toBe('x1')
    expect(session.selectedNodes.map((node) => node.content.text)).toEqual(['x', 'y'])
    session.undo()
    expect(session.getMarkdown()).toBe('# T\n\n- a\n- b\n')
  })

  it('普通多行文字会转换为同级主题', () => {
    const session = new MindmapSession({ markdown: '# T\n\n- a\n' })
    const a = session.document.root.children[0]
    pasteCanvasOutline(session, a.id, '第一行\n第二行')
    expect(session.document.root.children.map((node) => node.content.text)).toEqual([
      'a',
      '第一行',
      '第二行'
    ])
  })
})
