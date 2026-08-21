// @vitest-environment happy-dom
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { MindmapNode } from '@tnotesjs/mindmap-core'
import { MindmapSession, resetNodeIdCounter } from '@tnotesjs/mindmap-core'
import FocusBreadcrumbs from './FocusBreadcrumbs.vue'

interface DeepFixture {
  session: MindmapSession
  current: MindmapNode[]
  other: MindmapNode[]
}

let disposeMounted: (() => void) | null = null
let originalScrollIntoView: typeof HTMLElement.prototype.scrollIntoView | undefined

function deepMarkdown(depth: number): string {
  const lines = ['# 根主题', '']
  const appendLevel = (level: number) => {
    const indent = '  '.repeat(level - 1)
    lines.push(`${indent}- 当前-${level}`)
    if (level < depth) appendLevel(level + 1)
    lines.push(`${indent}- 其它-${level}`)
  }
  appendLevel(1)
  return `${lines.join('\n')}\n`
}

function makeDeepFixture(depth: number): DeepFixture {
  const session = new MindmapSession({ markdown: deepMarkdown(depth) })
  const current: MindmapNode[] = []
  const other: MindmapNode[] = []
  let parent = session.document.root
  for (let level = 0; level < depth; level++) {
    current.push(parent.children[0])
    other.push(parent.children[1])
    parent = parent.children[0]
  }
  session.focusNode(current[current.length - 1].id)
  return { session, current, other }
}

function mountBreadcrumbs(session: MindmapSession) {
  const version = ref(0)
  const bump = () => version.value++
  session.on('focusChange', bump)
  session.on('selectionChange', bump)
  session.on('change', bump)
  const Host = defineComponent({
    setup() {
      return () => h(FocusBreadcrumbs, { session, version: version.value })
    },
  })
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(Host)
  app.mount(host)
  disposeMounted = () => {
    app.unmount()
    session.off('focusChange', bump)
    session.off('selectionChange', bump)
    session.off('change', bump)
    host.remove()
  }
  return host
}

async function settle() {
  await nextTick()
  await nextTick()
}

async function hoverOpen(button: HTMLButtonElement) {
  button.dispatchEvent(new MouseEvent('mouseenter'))
  await vi.advanceTimersByTimeAsync(181)
  await settle()
  return document.body.querySelector<HTMLElement>('.focus-sibling-menu')
}

beforeEach(() => {
  resetNodeIdCounter()
  vi.useFakeTimers()
  originalScrollIntoView = HTMLElement.prototype.scrollIntoView
  HTMLElement.prototype.scrollIntoView = vi.fn()
})

afterEach(() => {
  disposeMounted?.()
  disposeMounted = null
  document.body.innerHTML = ''
  if (originalScrollIntoView) HTMLElement.prototype.scrollIntoView = originalScrollIntoView
  else delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView
  vi.useRealTimers()
})

