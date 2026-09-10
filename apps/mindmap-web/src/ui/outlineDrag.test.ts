import { describe, expect, it } from 'vitest'
import { MindmapSession } from '@tnotesjs/mindmap-core'
import { resolveAfterDropLevel } from './outlineDrag'

describe('大纲拖拽层级解析', () => {
  it('有后续兄弟的子节点也能向左拖回顶层', () => {
    const session = new MindmapSession({
      markdown: '# T\n\n- 父主题\n  - 第二个节点\n  - 后续兄弟\n- 另一个顶层\n',
    })
    const root = session.document.root
    const parent = root.children[0]
    const second = parent.children[0]
    expect(parent.children[parent.children.length - 1]).not.toBe(second)

    const result = resolveAfterDropLevel(second, root, 20, 72, 1, 28)
    expect(result.node).toBe(parent)
    expect(result.depth).toBe(0)
  })

  it('指针留在当前缩进时保持当前层级', () => {
    const session = new MindmapSession({ markdown: '# T\n\n- 父主题\n  - 子主题\n' })
    const root = session.document.root
    const child = root.children[0].children[0]
    const result = resolveAfterDropLevel(child, root, 100, 72, 1, 28)
    expect(result.node).toBe(child)
    expect(result.depth).toBe(1)
  })
})
