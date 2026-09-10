/**
 * Excalidraw JSON: walk string values that look like local paths.
 * Embedded data URLs are not local files. Expressions cannot appear in JSON
 * and are never evaluated.
 */

import { classifyAssetUrl, offsetToLineColumn } from './paths'

import type { AssetReference } from './types'
import type { ExtractContext, ExtractResult } from './extract'

function looksLikeLocalPath(value: string): boolean {
  if (value.length < 2 || value.length > 4096) return false
  if (/[\n\r]/.test(value)) return false
  if (/^data:/i.test(value)) return false
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^file:/i.test(value)) return false
  if (/^[a-z0-9][a-z0-9.+-]*\/[a-z0-9.+-]+$/i.test(value)) return false
  if (value.startsWith('#') || value.startsWith('{')) return false
  if (/^\.\.?(?:\/|$)/.test(value) || /^assets\//i.test(value) || /^file:/i.test(value)) return true
  return /(?:^|\/)[^/\n]+\.(?:png|jpe?g|gif|svg|webp|avif|bmp|ico|excalidraw|html?|css)$/i.test(value)
}

function collectStrings(value: unknown, out: string[]): void {
  if (typeof value === 'string') {
    out.push(value)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out)
    return
  }
  if (value && typeof value === 'object') {
    for (const nested of Object.values(value as Record<string, unknown>)) {
      collectStrings(nested, out)
    }
  }
}

function findJsonStringSpans(source: string, value: string): Array<{ start: number; end: number; encoded: string }> {
  const quoted = JSON.stringify(value)
  const encoded = quoted.slice(1, -1)
  const needle = `"${encoded}"`
  const spans: Array<{ start: number; end: number; encoded: string }> = []
  let from = 0
  while (from < source.length) {
    const index = source.indexOf(needle, from)
    if (index < 0) break
    spans.push({ start: index + 1, end: index + 1 + encoded.length, encoded })
    from = index + needle.length
  }
  return spans
}

export function extractExcalidraw(source: string, ctx: ExtractContext): ExtractResult {
  const references: AssetReference[] = []
  const flags: ExtractResult = {
    references,
    componentTags: [],
    follows: [],
    sawDynamicBinding: false,
    sawUnknownSrcset: false,
    sawUnknownCss: false,
    sawUnknownExcalidraw: false
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(source)
  } catch {
    flags.parseError = 'Excalidraw 不是合法 JSON'
    return flags
  }

  const strings: string[] = []
  collectStrings(parsed, strings)
  const seen = new Set<string>()
  for (const value of strings) {
    if (seen.has(value)) continue
    seen.add(value)
    if (/^data:/i.test(value)) continue
    if (!looksLikeLocalPath(value)) continue
    const spans = findJsonStringSpans(source, value)
    if (spans.length === 0) {
      flags.sawUnknownExcalidraw = true
      continue
    }
    const classified = classifyAssetUrl(value, ctx.sourceRelPath)
    for (const span of spans) {
      const loc = offsetToLineColumn(source, span.start)
      const local = classified.urlKind === 'local-relative' || classified.urlKind === 'local-root'
      references.push({
        sourceRelPath: ctx.sourceRelPath,
        startOffset: span.start,
        endOffset: span.end,
        line: loc.line,
        column: loc.column,
        rawUrl: span.encoded,
        decodedPath: classified.decodedPath,
        targetRelPath: classified.targetRelPath,
        syntax: classified.urlKind === 'other' && !classified.targetRelPath ? 'unsupported-excalidraw' : 'excalidraw-path',
        urlKind: classified.urlKind,
        urlSuffix: classified.urlSuffix,
        rewritable:
          local &&
          classified.urlKind === 'local-relative' &&
          Boolean(classified.targetRelPath) &&
          !classified.outOfBounds &&
          !classified.decodeFailed &&
          span.encoded === value,
        noteUuid: ctx.noteUuid,
        noteTitle: ctx.noteTitle
      })
    }
  }

  return flags
}
