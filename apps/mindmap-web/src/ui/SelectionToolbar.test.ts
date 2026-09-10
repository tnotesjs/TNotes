// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import SelectionToolbar from './SelectionToolbar.vue'

async function mountToolbar(position: { left: number; top: number }) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({
    setup: () => () => h(SelectionToolbar, { mode: 'text', position }),
  })
  app.mount(host)
  await nextTick()
  await nextTick()
  return { app, toolbar: document.body.querySelector('[aria-label="文字格式工具栏"]') as HTMLElement }
}

beforeEach(() => {
  document.body.innerHTML = ''
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: 300 })
})

describe('文字格式工具栏', () => {
  it('靠近视口边缘时把工具栏钳制在安全边距内', async () => {
    const { app, toolbar } = await mountToolbar({ left: 496, top: 8 })
    const left = Number.parseFloat(toolbar.style.left)
    const top = Number.parseFloat(toolbar.style.top)
    expect(left).toBeGreaterThanOrEqual(8)
    expect(left + 430).toBeLessThanOrEqual(492)
    expect(top).toBeGreaterThanOrEqual(8)
    expect(top + 46).toBeLessThanOrEqual(292)
    app.unmount()
  })

  it('快捷键提示使用即时 data tooltip，并显示 Cmd/Ctrl+E', async () => {
    const { app, toolbar } = await mountToolbar({ left: 250, top: 150 })
    const buttons = [...toolbar.querySelectorAll('button')]
    expect(buttons.every((button) => !button.hasAttribute('title'))).toBe(true)
    expect(toolbar.querySelector('[aria-label="行内代码"]')?.getAttribute('data-tooltip')).toMatch(/行内代码 \(.+E\)/)
    app.unmount()
  })
})
