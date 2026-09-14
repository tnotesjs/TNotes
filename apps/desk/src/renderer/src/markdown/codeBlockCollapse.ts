/**
 * 编辑器里代码块的「收起 / 展开」（与站点同一套规则，见 `@tnotesjs/ui/code`）。
 *
 * - 折叠是**纯视图状态**：不落库、不写 localStorage，重新打开笔记一律展开；
 * - 折叠 = 代码区整体隐藏，只剩标题栏（跟折叠标题一样）；
 * - 每个代码块标题左侧都有一颗 Icon，只有点它才切换（标题/语言仍可正常编辑）；
 * - Icon 放在 `.tools` 最左侧，与站点 `CodeBlock.vue` 的位置一致。
 */

import { applyCollapseChrome } from '@tnotesjs/ui/code'

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
 * 保证 `.tools` 最左侧有这颗折叠按钮（每个代码块都有）。
 *
 * `prepend` 对已存在的子节点是「移到最前」，所以标题输入框后插进来也不会把顺序弄乱。
 */
export function ensureCodeCollapseButton(block: HTMLElement): void {
  const tools = block.querySelector('.tools')
  if (!(tools instanceof HTMLElement)) return
  tools.prepend(tools.querySelector<HTMLButtonElement>('.desk-code-collapse') ?? createButton())
}
