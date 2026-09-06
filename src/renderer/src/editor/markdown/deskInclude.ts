import { applyFenceHighlights, encodeHighlightsAttr, parseHighlightRanges } from './lineHighlight'
import { parseFenceTitleFromMeta } from './fenceInfo'

/** One tab in a code-group body: an inline fence. */
export interface CodeGroupEntry {
  kind: 'fence'
  filename: string
  lang: string
  info: string
  code: string
  /** Encoded `{1-3,7}` or empty. */
  highlights: string
}

/**
 * Order-preserving parse of a code-group body.
 * Blank / non-entry lines between entries are dropped on serialize.
 */
export function parseCodeGroupEntries(body: string): CodeGroupEntry[] {
  const lines = body.replace(/\r\n?/g, '\n').split('\n')
  const entries: CodeGroupEntry[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i] ?? ''
    const fenceOpen = line.match(/^ {0,3}(`{3,}|~{3,})([^\n]*)$/)
    if (fenceOpen) {
      const marker = fenceOpen[1]
      const info = (fenceOpen[2] ?? '').trim()
      const lang = info.match(/^\S+/)?.[0] ?? ''
      const meta = info.slice(lang.length).trim()
      const filename = parseFenceTitleFromMeta(meta)
      const highlights = encodeHighlightsAttr(parseHighlightRanges(meta))
      i += 1
      const contentLines: string[] = []
      while (i < lines.length) {
        const cur = lines[i] ?? ''
        if (
          new RegExp(`^ {0,3}${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[ \\t]*$`).test(cur)
        ) {
          i += 1
          break
        }
        contentLines.push(cur)
        i += 1
      }
      entries.push({
        kind: 'fence',
        filename,
        lang,
        info,
        code: contentLines.join('\n').replace(/\n$/, ''),
        highlights
      })
      continue
    }
    i += 1
  }
  return entries
}

export function codeGroupEntryTabTitle(entry: CodeGroupEntry, index: number): string {
  return entry.filename || `代码 ${index + 1}`
}

export function nextCodeGroupTabTitle(entries: readonly CodeGroupEntry[]): string {
  const used = new Set(entries.map((entry) => entry.filename.trim()).filter(Boolean))
  let next = entries.length + 1
  while (used.has(String(next))) next += 1
  return String(next)
}

export function createEmptyCodeGroupEntry(entries: readonly CodeGroupEntry[]): CodeGroupEntry {
  const lang = entries.at(-1)?.lang.trim() || 'js'
  const filename = nextCodeGroupTabTitle(entries)
  return {
    kind: 'fence',
    filename,
    lang,
    info: `${lang} [${filename}]`,
    code: '',
    highlights: ''
  }
}

export function withCodeGroupEntryTitle(entry: CodeGroupEntry, title: string): CodeGroupEntry {
  const trimmed = title.trim()
  const lang = entry.lang || 'text'
  const highlights = parseHighlightRanges(entry.highlights || entry.info)
  const withHighlights = applyFenceHighlights(lang, highlights)
  const info = trimmed ? `${withHighlights} [${trimmed}]` : withHighlights
  return { ...entry, filename: trimmed, info, highlights: encodeHighlightsAttr(highlights) }
}

export function withCodeGroupEntryLanguage(
  entry: CodeGroupEntry,
  language: string
): CodeGroupEntry {
  const lang = language.trim() || 'text'
  const title = entry.filename
  const highlights = parseHighlightRanges(entry.highlights || entry.info)
  const withHighlights = applyFenceHighlights(lang, highlights)
  const info = title ? `${withHighlights} [${title}]` : withHighlights
  return { ...entry, lang, info, highlights: encodeHighlightsAttr(highlights) }
}

export function withCodeGroupEntryHighlights(
  entry: CodeGroupEntry,
  highlightsEncoded: string
): CodeGroupEntry {
  const highlights = parseHighlightRanges(highlightsEncoded)
  const lang = entry.lang || 'text'
  const title = entry.filename
  const base = applyFenceHighlights(lang, highlights)
  const info = title ? `${base} [${title}]` : base
  return { ...entry, info, highlights: encodeHighlightsAttr(highlights) }
}

/** Serialize entries back to a code-group body (used when an inline fence is saved). */
export function serializeCodeGroupEntries(entries: CodeGroupEntry[]): string {
  const chunks: string[] = []
  for (const entry of entries) {
    const info = entry.info || entry.lang || ''
    const open = info ? `\`\`\`${info}` : '```'
    const code = entry.code.replace(/\n$/, '')
    chunks.push(open)
    if (code.length > 0) chunks.push(code)
    chunks.push('```')
    chunks.push('')
  }
  return chunks.join('\n').replace(/\n+$/, '\n')
}
