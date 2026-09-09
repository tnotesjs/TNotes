import { nextTick } from 'vue'

/** Focus a text field and put the caret after the last character. */
export function placeCaretAtEnd(input: HTMLInputElement): void {
  input.focus()
  const end = input.value.length
  input.setSelectionRange(end, end)
}

/**
 * Focus a dialog field after Vue mounts it.
 *
 * Native Electron context menus restore webContents focus after the IPC
 * round-trip, which steals HTML `autofocus` — retry once on the next macrotask.
 */
export async function focusDialogInput(
  getInput: () => HTMLInputElement | null | undefined,
  options?: { retryDelayMs?: number }
): Promise<void> {
  const apply = (): void => {
    const input = getInput()
    if (!input) return
    placeCaretAtEnd(input)
  }

  await nextTick()
  apply()
  const delay = options?.retryDelayMs ?? 16
  await new Promise<void>((resolve) => {
    window.setTimeout(() => {
      apply()
      resolve()
    }, delay)
  })
}
