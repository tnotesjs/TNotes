// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { EditorView } from '@codemirror/view'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  collapseLatexSourceIfIdle,
  enterLatexSource,
  isLatexCodeBlock,
  isLatexLanguage,
  isLatexPreviewOnly,
  LATEX_BLOCK_CLASS,
  latexDoneButton,
  latexEditButton,
  revealLatexSourceIfEditing,
  scheduleCollapseLatexSource,
  syncLatexEditChrome
} from './codeBlockLatexPreview'
import MilkdownMarkdownEditor from './MilkdownMarkdownEditor.vue'

function latexShell(previewOnly: boolean): HTMLElement {
  const block = document.createElement('div')
  block.className = `milkdown-code-block ${LATEX_BLOCK_CLASS}`
  const tools = document.createElement('div')
  tools.className = 'tools'
  const language = document.createElement('input')
  language.className = 'desk-code-language'
  language.value = 'LaTeX'
  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'preview-toggle-button'
  tools.append(language, toggle)
  const host = document.createElement('div')
  host.className = previewOnly ? 'codemirror-host hidden' : 'codemirror-host'
  const previewPanel = document.createElement('div')
  previewPanel.className = 'preview-panel'
  const preview = document.createElement('div')
  preview.className = 'preview'
  previewPanel.append(preview)
  toggle.addEventListener('click', () => {
    host.classList.toggle('hidden')
    syncLatexEditChrome(block)
  })
  block.append(tools, host, previewPanel)
  syncLatexEditChrome(block)
  return block
}

async function mountEditor(content: string): Promise<ReturnType<typeof mount>> {
  const wrapper = mount(MilkdownMarkdownEditor, {
    attachTo: document.body,
    props: {
      content,
      mode: 'visual',
      readOnly: false,
      knowledgeBaseId: 'kb-a',
      noteUuid: 'note-a',
      active: true,
      uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
    }
  })
  await vi.waitFor(() => expect(wrapper.find('.ProseMirror').exists()).toBe(true), {
    timeout: 4_000
  })
  return wrapper
}

describe('latex preview helpers', () => {
  it('recognizes latex fence ids', () => {
    expect(isLatexLanguage('LaTeX')).toBe(true)
    expect(isLatexLanguage('tex')).toBe(true)
    expect(isLatexLanguage('js')).toBe(false)
  })

  it('toggles Crepe preview-only from the formula chrome', () => {
    const block = latexShell(true)
    expect(isLatexCodeBlock(block)).toBe(true)
    expect(isLatexPreviewOnly(block)).toBe(true)
    expect(enterLatexSource(block)).toBe(true)
    expect(isLatexPreviewOnly(block)).toBe(false)
    expect(collapseLatexSourceIfIdle(block, document.body)).toBe(true)
    expect(isLatexPreviewOnly(block)).toBe(true)
  })

  it('does not collapse while focus stays inside the source input', () => {
    const block = latexShell(false)
    const host = block.querySelector('.codemirror-host')
    expect(collapseLatexSourceIfIdle(block, host)).toBe(false)
    expect(isLatexPreviewOnly(block)).toBe(false)
  })

  it('collapses when focus leaves the source input for the preview', () => {
    const block = latexShell(false)
    const preview = block.querySelector('.preview')
    expect(collapseLatexSourceIfIdle(block, preview)).toBe(true)
    expect(isLatexPreviewOnly(block)).toBe(true)
  })

  it('reveals source when CodeMirror is focused in preview-only mode', () => {
    const block = latexShell(true)
    const host = block.querySelector('.codemirror-host') as HTMLElement
    host.tabIndex = -1
    document.body.append(block)
    host.focus()
    expect(revealLatexSourceIfEditing(block)).toBe(true)
    expect(isLatexPreviewOnly(block)).toBe(false)
    block.remove()
  })

  it('keeps Edit on the preview and Done on the source input', () => {
    const block = latexShell(true)
    expect(latexEditButton(block)?.hidden).toBe(false)
    expect(latexEditButton(block)?.parentElement?.classList.contains('preview-panel')).toBe(true)
    expect(latexDoneButton(block)?.parentElement?.classList.contains('codemirror-host')).toBe(true)
    enterLatexSource(block)
    expect(latexEditButton(block)?.hidden).toBe(true)
    expect(latexDoneButton(block)?.hidden).toBe(false)
    expect(latexDoneButton(block)?.getAttribute('aria-label')).toBe('完成编辑')
  })
})

