// @vitest-environment happy-dom

import { flushPromises, shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NoteEditorTab } from '../../../shared/contracts'
import { useEditorStore } from '../stores/editor'
import { useWorkspaceStore } from '../stores/workspace'
import FormatOverflowBar from './FormatOverflowBar.vue'
import NoteTabPane from './NoteTabPane.vue'

vi.mock('../markdown/MilkdownMarkdownEditor.vue', () => ({ default: { template: '<div />' } }))
vi.mock('../markdown/MarkdownSourceEditor.vue', () => ({ default: { template: '<div />' } }))

const tab: NoteEditorTab = {
  id: 'tab-a',
  type: 'note',
  knowledgeBaseId: 'kb-a',
  knowledgeBaseName: 'docs',
  icon: null,
  noteUuid: 'note-a',
  title: '概述',
  viewMode: 'visual',
  pageWidth: 'standard',
  dirty: false,
  pinned: false
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function setup(readOnly = false) {
  const workspace = useWorkspaceStore()
  workspace.documents['kb-a:note-a'] = {
    document: {
      knowledgeBaseId: 'kb-a',
      uuid: 'note-a',
      index: '0001',
      title: '概述',
      dirName: '0001. 概述',
      fileName: '0001. 概述.md',
      relPath: 'notes/0001. 概述.md',
      filePath: '/tmp/notes/0001. 概述.md',
      content: '## 概述',
      revision: 'v1',
      config: { done: false },
      readOnly
    },
    content: '## 概述',
    dirty: false,
    saving: false,
    externalConflict: false,
    preserveSourceOnSave: false
  }
  const rename = vi.spyOn(workspace, 'renameNote').mockResolvedValue()
  const wrapper = shallowMount(NoteTabPane, {
    attachTo: document.body,
    props: { tab: { ...tab }, groupId: 'group-a', active: true },
    global: { renderStubDefaultSlot: true }
  })
  return { wrapper, workspace, rename, editor: useEditorStore() }
}

beforeEach(() => setActivePinia(createPinia()))
afterEach(() => document.body.replaceChildren())

describe('note header', () => {
  it('puts formatting on the same row as the title and view modes', async () => {
    const { wrapper, editor } = setup()
    const controls = wrapper.get('.view-controls')
    expect(controls.findAll('button').map((button) => button.attributes('aria-label'))).toEqual([
      '标准页宽',
      '隐藏目录',
      '可视化编辑',
      '只读视图',
      '源码视图'
    ])
    expect(controls.element.children[1].className).toBe('view-divider')
    expect(wrapper.get('.outline-toggle').classes()).toContain('active')
    const toolbar = wrapper.get('.document-toolbar')
    expect(
      [...toolbar.element.children].map((node) => node.classList[0] ?? node.nodeName.toLowerCase())
    ).toEqual(['document-path', 'format-overflow-bar-stub', 'view-controls'])
    expect(wrapper.find('.save-button').exists()).toBe(false)
    const width = vi.spyOn(editor, 'toggleNotePageWidth')
    const outline = vi.spyOn(editor, 'toggleNoteOutlineVisible')
    const view = vi.spyOn(editor, 'setNoteViewMode')
    await wrapper.get('.page-width-toggle').trigger('click')
    await wrapper.get('.outline-toggle').trigger('click')
    await wrapper.get('[aria-label="源码视图"]').trigger('click')
    expect(width).toHaveBeenCalledWith('tab-a')
    expect(outline).toHaveBeenCalledWith('tab-a')
    expect(view).toHaveBeenCalledWith('tab-a', 'source')
    await wrapper.setProps({ tab: { ...tab, outlineVisible: false } })
    expect(wrapper.get('.outline-toggle').classes()).not.toContain('active')
    expect(wrapper.get('.outline-toggle').attributes('aria-label')).toBe('显示目录')
    for (const viewMode of ['source', 'readonly', 'visual'] as const) {
      await wrapper.setProps({ tab: { ...tab, viewMode } })
      const bar = wrapper.getComponent(FormatOverflowBar)
      expect(bar.exists()).toBe(true)
      expect(bar.props('disabled')).toBe(viewMode === 'readonly')
      expect(wrapper.find('.view-controls').exists()).toBe(true)
      expect(wrapper.find('.save-button').exists()).toBe(false)
    }
    wrapper.unmount()
  })

  it('edits only the title and submits a trimmed name on blur', async () => {
    const { wrapper, rename } = setup()
    await wrapper.get('.note-title-button').trigger('click')
    const input = wrapper.get('input')
    expect(input.element.value).toBe('概述')
    expect(document.activeElement).toBe(input.element)
    expect(input.element.selectionEnd).toBe(2)
    expect(wrapper.get('.note-index').text()).toBe('0001.')
    await input.setValue('  新的名称  ')
    expect(rename).not.toHaveBeenCalled()
    await input.trigger('blur')
    await flushPromises()
    expect(rename).toHaveBeenCalledExactlyOnceWith('kb-a', 'note-a', '新的名称')
    expect(wrapper.find('input').exists()).toBe(false)
    wrapper.unmount()
  })

  it.each(['', '   ', '  概述  '])('ignores empty or unchanged titles: %j', async (value) => {
    const { wrapper, rename } = setup()
    await wrapper.get('.note-title-button').trigger('click')
    await wrapper.get('input').setValue(value)
    await wrapper.get('input').trigger('blur')
    expect(rename).not.toHaveBeenCalled()
    expect(wrapper.get('.note-title-button').text()).toBe('概述')
    wrapper.unmount()
  })

  it('cancels with Escape and ignores IME Enter until composition ends', async () => {
    const { wrapper, rename } = setup()
    await wrapper.get('.note-title-button').trigger('click')
    await wrapper.get('input').setValue('取消修改')
    await wrapper.get('input').trigger('keydown', { key: 'Escape' })
    expect(rename).not.toHaveBeenCalled()
    expect(wrapper.find('input').exists()).toBe(false)
    await wrapper.get('.note-title-button').trigger('click')
    await wrapper.get('input').setValue('确认修改')
    await wrapper.get('input').trigger('keydown', { key: 'Enter', isComposing: true })
    expect(rename).not.toHaveBeenCalled()
    expect(wrapper.find('input').exists()).toBe(true)
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    await flushPromises()
    expect(rename).toHaveBeenCalledExactlyOnceWith('kb-a', 'note-a', '确认修改')
    wrapper.unmount()
  })

  it('reports rename failures and leaves the original title intact', async () => {
    const { wrapper, rename, workspace } = setup()
    rename.mockRejectedValue(new Error('名称不合法'))
    await wrapper.get('.note-title-button').trigger('click')
    await wrapper.get('input').setValue('invalid/name')
    await wrapper.get('input').trigger('blur')
    await flushPromises()
    expect(workspace.error).toBe('名称不合法')
    expect(wrapper.get('.note-title-button').text()).toBe('概述')
    expect(wrapper.get('.note-title-button').attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })

  it('does not rename a read-only document', async () => {
    const { wrapper, rename } = setup(true)
    expect(wrapper.get('.note-title-button').attributes('disabled')).toBeDefined()
    await wrapper.get('.note-title-button').trigger('click')
    expect(wrapper.find('input').exists()).toBe(false)
    expect(rename).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('keeps formatting visible but disabled for a read-only document', () => {
    const { wrapper } = setup(true)
    expect(wrapper.getComponent(FormatOverflowBar).props('disabled')).toBe(true)
    wrapper.unmount()
  })
})
