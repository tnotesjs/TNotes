/**
 * 代码块折叠：**纯视图状态**，只存在于当前页面的内存里。
 *
 * - 不进 markdown，不写 localStorage：刷新 / 重新进入页面后一律**默认展开**；
 * - 折叠 = 代码内容整体隐藏，只剩标题栏（跟折叠标题一样，不是「露出前几行」）；
 * - 默认（未折叠）不做任何高度限制：不管多少行都由内容撑开，没有 max-height、
 *   没有内部纵向滚动，超长单行在代码块内横向滚动；
 * - 每个代码块标题左侧都有折叠 Icon，点击在收起 / 展开之间切换。
 *
 * DOM 是唯一状态源（`is-collapsed` class + `aria-expanded`），因此 SSR 出来的静态
 * HTML 和客户端补强（`hydrateIslands`）以及 Vue 组件本身共用一套契约。
 */

/** 收起状态挂在代码块根节点上的 class。 */
export const CODE_BLOCK_COLLAPSED_CLASS = 'is-collapsed'

/** 代码块根节点（`.tn-code-block`）或它内部任意节点 → 根节点。 */
export function codeBlockFrom(node: Element | null | undefined): HTMLElement | null {
  if (!node) return null
  if (node.classList.contains('tn-code-block')) return node as HTMLElement
  return (node.closest('.tn-code-block') as HTMLElement | null) ?? null
}

export function isCodeBlockCollapsed(block: Element | null | undefined): boolean {
  return Boolean(block?.classList.contains(CODE_BLOCK_COLLAPSED_CLASS))
}

/** 面板 / 容器里的第一个代码块（代码分组的面板就是这种结构）。 */
export function codeBlockIn(root: ParentNode | null | undefined): HTMLElement | null {
  return root?.querySelector<HTMLElement>('.tn-code-block') ?? null
}

export function collapseButtonLabel(collapsed: boolean): string {
  return collapsed ? '展开代码' : '收起代码'
}

/**
 * 同步折叠按钮的可访问状态。
 *
 * 代码分组把按钮放在 tab 行里（面板自带的那个会被 tab 盖住），两处按钮共用这套 chrome。
 */
export function applyCollapseChrome(button: Element | null, collapsed: boolean): void {
  if (!button) return
  button.classList.toggle(CODE_BLOCK_COLLAPSED_CLASS, collapsed)
  button.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
  const label = collapseButtonLabel(collapsed)
  button.setAttribute('aria-label', label)
  if (button instanceof HTMLElement) button.title = label
}

/** 设置某个代码块的收起状态（`is-collapsed` 决定内容是否隐藏，见 code.css）。 */
export function setCodeBlockCollapsed(block: Element | null, collapsed: boolean): void {
  if (!block) return
  block.classList.toggle(CODE_BLOCK_COLLAPSED_CLASS, collapsed)
  applyCollapseChrome(block.querySelector('.tn-code-block__collapse-btn'), collapsed)
}

/** 切换收起状态，返回切换后的状态。 */
export function toggleCodeBlockCollapsed(block: Element | null): boolean {
  const next = !isCodeBlockCollapsed(block)
  setCodeBlockCollapsed(block, next)
  return next
}

/**
 * 展开 root 里所有被收起的代码块。
 *
 * 代码分组切换 tab 时用它：新露出来的面板如果是收起状态，自动展开，
 * 读者不会只看到一个标题栏。
 */
export function expandCollapsedCodeBlocks(root: ParentNode | null | undefined): void {
  if (!root) return
  if ('classList' in root && isCodeBlockCollapsed(root as Element)) {
    setCodeBlockCollapsed(root as Element, false)
  }
  root
    .querySelectorAll<HTMLElement>(`.tn-code-block.${CODE_BLOCK_COLLAPSED_CLASS}`)
    .forEach((block) => setCodeBlockCollapsed(block, false))
}
