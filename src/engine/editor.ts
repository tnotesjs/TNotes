/**
 * MindmapEditor：思维导图编辑器门面。
 * 组合 文档模型 / Markdown 双向转换 / 历史栈 / 布局 / SVG 渲染，
 * 对外暴露编辑操作、事件订阅与视图控制，是 engine 的唯一入口。
 */

import { History } from './commands/history'
import { DEFAULT_IMAGE_WIDTH, layoutTree, NODE_PAD_X } from './layout/treeLayout'
import type { LayoutResult, TextMeasurer } from './layout/treeLayout'
import { parseMarkdown } from './markdown/parser'
import { serializeMarkdown } from './markdown/serializer'
import { isAncestor, MindmapDocument, restoreDoc, snapshotDoc, visibleChildren } from './model/document'
import type { MindmapNode } from './model/document'
import { SvgRenderer } from './render/svgRenderer'
import type { DropIndicator, NodeRole, ViewTransform } from './render/svgRenderer'

export interface EditorOptions {
  markdown?: string
  fileName?: string
  measurer?: TextMeasurer
}

export interface EditorEvents {
  /** 文档变更，payload 为最新 markdown */
  change: string
  selectionChange: string | null
  /** 折叠/展开等视图态变化（markdown 不变，驱动大纲等 UI 刷新） */
  collapseChange: null
  /** 聚焦路径变化，payload 为从根到聚焦根的标题数组 */
  focusChange: string[]
  /** 警告信息（如文件含非脑图内容） */
  warning: string
  /** 请求打开搜索（Cmd/Ctrl+F） */
  requestSearch: null
  /** 点击图片节点，payload 为图片 src */
  imagePreview: string
}

type Handler<T> = (payload: T) => void

