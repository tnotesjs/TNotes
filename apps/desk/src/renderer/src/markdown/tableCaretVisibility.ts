import { $prose } from '@milkdown/kit/utils'
import { Plugin, PluginKey } from '@milkdown/kit/prose/state'
import type { EditorState } from '@milkdown/kit/prose/state'
import type { MilkdownPlugin } from '@milkdown/kit/ctx'

/**
 * 光标落在表格里时改用原生 caret。
 *
 * `prosemirror-virtual-cursor` 只在「空的 TextSelection」下挂那唯一的 widget，位置取自
 * DOM 选区 rect（取不到时退回 `coordsAtPos`）。从标题按 ↓ 进入表格的那一步实测会出现
 * 「没重定位 / 高度为 0」的一帧，而 `.ProseMirror.virtual-cursor-enabled` 又把原生 caret
 * 设成透明 —— 于是用户看到「光标消失」，可此时按键其实已经落在表头单元格里（实测：按 x
 * 会插进「列 A」）。表格内允许原生 caret，并隐藏该区域的虚拟光标，避免双光标。
 *
 * 用 `props.attributes` 而不是查 DOM：属性直接来自 ProseMirror state，不受 DOM 选区滞后影响。
 * 判定沿用仓库既有做法——看 `schema` 的 `tableRole`，而不是节点名（见 selectionKind.ts）。
 */
export const tableCaretKey = new PluginKey('desk-table-caret')

export function selectionInsideTable(state: EditorState): boolean {
  const { $head } = state.selection
  for (let depth = $head.depth; depth > 0; depth -= 1) {
    if ($head.node(depth).type.spec.tableRole === 'table') return true
  }
  return false
}

/** 裸 ProseMirror 插件；单测直接拿它断言 `attributes`，运行时由 `$prose` 包成 Milkdown 插件。 */
export function createTableCaretProsePlugin(): Plugin {
  return new Plugin({
    key: tableCaretKey,
    props: {
      attributes(state): Record<string, string> {
        return selectionInsideTable(state) ? { 'data-table-caret': 'true' } : {}
      }
    }
  })
}

export function createTableCaretPlugin(): MilkdownPlugin {
  return $prose(() => createTableCaretProsePlugin())
}
