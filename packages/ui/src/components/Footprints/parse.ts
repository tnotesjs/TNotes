/** Parse `::: footprints` containers into props for the shared Footprints UI. */

export interface FootprintsPayload {
  times: number[]
  paragraphs: string[]
  images: string[]
  otherInfo: string
}

/** `2025-01-22 23:47` / `2025-01-22` → [y,m,d,h?,min?,s?] */
export function parseFootprintsDatetime(meta: string): number[] {
  const m = meta
    .trim()
    .match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/
    )
  if (!m) return []
  const parts = [Number(m[1]), Number(m[2]), Number(m[3])]
  if (m[4] !== undefined) {
    parts.push(Number(m[4]), Number(m[5]))
    if (m[6] !== undefined) parts.push(Number(m[6]))
  }
  return parts
}

function formatDatetime(times: number[]): string {
  if (times.length < 2) return ''
  const [y, m, d, h, min, s] = times
  let out = `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}`
  if (d !== undefined) out += `-${String(d).padStart(2, '0')}`
  if (h !== undefined && min !== undefined) {
    out += ` ${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
    if (s !== undefined) out += `:${String(s).padStart(2, '0')}`
  }
  return out
}

/**
 * Parse a full container source (`::: footprints …` … `:::`).
 */
export function parseFootprintsSource(source: string): FootprintsPayload {
  const normalized = source.replace(/\r\n?/g, '\n')
  const lines = normalized.split('\n')
  const open = lines[0]?.match(/^ {0,3}:{3,}\s*footprints(?:\s+(.*))?$/i)
  const times = parseFootprintsDatetime((open?.[1] ?? '').trim())

  let end = lines.length - 1
  while (end > 0 && !/^ {0,3}:{3,}\s*$/.test(lines[end])) end -= 1
  const bodyLines = lines.slice(1, end)

  const paragraphs: string[] = []
  const images: string[] = []
  let otherInfo = ''
  let buf: string[] = []
  let inOther = false

  const flush = () => {
    const text = buf.join('\n').trim()
    buf = []
    if (!text) return
    if (inOther) {
      otherInfo = otherInfo ? `${otherInfo}\n${text}` : text
      return
    }
    const imgOnly = text.match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/)
    if (imgOnly) {
      images.push(imgOnly[2])
      return
    }
    // Multiple images on separate lines in one block
    const parts = text.split('\n')
    let allImg = true
    const blockImgs: string[] = []
    for (const line of parts) {
      const m = line.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)$/)
      if (m) blockImgs.push(m[2])
      else if (line.trim()) {
        allImg = false
        break
      }
    }
    if (allImg && blockImgs.length) {
      images.push(...blockImgs)
      return
    }
    paragraphs.push(text)
  }

  for (const line of bodyLines) {
    if (line.trim() === '---') {
      flush()
      inOther = true
      continue
    }
    if (line.trim() === '') {
      flush()
      continue
    }
    buf.push(line)
  }
  flush()

  return { times, paragraphs, images, otherInfo }
}

/** Rebuild canonical `::: footprints` source from structured fields. */
export function rebuildFootprintsSource(payload: FootprintsPayload): string {
  const meta = formatDatetime(payload.times)
  const open = meta ? `::: footprints ${meta}` : '::: footprints'
  const chunks: string[] = [open, '']
  for (const p of payload.paragraphs) {
    chunks.push(p, '')
  }
  for (const src of payload.images) {
    chunks.push(`![](${src})`, '')
  }
  if (payload.otherInfo.trim()) {
    chunks.push('---', '', payload.otherInfo.trim(), '')
  }
  chunks.push(':::')
  return `${chunks.join('\n')}\n`
}
