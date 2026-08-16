/**
 * 右向紧凑树布局。
 * - 纯计算，不依赖 DOM；文本/图片尺寸通过参数注入，可独立单测。
 * - 列对齐：同一深度共享列宽（该层最大节点宽度）。
 * - y 分配：叶子顺序占槽，父节点居中于子树跨度。
 * - 折叠节点视为叶子；聚焦时以传入的子树根为布局根。
 */

import { visibleChildren } from '../model/document'
import type { MindmapNode } from '../model/document'

export interface TextMeasurer {
  measure(text: string): { width: number; height: number }
}

export interface NodeBox {
  id: string
  node: MindmapNode
  x: number
  y: number
  width: number
  height: number
  depth: number
  /** 所属一级分支（根的直接子节点）；根节点分支为自身 */
  branch: MindmapNode
}

export interface LinkPair {
  from: string
  to: string
}

export interface LayoutResult {
  boxes: Map<string, NodeBox>
  links: LinkPair[]
  width: number
  height: number
}

export interface LayoutOptions {
  measurer: TextMeasurer
  /** 图片 src → 宽高比（width/height）；0 表示加载失败；未知用默认值 */
  imageAspects?: ReadonlyMap<string, number>
  /** 聚焦子树时的布局根；默认文档根 */
  root?: MindmapNode
  gapX?: number
  gapY?: number
  padX?: number
  padY?: number
}

/** 渲染层与编辑器共享的尺寸常量 */
export const NODE_PAD_X = 12
export const NODE_PAD_Y = 6
export const CHECKBOX_WIDTH = 18
export const DEFAULT_IMAGE_WIDTH = 120
export const DEFAULT_IMAGE_ASPECT = 1.6

export function layoutTree(docRoot: MindmapNode, opts: LayoutOptions): LayoutResult {
  const gapX = opts.gapX ?? 48
  const gapY = opts.gapY ?? 10
  const padX = opts.padX ?? NODE_PAD_X
  const padY = opts.padY ?? NODE_PAD_Y
  const root = opts.root ?? docRoot
  const measurer = opts.measurer
  const aspects = opts.imageAspects

  const sizes = new Map<string, { w: number; h: number }>()
  const depthMaxW: number[] = []

  const measureNode = (n: MindmapNode, depth: number): void => {
    const t = measurer.measure(n.content.text || ' ')
    const cbW = n !== root && n.content.checked !== null ? CHECKBOX_WIDTH : 0
    let w = t.width + padX * 2 + cbW
    let h = Math.max(t.height, 16) + padY * 2
    if (n.content.image) {
      const iw = n.content.image.width ?? DEFAULT_IMAGE_WIDTH
      const aspect = aspects?.get(n.content.image.src) || DEFAULT_IMAGE_ASPECT
      const ih = iw / aspect
      w = Math.max(w, iw + padX * 2)
      h += ih + 6
    }
    sizes.set(n.id, { w, h })
    depthMaxW[depth] = Math.max(depthMaxW[depth] ?? 0, w)
    for (const c of visibleChildren(n)) measureNode(c, depth + 1)
  }
  measureNode(root, 0)

  // 各深度列的 x 起点
  const depthX: number[] = [0]
  for (let d = 1; d < depthMaxW.length; d++) {
    depthX[d] = depthX[d - 1] + (depthMaxW[d - 1] ?? 0) + gapX
  }

  const boxes = new Map<string, NodeBox>()
  const links: LinkPair[] = []
  let cursor = 0

  const place = (n: MindmapNode, depth: number, branch: MindmapNode): { top: number; bottom: number } => {
    const size = sizes.get(n.id)!
    const kids = visibleChildren(n)
    let y: number
    let top: number
    let bottom: number

    if (kids.length === 0) {
      y = cursor
      top = y
      bottom = y + size.h
      cursor = bottom + gapY
    } else {
      let first: { top: number; bottom: number } | null = null
      let last: { top: number; bottom: number } | null = null
      for (const c of kids) {
        const span = place(c, depth + 1, depth === 0 ? c : branch)
        if (!first) first = span
        last = span
        links.push({ from: n.id, to: c.id })
      }
      const mid = (first!.top + last!.bottom) / 2
      y = mid - size.h / 2
      top = Math.min(y, first!.top)
      bottom = Math.max(y + size.h, last!.bottom)
      cursor = Math.max(cursor, bottom + gapY)
    }

    boxes.set(n.id, { id: n.id, node: n, x: depthX[depth], y, width: size.w, height: size.h, depth, branch })
    return { top, bottom }
  }
  place(root, 0, root)

  const width = depthX[depthX.length - 1] + (depthMaxW[depthMaxW.length - 1] ?? 0)
  return { boxes, links, width, height: cursor }
}
