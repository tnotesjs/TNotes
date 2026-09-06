import { describe, expect, it, vi } from 'vitest'

import { applicationMenuTemplate } from './applicationMenu'

function fileItems(platform: NodeJS.Platform) {
  const send = vi.fn()
  const template = applicationMenuTemplate({ appName: 'Desk', platform, send })
  const file = template.find((item) => item.label === 'File')
  return { send, items: (file?.submenu ?? []) as Electron.MenuItemConstructorOptions[] }
}

describe('application menu', () => {
  it('claims Command+P and Command+Shift+P so Chromium print cannot intercept them', () => {
    const { send, items } = fileItems('darwin')
    const search = items.find((item) => item.accelerator === 'CmdOrCtrl+P')
    const commands = items.find((item) => item.accelerator === 'CmdOrCtrl+Shift+P')
    expect(search?.label).toBe('搜索笔记')
    expect(commands?.label).toBe('命令面板')

    search?.click?.(undefined as never, undefined, undefined as never)
    commands?.click?.(undefined as never, undefined, undefined as never)
    expect(send.mock.calls.map((call) => call[0])).toEqual([
      'open-quick-open',
      'open-command-palette'
    ])
  })
})
