// @vitest-environment happy-dom

/**
 * P2（移植 latex）的渲染侧验收。
 *
 * canonical 快照只能证明「写回的 markdown 逐字节一致」，看不到公式是不是**渲染**出来了 ——
 * 少注册 `math_inline` schema / node view，字节照样对，但页面上就变成纯文本 `$x^2$`。
 * 这里直接断言自组装配的 DOM 契约（与 Crepe 一致：`span[data-type="math_inline"]` + KaTeX）。
 */
import { describe, expect, it, vi } from 'vitest'

import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins
} from '../editor/markdown/rawBlockProjection'
import { createDeskEditor } from './deskEditor'

vi.hoisted(() => {
  // happy-dom 没有 doctype → quirks mode，KaTeX 会拒绝渲染；真实浏览器不存在这个问题。
  Object.defineProperty(document, 'compatMode', { configurable: true, value: 'CSS1Compat' })
})

async function build(source: string): Promise<{
  root: HTMLElement
  getMarkdown: () => string
  destroy: () => Promise<void>
}> {
  const root = document.createElement('div')
  document.body.append(root)
  const handle = createDeskEditor({
    root,
    defaultValue: projectRawBlocksForMilkdown(source),
    codeBlock: {},
    isReadOnly: () => false,
    uploadImage: async () => ({ src: 'https://example.com/uploaded.png' })
  })
  handle.editor.use(rawBlockProjectionPlugins)
  await handle.editor.create()
  return { root, getMarkdown: handle.getMarkdown, destroy: handle.destroy }
}

describe('latex 自组装配（P2）', () => {
  it('行内公式渲染成 math_inline 节点视图，KaTeX 真的跑了，且写回原拼写', async () => {
    const editor = await build('行内 $x^2$ 与 $a+b$ 混排。\n')
    try {
      const math = editor.root.querySelector('span[data-type="math_inline"]')
      expect(math, 'math_inline 节点视图缺失').not.toBeNull()
      expect(math?.getAttribute('data-value')).toBe('x^2')
      expect(math?.querySelector('.katex'), 'KaTeX 没有渲染进节点视图').not.toBeNull()
      expect(editor.getMarkdown()).toBe('行内 $x^2$ 与 $a+b$ 混排。\n')
    } finally {
      await editor.destroy()
    }
  }, 60_000)

  it('$$ 公式块仍然是 latex 语言的代码块（带 KaTeX 预览配置）', async () => {
    const editor = await build('$$\nE = mc^2\n$$\n')
    try {
      const block = editor.root.querySelector('.milkdown-code-block')
      expect(block, '公式块没有渲染成代码块').not.toBeNull()
      expect(editor.getMarkdown()).toBe('$$\nE = mc^2\n$$\n')
    } finally {
      await editor.destroy()
    }
  }, 60_000)
})
