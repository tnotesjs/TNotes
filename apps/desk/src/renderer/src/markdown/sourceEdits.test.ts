import { describe, expect, it } from 'vitest'

import {
  clampOffset,
  insertTextEdit,
  prefixLinesEdit,
  replaceAllEdit,
  setLinePrefixEdit,
  wrapSelectionEdit
} from './sourceEdits'

describe('偏移裁剪', () => {
  it('越界与非数字都收进文档范围', () => {
    expect(clampOffset(-3, 10)).toBe(0)
    expect(clampOffset(99, 10)).toBe(10)
    expect(clampOffset(Number.NaN, 10)).toBe(0)
    expect(clampOffset(4, 10)).toBe(4)
  })
})

describe('插入文本', () => {
  it('按给定偏移插入并把光标放到插入内容之后', () => {
    expect(insertTextEdit('alpha', '!', 5)).toMatchObject({
      text: 'alpha!',
      selectionFrom: 6,
      selectionTo: 6
    })
  })

  it('不给偏移时用选区起点（默认文档开头）', () => {
    expect(insertTextEdit('alpha', 'x', undefined, 2).text).toBe('alxpha')
  })

  it('偏移越界自动裁剪', () => {
    expect(insertTextEdit('alpha', 'x', 99).text).toBe('alphax')
    expect(insertTextEdit('alpha', 'x', -5).text).toBe('xalpha')
  })

  it('插入表格源码', () => {
    const result = insertTextEdit('alpha', '\n|  |  |\n| --- | --- |\n|  |  |\n', 0)
    expect(result.text).toBe('\n|  |  |\n| --- | --- |\n|  |  |\nalpha')
  })
})

describe('行内包裹', () => {
  it('没有选中就插入占位文字并选中它', () => {
    expect(wrapSelectionEdit('alpha', 0, 0, '**', '**')).toMatchObject({
      text: '**文字**alpha',
      selectionFrom: 2,
      selectionTo: 4
    })
  })

  it('选中内容被包住且保持选中', () => {
    const result = wrapSelectionEdit('alpha beta', 6, 10, '**', '**')
    expect(result.text).toBe('alpha **beta**')
    expect(result.text.slice(result.selectionFrom, result.selectionTo)).toBe('beta')
  })

  it('反向选区按较小的偏移在前处理', () => {
    expect(wrapSelectionEdit('alpha', 4, 1, '`', '`').text).toBe('a`lph`a')
  })
})

describe('逐行加前缀', () => {
  it('只影响选区覆盖到的行', () => {
    const text = 'one\ntwo\nthree'
    const result = prefixLinesEdit(text, 5, 7, '> ') // 覆盖第二行的 "tw"
    expect(result.text).toBe('one\n> two\nthree')
    expect(result.text.slice(result.selectionFrom, result.selectionTo)).toBe('> two')
  })

  it('多行选区逐行加前缀（引用）', () => {
    expect(prefixLinesEdit('one\ntwo', 0, 7, '> ').text).toBe('> one\n> two')
  })

  it('选区终点落在行首时包含那一行（与 CodeMirror lineAt 同语义）', () => {
    expect(prefixLinesEdit('one\ntwo', 0, 4, '> ').text).toBe('> one\n> two')
  })
})

describe('行级前缀（标题 / 列表 / 引用）', () => {
  it('标题前缀替换已有块级标记，不留 ^## ## ', () => {
    expect(setLinePrefixEdit('alpha', 0, 0, '## ').text).toBe('## alpha')
    expect(setLinePrefixEdit('## alpha', 0, 0, '### ').text).toBe('### alpha')
    expect(setLinePrefixEdit('> alpha', 0, 0, '# ').text).toBe('# alpha')
    expect(setLinePrefixEdit('- [ ] alpha', 0, 0, '- ').text).toBe('- alpha')
    expect(setLinePrefixEdit('1. alpha', 0, 0, '').text).toBe('alpha')
  })

  it('多行按行号编有序列表', () => {
    expect(setLinePrefixEdit('one\ntwo\nthree', 0, 13, '1. ').text).toBe('1. one\n2. two\n3. three')
  })

  it('缩进不超过 3 空格的前缀也能剥掉', () => {
    expect(setLinePrefixEdit('   ## alpha', 0, 0, '- ').text).toBe('- alpha')
  })

  it('只改选区覆盖的行，选区整体被选中', () => {
    const result = setLinePrefixEdit('one\ntwo\nthree', 4, 7, '> ')
    expect(result.text).toBe('one\n> two\nthree')
    expect(result.text.slice(result.selectionFrom, result.selectionTo)).toBe('> two')
  })
})

describe('整篇替换', () => {
  it('标题编号这类整体重写用全量替换', () => {
    const result = replaceAllEdit('old', 'new')
    expect(result).toMatchObject({ text: 'new', from: 0, to: 3, selectionFrom: 0 })
  })
})
