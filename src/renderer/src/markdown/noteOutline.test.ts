// @vitest-environment happy-dom

import { describe, expect, it } from 'vitest'

import {
  activeOutlineHeadingId,
  collectNoteOutlineHeadings,
  headingElementById
} from './noteOutline'

function heading(tag: string, text: string, id?: string): HTMLElement {
  const element = document.createElement(tag)
  element.textContent = text
  if (id) element.id = id
  return element
}

describe('note outline headings', () => {
  it('collects h1–h6 in document order and assigns missing ids', () => {
    const root = document.createElement('div')
    root.append(
      heading('h1', '欢迎', 'welcome'),
      heading('h2', '建议按这个顺序点'),
      heading('h3', '小节'),
      heading('h6', '最深')
    )
    expect(collectNoteOutlineHeadings(root)).toEqual([
      { id: 'welcome', level: 1, text: '欢迎' },
      { id: 'heading-2', level: 2, text: '建议按这个顺序点' },
      { id: 'heading-3', level: 3, text: '小节' },
      { id: 'heading-4', level: 6, text: '最深' }
    ])
    expect(root.querySelector('h2')?.id).toBe('heading-2')
  })

  it('looks up numeric Milkdown ids without using a # selector', () => {
    const root = document.createElement('div')
    root.append(heading('h1', '0001. 标题', '0001.-标题'))
    expect(headingElementById(root, '0001.-标题')?.textContent).toBe('0001. 标题')
  })

  it('skips slash-menu group titles that are rendered as headings', () => {
    const root = document.createElement('div')
    const menu = document.createElement('div')
    menu.className = 'milkdown-slash-menu'
    menu.append(heading('h6', 'Text'), heading('h6', 'List'), heading('h6', 'Advanced'), heading('h6', 'TNotes'))
    root.append(heading('h1', '代码分组', 'code-group'), menu)
    expect(collectNoteOutlineHeadings(root)).toEqual([
      { id: 'code-group', level: 1, text: '代码分组' }
    ])
  })

  it('skips headings inside code-block chrome', () => {
    const root = document.createElement('div')
    const code = document.createElement('div')
    code.className = 'milkdown-code-block'
    code.append(heading('h2', 'import { Crepe }'))
    root.append(heading('h1', '代码分组', 'code-group'), code)
    expect(collectNoteOutlineHeadings(root)).toEqual([
      { id: 'code-group', level: 1, text: '代码分组' }
    ])
  })

  it('skips headings inside raw-block atoms', () => {
    const root = document.createElement('div')
    const raw = document.createElement('div')
    raw.className = 'desk-raw-block'
    raw.append(heading('h2', '提示里的标题'))
    root.append(heading('h2', '正文标题', 'body'), raw)
    expect(collectNoteOutlineHeadings(root)).toEqual([
      { id: 'body', level: 2, text: '正文标题' }
    ])
  })

  it('picks the last heading that has scrolled past the offset', () => {
    const root = document.createElement('div')
    const first = heading('h2', '一', 'one')
    const second = heading('h2', '二', 'two')
    root.append(first, second)
    document.body.append(root)
    const rect = (top: number) => ({
      configurable: true,
      value: () => ({ top })
    })
    Object.defineProperty(root, 'getBoundingClientRect', rect(0))
    Object.defineProperty(first, 'getBoundingClientRect', rect(10))
    Object.defineProperty(second, 'getBoundingClientRect', rect(80))
    const items = collectNoteOutlineHeadings(root)
    expect(activeOutlineHeadingId(root, items, 56)).toBe('one')
    Object.defineProperty(second, 'getBoundingClientRect', rect(40))
    expect(activeOutlineHeadingId(root, items, 56)).toBe('two')
    root.remove()
  })
})
