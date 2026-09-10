/**
 * CSS `url()` and `@import` extraction. Comments are skipped; expressions are
 * not evaluated. Standalone `.css` files and inline `style=""` share this.
 */

import { classifyAssetUrl, offsetToLineColumn, resolveLocalKbPath } from './paths'
import type { SpecifierContext } from './specifiers'

import type { AssetReference, AssetSyntaxKind } from './types'

export interface CssExtractFlags {
  sawCssUrl: boolean
  sawUnknown: boolean
  follows: string[]
}

function pushCssRef(
  out: AssetReference[],
  follows: string[],
  ctx: SpecifierContext,
  source: string,
  start: number,
  end: number,
  rawUrl: string,
  syntax: AssetSyntaxKind,
  rewritable: boolean
): void {
  const classified = classifyAssetUrl(rawUrl, ctx.sourceRelPath)
  const loc = offsetToLineColumn(source, start)
  const local = classified.urlKind === 'local-relative' || classified.urlKind === 'local-root'
  const resolved = resolveLocalKbPath(rawUrl, ctx.sourceRelPath)
  if (resolved.kbRelPath && !classified.targetRelPath) follows.push(resolved.kbRelPath)
  out.push({
    sourceRelPath: ctx.sourceRelPath,
    startOffset: start,
    endOffset: end,
    line: loc.line,
    column: loc.column,
    rawUrl,
    decodedPath: classified.decodedPath,
    targetRelPath: classified.targetRelPath,
    syntax,
    urlKind: classified.urlKind,
    urlSuffix: classified.urlSuffix,
    rewritable:
      rewritable &&
      local &&
      classified.urlKind === 'local-relative' &&
      Boolean(classified.targetRelPath) &&
      !classified.outOfBounds &&
      !classified.decodeFailed,
    noteUuid: ctx.noteUuid,
    noteTitle: ctx.noteTitle
  })
}

function isUnknownCssUrl(raw: string): boolean {
  const trimmed = raw.trim()
  return (
    trimmed.length === 0 ||
    /\$\{/.test(trimmed) ||
    /^var\(/i.test(trimmed) ||
    /^attr\(/i.test(trimmed) ||
    trimmed.includes('`')
  )
}

function collectCommentSpans(source: string): Array<{ start: number; end: number }> {
  const spans: Array<{ start: number; end: number }> = []
  let i = 0
  while (i < source.length) {
    if (source.startsWith('/*', i)) {
      const close = source.indexOf('*/', i + 2)
      const end = close < 0 ? source.length : close + 2
      spans.push({ start: i, end })
      i = end
      continue
    }
    i += 1
  }
  return spans
}

function covered(spans: Array<{ start: number; end: number }>, offset: number): boolean {
  return spans.some((span) => offset >= span.start && offset < span.end)
}

function extractQuoted(source: string, quoteIndex: number): { value: string; start: number; end: number } | null {
  const q = source[quoteIndex]
  if (q !== '"' && q !== "'") return null
  let i = quoteIndex + 1
  while (i < source.length) {
    if (source[i] === '\\') {
      i += 2
      continue
    }
    if (source[i] === q) return { value: source.slice(quoteIndex + 1, i), start: quoteIndex + 1, end: i }
    i += 1
  }
  return null
}

function extractUnquotedUrl(source: string, from: number): { value: string; start: number; end: number } | null {
  let i = from
  while (i < source.length && (source[i] === ' ' || source[i] === '\t' || source[i] === '\n')) i += 1
  const start = i
  while (i < source.length && source[i] !== ')' && source[i] !== ' ' && source[i] !== '\t' && source[i] !== '\n') {
    i += 1
  }
  if (i === start) return null
  return { value: source.slice(start, i), start, end: i }
}

export function extractCssReferences(
  source: string,
  ctx: SpecifierContext,
  out: AssetReference[],
  skip: Array<{ start: number; end: number }> = []
): CssExtractFlags {
  const comments = collectCommentSpans(source)
  const blocked = [...skip, ...comments]
  const flags: CssExtractFlags = { sawCssUrl: false, sawUnknown: false, follows: [] }

  for (let i = 0; i < source.length; i++) {
    if (covered(blocked, i)) continue

    if (source.startsWith('url(', i)) {
      flags.sawCssUrl = true
      const innerStart = i + 4
      let j = innerStart
      while (j < source.length && (source[j] === ' ' || source[j] === '\t')) j += 1
      const quoted = extractQuoted(source, j)
      const unquoted = quoted ? null : extractUnquotedUrl(source, j)
      const parsed = quoted ?? unquoted
      if (!parsed) {
        flags.sawUnknown = true
        i = innerStart
        continue
      }
      if (isUnknownCssUrl(parsed.value) || parsed.value.startsWith('#')) {
        if (!parsed.value.startsWith('#')) flags.sawUnknown = true
        i = parsed.end
        continue
      }
      pushCssRef(
        out,
        flags.follows,
        ctx,
        source,
        parsed.start,
        parsed.end,
        parsed.value,
        'css-url',
        true
      )
      i = parsed.end
      continue
    }

    if (source.startsWith('@import', i) && (i === 0 || /\s/.test(source[i - 1] ?? '\n'))) {
      flags.sawCssUrl = true
      let j = i + '@import'.length
      while (j < source.length && (source[j] === ' ' || source[j] === '\t')) j += 1
      if (source.startsWith('url(', j)) {
        i = j - 1
        continue
      }
      const quoted = extractQuoted(source, j)
      if (!quoted) {
        flags.sawUnknown = true
        continue
      }
      if (isUnknownCssUrl(quoted.value)) {
        flags.sawUnknown = true
        i = quoted.end
        continue
      }
      pushCssRef(
        out,
        flags.follows,
        ctx,
        source,
        quoted.start,
        quoted.end,
        quoted.value,
        'css-import',
        true
      )
      i = quoted.end
    }
  }

  for (const span of comments) {
    let i = span.start
    while (i < span.end) {
      if (!source.startsWith('url(', i)) {
        i += 1
        continue
      }
      const innerStart = i + 4
      let j = innerStart
      while (j < span.end && (source[j] === ' ' || source[j] === '\t')) j += 1
      const quoted = extractQuoted(source, j)
      const unquoted = quoted ? null : extractUnquotedUrl(source, j)
      const parsed = quoted ?? unquoted
      if (!parsed || parsed.start >= span.end) {
        i = innerStart
        continue
      }
      pushCssRef(
        out,
        flags.follows,
        ctx,
        source,
        parsed.start,
        parsed.end,
        parsed.value,
        'uncertain-comment',
        false
      )
      i = parsed.end
    }
  }

  return flags
}
