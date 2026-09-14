// @vitest-environment happy-dom

import { afterEach, describe, expect, it, vi } from 'vitest'

import { ensureCodeCollapseButton } from './codeBlockCollapse'

function block(): HTMLElement {
  const element = document.createElement('div')
  element.className = 'milkdown-code-block'
  const tools = document.createElement('div')
  tools.className = 'tools'
  const title = document.createElement('input')
  title.className = 'desk-code-title'
  tools.append(title)
  element.append(tools)
  document.body.append(element)
  return element
}

describe('代码块折叠按钮注入', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('第一次注入到最左侧，重复调用不再动 DOM', () => {
    const element = block()
    ensureCodeCollapseButton(element)
    const tools = element.querySelector('.tools')!
    const button = element.querySelector('.desk-code-collapse')
    expect(tools.firstElementChild).toBe(button)

    // 重复调用必须零 DOM 写入：prepend 会触发 childList 变更 → 插件的
    // MutationObserver 会重新同步 → 死循环（曾经的真实 bug）
    const prepend = vi.spyOn(tools, 'prepend')
    ensureCodeCollapseButton(element)
    ensureCodeCollapseButton(element)
    expect(prepend).not.toHaveBeenCalled()
    expect(element.querySelectorAll('.desk-code-collapse')).toHaveLength(1)
  })

  it('按钮被挤到后面时重新提到最左', () => {
    const element = block()
    ensureCodeCollapseButton(element)
    const tools = element.querySelector('.tools')!
    const button = element.querySelector('.desk-code-collapse')!
    tools.append(button)
    expect(tools.firstElementChild).not.toBe(button)

    ensureCodeCollapseButton(element)
    expect(tools.firstElementChild).toBe(button)
    expect(tools.querySelectorAll('.desk-code-collapse')).toHaveLength(1)
  })
})
