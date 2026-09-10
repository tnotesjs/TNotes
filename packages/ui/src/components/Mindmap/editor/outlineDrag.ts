import type { MindmapNode } from '@tnotesjs/mindmap-core'

export interface DropLevel {
  node: MindmapNode
  depth: number
}

/**
 * 根据横向指针位置解析“插到哪个祖先之后”。
 * 每越过一条缩进线就提升一级；是否为末子不影响提升，否则普通兄弟无法拖回顶层。
 */
export function resolveAfterDropLevel(
  anchor: MindmapNode,
  focusRoot: MindmapNode,
  clientX: number,
  indentEdge: number,
  depth: number,
  indent: number,
): DropLevel {
  let node = anchor
  let nextDepth = depth
  let edge = indentEdge
  while (node.parent && node.parent !== focusRoot && clientX <= edge && nextDepth > 0) {
    node = node.parent
    nextDepth -= 1
    edge -= indent
  }
  return { node, depth: nextDepth }
}
