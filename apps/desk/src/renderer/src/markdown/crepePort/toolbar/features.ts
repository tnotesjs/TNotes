/**
 * Desk 装配里会影响工具条的相关 feature。
 *
 * Crepe 原来从它自己的 feature 登记表里查（`FeaturesCtx`）；我们改成显式参数。
 * Desk 没有 AI 能力，所以默认 `ai: false`（那条「Ask AI」按钮与其依赖的 palette 一并不要）。
 */
export interface DeskToolbarFeatures {
  latex: boolean
  ai: boolean
}

export const DEFAULT_DESK_TOOLBAR_FEATURES: DeskToolbarFeatures = {
  latex: true,
  ai: false
}