describe('FocusBreadcrumbs', () => {
  it('完整渲染 12 层路径并自动把当前项滚入可视区域', async () => {
    const { session, current } = makeDeepFixture(12)
    const host = mountBreadcrumbs(session)
    await settle()

    const nav = host.querySelector('[aria-label="主题导航"]')
    expect(nav).not.toBeNull()
    const crumbs = [...host.querySelectorAll<HTMLButtonElement>('.focus-crumb')]
    expect(crumbs).toHaveLength(13)
    expect(crumbs.map((item) => item.textContent?.trim())).toEqual([
      '全部',
      ...current.map((node) => node.content.text),
    ])
    expect(crumbs.map((item) => item.dataset.nodeId)).toEqual([
      session.document.root.id,
      ...current.map((node) => node.id),
    ])
    expect(crumbs[crumbs.length - 1]?.getAttribute('aria-current')).toBe('page')
    expect(crumbs.slice(0, -1).every((item) => !item.hasAttribute('aria-current'))).toBe(true)
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: 'nearest',
      inline: 'nearest',
    })
  })

  it('每一层 hover 都展示该节点的同层主题，并正确标记当前项', async () => {
    const { session, current } = makeDeepFixture(4)
    const host = mountBreadcrumbs(session)
    await settle()
    const crumbs = [...host.querySelectorAll<HTMLButtonElement>('.focus-crumb')].slice(1)

    for (let depth = 0; depth < current.length; depth++) {
      const menu = await hoverOpen(crumbs[depth])
      expect(menu).not.toBeNull()
      const expected = current[depth].parent!.children
      const items = [...menu!.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')]
      expect(items.map((item) => item.dataset.nodeId)).toEqual(expected.map((node) => node.id))
      expect(items.map((item) => item.textContent?.replace('✓', '').trim())).toEqual(
        expected.map((node) => node.content.text),
      )
      expect(items.find((item) => item.getAttribute('aria-checked') === 'true')?.dataset.nodeId)
        .toBe(current[depth].id)
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      await settle()
      expect(document.body.querySelector('.focus-sibling-menu')).toBeNull()
    }
  })

  it('重名同层主题按节点 id 快速切换，并收敛聚焦路径和选择', async () => {
    const { session, current, other } = makeDeepFixture(3)
    session.updateNodeRaw(other[1].id, current[1].content.raw)
    const host = mountBreadcrumbs(session)
    await settle()
    const secondLevel = [...host.querySelectorAll<HTMLButtonElement>('.focus-crumb')][2]
    const menu = await hoverOpen(secondLevel)
    const duplicateItems = [...menu!.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')]
      .filter((item) => item.textContent?.replace('✓', '').trim() === current[1].content.text)

    expect(duplicateItems).toHaveLength(2)
    menu!.querySelector<HTMLButtonElement>(`[data-node-id="${other[1].id}"]`)!.click()
    await settle()

    expect(session.focusRootNode.id).toBe(other[1].id)
    expect(session.focusPath.map((node) => node.id)).toEqual([current[0].id, other[1].id])
    expect([...session.selectionIds]).toEqual([other[1].id])
    expect(document.body.querySelector('.focus-sibling-menu')).toBeNull()
    const updated = [...host.querySelectorAll<HTMLButtonElement>('.focus-crumb')]
    expect(updated.map((item) => item.dataset.nodeId)).toEqual([
      session.document.root.id,
      current[0].id,
      other[1].id,
    ])
  })

  it('点击祖先会选中该主题，点击全部会退出聚焦并清空选择', async () => {
    const { session, current } = makeDeepFixture(3)
    session.select(current[2].id)
    const host = mountBreadcrumbs(session)
    await settle()

    const firstLevel = [...host.querySelectorAll<HTMLButtonElement>('.focus-crumb')][1]
    firstLevel.click()
    await settle()
    expect(session.focusPath.map((node) => node.id)).toEqual([current[0].id])
    expect(session.focusRootNode.id).toBe(current[0].id)
    expect([...session.selectionIds]).toEqual([current[0].id])

    host.querySelector<HTMLButtonElement>('.focus-crumb-root')!.click()
    await settle()
    expect(session.focusPath).toEqual([])
    expect(session.focusRootNode).toBe(session.document.root)
    expect(session.selectionIds.size).toBe(0)
    expect(host.querySelector('[aria-label="主题导航"]')).toBeNull()
  })

  it('允许鼠标从主题跨入菜单，真正离开或点击外部后才关闭', async () => {
    const { session } = makeDeepFixture(2)
    const host = mountBreadcrumbs(session)
    await settle()
    const trigger = [...host.querySelectorAll<HTMLButtonElement>('.focus-crumb')][1]

    trigger.dispatchEvent(new MouseEvent('mouseenter'))
    await vi.advanceTimersByTimeAsync(179)
    expect(document.body.querySelector('.focus-sibling-menu')).toBeNull()
    await vi.advanceTimersByTimeAsync(2)
    await settle()
    const menu = document.body.querySelector<HTMLElement>('.focus-sibling-menu')!
    expect(menu).not.toBeNull()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    trigger.dispatchEvent(new MouseEvent('mouseleave'))
    menu.dispatchEvent(new MouseEvent('mouseenter'))
    await vi.advanceTimersByTimeAsync(300)
    expect(document.body.querySelector('.focus-sibling-menu')).toBe(menu)

    menu.dispatchEvent(new MouseEvent('mouseleave'))
    await vi.advanceTimersByTimeAsync(181)
    await settle()
    expect(document.body.querySelector('.focus-sibling-menu')).toBeNull()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await hoverOpen(trigger)
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await settle()
    expect(document.body.querySelector('.focus-sibling-menu')).toBeNull()
  })

  it('支持键盘打开和遍历菜单，Escape 关闭后把焦点还给主题', async () => {
    const { session } = makeDeepFixture(2)
    const host = mountBreadcrumbs(session)
    await settle()
    const trigger = [...host.querySelectorAll<HTMLButtonElement>('.focus-crumb')][1]
    trigger.focus()
    trigger.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    }))
    await settle()

    const menu = document.body.querySelector<HTMLElement>('[role="menu"]')!
    const items = [...menu.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')]
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(items[0])

    items[0].dispatchEvent(new KeyboardEvent('keydown', {
      key: 'End',
      bubbles: true,
      cancelable: true,
    }))
    expect(document.activeElement).toBe(items[items.length - 1])
    items[items.length - 1]!.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowDown',
      bubbles: true,
      cancelable: true,
    }))
    expect(document.activeElement).toBe(items[0])

    items[0].dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    }))
    await settle()
    expect(document.body.querySelector('.focus-sibling-menu')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })
})
