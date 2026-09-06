import { imageSchema } from '@milkdown/kit/preset/commonmark'
import { $remark } from '@milkdown/kit/utils'
import {
  formatImageAttrs,
  normalizeImageAlign,
  normalizeImageWidth,
  parseImageAttrs,
  serializeImageMarkdown,
  type ImageAlign
} from '@tnotesjs/ui/image-markdown'

import type { MilkdownPlugin } from '@milkdown/kit/ctx'

export const IMAGE_CLIPBOARD_SRC = 'data-tn-src'
export const IMAGE_CLIPBOARD_WIDTH = 'data-tn-width'
export const IMAGE_CLIPBOARD_ALIGN = 'data-tn-align'

export function markdownSrcFromClipboardUrl(src: string): string {
  const value = src.trim()
  if (!value) return ''
  if (value.startsWith('tnotes-asset:')) {
    try {
      return new URL(value).searchParams.get('path') ?? ''
    } catch {
      return ''
    }
  }
  return value
}

export function applyImageClipboardAttrs(
  element: HTMLElement,
  attrs: { src: string; width?: string; align?: ImageAlign | string }
): void {
  const src = attrs.src.trim()
  if (src) element.setAttribute(IMAGE_CLIPBOARD_SRC, src)
  else element.removeAttribute(IMAGE_CLIPBOARD_SRC)
  const width = normalizeImageWidth(attrs.width ?? '')
  if (width) element.setAttribute(IMAGE_CLIPBOARD_WIDTH, width)
  else element.removeAttribute(IMAGE_CLIPBOARD_WIDTH)
  const align = normalizeImageAlign(attrs.align ?? '')
  if (align !== 'left') element.setAttribute(IMAGE_CLIPBOARD_ALIGN, align)
  else element.removeAttribute(IMAGE_CLIPBOARD_ALIGN)
}

export function readPastedImageAttrs(dom: HTMLElement): {
  src: string
  alt: string
  title: string
  width: string
  align: ImageAlign
} {
  const image = dom.tagName === 'IMG' ? dom : (dom.querySelector('img') ?? dom)
  const figure =
    image.closest('figure.desk-image') ?? image.closest('figure') ?? (dom.closest('figure') || null)
  const stack = image.closest('.desk-image__stack')
  const src =
    image.getAttribute(IMAGE_CLIPBOARD_SRC) ||
    figure?.getAttribute(IMAGE_CLIPBOARD_SRC) ||
    markdownSrcFromClipboardUrl(image.getAttribute('src') || '')
  const width =
    normalizeImageWidth(image.getAttribute(IMAGE_CLIPBOARD_WIDTH) || '') ||
    normalizeImageWidth(figure?.getAttribute(IMAGE_CLIPBOARD_WIDTH) || '') ||
    normalizeImageWidth(stack instanceof HTMLElement ? stack.style.width : '')
  let align = normalizeImageAlign(
    image.getAttribute(IMAGE_CLIPBOARD_ALIGN) || figure?.getAttribute(IMAGE_CLIPBOARD_ALIGN) || ''
  )
  if (align === 'left' && figure) {
    if (figure.classList.contains('tn-image--center')) align = 'center'
    else if (figure.classList.contains('tn-image--right')) align = 'right'
  }
  return {
    src,
    alt: image.getAttribute('alt') || '',
    title: image.getAttribute('title') || '',
    width,
    align
  }
}

interface MdastNode {
  type: string
  url?: string
  alt?: string
  title?: string
  value?: string
  data?: { tnWidth?: string; tnAlign?: ImageAlign }
  children?: MdastNode[]
}

function attachImageAttrs(tree: MdastNode): void {
  if (tree.type === 'paragraph' && tree.children) {
    const children = tree.children
    for (let index = 0; index < children.length; index += 1) {
      const node = children[index]
      if (node.type !== 'image') continue
      const next = children[index + 1]
      if (next?.type !== 'text' || typeof next.value !== 'string') continue
      const parsed = parseImageAttrs(next.value)
      if (parsed.rest) continue
      if (!parsed.width && parsed.align === 'left') continue
      node.data = {
        ...node.data,
        tnWidth: parsed.width,
        tnAlign: parsed.align
      }
      children.splice(index + 1, 1)
    }
  }
  for (const child of tree.children ?? []) attachImageAttrs(child)
}

export const imageWidthRemark = $remark(
  'deskImageWidth',
  () => () => (tree) => {
    attachImageAttrs(tree as MdastNode)
  }
)

export const sourcePreservingImageSchema = imageSchema.extendSchema((base) => (ctx) => {
  const schema = base(ctx)
  return {
    ...schema,
    attrs: {
      ...schema.attrs,
      width: { default: '' },
      align: { default: 'left' }
    },
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs: (dom) => {
          if (!(dom instanceof HTMLElement)) return false
          return readPastedImageAttrs(dom)
        }
      }
    ],
    toDOM: (node) => {
      const src = String(node.attrs.src ?? '')
      const width = normalizeImageWidth(String(node.attrs.width ?? ''))
      const align = normalizeImageAlign(String(node.attrs.align ?? ''))
      return [
        'img',
        {
          src,
          alt: String(node.attrs.alt ?? ''),
          title: String(node.attrs.title ?? ''),
          [IMAGE_CLIPBOARD_SRC]: src,
          ...(width ? { [IMAGE_CLIPBOARD_WIDTH]: width } : {}),
          ...(align !== 'left' ? { [IMAGE_CLIPBOARD_ALIGN]: align } : {})
        }
      ]
    },
    leafText: (node) =>
      serializeImageMarkdown({
        alt: String(node.attrs.alt ?? ''),
        src: String(node.attrs.src ?? ''),
        title: String(node.attrs.title ?? ''),
        width: String(node.attrs.width ?? ''),
        align: normalizeImageAlign(String(node.attrs.align ?? ''))
      }),
    parseMarkdown: {
      match: schema.parseMarkdown.match,
      runner: (state, node, type) => {
        const data = node as MdastNode
        state.addNode(type, {
          src: String(node.url ?? ''),
          alt: String(node.alt ?? ''),
          title: String(node.title ?? ''),
          width: String(data.data?.tnWidth ?? ''),
          align: data.data?.tnAlign ?? 'left'
        })
      }
    },
    toMarkdown: {
      match: schema.toMarkdown.match,
      runner: (state, node) => {
        state.addNode('image', undefined, undefined, {
          title: node.attrs.title,
          url: node.attrs.src,
          alt: node.attrs.alt
        })
        const attrs = formatImageAttrs({
          width: String(node.attrs.width ?? ''),
          align: String(node.attrs.align ?? 'left')
        })
        if (attrs) state.addNode('text', undefined, ` ${attrs}`)
      }
    }
  }
})

export const imageAttrPlugins: MilkdownPlugin[] = [
  ...imageWidthRemark,
  ...sourcePreservingImageSchema
]
