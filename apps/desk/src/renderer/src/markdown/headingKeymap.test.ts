import { Schema } from '@milkdown/kit/prose/model'
import { EditorState, TextSelection } from '@milkdown/kit/prose/state'
import { describe, expect, it } from 'vitest'

import { headingBackspaceToParagraph } from './headingKeymap'

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { content: 'inline*', group: 'block' },
    heading: { content: 'inline*', group: 'block', attrs: { level: { default: 2 } } },
    text: { group: 'inline' }
  }
})

/** 光标放在第一块内部的 `offset` 处。 */
function stateWith(level: number, text: string, offset: number): EditorState {
  const doc = schema.node('doc', null, [
    schema.node('heading', { level }, text ? schema.text(text) : undefined),
    schema.node('paragraph', null, schema.text('正文'))
  ])
  const state = EditorState.create({ doc })
  return state.apply(state.tr.setSelection(TextSelection.create(state.doc, 1 + offset)))
}

/** 返回块类型与文字。 */
function firstBlock(state: EditorState): string {
  const node = state.doc.firstChild!
  return `${node.type.name}:${node.textContent}`
}

describe('标题 Backspace：一次回到正文', () => {
  for (const level of [1, 2, 3, 4, 5, 6]) {
    it(`H${level} 行首一次 Backspace → 正文`, () => {
      const state = stateWith(level, '标题', 0)
      let next: EditorState | null = null
      expect(
        headingBackspaceToParagraph(state, (tr) => {
          next = state.apply(tr)
        })
      ).toBe(true)
      expect(firstBlock(next!)).toBe('paragraph:标题')
    })
  }

  it('空标题行首 Backspace → 空正文', () => {
    const state = stateWith(2, '', 0)
    let next: EditorState | null = null
    expect(
      headingBackspaceToParagraph(state, (tr) => {
        next = state.apply(tr)
      })
    ).toBe(true)
    expect(firstBlock(next!)).toBe('paragraph:')
  })

  it('光标不在行首（第 2 个字）→ 放行', () => {
    const state = stateWith(2, '标题', 1)
    expect(headingBackspaceToParagraph(state)).toBe(false)
  })

  it('正文里按 Backspace → 放行', () => {
    const doc = schema.node('doc', null, [schema.node('paragraph', null, schema.text('正文'))])
    const state = EditorState.create({ doc })
    expect(headingBackspaceToParagraph(state)).toBe(false)
  })

  it('选中有内容 → 放行（交给默认的删选区 / 合并块）', () => {
    const state = stateWith(2, '标题', 0)
    const withSelection = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 1, 3)))
    expect(headingBackspaceToParagraph(withSelection)).toBe(false)
  })
})
