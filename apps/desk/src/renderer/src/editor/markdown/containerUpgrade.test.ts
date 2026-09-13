// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, editorViewCtx, parserCtx, rootCtx } from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'

import { projectRawBlocksForMilkdown, rawBlockProjectionPlugins } from './rawBlockProjection'
import {
  findContainerRun,
  matchContainerLines,
  topLevelBlockIndexAt,
  upgradeContainerAt
} from './containerUpgrade'

const editors: Editor[] = []

afterEach(async () => {
  await Promise.all(editors.splice(0).map((editor) => editor.destroy()))
  document.body.replaceChildren()
})

async function createEditor(source: string): Promise<Editor> {
  const root = document.createElement('div')
  document.body.append(root)
  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, projectRawBlocksForMilkdown(source))
    })
    .use(commonmark)
    .use(gfm)
    .use(rawBlockProjectionPlugins)
  editors.push(editor)
  await editor.create()
  return editor
}

/** 把容器语法写成普通段落的样子：用转义让它先当文本进来 */
const TYPED = '\\::: tip 我的标题\n\n外层正文\n\n另一行\n\n\\:::\n\n后面的段落。\n'

describe('containerUpgrade · 判定', () => {
  it('完整容器才算数', () => {
    expect(matchContainerLines(['::: tip T', '正文', ':::'])).toEqual({
      type: 'tip',
      title: 'T',
      openColons: ':::'
    })
    expect(matchContainerLines(['::: warning ⚠️ 小心', '正文', ':::'])).toMatchObject({
      type: 'warning',
      title: '⚠️ 小心'
    })
    // 没有结尾围栏 / 没有开头 / 中间还有围栏 / 类型不认识 → 都不升级
    expect(matchContainerLines(['::: tip T', '正文'])).toBeNull()
    expect(matchContainerLines(['正文', '正文', ':::'])).toBeNull()
    expect(matchContainerLines(['::: tip T', '::: info I', ':::'])).toBeNull()
    expect(matchContainerLines(['::: note N', '正文', ':::'])).toBeNull()
  })
})

describe('containerUpgrade · 升级', () => {
  it('光标离开时把「手写的容器段落」变成真正的提示块', async () => {
    const editor = await createEditor(TYPED)
    const parser = (markdown: string): ReturnType<ReturnType<Editor['ctx']['get']>> =>
      editor.ctx.get(parserCtx)(projectRawBlocksForMilkdown(markdown))
    const result = editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      const index = topLevelBlockIndexAt(view.state.doc, view.state.selection.from)
      // 找到第一段（`::: tip 我的标题`）所在下标
      let target = -1
      view.state.doc.forEach((node, _offset, at) => {
        if (target < 0 && node.textContent.includes('::: tip 我的标题')) target = at
      })
      expect(target).toBeGreaterThanOrEqual(0)
      void index
      return upgradeContainerAt(view, parser as never, target)
    })
    expect(result?.nodeType).toBe('deskCallout')
    editor.action((ctx) => {
      const doc = ctx.get(editorViewCtx).state.doc
      const top: string[] = []
      doc.forEach((node) => top.push(node.type.name))
      expect(top).toContain('deskCallout')
      // 后面的段落没被牵连
      expect(doc.textContent).toContain('后面的段落。')
    })
  })

  it('不完整的容器不会被升级', async () => {
    const incomplete = '\\::: tip 我的标题\n\n外层正文\n\n后面的段落。\n'
    const editor = await createEditor(incomplete)
    const parser = (markdown: string): ReturnType<ReturnType<Editor['ctx']['get']>> =>
      editor.ctx.get(parserCtx)(projectRawBlocksForMilkdown(markdown))
    const result = editor.action((ctx) => {
      const view = ctx.get(editorViewCtx)
      let target = -1
      view.state.doc.forEach((node, _offset, at) => {
        if (target < 0 && node.textContent.includes('::: tip 我的标题')) target = at
      })
      expect(findContainerRun(view.state.doc, target)).toBeNull()
      return upgradeContainerAt(view, parser as never, target)
    })
    expect(result).toBeNull()
  })
})
