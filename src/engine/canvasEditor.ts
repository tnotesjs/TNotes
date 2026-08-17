/**
 * CanvasEditor：脑图视图控制器。
 * 绑定无头会话 MindmapSession，负责 Canvas 渲染调度、键鼠交互与内联编辑。
 * 只在脑图视图激活时创建，视图切换走即销毁；全部文档状态保存在 session 中。
 */

import { layoutTree, NODE_PAD_X } from './layout/treeLayout'
import type { LayoutResult, TextMeasurer } from './layout/treeLayout'
import { isAncestor, snapshotDoc, visibleChildren } from './model/document'
import type { MindmapNode } from './model/document'
import { CanvasRenderer } from './render/canvasRenderer'
import type { DropIndicator, ViewTransform } from './render/canvasRenderer'
import { hitTest } from './render/hitTest'
import type { MindmapSession } from './session'

export interface CanvasEditorEvents {
  /** 请求打开搜索（Cmd/Ctrl+F） */
  onRequestSearch?: () => void
  /** 点击图片节点 */
  onImagePreview?: (src: string) => void
}

export function createCanvasMeasurer(font = `14px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`): TextMeasurer {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  ctx.font = font
  return {
    measure(text: string) {
      return { width: ctx.measureText(text).width, height: 21 }
    },
  }
}

const MIN_SCALE = 0.1
const MAX_SCALE = 3

export class CanvasEditor {
  private renderer: CanvasRenderer
  private layout!: LayoutResult
  private transform: ViewTransform = { x: 40, y: 40, k: 1 }
  private measurer: TextMeasurer
  private imageAspects = new Map<string, number>()

  private overlay: HTMLDivElement
  private editingInput: HTMLTextAreaElement | null = null
  private editingNode: MindmapNode | null = null

  private dragState: { id: string; startX: number; startY: number; dragging: boolean } | null = null
  private panState: { startX: number; startY: number; baseX: number; baseY: number } | null = null
  private panMoved = false
  private resizeState: { id: string; snapshot: string; moved: boolean } | null = null
  private suppressClick = false
  private currentIndicator: DropIndicator | null = null

  constructor(
    private container: HTMLElement,
    private session: MindmapSession,
    private events: CanvasEditorEvents = {},
    measurer?: TextMeasurer,
  ) {
    this.measurer = measurer ?? createCanvasMeasurer()

    container.classList.add('mm-editor')
    container.tabIndex = 0
    this.overlay = document.createElement('div')
    this.overlay.className = 'mm-overlay'

    this.renderer = new CanvasRenderer(container)
    this.renderer.onImageLoad = (src, aspect) => {
      this.imageAspects.set(src, aspect)
      this.relayout()
    }
    container.append(this.overlay)

    container.addEventListener('pointerdown', this.onPointerDown)
    container.addEventListener('click', this.onClick)
    container.addEventListener('dblclick', this.onDblClick)
    container.addEventListener('keydown', this.onKeydown)
    container.addEventListener('wheel', this.onWheel, { passive: false })
    window.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('pointerup', this.onPointerUp)

    session.on('change', this.onSessionChange)
    session.on('collapseChange', this.onSessionViewChange)
    session.on('focusChange', this.onSessionFocusChange)
    session.on('selectionChange', this.onSessionSelectionChange)
    session.on('matchChange', this.onSessionViewChange)

    this.relayout()
    // 初始 transform 立即同步；rAF 在后台标签页会暂停，加 setTimeout 兜底
    this.setTransform(this.transform)
    const initialFit = () => this.zoomToFit()
    requestAnimationFrame(initialFit)
    setTimeout(initialFit, 60)
  }

  // ---------- session 事件 ----------

  private onSessionChange = (): void => {
    this.relayout()
  }

  private onSessionViewChange = (): void => {
    this.relayout()
  }

  private onSessionFocusChange = (): void => {
    this.relayout()
    this.zoomToFit()
  }

  private onSessionSelectionChange = (): void => {
    this.pushRenderState()
  }

  // ---------- 渲染 ----------

