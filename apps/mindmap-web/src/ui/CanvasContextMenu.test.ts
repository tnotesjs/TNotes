// @vitest-environment happy-dom
import { createApp, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CanvasContextMenu from './CanvasContextMenu.vue'

let host: HTMLElement | null = null

afterEach(() => {
  host?.remove()
  host = null
  document.querySelectorAll('.canvas-context-menu').forEach((node) => node.remove())
})

function mountMenu(multiple = false, handlers: Record<string, unknown> = {}) {
  host = document.createElement('div')
  document.body.append(host)
  const app = createApp(CanvasContextMenu, {
    position: { left: 100, top: 100 },
    multiple,
    ...handlers
  })
  app.mount(host)
  return app
}

describe('CanvasContextMenu', () => {
  it('单选展示插入、剪贴、两种删除、折叠与进入主题', async () => {
    const onDeleteOnly = vi.fn()
    const app = mountMenu(false, { onDeleteOnly })
    await nextTick()
    const menu = document.querySelector('[aria-label="主题右键菜单"]')!
    const text = menu.textContent ?? ''
    expect(text).toContain('插入同级主题')
    expect(text).toContain('插入下级主题')
    expect(text).toContain('插入上级主题')
    expect(text).toContain('创建副本')
    expect(text).toContain('仅删除当前主题')
    expect(text).toContain('删除当前主题及下级主题')
    expect(text).toContain('展开/折叠同级主题')
    expect(text).toContain('进入此主题')
    ;(
      [...menu.querySelectorAll('button')].find((button) =>
        button.textContent?.includes('仅删除当前主题')
      ) as HTMLButtonElement
    ).click()
    expect(onDeleteOnly).toHaveBeenCalledOnce()
    app.unmount()
  })

  it('多选只展示多主题适用操作', async () => {
    const app = mountMenu(true)
    await nextTick()
    const text = document.querySelector('[aria-label="多主题右键菜单"]')?.textContent ?? ''
    expect(text).toContain('复制')
    expect(text).toContain('剪切')
    expect(text).toContain('删除所选主题及下级主题')
    expect(text).toContain('展开/折叠同级主题')
    expect(text).not.toContain('插入同级主题')
    expect(text).not.toContain('粘贴')
    expect(text).not.toContain('进入此主题')
    app.unmount()
  })

  it('当前根主题会禁用没有语义的操作', async () => {
    const app = mountMenu(false, {
      canCut: false,
      canDuplicate: false,
      canDeleteOnly: false,
      canDeleteTree: false,
      canToggleSiblings: false
    })
    await nextTick()
    const buttons = [
      ...document.querySelectorAll<HTMLButtonElement>('[aria-label="主题右键菜单"] button')
    ]
    for (const label of [
      '剪切',
      '创建副本',
      '仅删除当前主题',
      '删除当前主题及下级主题',
      '展开/折叠同级主题'
    ]) {
      expect(buttons.find((button) => button.textContent?.includes(label))?.disabled).toBe(true)
    }
    app.unmount()
  })
})
