/**
 * Desk 装配里实际开启的、会影响斜杠菜单的相关 feature。
 *
 * Crepe 原来是从它自己的 feature 登记表（`FeaturesCtx`）里查的；我们改成显式参数，
 * 默认值与生产一致：latex 开、image-block 关（Desk 显式关闭）、table 开。
 */
export interface DeskBlockEditFeatures {
  latex: boolean
  imageBlock: boolean
  table: boolean
}

export const DEFAULT_DESK_BLOCK_EDIT_FEATURES: DeskBlockEditFeatures = {
  latex: true,
  imageBlock: false,
  table: true
}
