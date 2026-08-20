import { describe, expect, it } from 'vitest'
import { parseMarkdown } from '@tnotesjs/mindmap-core'
import { insertImageIntoSource } from './imagePaste'

describe('insertImageIntoSource', () => {
  it('空列表项在原位变成图片节点', () => {
    const source = '# T\n\n- \n- b\n'
    const start = source.indexOf('- ') + 2
    const result = insertImageIntoSource(source, start, start, 'assets/shot.png')
    expect(result).toBe('# T\n\n- ![截图](assets/shot.png)\n- b\n')
    expect(parseMarkdown(result).valid).toBe(true)
  })

  it('普通文字节点中粘贴时追加独立图片节点，不把图片误做成行内文本', () => {
    const source = '# T\n\n- a\n  - child\n'
    const cursor = source.indexOf('a') + 1
    const result = insertImageIntoSource(source, cursor, cursor, 'assets/shot.png')
    expect(result).toBe('# T\n\n- a\n  - child\n\n- ![截图](assets/shot.png)\n')
    const parsed = parseMarkdown(result)
    expect(parsed.valid).toBe(true)
    expect(parsed.doc.root.children[1].content.image?.src).toBe('assets/shot.png')
  })

  it('选中完整列表项内容时用图片替换该节点', () => {
    const source = '# T\n\n- replace me\n'
    const start = source.indexOf('replace me')
    const result = insertImageIntoSource(source, start, start + 'replace me'.length, 'assets/a.png', '粘贴图片')
    expect(result).toBe('# T\n\n- ![粘贴图片](assets/a.png)\n')
  })
})
