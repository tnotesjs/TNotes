/**
 * Parse HTML `srcset` candidates. Each URL is a separate rewrite span; descriptors
 * (`1x`, `400w`) stay outside the dest.
 */

export interface SrcsetCandidate {
  url: string
  start: number
  end: number
  unknown: boolean
}

const DESCRIPTOR = /^\d+(?:\.\d+)?[wx]$/i

function looksUnknown(url: string): boolean {
  return /\$\{/.test(url) || url.includes('`') || /^\s*\{/.test(url) || url.includes('{{')
}

export function parseSrcsetCandidates(value: string): SrcsetCandidate[] {
  const out: SrcsetCandidate[] = []
  let i = 0
  while (i < value.length) {
    while (i < value.length && (value[i] === ',' || value[i] === ' ' || value[i] === '\t' || value[i] === '\n')) {
      i += 1
    }
    if (i >= value.length) break
    const candStart = i
    while (i < value.length && value[i] !== ',') i += 1
    const raw = value.slice(candStart, i)
    const lead = (raw.match(/^\s*/) ?? [''])[0].length
    const trimmed = raw.trim()
    if (!trimmed) continue
    const tokens = trimmed.split(/\s+/)
    let url = trimmed
    if (tokens.length >= 2 && DESCRIPTOR.test(tokens[tokens.length - 1] ?? '')) {
      url = tokens.slice(0, -1).join(' ')
    }
    const urlStart = candStart + lead
    out.push({
      url,
      start: urlStart,
      end: urlStart + url.length,
      unknown: looksUnknown(url) || url.length === 0
    })
  }
  return out
}
