import type { Extension } from '@codemirror/state'
import { EditorView as CodeMirrorView } from '@codemirror/view'

import { DESK_SELECT_ALL_EVENT } from './markdown/documentSelection'

const NESTED_ISLAND_SELECTOR = [
  '.mm-editor',
  '.is-mindmap-island-active',
  '.md-textarea',
  '.rich-inline-editor'
].join(', ')

/** Menu accelerators blur the nested editor before Select All runs. */
let lastNestedCodeMirror: HTMLElement | null = null
let lastCodeMirrorView: CodeMirrorView | null = null

/**
 * Cmd+A is handled by the app menu, which blurs CodeMirror and then calls
 * `focus()` after selecting the document. `collapseBrowserSelectAllOnFocus`
 * would otherwise collapse that selection on the next animation frame.
 */
const preserveSelectAll = new WeakSet<CodeMirrorView>()

export function shouldPreserveCodeMirrorSelectAll(view: CodeMirrorView): boolean {
  return preserveSelectAll.has(view)
}

function rememberNestedCodeMirror(event: FocusEvent): void {
  const target = event.target
  if (!(target instanceof Element)) return
  const editor = target.closest('.cm-editor')
  if (editor instanceof HTMLElement) lastNestedCodeMirror = editor
}

function forgetNestedCodeMirrorOnNoteClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof Element)) return
  if (target.closest('.cm-editor')) return
  if (!target.closest('.ProseMirror')) return
  lastNestedCodeMirror = null
  lastCodeMirrorView = null
}

if (typeof document !== 'undefined') {
  document.addEventListener('focusin', rememberNestedCodeMirror, true)
  document.addEventListener('mousedown', forgetNestedCodeMirrorOnNoteClick, true)
}

/** Keep a live EditorView so Select All does not depend on `findFromDOM`. */
export function trackNestedCodeMirrorFocus(): Extension {
  return CodeMirrorView.domEventHandlers({
    focus(_event, view) {
      lastCodeMirrorView = view
      lastNestedCodeMirror = view.dom
      return false
    }
  })
}

export function selectAllInCodeMirrorView(view: CodeMirrorView): boolean {
  if (!isUsableCodeMirror(view.dom)) return false
  preserveSelectAll.add(view)
  view.dispatch({
    selection: { anchor: 0, head: view.state.doc.length },
    userEvent: 'select.all',
    scrollIntoView: true
  })
  view.focus()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      preserveSelectAll.delete(view)
    })
  })
  lastCodeMirrorView = view
  lastNestedCodeMirror = view.dom
  return true
}

function selectFormField(element: HTMLInputElement | HTMLTextAreaElement): boolean {
  if (element.disabled) return false
  element.select()
  return true
}

function selectContentEditable(element: HTMLElement): boolean {
  const selection = element.ownerDocument.getSelection()
  if (!selection) return false
  const range = element.ownerDocument.createRange()
  range.selectNodeContents(element)
  selection.removeAllRanges()
  selection.addRange(range)
  return true
}

function isUsableCodeMirror(root: HTMLElement): boolean {
  if (!root.isConnected) return false
  if (root.closest('.codemirror-host.hidden')) return false
  let node: HTMLElement | null = root
  while (node) {
    if (node.hidden) return false
    node = node.parentElement
  }
  return true
}

function selectCodeMirror(root: HTMLElement | null | undefined): boolean {
  if (!root || !isUsableCodeMirror(root)) return false
  const view = CodeMirrorView.findFromDOM(root)
  if (!view) return false
  return selectAllInCodeMirrorView(view)
}

function nestedCodeMirrorRoot(element: Element | null): HTMLElement | null {
  if (!(element instanceof HTMLElement)) return null
  const root = element.closest('.cm-editor')
  return root instanceof HTMLElement ? root : null
}

function selectFocusedCodeMirror(active: Element | null): boolean {
  return selectCodeMirror(nestedCodeMirrorRoot(active))
}

function selectRememberedCodeMirror(): boolean {
  if (lastCodeMirrorView && !lastCodeMirrorView.dom.isConnected) {
    lastCodeMirrorView = null
  }
  if (lastCodeMirrorView && selectAllInCodeMirrorView(lastCodeMirrorView)) return true
  const focused = document.querySelector('.cm-editor.cm-focused')
  if (focused instanceof HTMLElement && selectCodeMirror(focused)) return true
  return selectCodeMirror(lastNestedCodeMirror)
}

/** Select in the focused field/CM, otherwise ask the active note editor to select all. */
export function selectAllInRenderer(): void {
  const active = document.activeElement
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
    selectFormField(active)
    return
  }
  if (active instanceof HTMLElement && active.closest(NESTED_ISLAND_SELECTOR)) {
    if (active.isContentEditable) selectContentEditable(active)
    return
  }
  if (selectFocusedCodeMirror(active)) return
  if (selectRememberedCodeMirror()) return
  window.dispatchEvent(new Event(DESK_SELECT_ALL_EVENT))
}
