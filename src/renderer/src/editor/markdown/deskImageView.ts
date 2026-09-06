import { imageSchema } from '@milkdown/kit/preset/commonmark'
import { $view } from '@milkdown/kit/utils'
import {
  normalizeImageAlign,
  normalizeImageWidth,
  serializeImageMarkdown,
  type ImageAlign
} from '@tnotesjs/ui/image-markdown'

import { applyImageClipboardAttrs } from './imageAttrs'
import { resolveMarkdownImageUrl } from '../../markdown/markdownAssetUrl'
import { COPY_ICON, EXPAND_ICON } from '../../markdown/copyIcons'

import { NodeSelection } from '@milkdown/kit/prose/state'

import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import type { Node } from '@milkdown/kit/prose/model'
import type { EditorView } from '@milkdown/kit/prose/view'

const MIN_WIDTH = 80
const COMPACT_WIDTH = 120
const COMPACT_HEIGHT = 40
const SIZE_PRESETS = [25, 50, 75, 100] as const
const CORNERS = ['tl', 'tr', 'br', 'bl'] as const
type Corner = (typeof CORNERS)[number]

const DELETE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></svg>'
const MORE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>'
const SIZE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="6" width="12" height="12" rx="1"/><path d="M16 10h4v10H10v-4"/></svg>'
const CAPTION_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M4 12h10M4 17h16"/></svg>'
const ALIGN_ICONS: Record<ImageAlign, string> = {
  left: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h14"/></svg>',
  center:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M5 18h14"/></svg>',
  right:
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M10 12h10M6 18h14"/></svg>'
}

