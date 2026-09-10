/**
 * 画布编辑入口（Desk 专用；SSG 只用 excalidraw-view）。
 *
 * 目前导出宿主无关的编辑会话状态机；后续在同一入口补 React 编辑器宿主组件
 * （稳定实例 + DOM 承载位置交接 + 撤销历史）。
 */
export { createExcalidrawSession, persistedSceneSignature } from '../excalidraw/editorSession'
export type {
  ExcalidrawSaveInput,
  ExcalidrawSaveResult,
  ExcalidrawSession,
  ExcalidrawSessionOptions,
  ExcalidrawWriteState
} from '../excalidraw/editorSession'
