// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { EditorView } from '@codemirror/view'
import { afterEach, describe, expect, it, vi } from 'vitest'

import MilkdownMarkdownEditor from './MilkdownMarkdownEditor.vue'
import { flushPendingEdits, hasPendingEdits } from '../editor/markdown/pendingEdits'

const CONTAINER_SOURCE = '::: details\n\nbody\n\n:::\n\nplain\n'

async function mountWithContainer(): Promise<ReturnType<typeof mount>> {
  const wrapper = mount(MilkdownMarkdownEditor, {
    attachTo: document.body,
    props: {
      content: CONTAINER_SOURCE,
      mode: 'visual',
      readOnly: false,
      knowledgeBaseId: 'kb-a',
      noteUuid: 'note-a',
      active: true,
      uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
    }
  })
  await vi.waitFor(() => expect(wrapper.find('.ProseMirror').exists()).toBe(true))
  await vi.waitFor(() => expect(wrapper.find('.desk-raw-block__edit').exists()).toBe(true))
  return wrapper
}

async function mountSwiper(): Promise<ReturnType<typeof mount>> {
  const wrapper = mount(MilkdownMarkdownEditor, {
    attachTo: document.body,
    props: {
      content: '::: swiper\n\n![1](https://cdn.example/1.png)\n\n:::\n',
      mode: 'visual',
      readOnly: false,
      knowledgeBaseId: 'kb-a',
      noteUuid: 'note-a',
      active: true,
      uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
    }
  })
  await vi.waitFor(() => expect(wrapper.find('.ProseMirror').exists()).toBe(true))
  await vi.waitFor(() => expect(wrapper.find('.desk-raw-block__edit').exists()).toBe(true))
  return wrapper
}

