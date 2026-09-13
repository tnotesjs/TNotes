// @vitest-environment happy-dom

/**
 * P4（移植 Crepe toolbar）的验收。
 *
 * 工具条本身按需显示（TooltipProvider 需要真实布局测量），所以这里分两层：
 *   · 配置层：`getGroups()` 的项集合必须与 Crepe 默认一致 —— 格式组（粗体/斜体/删除线）、
 *     功能组（行内代码/公式/链接），并且**不含** AI 项（Desk 不移植 AI）。
 *   · 接线层：`toolbarTooltip` 这个 slice 在 create 之后被设置（工具条视图已注册）。
 * DOM 级别的展开（`.milkdown-toolbar[data-show="true"]`）由真机 e2e（block-menus）覆盖。
 */
import type { Editor } from '@milkdown/kit/core'
import { describe, expect, it } from 'vitest'

import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins
} from '../editor/markdown/rawBlockProjection'
import { createDeskEditor } from './deskEditor'
import { getGroups } from './crepePort/toolbar/config'
import { toolbarTooltip } from './crepePort/toolbar'

async function build(): Promise<{ editor: Editor; destroy: () => Promise<void> }> {
  const root = document.createElement('div')
  document.body.append(root)
  const handle = createDeskEditor({
    root,
    defaultValue: projectRawBlocksForMilkdown('段落\n'),
    codeBlock: {},
    isReadOnly: () => false,
    uploadImage: async () => ({ src: 'https://example.com/uploaded.png' })
  })
  handle.editor.use(rawBlockProjectionPlugins)
  await handle.editor.create()
  return { editor: handle.editor, destroy: handle.destroy }
}

describe('toolbar 自组装配（P4）', () => {
  it('默认项集合与 Crepe 一致（含公式、不含 AI）', () => {
    const groups = getGroups()
    const keys = groups.flatMap((group) => group.items.map((item) => item.key))
    expect(keys).toEqual(['bold', 'italic', 'strikethrough', 'code', 'latex', 'link'])
  })

  it('关闭 latex feature 时公式项消失', () => {
    const groups = getGroups(undefined, undefined, { latex: false, ai: false })
    const keys = groups.flatMap((group) => group.items.map((item) => item.key))
    expect(keys).not.toContain('latex')
    expect(keys).toContain('bold')
  })

  it('工具条视图 slice 已注册', async () => {
    const instance = await build()
    try {
      const registered = instance.editor.action((ctx) => Boolean(ctx.get(toolbarTooltip.key)))
      expect(registered, 'toolbarTooltip 未注册 —— 选区工具条不会出现').toBe(true)
    } finally {
      await instance.destroy()
    }
  }, 60_000)
})
