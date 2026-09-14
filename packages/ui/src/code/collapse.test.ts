/** @vitest-environment happy-dom */

import { describe, expect, it } from 'vitest'

import {
  CODE_COLLAPSE_MIN_LINES,
  codeLineCount,
  expandCollapsedCodeBlocks,
  isCodeBlockCollapsed,
  isCollapsibleCode,
  setCodeBlockCollapsed,
  toggleCodeBlockCollapsed
} from './collapse'

function block(code: string, withButton = true): HTMLElement {
  const element = document.createElement('div')
  element.className = 'tn-code-block'
  element.innerHTML = withButton
    ? `<header class="tn-code-block__header">
         <button type="button" class="tn-code-block__icon-btn tn-code-block__collapse-btn" aria-expanded="true"></button>
       </header><pre class="tn-code-highlight">${code}</pre>`
    : `<pre class="tn-code-highlight">${code}</pre>`
  document.body.append(element)
  return element
}

describe('代码块折叠规则', () => {
  it('行数：末尾换行不算一行，空内容算 0 行', () => {
    expect(codeLineCount('')).toBe(0)
    expect(codeLineCount('\n')).toBe(0)
    expect(codeLineCount('a')).toBe(1)
    expect(codeLineCount('a\nb\n')).toBe(2)
  })

  it(`只有超过 ${CODE_COLLAPSE_MIN_LINES} 行的代码块才给折叠 Icon`, () => {
    const short = Array.from({ length: CODE_COLLAPSE_MIN_LINES }, () => 'x').join('\n')
    const long = Array.from({ length: CODE_COLLAPSE_MIN_LINES + 1 }, () => 'x').join('\n')
    expect(isCollapsibleCode(short)).toBe(false)
    expect(isCollapsibleCode(long)).toBe(true)
  })

  it('默认为展开：新建的代码块没有收起 class', () => {
    expect(isCodeBlockCollapsed(block('x'))).toBe(false)
  })

  it('切换收起状态会同步 class 与按钮 aria / 文案', () => {
    const element = block('x')
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

  it('没有按钮（短代码块）时也只动 class，不抛异常', () => {
    const element = block('x', false)
    expect(() => setCodeBlockCollapsed(element, true)).not.toThrow()
    expect(element.classList.contains('is-collapsed')).toBe(true)
  })

  it('展开容器里所有收起的代码块（代码分组切换 tab 用）', () => {
    const first = block('x')
    const second = block('y')
    setCodeBlockCollapsed(first, true)
    setCodeBlockCollapsed(second, true)
    expandCollapsedCodeBlocks(document.body)
    expect(isCodeBlockCollapsed(first)).toBe(false)
    expect(isCodeBlockCollapsed(second)).toBe(false)
  })
})
