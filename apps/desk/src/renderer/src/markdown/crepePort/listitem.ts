/**
 * 移植自 `@milkdown/crepe@7.22.1` 的 `lib/esm/feature/list-item`（MIT）。
 *
 * 改动：去掉 Crepe 的 `FeaturesCtx`/`CrepeCtx`；图标默认值原样保留。
 */
import type { Editor } from '@milkdown/kit/core'
import type { Ctx } from '@milkdown/kit/ctx'
import {
  listItemBlockComponent,
  listItemBlockConfig
} from '@milkdown/kit/component/list-item-block'

/** Crepe 自己的 list-item 配置：kit 的 ListItemBlockConfig 不含这些图标键。 */
export interface DeskListItemConfig {
  bulletIcon?: string
  checkBoxCheckedIcon?: string
  checkBoxUncheckedIcon?: string
}

const bulletIcon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g clip-path="url(#clip0_952_6527)">
      <circle cx="12" cy="12" r="3" />
    </g>
    <defs>
      <clipPath id="clip0_952_6527">
        <rect width="24" height="24" />
      </clipPath>
    </defs>
  </svg>
`

const checkBoxCheckedIcon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g clip-path="url(#clip0_1803_1151)">
      <path
        d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM10.71 16.29C10.32 16.68 9.69 16.68 9.3 16.29L5.71 12.7C5.32 12.31 5.32 11.68 5.71 11.29C6.1 10.9 6.73 10.9 7.12 11.29L10 14.17L16.88 7.29C17.27 6.9 17.9 6.9 18.29 7.29C18.68 7.68 18.68 8.31 18.29 8.7L10.71 16.29Z"
      />
    </g>
    <defs>
      <clipPath id="clip0_1803_1151">
        <rect width="24" height="24" />
      </clipPath>
    </defs>
  </svg>
`

const checkBoxUncheckedIcon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g clip-path="url(#clip0_1803_535)">
      <path
        d="M18 19H6C5.45 19 5 18.55 5 18V6C5 5.45 5.45 5 6 5H18C18.55 5 19 5.45 19 6V18C19 18.55 18.55 19 18 19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
      />
    </g>
    <defs>
      <clipPath id="clip0_1803_535">
        <rect width="24" height="24" />
      </clipPath>
    </defs>
  </svg>
`

function configureListItem(ctx: Ctx, config: DeskListItemConfig): void {
  ctx.set(listItemBlockConfig.key, {
    renderLabel: ({ label, listType, checked }) => {
      let _a, _b, _c
      if (checked == null) {
        if (listType === 'bullet')
          return (_a = config == null ? void 0 : config.bulletIcon) != null ? _a : bulletIcon
        return label
      }
      if (checked)
        return (_b = config == null ? void 0 : config.checkBoxCheckedIcon) != null
          ? _b
          : checkBoxCheckedIcon
      return (_c = config == null ? void 0 : config.checkBoxUncheckedIcon) != null
        ? _c
        : checkBoxUncheckedIcon
    }
  })
}
export function listItem(editor: Editor, config: DeskListItemConfig = {}): void {
  editor.config((ctx) => configureListItem(ctx, config)).use(listItemBlockComponent)
}
