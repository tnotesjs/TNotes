// @vitest-environment happy-dom
// Verify projectRawBlocksForMilkdown output + insert round-trip for each menu item.
import { describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, rootCtx, parserCtx } from '@milkdown/kit/core'
import { commandsCtx, editorViewCtx } from '@milkdown/kit/core'
import { commonmark, clearTextInCurrentBlockCommand } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'
import { insert } from '@milkdown/kit/utils'
import { TextSelection } from '@milkdown/kit/prose/state'
import { createApp, nextTick, ref } from 'vue'

import { projectRawBlocksForMilkdown, rawBlockProjectionPlugins } from './rawBlockProjection'
import { getGroups } from '../../markdown/crepePort/blockEdit/menu/config'
import { computeSlashMenuViewportAdjustment } from '../../markdown/crepePort/blockEdit/menu/constrain'
import { Menu } from '../../markdown/crepePort/blockEdit/menu/component'
import { menuIconFor, TN_NOTES_SLASH_ITEMS } from '../../markdown/slashMenu'
import { createDeskBlockEditConfig } from '../../markdown/deskBlockEditConfig'

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
  await editor.create()
  return editor
}

function countBlocks(editor: Editor): number {
  let n = 0
  editor.action((ctx) => {
    const view = ctx.get(editorViewCtx)
    view.state.doc.descendants((node) => {
      if (node.type.name === 'deskRawBlock' || node.type.name === 'deskCallout') n += 1
    })
  })
  return n
}

const menuConfig = createDeskBlockEditConfig({ runSlashItem: () => {} })

/** 用 Desk 的真实菜单配置构造分组（含 TNotes 组），供过滤/渲染断言使用。 */
const groupsFor = (filter: string) => getGroups(filter, menuConfig).groups

