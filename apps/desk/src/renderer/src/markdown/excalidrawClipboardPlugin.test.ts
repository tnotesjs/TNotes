// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'

import { plainTextComponentsForTest } from './excalidrawClipboardPlugin'

const COMPONENT = '<Excalidraw path="../assets/0001-26-09-10-15-30-00.excalidraw" />'

describe('纯文本粘贴识别', () => {
  it('整段就是组件行才认（单行/多行、单双引号）', () => {
    expect(plainTextComponentsForTest(`${COMPONENT}\n`)).toEqual([
      '../assets/0001-26-09-10-15-30-00.excalidraw'
    ])
    expect(
      plainTextComponentsForTest(
        `${COMPONENT}\n<Excalidraw path='../assets/0002-26-09-10-15-30-01.excalidraw' />\n`
      )
    ).toHaveLength(2)
  })

  it('围栏示例、散文、表达式都不当作组件', () => {
    expect(plainTextComponentsForTest('```md\n' + COMPONENT + '\n```\n')).toBeNull()
    expect(plainTextComponentsForTest(`示例：${COMPONENT}`)).toBeNull()
    expect(plainTextComponentsForTest('<Excalidraw :path="someVar" />')).toBeNull()
    expect(plainTextComponentsForTest('')).toBeNull()
    expect(plainTextComponentsForTest('普通文本\n\n还有一段')).toBeNull()
  })
})
