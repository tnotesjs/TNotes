// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest'

import { dismissEditorContextMenu, showEditorContextMenu } from './editorContextMenu'

afterEach(() => {
  dismissEditorContextMenu()
})

describe('editor context menu', () => {
  it('shows actions at the pointer and reports the chosen item', () => {
    const onSelect = vi.fn()
    const event = new MouseEvent('contextmenu', { clientX: 40, clientY: 60, bubbles: true })
    showEditorContextMenu(
      event,
      [
        { id: 'rename', label: '重命名' },
        { id: 'request-delete', label: '删除代码块', danger: true }
      ],
      onSelect
    )
    const menu = document.querySelector('.desk-editor-context-menu')
    expect(menu).toBeTruthy()
    expect(menu?.textContent).toContain('删除代码块')
    document.querySelector<HTMLButtonElement>('.is-danger')?.click()
    expect(onSelect).toHaveBeenCalledExactlyOnceWith('request-delete')
    expect(document.querySelector('.desk-editor-context-menu')).toBeNull()
  })
})
