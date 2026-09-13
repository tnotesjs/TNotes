/**
 * 斜杠菜单的可视区域约束（Desk 扩展）。
 *
 * Crepe 原版不限制菜单位置，菜单在窄窗口 / 底部行会溢出可视区。这里把「把菜单夹进
 * 编辑器可见范围、并按需避让遮挡物」做成菜单视图自己的一段行为 —— 迁移前它是
 * Desk 侧的一个 MutationObserver 补丁层，现在菜单源码归我们所有，就放在这里：
 * 由 `MenuView` 在显示、视图更新、滚动与窗口尺寸变化时调用。
 */

const SLASH_MENU_VIEWPORT_GAP = 8
const SLASH_MENU_DEFAULT_GROUP_HEIGHT = 420
const SLASH_MENU_MIN_GROUP_HEIGHT = 112

export interface RectLike {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

export interface SlashMenuViewportAdjustment {
  maxGroupHeight: number
  deltaX: number
  deltaY: number
}

/**
 * Pure geometry used by the runtime presenter and unit tests. `menuRect` must
 * already reflect `maxGroupHeight`; callers can therefore measure once, apply
 * the height, then measure again before asking for the final coordinate delta.
 */
export function computeSlashMenuViewportAdjustment(
  menuRect: RectLike,
  boundary: RectLike,
  chromeHeight: number
): SlashMenuViewportAdjustment {
  const usableHeight = Math.max(0, boundary.height - SLASH_MENU_VIEWPORT_GAP * 2)
  const maxGroupHeight = Math.max(
    SLASH_MENU_MIN_GROUP_HEIGHT,
    Math.min(SLASH_MENU_DEFAULT_GROUP_HEIGHT, usableHeight - chromeHeight)
  )
  const minTop = boundary.top + SLASH_MENU_VIEWPORT_GAP
  const maxBottom = boundary.bottom - SLASH_MENU_VIEWPORT_GAP
  const minLeft = boundary.left + SLASH_MENU_VIEWPORT_GAP
  const maxRight = boundary.right - SLASH_MENU_VIEWPORT_GAP

  let deltaY = 0
  if (menuRect.top < minTop) deltaY = minTop - menuRect.top
  else if (menuRect.bottom > maxBottom) deltaY = maxBottom - menuRect.bottom

  let deltaX = 0
  if (menuRect.left < minLeft) deltaX = minLeft - menuRect.left
  else if (menuRect.right > maxRight) deltaX = maxRight - menuRect.right

  return { maxGroupHeight, deltaX, deltaY }
}

/** 编辑器可见区域：纵向受编辑器面板限制，横向允许用满窗口（窄面板也不至于溢出窗口）。 */
export function editorVisibleBoundary(root: HTMLElement): RectLike {
  const rootRect = root.getBoundingClientRect()
  const top = Math.max(0, rootRect.top)
  const left = 0
  const right = window.innerWidth
  const bottom = Math.min(window.innerHeight, rootRect.bottom)
  return {
    top,
    right,
    bottom,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top)
  }
}

function restoreProviderPosition(menu: HTMLElement): void {
  const appliedTop = menu.dataset.deskAppliedTop
  const appliedLeft = menu.dataset.deskAppliedLeft
  if (appliedTop && menu.style.top === appliedTop && menu.dataset.deskProviderTop) {
    menu.style.top = menu.dataset.deskProviderTop
  } else if (menu.style.top) {
    menu.dataset.deskProviderTop = menu.style.top
  }
  if (appliedLeft && menu.style.left === appliedLeft && menu.dataset.deskProviderLeft) {
    menu.style.left = menu.dataset.deskProviderLeft
  } else if (menu.style.left) {
    menu.dataset.deskProviderLeft = menu.style.left
  }
  delete menu.dataset.deskAppliedTop
  delete menu.dataset.deskAppliedLeft
}

/**
 * @param obstacles 需要避让的遮挡物（Desk 传「块动作菜单」的矩形；没有就返回 null）。
 */
export function constrainSlashMenu(
  menu: HTMLElement,
  boundary: RectLike,
  obstacles: () => RectLike | null = () => null
): void {
  if (menu.dataset.show !== 'true') return
  const groups = menu.querySelector<HTMLElement>('.menu-groups')
  if (!groups) return

  restoreProviderPosition(menu)
  groups.style.maxHeight = `${SLASH_MENU_DEFAULT_GROUP_HEIGHT}px`
  const chromeHeight = Math.max(0, menu.offsetHeight - groups.offsetHeight)
  const first = computeSlashMenuViewportAdjustment(
    menu.getBoundingClientRect(),
    boundary,
    chromeHeight
  )
  groups.style.maxHeight = `${first.maxGroupHeight}px`

  // Applying max-height can shrink the floating element. Measure the actual
  // box before adjusting its provider-owned absolute coordinates.
  const adjusted = computeSlashMenuViewportAdjustment(
    menu.getBoundingClientRect(),
    boundary,
    chromeHeight
  )
  const menuRect = menu.getBoundingClientRect()
  const obstacleRect = obstacles()
  let obstacleDeltaX = 0
  if (
    obstacleRect &&
    menuRect.left < obstacleRect.right &&
    menuRect.right > obstacleRect.left &&
    menuRect.top < obstacleRect.bottom &&
    menuRect.bottom > obstacleRect.top
  ) {
    const right = obstacleRect.right + SLASH_MENU_VIEWPORT_GAP
    const left = obstacleRect.left - menuRect.width - SLASH_MENU_VIEWPORT_GAP
    if (right + menuRect.width <= boundary.right - SLASH_MENU_VIEWPORT_GAP) {
      obstacleDeltaX = right - menuRect.left
    } else if (left >= boundary.left + SLASH_MENU_VIEWPORT_GAP) {
      obstacleDeltaX = left - menuRect.left
    }
  }
  const currentTop = Number.parseFloat(menu.style.top)
  if (Number.isFinite(currentTop) && adjusted.deltaY !== 0) {
    const next = `${currentTop + adjusted.deltaY}px`
    menu.style.top = next
    menu.dataset.deskAppliedTop = next
  }
  const currentLeft = Number.parseFloat(menu.style.left)
  if (Number.isFinite(currentLeft) && (adjusted.deltaX !== 0 || obstacleDeltaX !== 0)) {
    const next = `${currentLeft + adjusted.deltaX + obstacleDeltaX}px`
    menu.style.left = next
    menu.dataset.deskAppliedLeft = next
  }
}
