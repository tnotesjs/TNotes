/**
 * Extract asset URLs from Markdown, HTML attributes, mindmap fences, and
 * conservative hints inside comments / ordinary fences / inline code.
 */

import { extractCssReferences } from './css'
import { ASSET_HINT_REGEX, classifyAssetUrl, offsetToLineColumn, resolveLocalKbPath } from './paths'
import { collectSkipRegions, covered, type SourceRegion } from './regions'
import { extractScriptBlocks } from './specifiers'
import { parseSrcsetCandidates } from './srcset'

import type { AssetReference, AssetSyntaxKind } from './types'

export interface ExtractContext {
  sourceRelPath: string
  noteUuid?: string
  noteTitle?: string
  /** Treat `../assets/` aliases as in notes. */
  noteLike?: boolean
}

export interface ExtractResult {
  references: AssetReference[]
  componentTags: string[]
  follows: string[]
  sawDynamicBinding: boolean
  sawUnknownSrcset: boolean
  sawUnknownCss: boolean
  sawUnknownExcalidraw: boolean
  parseError?: string
}

const ASSET_BIND_NAMES = new Set([
  'src',
  'href',
  'poster',
  'srcset',
  'data-src',
  'data-href',
  'data-poster',
  'data-srcset'
])

function emptyFlags(references: AssetReference[]): ExtractResult {
  return {
    references,
    componentTags: [],
    follows: [],
    sawDynamicBinding: false,
    sawUnknownSrcset: false,
    sawUnknownCss: false,
    sawUnknownExcalidraw: false
  }
}

export function pushRef(
  out: AssetReference[],
  ctx: ExtractContext,
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

function parseDestination(
  source: string,
  openParen: number
): { destStart: number; destEnd: number; close: number } | null {
  let i = openParen + 1
  while (source[i] === ' ' || source[i] === '\t' || source[i] === '\n' || source[i] === '\r') i += 1
  if (i >= source.length) return null
  if (source[i] === '<') {
    const destStart = i + 1
    const gt = source.indexOf('>', destStart)
    if (gt < 0) return null
    let close = gt + 1
    while (source[close] === ' ' || source[close] === '\t') close += 1
    if (source[close] === '"' || source[close] === "'") {
      const q = source[close]
      const endQ = source.indexOf(q, close + 1)
      if (endQ < 0) return null
      close = endQ + 1
      while (source[close] === ' ' || source[close] === '\t') close += 1
    }
    if (source[close] !== ')') return null
    return { destStart, destEnd: gt, close }
  }
  const destStart = i
  let depth = 1
  while (i < source.length) {
    const ch = source[i]
    if (ch === '\\') {
      i += 2
      continue
    }
    if (ch === '(') depth += 1
    else if (ch === ')') {
      depth -= 1
      if (depth === 0) break
    } else if (ch === '\n') return null
    else if ((ch === ' ' || ch === '\t') && depth === 1) break
    i += 1
  }
  const destEnd = i
  while (source[i] === ' ' || source[i] === '\t') i += 1
  if (source[i] === '"' || source[i] === "'") {
    const q = source[i]
    const endQ = source.indexOf(q, i + 1)
    if (endQ < 0) return null
    i = endQ + 1
    while (source[i] === ' ' || source[i] === '\t') i += 1
  }
  if (source[i] !== ')') return null
  return { destStart, destEnd, close: i }
}

function extractMarkdownLinks(
  source: string,
  ctx: ExtractContext,
  skip: SourceRegion[],
  syntaxImage: AssetSyntaxKind,
  syntaxLink: AssetSyntaxKind,
  out: AssetReference[]
): void {
  for (let i = 0; i < source.length; i++) {
    if (covered(skip, i)) continue
    if (source[i] !== '[') continue
    const image = i > 0 && source[i - 1] === '!'
    const closeAlt = findMatchingBracket(source, i)
    if (closeAlt < 0) continue
    if (source[closeAlt + 1] !== '(') continue
    const dest = parseDestination(source, closeAlt + 1)
    if (!dest) continue
    const rawUrl = source.slice(dest.destStart, dest.destEnd)
    pushRef(
      out,
      ctx,
      source,
      dest.destStart,
      dest.destEnd,
      rawUrl,
      image ? syntaxImage : syntaxLink,
      true
    )
    i = dest.close
  }
}

function findMatchingBracket(source: string, open: number): number {
  let depth = 0
  for (let i = open; i < source.length; i++) {
    if (source[i] === '\\') {
      i += 1
      continue
    }
    if (source[i] === '[') depth += 1
    else if (source[i] === ']') {
      depth -= 1
      if (depth === 0) return i
    } else if (source[i] === '\n' && depth === 1) return -1
  }
  return -1
}

function extractDefinitions(
  source: string,
  ctx: ExtractContext,
  skip: SourceRegion[],
  out: AssetReference[]
): void {
  const def = /^( {0,3})\[([^\]]+)\]:\s*(\S+)/gm
  let match: RegExpExecArray | null
  while ((match = def.exec(source))) {
    const destStart = match.index + match[0].length - match[3].length
    if (covered(skip, destStart)) continue
    const raw = match[3]
    const destEnd = destStart + raw.length
    if (raw.startsWith('<') && raw.endsWith('>')) {
      pushRef(
        out,
        ctx,
        source,
        destStart + 1,
        destEnd - 1,
        raw.slice(1, -1),
        'markdown-definition',
        true
      )
      continue
    }
    pushRef(out, ctx, source, destStart, destEnd, raw, 'markdown-definition', true)
  }
}

