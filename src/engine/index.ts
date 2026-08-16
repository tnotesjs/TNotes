/**
 * engine 对外出口（抽离边界）：UI 层只允许从这里导入。
 * 抽离 mindmap-core 时，整个 src/engine/ 目录原样搬走即可。
 */

export { MindmapEditor, createCanvasMeasurer } from './editor'
export type { EditorEvents, EditorOptions } from './editor'
export { MindmapDocument, resetNodeIdCounter, restoreDoc, snapshotDoc } from './model/document'
export type { MindmapNode } from './model/document'
export { parseMarkdown } from './markdown/parser'
export { serializeMarkdown } from './markdown/serializer'
export type { TextMeasurer } from './layout/treeLayout'
