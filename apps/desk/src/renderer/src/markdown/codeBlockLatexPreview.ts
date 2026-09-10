import { EditorView as CodeMirrorView } from '@codemirror/view'
import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import { Plugin } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'

import { shouldPreserveCodeMirrorSelectAll } from '../selectAll'
import { DONE_PILL_ICON, EDIT_PILL_ICON } from './attachRawSourceEditor'

const LATEX_LANGUAGES = new Set(['latex', 'tex', 'math'])

export const LATEX_BLOCK_CLASS = 'desk-latex-block'
export const LATEX_EDIT_BUTTON_CLASS = 'desk-raw-block__edit'
export const LATEX_DONE_BUTTON_CLASS = 'desk-raw-block__editor-done'

const blurTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>()

export function isLatexLanguage(language: string | null | undefined): boolean {
  return LATEX_LANGUAGES.has((language ?? '').trim().toLowerCase())
}

export function isLatexCodeBlock(block: HTMLElement): boolean {
  if (block.classList.contains('desk-code-tab')) return false
  if (block.classList.contains(LATEX_BLOCK_CLASS)) return true
  const language = block.querySelector<HTMLInputElement>('.desk-code-language')?.value
  if (isLatexLanguage(language)) return true
  return Boolean(block.querySelector('.preview-panel'))
}

export function isLatexPreviewOnly(block: HTMLElement): boolean {
  return Boolean(block.querySelector('.codemirror-host.hidden'))
}

export function latexSourceHost(block: HTMLElement): HTMLElement | null {
  const host = block.querySelector('.codemirror-host')
  return host instanceof HTMLElement ? host : null
}

function previewToggleButton(block: HTMLElement): HTMLButtonElement | null {
  return block.querySelector('.preview-toggle-button')
}

export function enterLatexSource(block: HTMLElement): boolean {
  if (!isLatexCodeBlock(block) || !isLatexPreviewOnly(block)) return false
  previewToggleButton(block)?.click()
  syncLatexEditChrome(block)
  return true
}

export function exitLatexSource(block: HTMLElement): boolean {
  if (!isLatexCodeBlock(block) || isLatexPreviewOnly(block)) return false
  if (!block.querySelector('.preview-panel')) return false
  const host = latexSourceHost(block)
  const active = document.activeElement
  if (host && active instanceof HTMLElement && host.contains(active)) active.blur()
  previewToggleButton(block)?.click()
  syncLatexEditChrome(block)
  return true
}

export function toggleLatexSource(block: HTMLElement): boolean {
  return isLatexPreviewOnly(block) ? enterLatexSource(block) : exitLatexSource(block)
}

function sourceEditorFocused(block: HTMLElement): boolean {
  const host = latexSourceHost(block)
  const active = document.activeElement
  if (!(host instanceof HTMLElement) || !(active instanceof Node)) return false
  return host.contains(active)
}

function sourceChromeContains(host: HTMLElement, node: Node): boolean {
  return host.contains(node)
}

/** Keep the LaTeX source visible while the user is typing into it. */
export function revealLatexSourceIfEditing(block: HTMLElement): boolean {
  if (!sourceEditorFocused(block) || !isLatexPreviewOnly(block)) return false
  return enterLatexSource(block)
}

/** Collapse source once focus leaves the formula input (not the preview card). */
export function collapseLatexSourceIfIdle(
  block: HTMLElement,
  nextFocus: EventTarget | null
): boolean {
  const host = latexSourceHost(block)
  if (!host) return false
  if (nextFocus instanceof Node && sourceChromeContains(host, nextFocus)) return false
  if (sourceEditorFocused(block)) return false
  return exitLatexSource(block)
}

export function latexEditButton(block: HTMLElement): HTMLButtonElement | null {
  return block.querySelector<HTMLButtonElement>(
    `.preview-panel > .${LATEX_EDIT_BUTTON_CLASS}:not(.${LATEX_DONE_BUTTON_CLASS})`
  )
}

