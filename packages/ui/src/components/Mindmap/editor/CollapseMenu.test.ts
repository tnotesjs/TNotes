// @vitest-environment happy-dom
import { createApp, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CollapseMenu from './CollapseMenu.vue'

let host: HTMLElement | null = null

afterEach(() => {
  host?.remove()
  host = null
})

function mountMenu(onAll = vi.fn(), onLevel = vi.fn()) {
  host = document.createElement('div')
  document.body.append(host)
  const app = createApp(CollapseMenu, { onAll, onLevel })
  app.mount(host)
  return { app, onAll, onLevel }
}

describe('CollapseMenu', () => {
  it('展示相对层级菜单并发送操作', async () => {
    const { app, onAll, onLevel } = mountMenu()
    ;(host!.querySelector('[aria-label="展开/折叠主题"]') as HTMLButtonElement).click()
    await nextTick()
    const items = [...host!.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    expect(items.map((item) => item.textContent?.replace(/\s/g, ''))).toEqual(
      expect.arrayContaining([
        expect.stringContaining('全部主题'),
        expect.stringContaining('1级主题'),
        expect.stringContaining('2级主题'),
        expect.stringContaining('3级主题')
      ])
    )
    items[0].click()
    expect(onAll).toHaveBeenCalledOnce()

    ;(host!.querySelector('[aria-label="展开/折叠主题"]') as HTMLButtonElement).click()
    await nextTick()
    ;[...host!.querySelectorAll<HTMLElement>('[role="menuitem"]')][2].click()
    expect(onLevel).toHaveBeenCalledWith(2)
    app.unmount()
  })
})
