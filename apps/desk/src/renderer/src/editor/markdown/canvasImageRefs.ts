/**
 * 画布图片的跨笔记复制规则（纯逻辑，便于单测）。
 *
 * 规矩就一条：**引用的资源一律拷贝，不共享**。每篇笔记引用自己的那份资源，
 * 所以把画布图粘贴到别的笔记时，`.excalidraw` 与它同名的 `.svg` 要一起换成
 * 目标笔记的编号前缀重新生成，并把引用改成新路径。
 *
 * 同笔记内粘贴（编号相同）不复制：还是同一张画布。
 */
import { parseImageAttrs } from '@tnotesjs/ui/image-markdown'

const IMAGE_REFERENCE = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)(\s*\{[^}]*\})?/g

export interface CanvasImageRef {
  /** 原文里的相对路径（粘贴时原样出现的那段） */
  rawPath: string
  /** KB 相对路径：assets/*.svg */
  svgRelPath: string
  /** 同名源画布：assets/*.excalidraw */
  sourceRelPath: string
  alt: string
  width: string
  align: string
}

/** `assets/0013-x.svg` → `assets/0013-x.excalidraw`（与 kb 层同一规则） */
export function sourceRelPathForSvg(svgRelPath: string): string {
  return svgRelPath.replace(/\.svg$/i, '.excalidraw')
}

/** 四位归属编号；没有前缀时返回 null */
export function ownerIndexFromRelPath(relPath: string): string | null {
  const name = relPath.split('/').pop() ?? ''
  const match = /^(\d{4})-/.exec(name)
  return match ? match[1] : null
}

/**
 * 从一段 markdown 文本里挑出「可能指向画布」的图片引用。
 *
 * 只看 `.svg`：是不是画布由调用方（主进程探测）确认 —— 这里不猜。
 */
export function canvasSvgRefsInText(
  text: string,
  resolveRelPath: (rawPath: string) => string | null
): CanvasImageRef[] {
  const refs: CanvasImageRef[] = []
  for (const match of text.matchAll(IMAGE_REFERENCE)) {
    const rawPath = match[2] ?? ''
    if (!rawPath.toLowerCase().endsWith('.svg')) continue
    const svgRelPath = resolveRelPath(rawPath)
    if (!svgRelPath) continue
    const attrs = parseImageAttrs(match[3] ?? '')
    refs.push({
      rawPath,
      svgRelPath,
      sourceRelPath: sourceRelPathForSvg(svgRelPath),
      alt: match[1] ?? '',
      width: attrs.width,
      align: attrs.align
    })
  }
  return refs
}

/**
 * 从富文本剪贴板（`text/html`）里挑出画布引用。
 *
 * 为什么需要：复制图片节点时 ProseMirror 的 `text/plain` 只有 alt 文字（"画布"），
 * 真正的图片信息在 HTML 里（`<img src="tnotes-asset://asset?...path=assets/0013-x.svg">`）。
 * 只认文本就会漏掉"复制图片 → 粘贴到别的笔记"这条最常见的路径，资源也就不会被拷贝。
 */
export function canvasSvgRefsInHtml(
  html: string,
  resolveRelPath: (rawPath: string) => string | null
): CanvasImageRef[] {
  if (!html.includes('.svg')) return []
  // 属性里的 query 会被 HTML 转义成 &amp;，解析前先还原
  const source = html.replace(/&amp;/gi, '&')
  const decode = (value: string): string => {
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  /** 候选字符串 → KB 相对路径：URL 取 path 参数，普通路径去掉 query/hash */
  const toRelPath = (value: string): string | null => {
    const fromQuery = /[?&]path=([^"'&\s>]+)/i.exec(value)?.[1]
    if (fromQuery) {
      const candidate = decode(fromQuery)
      if (candidate.toLowerCase().endsWith('.svg')) return candidate
    }
    const cleaned = decode(value).split(/[?#]/, 1)[0] ?? ''
    if (!cleaned.toLowerCase().endsWith('.svg')) return null
    if (cleaned.startsWith('assets/')) return cleaned
    return resolveRelPath(cleaned)
  }

  const refs: CanvasImageRef[] = []
  const seen = new Set<string>()
  const push = (candidate: string, alt: string): void => {
    const svgRelPath = toRelPath(candidate)
    if (!svgRelPath || seen.has(svgRelPath)) return
    seen.add(svgRelPath)
    refs.push({
      rawPath: svgRelPath,
      svgRelPath,
      sourceRelPath: sourceRelPathForSvg(svgRelPath),
      alt,
      width: '',
      align: 'left'
    })
  }

  // alt 可能只写在 <img> 上，而 data-tn-src 在包住它的 <figure> 上：取不到就退回全文第一个 alt
  const fallbackAlt = /alt="([^"]*)"/i.exec(source)?.[1] ?? ''
  // 第一优先：Desk 图片视图自己写的 `data-tn-src`（就是笔记里的相对路径，
  // 它同时落在 <img> 与包住它的 <figure> 上，是剪贴板保真的规范来源）
  for (const tag of source.matchAll(/<[a-z][^>]*\bdata-tn-src="([^"]+)"[^>]*>/gi)) {
    push(tag[1] ?? '', /alt="([^"]*)"/i.exec(tag[0])?.[1] ?? fallbackAlt)
  }
  // 其次：普通 <img> / <a> 标签
  for (const tag of source.matchAll(/<(?:img|a)\b[^>]*>/gi)) {
    const value = /(?:src|href)="([^"]*)"/i.exec(tag[0])?.[1]
    if (!value) continue
    push(value, /alt="([^"]*)"/i.exec(tag[0])?.[1] ?? '')
  }
  // 最后：没有标签、只有裸链接时（例如从别处粘来的 URL）也认
  for (const match of source.matchAll(/[?&]path=([^"'&\s>]+)/gi)) {
    push(`path=${match[1] ?? ''}`, '')
  }
  return refs
}

/** 合并文本与富文本两条来源，按 KB 路径去重（文本那条带 alt/尺寸，优先保留） */
export function mergeCanvasRefs(
  primary: CanvasImageRef[],
  secondary: CanvasImageRef[]
): CanvasImageRef[] {
  const merged = new Map<string, CanvasImageRef>()
  for (const ref of [...primary, ...secondary]) {
    if (!merged.has(ref.svgRelPath)) merged.set(ref.svgRelPath, ref)
  }
  return [...merged.values()]
}

/**
 * 这个引用要不要复制一份？
 *
 * - 来源编号 = 目标笔记编号 → 不复制（还是同一张画布）
 * - 任一侧拿不到四位编号 → 不复制（保留原引用，让用户看到真实路径）
 */
export function needsCanvasCopy(ref: CanvasImageRef, targetNoteIndex: string): boolean {
  const owner = ownerIndexFromRelPath(ref.svgRelPath)
  if (!owner || !/^\d{4}$/.test(targetNoteIndex)) return false
  return owner !== targetNoteIndex
}
