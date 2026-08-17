/**
 * MindmapSession：无头会话层。
 * 持有文档、历史栈、选中、折叠、聚焦路径与搜索高亮，对外暴露全部编辑操作与事件。
 * 不依赖 DOM，可被脑图（Canvas）、大纲（DOM 列表）、源码（textarea）三个视图共享。
 */

import { History } from './commands/history'
import { parseMarkdown } from './markdown/parser'
import { serializeMarkdown } from './markdown/serializer'
import { isAncestor, MindmapDocument, restoreDoc, snapshotDoc } from './model/document'
import { parseInline } from './model/inline'
import type { MindmapNode } from './model/document'

export interface SessionOptions {
  markdown?: string
  fileName?: string
}

export interface SessionEvents {
  /** 文档变更，payload 为最新 markdown */
  change: string
  selectionChange: string | null
  /** 折叠/展开（视图态变化，markdown 不变） */
  collapseChange: null
  /** 聚焦路径变化，payload 为从根到聚焦根的标题数组 */
  focusChange: string[]
  /** 警告信息（如文件含非脑图内容） */
  warning: string
  /** 搜索高亮集合变化 */
  matchChange: null
}

type Handler<T> = (payload: T) => void

export class MindmapSession {
  private doc: MindmapDocument
  private history = new History()
  private selectedId: string | null = null
  private matchIds = new Set<string>()
  private focusStack: MindmapNode[] = []
  private fileName: string
  private listeners = new Map<keyof SessionEvents, Set<Handler<never>>>()

  constructor(options: SessionOptions = {}) {
    this.fileName = options.fileName ?? '未命名'
    const result = parseMarkdown(options.markdown ?? '', this.cleanFileName())
    this.doc = result.doc
    if (result.hasExtraContent) {
      queueMicrotask(() => this.emit('warning', '该文件含非脑图内容，保存后将仅保留脑图部分（H1 + 无序列表）'))
    }
  }

  // ---------- 事件 ----------

  on<K extends keyof SessionEvents>(event: K, handler: Handler<SessionEvents[K]>): void {
    let set = this.listeners.get(event)
    if (!set) {
      set = new Set()
      this.listeners.set(event, set)
    }
    set.add(handler as Handler<never>)
  }

  private emit<K extends keyof SessionEvents>(event: K, payload: SessionEvents[K]): void {
    this.listeners.get(event)?.forEach((h) => (h as Handler<SessionEvents[K]>)(payload))
  }

  off<K extends keyof SessionEvents>(event: K, handler: Handler<SessionEvents[K]>): void {
    this.listeners.get(event)?.delete(handler as Handler<never>)
  }

