/**
 * 「点击编辑器空白区」与「焦点掉到 body 后的按键」两条兜底规则（计划 C+D）。
 *
 * 背景（2026-09 实测，见 e2e-editor-focus.mjs）：
 * 可编辑区 `.ProseMirror` 并不覆盖整个编辑面板——正文列宽上限 940px、上下有
 * padding，且 Crepe 根节点 `.milkdown` 比可编辑区高（`.ProseMirror` 的
 * `min-height: 100%` 在 `height: auto` 的父级上解析不出来）。点在那些「死区」里：
 * - 点击目标不可聚焦 → 焦点掉到 `BODY`，编辑器失焦；
 * - 但 `prosemirror-virtual-cursor` 是 DOM 元素，仍按旧的 TextSelection 继续画光标，
 *   于是画面上留着一根**不闪烁、也不会动**的竖线；
 * - 键事件因为焦点不在编辑器上而全部落空（捕获阶段的 keydown 在
 *   `!inProseMirror` 时直接 return，Milkdown 的 keymap 也要求有焦点）。
 *
 * 两个纯判断放在这里，便于单测覆盖各种点击目标。
 */

/**
 * 这些目标自己拥有焦点/行为，绝不能把焦点抢回编辑器：
 * - 真正的编辑/输入控件（ProseMirror 本体、CodeMirror、callout 标题输入等）
 * - 可交互元素（链接、按钮、表单控件、折叠 summary）
 * - 编辑器里的交互岛与浮层（画布、脑图、目录、菜单、代码 tab、边界热区）
 */
const KEEP_FOCUS_SELECTOR = [
  '.ProseMirror',
  '[contenteditable="true"]',
  '.cm-editor',
  '.cm-content',
  '.desk-raw-block__editor',
  '.desk-raw-block__include-cm',
  '.desk-code-tab',
  '.desk-raw-block__boundary-hit',
  '.desk-raw-block__component-preview',
  '.mindmap-preview',
  '[data-view-tab]',
  '.focus-breadcrumbs',
  '.canvas-context-menu',
  '.link-popover',
  '.milkdown-slash-menu',
  '.milkdown-block-handle',
  '.desk-block-action-menu',
  '.prosemirror-virtual-cursor',
  '[role="menu"]',
  '[role="dialog"]',
  'a[href]',
  'button',
  'input',
  'textarea',
  'select',
  'summary'
].join(', ')

/**
 * 这次 mousedown 是否落在「编辑器面板里的空白区」（既不是可编辑区，也不是交互元素）。
 *
 * @param target 事件目标
 * @param canvas 编辑器面板根节点（`.milkdown-markdown-editor__canvas`）
 */
export function isEditorBlankTarget(target: Element | null, canvas: Element | null): boolean {
  if (!target || !canvas) return false
  if (!canvas.contains(target)) return false
  return target.closest(KEEP_FOCUS_SELECTOR) == null
}

const EDITING_KEYS = new Set([
  'Backspace',
  'Delete',
  'Enter',
  'Tab',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'PageUp',
  'PageDown'
])

/**
 * 该按键是否属于「编辑输入」。用于焦点掉到 body 后是否把编辑器收回来：
 * 只认真正的输入（字符键与编辑类导航键），不认 F1~F12、Escape、多媒体键与纯修饰键。
 */
export function isEditingKeyEvent(event: {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  altKey?: boolean
  isComposing?: boolean
}): boolean {
  if (event.isComposing) return false
  if (event.ctrlKey || event.metaKey || event.altKey) return false
  if (EDITING_KEYS.has(event.key)) return true
  // 单字符按键（含中文输入法提交前的字母）算输入；'Unidentified'/多字符键不算。
  return event.key.length === 1
}
