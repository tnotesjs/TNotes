// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import MilkdownMarkdownEditor from './MilkdownMarkdownEditor.vue'
import {
  mutationsIndicateCodeToolsRemount,
  standaloneCodeBlockMissingChrome
} from './codeBlockTitlePlugin'
import { UNLABELED_CODE_LANGUAGE } from './codeLanguage'

function remountedTools(): HTMLElement {
  const tools = document.createElement('div')
  tools.className = 'tools'
  const group = document.createElement('div')
  group.className = 'tools-button-group'
  const copy = document.createElement('button')
  copy.className = 'copy-button'
  group.append(copy)
  tools.append(group)
  return tools
}

describe('code block header chrome', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('treats a remounted Crepe tools row as incomplete', () => {
    const block = document.createElement('div')
    block.className = 'milkdown-code-block'
    block.append(remountedTools())
    expect(standaloneCodeBlockMissingChrome(block)).toBe(true)
  })

  it('detects tools being replaced inside a code block', () => {
    const block = document.createElement('div')
    block.className = 'milkdown-code-block'
    const tools = remountedTools()
    const record = {
      type: 'childList',
      target: block,
      addedNodes: [tools],
      removedNodes: []
    } as unknown as MutationRecord
    expect(mutationsIndicateCodeToolsRemount([record])).toBe(true)
  })

  it('自身 chrome 的变更不算 tools 重挂载（否则同步会自激成死循环）', () => {
    const tools = remountedTools()
    const collapse = document.createElement('button')
    collapse.className = 'desk-code-collapse'
    const record = {
      type: 'childList',
      target: tools,
      addedNodes: [collapse],
      removedNodes: []
    } as unknown as MutationRecord
    expect(mutationsIndicateCodeToolsRemount([record])).toBe(false)

    // Crepe 重建整个 .tools 仍然要认出来
    const toolsRecord = {
      type: 'childList',
      target: document.createElement('div'),
      addedNodes: [tools],
      removedNodes: []
    } as unknown as MutationRecord
    expect(mutationsIndicateCodeToolsRemount([toolsRecord])).toBe(true)
  })

  it('re-injects title, language, and expand after Crepe remounts .tools', async () => {
    const wrapper = mount(MilkdownMarkdownEditor, {
      attachTo: document.body,
      props: {
        content: '```txt\n123\n```\n',
        mode: 'visual',
        readOnly: false,
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-a',
        active: true,
        uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
      }
    })
    try {
      await vi.waitFor(() => {
        expect(wrapper.find('.milkdown-code-block .desk-code-title').exists()).toBe(true)
        expect(wrapper.find('.milkdown-code-block .desk-code-language').exists()).toBe(true)
        expect(wrapper.find('.milkdown-code-block .desk-code-expand').exists()).toBe(true)
      })

      const tools = wrapper.get('.milkdown-code-block .tools').element
      tools.replaceChildren()
      tools.append(remountedTools().firstElementChild as HTMLElement)

      expect(wrapper.find('.milkdown-code-block .desk-code-title').exists()).toBe(false)

      await vi.waitFor(() => {
        expect(wrapper.find('.milkdown-code-block .desk-code-title').exists()).toBe(true)
        expect(wrapper.find('.milkdown-code-block .desk-code-language').exists()).toBe(true)
        expect(wrapper.find('.milkdown-code-block .desk-code-expand').exists()).toBe(true)
      })
    } finally {
      wrapper.unmount()
    }
  })

  it('uses text as the empty-language placeholder and does not fill js into unlabeled fences', async () => {
    const wrapper = mount(MilkdownMarkdownEditor, {
      attachTo: document.body,
      props: {
        content: '```\nmindmap\n  Root\n```\n',
        mode: 'visual',
        readOnly: false,
        knowledgeBaseId: 'kb-a',
        noteUuid: 'note-a',
        active: true,
        uploadImage: vi.fn(async () => ({ src: './assets/image.png', alt: 'image' }))
      }
    })
    try {
      const input = await vi.waitFor(() => {
        const el = wrapper.find('.milkdown-code-block .desk-code-language')
        expect(el.exists()).toBe(true)
        return el.element as HTMLInputElement
      })
      expect(input.placeholder).toBe(UNLABELED_CODE_LANGUAGE)
      expect(input.value).toBe('')
    } finally {
      wrapper.unmount()
    }
  })
})
