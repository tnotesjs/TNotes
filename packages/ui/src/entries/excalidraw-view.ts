/**
 * 只读画布入口：Desk 笔记卡片与 SSG 站点共用同一套渲染逻辑。
 * 导出能力（Excalidraw 本体）由渲染器内部动态 import，首屏不会引入编辑器。
 */
export { default as ExcalidrawSvg } from '../excalidraw/ExcalidrawSvg.vue'
export { createExcalidrawSvgRenderer, toSvgDataUrl } from '../excalidraw/renderer'
export type {
  ExcalidrawSvgRenderer,
  ExcalidrawSvgRendererOptions,
  ExcalidrawViewState
} from '../excalidraw/renderer'
export { parseExcalidrawScene, sceneCacheKey, svgCache, SvgCache } from '../excalidraw/scene'
/**
 * 导出器（`exportToSvg` + 字体内联）只能动态取：入口本身不得把 Excalidraw 拖进静态依赖图。
 * Desk 用它把画布写成笔记里引用的那张 `.svg`。
 */
export const loadExcalidrawExporter = () => import('../excalidraw/exporter')
/** 部署站点需要把官方字体指向站点内的目录（离线自包含） */
export { setExcalidrawAssetPath, getExcalidrawAssetPath } from '../excalidraw/fonts'
export type { ExcalidrawScene, SceneParseResult } from '../excalidraw/scene'
