/** 块 DOM 的「清空除自己和边界热区以外的内容」工具。 */
const BOUNDARY_HIT_CLASS = 'desk-raw-block__boundary-hit'

/**
 * 清空块体（准备挂载自己的预览），但**保留边界热区**。
 *
 * 热区（`.desk-raw-block__boundary-hit`，上下各一条）由 `createDeskRawBlockView` 在
 * 挂载预览之前 append 到块 DOM；这些挂载函数如果直接 `dom.replaceChildren()`，就会把
 * 热区一起删掉 —— 足迹/单词表/笔记表格/B站/mermaid/mindmap 因此丢掉鼠标入口。
 */
export function clearRawBlockBody(dom: HTMLElement): void {
  for (const child of [...dom.children]) {
    if (child.classList.contains(BOUNDARY_HIT_CLASS)) continue
    child.remove()
  }
}
