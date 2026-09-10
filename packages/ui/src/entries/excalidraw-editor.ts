/**
 * 画布编辑入口（Desk 专用；SSG 只用 excalidraw-view）。
 *
 * 目前导出宿主无关的编辑会话状态机；后续在同一入口补 React 编辑器宿主组件
 * （稳定实例 + DOM 承载位置交接 + 撤销历史）。
 */
export { createExcalidrawSession, persistedSceneSignature } from '../excalidraw/editorSession'
/**
 * 编辑器宿主（React + Excalidraw 本体）通过动态 import 暴露，
 * 保证 `excalidraw-editor` 入口本身不会把编辑器拖进静态依赖图。
 */
export const loadExcalidrawHost = () => import('../excalidraw/editorHost')
export type { ExcalidrawHostHandle, MountExcalidrawHostOptions } from '../excalidraw/editorHost'
export type {
  ExcalidrawSaveInput,
  ExcalidrawSaveResult,
  ExcalidrawSession,
  ExcalidrawSessionOptions,
  ExcalidrawWriteState
} from '../excalidraw/editorSession'
