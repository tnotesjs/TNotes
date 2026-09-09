import { Plugin, TextSelection } from '@milkdown/kit/prose/state'
import { GapCursor } from '@milkdown/kit/prose/gapcursor'
import type { Node as ProseNode, ResolvedPos } from '@milkdown/kit/prose/model'
import { $prose, $view } from '@milkdown/kit/utils'

import {
  DEFAULT_CALLOUT_TITLE,
  deskCalloutSchema,
  calloutPosEnteredFromAbove,
  focusCalloutTitleInput,
  isCaretEnteringCalloutTitle,
  isDeskCalloutNode
} from '../editor/markdown/deskCallout'
import type { VisualCalloutType } from '../editor/markdown/containerBody'
import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import { moveFromBlockBoundary } from './rawBlockInteractions'

function applyCalloutChrome(dom: HTMLElement, node: ProseNode): void {
  const calloutType = String(node.attrs.calloutType ?? 'tip')
  const title = String(node.attrs.title ?? '')
  const openColons = String(node.attrs.openColons ?? ':::')
  dom.className = `desk-callout custom-block custom-block-${calloutType}`
  dom.dataset.type = 'desk-callout'
  dom.dataset.callout = calloutType
  dom.dataset.title = title
  dom.dataset.openColons = openColons
}

function isEmptyCallout(node: ProseNode): boolean {
  if (node.childCount !== 1) return false
  const only = node.firstChild
  return Boolean(only && only.type.name === 'paragraph' && only.content.size === 0)
}

export function createDeskCalloutView(): MilkdownPlugin {
  return $view(deskCalloutSchema.node, () => (initial, view, getPos) => {
    let current = initial

    const dom = document.createElement('div')
    applyCalloutChrome(dom, current)

    const titleHost = document.createElement('div')
    titleHost.className = 'desk-callout__title-host'
    titleHost.contentEditable = 'false'

    const titleEl = document.createElement('input')
    titleEl.type = 'text'
    titleEl.className = 'custom-block-title desk-callout__title'
    titleEl.spellcheck = false
    titleEl.setAttribute('aria-label', '提示块标题')
    titleHost.draggable = false
    titleEl.draggable = false
    titleHost.append(titleEl)

    const bodyEl = document.createElement('div')
    bodyEl.className = 'custom-block-body'

    const syncTitleInput = (node: ProseNode): void => {
      const title = String(node.attrs.title ?? '')
      const calloutType = String(node.attrs.calloutType ?? 'tip') as VisualCalloutType
      const placeholder = DEFAULT_CALLOUT_TITLE[calloutType] ?? 'TIP'
      titleEl.placeholder = placeholder
      if (document.activeElement !== titleEl) titleEl.value = title
      titleEl.readOnly = !view.editable
    }

    syncTitleInput(current)
    dom.append(titleHost, bodyEl)

    const writeTitle = (nextTitle: string): void => {
      const position = getPos()
      if (position == null) return
      const node = view.state.doc.nodeAt(position)
      if (!node || !isDeskCalloutNode(node)) return
      if (String(node.attrs.title ?? '') === nextTitle) return
      view.dispatch(
        view.state.tr.setNodeMarkup(position, undefined, {
          ...node.attrs,
          title: nextTitle
        })
      )
    }

    const focusBody = (): void => {
      const position = getPos()
      if (position == null) return
      const $inside = view.state.doc.resolve(position + 1)
      view.dispatch(view.state.tr.setSelection(TextSelection.near($inside, 1)))
      view.focus()
    }

    const deleteCallout = (): boolean => {
      const position = getPos()
      if (position == null) return false
      const node = view.state.doc.nodeAt(position)
      if (!node || !isDeskCalloutNode(node)) return false
      view.dispatch(view.state.tr.delete(position, position + node.nodeSize))
      view.focus()
      return true
    }

    const onTitleInput = (): void => {
      writeTitle(titleEl.value)
    }

    const caretAtStart = (): boolean => titleEl.selectionStart === 0 && titleEl.selectionEnd === 0
    const caretAtEnd = (): boolean => {
      const end = titleEl.value.length
      return titleEl.selectionStart === end && titleEl.selectionEnd === end
    }

    const leaveCalloutUp = (): boolean => {
      writeTitle(titleEl.value.trim())
      const position = getPos()
      if (position == null) return false
      titleEl.blur()
      window.getSelection()?.removeAllRanges()
      return moveFromBlockBoundary(view, position, 'up')
    }

    const onTitleKeyDown = (event: KeyboardEvent): void => {
      event.stopPropagation()
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || event.isComposing) {
        return
      }

      if (
        event.key === 'Enter' ||
        event.key === 'ArrowDown' ||
        (event.key === 'ArrowRight' && caretAtEnd())
      ) {
        event.preventDefault()
        writeTitle(titleEl.value.trim())
        focusBody()
        return
      }
      // Single-line title: ↑ always leaves; ← leaves only at the start.
      if (event.key === 'ArrowUp' || (event.key === 'ArrowLeft' && caretAtStart())) {
        event.preventDefault()
        leaveCalloutUp()
        return
      }
      if (event.key === 'Backspace' && titleEl.value === '' && caretAtStart()) {
        const position = getPos()
        const node = position == null ? null : view.state.doc.nodeAt(position)
        if (node && isEmptyCallout(node)) {
          event.preventDefault()
          deleteCallout()
        }
      }
    }

    const onTitlePointerDown = (event: Event): void => {
      event.stopPropagation()
      if (!view.editable || titleEl.readOnly) return
      if (document.activeElement !== titleEl) titleEl.focus()
    }

    titleEl.addEventListener('input', onTitleInput)
    titleEl.addEventListener('keydown', onTitleKeyDown)
    titleEl.addEventListener('mousedown', onTitlePointerDown)
    titleEl.addEventListener('pointerdown', onTitlePointerDown)
    titleEl.addEventListener('click', (event) => event.stopPropagation())
    titleEl.addEventListener('blur', () => {
      const trimmed = titleEl.value.trim()
      if (trimmed !== titleEl.value) {
        titleEl.value = trimmed
        writeTitle(trimmed)
      }
    })

    return {
      dom,
      contentDOM: bodyEl,
      update: (next) => {
        if (!isDeskCalloutNode(next)) return false
        current = next
        applyCalloutChrome(dom, next)
        syncTitleInput(next)
        return true
      },
      selectNode: () => {
        dom.classList.add('ProseMirror-selectednode')
      },
      deselectNode: () => {
        dom.classList.remove('ProseMirror-selectednode')
      },
      ignoreMutation: (mutation) => {
        const target = mutation.target
        if (!(target instanceof Node)) return false
        return titleHost.contains(target)
      },
      stopEvent: (event) => {
        const target = event.target
        return target instanceof Node && titleHost.contains(target)
      },
      destroy: () => {
        titleEl.removeEventListener('input', onTitleInput)
        titleEl.removeEventListener('keydown', onTitleKeyDown)
        titleEl.removeEventListener('mousedown', onTitlePointerDown)
        titleEl.removeEventListener('pointerdown', onTitlePointerDown)
      }
    }
  })
}

