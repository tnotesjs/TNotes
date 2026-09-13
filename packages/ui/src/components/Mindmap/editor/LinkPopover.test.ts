// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick, type App } from 'vue'
import LinkPopover from './LinkPopover.vue'

const mountedApps: App[] = []

function mountPopover(startEditing = false, teleportTo?: string) {
  const events = {
    save: vi.fn(),
    remove: vi.fn(),
    keep: vi.fn(),
    leave: vi.fn(),
    close: vi.fn()
  }
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    render: () =>
      h(LinkPopover, {
        url: 'https://old.example',
        position: { left: 240, top: 160 },
        startEditing,
        teleportTo,
        onSave: events.save,
        onRemove: events.remove,
        onKeep: events.keep,
        onLeave: events.leave,
        onClose: events.close
      })
  })
  app.mount(host)
  mountedApps.push(app)
  return events
}

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  for (const app of mountedApps.splice(0)) app.unmount()
  vi.restoreAllMocks()
})

describe('脑图链接编辑浮层', () => {
  it('默认只读，点击编辑后可用 Enter 更新链接', async () => {
    const events = mountPopover()
    const popover = document.body.querySelector<HTMLElement>('.link-popover')!
    const input = popover.querySelector<HTMLInputElement>('[aria-label="链接地址"]')!

    expect(popover.style.left).toBe('240px')
    expect(popover.style.top).toBe('160px')
    expect(input.readOnly).toBe(true)
    expect(input.value).toBe('https://old.example')

    popover.querySelector<HTMLButtonElement>('[aria-label="编辑链接地址"]')!.click()
    await nextTick()
    expect(input.readOnly).toBe(false)
    expect(document.activeElement).toBe(input)

    input.value = '  https://new.example/path  '
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    )
    expect(events.save).toHaveBeenCalledWith('https://new.example/path')
  })

  it('支持移除链接、悬停保活以及 Escape 关闭', () => {
    const events = mountPopover(true)
    const popover = document.body.querySelector<HTMLElement>('.link-popover')!
    const input = popover.querySelector<HTMLInputElement>('[aria-label="链接地址"]')!

    popover.dispatchEvent(new MouseEvent('mouseenter'))
    popover.dispatchEvent(new MouseEvent('mouseleave'))
    popover.querySelector<HTMLButtonElement>('[aria-label="移除链接"]')!.click()
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    )

    expect(events.keep).toHaveBeenCalledTimes(1)
    expect(events.leave).toHaveBeenCalledTimes(1)
    expect(events.remove).toHaveBeenCalledTimes(1)
    expect(events.close).toHaveBeenCalledTimes(1)
  })

  // 与 CanvasContextMenu 同款宿主开关：默认就地渲染，整页宿主传 'body'。
  it('teleportTo=body 时浮层挂到 body；默认留在宿主容器内', async () => {
    mountPopover(false, 'body')
    await nextTick()
    const teleported = document.body.querySelector<HTMLElement>('.link-popover')!
    expect(document.body.contains(teleported)).toBe(true)
    // 直挂 body：父节点就是 body，而不是某个宿主 div
    expect(teleported.parentElement).toBe(document.body)
  })

  it('不传 teleportTo 时浮层留在原位（不给 body 追加游离节点）', async () => {
    mountPopover()
    await nextTick()
    const popover = document.body.querySelector<HTMLElement>('.link-popover')!
    expect(popover.parentElement).not.toBe(document.body)
  })
})
