/**
 * Canvas 渲染器：每帧全量重绘视口内元素（无 DOM 开销，支撑万级节点）。
 * 绘制：贝塞尔连线、圆角节点、文本、checkbox、图片（位图缓存）、折叠圆点、
 * 选中框、搜索高亮、拖拽指示、图片 resize 手柄。
 * 几何与命中检测共用 hitTest.ts 的 nodeGeometry，保证画点一致。
 */

import type { LayoutResult, NodeBox } from '../layout/treeLayout'
import type { MindmapNode } from '../model/document'
import { nodeGeometry } from './hitTest'

export interface ViewTransform {
  x: number
  y: number
  k: number
}

export interface DropIndicator {
  type: 'child' | 'before' | 'after'
  targetId: string
}

export interface CanvasRenderState {
  root: MindmapNode
  selection: Set<string>
  matches: Set<string>
  imageAspects: ReadonlyMap<string, number>
}

interface CanvasTheme {
  canvasBg: string
  nodeBg: string
  nodeBorder: string
  text: string
  rootBg: string
  rootText: string
  link: string
  accent: string
  matchBg: string
  dim: string
}

const LIGHT: CanvasTheme = {
  canvasBg: '#f7f8fa',
  nodeBg: '#ffffff',
  nodeBorder: '#c9d0da',
  text: '#2b3139',
  rootBg: '#2b3139',
  rootText: '#ffffff',
  link: '#b6bcc7',
  accent: '#4f8ef7',
  matchBg: 'rgba(255, 213, 79, 0.35)',
  dim: '#8a919e',
}

const DARK: CanvasTheme = {
  canvasBg: '#1e2126',
  nodeBg: '#2e323a',
  nodeBorder: '#4a4f58',
  text: '#dde1e7',
  rootBg: '#4a5261',
  rootText: '#ffffff',
  link: '#3a3e46',
  accent: '#6b9eff',
  matchBg: 'rgba(255, 213, 79, 0.3)',
  dim: '#7a828f',
}

const CULL_MARGIN = 240
const FONT_SIZE = 14
const FONT_FAMILY = `-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`

export class CanvasRenderer {
  readonly canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private layout: LayoutResult | null = null
  private state: CanvasRenderState | null = null
  private transform: ViewTransform = { x: 0, y: 0, k: 1 }
  private indicator: DropIndicator | null = null
  private images = new Map<string, HTMLImageElement>()
  private failedImages = new Set<string>()
  private drawScheduled = false
  private theme: CanvasTheme
  private resizeObserver: ResizeObserver
  private darkMedia: MediaQueryList
  private onDarkChange = () => {
    this.theme = this.darkMedia.matches ? DARK : LIGHT
    this.scheduleDraw()
  }

  /** 图片加载完成（成功或失败）时回调，编辑器据此更新宽高比并重排 */
  onImageLoad: ((src: string, aspect: number) => void) | null = null

  constructor(private container: HTMLElement) {
    this.canvas = document.createElement('canvas')
    this.canvas.className = 'mm-canvas'
    this.ctx = this.canvas.getContext('2d')!
    container.append(this.canvas)

    this.darkMedia = window.matchMedia('(prefers-color-scheme: dark)')
    this.theme = this.darkMedia.matches ? DARK : LIGHT
    this.darkMedia.addEventListener('change', this.onDarkChange)

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(container)
    this.resize()
  }

  private resize(): void {
    const dpr = window.devicePixelRatio || 1
    const cw = this.container.clientWidth
    const ch = this.container.clientHeight
    this.canvas.width = Math.max(1, Math.round(cw * dpr))
    this.canvas.height = Math.max(1, Math.round(ch * dpr))
    this.scheduleDraw()
  }

  setLayout(layout: LayoutResult, state: CanvasRenderState): void {
    this.layout = layout
    this.state = state
    this.preloadImages()
    this.scheduleDraw()
  }

  setTransform(t: ViewTransform): void {
    this.transform = t
    this.scheduleDraw()
  }

  setDropIndicator(indicator: DropIndicator | null): void {
    this.indicator = indicator
    this.scheduleDraw()
  }

