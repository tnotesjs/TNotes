/**
 * Locate fenced code, HTML comments, and inline code so Markdown extraction
 * does not treat example paths as live references — except mindmap fences,
 * which are first-class image sources.
 */

export type SourceRegionKind = 'fence' | 'mindmap-fence' | 'html-comment' | 'inline-code'

export interface SourceRegion {
  kind: SourceRegionKind
  start: number
  end: number
  info?: string
  contentStart: number
  contentEnd: number
}

function isMindmapFenceInfo(info: string): boolean {
  const fenceBody = info.trim()
  if (!/^mindmap(?=\s|\[|$)/.test(fenceBody)) return false
  let rest = fenceBody.slice('mindmap'.length).trim()
  const titleMatch = rest.match(/\[([^\]]+)\]/)
  if (titleMatch) {
    rest =
      `${rest.slice(0, titleMatch.index)} ${rest.slice((titleMatch.index ?? 0) + titleMatch[0].length)}`.trim()
  }
  return !rest || /^\d+$/.test(rest)
}

interface LineSpan {
  start: number
  end: number
  text: string
}

function lineSpans(source: string): LineSpan[] {
  const lines: LineSpan[] = []
  let start = 0
  for (let i = 0; i <= source.length; i++) {
    if (i === source.length || source[i] === '\n') {
      const end = i === source.length ? i : i + 1
      lines.push({ start, end, text: source.slice(start, i) })
      start = end
    }
  }
  return lines
}

function openFence(line: string): { char: string; len: number; info: string } | null {
  const match = /^( {0,3})(`{3,}|~{3,})(.*)$/.exec(line)
  if (!match) return null
  return { char: match[2][0], len: match[2].length, info: match[3].trim() }
}

function closeFence(line: string, char: string, len: number): boolean {
  const match = /^( {0,3})(`{3,}|~{3,})\s*$/.exec(line)
  if (!match) return false
  return match[2][0] === char && match[2].length >= len
}

export function findFences(source: string): SourceRegion[] {
  const lines = lineSpans(source)
  const regions: SourceRegion[] = []
  for (let i = 0; i < lines.length;) {
    const opened = openFence(lines[i].text.replace(/\r$/, ''))
    if (!opened) {
      i += 1
      continue
    }
    let close = i + 1
    while (
      close < lines.length &&
      !closeFence(lines[close].text.replace(/\r$/, ''), opened.char, opened.len)
    ) {
      close += 1
    }
    const contentStart = lines[i].end
    const contentEnd = close < lines.length ? lines[close].start : source.length
    const end = close < lines.length ? lines[close].end : source.length
    regions.push({
      kind: isMindmapFenceInfo(opened.info) ? 'mindmap-fence' : 'fence',
      start: lines[i].start,
      end,
      info: opened.info,
      contentStart,
      contentEnd
    })
    i = close < lines.length ? close + 1 : lines.length
  }
  return regions
}

export function findHtmlComments(source: string, skip: SourceRegion[]): SourceRegion[] {
  const regions: SourceRegion[] = []
  let i = 0
  while (i < source.length) {
    if (covered(skip, i)) {
      i += 1
      continue
    }
    if (source.startsWith('<!--', i)) {
      const close = source.indexOf('-->', i + 4)
      const end = close < 0 ? source.length : close + 3
      regions.push({
        kind: 'html-comment',
        start: i,
        end,
        contentStart: i + 4,
        contentEnd: close < 0 ? source.length : close
      })
      i = end
      continue
    }
    i += 1
  }
  return regions
}

export function findInlineCode(source: string, skip: SourceRegion[]): SourceRegion[] {
  const regions: SourceRegion[] = []
  let i = 0
  while (i < source.length) {
    if (covered(skip, i) || source[i] !== '`') {
      i += 1
      continue
    }
    let ticks = 1
    while (source[i + ticks] === '`') ticks += 1
    const close = findClosingTicks(source, i + ticks, ticks, skip)
    const end = close < 0 ? i + ticks : close + ticks
    regions.push({
      kind: 'inline-code',
      start: i,
      end: close < 0 ? i + ticks : end,
      contentStart: i + ticks,
      contentEnd: close < 0 ? i + ticks : close
    })
    i = close < 0 ? i + ticks : end
  }
  return regions
}

function findClosingTicks(
  source: string,
  from: number,
  ticks: number,
  skip: SourceRegion[]
): number {
  for (let i = from; i < source.length; i++) {
    if (covered(skip, i)) continue
    if (source[i] !== '`') continue
    let count = 1
    while (source[i + count] === '`') count += 1
    if (count === ticks) return i
    i += count - 1
  }
  return -1
}

export function covered(regions: readonly SourceRegion[], offset: number): boolean {
  return regions.some((region) => offset >= region.start && offset < region.end)
}

export function collectSkipRegions(source: string): {
  fences: SourceRegion[]
  skip: SourceRegion[]
  mindmaps: SourceRegion[]
} {
  const fences = findFences(source)
  const comments = findHtmlComments(source, fences)
  const inline = findInlineCode(source, [...fences, ...comments])
  const skip = [...fences, ...comments, ...inline]
  return {
    fences,
    skip,
    mindmaps: fences.filter((region) => region.kind === 'mindmap-fence')
  }
}
