// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'

import { isEditingKeyEvent, isEditorBlankTarget } from './editorFocusReclaim'

function canvas(...innerHtml: string[]): HTMLElement {
  const root = document.createElement('div')
  root.className = 'milkdown-markdown-editor__canvas'
  root.innerHTML = innerHtml.join('')
  document.body.appendChild(root)
  return root
}

describe('isEditorBlankTarget：点击空白区才收回焦点', () => {
  it('Crepe 根节点与面板本身算空白区', () => {
    const root = canvas('<div class="milkdown"></div>')
    expect(isEditorBlankTarget(root.querySelector('.milkdown'), root)).toBe(true)
    expect(isEditorBlankTarget(root, root)).toBe(true)
  })

  it('可编辑区、输入控件与交互岛都不抢焦点', () => {
    const root = canvas(
      [
        '<div class="ProseMirror"><p>正文</p></div>',
        '<div class="cm-editor"><div class="cm-content"></div></div>',
        '<a href="https://example.com">链接</a>',
        '<input class="rename-dest" />',
        '<div class="desk-raw-block__boundary-hit"></div>',
        '<div class="milkdown-slash-menu" role="menu"></div>',
        '<div class="milkdown-block-handle"></div>',
        '<div class="mindmap-preview"></div>',
        '<div class="prosemirror-virtual-cursor"></div>'
      ].join('')
    )
    for (const selector of [
      '.ProseMirror',
      '.ProseMirror p',
      '.cm-content',
      'a[href]',
      'input',
      '.desk-raw-block__boundary-hit',
      '.milkdown-slash-menu',
      '.milkdown-block-handle',
      '.mindmap-preview',
      '.prosemirror-virtual-cursor'
    ]) {
      expect(isEditorBlankTarget(root.querySelector(selector), root), selector).toBe(false)
    }
  })

  it('面板之外的点击一律不动（例如标签栏、侧栏、目录组件）', () => {
    const outside = document.createElement('div')
    outside.className = 'note-outline'
    document.body.appendChild(outside)
    const root = canvas('<div class="milkdown"></div>')
    expect(isEditorBlankTarget(outside, root)).toBe(false)
    expect(isEditorBlankTarget(null, root)).toBe(false)
    expect(isEditorBlankTarget(root.querySelector('.milkdown'), null)).toBe(false)
  })
})

describe('isEditingKeyEvent：只收真正的编辑输入', () => {
  it('字符键与编辑类导航键算输入', () => {
    for (const key of [
      'a',
      '中',
      '1',
      'ArrowLeft',
      'ArrowUp',
      'Backspace',
      'Enter',
      'Tab',
      'End'
    ]) {
      expect(isEditingKeyEvent({ key }), key).toBe(true)
    }
  })

  it('组合键、纯修饰键与功能键不算（避免抢快捷键）', () => {
    for (const key of [
      'Meta',
      'Control',
      'Shift',
      'Alt',
      'F5',
      'Escape',
      'Unidentified',
      'PageDown'
    ]) {
      if (key === 'PageDown') continue
      expect(isEditingKeyEvent({ key }), key).toBe(false)
    }
    expect(isEditingKeyEvent({ key: 'b', metaKey: true })).toBe(false)
    expect(isEditingKeyEvent({ key: 'b', ctrlKey: true })).toBe(false)
    expect(isEditingKeyEvent({ key: 'b', altKey: true })).toBe(false)
    // 输入法组字过程中的按键不能抢
    expect(isEditingKeyEvent({ key: 'n', isComposing: true })).toBe(false)
  })
})
