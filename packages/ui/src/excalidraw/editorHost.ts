/**
 * Excalidraw 编辑器宿主（Desk 专用）。
 *
 * 关键行为：
 * - 稳定实例：切换卡片/全屏/标签页时只**移动承载 DOM 节点**，不重建 React 树，
 *   否则场景与原生撤销历史都会丢（E0 已实证）
 * - 承载位置交接后必须重建键盘焦点：E0 实测「blur 当前焦点 + 给交互画布加
 *   tabindex + canvas.focus()」是唯一有效路径；不重建则快捷键（撤销等）失效
 * - 内容变化只在需要持久化时回调（宿主用 persistedSceneSignature 过滤）
 */
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Excalidraw, serializeAsJSON } from '@excalidraw/excalidraw'
// 官方样式表必须由宿主 import 一次：缺它的容器高度会算成 2^24，画布不可见且点不到
import '@excalidraw/excalidraw/index.css'

import { setExcalidrawAssetPath } from './fonts'

import type {
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState
} from '@excalidraw/excalidraw/types'

export interface MountExcalidrawHostOptions {
  host: HTMLElement
  /** 初始磁盘内容（唯一真相源） */
  content: string
  theme: 'light' | 'dark'
  /** 本地字体基址；离线必须设置 */
  fontBase?: string
  /**
   * 场景序列化回调。
   *
   * 注意：Excalidraw 载入磁盘场景时会补齐自己的字段（groupIds/roundness/gridSize…），
   * 挂载后的第一次回调就是这份「规范化」结果，**不是用户编辑**。调用方要把它当作
   * 新的持久化基线（`session.adopt`），否则只读打开也会回写一份规范化副本。
   */
  onChange: (content: string) => void
  onReady?: (api: ExcalidrawImperativeAPI) => void
}

export interface ExcalidrawHostHandle {
  /** 只移动承载节点，保持实例与撤销历史 */
  transferTo(target: HTMLElement): void
  /** 重建键盘焦点（交接后必须调用） */
  focus(): void
  getApi(): ExcalidrawImperativeAPI | null
  destroy(): void
}

/** 磁盘 JSON 的形状由 kb 层保证；这里只做最必要的兜底。 */
function parseInitial(content: string): ExcalidrawInitialDataState {
  try {
    const parsed = JSON.parse(content) as ExcalidrawInitialDataState
    return {
      elements: Array.isArray(parsed.elements) ? parsed.elements : [],
      appState: parsed.appState ?? {},
      files: parsed.files ?? {}
    }
  } catch {
    return { elements: [], appState: {}, files: {} }
  }
}

/**
 * 重建键盘焦点：blur 掉触发交接的控件（例如"全屏"按钮），把焦点交给
 * 交互画布。画布默认不可聚焦，必须补 tabindex。
 */
export function restoreCanvasKeyboardFocus(host: HTMLElement): void {
  if (typeof document === 'undefined') return
  const active = document.activeElement
  if (active instanceof HTMLElement) active.blur()
  const canvas = host.querySelector<HTMLElement>('.excalidraw__canvas.interactive')
  if (!canvas) return
  if (!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex', '0')
  canvas.focus()
}

export function mountExcalidrawHost(options: MountExcalidrawHostOptions): ExcalidrawHostHandle {
  if (options.fontBase) setExcalidrawAssetPath(options.fontBase)
  const initial = parseInitial(options.content)
  let api: ExcalidrawImperativeAPI | null = null
  const appState = {
    ...initial.appState,
    theme: options.theme,
    // 不做「整篇替换」的展示状态，交给 Excalidraw 自己维护
    collaborators: new Map()
  }

  const root: Root = createRoot(options.host)
  root.render(
    createElement(Excalidraw, {
      initialData: { elements: initial.elements, appState, files: initial.files },
      theme: options.theme,
      excalidrawAPI: (next: ExcalidrawImperativeAPI) => {
        api = next
        options.onReady?.(next)
      },
      onChange: (elements, nextAppState, files) => {
        options.onChange(serializeAsJSON(elements, nextAppState, files, 'local'))
      }
    })
  )

  return {
    transferTo: (target: HTMLElement) => {
      if (options.host.parentElement !== target) target.append(options.host)
      // 换了承载容器：画布尺寸与命中区域都要重算，否则指针事件落在旧几何上
      api?.refresh?.()
      restoreCanvasKeyboardFocus(options.host)
    },
    focus: () => restoreCanvasKeyboardFocus(options.host),
    getApi: () => api,
    destroy: () => root.unmount()
  }
}
