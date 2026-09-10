/** Shared image caption, width, and alignment helpers for SSG and Desk. */

const ATTR_BLOCK = /^\s*\{([^}]*)\}\s*$/i

export type ImageAlign = 'left' | 'center' | 'right'

export interface ImageMarkdown {
  alt: string
  src: string
  title?: string
  /** Normalized CSS size, e.g. `50%` or `400px`. Empty means natural width. */
  width?: string
  /** Omitted or `left` is the default and is not written to markdown. */
  align?: ImageAlign
}

export interface ImageAttrs {
  width: string
  align: ImageAlign
  rest: string
}

export function normalizeImageAlign(raw: string): ImageAlign {
  const value = raw.trim().toLowerCase()
  if (value === 'center' || value === 'middle') return 'center'
  if (value === 'right') return 'right'
  return 'left'
}

export function parseImageAttrs(text: string): ImageAttrs {
  const match = text.match(ATTR_BLOCK)
  if (!match) return { width: '', align: 'left', rest: text }
  const body = match[1].trim()
  if (!body) return { width: '', align: 'left', rest: '' }
  if (!/(?:^|[\s,])(?:w|width|align|a)\s*=/i.test(` ${body}`)) {
    return { width: '', align: 'left', rest: text }
  }
  let width = ''
  let align: ImageAlign = 'left'
  for (const part of body.split(/[\s,]+/).filter(Boolean)) {
    const eq = part.indexOf('=')
    if (eq < 0) continue
    const key = part.slice(0, eq).trim().toLowerCase()
    const value = part.slice(eq + 1).trim()
    if (key === 'w' || key === 'width') width = normalizeImageWidth(value)
    else if (key === 'align' || key === 'a') align = normalizeImageAlign(value)
  }
  return { width, align, rest: '' }
}

export function parseImageWidthAttr(text: string): {
  width: string
  rest: string
} {
  const parsed = parseImageAttrs(text)
  return { width: parsed.width, rest: parsed.rest }
}

export function normalizeImageWidth(raw: string): string {
  const value = raw.trim()
  if (!value) return ''
  const pixels = value.match(/^(\d+(?:\.\d+)?)px$/i)
  if (pixels) {
    const amount = Number(pixels[1])
    if (!Number.isFinite(amount) || amount < 16) return ''
    return `${Math.round(amount)}px`
  }
  const percent = value.match(/^(\d+(?:\.\d+)?)%?$/)
  if (!percent) return ''
  const amount = Number(percent[1])
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100) return ''
  const normalized = Number.isInteger(amount)
    ? String(amount)
    : String(Math.round(amount * 100) / 100)
  return `${normalized}%`
}

/** Logical CSS px for a pasted bitmap, folding device pixel ratio (4K/retina). */
export function pasteDisplayWidthPx(naturalWidth: number, devicePixelRatio = 1): string {
  if (!Number.isFinite(naturalWidth) || naturalWidth <= 0) return ''
  const dpr = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1
  return normalizeImageWidth(`${Math.round(naturalWidth / dpr)}px`)
}

export function formatImageWidthAttr(width: string): string {
  return formatImageAttrs({ width, align: 'left' })
}

export function formatImageAttrs(attrs: { width?: string; align?: ImageAlign | string }): string {
  const width = normalizeImageWidth(attrs.width ?? '')
  const align = normalizeImageAlign(attrs.align ?? '')
  const parts: string[] = []
  if (width) parts.push(`w=${width}`)
  if (align !== 'left') parts.push(`align=${align}`)
  return parts.length > 0 ? `{${parts.join(' ')}}` : ''
}

export function serializeImageMarkdown(image: ImageMarkdown): string {
  const alt = image.alt.replaceAll('[', '').replaceAll(']', '')
  const title = image.title?.trim() ? ` "${image.title.replaceAll('"', '')}"` : ''
  const suffix = formatImageAttrs({
    width: image.width ?? '',
    align: image.align ?? 'left'
  })
  return `![${alt}](${image.src}${title})${suffix ? ` ${suffix}` : ''}`
}
