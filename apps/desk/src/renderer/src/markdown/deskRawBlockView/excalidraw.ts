/**
 * 笔记内嵌画布卡片（计划 E5）。
 *
 * - 只读展示用 E2 的共享 SVG 组件（不挂编辑器、不写文件）
 * - 点「编辑」才挂 E3 编辑器（复用画布控制器），卡片由只读 SVG 切成编辑器
 * - 操作栏：编辑 / 全屏 / 在标签页打开 / 结束编辑；高度可写回组件源码
 * - 画布内容变化只写 `assets/*.excalidraw`，**不碰笔记源码**；只有高度这类
 *   组件属性变化才定点改写这一行
 * - 键盘/滚轮/粘贴在画布激活时只由画布消费，点卡片外即交还笔记
 */
import { createApp, type App } from 'vue'

import { ExcalidrawSvg } from '@tnotesjs/ui/excalidraw-view'

import {
  createExcalidrawCanvasController,
  currentAppTheme,
  type ExcalidrawCanvasController
} from '../../editor/excalidraw/canvasController'
import {
  isExcalidrawSource,
  parseExcalidrawSource,
  setExcalidrawHeight
} from '../../editor/markdown/excalidrawComponent'
import {
  checkExcalidrawOwnership,
  noteIndexFromRelPath
} from '../../editor/markdown/excalidrawOwnership'
import { useEditorStore } from '../../stores/editor'
import { useWorkspaceStore } from '../../stores/workspace'
import { documentKey } from '../../stores/workspace/helpers'
import { resolveNoteAssetRelPath } from '../noteAssetPath'

import type { DeskRawBlockMountContext } from './types'

const DEFAULT_HEIGHT = 480
const HEIGHT_OPTIONS = [320, 480, 640, 800]
/** 与 Mindmap 全屏互斥：body 上的标记与对方组件的强制退出事件。 */
const MINDMAP_FS_ATTR = 'tnMindmapFs'
const CANVAS_FS_ATTR = 'tnCanvasFs'
const MINDMAP_FORCE_EXIT = 'tnotes-mindmap-force-exit-fullscreen'

/** 空场景不是错误：它只是没有可导出的内容。 */
function isEmptyScene(content: string): boolean {
  try {
    const parsed = JSON.parse(content) as { elements?: unknown }
    return !Array.isArray(parsed.elements) || parsed.elements.length === 0
  } catch {
    return false
  }
}

function noteRelPathOf(knowledgeBaseId: string, noteUuid: string): string | null {
  const workspace = useWorkspaceStore()
  return workspace.documents[documentKey(knowledgeBaseId, noteUuid)]?.document.relPath ?? null
}

function noteIndexFor(knowledgeBaseId: string, noteUuid: string, noteRelPath: string): string {
  const workspace = useWorkspaceStore()
  const session = workspace.documents[documentKey(knowledgeBaseId, noteUuid)]
  return session?.document.index ?? noteIndexFromRelPath(noteRelPath) ?? ''
}

interface CardElements {
  root: HTMLElement
  status: HTMLElement
  svgHost: HTMLElement
  editorHost: HTMLElement
  placeholder: HTMLElement
  editButton: HTMLButtonElement
  doneButton: HTMLButtonElement
  fullscreenButton: HTMLButtonElement
  tabButton: HTMLButtonElement
  heightLabel: HTMLElement
  heightSelect: HTMLSelectElement
}