describe('scheduleCollapseLatexSource', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.replaceChildren()
  })

  it('hides the source after focus leaves for an outside control', async () => {
    vi.useFakeTimers()
    const block = latexShell(false)
    document.body.append(block)
    const outside = document.createElement('button')
    document.body.append(outside)
    scheduleCollapseLatexSource(block, outside)
    await vi.advanceTimersByTimeAsync(0)
    expect(isLatexPreviewOnly(block)).toBe(true)
  })

  it('keeps the source open when a null relatedTarget still has a focused input', async () => {
    vi.useFakeTimers()
    const block = latexShell(false)
    const host = block.querySelector('.codemirror-host') as HTMLElement
    host.tabIndex = -1
    document.body.append(block)
    host.focus()
    scheduleCollapseLatexSource(block, null)
    await vi.advanceTimersByTimeAsync(50)
    expect(isLatexPreviewOnly(block)).toBe(false)
  })
})

describe('block math preview-first', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('hides LaTeX source behind the rendered preview by default', async () => {
    const wrapper = await mountEditor('$$\na^2 + b^2\n$$\n')
    try {
      const block = await vi.waitFor(() => {
        const el = wrapper.find('.desk-latex-block')
        expect(el.exists()).toBe(true)
        expect(el.find('.preview-panel').exists()).toBe(true)
        return el
      })
      expect(block.find('.codemirror-host').classes()).toContain('hidden')
      expect(block.find('.preview-label').exists()).toBe(false)
      const edit = block.get('.preview-panel > .desk-raw-block__edit')
      expect(edit.attributes('aria-label')).toBe('编辑源码')
      expect(block.find('.codemirror-host > .desk-raw-block__editor-done').exists()).toBe(true)
    } finally {
      wrapper.unmount()
    }
  })

  it('opens the LaTeX source from the Edit pill on the preview', async () => {
    const wrapper = await mountEditor('$$\nx^2\n$$\n')
    try {
      const block = await vi.waitFor(() => {
        const el = wrapper.find('.desk-latex-block')
        expect(el.find('.codemirror-host.hidden').exists()).toBe(true)
        expect(el.find('.preview-panel > .desk-raw-block__edit').exists()).toBe(true)
        return el
      })
      await block.get('.preview-panel > .desk-raw-block__edit').trigger('click')
      await vi.waitFor(() => {
        expect(block.find('.codemirror-host').classes()).not.toContain('hidden')
        expect(block.get('.preview-panel > .desk-raw-block__edit').attributes('hidden')).toBeDefined()
        expect(block.get('.codemirror-host > .desk-raw-block__editor-done').attributes('aria-label')).toBe(
          '完成编辑'
        )
      })
    } finally {
      wrapper.unmount()
    }
  })

  it('does not close the LaTeX source on a selection drag focusout', async () => {
    const wrapper = await mountEditor('$$\nx^2\n$$\n')
    try {
      const block = await vi.waitFor(() => {
        const el = wrapper.find('.desk-latex-block')
        expect(el.find('.codemirror-host.hidden').exists()).toBe(true)
        return el
      })
      await block.get('.preview-panel > .desk-raw-block__edit').trigger('click')
      const cm = await vi.waitFor(() => {
        const host = block.get('.codemirror-host').element as HTMLElement
        expect(host.classList.contains('hidden')).toBe(false)
        const view = EditorView.findFromDOM(host)
        expect(view).toBeTruthy()
        return view!
      })
      cm.focus()
      const host = block.get('.codemirror-host').element
      host.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
      await new Promise((resolve) => setTimeout(resolve, 60))
      expect(block.find('.codemirror-host').classes()).not.toContain('hidden')
    } finally {
      wrapper.unmount()
    }
  })

  it('hides the source when focus leaves the input', async () => {
    const wrapper = await mountEditor('$$\nx^2\n$$\n')
    try {
      const block = await vi.waitFor(() => {
        const el = wrapper.find('.desk-latex-block')
        expect(el.find('.codemirror-host.hidden').exists()).toBe(true)
        return el
      })
      await block.get('.preview-panel > .desk-raw-block__edit').trigger('click')
      await vi.waitFor(() => {
        expect(block.find('.codemirror-host').classes()).not.toContain('hidden')
      })
      await new Promise((resolve) => setTimeout(resolve, 20))
      const host = block.get('.codemirror-host').element
      const outside = document.createElement('button')
      document.body.append(outside)
      host.dispatchEvent(
        new FocusEvent('focusout', { bubbles: true, relatedTarget: outside, cancelable: true })
      )
      await vi.waitFor(() => {
        expect(block.find('.codemirror-host').classes()).toContain('hidden')
      })
      outside.remove()
    } finally {
      wrapper.unmount()
    }
  })

  it('does not open source by clicking the rendered formula', async () => {
    const wrapper = await mountEditor('$$\nx^2\n$$\n')
    try {
      const block = await vi.waitFor(() => {
        const el = wrapper.find('.desk-latex-block')
        expect(el.find('.codemirror-host.hidden').exists()).toBe(true)
        return el
      })
      await block.get('.preview').trigger('click')
      expect(block.find('.codemirror-host').classes()).toContain('hidden')
    } finally {
      wrapper.unmount()
    }
  })

  it('keeps an emptied formula until a second Backspace', async () => {
    const wrapper = await mountEditor('$$\nx^2\n$$\n')
    try {
      const block = await vi.waitFor(() => {
        const el = wrapper.find('.desk-latex-block')
        expect(el.exists()).toBe(true)
        return el
      })
      await block.get('.preview-panel > .desk-raw-block__edit').trigger('click')
      const cm = await vi.waitFor(() => {
        const host = block.get('.codemirror-host').element as HTMLElement
        expect(host.classList.contains('hidden')).toBe(false)
        const view = EditorView.findFromDOM(host)
        expect(view).toBeTruthy()
        return view!
      })
      cm.focus()
      cm.dispatch({ selection: { anchor: 0 } })
      const before = cm.state.doc.toString()
      cm.contentDOM.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true })
      )
      expect(wrapper.find('.desk-latex-block').exists()).toBe(true)
      expect(cm.state.doc.toString()).toBe(before)

      cm.dispatch({ changes: { from: 0, to: cm.state.doc.length, insert: '' } })
      expect(wrapper.find('.desk-latex-block').exists()).toBe(true)

      cm.contentDOM.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true, cancelable: true })
      )
      await vi.waitFor(() => {
        expect(wrapper.find('.desk-latex-block').exists()).toBe(false)
      })
    } finally {
      wrapper.unmount()
    }
  })

  it('leaves ordinary code fences as source editors', async () => {
    const wrapper = await mountEditor('```js\nconst n = 1\n```\n')
    try {
      const block = await vi.waitFor(() => {
        const el = wrapper.find('.milkdown-code-block')
        expect(el.exists()).toBe(true)
        return el
      })
      expect(block.classes()).not.toContain(LATEX_BLOCK_CLASS)
      expect(block.find('.preview-panel').exists()).toBe(false)
      expect(block.find('.codemirror-host').classes()).not.toContain('hidden')
      expect(block.find('.preview-panel > .desk-raw-block__edit').exists()).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })
})
