// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest'

import { mountCodeTabEditor } from './deskCodeTabEditor'

afterEach(() => {
  document.body.replaceChildren()
})

describe('代码组标签页的拆除', () => {
  it('destroy 前把未保存内容写盘（程序化拆除不触发 focusout）', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const onSave = vi.fn(async () => ({ ok: true }) as const)
    const handle = mountCodeTabEditor(host, {
      initialContent: 'one',
      onSave,
      saveOnBlur: false
    })

    handle.setValue('two')
    expect(handle.isDirty()).toBe(true)

    handle.destroy()
    await vi.waitFor(() => expect(onSave).toHaveBeenCalledWith('two'))
    await vi.waitFor(() => expect(host.querySelector('.cm-editor')).toBeNull())
  })

  it('没有改动时拆除不会触发保存', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const onSave = vi.fn(async () => ({ ok: true }) as const)
    const handle = mountCodeTabEditor(host, {
      initialContent: 'one',
      onSave,
      saveOnBlur: false
    })

    handle.destroy()
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(onSave).not.toHaveBeenCalled()
    expect(host.querySelector('.cm-editor')).toBeNull()
  })

  it('flushSave 仍可显式落盘', async () => {
    const host = document.createElement('div')
    document.body.append(host)
    const onSave = vi.fn(async () => ({ ok: true }) as const)
    const handle = mountCodeTabEditor(host, {
      initialContent: 'one',
      onSave,
      saveOnBlur: false
    })

    handle.setValue('three')
    await handle.flushSave()
    expect(onSave).toHaveBeenCalledWith('three')
    expect(handle.isDirty()).toBe(false)
    handle.destroy()
  })
})