export function createCanvasMeasurer(font = '14px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif'): TextMeasurer {
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

export class MindmapEditor {
  private doc: MindmapDocument
  private history = new History()
  private renderer: SvgRenderer
  private layout!: LayoutResult
  private transform: ViewTransform = { x: 40, y: 40, k: 1 }
  private selectedId: string | null = null
  private matchIds = new Set<string>()
  private imageAspects = new Map<string, number>()
  private focusStack: MindmapNode[] = []
  private measurer: TextMeasurer
  private fileName: string

  private overlay: HTMLDivElement
  private editingInput: HTMLTextAreaElement | null = null
  private editingNode: MindmapNode | null = null

  private listeners = new Map<keyof EditorEvents, Set<Handler<never>>>()

  private dragState: { id: string; startX: number; startY: number; dragging: boolean } | null = null
  private panState: { startX: number; startY: number; baseX: number; baseY: number } | null = null
  private panMoved = false
  private resizeState: { id: string; snapshot: string; moved: boolean } | null = null
  private suppressClick = false
  private resizeObserver: ResizeObserver | null = null

  constructor(
    private container: HTMLElement,
    options: EditorOptions = {},
  ) {
    this.fileName = options.fileName ?? '未命名'
    this.measurer = options.measurer ?? createCanvasMeasurer()

    container.classList.add('mm-editor')
    container.tabIndex = 0
    this.overlay = document.createElement('div')
    this.overlay.className = 'mm-overlay'

    const result = parseMarkdown(options.markdown ?? '', this.cleanFileName())
    this.doc = result.doc
    if (result.hasExtraContent) {
      queueMicrotask(() => this.emit('warning', '该文件含非脑图内容，保存后将仅保留脑图部分（H1 + 无序列表）'))
    }

    this.renderer = new SvgRenderer(container, {
      onNodeClick: (id, role, ev) => this.handleNodeClick(id, role, ev),
      onNodeDblClick: (id) => this.handleNodeDblClick(id),
      onNodePointerDown: (id, role, ev) => this.handleNodePointerDown(id, role, ev),
      onBackgroundPointerDown: (ev) => this.handleBackgroundPointerDown(ev),
    })
    container.append(this.overlay)

    container.addEventListener('keydown', this.onKeydown)
    container.addEventListener('wheel', this.onWheel, { passive: false })
    window.addEventListener('pointermove', this.onPointerMove)
    window.addEventListener('pointerup', this.onPointerUp)

    this.resizeObserver = new ResizeObserver(() => {
      this.renderer.setTransform(this.transform)
    })
    this.resizeObserver.observe(container)

    this.relayout()
    // 初始 transform 立即同步给渲染器；rAF 在后台标签页会暂停，加 setTimeout 兜底
    this.setTransform(this.transform)
    const initialFit = () => this.zoomToFit()
    requestAnimationFrame(initialFit)
    setTimeout(initialFit, 60)
  }

  // ---------- 事件 ----------

  on<K extends keyof EditorEvents>(event: K, handler: Handler<EditorEvents[K]>): void {
    let set = this.listeners.get(event)
    if (!set) {
      set = new Set()
      this.listeners.set(event, set)
    }
    set.add(handler as Handler<never>)
  }

  private emit<K extends keyof EditorEvents>(event: K, payload: EditorEvents[K]): void {
    this.listeners.get(event)?.forEach((h) => (h as Handler<EditorEvents[K]>)(payload))
  }

  // ---------- 基础访问 ----------

  get document(): MindmapDocument {
    return this.doc
  }

  get focusRootNode(): MindmapNode {
    return this.focusStack.length > 0 ? this.focusStack[this.focusStack.length - 1] : this.doc.root
  }

  get focusPath(): MindmapNode[] {
    return [...this.focusStack]
  }

  get selectedNode(): MindmapNode | null {
    return this.selectedId ? this.doc.find(this.selectedId) : null
  }

  getMarkdown(): string {
    return serializeMarkdown(this.doc)
  }

  /** 外部同步（Markdown 面板输入 / 打开新文件），不进入撤销历史 */
  setMarkdown(md: string): void {
    const result = parseMarkdown(md, this.cleanFileName())
    this.doc = result.doc
    this.history.clear()
    this.focusStack = []
    if (this.selectedId && !this.doc.find(this.selectedId)) this.selectedId = null
    if (result.hasExtraContent) {
      this.emit('warning', '该文件含非脑图内容，保存后将仅保留脑图部分（H1 + 无序列表）')
    }
    this.relayout()
    // rAF 在后台标签页会暂停，加 setTimeout 兜底
    requestAnimationFrame(() => this.zoomToFit())
    setTimeout(() => this.zoomToFit(), 60)
  }

  get canUndo(): boolean {
    return this.history.canUndo
  }

  get canRedo(): boolean {
    return this.history.canRedo
  }

  undo(): void {
    const snap = this.history.undo(snapshotDoc(this.doc))
    if (snap === null) return
    this.restoreSnapshot(snap)
  }

  redo(): void {
    const snap = this.history.redo(snapshotDoc(this.doc))
    if (snap === null) return
    this.restoreSnapshot(snap)
  }

  /** 恢复快照；折叠状态属于视图态，沿用恢复前的 */
  private restoreSnapshot(snap: string): void {
    const collapsed = new Map<string, boolean>()
    this.doc.traverse((n) => collapsed.set(n.id, n.collapsed))
    this.doc = restoreDoc(snap)
    this.doc.traverse((n) => {
      const c = collapsed.get(n.id)
      if (c !== undefined) n.collapsed = c
    })
    if (this.selectedId && !this.doc.find(this.selectedId)) this.selectedId = null
    this.focusStack = this.focusStack.filter((n) => this.doc.find(n.id))
    this.relayout()
    this.emit('change', this.getMarkdown())
    this.emit('focusChange', this.focusTitles())
  }

  // ---------- 编辑操作（供键盘 / 大纲 / 工具栏调用） ----------

  select(id: string | null): void {
    if (this.selectedId === id) return
    this.selectedId = id
    this.renderer.setSelection(new Set(id ? [id] : []))
    this.emit('selectionChange', id)
  }

  updateNodeRaw(id: string, raw: string): void {
    const node = this.doc.find(id)
    if (!node || node.content.raw === raw.trim()) return
    this.mutate(() => this.doc.updateRaw(node, raw))
  }

  toggleChecked(id: string): void {
    const node = this.doc.find(id)
    if (node) this.mutate(() => this.doc.toggleChecked(node))
  }

  setImageWidth(id: string, width: number | null): void {
    const node = this.doc.find(id)
    if (node) this.mutate(() => this.doc.setImageWidth(node, width))
  }

  toggleCollapse(id: string): void {
    const node = this.doc.find(id)
    if (!node || node.children.length === 0) return
    // 折叠是视图态：不进历史
    const oldBox = this.layout.boxes.get(id)
    this.doc.toggleCollapse(node)
    this.relayout()
    // 位置补偿：保持被操作节点在屏幕上不动，其它节点围绕它调整
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
    this.emit('collapseChange', null)
  }

  insertChildOf(id: string): MindmapNode | null {
    const parent = this.doc.find(id)
    if (!parent) return null
    let created: MindmapNode | null = null
    this.mutate(() => {
      parent.collapsed = false
      created = this.doc.insertChild(parent, parent.children.length, '')
    })
    return created
  }

  insertSiblingOf(id: string): MindmapNode | null {
    const node = this.doc.find(id)
    if (!node) return null
    let created: MindmapNode | null = null
    this.mutate(() => {
      created = this.doc.insertAfter(node, '')
    })
    return created
  }

  indentNode(id: string): void {
    const node = this.doc.find(id)
    if (!node) return
    this.mutate(() => {
      this.doc.indent(node)
    })
  }

  outdentNode(id: string): void {
    const node = this.doc.find(id)
    if (!node) return
    this.mutate(() => {
      this.doc.outdent(node)
    })
  }

  removeNode(id: string): void {
    const node = this.doc.find(id)
    if (!node || node === this.doc.root) return
    let nextSelect: string | null = null
    this.mutate(() => {
      const pos = this.doc.remove(node)!
      const siblings = pos.parent.children
      const next = siblings[pos.index] ?? siblings[pos.index - 1] ?? pos.parent
      nextSelect = next === this.doc.root && siblings.length > 0 ? (siblings[0]?.id ?? null) : next.id
    })
    this.select(nextSelect)
  }

  moveNode(id: string, newParentId: string, index: number): boolean {
    const node = this.doc.find(id)
    const parent = this.doc.find(newParentId)
    if (!node || !parent) return false
    let ok = false
    this.mutate(() => {
      parent.collapsed = false
      ok = this.doc.move(node, parent, index)
    })
    return ok
  }

  // ---------- 聚焦 ----------

  focusSelected(): void {
    const node = this.selectedNode
    if (!node || node === this.focusRootNode) return
    this.focusStack.push(node)
    this.relayout()
    this.zoomToFit()
    this.emit('focusChange', this.focusTitles())
  }

  /** 退到聚焦路径的第 index 层；index < 0 表示完全退出 */
  exitFocusTo(index: number): void {
    this.focusStack.length = Math.max(0, index)
    this.relayout()
    this.zoomToFit()
    this.emit('focusChange', this.focusTitles())
  }

  private focusTitles(): string[] {
    return this.focusStack.map((n) => n.content.text)
  }

  // ---------- 搜索 ----------

  setMatchHighlight(ids: Set<string>): void {
    this.matchIds = ids
    this.renderer.setMatches(ids)
  }

  /** 展开祖先折叠、居中并选中 */
  centerOnNode(id: string, select = true): void {
    const node = this.doc.find(id)
    if (!node) return
    let p = node.parent
    let changed = false
    while (p) {
      if (p.collapsed) {
        p.collapsed = false
        changed = true
      }
      p = p.parent
    }
    if (changed) this.relayout()
    if (select) this.select(id)
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

  // ---------- 视图控制 ----------

  zoomToFit(): void {
    const cw = this.container.clientWidth
    const ch = this.container.clientHeight
    if (!cw || !ch || this.layout.boxes.size === 0) return
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
    const cw = this.container.clientWidth
    const ch = this.container.clientHeight
    this.zoomAt(cw / 2, ch / 2, factor)
  }

  getScale(): number {
    return this.transform.k
  }

  startEdit(id: string): void {
    const node = this.doc.find(id)
    const box = this.layout.boxes.get(id)
    if (!node || !box || this.editingInput) return

    this.select(id)
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
        const created = this.insertSiblingOf(edited.id)
        if (created) this.startEdit(created.id)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        this.cancelEdit()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        // 编辑态 Tab：提交后新增子节点并继续编辑
        const edited = node
        this.commitEdit()
        const created = this.insertChildOf(edited.id)
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
      this.mutate(() => this.doc.updateRaw(node, raw))
    } else if (!raw && node.content.raw === '' && node !== this.doc.root) {
      // 幕布行为：新建的空节点未输入内容即提交/取消 → 移除
      this.removeNode(node.id)
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
    if (node.content.raw === '' && node !== this.doc.root) {
      this.removeNode(node.id)
    }
    this.container.focus()
  }

  // ---------- 内部 ----------

  private cleanFileName(): string {
    return this.fileName.replace(/\.(tn-mindmap\.)?md$/i, '')
  }

  private mutate(fn: () => void): void {
    this.history.record(snapshotDoc(this.doc))
    fn()
    this.relayout()
    this.emit('change', this.getMarkdown())
  }

  private relayout(): void {
    const root = this.focusRootNode
    this.layout = layoutTree(this.doc.root, {
      measurer: this.measurer,
      imageAspects: this.imageAspects,
      root,
    })
    this.renderer.setLayout(this.layout, {
      root,
      selection: new Set(this.selectedId ? [this.selectedId] : []),
      matches: this.matchIds,
      imageAspects: this.imageAspects,
    })
    this.loadImageAspects()
  }

  private setTransform(t: ViewTransform): void {
    this.transform = t
    this.renderer.setTransform(t)
  }

  private loadImageAspects(): void {
    this.doc.traverse((n) => {
      const src = n.content.image?.src
      if (!src || this.imageAspects.has(src)) return
      const img = new Image()
      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          this.imageAspects.set(src, img.naturalWidth / img.naturalHeight)
          this.relayout()
        } else {
          this.imageAspects.set(src, 0)
          this.relayout()
        }
      }
      img.onerror = () => {
        this.imageAspects.set(src, 0)
        this.relayout()
      }
      img.src = src
    })
  }

  // ---------- 键鼠交互 ----------

  private onKeydown = (e: KeyboardEvent): void => {
    if (this.editingInput) return
    const mod = e.metaKey || e.ctrlKey
    const key = e.key.toLowerCase()

    if (mod && key === 'z') {
      e.preventDefault()
      if (e.shiftKey) this.redo()
      else this.undo()
      return
    }
    if (mod && key === 'y') {
      e.preventDefault()
      this.redo()
      return
    }
    if (mod && key === 'f') {
      e.preventDefault()
      this.emit('requestSearch', null)
      return
    }
    // 升降级：Cmd/Ctrl + ] / [
    if (mod && e.key === ']') {
      e.preventDefault()
      const sel = this.selectedNode
      if (sel) this.indentNode(sel.id)
      return
    }
    if (mod && e.key === '[') {
      e.preventDefault()
      const sel = this.selectedNode
      if (sel) this.outdentNode(sel.id)
      return
    }

    const sel = this.selectedNode
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        if (sel) {
          const created = this.insertSiblingOf(sel.id)
          if (created) this.startEdit(created.id)
        }
        break
      case 'Tab':
        e.preventDefault()
        if (sel) {
          // 幕布/XMind 式：Tab 新增子节点并进入编辑
          const created = this.insertChildOf(sel.id)
          if (created) this.startEdit(created.id)
        }
        break
      case 'Delete':
      case 'Backspace':
        e.preventDefault()
        if (sel) this.removeNode(sel.id)
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
          if (sel.parent) this.select(sel.parent.id)
          else if (this.focusStack.length > 0) this.exitFocusTo(this.focusStack.length - 1)
        }
        break
      case 'ArrowRight':
        e.preventDefault()
        if (sel) {
          if (sel.collapsed && sel.children.length > 0) {
            this.toggleCollapse(sel.id)
          } else {
            const first = visibleChildren(sel)[0]
            if (first) this.select(first.id)
          }
        }
        break
    }
  }

  private navigateVertical(dir: -1 | 1): void {
    const sorted = [...this.layout.boxes.values()].sort((a, b) => a.y + a.height / 2 - (b.y + b.height / 2))
    if (sorted.length === 0) return
    if (!this.selectedId) {
      this.select(sorted[0].id)
      return
    }
    const idx = sorted.findIndex((b) => b.id === this.selectedId)
    if (idx < 0) {
      this.select(sorted[0].id)
      return
    }
    const next = sorted[Math.max(0, Math.min(sorted.length - 1, idx + dir))]
    this.select(next.id)
  }

  private handleNodeClick(id: string, role: NodeRole, ev: MouseEvent): void {
    if (this.suppressClick) return
    const node = this.doc.find(id)
    if (!node) return
    switch (role) {
      case 'checkbox':
        this.toggleChecked(id)
        return
      case 'collapse':
        this.toggleCollapse(id)
        return
      case 'link':
        if (node.content.link) window.open(node.content.link, '_blank', 'noopener')
        return
      case 'image':
        if (node.content.image) this.emit('imagePreview', node.content.image.src)
        return
      default:
        this.select(id)
        this.container.focus()
        ev.preventDefault()
    }
  }

  private handleNodeDblClick(id: string): void {
    if (this.suppressClick) return
    this.startEdit(id)
  }

  private handleNodePointerDown(id: string, role: NodeRole, ev: PointerEvent): void {
    if (ev.button !== 0 || this.editingInput) return
    if (role === 'resize') {
      // 图片调宽：拖动前暂存快照，松手时再入历史
      this.resizeState = { id, snapshot: snapshotDoc(this.doc), moved: false }
      return
    }
    this.dragState = { id, startX: ev.clientX, startY: ev.clientY, dragging: false }
  }

  private handleBackgroundPointerDown(ev: PointerEvent): void {
    if (ev.button !== 0) return
    this.commitEdit()
    this.container.focus()
    this.panState = { startX: ev.clientX, startY: ev.clientY, baseX: this.transform.x, baseY: this.transform.y }
    this.panMoved = false
  }

  private onPointerMove = (ev: PointerEvent): void => {
    if (this.resizeState) {
      const node = this.doc.find(this.resizeState.id)
      const box = node ? this.layout.boxes.get(node.id) : null
      if (node?.content.image && box) {
        const world = this.screenToWorld(ev.clientX, ev.clientY)
        const imgW = node.content.image.width ?? DEFAULT_IMAGE_WIDTH
        const imgLeft = box.x + (box.width - imgW) / 2
        const newWidth = Math.min(Math.max(Math.round(world.x - imgLeft), 40), 800)
        if (newWidth !== node.content.image.width) {
          this.doc.setImageWidth(node, newWidth)
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
      this.select(drag.id)
    }
    this.suppressClick = true
    const world = this.screenToWorld(ev.clientX, ev.clientY)
    this.renderer.showDropIndicator(this.computeDrop(drag.id, world.x, world.y))
  }

  private onPointerUp = (): void => {
    if (this.resizeState) {
      const rs = this.resizeState
      this.resizeState = null
      if (rs.moved) {
        this.history.record(rs.snapshot)
        this.emit('change', this.getMarkdown())
      }
      setTimeout(() => (this.suppressClick = false), 0)
      return
    }

    if (this.panState) {
      // 无位移的空白点击 = 取消选中
      if (!this.panMoved) this.select(null)
      this.panState = null
      this.panMoved = false
      setTimeout(() => (this.suppressClick = false), 0)
      return
    }
    const drag = this.dragState
    this.dragState = null
    if (!drag?.dragging) return
    const indicator = this.currentIndicator
    this.renderer.showDropIndicator(null)
    this.currentIndicator = null
    setTimeout(() => (this.suppressClick = false), 0)
    if (!indicator) return

    const node = this.doc.find(drag.id)
    const target = this.doc.find(indicator.targetId)
    if (!node || !target) return
    if (indicator.type === 'child') {
      this.moveNode(drag.id, target.id, target.children.length)
    } else if (target.parent) {
      const idx = target.parent.children.indexOf(target)
      this.moveNode(drag.id, target.parent.id, indicator.type === 'before' ? idx : idx + 1)
    }
    this.select(drag.id)
  }

  private currentIndicator: DropIndicator | null = null

  private computeDrop(dragId: string, wx: number, wy: number): DropIndicator | null {
    const dragNode = this.doc.find(dragId)
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

  private screenToWorld(sx: number, sy: number): { x: number; y: number } {
    const rect = this.container.getBoundingClientRect()
    return {
      x: (sx - rect.left - this.transform.x) / this.transform.k,
      y: (sy - rect.top - this.transform.y) / this.transform.k,
    }
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
    this.container.removeEventListener('keydown', this.onKeydown)
    this.container.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('pointermove', this.onPointerMove)
    window.removeEventListener('pointerup', this.onPointerUp)
    this.resizeObserver?.disconnect()
    this.renderer.destroy()
    this.overlay.remove()
    this.listeners.clear()
  }
}
