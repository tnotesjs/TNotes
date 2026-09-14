/** @vitest-environment happy-dom */

import { describe, expect, it } from 'vitest'

import {
  expandCollapsedCodeBlocks,
  isCodeBlockCollapsed,
  setCodeBlockCollapsed,
  toggleCodeBlockCollapsed
} from './collapse'

function block(withButton = true): HTMLElement {
  const element = document.createElement('div')
  element.className = 'tn-code-block'
  element.innerHTML = withButton
    ? `<header class="tn-code-block__header">
         <button type="button" class="tn-code-block__icon-btn tn-code-block__collapse-btn" aria-expanded="true"></button>
       </header><pre class="tn-code-highlight">console.log(1)</pre>`
    : `<pre class="tn-code-highlight">console.log(1)</pre>`
  document.body.append(element)
  return element
}

describe('代码块折叠（纯视图状态）', () => {
  it('默认为展开：新建的代码块没有收起 class', () => {
    expect(isCodeBlockCollapsed(block())).toBe(false)
  })

  it('切换收起状态会同步 class 与按钮 aria / 文案', () => {
    const element = block()
    const button = element.querySelector('button')!
    expect(toggleCodeBlockCollapsed(element)).toBe(true)
    expect(element.classList.contains('is-collapsed')).toBe(true)
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(button.getAttribute('aria-label')).toBe('展开代码')
    expect(toggleCodeBlockCollapsed(element)).toBe(false)
    expect(element.classList.contains('is-collapsed')).toBe(false)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    expect(button.getAttribute('aria-label')).toBe('收起代码')
  })

  it('没有按钮时也只动 class，不抛异常', () => {
    const element = block(false)
    expect(() => setCodeBlockCollapsed(element, true)).not.toThrow()
    expect(element.classList.contains('is-collapsed')).toBe(true)
  })

  it('展开容器里所有收起的代码块（代码分组切换 tab 用）', () => {
    const first = block()
    const second = block()
    setCodeBlockCollapsed(first, true)
    setCodeBlockCollapsed(second, true)
    expandCollapsedCodeBlocks(document.body)
    expect(isCodeBlockCollapsed(first)).toBe(false)
    expect(isCodeBlockCollapsed(second)).toBe(false)
  })

  it('容器本身就是收起的代码块时也能展开', () => {
    const element = block()
    setCodeBlockCollapsed(element, true)
    expandCollapsedCodeBlocks(element)
    expect(isCodeBlockCollapsed(element)).toBe(false)
  })
})
