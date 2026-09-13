/**
 * 思维导图编辑器外壳入口：Web 与 VS Code 扩展共用同一套三视图 UI。
 *
 * 与 `./mindmap` 的分工：`./mindmap` 是 SSG / Desk 笔记里内嵌的「预览 + 可选编辑」块
 * （`components/Mindmap/Mindmap.vue`，自带 `--mm-*` 主题变量与只读渲染）；本入口导出它
 * 内部复用的编辑器组件，供自带页面外壳的宿主（Web 整页、VS Code webview）直接组装。
 *
 * 宿主职责：`MindmapSession` 归属、`--mm-*` 变量定义、落盘 / 剪贴板 / 图片写入
 * （`apps/mindmap-web`、`apps/mindmap-vscode`）。浮层默认不 teleport，嵌入笔记的宿主
 * 保持默认即可；整页宿主传 `teleport-to="body"`。
 */
export { default as AppIcon } from '../components/Mindmap/editor/AppIcon.vue'
export { default as CanvasContextMenu } from '../components/Mindmap/editor/CanvasContextMenu.vue'
export { default as CollapseMenu } from '../components/Mindmap/editor/CollapseMenu.vue'
export { default as IconButton } from '../components/Mindmap/editor/IconButton.vue'
export { default as LinkPopover } from '../components/Mindmap/editor/LinkPopover.vue'
export { default as MarkdownView } from '../components/Mindmap/editor/MarkdownView.vue'
export { default as MindmapView } from '../components/Mindmap/editor/MindmapView.vue'
export { default as OutlineView } from '../components/Mindmap/editor/OutlineView.vue'
export { default as RichInlineEditor } from '../components/Mindmap/editor/RichInlineEditor.vue'
export { default as SearchBar } from '../components/Mindmap/editor/SearchBar.vue'
export { default as SelectionToolbar } from '../components/Mindmap/editor/SelectionToolbar.vue'
export { default as FocusBreadcrumbs } from '../components/Mindmap/FocusBreadcrumbs.vue'

export { insertImageIntoSource } from '../components/Mindmap/editor/imagePaste'
export {
  pasteCanvasOutline,
  readMindmapClipboard,
  writeMindmapClipboard
} from '../components/Mindmap/editor/mindmapClipboard'
export { resolveAfterDropLevel } from '../components/Mindmap/editor/outlineDrag'
export type { DropLevel } from '../components/Mindmap/editor/outlineDrag'
export {
  altShortcut,
  isApplePlatform,
  primaryShortcut
} from '../components/Mindmap/editor/platform'
