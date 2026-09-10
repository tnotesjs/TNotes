/** Clipboard fallback for Electron and non-secure local previews. */
export async function copyText(text: string): Promise<void> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
  } catch {
    /* use the synchronous user-gesture fallback */
  }
  const selection = document.getSelection()
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i))
    : []
  const active = document.activeElement
  const field = document.createElement('textarea')
  field.value = text
  field.style.cssText = 'position:fixed;left:-9999px;opacity:0'
  document.body.append(field)
  try {
    field.select()
    if (!document.execCommand('copy')) throw new Error('Clipboard access denied')
  } finally {
    field.remove()
    if (active instanceof HTMLElement) active.focus({ preventScroll: true })
    selection?.removeAllRanges()
    ranges.forEach((range) => selection?.addRange(range))
  }
}
