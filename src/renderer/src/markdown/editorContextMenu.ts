export interface EditorContextMenuItem {
  id: string
  label: string
  danger?: boolean
}

export function showEditorContextMenu(
  event: MouseEvent,
  items: readonly EditorContextMenuItem[],
  onSelect: (id: string) => void
): void {
  event.preventDefault()
  event.stopPropagation()
  dismissEditorContextMenu()

  const menu = document.createElement('div')
  menu.className = 'desk-editor-context-menu'
  menu.setAttribute('role', 'menu')
  const left = Math.min(event.clientX, window.innerWidth - 168)
  const top = Math.min(event.clientY, window.innerHeight - 88)
  menu.style.left = `${Math.max(8, left)}px`
  menu.style.top = `${Math.max(8, top)}px`

  for (const item of items) {
    const button = document.createElement('button')
    button.type = 'button'
    button.setAttribute('role', 'menuitem')
    button.className = item.danger
      ? 'desk-editor-context-menu__item is-danger'
      : 'desk-editor-context-menu__item'
    button.textContent = item.label
    button.addEventListener('mousedown', (click) => {
      click.preventDefault()
      click.stopPropagation()
    })
    button.addEventListener('click', (click) => {
      click.preventDefault()
      click.stopPropagation()
      dismissEditorContextMenu()
      onSelect(item.id)
    })
    menu.append(button)
  }

  const dismiss = (next: Event): void => {
    if (next instanceof KeyboardEvent && next.key !== 'Escape') return
    if (next instanceof PointerEvent && menu.contains(next.target as Node)) return
    dismissEditorContextMenu()
  }
  menu.addEventListener('contextmenu', (next) => {
    next.preventDefault()
    next.stopPropagation()
  })
  document.addEventListener('pointerdown', dismiss, true)
  document.addEventListener('keydown', dismiss, true)
  ;(menu as HTMLElement & { __deskDismiss?: () => void }).__deskDismiss = () => {
    document.removeEventListener('pointerdown', dismiss, true)
    document.removeEventListener('keydown', dismiss, true)
  }
  document.body.append(menu)
}

export function dismissEditorContextMenu(): void {
  const existing = document.querySelector<
    HTMLElement & { __deskDismiss?: () => void }
  >('.desk-editor-context-menu')
  existing?.__deskDismiss?.()
  existing?.remove()
}
