/**
 * 移植自 `@milkdown/crepe@7.22.1` 的 `src/feature/block-edit/**`（MIT）。
 *
 * 改动：去掉 Crepe 的 `FeaturesCtx`/`CrepeCtx` 与 `DefineFeature` 类型，把「哪些 feature 开着」
 * 从 Crepe 自己的登记表改成显式参数（`DeskBlockEditFeatures`，见 `./features`）；
 * 配置里的菜单分组、图标、TNotes 组项与搜索词行为原样保留。
 */
import type { SlashProviderOptions } from '@milkdown/kit/plugin/slash'

import { block, type BlockProviderOptions } from '@milkdown/kit/plugin/block'

import type { DeepPartial } from '../utils'
import type { RectLike } from './menu/constrain'
import type { Editor } from '@milkdown/kit/core'
import type { GroupBuilder } from '../utils/group-builder'
import type { SlashMenuItem } from './menu/utils'

import {
  DEFAULT_DESK_BLOCK_EDIT_FEATURES,
  type DeskBlockEditFeatures
} from './features'

import { configureBlockHandle } from './handle'
import { configureMenu, menu, menuAPI } from './menu'

interface BlockEditConfig {
  handleAddIcon: string
  handleDragIcon: string
  buildMenu: (builder: GroupBuilder<SlashMenuItem>) => void

  blockHandle: Pick<
    BlockProviderOptions,
    | 'shouldShow'
    | 'getOffset'
    | 'getPosition'
    | 'getPlacement'
    | 'middleware'
    | 'floatingUIOptions'
    | 'root'
  >

  slashMenu: Pick<
    SlashProviderOptions,
    'root' | 'offset' | 'middleware' | 'floatingUIOptions'
  >

  /** Desk 扩展：斜杠菜单的双列紧凑布局（`columns` 同时决定键盘上下步长）。 */
  slashMenuLayout: {
    columns: number
    groupDataLayout: string
  } | null

  /** Desk 扩展：把菜单夹进编辑器可见区域；`obstacles` 返回需要避让的矩形。 */
  slashMenuViewport: {
    obstacles: () => RectLike | null
  } | null

  textGroup: {
    label: string
    text: {
      label: string
      icon: string
    } | null
    h1: {
      label: string
      icon: string
    } | null
    h2: {
      label: string
      icon: string
    } | null
    h3: {
      label: string
      icon: string
    } | null
    h4: {
      label: string
      icon: string
    } | null
    h5: {
      label: string
      icon: string
    } | null
    h6: {
      label: string
      icon: string
    } | null
    quote: {
      label: string
      icon: string
    } | null
    divider: {
      label: string
      icon: string
    } | null
  } | null

  listGroup: {
    label: string
    bulletList: {
      label: string
      icon: string
    } | null
    orderedList: {
      label: string
      icon: string
    } | null
    taskList: {
      label: string
      icon: string
    } | null
  } | null

  advancedGroup: {
    label: string
    image: {
      label: string
      icon: string
    } | null
    codeBlock: {
      label: string
      icon: string
    } | null
    table: {
      label: string
      icon: string
    } | null
    math: {
      label: string
      icon: string
    } | null
  } | null
}

export type BlockEditFeatureConfig = DeepPartial<BlockEditConfig>
export {
  DEFAULT_DESK_BLOCK_EDIT_FEATURES,
  type DeskBlockEditFeatures
} from './features'

export function blockEdit(
  editor: Editor,
  config?: BlockEditFeatureConfig,
  features: DeskBlockEditFeatures = DEFAULT_DESK_BLOCK_EDIT_FEATURES
): void {
  editor
    .config((ctx) => configureBlockHandle(ctx, config))
    .config((ctx) => configureMenu(ctx, config, features))
    .use(menuAPI)
    .use(block)
    .use(menu)
}