  private relayout(): void {
    const root = this.session.focusRootNode
    this.layout = layoutTree(this.session.document.root, {
      measurer: this.measurer,
      imageAspects: this.imageAspects,
      root,
    })
    this.pushRenderState()
  }

  private pushRenderState(): void {
    if (!this.layout) return
    this.renderer.setLayout(this.layout, {
      root: this.session.focusRootNode,
      selection: new Set(this.session.selectedNode ? [this.session.selectedNode.id] : []),
      matches: new Set(this.session.matches),
      imageAspects: this.imageAspects,
    })
  }

  private setTransform(t: ViewTransform): void {
    this.transform = t
    this.renderer.setTransform(t)
  }

  // ---------- 视图控制 ----------

  zoomToFit(): void {
    const cw = this.container.clientWidth
    const ch = this.container.clientHeight
    if (!cw || !ch || !this.layout || this.layout.boxes.size === 0) return
    const pad = 80
    const k = Math.min(cw / (this.layout.width + pad), ch / (this.layout.height + pad), 1.25)
    // 适配允许低于手动缩放下限（巨型脑图也能一屏看全）
    const clamped = Math.min(Math.max(k, 0.02), MAX_SCALE)
    this.setTransform({
      x: (cw - this.layout.width * clamped) / 2,
      y: (ch - this.layout.height * clamped) / 2,
      k: clamped,
    })
  }

  zoomBy(factor: number): void {
    this.zoomAt(this.container.clientWidth / 2, this.container.clientHeight / 2, factor)
  }

  getScale(): number {
    return this.transform.k
  }

  /** 展开祖先、居中并选中（搜索/大纲定位） */
  centerOnNode(id: string, select = true): void {
    this.session.expandAncestors(id)
    if (select) this.session.select(id)
    const box = this.layout.boxes.get(id)
    if (!box) return
    const cw = this.container.clientWidth
    const ch = this.container.clientHeight
    const cx = box.x + box.width / 2
    const cy = box.y + box.height / 2
    this.setTransform({
      x: cw / 2 - cx * this.transform.k,
      y: ch / 2 - cy * this.transform.k,
      k: this.transform.k,
    })
  }

  /** 折叠/展开并保持被操作节点屏幕位置不动 */
  private toggleCollapseWithCompensation(id: string): void {
    const oldBox = this.layout.boxes.get(id)
    this.session.toggleCollapse(id)
    if (oldBox) {
      const newBox = this.layout.boxes.get(id)
      if (newBox) {
        const dx = newBox.x - oldBox.x
        const dy = newBox.y - oldBox.y
        if (dx !== 0 || dy !== 0) {
          this.setTransform({
            ...this.transform,
            x: this.transform.x - dx * this.transform.k,
            y: this.transform.y - dy * this.transform.k,
          })
        }
      }
    }
  }

  // ---------- 内联编辑 ----------