export function latexDoneButton(block: HTMLElement): HTMLButtonElement | null {
  return block.querySelector<HTMLButtonElement>(`.codemirror-host > .${LATEX_DONE_BUTTON_CLASS}`)
}

function bindChromeButton(button: HTMLButtonElement, onClick: () => void): void {
  button.addEventListener('mousedown', (event) => event.stopPropagation())
  button.addEventListener('pointerdown', (event) => event.stopPropagation())
  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    onClick()
  })
}

function ensureLatexEditButton(block: HTMLElement): HTMLButtonElement | null {
  const panel = block.querySelector('.preview-panel')
  if (!(panel instanceof HTMLElement)) {
    latexEditButton(block)?.remove()
    return null
  }
  let button = latexEditButton(block)
  if (!button) {
    button = document.createElement('button')
    button.type = 'button'
    button.className = `${LATEX_EDIT_BUTTON_CLASS} desk-raw-block__edit--pill`
    button.innerHTML = EDIT_PILL_ICON
    button.setAttribute('aria-label', '编辑源码')
    button.title = '编辑源码'
    bindChromeButton(button, () => {
      if (!enterLatexSource(block)) return
      queueMicrotask(() => {
        block.querySelector<HTMLElement>('.cm-content')?.focus()
      })
    })
    panel.append(button)
  }
  return button
}

function ensureLatexDoneButton(block: HTMLElement): HTMLButtonElement | null {
  const host = latexSourceHost(block)
  if (!host) return null
  let button = latexDoneButton(block)
  if (!button) {
    button = document.createElement('button')
    button.type = 'button'
    button.className = `${LATEX_EDIT_BUTTON_CLASS} desk-raw-block__edit--pill ${LATEX_DONE_BUTTON_CLASS}`
    button.innerHTML = DONE_PILL_ICON
    button.setAttribute('aria-label', '完成编辑')
    button.title = '完成编辑'
    bindChromeButton(button, () => {
      exitLatexSource(block)
    })
    host.append(button)
  }
  return button
}

function removeLegacyLatexChrome(block: HTMLElement): void {
  for (const node of [...block.querySelectorAll(`:scope > .${LATEX_EDIT_BUTTON_CLASS}`)]) {
    node.remove()
  }
}

function bindHostFocusOut(block: HTMLElement): void {
  const host = latexSourceHost(block)
  if (!host || host.dataset.deskLatexFocusout === '1') return
  host.dataset.deskLatexFocusout = '1'
  host.addEventListener('focusout', (event) => {
    scheduleCollapseLatexSource(block, event.relatedTarget)
  })
}

export function syncLatexEditChrome(block: HTMLElement, editable = true): void {
  removeLegacyLatexChrome(block)
  bindHostFocusOut(block)
  const edit = ensureLatexEditButton(block)
  const done = ensureLatexDoneButton(block)
  const editing = !isLatexPreviewOnly(block)
  if (!editable) {
    if (edit) {
      edit.hidden = true
      edit.disabled = true
    }
    if (done) {
      done.hidden = true
      done.disabled = true
    }
    return
  }
  if (edit) {
    edit.hidden = editing
    edit.disabled = editing
  }
  if (done) {
    done.hidden = false
    done.disabled = false
  }
}

/**
 * Tip-style blur: leave the input → hide it. A null relatedTarget (selection
 * drag or Cmd+A menu) waits briefly so focus can return to CodeMirror.
 */
