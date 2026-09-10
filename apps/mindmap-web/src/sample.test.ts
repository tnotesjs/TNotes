import { describe, expect, it } from 'vitest'
import { parseMarkdown } from '@tnotesjs/mindmap-core'
import { SAMPLE_MARKDOWN } from './sample'

describe('默认测试示例', () => {
  it('是合法的 Web 层使用指南并包含两个项目的必要链接', () => {
    const parsed = parseMarkdown(SAMPLE_MARKDOWN)
    expect(parsed.valid).toBe(true)
    expect(parsed.doc.root.content.text).toBe('TNotes Mindmap 使用指南')
    expect(SAMPLE_MARKDOWN).toContain(
      'https://github.com/tnotesjs/tnotesjs/tree/main/apps/mindmap-web'
    )
    expect(SAMPLE_MARKDOWN).toContain('https://tnotesjs.github.io/tnotesjs/')
    expect(SAMPLE_MARKDOWN).toContain(
      'https://github.com/tnotesjs/tnotesjs/tree/main/packages/mindmap-core'
    )
    expect(SAMPLE_MARKDOWN).toContain('https://www.npmjs.com/package/@tnotesjs/mindmap-core')
    expect(SAMPLE_MARKDOWN).toContain('Cmd/Ctrl+E')
  })
})
