// 资源面板的视图状态迁移：按**面板容器宽度**判定断点，并决定窄屏下当前显示
// 浏览还是详情。断点值必须与 KbAssetsPane.vue 里的容器查询保持一致。
//
// 为什么不只看窗口宽度：Desk 支持左右/上下分栏，同一个窗口里每个编辑器面板
// 的可用宽度可以差很多，只有面板自身宽度能决定该用哪种布局。

export type AssetsPaneTier = 'narrow' | 'medium' | 'wide'

/** 面板可用宽度断点（CSS px）。 */
export const ASSETS_PANE_MEDIUM_MIN_WIDTH = 800
export const ASSETS_PANE_WIDE_MIN_WIDTH = 1200

/** 窄屏一次只显示一栏，需要一个显式的子视图状态。 */
export type AssetsNarrowView = 'browse' | 'detail'

export interface AssetsPaneViewState {
  tier: AssetsPaneTier
  narrowView: AssetsNarrowView
}

export type AssetsPaneViewEvent =
  | { type: 'resize'; width: number }
  | { type: 'select' }
  | { type: 'back' }
  | { type: 'clear-selection' }

export function resolveAssetsPaneTier(width: number): AssetsPaneTier {
  // 宽度未知（0 / NaN）时按宽屏兜底：容器查询仍会把样式收成单列，不会截断内容。
  if (!Number.isFinite(width) || width <= 0) return 'wide'
  if (width < ASSETS_PANE_MEDIUM_MIN_WIDTH) return 'narrow'
  if (width < ASSETS_PANE_WIDE_MIN_WIDTH) return 'medium'
  return 'wide'
}

export function initialAssetsPaneViewState(): AssetsPaneViewState {
  return { tier: 'wide', narrowView: 'browse' }
}

export function reduceAssetsPaneView(
  state: AssetsPaneViewState,
  event: AssetsPaneViewEvent
): AssetsPaneViewState {
  switch (event.type) {
    case 'resize': {
      const tier = resolveAssetsPaneTier(event.width)
      // 回到宽屏时把子视图复位：否则下次变窄会停在详情，看不到列表入口。
      if (tier !== 'narrow' && state.narrowView !== 'browse') {
        return { tier, narrowView: 'browse' }
      }
      return state.tier === tier ? state : { tier, narrowView: state.narrowView }
    }
    case 'select':
      // 只有窄屏才会真的切换；宽屏两栏同显，这里多存一次状态无副作用。
      return state.narrowView === 'detail' ? state : { tier: state.tier, narrowView: 'detail' }
    case 'back':
    case 'clear-selection':
      return state.narrowView === 'browse' ? state : { tier: state.tier, narrowView: 'browse' }
  }
}

/** 窄屏是否切到详情；宽/中屏两栏同显时恒为 true。 */
export function isBrowseVisible(state: AssetsPaneViewState): boolean {
  return state.tier !== 'narrow' || state.narrowView === 'browse'
}

/** 窄屏是否切到详情；宽/中屏两栏同显时恒为 true。 */
export function isDetailVisible(state: AssetsPaneViewState): boolean {
  return state.tier !== 'narrow' || state.narrowView === 'detail'
}
