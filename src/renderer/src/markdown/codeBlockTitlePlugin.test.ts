// @vitest-environment happy-dom

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import MilkdownMarkdownEditor from './MilkdownMarkdownEditor.vue'
import {
  mutationsIndicateCodeToolsRemount,
  standaloneCodeBlockMissingChrome
} from './codeBlockTitlePlugin'

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
})
