/**
 * SVG 渲染器：节点（圆角矩形 + 文本 + checkbox/图片/链接）+ 贝塞尔连线。
 * 视口虚拟渲染：只为视口内（含边距）的节点/连线创建 DOM，pan/zoom 时增量重建。
 * 框架无关，仅依赖 DOM API。
 */

import type { LayoutResult, NodeBox } from '../layout/treeLayout'
import { CHECKBOX_WIDTH, DEFAULT_IMAGE_ASPECT, DEFAULT_IMAGE_WIDTH, NODE_PAD_X, NODE_PAD_Y } from '../layout/treeLayout'
import type { MindmapNode } from '../model/document'

export interface ViewTransform {
  x: number
  y: number
  k: number
}

export type NodeRole = 'body' | 'checkbox' | 'collapse' | 'link' | 'image'

export interface RendererEvents {
  onNodeClick(id: string, role: NodeRole, ev: MouseEvent): void
  onNodeDblClick(id: string, ev: MouseEvent): void
  onNodePointerDown(id: string, ev: PointerEvent): void
  onBackgroundPointerDown(ev: PointerEvent): void
}

export interface DropIndicator {
  type: 'child' | 'before' | 'after'
  targetId: string
}

export interface RenderState {
  root: MindmapNode
  selection: Set<string>
  matches: Set<string>
  imageAspects: ReadonlyMap<string, number>
}

const SVG_NS = 'http://www.w3.org/2000/svg'

/** 一级分支调色板（按分支序循环取色，幕布/markmap 风格） */
export const BRANCH_PALETTE = [
  '#4f8ef7',
  '#f2784b',
  '#45b787',
  '#9b6df3',
  '#e0639c',
  '#3fb6c9',
  '#d9a13b',
  '#7c8ff0',
]

const CULL_MARGIN = 240

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string> = {}): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag)
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v)
  return node
}

export class SvgRenderer {
  readonly svg: SVGSVGElement
  private viewportG: SVGGElement
  private linkG: SVGGElement
  private nodeG: SVGGElement
  private layout: LayoutResult | null = null
  private state: RenderState | null = null
  private transform: ViewTransform = { x: 0, y: 0, k: 1 }
  private branchColor = new Map<string, string>()
  private indicator: SVGElement | null = null
  private cullScheduled = false

  private onClick = (ev: MouseEvent) => {
    const target = ev.target as Element
    const g = target.closest?.('.mm-node') as SVGGElement | null
    if (!g) return
    const id = g.getAttribute('data-id')
    if (!id) return
    const roleEl = target.closest?.('[data-role]')
    const role = (roleEl?.getAttribute('data-role') ?? 'body') as NodeRole
    this.events.onNodeClick(id, role, ev)
  }

  private onDblClick = (ev: MouseEvent) => {
    const target = ev.target as Element
    const g = target.closest?.('.mm-node') as SVGGElement | null
    const id = g?.getAttribute('data-id')
    if (id) this.events.onNodeDblClick(id, ev)
  }

  private onPointerDown = (ev: PointerEvent) => {
    const target = ev.target as Element
    const g = target.closest?.('.mm-node') as SVGGElement | null
    const id = g?.getAttribute('data-id')
    if (id) this.events.onNodePointerDown(id, ev)
    else this.events.onBackgroundPointerDown(ev)
  }

  constructor(
    private container: HTMLElement,
    private events: RendererEvents,
  ) {
    this.svg = el('svg', { class: 'mm-svg' })
    this.viewportG = el('g', { class: 'mm-viewport' })
    this.linkG = el('g', { class: 'mm-links' })
    this.nodeG = el('g', { class: 'mm-nodes' })
    this.viewportG.append(this.linkG, this.nodeG)
    this.svg.append(this.viewportG)

    this.svg.addEventListener('click', this.onClick)
    this.svg.addEventListener('dblclick', this.onDblClick)
    this.svg.addEventListener('pointerdown', this.onPointerDown)

    container.append(this.svg)
  }

  setLayout(layout: LayoutResult, state: RenderState): void {
    this.layout = layout
    this.state = state
    this.computeBranchColors(state.root)
    this.scheduleCull()
  }

