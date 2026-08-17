/**
 * 命中检测与节点几何计算（纯函数，可单测）。
 * Canvas 渲染器与画布编辑器共用同一套几何，保证「画出来的」和「点得到的」一致。
 */

import type { NodeBox } from '../layout/treeLayout'
import { CHECKBOX_WIDTH, DEFAULT_IMAGE_ASPECT, DEFAULT_IMAGE_WIDTH, NODE_PAD_X, NODE_PAD_Y } from '../layout/treeLayout'

export type HitRole = 'body' | 'checkbox' | 'collapse' | 'link' | 'image' | 'resize'

export interface HitResult {
  id: string
  role: HitRole
}

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface NodeGeometry {
  isRoot: boolean
  /** 文本起点（相对节点左上角） */
  textX: number
  textY: number
  checkboxRect: Rect | null
  imageRect: Rect | null
  /** 折叠圆点（世界坐标） */
  collapseDot: { cx: number; cy: number; r: number } | null
  linkIconRect: Rect | null
  /** 图片调宽手柄（世界坐标，仅选中时存在） */
  resizeHandle: { cx: number; cy: number; r: number } | null
}

const TEXT_LINE_HEIGHT = 21
const CHECKBOX_SIZE = 13
const COLLAPSE_R = 7
const RESIZE_R = 6

export function nodeGeometry(
  box: NodeBox,
  imageAspects: ReadonlyMap<string, number>,
  selected: boolean,
): NodeGeometry {
  const node = box.node
  const isRoot = box.depth === 0
  const hasCheckbox = !isRoot && node.content.checked !== null
  const hasImage = node.content.image !== null

  const textX = NODE_PAD_X + (hasCheckbox ? CHECKBOX_WIDTH : 0)
  const textY = hasImage ? NODE_PAD_Y + TEXT_LINE_HEIGHT / 2 : box.height / 2

  let imageRect: Rect | null = null
  let resizeHandle: NodeGeometry['resizeHandle'] = null
  if (node.content.image) {
    const img = node.content.image
    const iw = img.width ?? DEFAULT_IMAGE_WIDTH
    const aspect = imageAspects.get(img.src) || DEFAULT_IMAGE_ASPECT
    const ih = iw / aspect
    imageRect = {
      x: (box.width - iw) / 2,
      y: NODE_PAD_Y + TEXT_LINE_HEIGHT + 3,
      w: iw,
      h: ih,
    }
    if (selected) {
      resizeHandle = {
        cx: box.x + imageRect.x + iw,
        cy: box.y + imageRect.y + ih,
        r: RESIZE_R,
      }
    }
  }

  return {
    isRoot,
    textX,
    textY,
    checkboxRect: hasCheckbox
      ? { x: NODE_PAD_X, y: box.height / 2 - CHECKBOX_SIZE / 2, w: CHECKBOX_SIZE, h: CHECKBOX_SIZE }
      : null,
    imageRect,
    collapseDot:
      node.children.length > 0 ? { cx: box.x + box.width, cy: box.y + box.height / 2, r: COLLAPSE_R } : null,
    linkIconRect:
      node.content.link && !isRoot ? { x: box.width - 22, y: NODE_PAD_Y, w: 22, h: 16 } : null,
    resizeHandle,
  }
}

function inRect(px: number, py: number, rect: Rect, base: { x: number; y: number }): boolean {
  return px >= base.x + rect.x && px <= base.x + rect.x + rect.w && py >= base.y + rect.y && py <= base.y + rect.y + rect.h
}

function inCircle(px: number, py: number, cx: number, cy: number, r: number): boolean {
  return Math.hypot(px - cx, py - cy) <= r
}

export interface HitTestOptions {
  selectedId: string | null
  imageAspects: ReadonlyMap<string, number>
}

/** 世界坐标命中检测；返回 null 表示点在空白处 */
export function hitTest(
  boxes: Iterable<NodeBox>,
  x: number,
  y: number,
  opts: HitTestOptions,
): HitResult | null {
  for (const box of boxes) {
    if (x < box.x - 6 || x > box.x + box.width + 12 || y < box.y - 6 || y > box.y + box.height + 6) continue
    const geo = nodeGeometry(box, opts.imageAspects, box.id === opts.selectedId)

    if (geo.resizeHandle && inCircle(x, y, geo.resizeHandle.cx, geo.resizeHandle.cy, geo.resizeHandle.r + 4)) {
      return { id: box.id, role: 'resize' }
    }
    if (geo.collapseDot && inCircle(x, y, geo.collapseDot.cx, geo.collapseDot.cy, geo.collapseDot.r + 4)) {
      return { id: box.id, role: 'collapse' }
    }
    if (geo.checkboxRect && inRect(x, y, geo.checkboxRect, box)) {
      return { id: box.id, role: 'checkbox' }
    }
    if (geo.linkIconRect && inRect(x, y, geo.linkIconRect, box)) {
      return { id: box.id, role: 'link' }
    }
    if (geo.imageRect && inRect(x, y, geo.imageRect, box)) {
      return { id: box.id, role: 'image' }
    }
    if (x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height) {
      return { id: box.id, role: 'body' }
    }
  }
  return null
}
