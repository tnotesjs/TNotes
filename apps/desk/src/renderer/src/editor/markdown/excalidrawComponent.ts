/**
 * `<Excalidraw path="…" />` 组件源码解析与定点改写（计划 E5）。
 *
 * 约定：
 * - `path` 必须是**带引号的字符串**（不解析 `{…}` 表达式，绝不 eval）
 * - 只认识 `path` 与 `height`；其它属性、引号风格、换行与缩进原样保留
 * - 只有 path/height 真的变化时才改写对应属性的字面量，其余字节不动
 */

export interface ParsedExcalidrawComponent {
  path: string
  /** 卡片高度（px 数字）；缺省 null 表示用默认高度 */
  height: number | null
  trailingNewline: boolean
}

/** 整块就是 `<Excalidraw … />`（允许属性跨行；结尾不允许再有其它内容）。 */
const EXCALIDRAW_TAG = /^ {0,3}<Excalidraw\b([^>]*?)\/?\s*>\s*$/
const PATH_ATTR = /(?<![\w:-])path\s*=\s*(?:"([^"]*)"|'([^']*)')/
const HEIGHT_ATTR = /(?<![\w:-])height\s*=\s*(?:"([^"]*)"|'([^']*)')/
const BOUND_HEIGHT_ATTR = /:height\s*=\s*"\s*(\d+)\s*"/

function trimmed(source: string): string {
  return source.replace(/\r\n?/g, '\n').trim()
}

/** 标签是否是 `<Excalidraw … />`（大小写敏感，与 Vue 组件名一致）。 */
export function isExcalidrawSource(source: string): boolean {
  return EXCALIDRAW_TAG.test(trimmed(source))
}

function attrsOf(source: string): string | null {
  return trimmed(source).match(EXCALIDRAW_TAG)?.[1] ?? null
}

/** 读取属性值；`{…}` 之类表达式一律不认，避免执行源码。 */
export function readExcalidrawStringAttr(source: string, name: string): string | null {
  const attrs = attrsOf(source)
  if (attrs == null) return null
  const match = new RegExp(`(?<![\\w:-])${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`).exec(attrs)
  return match?.[1] ?? match?.[2] ?? null
}

export function parseExcalidrawSource(source: string): ParsedExcalidrawComponent | null {
  const attrs = attrsOf(source)
  if (attrs == null) return null
  const path = PATH_ATTR.exec(attrs)
  const value = path?.[1] ?? path?.[2]
  if (value == null) return null
  const heightRaw = (HEIGHT_ATTR.exec(attrs)?.[1] ?? HEIGHT_ATTR.exec(attrs)?.[2] ?? '') || ''
  const boundHeight = BOUND_HEIGHT_ATTR.exec(attrs)?.[1] ?? ''
  const heightText = (heightRaw || boundHeight).replace(/px$/i, '').trim()
  const height = heightText ? Number.parseInt(heightText, 10) : Number.NaN
  return {
    path: value,
    height: Number.isFinite(height) && height > 0 ? height : null,
    trailingNewline: /\r?\n$/.test(source)
  }
}

/** 新的 `<Excalidraw path="…" />` 行；只在插入/修复时使用。 */
export function buildExcalidrawSource(options: {
  path: string
  height?: number | null
  trailingNewline?: boolean
}): string {
  const path = options.path.replace(/"/g, '')
  const parts = [`path="${path}"`]
  if (options.height != null && options.height > 0) parts.push(`height="${options.height}"`)
  const line = `<Excalidraw ${parts.join(' ')} />`
  return (options.trailingNewline ?? true) ? `${line}\n` : line
}

/** 只替换 path 属性的字面量，其它属性/引号/换行原样保留。 */
export function setExcalidrawPath(source: string, nextPath: string): string {
  if (attrsOf(source) == null) return source
  const value = nextPath.replace(/"/g, '')
  return source.replace(
    /((?<![\w:-])path\s*=\s*)("([^"]*)"|'([^']*)')/,
    (_all, head: string, _literal: string, doubleValue?: string) =>
      doubleValue !== undefined ? `${head}"${value}"` : `${head}'${value}'`
  )
}

/** 写入/移除 height 属性；保留其它属性与引号风格。 */
export function setExcalidrawHeight(source: string, height: number | null): string {
  const attrs = attrsOf(source)
  if (attrs == null) return source
  const hasHeight = /(?<![\w:-])height\s*=/.test(attrs) || /:height\s*=/.test(attrs)

  if (height == null || height <= 0) {
    if (!hasHeight) return source
    return source
      .replace(/\s+(?<![\w:-])height\s*=\s*"[^"]*"/, '')
      .replace(/\s+(?<![\w:-])height\s*=\s*'[^']*'/, '')
      .replace(/\s+:height\s*=\s*"\s*\d+\s*"/, '')
  }

  if (hasHeight) {
    return source
      .replace(/((?<![\w:-])height\s*=\s*")\s*\d*(?:"|\s*px\s*")/, `$1${height}"`)
      .replace(/((?<![\w:-])height\s*=\s*')\s*\d*(?:'|\s*px\s*')/, `$1${height}'`)
      .replace(/(:height\s*=\s*"\s*)\d+(\s*")/, `$1${height}$2`)
  }

  // 插到 path 属性之后（含引号）：单行与多行标签都不会破坏原排版
  const match = PATH_ATTR.exec(source)
  if (!match) return source
  const insertAt = (match.index ?? 0) + match[0].length
  return `${source.slice(0, insertAt)} height="${height}"${source.slice(insertAt)}`
}