export function createDeskImageView(options: {
  knowledgeBaseId: () => string
  noteUuid: () => string
  isReadOnly: () => boolean
  writeClipboard?: (text: string) => Promise<void> | void
}): MilkdownPlugin {
  return $view(imageSchema.node, () => (initialNode, view, getPos) => {
    let current = initialNode
    let selected = false
    let hovered = false
    let captionOpen = Boolean(String(initialNode.attrs.alt ?? '').trim())
    let openPanel: 'size' | 'align' | 'more' | '' = ''

    const figure = document.createElement('figure')
    figure.className = 'tn-image desk-image'
    figure.contentEditable = 'false'
    figure.style.display = 'block'
    figure.style.width = '100%'
    const chrome = document.createElement('div')
    chrome.className = 'desk-image__chrome'
    const toolbar = document.createElement('div')
    toolbar.className = 'desk-image__toolbar'
    const sizeWrap = document.createElement('div')
    sizeWrap.className = 'desk-image__tool-wrap'
    const sizeButton = toolButton(SIZE_ICON, '宽高', '宽高')
    const captionButton = toolButton(CAPTION_ICON, '描述', '描述')
    const alignWrap = document.createElement('div')
    alignWrap.className = 'desk-image__tool-wrap'
    const alignButton = toolButton(ALIGN_ICONS.left, '对齐', '对齐')
    alignButton.classList.add('desk-image__align-trigger')

    const sizePanel = document.createElement('div')
    sizePanel.className = 'desk-image__panel desk-image__size-panel'
    const widthInput = numberField('宽')
    const heightInput = numberField('高')
    const presets = document.createElement('div')
    presets.className = 'desk-image__presets'
    for (const amount of SIZE_PRESETS) {
      const preset = document.createElement('button')
      preset.type = 'button'
      preset.className = 'desk-image__preset'
      preset.textContent = `${amount}%`
      preset.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        writeAttrs(view, getPos, { width: `${amount}%` })
        closePanels()
      })
      presets.append(preset)
    }
    sizePanel.append(widthInput.row, heightInput.row, presets)
    sizeWrap.append(sizeButton, sizePanel)

    const alignPanel = document.createElement('div')
    alignPanel.className = 'desk-image__panel desk-image__align-panel'
    const alignActions: Array<{ align: ImageAlign; label: string }> = [
      { align: 'left', label: '左对齐' },
      { align: 'center', label: '居中对齐' },
      { align: 'right', label: '右对齐' }
    ]
    for (const item of alignActions) {
      const action = document.createElement('button')
      action.type = 'button'
      action.className = 'desk-image__menu-item'
      action.dataset.align = item.align
      action.setAttribute('aria-label', item.label)
      action.dataset.label = item.label
      action.innerHTML = ALIGN_ICONS[item.align]
      action.addEventListener('click', (event) => {
        event.preventDefault()
        event.stopPropagation()
        writeAttrs(view, getPos, { align: item.align })
        closePanels()
      })
      alignPanel.append(action)
    }
    alignWrap.append(alignButton, alignPanel)
    toolbar.append(sizeWrap, captionButton, alignWrap)
    chrome.append(toolbar)

    const stage = document.createElement('div')
    stage.className = 'desk-image__stage'
    const stack = document.createElement('div')
    stack.className = 'desk-image__stack'
    const frame = document.createElement('div')
    frame.className = 'desk-image__frame'
    const image = document.createElement('img')
    image.draggable = false
    const ghost = document.createElement('div')
    ghost.className = 'desk-image__ghost'
    ghost.hidden = true
    const sizeLabel = document.createElement('div')
    sizeLabel.className = 'desk-image__size-label'
    ghost.append(sizeLabel)
    const handles = Object.fromEntries(
      CORNERS.map((corner) => {
        const handle = document.createElement('div')
        handle.className = `desk-image__handle desk-image__handle--${corner}`
        handle.dataset.corner = corner
        return [corner, handle]
      })
    ) as Record<Corner, HTMLDivElement>

    const quick = document.createElement('div')
    quick.className = 'desk-image__quick'
    const previewButton = iconButton(EXPAND_ICON, '全屏')
    const deleteButton = iconButton(DELETE_ICON, '删除')
    const copyButton = iconButton(COPY_ICON, '复制')
    copyButton.classList.add('desk-image__copy')
    const moreButton = iconButton(MORE_ICON, '更多')
    moreButton.classList.add('desk-image__more')
    const dividerA = document.createElement('span')
    dividerA.className = 'desk-image__quick-divider'
    const dividerB = document.createElement('span')
    dividerB.className = 'desk-image__quick-divider'
    quick.append(previewButton, dividerA, deleteButton, dividerB, copyButton, moreButton)

    const morePanel = document.createElement('div')
    morePanel.className = 'desk-image__panel desk-image__more-panel'
    const morePreview = menuItem(EXPAND_ICON, '全屏')
    const moreDelete = menuItem(DELETE_ICON, '删除')
    const moreCopy = menuItem(COPY_ICON, '复制')
    morePanel.append(morePreview, moreDelete, moreCopy)

    const caption = document.createElement('input')
    caption.type = 'text'
    caption.className = 'desk-image__caption'
    caption.placeholder = '添加图片描述'
    caption.spellcheck = false
    caption.size = 1
    const captionRow = document.createElement('div')
    captionRow.className = 'desk-image__caption-row'
    captionRow.append(caption)

    frame.append(
      image,
      ghost,
      ...CORNERS.map((corner) => handles[corner]),
      quick,
      morePanel,
      chrome
    )
    stack.append(frame, captionRow)
    stage.append(stack)
    figure.append(stage)

    const isolate = (event: Event): void => {
      event.stopPropagation()
    }
    for (const node of [chrome, sizePanel, alignPanel, quick, morePanel, caption]) {
      node.addEventListener('mousedown', isolate)
      node.addEventListener('pointerdown', isolate)
    }
    caption.addEventListener('keydown', (event) => {
      event.stopPropagation()
      if (event.key === 'Enter') {
        event.preventDefault()
        caption.blur()
      }
    })
    caption.addEventListener('change', () => {
      writeAttrs(view, getPos, { alt: caption.value.trim() })
    })
    caption.addEventListener('blur', () => {
      const alt = caption.value.trim()
      writeAttrs(view, getPos, { alt })
      captionOpen = Boolean(alt)
      syncChrome()
    })

    sizeButton.addEventListener('click', (event) => {
      event.preventDefault()
      togglePanel('size')
      if (openPanel === 'size') fillSizeInputs()
    })
    captionButton.addEventListener('click', (event) => {
      event.preventDefault()
      captionOpen = true
      closePanels()
      syncChrome()
      caption.focus()
    })
    alignButton.addEventListener('click', (event) => {
      event.preventDefault()
      togglePanel('align')
    })
    moreButton.addEventListener('click', (event) => {
      event.preventDefault()
      togglePanel('more')
    })

    const preview = (): void => {
      closePanels()
      document.dispatchEvent(new CustomEvent('tn:preview-image', { detail: image }))
    }
    const remove = (): void => {
      closePanels()
      deleteImage(view, getPos)
    }
    const copyMarkdown = (): void => {
      closePanels()
      void options.writeClipboard?.(
        serializeImageMarkdown({
          alt: String(current.attrs.alt ?? ''),
          src: String(current.attrs.src ?? ''),
          title: String(current.attrs.title ?? ''),
          width: String(current.attrs.width ?? ''),
          align: normalizeImageAlign(String(current.attrs.align ?? ''))
        })
      )
    }
    previewButton.addEventListener('click', (event) => {
      event.preventDefault()
      preview()
    })
    deleteButton.addEventListener('click', (event) => {
      event.preventDefault()
      remove()
    })
    copyButton.addEventListener('click', (event) => {
      event.preventDefault()
      copyMarkdown()
    })
    morePreview.addEventListener('click', (event) => {
      event.preventDefault()
      preview()
    })
    moreDelete.addEventListener('click', (event) => {
      event.preventDefault()
      remove()
    })
    moreCopy.addEventListener('click', (event) => {
      event.preventDefault()
      copyMarkdown()
    })

    const commitManualSize = (axis: 'width' | 'height'): void => {
      const aspect = currentAspect()
      const next =
        axis === 'width'
          ? Number.parseInt(widthInput.input.value, 10)
          : Math.round(Number.parseInt(heightInput.input.value, 10) * aspect)
      if (!Number.isFinite(next)) {
        fillSizeInputs()
        return
      }
      writeAttrs(view, getPos, { width: `${clampWidth(next)}px` })
    }
    widthInput.input.addEventListener('change', () => commitManualSize('width'))
    heightInput.input.addEventListener('change', () => commitManualSize('height'))
    widthInput.input.addEventListener('input', () => {
      const width = Number.parseInt(widthInput.input.value, 10)
      const aspect = currentAspect()
      if (!Number.isFinite(width) || aspect <= 0) return
      heightInput.input.value = String(Math.max(1, Math.round(width / aspect)))
    })
    heightInput.input.addEventListener('input', () => {
      const height = Number.parseInt(heightInput.input.value, 10)
      const aspect = currentAspect()
      if (!Number.isFinite(height) || aspect <= 0) return
      widthInput.input.value = String(Math.max(1, Math.round(height * aspect)))
    })

    let drag: { corner: Corner; aspect: number; anchorX: number; anchorY: number } | null =
      null
    const applyDisplayWidth = (width: string): void => {
      if (width) {
        stack.style.width = width
        stack.classList.add('is-sized')
        image.style.width = '100%'
      } else {
        stack.style.removeProperty('width')
        stack.classList.remove('is-sized')
        image.style.removeProperty('width')
      }
    }
    const applyPreviewWidth = (width: number): void => {
      const next = clampWidth(width)
      applyDisplayWidth(`${next}px`)
      const height = Math.max(1, Math.round(next / Math.max(currentAspect(), 0.01)))
      sizeLabel.textContent = `${next} × ${height}`
    }
    const beginDrag = (corner: Corner, event: PointerEvent): void => {
      if (options.isReadOnly() || event.button !== 0) return
      event.preventDefault()
      event.stopPropagation()
      const rect = image.getBoundingClientRect()
      if (rect.height <= 0 || rect.width <= 0) return
      const anchor = oppositeCorner(corner, rect)
      drag = {
        corner,
        aspect: rect.width / rect.height,
        anchorX: anchor.x,
        anchorY: anchor.y
      }
      closePanels()
      ghost.hidden = false
      figure.classList.add('is-resizing')
      document.body.classList.add('is-resizing-image')
      handles[corner].setPointerCapture(event.pointerId)
      applyPreviewWidth(rect.width)
    }
    const onDrag = (event: PointerEvent): void => {
      if (!drag) return
      event.preventDefault()
      const fromX = Math.abs(event.clientX - drag.anchorX)
      const fromY = Math.abs(event.clientY - drag.anchorY) * drag.aspect
      applyPreviewWidth(Math.max(fromX, fromY))
    }
    const endDrag = (event: PointerEvent): void => {
      if (!drag) return
      const width = image.getBoundingClientRect().width
      const handle = handles[drag.corner]
      drag = null
      ghost.hidden = true
      figure.classList.remove('is-resizing')
      document.body.classList.remove('is-resizing-image')
      if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId)
      writeAttrs(view, getPos, { width: `${Math.round(width)}px` })
    }
    for (const corner of CORNERS) {
      handles[corner].addEventListener('pointerdown', (event) => beginDrag(corner, event))
      handles[corner].addEventListener('pointermove', onDrag)
      handles[corner].addEventListener('pointerup', endDrag)
      handles[corner].addEventListener('mouseup', endDrag)
      handles[corner].addEventListener('pointercancel', endDrag)
    }

    figure.addEventListener('mouseenter', () => {
      hovered = true
      syncChrome()
    })
    figure.addEventListener('mouseleave', () => {
      hovered = false
      if (openPanel !== 'more') syncChrome()
    })
    figure.addEventListener('click', (event) => {
      if (!options.isReadOnly()) return
      const target = event.target
      if (
        target instanceof Element &&
        target.closest('.desk-image__caption, .desk-image__caption-row')
      ) {
        return
      }
      event.preventDefault()
      event.stopPropagation()
      preview()
    })
    image.addEventListener('load', () => {
      syncCompact()
      if (openPanel === 'size') fillSizeInputs()
    })

    const onDocumentPointerDown = (event: PointerEvent): void => {
      if (!openPanel) return
      const target = event.target
      if (target instanceof Node && figure.contains(target)) return
      closePanels()
    }
    document.addEventListener('pointerdown', onDocumentPointerDown)
    const observer =
      typeof ResizeObserver === 'function' ? new ResizeObserver(() => syncCompact()) : null
    observer?.observe(frame)

    const currentAspect = (): number => {
      if (image.naturalWidth > 0 && image.naturalHeight > 0) {
        return image.naturalWidth / image.naturalHeight
      }
      const rect = image.getBoundingClientRect()
      return rect.height > 0 ? rect.width / rect.height : 1
    }
    const maxWidth = (): number => Math.max(MIN_WIDTH, figure.clientWidth || MIN_WIDTH)
    const clampWidth = (width: number): number =>
      Math.round(Math.min(maxWidth(), Math.max(MIN_WIDTH, width)))
    const fillSizeInputs = (): void => {
      const rect = image.getBoundingClientRect()
      widthInput.input.value = String(Math.round(rect.width) || '')
      heightInput.input.value = String(Math.round(rect.height) || '')
    }
    const togglePanel = (panel: typeof openPanel): void => {
      openPanel = openPanel === panel ? '' : panel
      syncChrome()
    }
    const closePanels = (): void => {
      if (!openPanel) return
      openPanel = ''
      syncChrome()
    }
    const syncCompact = (): void => {
      const rect = image.getBoundingClientRect()
      figure.classList.toggle(
        'is-compact',
        rect.width > 0 && (rect.width < COMPACT_WIDTH || rect.height < COMPACT_HEIGHT)
      )
    }
    const syncChrome = (): void => {
      const readOnly = options.isReadOnly()
      const showQuick = !readOnly && (hovered || selected || openPanel === 'more')
      const showToolbar = !readOnly && selected
      const alt = String(current.attrs.alt ?? '').trim()
      chrome.hidden = !showToolbar
      sizePanel.hidden = openPanel !== 'size'
      alignPanel.hidden = openPanel !== 'align'
      morePanel.hidden = openPanel !== 'more'
      quick.hidden = !showQuick
      figure.dataset.panel = openPanel
      caption.hidden = readOnly ? !alt : !(alt || captionOpen)
      captionRow.hidden = caption.hidden
      caption.readOnly = readOnly
      caption.classList.toggle('is-readonly', readOnly)
      figure.classList.toggle('is-readonly', readOnly)
      figure.classList.toggle('is-more-open', openPanel === 'more')
      figure.classList.toggle('tn-preview-ignore', !readOnly)
      figure.classList.toggle('has-caption', !caption.hidden)
      for (const corner of CORNERS) handles[corner].hidden = readOnly || !selected
      syncCompact()
    }

    const render = (node: Node, nextSelected: boolean): void => {
      current = node
      selected = nextSelected
      const source = String(node.attrs.src ?? '')
      const presentationUrl = resolveMarkdownImageUrl(
        source,
        options.knowledgeBaseId(),
        options.noteUuid()
      )
      if (presentationUrl) image.setAttribute('src', presentationUrl)
      else image.removeAttribute('src')
      image.classList.toggle('is-unavailable', !presentationUrl)
      const alt = String(node.attrs.alt ?? '')
      image.setAttribute('alt', alt)
      const title = String(node.attrs.title ?? '')
      if (title) image.setAttribute('title', title)
      else image.removeAttribute('title')
      if (!figure.classList.contains('is-resizing')) {
        applyDisplayWidth(normalizeImageWidth(String(node.attrs.width ?? '')))
      }
      image.style.maxWidth = '100%'
      image.style.height = 'auto'
      const align = normalizeImageAlign(String(node.attrs.align ?? ''))
      applyImageClipboardAttrs(image, { src: source, width: String(node.attrs.width ?? ''), align })
      applyImageClipboardAttrs(figure, { src: source, width: String(node.attrs.width ?? ''), align })
      figure.classList.toggle('tn-image--center', align === 'center')
      figure.classList.toggle('tn-image--right', align === 'right')
      figure.classList.toggle('is-selected', selected && !options.isReadOnly())
      alignButton.innerHTML = ALIGN_ICONS[align]
      caption.value = alt
      if (alt) captionOpen = true
      syncChrome()
    }

    render(initialNode, false)
    return {
      dom: figure,
      update: (nextNode) => {
        if (nextNode.type !== current.type) return false
        render(nextNode, selected)
        return true
      },
      selectNode: () => render(current, !options.isReadOnly()),
      deselectNode: () => {
        captionOpen = Boolean(String(current.attrs.alt ?? '').trim())
        closePanels()
        render(current, false)
      },
      stopEvent: (event) => {
        if (!options.isReadOnly()) return false
        return (
          event instanceof MouseEvent ||
          event instanceof PointerEvent ||
          event.type.startsWith('mouse') ||
          event.type.startsWith('pointer')
        )
      },
      ignoreMutation: () => true,
      destroy: () => {
        observer?.disconnect()
        document.removeEventListener('pointerdown', onDocumentPointerDown)
        document.body.classList.remove('is-resizing-image')
      }
    }
  })
}

