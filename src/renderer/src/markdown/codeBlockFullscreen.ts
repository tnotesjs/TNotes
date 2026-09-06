import { COLLAPSE_ICON, EXPAND_ICON } from './copyIcons'

export function createCodeExpandButton(): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'desk-code-expand'
  applyExpandChrome(button, false)
  return button
}

export function ensureCodeExpandButton(block: HTMLElement): HTMLButtonElement | null {
  const group = block.querySelector('.tools-button-group')
  if (!group) return null
  let button = group.querySelector<HTMLButtonElement>('.desk-code-expand')
  if (!button) {
    button = createCodeExpandButton()
    group.append(button)
  }
  return button
}

export function toggleCodeBlockFullscreen(block: HTMLElement, button: HTMLElement): void {
  const on = block.classList.toggle('is-fullscreen')
  applyExpandChrome(button, on)
}

export function exitCodeBlockFullscreen(root: ParentNode): void {
  root.querySelectorAll<HTMLElement>('.milkdown-code-block.is-fullscreen').forEach((block) => {
    block.classList.remove('is-fullscreen')
    const button = block.querySelector<HTMLElement>('.desk-code-expand')
    if (button) applyExpandChrome(button, false)
  })
}

function applyExpandChrome(button: HTMLElement, fullscreen: boolean): void {
  button.innerHTML = fullscreen ? COLLAPSE_ICON : EXPAND_ICON
  button.title = fullscreen ? '退出全屏' : '全屏代码'
  button.setAttribute('aria-label', fullscreen ? '退出全屏' : '全屏代码')
  button.setAttribute('aria-pressed', fullscreen ? 'true' : 'false')
}