function buildCard(): CardElements {
  const root = document.createElement('div')
  root.className = 'desk-excalidraw'
  root.dataset.state = 'loading'
  root.contentEditable = 'false'
  root.setAttribute('data-testid', 'desk-excalidraw-card')

  const bar = document.createElement('header')
  bar.className = 'desk-excalidraw__bar'
  const title = document.createElement('span')
  title.className = 'desk-excalidraw__title'
  title.textContent = '画布'
  const status = document.createElement('span')
  status.className = 'desk-excalidraw__status'
  bar.append(title, status)

  const actions = document.createElement('div')
  actions.className = 'desk-excalidraw__actions'
  const makeButton = (action: string, label: string): HTMLButtonElement => {
    const button = document.createElement('button')
    button.type = 'button'
    button.dataset.action = action
    button.textContent = label
    actions.append(button)
    return button
  }
  const editButton = makeButton('edit', '编辑')
  const doneButton = makeButton('done', '结束编辑')
  doneButton.hidden = true
  const fullscreenButton = makeButton('fullscreen', '全屏')
  const tabButton = makeButton('tab', '在标签页打开')

  const heightLabel = document.createElement('label')
  heightLabel.className = 'desk-excalidraw__height'
  heightLabel.append('高度')
  const heightSelect = document.createElement('select')
  heightSelect.setAttribute('data-testid', 'desk-excalidraw-height')
  for (const value of [...HEIGHT_OPTIONS.map(String), 'auto']) {
    const option = document.createElement('option')
    option.value = value
    option.textContent = value === 'auto' ? '默认' : `${value}px`
    heightSelect.append(option)
  }
  heightLabel.append(heightSelect)
  actions.append(heightLabel)
  bar.append(actions)

  const stage = document.createElement('div')
  stage.className = 'desk-excalidraw__stage'
  const svgHost = document.createElement('div')
  svgHost.className = 'desk-excalidraw__svg'
  const editorHost = document.createElement('div')
  editorHost.className = 'desk-excalidraw__editor'
  editorHost.hidden = true
  const placeholder = document.createElement('p')
  placeholder.className = 'desk-excalidraw__placeholder'
  placeholder.hidden = true
  stage.append(svgHost, editorHost, placeholder)

  root.append(bar, stage)
  return {
    root,
    status,
    svgHost,
    editorHost,
    placeholder,
    editButton,
    doneButton,
    fullscreenButton,
    tabButton,
    heightLabel,
    heightSelect
  }
}