  private preloadImages(): void {
    if (!this.layout) return
    for (const box of this.layout.boxes.values()) {
      const src = box.node.content.image?.src
      if (!src || this.images.has(src) || this.failedImages.has(src)) continue
      this.failedImages.add(src) // 占位防重复加载；成功后移入 images
      const img = new Image()
      img.onload = () => {
        this.images.set(src, img)
        this.failedImages.delete(src)
        const aspect = img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : 0
        this.onImageLoad?.(src, aspect)
      }
      img.onerror = () => {
        this.onImageLoad?.(src, 0)
      }
      img.src = src
    }
  }

  scheduleDraw(): void {
    if (this.drawScheduled) return
    this.drawScheduled = true
    const run = () => {
      if (!this.drawScheduled) return
      this.drawScheduled = false
      this.draw()
    }
    requestAnimationFrame(run)
    // 后台标签页 rAF 暂停，setTimeout 兜底
    setTimeout(run, 50)
  }

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

  private draw(): void {
    const dpr = window.devicePixelRatio || 1
    const cw = this.container.clientWidth
    const ch = this.container.clientHeight
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.ctx.clearRect(0, 0, cw, ch)
    if (!this.layout || !this.state) return

    const { x, y, k } = this.transform
    this.ctx.translate(x, y)
    this.ctx.scale(k, k)

    const rect = this.visibleWorldRect()
    const hit = (b: NodeBox) =>
      b.x < rect.x + rect.w && b.x + b.width > rect.x && b.y < rect.y + rect.h && b.y + b.height > rect.y

    // 连线
    this.ctx.lineWidth = 1.5
    this.ctx.strokeStyle = this.theme.link
    for (const link of this.layout.links) {
      const from = this.layout.boxes.get(link.from)!
      const to = this.layout.boxes.get(link.to)!
      if (!hit(from) && !hit(to)) continue
      const x1 = from.x + from.width
      const y1 = from.y + from.height / 2
      const x2 = to.x
      const y2 = to.y + to.height / 2
      const dx = Math.max(24, (x2 - x1) / 2)
      this.ctx.beginPath()
      this.ctx.moveTo(x1, y1)
      this.ctx.bezierCurveTo(x1 + dx, y1, x2 - dx, y2, x2, y2)
      this.ctx.stroke()
    }

    // 节点
    for (const box of this.layout.boxes.values()) {
      if (hit(box)) this.drawNode(box)
    }

    // 拖拽指示
    if (this.indicator) {
      const box = this.layout.boxes.get(this.indicator.targetId)
      if (box) this.drawDropIndicator(box)
    }

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  private drawNode(box: NodeBox): void {
    const ctx = this.ctx
    const theme = this.theme
    const state = this.state!
    const node = box.node
    const isRoot = box.depth === 0
    const geo = nodeGeometry(box, state.imageAspects, state.selection.has(node.id))

    ctx.save()
    ctx.translate(box.x, box.y)

    // 搜索高亮底
    if (state.matches.has(node.id)) {
      ctx.fillStyle = theme.matchBg
      ctx.beginPath()
      ctx.roundRect(-3, -3, box.width + 6, box.height + 6, 8)
      ctx.fill()
    }

    // 节点框
    ctx.beginPath()
    ctx.roundRect(0, 0, box.width, box.height, isRoot ? 10 : 6)
    if (isRoot) {
      ctx.fillStyle = theme.rootBg
      ctx.fill()
    } else {
      ctx.fillStyle = theme.nodeBg
      ctx.fill()
      ctx.strokeStyle = theme.nodeBorder
      ctx.lineWidth = 1.5
      ctx.stroke()
    }

    // 选中框（线宽按缩放补偿，保持屏幕上恒定）
    if (state.selection.has(node.id)) {
      ctx.beginPath()
      ctx.roundRect(0, 0, box.width, box.height, isRoot ? 10 : 6)
      ctx.strokeStyle = theme.accent
      ctx.lineWidth = 2.5 / this.transform.k
      ctx.stroke()
    }

    // 任务 checkbox
    if (geo.checkboxRect) {
      const cb = geo.checkboxRect
      ctx.beginPath()
      ctx.roundRect(cb.x, cb.y, cb.w, cb.h, 3)
      ctx.strokeStyle = theme.dim
      ctx.lineWidth = 1.2
      ctx.stroke()
      if (node.content.checked) {
        ctx.beginPath()
        ctx.moveTo(cb.x + 2.5, cb.y + cb.h / 2)
        ctx.lineTo(cb.x + 5.5, cb.y + cb.h - 3.5)
        ctx.lineTo(cb.x + cb.w - 2.5, cb.y + 2.5)
        ctx.strokeStyle = theme.accent
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      }
    }

    // 文本
    ctx.font = `${isRoot ? '600 ' : ''}${isRoot ? 15 : FONT_SIZE}px ${FONT_FAMILY}`
    ctx.textBaseline = 'middle'
    ctx.fillStyle = isRoot ? theme.rootText : theme.text
    ctx.fillText(node.content.text || ' ', geo.textX, geo.textY)

    // 链接图标
    if (geo.linkIconRect) {
      ctx.font = `11px ${FONT_FAMILY}`
      ctx.fillStyle = theme.dim
      ctx.fillText('↗', geo.linkIconRect.x + 6, geo.linkIconRect.y + 8)
    }

    // 图片
    if (geo.imageRect && node.content.image) {
      const ir = geo.imageRect
      const img = this.images.get(node.content.image.src)
      if (img) {
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(ir.x, ir.y, ir.w, ir.h, 4)
        ctx.clip()
        ctx.drawImage(img, ir.x, ir.y, ir.w, ir.h)
        ctx.restore()
      } else {
        // 占位（加载中或失败）
        ctx.beginPath()
        ctx.roundRect(ir.x, ir.y, ir.w, ir.h, 4)
        ctx.fillStyle = theme.matchBg
        ctx.fill()
        ctx.setLineDash([4, 3])
        ctx.strokeStyle = theme.nodeBorder
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.setLineDash([])
      }
      // resize 手柄
      if (geo.resizeHandle) {
        ctx.beginPath()
        ctx.arc(geo.resizeHandle.cx - box.x, geo.resizeHandle.cy - box.y, geo.resizeHandle.r, 0, Math.PI * 2)
        ctx.fillStyle = theme.nodeBg
        ctx.fill()
        ctx.strokeStyle = theme.accent
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    // 折叠圆点
    if (geo.collapseDot) {
      const { r } = geo.collapseDot
      ctx.beginPath()
      ctx.arc(box.width, box.height / 2, r, 0, Math.PI * 2)
      if (node.collapsed) {
        ctx.fillStyle = theme.accent
        ctx.fill()
        ctx.font = `11px ${FONT_FAMILY}`
        ctx.fillStyle = theme.dim
        ctx.textBaseline = 'middle'
        let n = 0
        node.children.forEach(function countAll(c) {
          n += 1
          c.children.forEach(countAll)
        })
        ctx.fillText(String(n), box.width + r + 4, box.height / 2)
      } else {
        ctx.fillStyle = theme.canvasBg
        ctx.fill()
        ctx.strokeStyle = theme.dim
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }

    ctx.restore()
  }

  private drawDropIndicator(box: NodeBox): void {
    const ctx = this.ctx
    const theme = this.theme
    if (!this.indicator) return
    if (this.indicator.type === 'child') {
      ctx.beginPath()
      ctx.roundRect(box.x - 4, box.y - 4, box.width + 8, box.height + 8, 8)
      ctx.setLineDash([6, 4])
      ctx.strokeStyle = theme.accent
      ctx.lineWidth = 2 / this.transform.k
      ctx.stroke()
      ctx.setLineDash([])
    } else {
      const y = this.indicator.type === 'before' ? box.y - 3 : box.y + box.height + 3
      ctx.beginPath()
      ctx.roundRect(box.x, y - 1.5, box.width, 3, 1.5)
      ctx.fillStyle = theme.accent
      ctx.fill()
    }
  }

  destroy(): void {
    this.resizeObserver.disconnect()
    this.darkMedia.removeEventListener('change', this.onDarkChange)
    this.canvas.remove()
  }
}
