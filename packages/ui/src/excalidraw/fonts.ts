/**
 * 字体自包含。
 *
 * 背景：`@excalidraw/excalidraw` 官方 npm 包把资源基址硬编码为
 * `https://esm.sh/@excalidraw/excalidraw@<version>/dist/prod/`（源码里的
 * `ASSETS_FALLBACK_URL`），导出的 SVG 会引用 CDN 字体：
 * - 离线 Desk / 离线站点会掉字体；
 * - 用 `<img>` 渲染 SVG 时浏览器禁止加载外部资源，字体一定不生效。
 *
 * 因此只读路径必须把 SVG 实际引用到的字体内联成 data URL；同时用
 * `EXCALIDRAW_ASSET_PATH` 让编辑器与导出时的文本度量走本地字体目录。
 */

export interface InlineFontsOptions {
  /** 本地资源基址（与 window.EXCALIDRAW_ASSET_PATH 同一口径），如 '/excalidraw/' */
  base?: string
  /** 便于测试注入 */
  fetchImpl?: typeof fetch
}

export interface InlineFontsResult {
  svg: string
  /** 成功内联的字体文件数 */
  inlined: number
  /** 内联失败仍是外链的 URL（调用方应记录，不能静默） */
  remaining: string[]
}

const FONT_URL_PATTERN = /url\((?:'|")?([^'")]+\.woff2?)(?:'|")?\)/g

/** 把 CDN / 相对基址统一成本地基址下的字体路径。 */
export function resolveFontUrl(rawUrl: string, base?: string): string {
  const fileName = rawUrl.split('/fonts/').pop() ?? rawUrl.split('/').pop() ?? rawUrl
  if (!base) return rawUrl
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}fonts/${fileName}`
}

function toBase64(bytes: Uint8Array): string {
  // 纯浏览器实现：这个包不依赖 node 类型（Buffer 在 SSG/Desk 浏览器侧不存在）
  let binary = ''
  const chunk = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunk) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk))
  }
  return btoa(binary)
}

function mimeFor(url: string): string {
  return url.endsWith('.woff') ? 'font/woff' : 'font/woff2'
}

export async function inlineExcalidrawFonts(
  svg: string,
  options: InlineFontsOptions = {}
): Promise<InlineFontsResult> {
  const fetchImpl = options.fetchImpl ?? (typeof fetch === 'function' ? fetch : undefined)
  const urls = [...new Set([...svg.matchAll(FONT_URL_PATTERN)].map((match) => match[1]))]
  if (urls.length === 0) return { svg, inlined: 0, remaining: [] }
  if (!fetchImpl) return { svg, inlined: 0, remaining: urls }

  const replacements = new Map<string, string>()
  const remaining: string[] = []
  for (const original of urls) {
    const target = resolveFontUrl(original, options.base)
    try {
      const response = await fetchImpl(target)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const bytes = new Uint8Array(await response.arrayBuffer())
      replacements.set(original, `data:${mimeFor(target)};base64,${toBase64(bytes)}`)
    } catch {
      remaining.push(target)
    }
  }

  let next = svg
  for (const [from, to] of replacements) {
    next = next.split(from).join(to)
  }
  return { svg: next, inlined: replacements.size, remaining }
}

/** 告知 Excalidraw 从本地目录取字体（离线必需）。 */
export function setExcalidrawAssetPath(base: string): void {
  if (typeof window === 'undefined') return
  ;(window as { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH = base
}

export function getExcalidrawAssetPath(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH
}