export function scheduleCollapseLatexSource(
  block: HTMLElement,
  nextFocus: EventTarget | null
): void {
  const host = latexSourceHost(block)
  if (!host || host.classList.contains('hidden')) return
  if (nextFocus instanceof Node && sourceChromeContains(host, nextFocus)) return

  const existing = blurTimers.get(block)
  if (existing != null) clearTimeout(existing)

  const leftForSure = nextFocus instanceof Node && !sourceChromeContains(host, nextFocus)
  blurTimers.set(
    block,
    setTimeout(
      () => {
        blurTimers.delete(block)
        if (isLatexPreviewOnly(block)) return
        if (!leftForSure) {
          const active = document.activeElement
          if (active instanceof Node && sourceChromeContains(host, active)) return
          const cm = CodeMirrorView.findFromDOM(host)
          if (cm && shouldPreserveCodeMirrorSelectAll(cm)) return
        }
        if (!block.querySelector('.preview-panel')) return
        exitLatexSource(block)
      },
      leftForSure ? 0 : 50
    )
  )
}

function hiddenHostAddedWhileTyping(mutation: MutationRecord): HTMLElement | null {
  if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') return null
  const host = mutation.target
  if (!(host instanceof HTMLElement) || !host.classList.contains('codemirror-host')) return null
  if (!host.classList.contains('hidden')) return null
  const block = host.closest<HTMLElement>('.milkdown-code-block')
  if (!block || !isLatexCodeBlock(block) || !sourceEditorFocused(block)) return null
  return block
}

function clearLatexChrome(block: HTMLElement): void {
  block.classList.remove(LATEX_BLOCK_CLASS)
  latexEditButton(block)?.remove()
  latexDoneButton(block)?.remove()
  removeLegacyLatexChrome(block)
}

function syncLatexBlocksFromView(view: EditorView): void {
  if (view.isDestroyed) return
  view.state.doc.descendants((node, pos) => {
    if (node.type.name !== 'code_block') return
    const dom = view.nodeDOM(pos)
    if (!(dom instanceof HTMLElement) || !dom.classList.contains('milkdown-code-block')) return
    if (dom.classList.contains('desk-code-tab')) return
    if (
      !isLatexLanguage(String(node.attrs.language ?? '')) &&
      !dom.querySelector('.preview-panel')
    ) {
      clearLatexChrome(dom)
      return
    }
    dom.classList.add(LATEX_BLOCK_CLASS)
    syncLatexEditChrome(dom, view.editable)
  })
}

/**
 * Crepe treats `$$` as a LaTeX code block with a live preview. Desk keeps
 * contentful formulas preview-first: Edit sits outside the rendered formula,
 * Done sits outside the source input. Leaving the input hides it, matching tip.
 */
export function createCodeBlockLatexPreviewPlugin(): MilkdownPlugin {
  return $prose(() => {
    return new Plugin({
      view: (view) => {
        const sync = (): void => {
          if (view.isDestroyed) return
          syncLatexBlocksFromView(view)
        }
        const onFocusOut = (event: FocusEvent): void => {
          const target = event.target
          if (!(target instanceof Element)) return
          const host = target.closest('.codemirror-host')
          if (!(host instanceof HTMLElement) || host.classList.contains('hidden')) return
          const block = host.closest('.desk-latex-block')
          if (!(block instanceof HTMLElement)) return
          scheduleCollapseLatexSource(block, event.relatedTarget)
        }
        const observer = new MutationObserver((mutations) => {
          if (view.isDestroyed) return
          let sawTools = false
          for (const mutation of mutations) {
            const typing = hiddenHostAddedWhileTyping(mutation)
            if (typing) revealLatexSourceIfEditing(typing)
            if (mutation.type !== 'childList') continue
            const target = mutation.target
            if (target instanceof Element && target.closest(`.${LATEX_EDIT_BUTTON_CLASS}`)) continue
            sawTools = true
          }
          if (sawTools) sync()
        })
        observer.observe(view.dom, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['class']
        })
        view.dom.addEventListener('focusout', onFocusOut, true)
        sync()
        return {
          update: sync,
          destroy: () => {
            observer.disconnect()
            view.dom.removeEventListener('focusout', onFocusOut, true)
          }
        }
      }
    })
  })
}
