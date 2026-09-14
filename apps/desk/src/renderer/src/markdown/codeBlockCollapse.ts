/**
 * 编辑器里代码块的「收起 / 展开」（与站点同一套规则，见 `@tnotesjs/ui/code`）。
 *
 * - 折叠是**纯视图状态**：不落库、不写 localStorage，重新打开笔记一律展开；
 * - 只有长代码块才给 Icon —— 短的代码块不该多一颗按钮；
 * - Icon 放在 `.tools` 最左侧（标题左侧），与站点 `CodeBlock.vue` 的位置一致；
 * - 光标进入收起的代码块时自动展开视图，避免「看不到自己在改什么」。
 */

import { applyCollapseChrome, isCollapsibleCode } from '@tnotesjs/ui/code'

import { CHEVRON_DOWN_ICON } from './copyIcons'

/** 收起状态挂在 `.milkdown-code-block` 上。 */
export const DESK_CODE_COLLAPSED_CLASS = 'is-collapsed'

export function deskCodeBlockCollapsed(block: Element | null | undefined): boolean {
  return Boolean(block?.classList.contains(DESK_CODE_COLLAPSED_CLASS))
}

function collapseButton(block: Element): HTMLButtonElement | null {
  return block.querySelector<HTMLButtonElement>('.tools .desk-code-collapse')
}

export function setDeskCodeBlockCollapsed(block: Element, collapsed: boolean): void {
  block.classList.toggle(DESK_CODE_COLLAPSED_CLASS, collapsed)
  applyCollapseChrome(collapseButton(block), collapsed)
}

export function toggleDeskCodeBlockCollapsed(block: Element): boolean {
  const next = !deskCodeBlockCollapsed(block)
  setDeskCodeBlockCollapsed(block, next)
  return next
}

/** 展开 root 里所有收起的代码块（代码分组切 tab 用）。 */
export function expandDeskCodeBlocks(root: ParentNode | null | undefined): void {
  root
    ?.querySelectorAll<HTMLElement>(`.milkdown-code-block.${DESK_CODE_COLLAPSED_CLASS}`)
    .forEach((block) => setDeskCodeBlockCollapsed(block, false))
}

function createButton(): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'desk-code-collapse'
  button.innerHTML = CHEVRON_DOWN_ICON
  applyCollapseChrome(button, false)
  return button
}

/**
 * 按代码长度决定这颗按钮去留，并保证它在 `.tools` 最左侧。
 *
 * `prepend` 对已存在的子节点是「移到最前」，所以标题输入框后插进来也不会把顺序弄乱。
 */
export function ensureCodeCollapseButton(block: HTMLElement, code: string): void {
  const tools = block.querySelector('.tools')
  if (!(tools instanceof HTMLElement)) return
  const existing = tools.querySelector<HTMLButtonElement>('.desk-code-collapse')
  if (!isCollapsibleCode(code)) {
    existing?.remove()
    if (existing) setDeskCodeBlockCollapsed(block, false)
    return
  }
  tools.prepend(existing ?? createButton())
}