  setTransform(t: ViewTransform): void {
    this.transform = t
    this.viewportG.setAttribute('transform', `translate(${t.x},${t.y}) scale(${t.k})`)
    this.scheduleCull()
  }

  getTransform(): ViewTransform {
    return this.transform
  }

  getBox(id: string): NodeBox | null {
    return this.layout?.boxes.get(id) ?? null
  }

  getLayout(): LayoutResult | null {
    return this.layout
  }

  setSelection(selection: Set<string>): void {
    if (this.state) {
      this.state = { ...this.state, selection }
      this.scheduleCull()
    }
  }

  setMatches(matches: Set<string>): void {
    if (this.state) {
      this.state = { ...this.state, matches }
      this.scheduleCull()
    }
  }

  showDropIndicator(ind: DropIndicator | null): void {
    this.indicator?.remove()
    this.indicator = null
    if (!ind || !this.layout) return
    const box = this.layout.boxes.get(ind.targetId)
    if (!box) return
    if (ind.type === 'child') {
      this.indicator = el('rect', {
        class: 'mm-drop-child',
        x: String(box.x - 4),
        y: String(box.y - 4),
        width: String(box.width + 8),
        height: String(box.height + 8),
        rx: '8',
      })
    } else {
      const y = ind.type === 'before' ? box.y - 3 : box.y + box.height + 3
      this.indicator = el('rect', {
        class: 'mm-drop-sibling',
        x: String(box.x),
        y: String(y - 1.5),
        width: String(box.width),
        height: '3',
        rx: '1.5',
      })
    }
    this.viewportG.append(this.indicator)
  }

  /** 视口对应的世界坐标矩形（含边距） */
  private visibleWorldRect(): { x: number; y: number; w: number; h: number } {
    const cw = this.container.clientWidth || 800
    const ch = this.container.clientHeight || 600
    const { x, y, k } = this.transform
    return {
      x: -x / k - CULL_MARGIN,
      y: -y / k - CULL_MARGIN,
      w: cw / k + CULL_MARGIN * 2,
      h: ch / k + CULL_MARGIN * 2,
    }
  }

  private scheduleCull(): void {
    if (this.cullScheduled) return
    this.cullScheduled = true
    requestAnimationFrame(() => {
      this.cullScheduled = false
      this.draw()
    })
  }

  private computeBranchColors(root: MindmapNode): void {
    this.branchColor.clear()
    root.children.forEach((child, i) => {
      const color = BRANCH_PALETTE[i % BRANCH_PALETTE.length]
      const walk = (n: MindmapNode) => {
        this.branchColor.set(n.id, color)
        n.children.forEach(walk)
      }
      walk(child)
    })
    this.branchColor.set(root.id, '#5b6b8c')
  }

