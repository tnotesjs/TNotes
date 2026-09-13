/**
 * 移植自 `@milkdown/crepe@7.22.1` 的 `lib/esm/feature/placeholder`（MIT）。
 *
 * 改动：去掉 Crepe 的 `FeaturesCtx`/`CrepeCtx`，把「是否只读」从 Crepe 实例改为回调参数。
 * 其余（装饰类名 `crepe-placeholder`、`data-placeholder`、表格/代码块/列表内不显示）原样保留。
 */
import type { Editor } from '@milkdown/kit/core'
import { findParent } from '@milkdown/kit/prose'
import { Plugin, PluginKey, type EditorState, type Selection } from '@milkdown/kit/prose/state'
import { Decoration, DecorationSet } from '@milkdown/kit/prose/view'
import { $ctx, $prose } from '@milkdown/kit/utils'

export interface DeskPlaceholderConfig {
  text?: string
  mode?: 'block' | 'doc'
}

function isInCodeBlock(selection: Selection): boolean {
  return selection.$from.parent.type.name === 'code_block'
}

function isInList(selection: Selection): boolean {
  return selection.$from.node(selection.$from.depth - 1)?.type?.name === 'list_item'
}

function isDocEmpty(doc: EditorState['doc']): boolean {
  return doc.childCount <= 1 && !doc.firstChild?.content.size
}

function createPlaceholderDecoration(
  state: EditorState,
  placeholderText: string
): Decoration | null {
  const { selection } = state
  if (!selection.empty) return null
  const $pos = selection.$anchor
  const node = $pos.parent
  if (node.content.size > 0) return null
  if (findParent((parent) => parent.type.name === 'table')($pos)) return null
  const before = $pos.before()
  return Decoration.node(before, before + node.nodeSize, {
    class: 'crepe-placeholder',
    'data-placeholder': placeholderText
  })
}

export const placeholderConfig = $ctx(
  { text: 'Please enter...', mode: 'block' } as Required<DeskPlaceholderConfig>,
  'placeholderConfigCtx'
)

export function placeholder(
  editor: Editor,
  options: { config?: DeskPlaceholderConfig; isReadOnly: () => boolean }
): void {
  const plugin = $prose((ctx) => {
    return new Plugin({
      key: new PluginKey('CREPE_PLACEHOLDER'),
      props: {
        decorations: (state) => {
          if (options.isReadOnly()) return null
          const config = ctx.get(placeholderConfig.key)
          if (config.mode === 'doc' && !isDocEmpty(state.doc)) return null
          if (isInCodeBlock(state.selection) || isInList(state.selection)) return null
          const deco = createPlaceholderDecoration(state, config.text ?? 'Please enter...')
          if (!deco) return null
          return DecorationSet.create(state.doc, [deco])
        }
      }
    })
  })

  editor
    .config((ctx) => {
      if (options.config) {
        ctx.update(placeholderConfig.key, (prev) => ({ ...prev, ...options.config }))
      }
    })
    .use(plugin)
    .use(placeholderConfig)
}
