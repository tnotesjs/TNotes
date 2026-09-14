/**
 * 标题的 Backspace 行为：按一次直接回到正文，不论它是几级标题（与语雀对齐）。
 *
 * Milkdown 默认把 Backspace/Delete 绑在 `DowngradeHeading` 上，一次只降一级
 * （H2 → H1 → 正文），对「删标题」这个意图来说按几次取决于标题层级，很别扭。
 * 这里用更高优先级的 keymap 抢在它前面：光标在标题行首时，整个标题一次变正文。
 *
 * 只覆盖 **Backspace**：
 * - 光标不在行首、或选中有内容 → 放行（正常删字 / 合并块）；
 * - 标题末尾按 Delete 仍是「把下一块并进来」，不改（原来的 Delete 绑定保留）。
 */

import { setBlockType } from '@milkdown/kit/prose/commands'
import type { Command } from '@milkdown/kit/prose/state'
import { $shortcut } from '@milkdown/kit/utils'

/** 命中条件：空选区 + 光标在标题行首。 */
export const headingBackspaceToParagraph: Command = (state, dispatch) => {
  const { selection } = state
  if (!selection.empty) return false
  const { $from } = selection
  if ($from.parent.type.name !== 'heading') return false
  if ($from.parentOffset !== 0) return false
  const paragraph = state.schema.nodes.paragraph
  if (!paragraph) return false
  return setBlockType(paragraph)(state, dispatch)
}

/** 优先级高于 Milkdown 的默认键位（默认 50）。 */
export const headingKeymap = $shortcut(() => ({
  BackspaceToParagraph: {
    key: 'Backspace',
    priority: 100,
    onRun: () => headingBackspaceToParagraph
  }
}))