function toolButton(icon: string, label: string, title: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'desk-image__tool'
  button.title = title || label
  button.setAttribute('aria-label', label)
  button.dataset.label = label
  button.innerHTML = icon
  return button
}

function iconButton(icon: string, title: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'desk-image__quick-btn'
  button.title = title
  button.innerHTML = icon
  return button
}

function menuItem(icon: string, label: string): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'desk-image__menu-item'
  button.setAttribute('aria-label', label)
  button.dataset.label = label
  button.innerHTML = icon
  return button
}

function numberField(label: string): { row: HTMLLabelElement; input: HTMLInputElement } {
  const row = document.createElement('label')
  row.className = 'desk-image__field'
  const text = document.createElement('span')
  text.textContent = label
  const input = document.createElement('input')
  input.type = 'text'
  input.inputMode = 'numeric'
  input.autocomplete = 'off'
  input.spellcheck = false
  row.append(text, input)
  return { row, input }
}

function oppositeCorner(
  corner: Corner,
  rect: DOMRect
): { x: number; y: number } {
  if (corner === 'tl') return { x: rect.right, y: rect.bottom }
  if (corner === 'tr') return { x: rect.left, y: rect.bottom }
  if (corner === 'bl') return { x: rect.right, y: rect.top }
  return { x: rect.left, y: rect.top }
}

function writeAttrs(
  view: EditorView,
  getPos: () => number | undefined,
  patch: { alt?: string; width?: string; align?: ImageAlign }
): void {
  if (view.isDestroyed) return
  const pos = getPos()
  if (pos == null) return
  const current = view.state.doc.nodeAt(pos)
  if (!current || current.type.name !== 'image') return
  const next = { ...current.attrs, ...patch }
  if (
    String(current.attrs.alt ?? '') === String(next.alt ?? '') &&
    String(current.attrs.width ?? '') === String(next.width ?? '') &&
    String(current.attrs.align ?? 'left') === String(next.align ?? 'left')
  ) {
    return
  }
  const tr = view.state.tr.setNodeMarkup(pos, undefined, next)
  view.dispatch(tr.setSelection(NodeSelection.create(tr.doc, pos)))
}

function deleteImage(view: EditorView, getPos: () => number | undefined): void {
  if (view.isDestroyed) return
  const pos = getPos()
  if (pos == null) return
  const current = view.state.doc.nodeAt(pos)
  if (!current || current.type.name !== 'image') return
  view.dispatch(view.state.tr.delete(pos, pos + current.nodeSize))
}