export function mountRawExcalidraw(ctx: DeskRawBlockMountContext): void {
  const { block, dom, cleanupTasks, deps, view, getPos } = ctx
  dom.classList.add('desk-raw-block--component', 'desk-raw-block--excalidraw')
  // 保留整块选择热区：边界热区在挂载前就 append 到 dom 上，replaceChildren 会把它清掉
  const boundaryHits = [...dom.querySelectorAll('.desk-raw-block__boundary-hit')]
  dom.replaceChildren(...boundaryHits)

  const fail = (reason: string): void => {
    const paragraph = document.createElement('p')
    paragraph.className = 'desk-excalidraw__error'
    paragraph.textContent = reason
    dom.append(paragraph)
  }

  if (!isExcalidrawSource(block.source)) return
  const parsed = parseExcalidrawSource(block.source)
  if (!parsed) {
    fail('画布组件缺少 path="…"（不支持表达式写法）')
    return
  }
  const knowledgeBaseId = deps.knowledgeBaseId()
  const noteUuid = deps.noteUuid()
  const noteRelPath = noteRelPathOf(knowledgeBaseId, noteUuid)
  const resolved = noteRelPath ? resolveNoteAssetRelPath(noteRelPath, parsed.path) : null
  if (!resolved) {
    fail(`画布路径必须指向知识库 assets/ 下的 .excalidraw：${parsed.path}`)
    return
  }
  const relPath: string = resolved
  // 归属校验：内嵌组件必须指向当前笔记自己的画布。手写跨笔记引用只给诊断，
  // 不打开写编辑（跨笔记的合法路径是粘贴时自动复制一份，见计划 2.1/E7）。
  const noteIndex = noteIndexFor(knowledgeBaseId, noteUuid, noteRelPath ?? '')
  const ownership = checkExcalidrawOwnership({ relPath, noteIndex, noteRelPath: noteRelPath ?? '' })

  let currentSource = block.source
  let currentHeight = parsed.height
  let lastContent: string | null = null
  let applyingOwnWrite = false
  const card = buildCard()
  dom.append(card.root)

  const editor = useEditorStore()
  let svgApp: App | null = null
  let controller: ExcalidrawCanvasController | null = null
  let editing = false
  let fullscreen = false
  let disposed = false

  const editable = (): boolean => !deps.isEffectivelyReadOnly() && ownership.ok
  /** 归属诊断常驻显示：只读卡片照常渲染，但不给写编辑入口 */
  const ownershipNotice = ownership.ok ? null : ownership.message
  const setStatus = (text: string): void => {
    card.status.textContent = text
  }
  const setPlaceholder = (text: string | null): void => {
    card.placeholder.textContent = text ?? ''
    card.placeholder.hidden = text == null
  }
  const applyHeight = (): void => {
    const height = `${currentHeight ?? DEFAULT_HEIGHT}px`
    card.editorHost.style.height = height
    card.svgHost.style.height = height
  }

  function renderSvg(content: string): void {
    lastContent = content
    svgApp?.unmount()
    card.svgHost.replaceChildren()
    const host = document.createElement('div')
    card.svgHost.append(host)
    svgApp = createApp(ExcalidrawSvg, {
      content,
      height: currentHeight ?? DEFAULT_HEIGHT,
      theme: currentAppTheme()
    })
    svgApp.mount(host)
  }

  /** 只读卡片：读受限 IPC → 共享 SVG 组件；内容只在磁盘上，绝不写笔记 */
  function loadCard(): void {
    card.root.dataset.state = 'loading'
    setStatus('载入中…')
    void window.desk.excalidraw.read({ knowledgeBaseId, relPath }).then((result) => {
      if (disposed || editing) return
      if (!result.ok) {
        card.root.dataset.state = 'error'
        setStatus('无法读取')
        setPlaceholder(result.error.message)
        return
      }
      if (!result.value.valid) {
        card.root.dataset.state = 'error'
        setStatus('内容不是合法画布')
        setPlaceholder('画布内容不是合法的 Excalidraw 场景，已停止写入')
        return
      }
      applyHeight()
      // 空画布（新建/删光元素）不是错误：共享渲染器按「没有可导出的内容」处理，
      // 卡片这里给出明确提示，而不是一个看起来坏掉的错误态
      if (isEmptyScene(result.value.content)) {
        lastContent = result.value.content
        svgApp?.unmount()
        svgApp = null
        card.svgHost.replaceChildren()
        card.root.dataset.state = 'ready'
        setStatus(ownership.ok ? '空画布' : '归属不符')
        setPlaceholder(ownershipNotice ?? (editable() ? '空画布：点「编辑」开始绘制' : '空画布'))
        return
      }
      renderSvg(result.value.content)
      card.root.dataset.state = 'ready'
      setStatus(ownership.ok ? '' : '归属不符')
      setPlaceholder(ownershipNotice)
    })
  }

  function syncChrome(): void {
    card.doneButton.hidden = !editing
    card.editButton.hidden = editing || !editable()
    card.heightSelect.disabled = !editable()
    card.heightLabel.hidden = !editable()
    card.svgHost.hidden = editing
    card.editorHost.hidden = !editing
    card.fullscreenButton.textContent = fullscreen ? '退出全屏' : '全屏'
  }

  function startEditing(): void {
    if (editing || !editable()) return
    if (editor.excalidrawTabIdFor(knowledgeBaseId, relPath)) {
      // 单文件单写者：已经在标签页里编辑时，内嵌卡片不再开第二个会话
      setStatus('已在标签页打开')
      setPlaceholder('该画布已在标签页中打开，请在那里继续编辑')
      return
    }
    editing = true
    setPlaceholder(null)
    controller = createExcalidrawCanvasController({
      knowledgeBaseId: () => knowledgeBaseId,
      relPath: () => relPath,
      container: () => card.editorHost,
      onDirtyChange: () => syncChrome(),
      onInvalid: (reason) => {
        setStatus('画布已失效')
        setPlaceholder(reason)
        void stopEditing()
      }
    })
    syncChrome()
    void controller.boot().then(() => {
      syncChrome()
      if (fullscreen) controller?.focusCanvas()
    })
  }

  async function stopEditing(): Promise<void> {
    if (!editing) return
    const active = controller
    controller = null
    editing = false
    setFullscreen(false)
    if (active) {
      await active.settle()
      active.destroy()
    }
    syncChrome()
    loadCard()
  }

  function setFullscreen(next: boolean): void {
    if (fullscreen === next) return
    fullscreen = next
    card.root.classList.toggle('is-fullscreen', next)
    if (next) {
      // 与 Mindmap 全屏互斥：先请对方退出，再占住 body 标记
      for (const element of document.querySelectorAll('.mindmap-preview.is-fullscreen')) {
        element.dispatchEvent(new CustomEvent(MINDMAP_FORCE_EXIT))
        element.classList.remove('is-fullscreen', 'is-interaction-active')
      }
      document.body.dataset[CANVAS_FS_ATTR] = '1'
      document.documentElement.dataset[CANVAS_FS_ATTR] = '1'
    } else if (!document.querySelector('.desk-excalidraw.is-fullscreen')) {
      delete document.body.dataset[CANVAS_FS_ATTR]
      delete document.documentElement.dataset[CANVAS_FS_ATTR]
    }
    syncChrome()
  }

  /** 高度写回组件源码：只改这一行的 height 属性，其余笔记字节不动。 */
  function writeHeight(nextHeight: number | null): void {
    if (deps.isEffectivelyReadOnly()) return
    const nextSource = setExcalidrawHeight(currentSource, nextHeight)
    if (nextSource === currentSource) return
    const position = getPos()
    if (position == null) return
    const node = view.state.doc.nodeAt(position)
    if (node?.type.name !== 'deskRawBlock') return
    currentSource = nextSource
    currentHeight = nextHeight
    applyingOwnWrite = true
    view.dispatch(
      view.state.tr.setNodeMarkup(position, undefined, {
        ...(node.attrs as Record<string, unknown>),
        source: nextSource
      })
    )
    applyingOwnWrite = false
    applyHeight()
    if (lastContent != null) renderSvg(lastContent)
  }

  card.editButton.addEventListener('click', () => startEditing())
  card.doneButton.addEventListener('click', () => void stopEditing())
  card.tabButton.addEventListener('click', () => {
    void stopEditing().then(() => {
      const knowledgeBase =
        useWorkspaceStore().overview.allKnowledgeBases.find(
          (item) => item.id === knowledgeBaseId
        ) ?? null
      if (knowledgeBase) editor.openExcalidraw(knowledgeBase, relPath)
    })
  })
  card.fullscreenButton.addEventListener('click', () => {
    if (!fullscreen) startEditing()
    setFullscreen(!fullscreen)
  })
  card.heightSelect.addEventListener('change', () => {
    const value = card.heightSelect.value
    writeHeight(value === 'auto' ? null : Number.parseInt(value, 10))
  })

  // 卡片内点击即进入「画布岛」：键盘/滚轮/粘贴只由画布消费
  const activateIsland = (event: Event): void => {
    const target = event.target as Element | null
    if (target?.closest('.desk-excalidraw__bar')) return
    if (!editing) return
    card.root.classList.add('is-canvas-island-active')
    controller?.focusCanvas()
  }
  const deactivateIsland = (event: PointerEvent): void => {
    if (event.target instanceof Node && card.root.contains(event.target)) return
    card.root.classList.remove('is-canvas-island-active')
  }
  card.root.addEventListener('pointerdown', activateIsland)
  document.addEventListener('pointerdown', deactivateIsland, true)

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !fullscreen) return
    event.preventDefault()
    event.stopPropagation()
    setFullscreen(false)
  }
  document.addEventListener('keydown', onKeydown, true)

  // 主题跟随（只读 SVG 也要跟着应用深浅色走；编辑器由控制器自己跟随）
  const themeObserver = new MutationObserver((changes) => {
    if (!changes.some((change) => change.attributeName === 'data-theme')) return
    if (editing || lastContent == null) return
    renderSvg(lastContent)
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  })

  // Mindmap 进入全屏时退出画布全屏，保证全屏互斥
  const bodyObserver = new MutationObserver(() => {
    if (fullscreen && document.body.dataset[MINDMAP_FS_ATTR] === '1') setFullscreen(false)
  })
  // 注意：`dataset.tnMindmapFs` 落到 DOM 上是 `data-tn-mindmap-fs`，
  // 不能按驼峰写 attributeFilter，否则永远收不到通知
  bodyObserver.observe(document.body, { attributes: true })

  // 只读状态变化（切只读视图）= 交还编辑权；Milkdown 复用同一个编辑器实例，
  // 不会再走一次 nodeView 的挂载流程
  const applyReadonly = (readOnly: boolean): void => {
    if (readOnly && editing) void stopEditing()
    syncChrome()
  }
  deps.rawSourceReadonlyListeners.add(applyReadonly)
  cleanupTasks.push(() => {
    deps.rawSourceReadonlyListeners.delete(applyReadonly)
  })

  card.heightSelect.value = String(currentHeight ?? 'auto')
  applyHeight()
  syncChrome()
  loadCard()

  // 自己写回源码时保持 nodeView 存活（与 mindmap/mermaid 同一约定）
  const writeback = {
    acceptWriteback: (nextSource: string): boolean => {
      if (!applyingOwnWrite && nextSource !== currentSource) return false
      currentSource = nextSource
      const next = parseExcalidrawSource(nextSource)
      currentHeight = next?.height ?? null
      card.heightSelect.value = String(currentHeight ?? 'auto')
      applyHeight()
      if (lastContent != null) renderSvg(lastContent)
      return true
    }
  }
  ;(dom as HTMLElement & { __excalidrawWriteback?: typeof writeback }).__excalidrawWriteback =
    writeback

  cleanupTasks.push(() => {
    disposed = true
    setFullscreen(false)
    themeObserver.disconnect()
    bodyObserver.disconnect()
    card.root.removeEventListener('pointerdown', activateIsland)
    document.removeEventListener('pointerdown', deactivateIsland, true)
    document.removeEventListener('keydown', onKeydown, true)
    controller?.destroy()
    controller = null
    svgApp?.unmount()
    svgApp = null
    delete (dom as HTMLElement & { __excalidrawWriteback?: typeof writeback }).__excalidrawWriteback
  })
}