describe('container inline source editor', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('flushes a block-local draft before the tab close guard reads document state', async () => {
    const wrapper = await mountWithContainer()
    try {
      await wrapper.find('.desk-raw-block__edit').trigger('click')
      await wrapper.find('.desk-raw-block__editor-title').setValue('Unsaved title')
      expect(hasPendingEdits('kb-a', 'note-a')).toBe(true)
      expect(wrapper.emitted('change')).toBeUndefined()
      flushPendingEdits('kb-a', 'other-note')
      expect(hasPendingEdits('kb-a', 'note-a')).toBe(true)
      flushPendingEdits('kb-a', 'note-a')
      await Promise.resolve()
      expect(wrapper.emitted<string[]>('change')?.at(-1)?.[0]).toContain('Unsaved title')
      expect(hasPendingEdits('kb-a', 'note-a')).toBe(false)
    } finally {
      wrapper.unmount()
    }
    expect(hasPendingEdits('kb-a', 'note-a')).toBe(false)
  })

  it('commits an open callout draft when the visual editor unmounts (source view)', async () => {
    const wrapper = await mountWithContainer()
    await wrapper.find('.desk-raw-block__edit').trigger('click')
    await wrapper.find('.desk-raw-block__editor-title').setValue('Kept title')
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.unmount()
    expect(wrapper.emitted<string[]>('change')?.at(-1)?.[0]).toContain('Kept title')
    expect(hasPendingEdits('kb-a', 'note-a')).toBe(false)
  })

  const EMPTY_TIP = [
    '# 0008. tip block',
    '',
    '::: tip 💡 TIP',
    '',
    '',
    '',
    ':::',
    '',
    'plain',
    ''
  ].join('\n')

  async function mountEmptyTip(): Promise<ReturnType<typeof mount>> {
    const wrapper = mount(MilkdownMarkdownEditor, {
      attachTo: document.body,
      props: {
        content: EMPTY_TIP,
        mode: 'visual',
        readOnly: false,
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-a',
        active: true,
        uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
      }
    })
    await vi.waitFor(() => expect(wrapper.find('.desk-raw-block__edit').exists()).toBe(true))
    return wrapper
  }

  async function typeTipBody(wrapper: ReturnType<typeof mount>, text: string): Promise<void> {
    await wrapper.find('.desk-raw-block__edit').trigger('click')
    const cmHost = wrapper.find('.desk-raw-block__editor-cm .cm-editor').element as HTMLElement
    const cm = EditorView.findFromDOM(cmHost)
    expect(cm).toBeTruthy()
    cm!.dispatch({
      changes: { from: 0, to: cm!.state.doc.length, insert: text }
    })
    // Preview timer copies the draft into getSource(); dirty/commit used to
    // treat that as "already persisted" and skip the atom write.
    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  it('keeps tip body when flush() runs after the preview timer (source switch)', async () => {
    const wrapper = await mountEmptyTip()
    await typeTipBody(wrapper, '**111**')
    expect(hasPendingEdits('kb-a', 'note-a')).toBe(true)
    expect(wrapper.emitted('change')).toBeUndefined()
    ;(wrapper.vm as unknown as { flush: () => void }).flush()
    const emitted = wrapper.emitted<string[]>('change')?.at(-1)?.[0] ?? ''
    expect(emitted).toContain('**111**')
    expect(emitted).toContain('::: tip')
    expect(hasPendingEdits('kb-a', 'note-a')).toBe(false)
    wrapper.unmount()
  })

  it('keeps tip body when Done is clicked after the preview timer', async () => {
    const wrapper = await mountEmptyTip()
    await typeTipBody(wrapper, '**222**')
    await wrapper.find('.desk-raw-block__editor-done').trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.emitted<string[]>('change')?.at(-1)?.[0]).toContain('**222**')
    })
    expect(hasPendingEdits('kb-a', 'note-a')).toBe(false)
    wrapper.unmount()
  })

  it('keeps tip body when switching to readonly after the preview timer', async () => {
    const wrapper = await mountEmptyTip()
    await typeTipBody(wrapper, '**333**')
    await wrapper.setProps({ mode: 'readonly' })
    await vi.waitFor(() => {
      expect(wrapper.emitted<string[]>('change')?.at(-1)?.[0]).toContain('**333**')
    })
    wrapper.unmount()
  })

  it('opens a structured title+body editor for tip/info/details callouts', async () => {
    const wrapper = await mountWithContainer()
    const edit = wrapper.find('.desk-raw-block__edit')
    expect(edit.classes()).toContain('desk-raw-block__edit--pill')
    expect(edit.attributes('title')).toBe('编辑源码')
    expect(edit.attributes('aria-label')).toBe('编辑源码')
    expect(edit.find('svg').exists()).toBe(true)
    expect(edit.text().trim()).toBe('')
    await edit.trigger('click')

    expect(wrapper.find('.desk-raw-block__editor--structured').exists()).toBe(true)
    expect(wrapper.find('.desk-raw-block__editor-header').exists()).toBe(false)
    expect(wrapper.find('.desk-raw-block__editor-title-label').exists()).toBe(false)
    expect(wrapper.find('.desk-raw-block__editor-body-label').exists()).toBe(false)
    const title = wrapper.find('.desk-raw-block__editor-title')
    expect(title.exists()).toBe(true)
    expect(title.attributes('placeholder')).toBe('可选标题')
    const done = wrapper.find('.desk-raw-block__editor--structured > .desk-raw-block__editor-done')
    expect(done.classes()).toContain('desk-raw-block__edit--pill')
    expect(done.attributes('title')).toBe('完成编辑')
    expect(done.attributes('aria-label')).toBe('完成编辑')
    expect(done.find('svg').exists()).toBe(true)
    expect(done.text().trim()).toBe('')
    expect(wrapper.find('.desk-raw-block__editor-cm .cm-editor').exists()).toBe(true)
    expect(edit.attributes('hidden')).toBeDefined()
    wrapper.unmount()
  })

  it('does not duplicate the editor when the edit button is clicked repeatedly', async () => {
    const wrapper = await mountWithContainer()
    const edit = wrapper.find('.desk-raw-block__edit')
    await edit.trigger('click')
    await edit.trigger('click')
    await edit.trigger('click')

    expect(wrapper.findAll('.desk-raw-block__editor-cm')).toHaveLength(1)
    wrapper.unmount()
  })

  it('keeps structured body editing for swiper containers', async () => {
    const wrapper = await mountSwiper()
    const edit = wrapper.find('.desk-raw-block__edit')
    expect(edit.attributes('title')).toBe('编辑源码')
    await edit.trigger('click')
    expect(wrapper.find('.desk-raw-block__editor--structured').exists()).toBe(true)
    expect(wrapper.find('.desk-raw-block__editor-cm .cm-editor').exists()).toBe(true)
    wrapper.unmount()
  })

  it('opens the CodeMirror editor for a mermaid diagram atom', async () => {
    const wrapper = mount(MilkdownMarkdownEditor, {
      attachTo: document.body,
      props: {
        content: '```mermaid\nflowchart TD\n  A --> B\n```\n',
        mode: 'visual',
        readOnly: false,
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-a',
        active: true,
        uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
      }
    })
    await vi.waitFor(() => expect(wrapper.find('.ProseMirror').exists()).toBe(true))
    await vi.waitFor(() => expect(wrapper.find('.desk-raw-block__edit').exists()).toBe(true))
    await wrapper.find('.desk-raw-block__edit').trigger('click')
    expect(wrapper.find('.desk-raw-block__editor-cm .cm-editor').exists()).toBe(true)
    expect(wrapper.find('.desk-raw-block--mermaid .tn-mermaid').exists()).toBe(true)
    wrapper.unmount()
  })

  it('collapses the editor when 完成 is clicked without changes', async () => {
    const wrapper = await mountWithContainer()
    await wrapper.find('.desk-raw-block__edit').trigger('click')
    await wrapper.find('.desk-raw-block__editor-done').trigger('click')
    await vi.waitFor(() => {
      const editor = wrapper.find('.desk-raw-block__editor')
      expect(editor.isVisible()).toBe(false)
    })
    wrapper.unmount()
  })

  it('auto-commits structured editor when focus leaves the editor', async () => {
    const wrapper = await mountWithContainer()
    await wrapper.find('.desk-raw-block__edit').trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.find('.desk-raw-block__editor-cm .cm-editor').exists()).toBe(true)
    })
    // Let the post-open focus() settle before leaving the editor.
    await new Promise((resolve) => setTimeout(resolve, 20))

    const editor = wrapper.find('.desk-raw-block__editor--structured').element
    const outside = document.createElement('button')
    document.body.append(outside)
    editor.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: outside, cancelable: true })
    )

    await vi.waitFor(() => {
      expect(wrapper.find('.desk-raw-block__editor').isVisible()).toBe(false)
    })
    outside.remove()
    wrapper.unmount()
  })

  it('keeps structured editor open when focus moves between title and body', async () => {
    const wrapper = await mountWithContainer()
    await wrapper.find('.desk-raw-block__edit').trigger('click')
    const title = wrapper.find('.desk-raw-block__editor-title').element as HTMLInputElement
    const cm = wrapper.find('.desk-raw-block__editor-cm .cm-content').element as HTMLElement
    title.focus()
    title.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: cm, cancelable: true })
    )
    cm.focus()
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(wrapper.find('.desk-raw-block__editor').isVisible()).toBe(true)
    wrapper.unmount()
  })

  it('closes and disables the inline source editor when switching to readonly', async () => {
    const wrapper = await mountWithContainer()
    await wrapper.find('.desk-raw-block__edit').trigger('click')
    expect(wrapper.find('.desk-raw-block__editor-cm .cm-editor').exists()).toBe(true)

    await wrapper.setProps({ mode: 'readonly' })
    await vi.waitFor(() => {
      expect(wrapper.find('.desk-raw-block__editor').isVisible()).toBe(false)
    })
    const edit = wrapper.get('.desk-raw-block__edit')
    expect(edit.attributes('hidden')).toBeDefined()
    expect(edit.attributes('disabled')).toBeDefined()
    await edit.trigger('click')
    expect(wrapper.find('.desk-raw-block__editor-cm .cm-editor').exists()).toBe(false)
    expect(wrapper.emitted('change')).toBeUndefined()
    wrapper.unmount()
  })

  it('adds an empty code-group tab from the plus button', async () => {
    const wrapper = mount(MilkdownMarkdownEditor, {
      attachTo: document.body,
      props: {
        content: [
          '::: code-group',
          '',
          '```js [setup.js]',
          'const a = 1',
          '```',
          '',
          '```ts [setup.ts]',
          'const b = 2',
          '```',
          '',
          ':::',
          ''
        ].join('\n'),
        mode: 'visual',
        readOnly: false,
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-a',
        active: true,
        uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
      }
    })
    await vi.waitFor(() => expect(wrapper.find('.code-group-tab-add').exists()).toBe(true))
    expect(wrapper.findAll('.code-group-tab')).toHaveLength(2)
    await wrapper.find('.code-group-tab-add').trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.findAll('.code-group-tab')).toHaveLength(3)
      expect(wrapper.emitted<string[]>('change')?.at(-1)?.[0]).toContain('```ts [3]')
    })
    expect(wrapper.find('.desk-raw-block__edit').exists()).toBe(false)
    wrapper.unmount()
  })

  it('deletes a code-group tab from the title context menu', async () => {
    const wrapper = mount(MilkdownMarkdownEditor, {
      attachTo: document.body,
      props: {
        content: [
          '::: code-group',
          '',
          '```js [setup.js]',
          'const a = 1',
          '```',
          '',
          '```ts [setup.ts]',
          'const b = 2',
          '```',
          '',
          ':::',
          ''
        ].join('\n'),
        mode: 'visual',
        readOnly: false,
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-a',
        active: true,
        uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
      }
    })
    await vi.waitFor(() => expect(wrapper.findAll('.code-group-tab')).toHaveLength(2))
    await wrapper.findAll('.code-group-tab')[1]!.trigger('contextmenu')
    const deleteItem = document.querySelector<HTMLButtonElement>(
      '.desk-editor-context-menu__item.is-danger'
    )
    expect(deleteItem?.textContent).toBe('删除代码块')
    deleteItem?.click()
    await vi.waitFor(() => {
      expect(wrapper.findAll('.code-group-tab')).toHaveLength(1)
      expect(wrapper.emitted<string[]>('change')?.at(-1)?.[0]).toContain('```js [setup.js]')
      expect(wrapper.emitted<string[]>('change')?.at(-1)?.[0]).not.toContain('setup.ts')
    })
    wrapper.unmount()
  })
})
