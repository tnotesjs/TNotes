/**
 * Static `import` / `require` specifiers. Dynamic `import(expr)` is flagged, not executed.
 */

import path from 'node:path'

import { classifyAssetUrl, offsetToLineColumn, resolveLocalKbPath } from './paths'

import type { AssetReference } from './types'

export interface SpecifierContext {
  sourceRelPath: string
  noteUuid?: string
  noteTitle?: string
}

const STATIC_IMPORT_RE =
  /\b(?:import|export)\s+(?:type\s+)?(?:[\w${}*\s,]+from\s*)?(['"])([^'"]+)\1/g
const DYNAMIC_IMPORT_RE = /\bimport\s*\(\s*(['"])([^'"]+)\1\s*\)/g
const BARE_DYNAMIC_IMPORT_RE = /\bimport\s*\(\s*([^)]+)\)/g
const REQUIRE_RE = /\brequire\s*\(\s*(['"])([^'"]+)\1\s*\)/g

export const FOLLOW_SOURCE_EXT = new Set(['.vue', '.css', '.html', '.htm', '.excalidraw'])

function pushImportRef(
  out: AssetReference[],
  follows: string[],
  ctx: SpecifierContext,
  source: string,
  start: number,
  end: number,
  rawUrl: string
): void {
  const classified = classifyAssetUrl(rawUrl, ctx.sourceRelPath)
  const resolved = resolveLocalKbPath(rawUrl, ctx.sourceRelPath)
  if (resolved.kbRelPath) {
    const ext = path.posix.extname(resolved.kbRelPath).toLowerCase()
    if (FOLLOW_SOURCE_EXT.has(ext)) follows.push(resolved.kbRelPath)
  }
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
    syntax: 'vue-import',
    urlKind: classified.urlKind,
    urlSuffix: classified.urlSuffix,
    rewritable:
      local &&
      classified.urlKind === 'local-relative' &&
      Boolean(classified.targetRelPath) &&
      !classified.outOfBounds &&
      !classified.decodeFailed,
    noteUuid: ctx.noteUuid,
    noteTitle: ctx.noteTitle
  })
}

function addMatches(
  regex: RegExp,
  source: string,
  ctx: SpecifierContext,
  out: AssetReference[],
  follows: string[],
  baseOffset: number,
  wholeFile: string
): void {
  regex.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(source))) {
    const spec = match[2]
    const specStart = baseOffset + match.index + match[0].lastIndexOf(spec)
    pushImportRef(out, follows, ctx, wholeFile, specStart, specStart + spec.length, spec)
  }
}

export function extractScriptSpecifiers(
  source: string,
  ctx: SpecifierContext,
  out: AssetReference[],
  follows: string[],
  baseOffset: number,
  wholeFile: string
): boolean {
  let sawDynamic = false
  addMatches(STATIC_IMPORT_RE, source, ctx, out, follows, baseOffset, wholeFile)
  addMatches(DYNAMIC_IMPORT_RE, source, ctx, out, follows, baseOffset, wholeFile)
  addMatches(REQUIRE_RE, source, ctx, out, follows, baseOffset, wholeFile)
  BARE_DYNAMIC_IMPORT_RE.lastIndex = 0
  let bare: RegExpExecArray | null
  while ((bare = BARE_DYNAMIC_IMPORT_RE.exec(source))) {
    const inner = (bare[1] ?? '').trim()
    if (!(inner.startsWith('"') || inner.startsWith("'") || inner.startsWith('`'))) {
      sawDynamic = true
    } else if (inner.startsWith('`') && inner.includes('${')) {
      sawDynamic = true
    }
  }
  return sawDynamic
}

const SCRIPT_BLOCK_RE = /<script\b[^>]*>([\s\S]*?)<\/script>/gi

export function extractScriptBlocks(
  source: string,
  ctx: SpecifierContext,
  out: AssetReference[],
  follows: string[]
): boolean {
  let sawDynamic = false
  SCRIPT_BLOCK_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = SCRIPT_BLOCK_RE.exec(source))) {
    const inner = match[1] ?? ''
    const contentStart = match.index + match[0].length - inner.length - '</script>'.length
    sawDynamic =
      extractScriptSpecifiers(inner, ctx, out, follows, contentStart, source) || sawDynamic
  }
  return sawDynamic
}
