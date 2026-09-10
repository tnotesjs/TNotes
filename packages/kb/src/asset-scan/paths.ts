/**
 * Path / URL classification for asset references.
 *
 * Notes and mindmap fences treat `../assets/`, `./assets/` and `assets/` as
 * knowledge-base aliases. `/assets/` is recognised but marked non-rewritable
 * because Desk `resolveNoteAsset` and SSG `rewriteAssetSrc` do not accept it.
 */

import path from 'node:path'

import { ASSETS_DIR, NOTES_DIR } from '../constants'

const PROTOCOL = /^[a-z][a-z0-9+.-]*:/i
const ASSET_ALIAS = /^(?:\.\.\/|\.\/)?assets\/(.*)$/i
const ROOT_SLASH_ASSET = /^\/assets\/(.*)$/i

export interface ClassifiedAssetUrl {
  urlKind: 'local-relative' | 'local-root' | 'remote' | 'data' | 'other'
  rawUrl: string
  decodedPath: string
  urlSuffix: string
  targetRelPath: string | null
  outOfBounds: boolean
  decodeFailed: boolean
}

export function splitUrlSuffix(raw: string): { pathPart: string; suffix: string } {
  const queryAt = raw.search(/[?#]/)
  if (queryAt < 0) return { pathPart: raw, suffix: '' }
  return { pathPart: raw.slice(0, queryAt), suffix: raw.slice(queryAt) }
}

export function decodeOnce(value: string): { decoded: string; failed: boolean } {
  try {
    if (!/%[0-9A-Fa-f]{2}/.test(value)) return { decoded: value, failed: false }
    return { decoded: decodeURIComponent(value), failed: false }
  } catch {
    return { decoded: value, failed: true }
  }
}

function posixNormalize(value: string): string {
  return path.posix.normalize(value.replaceAll('\\', '/'))
}

function usesNoteAssetAlias(sourceRelPath: string): boolean {
  return sourceRelPath === 'tnotes.json' || sourceRelPath.startsWith(`${NOTES_DIR}/`)
}

export function joinFromSource(sourceRelPath: string, relativePath: string): string {
  const sourceDir = path.posix.dirname(sourceRelPath)
  if (sourceDir === '.') return posixNormalize(relativePath)
  return posixNormalize(`${sourceDir}/${relativePath}`)
}

const SKIP_FOLLOW_PARTS = new Set(['node_modules', 'dist', 'out', '.git', '.cache'])

/** Resolve a local URL to a knowledge-base relative file (assets or sibling Vue/CSS/HTML). */
export function resolveLocalKbPath(
  rawUrl: string,
  sourceRelPath: string
): { kbRelPath: string | null; outOfBounds: boolean; classified: ClassifiedAssetUrl } {
  const classified = classifyAssetUrl(rawUrl, sourceRelPath)
  if (classified.urlKind === 'data' || classified.urlKind === 'remote') {
    return { kbRelPath: null, outOfBounds: false, classified }
  }
  if (classified.targetRelPath) {
    return {
      kbRelPath: classified.targetRelPath,
      outOfBounds: classified.outOfBounds,
      classified
    }
  }
  const trimmed = classified.decodedPath.trim()
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('?')) {
    return { kbRelPath: null, outOfBounds: false, classified }
  }
  const joined = joinFromSource(sourceRelPath, trimmed.replaceAll('\\', '/'))
  if (joined.startsWith('../') || joined === '..') {
    return { kbRelPath: null, outOfBounds: true, classified }
  }
  const parts = joined.split('/')
  if (parts.some((part) => SKIP_FOLLOW_PARTS.has(part))) {
    return { kbRelPath: null, outOfBounds: false, classified }
  }
  return { kbRelPath: joined, outOfBounds: false, classified }
}

function asAssetsTarget(normalized: string): string | null {
  if (normalized === ASSETS_DIR || normalized.startsWith(`${ASSETS_DIR}/`)) return normalized
  return null
}

export function classifyAssetUrl(rawUrl: string, sourceRelPath: string): ClassifiedAssetUrl {
  const trimmed = rawUrl.trim()
  const { pathPart, suffix } = splitUrlSuffix(trimmed)
  const { decoded, failed } = decodeOnce(pathPart)
  const slashNormalized = decoded.replaceAll('\\', '/')

  if (/^data:/i.test(slashNormalized)) {
    return {
      urlKind: 'data',
      rawUrl: trimmed,
      decodedPath: slashNormalized,
      urlSuffix: suffix,
      targetRelPath: null,
      outOfBounds: false,
      decodeFailed: failed
    }
  }

  if (PROTOCOL.test(slashNormalized) && !/^file:/i.test(slashNormalized)) {
    return {
      urlKind: 'remote',
      rawUrl: trimmed,
      decodedPath: slashNormalized,
      urlSuffix: suffix,
      targetRelPath: null,
      outOfBounds: false,
      decodeFailed: failed
    }
  }

  const rootSlash = slashNormalized.match(ROOT_SLASH_ASSET)
  if (rootSlash) {
    const target = posixNormalize(`${ASSETS_DIR}/${rootSlash[1]}`)
    const outOfBounds = target.startsWith('../') || !target.startsWith(`${ASSETS_DIR}/`)
    return {
      urlKind: 'local-root',
      rawUrl: trimmed,
      decodedPath: slashNormalized,
      urlSuffix: suffix,
      targetRelPath: outOfBounds ? null : target,
      outOfBounds,
      decodeFailed: failed
    }
  }

  if (usesNoteAssetAlias(sourceRelPath)) {
    const alias = slashNormalized.match(ASSET_ALIAS)
    if (alias) {
      const target = posixNormalize(`${ASSETS_DIR}/${alias[1]}`)
      const outOfBounds = target.startsWith('../') || !asAssetsTarget(target)
      return {
        urlKind: 'local-relative',
        rawUrl: trimmed,
        decodedPath: slashNormalized,
        urlSuffix: suffix,
        targetRelPath: outOfBounds ? null : target,
        outOfBounds,
        decodeFailed: failed
      }
    }
  }

  const joined = joinFromSource(sourceRelPath, slashNormalized)
  const target = asAssetsTarget(joined)
  if (target) {
    const outOfBounds = joined.startsWith('../')
    return {
      urlKind: 'local-relative',
      rawUrl: trimmed,
      decodedPath: slashNormalized,
      urlSuffix: suffix,
      targetRelPath: outOfBounds ? null : target,
      outOfBounds,
      decodeFailed: failed
    }
  }

  const escaped = joined.startsWith('../') || joined.includes('/../')
  return {
    urlKind: escaped
      ? 'other'
      : slashNormalized.startsWith(ASSETS_DIR)
        ? 'local-relative'
        : 'other',
    rawUrl: trimmed,
    decodedPath: slashNormalized,
    urlSuffix: suffix,
    targetRelPath: null,
    outOfBounds: escaped,
    decodeFailed: failed
  }
}

export function offsetToLineColumn(
  source: string,
  offset: number
): { line: number; column: number } {
  let line = 1
  let column = 1
  const limit = Math.max(0, Math.min(offset, source.length))
  for (let i = 0; i < limit; i++) {
    if (source[i] === '\n') {
      line += 1
      column = 1
    } else {
      column += 1
    }
  }
  return { line, column }
}

export function assetFileKind(fileName: string): import('./types').AssetFileKind {
  const ext = path.posix.extname(fileName).toLowerCase()
  if (ext === '.svg') return 'svg'
  if (ext === '.gif') return 'gif'
  if (ext === '.excalidraw') return 'excalidraw'
  if (ext === '.html' || ext === '.htm') return 'html'
  if (ext === '.css') return 'css'
  if (['.png', '.jpg', '.jpeg', '.webp', '.avif', '.ico', '.bmp'].includes(ext)) return 'image'
  return 'other'
}

export const ASSET_HINT_REGEX = /(?:\.\.\/|\.\/|\/)?assets\/[^\s)"'`<>]+/gi

/**
 * Preserve the original dest prefix and query/fragment when rewriting a local
 * asset URL. Alias forms (`../assets/`, `./assets/`, `assets/`) keep that
 * prefix. Relative URLs in HTML/CSS/Vue/Excalidraw keep a path relative to the
 * source file when `sourceRelPath` is provided.
 */
export function rewriteLocalAssetUrl(
  rawUrl: string,
  nextTargetRelPath: string,
  sourceRelPath?: string
): string | null {
  const { pathPart, suffix } = splitUrlSuffix(rawUrl.trim())
  if (!nextTargetRelPath.startsWith(`${ASSETS_DIR}/`)) return null
  const rest = nextTargetRelPath.slice(ASSETS_DIR.length + 1)
  if (/^\/assets\//i.test(pathPart)) return null
  if (/^\.\.\/assets\//i.test(pathPart)) return `../${ASSETS_DIR}/${rest}${suffix}`
  if (/^\.\/assets\//i.test(pathPart)) return `./${ASSETS_DIR}/${rest}${suffix}`
  if (/^assets\//i.test(pathPart)) return `${ASSETS_DIR}/${rest}${suffix}`

  if (!sourceRelPath) return null
  const classified = classifyAssetUrl(rawUrl, sourceRelPath)
  if (classified.urlKind !== 'local-relative' || !classified.targetRelPath) return null

  const sourceDir = path.posix.dirname(sourceRelPath)
  let rel = path.posix.relative(sourceDir, nextTargetRelPath).replaceAll('\\', '/')
  if (!rel || rel === '.') rel = path.posix.basename(nextTargetRelPath)
  if (pathPart.startsWith('./') && !rel.startsWith('.') && !path.posix.isAbsolute(rel)) {
    rel = `./${rel}`
  } else if (!pathPart.startsWith('.') && rel.startsWith('./')) {
    rel = rel.slice(2)
  }
  return `${rel}${suffix}`
}
