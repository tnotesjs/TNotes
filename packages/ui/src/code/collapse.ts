/**
 * 代码块折叠：**纯视图状态**，只存在于当前页面的内存里。
 *
 * - 不进 markdown，不写 localStorage：刷新 / 重新进入页面后一律**默认展开**；
 * - 默认不限制高度（保持 VitePress 的宽高处理：宽度不超出正文、长行在块内横向滚动、
 *   高度由内容撑开、不产生内部纵向滚动）；
 * - 只有「够长」的代码块才给出折叠 Icon（显式、可选），点击在收起 / 展开之间切换。
 *
 * DOM 是唯一状态源（`is-collapsed` class + `aria-expanded`），因此 SSR 出来的静态
 * HTML 和客户端补强（`hydrateIslands`）以及 Vue 组件本身共用一套契约。
 */

/** 行数超过这个值才提供折叠能力（收起后可见约 15 行）。 */
export const CODE_COLLAPSE_MIN_LINES = 20

/** 收起时可见的高度（px）。 */
export const CODE_COLLAPSE_HEIGHT_PX = 360

/** 收起状态挂在代码块根节点上的 class。 */
export const CODE_BLOCK_COLLAPSED_CLASS = 'is-collapsed'

/** 代码内容行数（末尾换行不算一行）。 */
export function codeLineCount(code: string): number {
  const normalized = code.replace(/\n+$/, '')
  return normalized ? normalized.split('\n').length : 0
}

/** 是否值得提供折叠 Icon：长内容才给，短代码块不打扰。 */
export function isCollapsibleCode(code: string): boolean {
  return codeLineCount(code) > CODE_COLLAPSE_MIN_LINES
}

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

/**
 * 设置某个代码块的收起状态，并同步按钮的 aria / 文案 / 图标方向。
 * 找不到折叠按钮（短代码块）时只保证 class 与状态一致。
 */
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
 * 读者不会看到一片被裁掉的代码。
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