const ATTR_RE = /\b(src|href|srcset|poster|style)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi
const NAMED_BINDING_RE = /(?:^|\s)(?::|v-bind:)([A-Za-z_:][\w:.-]*)\s*=/g
const OBJECT_BIND_RE = /(?:^|\s)v-bind\s*=/g
const COMPONENT_RE = /<([A-Z][\w.-]*)(?=[\s/>])/g

function extractHtml(
  source: string,
  ctx: ExtractContext,
  skip: SourceRegion[],
  flags: ExtractResult
): void {
  const out = flags.references
  COMPONENT_RE.lastIndex = 0
  let component: RegExpExecArray | null
  while ((component = COMPONENT_RE.exec(source))) {
    if (covered(skip, component.index)) continue
    flags.componentTags.push(component[1])
  }

  NAMED_BINDING_RE.lastIndex = 0
  let binding: RegExpExecArray | null
  while ((binding = NAMED_BINDING_RE.exec(source))) {
    if (covered(skip, binding.index)) continue
    const name = (binding[1] ?? '').toLowerCase()
    if (ASSET_BIND_NAMES.has(name)) flags.sawDynamicBinding = true
  }

  OBJECT_BIND_RE.lastIndex = 0
  let objectBind: RegExpExecArray | null
  while ((objectBind = OBJECT_BIND_RE.exec(source))) {
    if (covered(skip, objectBind.index)) continue
    flags.sawDynamicBinding = true
  }

  ATTR_RE.lastIndex = 0
  let attr: RegExpExecArray | null
  while ((attr = ATTR_RE.exec(source))) {
    const name = attr[1].toLowerCase()
    const value = attr[2] ?? attr[3] ?? attr[4] ?? ''
    const valueOffset =
      attr.index +
      attr[0].length -
      (attr[2] != null ? attr[2].length + 1 : attr[3] != null ? attr[3].length + 1 : value.length)
    if (covered(skip, attr.index)) continue

    if (name === 'srcset') {
      const candidates = parseSrcsetCandidates(value)
      if (candidates.length === 0) flags.sawUnknownSrcset = true
      for (const candidate of candidates) {
        if (candidate.unknown) {
          flags.sawUnknownSrcset = true
          pushRef(
            out,
            ctx,
            source,
            valueOffset + candidate.start,
            valueOffset + candidate.end,
            candidate.url,
            'unsupported-srcset',
            false
          )
          continue
        }
        pushRef(
          out,
          ctx,
          source,
          valueOffset + candidate.start,
          valueOffset + candidate.end,
          candidate.url,
          'html-srcset',
          true
        )
      }
      continue
    }
    if (name === 'poster') {
      pushRef(out, ctx, source, valueOffset, valueOffset + value.length, value, 'html-poster', true)
      continue
    }
    if (name === 'style') {
      const before = out.length
      const css = extractCssReferences(value, ctx, out)
      for (let i = before; i < out.length; i++) {
        out[i].startOffset += valueOffset
        out[i].endOffset += valueOffset
        const loc = offsetToLineColumn(source, out[i].startOffset)
        out[i].line = loc.line
        out[i].column = loc.column
      }
      flags.follows.push(...css.follows)
      flags.sawUnknownCss = flags.sawUnknownCss || css.sawUnknown
      continue
    }
    const syntax: AssetSyntaxKind = name === 'href' ? 'html-href' : 'html-src'
    pushRef(out, ctx, source, valueOffset, valueOffset + value.length, value, syntax, true)
    const resolved = resolveLocalKbPath(value, ctx.sourceRelPath)
    if (resolved.kbRelPath && !resolved.classified.targetRelPath) {
      flags.follows.push(resolved.kbRelPath)
    }
  }
}