  private draw(): void {
    if (!this.layout || !this.state) return
    const rect = this.visibleWorldRect()
    const hit = (b: NodeBox) => b.x < rect.x + rect.w && b.x + b.width > rect.x && b.y < rect.y + rect.h && b.y + b.height > rect.y

    this.nodeG.replaceChildren()
    this.linkG.replaceChildren()

    for (const box of this.layout.boxes.values()) {
      if (hit(box)) this.nodeG.append(this.drawNode(box))
    }

    for (const link of this.layout.links) {
      const from = this.layout.boxes.get(link.from)!
      const to = this.layout.boxes.get(link.to)!
      // 连线两端任一可见才绘制
      if (!hit(from) && !hit(to)) continue
      const x1 = from.x + from.width
      const y1 = from.y + from.height / 2
      const x2 = to.x
      const y2 = to.y + to.height / 2
      const dx = Math.max(24, (x2 - x1) / 2)
      const path = el('path', {
        class: 'mm-link',
        d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`,
      })
      path.style.stroke = this.branchColor.get(link.to) ?? '#999'
      this.linkG.append(path)
    }
  }

  private drawNode(box: NodeBox): SVGGElement {
    const state = this.state!
    const node = box.node
    const isRoot = box.depth === 0
    const color = this.branchColor.get(node.id) ?? '#5b6b8c'
    const g = el('g', {
      class: 'mm-node',
      'data-id': box.id,
      transform: `translate(${box.x},${box.y})`,
    })
    if (state.selection.has(node.id)) g.classList.add('is-selected')
    if (state.matches.has(node.id)) g.classList.add('is-matched')

    const rect = el('rect', {
      class: isRoot ? 'mm-node-rect is-root' : 'mm-node-rect',
      width: String(box.width),
      height: String(box.height),
      rx: isRoot ? '10' : '6',
    })
    if (isRoot) {
      rect.style.fill = color
      rect.style.stroke = color
    } else {
      rect.style.stroke = color
    }
    g.append(rect)

    let textX = NODE_PAD_X
    // 任务 checkbox
    if (!isRoot && node.content.checked !== null) {
      const cbSize = 13
      const cbY = box.height / 2 - cbSize / 2
      const cb = el('rect', {
        class: 'mm-checkbox',
        'data-role': 'checkbox',
        x: String(NODE_PAD_X),
        y: String(cbY),
        width: String(cbSize),
        height: String(cbSize),
        rx: '3',
      })
      g.append(cb)
      if (node.content.checked) {
        g.append(
          el('path', {
            class: 'mm-checkbox-check',
            'data-role': 'checkbox',
            d: `M ${NODE_PAD_X + 2.5} ${cbY + 6.5} l 3 3 l 5.5 -6`,
          }),
        )
      }
      textX += CHECKBOX_WIDTH
    }

    const hasImage = node.content.image !== null
    const textY = hasImage ? NODE_PAD_Y + 10 : box.height / 2
    const text = el('text', {
      class: isRoot ? 'mm-node-text is-root' : 'mm-node-text',
      x: String(textX),
      y: String(textY),
      'dominant-baseline': hasImage ? 'auto' : 'central',
    })
    text.textContent = node.content.text || ' '
    g.append(text)

    // 链接图标（点击跳转）
    if (node.content.link && !isRoot) {
      const linkIcon = el('text', {
        class: 'mm-link-icon',
        'data-role': 'link',
        x: String(box.width - 14),
        y: String(NODE_PAD_Y + 9),
      })
      linkIcon.textContent = '↗'
      g.append(linkIcon)
    }

    // 图片缩略图
    if (node.content.image) {
      const img = node.content.image
      const iw = img.width ?? DEFAULT_IMAGE_WIDTH
      const aspect = state.imageAspects.get(img.src) || DEFAULT_IMAGE_ASPECT
      const ih = iw / aspect
      const ix = (box.width - iw) / 2
      const iy = NODE_PAD_Y + 20 + 3
      const failed = state.imageAspects.get(img.src) === 0
      if (failed) {
        g.append(
          el('rect', {
            class: 'mm-image-placeholder',
            'data-role': 'image',
            x: String(ix),
            y: String(iy),
            width: String(iw),
            height: String(ih),
            rx: '4',
          }),
        )
      } else {
        g.append(
          el('image', {
            class: 'mm-node-image',
            'data-role': 'image',
            x: String(ix),
            y: String(iy),
            width: String(iw),
            height: String(ih),
            href: img.src,
            preserveAspectRatio: 'xMidYMid meet',
          }),
        )
      }
    }

    // 折叠圆点（有子节点才显示）
    if (node.children.length > 0) {
      const dot = el('circle', {
        class: 'mm-collapse-dot',
        'data-role': 'collapse',
        cx: String(box.width),
        cy: String(box.height / 2),
        r: '7',
      })
      dot.style.stroke = color
      g.append(dot)
      if (node.collapsed) {
        dot.style.fill = color
        const count = el('text', {
          class: 'mm-collapse-count',
          'data-role': 'collapse',
          x: String(box.width + 10),
          y: String(box.height / 2),
          'dominant-baseline': 'central',
        })
        let n = 0
        node.children.forEach(function countAll(c) {
          n += 1
          c.children.forEach(countAll)
        })
        count.textContent = String(n)
        g.append(count)
      }
    }

    return g
  }

  destroy(): void {
    this.svg.removeEventListener('click', this.onClick)
    this.svg.removeEventListener('dblclick', this.onDblClick)
    this.svg.removeEventListener('pointerdown', this.onPointerDown)
    this.svg.remove()
  }
}