  startEdit(id: string): void {
    const node = this.session.document.find(id)
    const box = this.layout.boxes.get(id)
    if (!node || !box || this.editingInput) return

    this.session.select(id)
    const { k } = this.transform
    const input = document.createElement('textarea')
    input.className = 'mm-edit-input'
    input.value = node.content.raw
    input.rows = 1
    // 减 2px 补偿边框，使输入框与节点边框对齐
    input.style.left = `${box.x * k + this.transform.x - 2}px`
    input.style.top = `${box.y * k + this.transform.y - 2}px`
    input.style.height = `${(box.height + 4) * k}px`
    input.style.fontSize = `${14 * k}px`
    this.overlay.append(input)
    this.editingInput = input
    this.editingNode = node

    // 宽度随内容自适应（canvas 测量，与节点尺寸同口径）
    const syncWidth = () => {
      const m = this.measurer.measure(input.value || ' ')
      const worldWidth = Math.max(box.width, m.width + NODE_PAD_X * 2)
      input.style.width = `${worldWidth * k + 4}px`
    }
    syncWidth()
    input.addEventListener('input', syncWidth)

    input.focus()
    input.setSelectionRange(input.value.length, input.value.length)

    input.addEventListener('keydown', (e) => {
      e.stopPropagation()
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        const edited = node
        this.commitEdit()
        // 幕布式连续录入：提交后新建同级并继续编辑
        const created = this.session.insertSiblingOf(edited.id)
        if (created) this.startEdit(created.id)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        this.cancelEdit()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        // 编辑态 Tab：提交后新增子节点并继续编辑
        const edited = node
        this.commitEdit()
        const created = this.session.insertChildOf(edited.id)
        if (created) this.startEdit(created.id)
      }
    })
    input.addEventListener('blur', () => this.commitEdit())
    input.addEventListener('pointerdown', (e) => e.stopPropagation())
  }

  private commitEdit(): void {
    if (!this.editingInput || !this.editingNode) return
    const input = this.editingInput
    const node = this.editingNode
    this.editingInput = null
    this.editingNode = null
    const raw = input.value.trim()
    input.remove()
    if (raw && raw !== node.content.raw) {
      this.session.updateNodeRaw(node.id, raw)
    } else if (!raw && node.content.raw === '' && node !== this.session.document.root) {
      // 幕布行为：新建的空节点未输入内容即提交/取消 → 移除
      this.session.removeNode(node.id)
    } else {
      this.relayout()
    }
  }

  private cancelEdit(): void {
    if (!this.editingInput || !this.editingNode) return
    const input = this.editingInput
    const node = this.editingNode
    this.editingInput = null
    this.editingNode = null
    input.remove()
    if (node.content.raw === '' && node !== this.session.document.root) {
      this.session.removeNode(node.id)
    }
    this.container.focus()
  }

  // ---------- 键盘 ----------

  private onKeydown = (e: KeyboardEvent): void => {
    if (this.editingInput) return
    const mod = e.metaKey || e.ctrlKey
    const key = e.key.toLowerCase()
    const session = this.session

    if (mod && key === 'z') {
      e.preventDefault()
      if (e.shiftKey) session.redo()
      else session.undo()
      return
    }
    if (mod && key === 'y') {
      e.preventDefault()
      session.redo()
      return
    }
    if (mod && key === 'f') {
      e.preventDefault()
      this.events.onRequestSearch?.()
      return
    }
    // 升降级：Cmd/Ctrl + ] / [
    if (mod && e.key === ']') {
      e.preventDefault()
      const sel = session.selectedNode
      if (sel) session.indentNode(sel.id)
      return
    }
    if (mod && e.key === '[') {
      e.preventDefault()
      const sel = session.selectedNode
      if (sel) session.outdentNode(sel.id)
      return
    }

    const sel = session.selectedNode
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (sel) {
          const created = session.insertSiblingOf(sel.id)
          if (created) this.startEdit(created.id)
        }
        break
      case 'Tab':
        e.preventDefault()
        if (sel) {
          // 幕布/XMind 式：Tab 新增子节点并进入编辑
          const created = session.insertChildOf(sel.id)
          if (created) this.startEdit(created.id)
        }
        break
      case 'Delete':
      case 'Backspace':
        e.preventDefault()
        if (sel) session.removeNode(sel.id)
        break
      case 'F2':
        e.preventDefault()
        if (sel) this.startEdit(sel.id)
        break
      case 'ArrowUp':
        e.preventDefault()
        this.navigateVertical(-1)
        break
      case 'ArrowDown':
        e.preventDefault()
        this.navigateVertical(1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        if (sel) {
          if (sel.parent) session.select(sel.parent.id)
          else if (session.focusPath.length > 0) session.exitFocusTo(session.focusPath.length - 1)
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (sel) {
          if (sel.collapsed && sel.children.length > 0) {
            this.toggleCollapseWithCompensation(sel.id)
          } else {
            const first = visibleChildren(sel)[0]
            if (first) session.select(first.id)
          }
        }
        break
    }
  }

  private navigateVertical(dir: -1 | 1): void {
    const sorted = [...this.layout.boxes.values()].sort((a, b) => a.y + a.height / 2 - (b.y + b.height / 2))
    if (sorted.length === 0) return
    const selectedId = this.session.selectedNode?.id ?? null
    if (!selectedId) {
      this.session.select(sorted[0].id)
      return
    }
    const idx = sorted.findIndex((b) => b.id === selectedId)
    if (idx < 0) {
      this.session.select(sorted[0].id)
      return
    }
    const next = sorted[Math.max(0, Math.min(sorted.length - 1, idx + dir))]
    this.session.select(next.id)
  }

  // ---------- 指针交互 ----------

  private eventWorld(ev: PointerEvent | MouseEvent): { x: number; y: number } {
    const rect = this.container.getBoundingClientRect()
    return {
      x: (ev.clientX - rect.left - this.transform.x) / this.transform.k,
      y: (ev.clientY - rect.top - this.transform.y) / this.transform.k,
    }
  }

  private hit(ev: PointerEvent | MouseEvent) {
    const world = this.eventWorld(ev)
    return hitTest(this.layout.boxes.values(), world.x, world.y, {
      selectedId: this.session.selectedNode?.id ?? null,
      imageAspects: this.imageAspects,
    })
  }

  private onPointerDown = (ev: PointerEvent): void => {
    if (ev.button !== 0 || this.editingInput) return
    const hit = this.hit(ev)
    if (!hit) {
      // 空白：提交编辑 + 准备平移
      this.commitEdit()
      this.container.focus()
      this.panState = { startX: ev.clientX, startY: ev.clientY, baseX: this.transform.x, baseY: this.transform.y }
      this.panMoved = false
      return
    }
    if (hit.role === 'resize') {
      // 图片调宽：拖动前暂存快照，松手时再入历史
      this.resizeState = { id: hit.id, snapshot: snapshotDoc(this.session.document), moved: false }
      return
    }
    if (hit.role === 'collapse' || hit.role === 'checkbox') return
    this.dragState = { id: hit.id, startX: ev.clientX, startY: ev.clientY, dragging: false }
  }

  private onClick = (ev: MouseEvent): void => {
    if (this.suppressClick) return
    const hit = this.hit(ev)
    if (!hit) return
    const session = this.session
    const node = session.document.find(hit.id)
    if (!node) return
    switch (hit.role) {
      case 'checkbox':
        session.toggleChecked(hit.id)
        return
      case 'collapse':
        this.toggleCollapseWithCompensation(hit.id)
        return
      case 'link':
        if (node.content.link) window.open(node.content.link, '_blank', 'noopener')
        return
      case 'image':
        if (node.content.image) this.events.onImagePreview?.(node.content.image.src)
        return
      default:
        session.select(hit.id)
        this.container.focus()
        ev.preventDefault()
    }
  }

  private onDblClick = (ev: MouseEvent): void => {
    if (this.suppressClick) return
    const hit = this.hit(ev)
    if (hit && hit.role !== 'collapse') this.startEdit(hit.id)
  }

  private onPointerMove = (ev: PointerEvent): void => {
    if (this.resizeState) {
      const node = this.session.document.find(this.resizeState.id)
      const box = node ? this.layout.boxes.get(node.id) : null
      if (node?.content.image && box) {
        const world = this.eventWorld(ev)
        const imgW = node.content.image.width ?? 120
        const imgLeft = box.x + (box.width - imgW) / 2
        const newWidth = Math.min(Math.max(Math.round(world.x - imgLeft), 40), 800)
        if (newWidth !== node.content.image.width) {
          this.session.document.setImageWidth(node, newWidth)
          this.resizeState.moved = true
          this.relayout()
        }
      }
      this.suppressClick = true
      return
    }

    if (this.panState) {
      this.panMoved = true
      this.setTransform({
        ...this.transform,
        x: this.panState.baseX + (ev.clientX - this.panState.startX),
        y: this.panState.baseY + (ev.clientY - this.panState.startY),
      })
      this.suppressClick = true
      return
    }

    const drag = this.dragState
    if (!drag) return
    if (!drag.dragging) {
      const dist = Math.hypot(ev.clientX - drag.startX, ev.clientY - drag.startY)
      if (dist < 5) return
      drag.dragging = true
      this.session.select(drag.id)
    }
    this.suppressClick = true
    const world = this.eventWorld(ev)
    this.renderer.setDropIndicator(this.computeDrop(drag.id, world.x, world.y))
  }

  private onPointerUp = (): void => {
    if (this.resizeState) {
      const rs = this.resizeState
      this.resizeState = null
      if (rs.moved) {
        // 拖动中直接改了文档（未入历史），松手时把拖动前快照补记进历史
        this.session.recordSnapshot(rs.snapshot)
      }
      setTimeout(() => (this.suppressClick = false), 0)
      return
    }

    if (this.panState) {
      // 无位移的空白点击 = 取消选中
      if (!this.panMoved) this.session.select(null)
      this.panState = null
      this.panMoved = false
      setTimeout(() => (this.suppressClick = false), 0)
      return
    }
    const drag = this.dragState
    this.dragState = null
    if (!drag?.dragging) return
    const indicator = this.currentIndicator
    this.renderer.setDropIndicator(null)
    this.currentIndicator = null
    setTimeout(() => (this.suppressClick = false), 0)
    if (!indicator) return

    const session = this.session
    const node = session.document.find(drag.id)
    const target = session.document.find(indicator.targetId)
    if (!node || !target) return
    if (indicator.type === 'child') {
      session.moveNode(drag.id, target.id, target.children.length)
    } else if (target.parent) {
      const idx = target.parent.children.indexOf(target)
      session.moveNode(drag.id, target.parent.id, indicator.type === 'before' ? idx : idx + 1)
    }
    session.select(drag.id)
  }

  private computeDrop(dragId: string, wx: number, wy: number): DropIndicator | null {
    const doc = this.session.document
    const dragNode = doc.find(dragId)
    if (!dragNode) return null
    let best: DropIndicator | null = null
    for (const box of this.layout.boxes.values()) {
      if (box.id === dragId) continue
      if (wx < box.x - 8 || wx > box.x + box.width + 8 || wy < box.y - 8 || wy > box.y + box.height + 8) continue
      const target = box.node
      if (isAncestor(dragNode, target) || target === dragNode) continue
      const ratio = (wy - box.y) / box.height
      let type: DropIndicator['type']
      if (box.depth === 0) {
        type = 'child'
      } else if (ratio < 0.3) {
        type = 'before'
      } else if (ratio > 0.7) {
        type = 'after'
      } else {
        type = 'child'
      }
      best = { type, targetId: box.id }
      break
    }
    this.currentIndicator = best
    return best
  }

  private onWheel = (e: WheelEvent): void => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      const rect = this.container.getBoundingClientRect()
      this.zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0015))
    } else {
      this.setTransform({
        ...this.transform,
        x: this.transform.x - e.deltaX,
        y: this.transform.y - e.deltaY,
      })
    }
  }

  private zoomAt(px: number, py: number, factor: number): void {
    const k = Math.min(Math.max(this.transform.k * factor, MIN_SCALE), MAX_SCALE)
    const real = k / this.transform.k
    this.setTransform({
      x: px - (px - this.transform.x) * real,
      y: py - (py - this.transform.y) * real,
      k,
    })
  }

  destroy(): void {
    this.commitEdit()
    const session = this.session
    session.off('change', this.onSessionChange)
    session.off('collapseChange', this.onSessionViewChange)
    session.off('focusChange', this.onSessionFocusChange)
    session.off('selectionChange', this.onSessionSelectionChange)
    session.off('matchChange', this.onSessionViewChange)
    this.container.removeEventListener('pointerdown', this.onPointerDown)
    this.container.removeEventListener('click', this.onClick)
    this.container.removeEventListener('dblclick', this.onDblClick)
    this.container.removeEventListener('keydown', this.onKeydown)
    this.container.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
    this.renderer.destroy()
    this.overlay.remove()
  }
}
