// @vitest-environment happy-dom

import { describe, expect, it, vi } from 'vitest'

import { attachRawSourceEditor } from './attachRawSourceEditor'
import type { EditorView } from '@milkdown/kit/prose/view'

const CONTAINER = '::: details\n\n\n\noriginal body\n\n\n\n:::'

function makeView(source: string) {
  const node = { type: { name: 'deskRawBlock' }, attrs: { source } }
  const tr = {
    setNodeMarkup: () => tr,
    setMeta: () => tr
  }
  const dispatch = vi.fn()
  const view = {
    state: { doc: { nodeAt: () => node }, tr },
    dispatch
  } as unknown as EditorView
  return { view, dispatch }
}

function mountEditor(source = CONTAINER) {
  const dom = document.createElement('div')
  dom.className = 'desk-raw-block'
  document.body.append(dom)
  const { view, dispatch } = makeView(source)
  const renderPreview = vi.fn()
  const handle = attachRawSourceEditor(
    {
      dom,
      source,
      view,
      getPos: () => 0,
      label: '编辑容器正文',
      structuredContainerBody: true,
      renderPreview
    },
    { isEffectivelyReadOnly: () => false, rawSourceReadonlyListeners: new Set() }
  )
  return { dom, handle, dispatch, renderPreview }
}

const tick = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms))

describe('结构化容器编辑器的提交', () => {
  it('打开编辑后直接点完成：不派发事务，源码字节保持原样', async () => {
    const { dom, handle, dispatch } = mountEditor()

    const editButton = dom.querySelector<HTMLButtonElement>('.desk-raw-block__edit')
    expect(editButton).toBeTruthy()
    editButton!.click()
    await tick()

    const done = dom.querySelector<HTMLButtonElement>('.desk-raw-block__editor-done')
    expect(done).toBeTruthy()
    done!.click()
    await tick(60)

    // 未改动就不该重建源码（重建会规范化空行）→ 不该产生任何文档事务
    expect(dispatch).not.toHaveBeenCalled()
    handle.destroy()
  })
})
