/**
 * engine 对外出口（抽离边界）：UI 层只允许从这里导入。
 * 抽离 mindmap-core 时，整个 src/engine/ 目录原样搬走即可。
 */

export { MindmapSession } from './session'
export type { SessionEvents, SessionOptions } from './session'
export { CanvasEditor, createCanvasMeasurer } from './canvasEditor'
export type { CanvasEditorEvents } from './canvasEditor'
export { cloneSubtree, MindmapDocument, resetNodeIdCounter, restoreDoc, snapshotDoc, visibleChildren } from './model/document'
export type { MindmapNode } from './model/document'
export { parseMarkdown } from './markdown/parser'
export { serializeMarkdown, serializeSubtree } from './markdown/serializer'
export type { TextMeasurer } from './layout/treeLayout'
