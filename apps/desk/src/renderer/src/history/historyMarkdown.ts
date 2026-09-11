/**
 * 历史正文的只读渲染（计划 H2）。
 *
 * 目标：用与当前文件完全分开的加载路径，把某个 commit 的正文渲染成只读 DOM。
 *
 * - 不执行历史文件里的 `<script>`/`<style>`/`<iframe>`，遇到就换成占位并记限制
 * - 自定义组件的 HTML 只放行历史画布（`<Excalidraw>`），其它组件显示「不支持」占位
 * - 图片、相对链接都只在同一 commit 内解析；远程资源明确标为「当前网络内容」
 * - 需要挂载的块（画布 / Mermaid）只输出带 `data-tn-history-mount` 的占位，
 *   真实内容放在 `mounts` 里返回，由调用方按需、按可见性挂载
 */
import DOMPurify from 'dompurify'
import MarkdownIt from 'markdown-it'
import linkAttributes from 'markdown-it-link-attributes'
import taskLists from 'markdown-it-task-lists'

import {
  decodeHistoryPath,
  resolveHistoryResource,
  type HistoryCommitContext,
  type HistoryResource
} from './commitContext'

export type HistoryDiagnosticCode =
  | 'blocked-script'
  | 'unsupported-component'
  | 'remote-resource'
  | 'missing-resource'
  | 'unsupported-resource'

export interface HistoryDiagnostic {
  code: HistoryDiagnosticCode
  /** 原始引用 / 标签片段，便于用户对照源码 */
  source: string
  message: string
}

export interface HistoryMount {
  id: number
  kind: 'excalidraw' | 'mermaid'
  /** Mermaid 源码；不写进 DOM 属性，避免二次 HTML 解析 */
  text: string
  /** Excalidraw：该 commit 里的知识库相对路径（缺失时为空） */
  relPath: string
  /** Excalidraw：`tnotes-asset://history` URL（缺失时为空） */
  url: string
  /** Excalidraw：该 commit 里的 blob OID（缓存键的一部分） */
  oid: string
  height: number
  /** 历史里找不到该文件 / 不是画布时的原因；非空表示只能显示占位 */
  missingReason: string
}

export interface HistoryRenderResult {
  html: string
  diagnostics: HistoryDiagnostic[]
  mounts: HistoryMount[]
}

const TOKEN = 'TNHISTORYPLACEHOLDER'

/** 危险标签：整块替换成占位，绝不进入渲染管线。 */
const BLOCKED_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta']
const HREF_SCHEME = /^[a-z][a-z\d+.-]*:/i

const EXCALIDRAW_TAG = /<Excalidraw\b([^>]*?)\/?>/gi
/** 首字母大写的标签视为项目自定义组件（HTML 原生标签都是小写）。 */
const CUSTOM_COMPONENT_TAG = /<([A-Z][A-Za-z\d]*)\b[^>]*?\/?>/g

interface Placeholder {
  id: number
  kind: 'canvas' | 'blocked' | 'component'
  snippet: string
  message: string
  /** 仅画布占位使用 */
  relPath?: string
  url?: string
  oid?: string
  height?: number
}

let markdownIt: InstanceType<typeof MarkdownIt> | null = null

function getMarkdownIt(): InstanceType<typeof MarkdownIt> {
  if (markdownIt) return markdownIt
  const instance = new MarkdownIt({ html: true, linkify: true, breaks: false })
  instance.use(taskLists)
  instance.use(linkAttributes, { attrs: { target: '_self', rel: 'noopener' } })
  markdownIt = instance
  return instance
}

function readAttribute(attributes: string, name: string): string {
  const match = attributes.match(
    new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i')
  )
  return (match?.[1] ?? match?.[2] ?? match?.[3] ?? '').trim()
}

function snippetOf(value: string): string {
  return value.length > 120 ? `${value.slice(0, 117)}…` : value
}

