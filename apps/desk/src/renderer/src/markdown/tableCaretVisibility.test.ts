import { Schema } from '@milkdown/kit/prose/model'
import type { NodeSpec } from '@milkdown/kit/prose/model'
import { EditorState, TextSelection } from '@milkdown/kit/prose/state'
import { describe, expect, it } from 'vitest'

import { createTableCaretProsePlugin, selectionInsideTable } from './tableCaretVisibility'

/** `tableRole` 不在 NodeSpec 类型里（prosemirror-tables 的约定字段），按仓库既有做法断言。 */
const spec = (value: Record<string, unknown>): NodeSpec => value as NodeSpec

const schema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { group: 'block', content: 'inline*', toDOM: () => ['p', 0] },
    table: spec({
      group: 'block',
      content: 'table_row+',
      tableRole: 'table',
      toDOM: () => ['table', 0]
    }),
    table_row: spec({ content: 'table_cell+', tableRole: 'row', toDOM: () => ['tr', 0] }),
    table_cell: spec({
      content: 'paragraph+',
      tableRole: 'cell',
      toDOM: () => ['td', 0]
    }),
    text: { group: 'inline' }
  }
})

const doc = schema.node('doc', null, [
  schema.node('paragraph', null, [schema.text('before')]),
  schema.node('table', null, [
    schema.node('table_row', null, [
      schema.node('table_cell', null, [schema.node('paragraph', null, [schema.text('cell')])])
    ])
  ]),
  schema.node('paragraph', null, [schema.text('after')])
])

const posOfText = (text: string): number => {
  let found = -1
  doc.descendants((node, pos) => {
    if (found >= 0) return false
    if (node.isText && node.text === text) {
      found = pos
      return false
    }
    return true
  })
  if (found < 0) throw new Error(`找不到文本节点: ${text}`)
  return found
}

const stateWithCaretAt = (text: string): EditorState =>
  EditorState.create({
    schema,
    doc,
    selection: TextSelection.create(doc, posOfText(text))
  })

describe('table caret visibility', () => {
  it('光标在表格单元格里时判定为 true', () => {
    expect(selectionInsideTable(stateWithCaretAt('cell'))).toBe(true)
  })

  it('光标在表格外的段落里时判定为 false', () => {
    expect(selectionInsideTable(stateWithCaretAt('before'))).toBe(false)
    expect(selectionInsideTable(stateWithCaretAt('after'))).toBe(false)
  })

  it('插件按判定结果给编辑器根加 data-table-caret（表格内才有）', () => {
    const attributes = createTableCaretProsePlugin().spec.props?.attributes
    if (typeof attributes !== 'function') throw new Error('attributes 应为函数')
    expect(attributes(stateWithCaretAt('cell'))).toEqual({ 'data-table-caret': 'true' })
    expect(attributes(stateWithCaretAt('before'))).toEqual({})
  })
})
