/**
 * 画布键盘焦点。
 *
 * 背景（E0/E3 实测）：Excalidraw 把键盘快捷键挂在容器上，宿主节点被搬动
 * （卡片 → 全屏 → 标签页）之后焦点会留在触发交接的控件上，快捷键不再送达编辑器；
 * 指针路径正常。恢复方式只有一条：blur 当前焦点 → 给交互画布补 tabindex → focus。
 *
 * E4 补充：标签页/分栏切回来时承载容器可能还在 `display:none` 里（组件 watcher
 * 触发的 DOM 更新还没落地），此时 `focus()` 静默失败、焦点留在 body。
 * 因此用 `restoreCanvasKeyboardFocusWhenReady` 等到画布真的有高度再聚焦。
 */
export function restoreCanvasKeyboardFocus(host: HTMLElement): boolean {
  if (typeof document === 'undefined') return false
  const active = document.activeElement
  if (active instanceof HTMLElement) active.blur()
  const canvas = host.querySelector<HTMLElement>('.excalidraw__canvas.interactive')
  if (!canvas) return false
  if (!canvas.hasAttribute('tabindex')) canvas.setAttribute('tabindex', '0')
  canvas.focus()
  return document.activeElement === canvas
}

/** 等画布真的有布局（高度 > 0）再聚焦；最多重试 30 帧。 */
export function restoreCanvasKeyboardFocusWhenReady(host: HTMLElement, attempt = 0): void {
  if (typeof document === 'undefined') return
  const canvas = host.querySelector<HTMLElement>('.excalidraw__canvas.interactive')
  const laidOut = canvas ? canvas.getBoundingClientRect().height > 0 : false
  if (laidOut || typeof requestAnimationFrame !== 'function' || attempt >= 30) {
    restoreCanvasKeyboardFocus(host)
    return
  }
  requestAnimationFrame(() => restoreCanvasKeyboardFocusWhenReady(host, attempt + 1))
}