function extractBlockedTags(
  source: string,
  placeholders: Placeholder[],
  diagnostics: HistoryDiagnostic[]
): string {
  let text = source
  for (const tag of BLOCKED_TAGS) {
    const paired = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}\\s*>`, 'gi')
    const selfClosing = new RegExp(`<${tag}\\b[^>]*?\\/?>`, 'gi')
    const replace = (snippet: string): string => {
      const id = placeholders.length
      const message = `历史预览不会执行历史文件里的 <${tag}>，已按源码显示`
      diagnostics.push({ code: 'blocked-script', source: snippetOf(snippet), message })
      placeholders.push({ id, kind: 'blocked', snippet: snippetOf(snippet), message })
      return `\n\n${TOKEN}${id}\n\n`
    }
    text = text.replace(paired, replace).replace(selfClosing, replace)
  }
  return text
}

function extractCanvases(
  source: string,
  context: HistoryCommitContext,
  placeholders: Placeholder[],
  diagnostics: HistoryDiagnostic[]
): string {
  return source.replace(EXCALIDRAW_TAG, (snippet: string, attributes: string) => {
    const reference = readAttribute(attributes, 'path') || readAttribute(attributes, 'src')
    const heightRaw = Number.parseInt(readAttribute(attributes, 'height'), 10)
    const height = Number.isFinite(heightRaw) && heightRaw > 0 ? heightRaw : 480
    const resource: HistoryResource | null = reference
      ? resolveHistoryResource(context, reference)
      : null
    const id = placeholders.length
    if (resource?.kind === 'local') {
      placeholders.push({
        id,
        kind: 'canvas',
        snippet: '',
        message: '',
        relPath: resource.relPath,
        url: resource.url,
        oid: resource.oid,
        height
      })
      return `\n\n${TOKEN}${id}\n\n`
    }
    const reason =
      resource && resource.kind !== 'inline'
        ? resource.reason
        : reference
          ? '历史预览只能按 commit 内路径打开画布'
          : '画布缺少 path 属性'
    diagnostics.push({
      code: 'missing-resource',
      source: snippetOf(snippet),
      message: `历史画布无法打开：${reason}`
    })
    placeholders.push({ id, kind: 'canvas', snippet: '', message: reason, height })
    return `\n\n${TOKEN}${id}\n\n`
  })
}

/** 非画布的自定义组件：不静默读取当前 KB，直接显示不支持。 */
function extractCustomComponents(
  source: string,
  placeholders: Placeholder[],
  diagnostics: HistoryDiagnostic[]
): string {
  return source.replace(CUSTOM_COMPONENT_TAG, (snippet: string, name: string) => {
    if (name.toLowerCase() === 'excalidraw') return snippet
    const id = placeholders.length
    const message = `历史预览暂不支持 <${name}>，避免读取当前知识库数据`
    diagnostics.push({ code: 'unsupported-component', source: snippetOf(snippet), message })
    placeholders.push({ id, kind: 'component', snippet: snippetOf(snippet), message })
    return `\n\n${TOKEN}${id}\n\n`
  })
}

function canvasMetaOf(placeholder: Placeholder): {
  relPath: string
  url: string
  oid: string
  height: number
} {
  return {
    relPath: placeholder.relPath ?? '',
    url: placeholder.url ?? '',
    oid: placeholder.oid ?? '',
    height: placeholder.height ?? 480
  }
}

function applyResourceToImage(
  image: Element,
  resource: HistoryResource,
  result: HistoryRenderResult
): void {
  if (resource.kind === 'local') {
    image.setAttribute('src', resource.url)
    image.setAttribute('data-tn-history-oid', resource.oid)
    return
  }
  if (resource.kind === 'inline') {
    image.setAttribute('src', resource.url)
    return
  }
  image.removeAttribute('src')
  image.setAttribute('data-tn-history-skip', resource.kind)
  result.diagnostics.push({
    code:
      resource.kind === 'remote'
        ? 'remote-resource'
        : resource.kind === 'missing'
          ? 'missing-resource'
          : 'unsupported-resource',
    source: resource.source,
    message: resource.reason
  })
}

function rewriteReferences(
  host: HTMLElement,
  context: HistoryCommitContext,
  result: HistoryRenderResult
): void {
  host.querySelectorAll('img').forEach((image) => {
    const source = image.getAttribute('src') ?? ''
    if (!source) return
    applyResourceToImage(image, resolveHistoryResource(context, source), result)
  })

  host.querySelectorAll('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href') ?? ''
    if (!href || href.startsWith('#')) return
    if (/^https?:\/\//i.test(href)) return
    anchor.removeAttribute('href')
    if (HREF_SCHEME.test(href)) return
    const resource = resolveHistoryResource(context, href)
    if (resource.kind === 'local') {
      // 同 commit 的笔记链接交给调用方在历史上下文里打开，绝不落到当前磁盘
      anchor.setAttribute('data-tn-history-link', resource.relPath)
      return
    }
    // 诊断里显示解码后的路径，避免让用户对着 %20 找文件
    const readableHref = decodeHistoryPath(href)
    result.diagnostics.push({
      code: resource.kind === 'remote' ? 'remote-resource' : 'missing-resource',
      source: readableHref,
      message:
        resource.kind === 'missing'
          ? `链接目标在该提交里不存在：${readableHref}`
          : `链接不可在历史上下文中打开：${readableHref}`
    })
  })
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * 占位块用字符串替换（而不是依赖 `<p>` 包裹）：DOMPurify 在不同 DOM 实现下
 * 对 `<p>` 的处理不一致，字符串替换在 Electron 与测试环境里结果一致。
 */
function replacePlaceholderTokens(html: string, placeholders: Placeholder[]): string {
  return html.replace(
    new RegExp(`(?:<p>)?${TOKEN}(\\d+)(?:</p>)?`, 'g'),
    (_match, index: string) => {
      const placeholder = placeholders[Number(index)]
      if (!placeholder) return ''
      if (placeholder.kind === 'canvas') {
        const meta = canvasMetaOf(placeholder)
        const missing = placeholder.message
          ? ` data-missing="${escapeHtml(placeholder.message)}">历史画布不可用：${escapeHtml(placeholder.message)}`
          : '>'
        return (
          `<div data-tn-history-canvas="${placeholder.id}" data-tn-history-mount="${placeholder.id}"` +
          ` data-height="${meta.height}"${missing}</div>`
        )
      }
      return (
        `<div data-tn-history-unsupported="${placeholder.kind}">` +
        `<p>${escapeHtml(placeholder.message)}</p>` +
        `<pre>${escapeHtml(placeholder.snippet)}</pre></div>`
      )
    }
  )
}

function mountMermaidBlocks(
  host: HTMLElement,
  placeholders: Placeholder[],
  result: HistoryRenderResult
): void {
  host.querySelectorAll('code.language-mermaid').forEach((code) => {
    const container = code.closest('pre') ?? code
    const id = placeholders.length
    const text = code.textContent ?? ''
    placeholders.push({ id, kind: 'component', snippet: '', message: '' })
    const mount = document.createElement('div')
    mount.className = 'tn-mermaid'
    mount.setAttribute('data-tn-history-mount', String(id))
    mount.setAttribute('data-tn-history-mermaid', String(id))
    container.replaceWith(mount)
    result.mounts.push({
      id,
      kind: 'mermaid',
      text,
      relPath: '',
      url: '',
      oid: '',
      height: 0,
      missingReason: ''
    })
  })
}

/**
 * 去掉笔记 YAML frontmatter：历史预览显示正文，`id` 这类元数据不该出现在正文里。
 * 只有文件开头成对的 `---` 才算 frontmatter，正文里的水平线不受影响。
 */
export function stripHistoryFrontmatter(source: string): string {
  const match = source.match(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---\r?\n?/)
  if (!match) return source
  return source.slice(match[0].length)
}

export function renderHistoryMarkdown(
  source: string,
  context: HistoryCommitContext
): HistoryRenderResult {
  const placeholders: Placeholder[] = []
  const diagnostics: HistoryDiagnostic[] = []
  let text = extractBlockedTags(stripHistoryFrontmatter(source), placeholders, diagnostics)
  text = extractCanvases(text, context, placeholders, diagnostics)
  text = extractCustomComponents(text, placeholders, diagnostics)

  const result: HistoryRenderResult = {
    html: '',
    diagnostics: [...diagnostics],
    mounts: placeholders
      .filter((placeholder) => placeholder.kind === 'canvas')
      .map((placeholder) => {
        const meta = canvasMetaOf(placeholder)
        return {
          id: placeholder.id,
          kind: 'excalidraw' as const,
          text: '',
          relPath: meta.relPath,
          url: meta.url,
          oid: meta.oid,
          height: meta.height,
          missingReason: placeholder.message
        }
      })
  }

  const raw = getMarkdownIt().render(text)
  const sanitized = DOMPurify.sanitize(raw, {
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta', 'base']
  })
  const withPlaceholders = replacePlaceholderTokens(sanitized, placeholders)
  const host = document.createElement('div')
  host.innerHTML = withPlaceholders
  mountMermaidBlocks(host, placeholders, result)
  rewriteReferences(host, context, result)
  result.html = host.innerHTML
  return result
}