  /** 视图层直接改文档后，把「变更前快照」补记进历史（如图片拖动调宽），并广播变更 */
  recordSnapshot(snapshot: string): void {
    this.history.record(snapshot)
    this.emit('change', this.getMarkdown())
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

  get matches(): ReadonlySet<string> {
    return this.matchIds
  }

  getMarkdown(): string {
    return serializeMarkdown(this.doc)
  }

  /** 外部同步（源码视图输入 / 打开新文件），不进入撤销历史 */
  setMarkdown(md: string): void {
    const result = parseMarkdown(md, this.cleanFileName())
    this.doc = result.doc
    this.history.clear()
    this.focusStack = []
    if (this.selectedId && !this.doc.find(this.selectedId)) this.selectedId = null
    if (result.hasExtraContent) {
      this.emit('warning', '该文件含非脑图内容，保存后将仅保留脑图部分（H1 + 无序列表）')
    }
    this.emit('change', this.getMarkdown())
    this.emit('focusChange', this.focusTitles())
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
    this.emit('change', this.getMarkdown())
    this.emit('focusChange', this.focusTitles())
  }

  // ---------- 编辑操作 ----------

  select(id: string | null): void {
    if (this.selectedId === id) return
    this.selectedId = id
    this.emit('selectionChange', id)
  }

  updateNodeRaw(id: string, raw: string): void {
    const node = this.doc.find(id)
    if (!node || node.content.raw === raw.trim()) return
    this.mutate(() => this.doc.updateRaw(node, raw))
  }

  toggleChecked(id: string): void {
    const node = this.doc.find(id)
    if (!node || node === this.doc.root) return
    this.mutate(() => this.doc.toggleChecked(node))
  }

  setImageWidth(id: string, width: number | null): void {
    const node = this.doc.find(id)
    if (node) this.mutate(() => this.doc.setImageWidth(node, width))
  }

  /** 折叠是视图态：不进历史。位置补偿由视图层负责 */
  toggleCollapse(id: string): void {
    const node = this.doc.find(id)
    if (!node || node.children.length === 0) return
    this.doc.toggleCollapse(node)
    this.emit('collapseChange', null)
  }

  setCollapsed(id: string, collapsed: boolean): void {
    const node = this.doc.find(id)
    if (!node || node.children.length === 0 || node.collapsed === collapsed) return
    this.doc.toggleCollapse(node, collapsed)
    this.emit('collapseChange', null)
  }

  insertChildOf(id: string, index?: number): MindmapNode | null {
    const parent = this.doc.find(id)
    if (!parent) return null
    let created: MindmapNode | null = null
    this.mutate(() => {
      parent.collapsed = false
      created = this.doc.insertChild(parent, index ?? parent.children.length, '')
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

  /** 在指定节点之前插入同级（行首 Enter 场景） */
  insertBeforeOf(id: string): MindmapNode | null {
    const node = this.doc.find(id)
    if (!node || !node.parent || node === this.doc.root) return null
    let created: MindmapNode | null = null
    this.mutate(() => {
      const i = node.parent!.children.indexOf(node)
      created = this.doc.addNode(node.parent!, parseInline(''), i)
    })
    return created
  }

  /**
   * 事务：把多个文档操作合并为一条历史 + 一次 change 广播。
   * 供视图层实现复合操作（Enter 分裂、Backspace 合并、多行粘贴等）。
   */
  transact(fn: (doc: MindmapDocument) => void): void {
    this.mutate(() => fn(this.doc))
  }

  indentNode(id: string): void {
    const node = this.doc.find(id)
    // 预检：无可行操作时不动历史
    if (!node || !node.parent || node === this.doc.root) return
    if (node.parent.children.indexOf(node) <= 0) return
    this.mutate(() => {
      this.doc.indent(node)
    })
  }

  outdentNode(id: string): void {
    const node = this.doc.find(id)
    if (!node || !node.parent || node === this.doc.root) return
    if (node.parent === this.doc.root || !node.parent.parent) return
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
    // 预检：不合法移动不动历史
    if (node === this.doc.root || node === parent || isAncestor(node, parent)) return false
    this.mutate(() => {
      parent.collapsed = false
      this.doc.move(node, parent, index)
    })
    return true
  }

  // ---------- 聚焦 ----------

  focusNode(id: string): void {
    const node = this.doc.find(id)
    if (!node || node === this.focusRootNode) return
    this.focusStack.push(node)
    this.emit('focusChange', this.focusTitles())
  }

  focusSelected(): void {
    const node = this.selectedNode
    if (!node) return
    this.focusNode(node.id)
  }

  /** 退到聚焦路径的第 index 层；index = 0 表示完全退出 */
  exitFocusTo(index: number): void {
    this.focusStack.length = Math.max(0, index)
    this.emit('focusChange', this.focusTitles())
  }

  private focusTitles(): string[] {
    return this.focusStack.map((n) => n.content.text)
  }

  // ---------- 搜索 ----------

  search(query: string): MindmapNode[] {
    return this.doc.search(query)
  }

  setMatchHighlight(ids: Set<string>): void {
    this.matchIds = ids
    this.emit('matchChange', null)
  }

  /** 展开节点的全部祖先折叠（搜索/大纲定位用） */
  expandAncestors(id: string): void {
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
    if (changed) this.emit('collapseChange', null)
  }

  // ---------- 内部 ----------

  private cleanFileName(): string {
    return this.fileName.replace(/\.(tn-mindmap\.)?md$/i, '')
  }

  private mutate(fn: () => void): void {
    this.history.record(snapshotDoc(this.doc))
    fn()
    this.emit('change', this.getMarkdown())
  }

  destroy(): void {
    this.listeners.clear()
  }
}
