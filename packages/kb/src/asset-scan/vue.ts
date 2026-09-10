/**
 * Vue SFC static extraction. Parse success does not mean coverage is complete:
 * dynamic bindings (`:src`, `v-bind:src`, `v-bind="obj"`) stay unknown.
 */

import { extractCssReferences } from './css'
import { extractHtmlFragment, type ExtractContext, type ExtractResult } from './extract'
import { offsetToLineColumn } from './paths'
import { extractScriptSpecifiers } from './specifiers'

import type { AssetReference } from './types'

const BLOCK_RE = /<(template|script|style)(\s[^>]*)?>([\s\S]*?)<\/\1\s*>/gi

interface SfcBlock {
  type: 'template' | 'script' | 'style'
  contentStart: number
  contentEnd: number
  content: string
}

export function parseVueSfcBlocks(source: string): { blocks: SfcBlock[]; parseError?: string } {
  const blocks: SfcBlock[] = []
  BLOCK_RE.lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = BLOCK_RE.exec(source))) {
    const type = match[1] as SfcBlock['type']
    const inner = match[3] ?? ''
    const open = match[0].slice(0, match[0].length - inner.length - `</${type}>`.length)
    const contentStart = match.index + open.length
    blocks.push({
      type,
      contentStart,
      contentEnd: contentStart + inner.length,
      content: inner
    })
  }
  if (source.includes('<template') && !blocks.some((block) => block.type === 'template')) {
    return { blocks, parseError: 'Vue SFC template 无法闭合解析' }
  }
  if (source.includes('<script') && !blocks.some((block) => block.type === 'script')) {
    return { blocks, parseError: 'Vue SFC script 无法闭合解析' }
  }
  return { blocks }
}

function remapRefs(refs: AssetReference[], delta: number, source: string): void {
  for (const ref of refs) {
    ref.startOffset += delta
    ref.endOffset += delta
    const loc = offsetToLineColumn(source, ref.startOffset)
    ref.line = loc.line
    ref.column = loc.column
  }
}

function retargetSyntax(refs: AssetReference[]): void {
  for (const ref of refs) {
    if (ref.syntax === 'html-src') ref.syntax = 'vue-src'
    if (ref.syntax === 'html-href') ref.syntax = 'vue-href'
  }
}

function emptyFlags(): ExtractResult {
  return {
    references: [],
    componentTags: [],
    follows: [],
    sawDynamicBinding: false,
    sawUnknownSrcset: false,
    sawUnknownCss: false,
    sawUnknownExcalidraw: false
  }
}

export function extractVueSfc(source: string, ctx: ExtractContext): ExtractResult {
  const { blocks, parseError } = parseVueSfcBlocks(source)
  const flags = emptyFlags()
  flags.parseError = parseError

  if (blocks.length === 0) {
    const fallback = extractHtmlFragment(source, ctx)
    fallback.parseError = parseError
    return fallback
  }

  for (const block of blocks) {
    if (block.type === 'template') {
      const inner = extractHtmlFragment(block.content, ctx)
      remapRefs(inner.references, block.contentStart, source)
      retargetSyntax(inner.references)
      flags.references.push(...inner.references)
      flags.componentTags.push(...inner.componentTags)
      flags.follows.push(...inner.follows)
      flags.sawDynamicBinding = flags.sawDynamicBinding || inner.sawDynamicBinding
      flags.sawUnknownSrcset = flags.sawUnknownSrcset || inner.sawUnknownSrcset
      flags.sawUnknownCss = flags.sawUnknownCss || inner.sawUnknownCss
      continue
    }
    if (block.type === 'script') {
      const dyn = extractScriptSpecifiers(
        block.content,
        ctx,
        flags.references,
        flags.follows,
        block.contentStart,
        source
      )
      flags.sawDynamicBinding = flags.sawDynamicBinding || dyn
      continue
    }
    const before = flags.references.length
    const css = extractCssReferences(block.content, ctx, flags.references)
    remapRefs(flags.references.slice(before), block.contentStart, source)
    flags.follows.push(...css.follows)
    flags.sawUnknownCss = flags.sawUnknownCss || css.sawUnknown
  }

  return flags
}