function extractHints(
  text: string,
  ctx: ExtractContext,
  source: string,
  baseOffset: number,
  syntax: AssetSyntaxKind,
  rewritable: boolean,
  out: AssetReference[]
): void {
  ASSET_HINT_REGEX.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = ASSET_HINT_REGEX.exec(text))) {
    const start = baseOffset + match.index
    pushRef(out, ctx, source, start, start + match[0].length, match[0], syntax, rewritable)
  }
}

function extractUncertain(
  source: string,
  ctx: ExtractContext,
  skip: SourceRegion[],
  out: AssetReference[]
): void {
  for (const region of skip) {
    if (region.kind === 'mindmap-fence') continue
    const syntax: AssetSyntaxKind =
      region.kind === 'html-comment'
        ? 'uncertain-comment'
        : region.kind === 'inline-code'
          ? 'uncertain-inline-code'
          : 'uncertain-fence'
    extractHints(
      source.slice(region.start, region.end),
      ctx,
      source,
      region.start,
      syntax,
      false,
      out
    )
  }
}

/** HTML / Vue template fragment (no Markdown skip regions). */
export function extractHtmlFragment(source: string, ctx: ExtractContext): ExtractResult {
  const flags = emptyFlags([])
  extractHtml(source, ctx, [], flags)
  flags.sawDynamicBinding =
    extractScriptBlocks(source, ctx, flags.references, flags.follows) || flags.sawDynamicBinding
  return flags
}

export function extractAssetReferences(source: string, ctx: ExtractContext): ExtractResult {
  const { skip, mindmaps } = collectSkipRegions(source)
  const flags = emptyFlags([])

  extractMarkdownLinks(source, ctx, skip, 'markdown-image', 'markdown-link', flags.references)
  extractDefinitions(source, ctx, skip, flags.references)
  extractHtml(source, ctx, skip, flags)
  extractUncertain(source, ctx, skip, flags.references)
  flags.sawDynamicBinding =
    extractScriptBlocks(source, ctx, flags.references, flags.follows) || flags.sawDynamicBinding

  for (const mindmap of mindmaps) {
    const body = source.slice(mindmap.contentStart, mindmap.contentEnd)
    const innerSkip = collectSkipRegions(body).skip
    const before = flags.references.length
    extractMarkdownLinks(body, ctx, innerSkip, 'mindmap-image', 'mindmap-link', flags.references)
    for (let i = before; i < flags.references.length; i++) {
      const ref = flags.references[i]
      ref.startOffset += mindmap.contentStart
      ref.endOffset += mindmap.contentStart
      const loc = offsetToLineColumn(source, ref.startOffset)
      ref.line = loc.line
      ref.column = loc.column
    }
  }

  return flags
}

/** Extract a config icon.src string as a live reference. */
export function extractConfigIcon(src: string, json: string): AssetReference | null {
  const needle = src
  const index = json.indexOf(src)
  if (index < 0) return null
  const ctx: ExtractContext = { sourceRelPath: 'tnotes.json', noteLike: true }
  const refs: AssetReference[] = []
  pushRef(refs, ctx, json, index, index + needle.length, src, 'config-icon', true)
  return refs[0] ?? null
}
