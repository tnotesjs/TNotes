// @vitest-environment happy-dom

/**
 * P3（移植 Crepe block-edit）的渲染侧验收。
 *
 * canonical 快照只覆盖「写回的 markdown」，看不见斜杠菜单/块手柄有没有真的注册与渲染 ——
 * 少接菜单，字节照样对，但用户就再也打不出 `/` 菜单。
 *
 * 与 Crepe 一致的两处契约：
 *   · 菜单由 kit 的 `plugin/slash`（`slashFactory` + `SlashProvider`）承载，容器类名
 *     `.milkdown-slash-menu`。菜单是**按需挂载**且依赖真实布局测量（happy-dom 的
 *     getBoundingClientRect 全为 0，provider 不会展开），所以这里只断言「插件与 menuAPI
 *     已接线」；DOM 级别的展开行为由真机 e2e（block-interactions / block-menus /
 *     markdown-input）覆盖。
 *   · 块手柄由 kit 的 `plugin/block` 渲染（`blockConfig`），同样按需显示，因此断言插件
 *     已注册而非当下就有 DOM。
 */
import type { Editor } from '@milkdown/kit/core'
import { blockConfig } from '@milkdown/kit/plugin/block'
import { describe, expect, it } from 'vitest'

import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins
} from '../editor/markdown/rawBlockProjection'
import { menu, menuAPI } from './crepePort/blockEdit/menu'
import { createDeskBlockEditConfig } from './deskBlockEditConfig'
import { createDeskEditor } from './deskEditor'

async function build(): Promise<{
  root: HTMLElement
  editor: Editor
  destroy: () => Promise<void>
}> {
  const root = document.createElement('div')
  document.body.append(root)
  const handle = createDeskEditor({
    root,
    defaultValue: projectRawBlocksForMilkdown('第一段\n\n第二段\n'),
    codeBlock: {},
    isReadOnly: () => false,
    uploadImage: async () => ({ src: 'https://example.com/uploaded.png' }),
    blockEdit: createDeskBlockEditConfig({ runSlashItem: () => {} })
  })
  handle.editor.use(rawBlockProjectionPlugins)
  await handle.editor.create()
  return { root, editor: handle.editor, destroy: handle.destroy }
}

describe('block-edit 自组装配（P3）', () => {
  it('块手柄插件已注册（kit plugin-block 的 blockConfig）', async () => {
    const instance = await build()
    try {
      const hasBlockConfig = instance.editor.action((ctx) => Boolean(ctx.get(blockConfig.key)))
      expect(hasBlockConfig, 'blockConfig 缺失 —— 块手柄不会出现').toBe(true)
    } finally {
      await instance.destroy()
    }
  }, 60_000)

  it('斜杠菜单插件与 menuAPI 都已接线', async () => {
    const instance = await build()
    try {
      const wired = instance.editor.action((ctx) => ({
        menu: Boolean(ctx.get(menu.key)),
        show: typeof ctx.get(menuAPI.key).show === 'function',
        hide: typeof ctx.get(menuAPI.key).hide === 'function'
      }))
      expect(wired).toEqual({ menu: true, show: true, hide: true })
    } finally {
      await instance.destroy()
    }
  }, 60_000)
})
