import { describe, expect, it } from 'vitest'

import {
  buildExcalidrawSource,
  isExcalidrawSource,
  parseExcalidrawSource,
  setExcalidrawHeight,
  setExcalidrawPath
} from './excalidrawComponent'
import { parseMarkdownSource } from './sourcePreservation'

const TARGET = '../assets/0004-drawing.excalidraw'

describe('Excalidraw 组件源码解析', () => {
  it('识别单行组件并读出 path', () => {
    expect(isExcalidrawSource(`<Excalidraw path="${TARGET}" />\n`)).toBe(true)
    expect(parseExcalidrawSource(`<Excalidraw path="${TARGET}" />\n`)).toEqual({
      path: TARGET,
      height: null,
      trailingNewline: true
    })
  })

  it('支持单引号、多行属性与无关属性', () => {
    const source = [
      '<Excalidraw',
      `  path='${TARGET}'`,
      '  height="480"',
      '  class="wide"',
      '  :foo="bar"',
      '/>',
      ''
    ].join('\n')
    expect(parseExcalidrawSource(source)).toEqual({
      path: TARGET,
      height: 480,
      trailingNewline: true
    })
  })

  it('height 支持 px 与绑定写法', () => {
    expect(parseExcalidrawSource(`<Excalidraw path="${TARGET}" height="520px" />`)?.height).toBe(
      520
    )
    expect(parseExcalidrawSource(`<Excalidraw path="${TARGET}" :height="360" />`)?.height).toBe(360)
  })

  it('缺少 path、路径是表达式或不是本组件时都不认（绝不 eval）', () => {
    expect(isExcalidrawSource('<Excalidraw />')).toBe(true)
    expect(parseExcalidrawSource('<Excalidraw />')).toBeNull()
    expect(parseExcalidrawSource('<Excalidraw :path="someVar" />')).toBeNull()
    expect(parseExcalidrawSource('<Excalidraws path="a.excalidraw" />')).toBeNull()
    expect(parseExcalidrawSource('<Excalidraw path="a" />\n<!-- 尾巴 -->')).toBeNull()
  })

  it('被 sourcePreservation 归类为 raw-component（走原子渲染而不是正文）', () => {
    const document = parseMarkdownSource(`# T\n\n<Excalidraw path="${TARGET}" />\n`)
    expect(document.blocks.map((block) => block.kind)).toEqual(['heading', 'raw-component'])
    expect(document.blocks[1]?.source).toBe(`<Excalidraw path="${TARGET}" />`)
  })
})

describe('Excalidraw 组件源码定点改写', () => {
  it('只替换 path 字面量，其它属性与排版字节不变', () => {
    const source = [
      '<Excalidraw',
      `  path="${TARGET}"`,
      '  height="480"',
      '  class="wide"',
      '/>',
      ''
    ].join('\n')
    const next = setExcalidrawPath(source, '../assets/0009-other.excalidraw')
    expect(next).toBe(source.replace(TARGET, '../assets/0009-other.excalidraw'))
    expect(next).toContain('  class="wide"')
    expect(next.endsWith('\n')).toBe(true)
  })

  it('单引号写法保持单引号', () => {
    expect(setExcalidrawPath(`<Excalidraw path='${TARGET}' />`, 'a.excalidraw')).toBe(
      "<Excalidraw path='a.excalidraw' />"
    )
  })

  it('写入/覆盖/移除 height 都保留其它属性', () => {
    const base = `<Excalidraw path="${TARGET}" class="wide" />`
    expect(setExcalidrawHeight(base, 420)).toBe(
      `<Excalidraw path="${TARGET}" height="420" class="wide" />`
    )
    expect(setExcalidrawHeight(setExcalidrawHeight(base, 420), 300)).toBe(
      `<Excalidraw path="${TARGET}" height="300" class="wide" />`
    )
    expect(setExcalidrawHeight(setExcalidrawHeight(base, 420), null)).toBe(base)
    expect(setExcalidrawHeight(`<Excalidraw path='${TARGET}' :height="480" />`, 240)).toBe(
      `<Excalidraw path='${TARGET}' :height="240" />`
    )
  })

  it('多行标签插 height 不破坏换行', () => {
    const source = `<Excalidraw\n  path="${TARGET}"\n  class="wide"\n/>\n`
    const next = setExcalidrawHeight(source, 480)
    expect(next).toBe(`<Excalidraw\n  path="${TARGET}" height="480"\n  class="wide"\n/>\n`)
    expect(parseExcalidrawSource(next)?.height).toBe(480)
  })

  it('构建出来的组件能被自己解析回来', () => {
    const built = buildExcalidrawSource({ path: TARGET, height: 480 })
    expect(built).toBe(`<Excalidraw path="${TARGET}" height="480" />\n`)
    expect(parseExcalidrawSource(built)).toEqual({
      path: TARGET,
      height: 480,
      trailingNewline: true
    })
  })
})
