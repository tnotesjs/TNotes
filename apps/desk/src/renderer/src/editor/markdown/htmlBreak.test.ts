import { describe, expect, it } from 'vitest'

import { DESK_HTML_BREAK, breakMarkdown, htmlBreakToHardBreak } from './htmlBreak'

interface Node {
  type: string
  value?: string
  children?: Node[]
  data?: Record<string, unknown>
}

const paragraphWith = (html: string): Node => ({
  type: 'root',
  children: [
    {
      type: 'paragraph',
      children: [
        { type: 'text', value: '第一行' },
        { type: 'html', value: html },
        { type: 'text', value: '第二行' }
      ]
    }
  ]
})

const tableWith = (html: string): Node => ({
  type: 'root',
  children: [
    {
      type: 'table',
      children: [
        {
          type: 'tableRow',
          children: [
            {
              type: 'tableCell',
              children: [
                { type: 'text', value: 'a' },
                { type: 'html', value: html }
              ]
            }
          ]
        }
      ]
    }
  ]
})

const breakOf = (tree: Node): Node | undefined => {
  const found: Node[] = []
  const walk = (node: Node): void => {
    if (node.type === 'break') found.push(node)
    node.children?.forEach(walk)
  }
  walk(tree)
  return found[0]
}

describe('行内 <br> → 硬换行', () => {
  it('段落里的三种拼写都转换，并记住原始拼写', () => {
    for (const spelling of ['<br>', '<br/>', '<br />', '<BR/>']) {
      const tree = paragraphWith(spelling)
      htmlBreakToHardBreak(tree)
      const node = breakOf(tree)
      expect(node?.type, spelling).toBe('break')
      expect(node?.data?.[DESK_HTML_BREAK], spelling).toBe(spelling)
    }
  })

  it('表格单元格里的行内 `<br>` 也转换', () => {
    const tree = tableWith('<br/>')
    htmlBreakToHardBreak(tree)
    expect(breakOf(tree)?.data?.[DESK_HTML_BREAK]).toBe('<br/>')
  })

  it('嵌套行内容器（strong）里的也转换', () => {
    const tree: Node = {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'strong',
              children: [{ type: 'html', value: '<br />' }]
            }
          ]
        }
      ]
    }
    htmlBreakToHardBreak(tree)
    expect(breakOf(tree)?.data?.[DESK_HTML_BREAK]).toBe('<br />')
  })

  it('独占一行的 `<br />`（块级 html）保持不动，交给 remark-preserve-empty-line', () => {
    const tree: Node = { type: 'root', children: [{ type: 'html', value: '<br />' }] }
    htmlBreakToHardBreak(tree)
    expect(tree.children?.[0]).toEqual({ type: 'html', value: '<br />' })
  })

  it('其它行内 HTML 不动（仍走 raw block 隔离，不能被静默改写）', () => {
    const tree = paragraphWith('<span>x</span>')
    htmlBreakToHardBreak(tree)
    expect(breakOf(tree)).toBeUndefined()
    expect(JSON.stringify(tree)).toContain('<span>x</span>')
  })
})

describe('break 的序列化', () => {
  const tableUnsafe = [{ character: '\n', inConstruct: 'tableCell' }]

  it('带原始拼写的 break 原样写回（表格里也保持同一行）', () => {
    expect(breakMarkdown({ [DESK_HTML_BREAK]: '<br/>' }, ['tableCell'], tableUnsafe)).toBe('<br/>')
    expect(breakMarkdown({ [DESK_HTML_BREAK]: '<br />' }, ['phrasing'], tableUnsafe)).toBe('<br />')
  })

  it('普通硬换行沿用默认：换行不安全的构造里退化成空格', () => {
    expect(breakMarkdown(undefined, ['tableCell'], tableUnsafe)).toBe(' ')
    expect(breakMarkdown(undefined, ['tableCell'], tableUnsafe, ' ')).toBe('')
  })

  it('普通硬换行在安全位置写 \\ + 换行', () => {
    expect(breakMarkdown(undefined, ['phrasing'], tableUnsafe)).toBe('\\\n')
  })
})
