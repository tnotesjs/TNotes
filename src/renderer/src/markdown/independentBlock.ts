import type { Node as ProseNode } from '@milkdown/kit/prose/model'

import { isStandaloneImageParagraph } from '../editor/markdown/standaloneImageParagraph'

/** Top-level cards that take block chrome, not text marks: images, fences,
 * raw containers, tables, atoms. A paragraph that also has typed text stays
 * a text line. */
export function isIndependentBlock(node: ProseNode): boolean {
  return (
    node.attrs.hidden !== true &&
    node.isBlock &&
    (node.isAtom ||
      node.type.name === 'code_block' ||
      node.type.spec.tableRole === 'table' ||
      isStandaloneImageParagraph(node))
  )
}

export function isStandaloneImageNode(doc: ProseNode, position: number, node: ProseNode): boolean {
  if (node.type.name !== 'image') return false
  const $pos = doc.resolve(position)
  return isStandaloneImageParagraph($pos.parent)
}