describe('slash menu insert projection', () => {
  it('shrinks and clamps a tall slash menu to the visible editor boundary', () => {
    const boundary = {
      top: 100,
      right: 900,
      bottom: 600,
      left: 200,
      width: 700,
      height: 500
    }
    const nearTop = computeSlashMenuViewportAdjustment(
      {
        top: 30,
        right: 650,
        bottom: 510,
        left: 300,
        width: 350,
        height: 480
      },
      boundary,
      70
    )
    expect(nearTop.maxGroupHeight).toBe(414)
    expect(nearTop.deltaY).toBe(78)

    const nearBottom = computeSlashMenuViewportAdjustment(
      {
        top: 240,
        right: 980,
        bottom: 640,
        left: 630,
        width: 350,
        height: 400
      },
      boundary,
      70
    )
    expect(nearBottom.deltaY).toBe(-48)
    expect(nearBottom.deltaX).toBe(-88)
  })

  it('uses unique stable item ids and searches by keywords/shortcut, not by label padding', () => {
    expect(new Set(TN_NOTES_SLASH_ITEMS.map((item) => item.id)).size).toBe(
      TN_NOTES_SLASH_ITEMS.length
    )
    const mermaid = TN_NOTES_SLASH_ITEMS.find((item) => item.id === 'mermaid')!
    // 菜单项不再把别名拼进 label：label 就是展示名。
    expect(mermaid.label).toBe('Mermaid')
    // 关键词 / 快捷词由菜单原生过滤命中。
    for (const query of ['mmd', 'mermaid', '流程图', '/mmd', 'MMD']) {
      const keys = groupsFor(query).flatMap((group) => group.items.map((item) => item.key))
      expect(keys, `查询 ${query}`).toContain('mermaid')
    }
    // 不相关的查询不应命中。
    expect(groupsFor('绝对不存在的词').flatMap((group) => group.items)).toHaveLength(0)
  })

  it('uses local accessible SVG icons instead of emoji glyphs', () => {
    for (const item of TN_NOTES_SLASH_ITEMS) {
      const icon = menuIconFor(item.kind)
      expect(icon).toContain('<svg')
      expect(icon).toContain('aria-hidden="true"')
      expect(icon).not.toMatch(/[\u{1f000}-\u{1ffff}]/u)
    }
  })

  it('keeps every item shortcut unique and searchable', () => {
    const shortcuts = TN_NOTES_SLASH_ITEMS.map((item) => item.shortcut)
    expect(new Set(shortcuts).size).toBe(shortcuts.length)
    for (const item of TN_NOTES_SLASH_ITEMS) {
      expect(item.shortcut).toMatch(/^\/\S+$/)
      const keys = groupsFor(item.shortcut).flatMap((group) =>
        group.items.map((entry) => entry.key)
      )
      expect(keys, `快捷词 ${item.shortcut}`).toContain(item.id)
    }
  })

  it('renders the compact grid natively and moves hover in two-column order', async () => {
    const root = document.createElement('div')
    document.body.append(root)
    const show = ref(true)
    const filter = ref('块')
    const app = createApp(Menu, {
      ctx: {} as never,
      features: { latex: true, imageBlock: false, table: true },
      columns: 2,
      groupDataLayout: 'compact-grid',
      show,
      filter,
      hide: () => {},
      config: menuConfig
    })
    app.mount(root)
    await nextTick()

    // 原生渲染：展示名 + 行尾快捷词 chip + 布局标记（不再由 DOM 观察器补）
    const firstRow = root.querySelector<HTMLElement>('li[data-index="0"]')
    expect(firstRow?.querySelector('span:not(.milkdown-icon)')?.textContent).toBe('提示块')
    expect(firstRow?.querySelector('.desk-slash-menu__shortcut')?.textContent).toBe('/tip')
    expect(root.querySelector('.menu-group')?.getAttribute('data-layout')).toBe('compact-grid')

    // 原生键盘导航：双列时上下跨列、左右按行
    const hoveredIndex = () =>
      Number(root.querySelector<HTMLElement>('li.hover')?.dataset.index ?? '-1')
    expect(hoveredIndex()).toBe(0)
    // Vue 的渲染是异步的：每次按键后等一帧再断言 DOM。
    for (const [key, expected] of [
      ['ArrowDown', 2],
      ['ArrowRight', 3],
      ['ArrowUp', 1]
    ] as const) {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }))
      await nextTick()
      expect(hoveredIndex(), key).toBe(expected)
    }

    app.unmount()
    root.remove()
  })

  for (const item of TN_NOTES_SLASH_ITEMS) {
    // 普通代码块由代码块组件承载，不走 deskRawBlock / deskCallout。
    if (item.kind === 'code') continue
    it(`inserts ${item.label} as a TNotes block node`, async () => {
      const editor = await createEditor('# A\n\n- b\n')
      const before = countBlocks(editor)
      // move selection to the very end of the document
      editor.action((ctx) => {
        const view = ctx.get(editorViewCtx)
        const end = view.state.doc.content.size
        view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, end, end)))
      })
      editor.action((ctx) => {
        const commands = ctx.get(commandsCtx)
        commands.call(clearTextInCurrentBlockCommand.key)
        insert(projectRawBlocksForMilkdown(item.insert))(ctx)
      })
      const after = countBlocks(editor)
      expect(after).toBeGreaterThan(before)
      await editor.destroy()
      document.body.replaceChildren()
    })
  }
})

describe('projectRawBlocksForMilkdown output', () => {
  it('project <B/> component to a marker', () => {
    const out = projectRawBlocksForMilkdown('<BilibiliVideo id="" />\n')
    expect(out).toContain('<!--desk-raw-block:v1:raw-component')
  })
  it('project mermaid fence to a marker', () => {
    const out = projectRawBlocksForMilkdown('```mermaid\n\n```\n')
    expect(out).toContain('<!--desk-raw-block:v1:raw-diagram')
  })
})

describe('parse marker via parserCtx', () => {
  it('parses a projected component marker to a deskRawBlock node', async () => {
    const root = document.createElement('div')
    document.body.append(root)
    const editor = Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root)
        ctx.set(defaultValueCtx, '')
      })
      .use(commonmark)
      .use(gfm)
      .use(rawBlockProjectionPlugins)
    await editor.create()
    let parsed: { first: string; childCount: number } | null = null
    editor.action((ctx) => {
      const parser = ctx.get(parserCtx)
      const doc = parser(projectRawBlocksForMilkdown('<BilibiliVideo id="" />\n'))
      parsed = doc
        ? {
            first: doc.content.firstChild?.type?.name ?? '',
            childCount: doc.content.childCount
          }
        : null
    })
    const result = parsed as { first: string; childCount: number } | null
    expect(result?.first).toBe('deskRawBlock')
    expect(result?.childCount).toBe(1)
    await editor.destroy()
    document.body.replaceChildren()
  })
})
