import { Prec, type Extension } from '@codemirror/state'
import { EditorView as CodeMirrorView, keymap } from '@codemirror/view'
import { TextSelection } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'

import { LATEX_BLOCK_CLASS } from './codeBlockLatexPreview'

export function isEmptyLatexSource(source: string): boolean {
  return source.replace(/\r\n?/g, '\n').trim() === ''
}

export type LatexBackspaceAction = 'pass' | 'swallow' | 'delete-block'

/**
 * Tip/callout: empty body stays until a second Backspace at the start.
 * Crepe's code-block Backspace unwraps a 1-line formula into a paragraph
 * even when it still has content (caret at 0). Swallow that unwrap; only
 * delete the formula once the source is already empty.
 */
export function latexBackspaceAction(
  isLatex: boolean,
  docText: string,
  selection: { empty: boolean; anchor: number },
  rangeCount: number
): LatexBackspaceAction {
  if (!isLatex) return 'pass'
  if (rangeCount > 1) return 'pass'
  if (!selection.empty || selection.anchor > 0) return 'pass'
  return isEmptyLatexSource(docText) ? 'delete-block' : 'swallow'
}

export function isLatexCodeMirror(cm: CodeMirrorView): boolean {
  return Boolean(cm.dom.closest(`.${LATEX_BLOCK_CLASS}`))
}

function deleteLatexCodeBlock(cm: CodeMirrorView, pm: EditorView): boolean {
  const block = cm.dom.closest('.milkdown-code-block')
  if (!(block instanceof HTMLElement)) return true
  let pos: number | null = null
  try {
    const at = pm.posAtDOM(block, 0)
    const $pos = pm.state.doc.resolve(at)
    for (let depth = $pos.depth; depth >= 0; depth -= 1) {
      if ($pos.node(depth).type.name === 'code_block') {
        pos = $pos.before(depth)
        break
      }
    }
  } catch {
    return true
  }
  if (pos == null) return true
  const node = pm.state.doc.nodeAt(pos)
  if (!node || node.type.name !== 'code_block') return true
  const paragraph = pm.state.schema.nodes.paragraph
  if (!paragraph) return true
  const tr = pm.state.tr.replaceWith(pos, pos + node.nodeSize, paragraph.create())
  pm.dispatch(tr.setSelection(TextSelection.near(tr.doc.resolve(pos))).scrollIntoView())
  pm.focus()
  return true
}

export function handleLatexCodeBlockBackspace(
  cm: CodeMirrorView,
  pm: EditorView | null | undefined
): boolean {
  const main = cm.state.selection.main
  const action = latexBackspaceAction(
    isLatexCodeMirror(cm),
    cm.state.doc.toString(),
    { empty: main.empty, anchor: main.anchor },
    cm.state.selection.ranges.length
  )
  if (action === 'pass') return false
  if (action === 'swallow') return true
  if (!pm || pm.isDestroyed) return true
  return deleteLatexCodeBlock(cm, pm)
}

export function createLatexCodeBlockKeymap(getPmView: () => EditorView | null): Extension {
  return Prec.highest(
    keymap.of([
      {
        key: 'Backspace',
        run: (view) => handleLatexCodeBlockBackspace(view, getPmView())
      }
    ])
  )
}
