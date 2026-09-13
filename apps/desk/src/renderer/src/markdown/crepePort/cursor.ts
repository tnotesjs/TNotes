/**
 * 移植自 `@milkdown/crepe@7.22.1` 的 `lib/esm/feature/cursor`（MIT）。
 *
 * 改动：去掉 Crepe 的 `FeaturesCtx`/`CrepeCtx`（那只用于 Crepe 自己的 feature 开关），
 * 其余行为原样保留 —— 落点指示条 `.crepe-drop-cursor` 与虚拟光标
 * （`prosemirror-virtual-cursor`，Desk 的表格光标可见性依赖它）都必须不变。
 */
import type { Editor } from '@milkdown/kit/core'
import { cursor as dropCursorPlugin, dropIndicatorConfig } from '@milkdown/kit/plugin/cursor'
import { $prose } from '@milkdown/kit/utils'
import { createVirtualCursor } from 'prosemirror-virtual-cursor'

export interface DeskCursorConfig {
  width?: number
  color?: string | false
  /** 与 Crepe 一致：显式 false 时不装虚拟光标（Desk 不关）。 */
  virtual?: boolean
}

export function cursor(editor: Editor, config: DeskCursorConfig = {}): void {
  editor
    .config((ctx) => {
      ctx.update(dropIndicatorConfig.key, () => ({
        class: 'crepe-drop-cursor',
        width: config.width ?? 4,
        color: config.color ?? false
      }))
    })
    .use(dropCursorPlugin)

  if (config.virtual === false) return
  const virtualCursor = createVirtualCursor({ skipWarning: ['inlineCode'] })
  editor.use($prose(() => virtualCursor))
}
