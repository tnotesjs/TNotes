/**
 * 节点行内内容模型与 markdown 行内语法解析。
 * 支持的行内形态：纯文本、链接 [text](url)、图片 ![alt|width](src)；
 * 任务 checkbox 属于列表项语法（- [ ]），由 parser 在列表行级别处理。
 */

export interface ImageInfo {
  src: string
  alt: string
  /** 显示宽度 px；null 表示使用默认宽度 */
  width: number | null
}

export interface NodeContent {
  /** 展示用纯文本（已去除行内标记） */
  text: string
  /** 行内源码（纯文本节点保留原文；结构化节点由字段再生成） */
  raw: string
  link: string | null
  image: ImageInfo | null
  /** null = 非任务节点 */
  checked: boolean | null
}

export function plainContent(text: string): NodeContent {
  return { text, raw: text, link: null, image: null, checked: null }
}

/** 去除常见行内标记，得到展示用纯文本 */
export function stripInline(md: string): string {
  return md
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
}

const IMAGE_RE = /^!\[([^\]]*)\]\(([^()\s]+)\)$/
const LINK_RE = /^\[([^\]]+)\]\(([^()\s]+)\)$/
const ALT_WIDTH_RE = /^(.*)\|(\d+)$/

export function parseInline(raw: string): NodeContent {
  const trimmed = raw.trim()

  const img = IMAGE_RE.exec(trimmed)
  if (img) {
    let alt = img[1]
    let width: number | null = null
    const w = ALT_WIDTH_RE.exec(alt)
    if (w) {
      alt = w[1]
      width = parseInt(w[2], 10)
    }
    return {
      text: alt || '图片',
      raw: trimmed,
      link: null,
      image: { src: img[2], alt, width },
      checked: null,
    }
  }

  const link = LINK_RE.exec(trimmed)
  if (link) {
    return { text: link[1], raw: trimmed, link: link[2], image: null, checked: null }
  }

  return { text: stripInline(trimmed), raw: trimmed, link: null, image: null, checked: null }
}

/**
 * 结构化字段被修改后，重新生成 raw。
 * 纯文本节点的 raw 即原文，无需再生。
 */
export function refreshRaw(content: NodeContent): void {
  if (content.image) {
    const { alt, src, width } = content.image
    content.raw = `![${alt}${width !== null ? `|${width}` : ''}](${src})`
    content.text = alt || '图片'
    content.link = null
  } else if (content.link) {
    content.raw = `[${content.text}](${content.link})`
  }
}