function calloutPosFromCaret($from: ResolvedPos): number | null {
  for (let depth = $from.depth; depth >= 1; depth -= 1) {
    if (isDeskCalloutNode($from.node(depth))) return $from.before(depth)
  }
  return null
}

/** Backspace on an empty body deletes the callout; arrows enter/leave the title chrome. */
export const deskCalloutKeymapPlugin = $prose(
  () =>
    new Plugin({
      props: {
        handleKeyDown(view, event) {
          if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing) {
            return false
          }
          const { selection } = view.state
          if (!selection.empty) return false

          if (
            selection instanceof GapCursor &&
            !event.shiftKey &&
            (event.key === 'ArrowDown' || event.key === 'ArrowRight')
          ) {
            const next = selection.$head.nodeAfter
            if (next && isDeskCalloutNode(next)) {
              return focusCalloutTitleInput(view, selection.$head.pos, 'start')
            }
            return false
          }

          const { $from } = selection

          if (event.key === 'Backspace') {
            if ($from.parent.type.name !== 'paragraph' || $from.parentOffset !== 0) return false
            if ($from.index($from.depth - 1) !== 0) return false
            const callout = $from.node($from.depth - 1)
            if (!isDeskCalloutNode(callout) || !isEmptyCallout(callout)) return false
            const pos = $from.before($from.depth - 1)
            view.dispatch(view.state.tr.delete(pos, pos + callout.nodeSize))
            return true
          }

          if (event.shiftKey) return false

          if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            const calloutPos = calloutPosEnteredFromAbove(
              $from,
              event.key === 'ArrowDown' ? 'down' : 'right'
            )
            if (calloutPos == null) return false
            return focusCalloutTitleInput(
              view,
              calloutPos,
              event.key === 'ArrowRight' ? 'start' : $from.parentOffset
            )
          }

          if (event.key !== 'ArrowUp' && event.key !== 'ArrowLeft') return false
          const direction = event.key === 'ArrowUp' ? 'up' : 'left'
          if (!isCaretEnteringCalloutTitle($from, direction)) return false
          const calloutPos = calloutPosFromCaret($from)
          if (calloutPos == null) return false
          return focusCalloutTitleInput(
            view,
            calloutPos,
            event.key === 'ArrowLeft' ? 'end' : $from.parentOffset
          )
        }
      }
    })
)
