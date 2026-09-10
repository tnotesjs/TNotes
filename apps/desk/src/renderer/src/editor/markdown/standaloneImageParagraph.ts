import { Plugin, PluginKey } from '@milkdown/kit/prose/state'
import { Decoration, DecorationSet } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'

import type { Node } from '@milkdown/kit/prose/model'

const pluginKey = new PluginKey('deskStandaloneImageParagraph')

export function isStandaloneImageParagraph(node: Node): boolean {
  if (node.type.name !== 'paragraph' || node.childCount === 0) return false
  for (let index = 0; index < node.childCount; index += 1) {
    if (node.child(index).type.name !== 'image') return false
  }
  return true
}

export const standaloneImageParagraphPlugin = $prose(
  () =>
    new Plugin({
      key: pluginKey,
      props: {
        decorations(state) {
          const decorations: Decoration[] = []
          state.doc.descendants((node, pos) => {
            if (!isStandaloneImageParagraph(node)) return
            decorations.push(
              Decoration.node(pos, pos + node.nodeSize, { class: 'desk-standalone-image' })
            )
          })
          return DecorationSet.create(state.doc, decorations)
        }
      }
    })
)
