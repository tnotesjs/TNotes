import { Plugin } from '@milkdown/kit/prose/state'
import { Decoration, DecorationSet } from '@milkdown/kit/prose/view'
import { $nodeSchema, $prose, $remark } from '@milkdown/kit/utils'
import { codeBlockSchema } from '@milkdown/kit/preset/commonmark'
import Badge from '@tnotesjs/ui/badge'
import { createApp, h } from 'vue'

import {
  isVisualCalloutSource,
  parseContainerFences,
  renderContainerFromSource,
  type ResolveImage,
  type VisualCalloutType
} from './containerBody'
import { deskCalloutRemark, deskCalloutSchema, wrapProjectedCalloutBody } from './deskCallout'
import { escapeBlockSourceForLiteral } from './literalProjection'
import { parseFencedCode } from './diagramRenderer'
import { parseFenceTitleFromMeta } from './fenceInfo'
import {
  buildFenceInfo,
  decodeHighlightsAttr,
  encodeHighlightsAttr,
  parseFenceLineNumbers,
  parseHighlightRanges
} from './lineHighlight'
import {
  parseMarkdownSource,
  serializeMarkdownSource,
  type MarkdownSourceBlock,
  type MarkdownSourceBlockKind
} from './sourcePreservation'

import type { MilkdownPlugin } from '@milkdown/kit/ctx'
import type { MarkdownNode } from '@milkdown/kit/transformer'

type SourceProjectedKind = Extract<
  MarkdownSourceBlockKind,
  | 'raw-frontmatter'
  | 'raw-container'
  | 'raw-component'
  | 'raw-reference-definition'
  | 'raw-generated-title'
  | 'raw-generated-toc'
  | 'table'
  | 'html'
>

export type ProjectedRawBlockKind = SourceProjectedKind | 'raw-diagram'

export interface ProjectedRawBlock {
  kind: ProjectedRawBlockKind
  source: string
  hidden: boolean
}

const PROJECTED_KINDS = new Set<ProjectedRawBlockKind>([
  'raw-frontmatter',
  'raw-container',
  'raw-component',
  'raw-reference-definition',
  'raw-generated-title',
  'raw-generated-toc',
  'raw-diagram',
  'table',
  'html'
])

const MARKER =
  /^<!--desk-raw-block:v1:(raw-frontmatter|raw-container|raw-component|raw-reference-definition|raw-generated-title|raw-generated-toc|raw-diagram|table|html):([01]):([A-Za-z0-9+/]*={0,2})-->$/
const REGION_COMMENT = /^ {0,3}<!--\s*(?:end)?region(?::[\s\S]*?)?\s*-->\s*$/i
const HTML_TAG = /<\/?[A-Za-z][\w.-]*(?=[\s/>])/
/** 行内 <br> 家族：已由 htmlBreak.ts 映射成硬换行，不算「表格里的 HTML 标签」。 */
const HTML_BREAK_TAG = /<br\s*\/?>/gi
/** Standalone HTML breaks stay in the source for Milkdown's remark-preserve-empty-line. */
const STANDALONE_BREAK = /^ {0,3}<br\s*\/?>(?:[ \t]*)$/i
const DIAGRAM_LANGUAGES = new Set(['mermaid', 'mindmap'])
const COMMENT_OPEN = '<!--'
const COMMENT_CLOSE = '-->'
const NESTED_COMMENT_HOSTS = new Set<MarkdownSourceBlockKind>([
  'heading',
  'paragraph',
  'list',
  'blockquote',
  'table'
])

interface ProjectionMarkdownNode extends MarkdownNode {
  type: string
  value?: string
  children?: ProjectionMarkdownNode[]
  kind?: ProjectedRawBlockKind
  source?: string
  hidden?: boolean
  lang?: string
  deskMathSource?: boolean
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return btoa(binary)
}

function decodeBase64(value: string): string {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return new TextDecoder().decode(bytes)
}

function isProjectedKind(kind: MarkdownSourceBlockKind): kind is SourceProjectedKind {
  return PROJECTED_KINDS.has(kind as SourceProjectedKind)
}

function shouldProjectBlock(block: MarkdownSourceBlock): block is MarkdownSourceBlock & {
  kind: SourceProjectedKind
} {
  if (!isProjectedKind(block.kind)) return false
  // 表格只有在「除 <br> 家族外还含 HTML 标签」时才隔离成 raw block：只有换行的表格
  // 现在能保持原生 Milkdown 表格（单元格里的 <br> 由 htmlBreak.ts 映射成硬换行）。
  return block.kind !== 'table' || hasNonBreakHtml(block.source)
}

function hasNonBreakHtml(source: string): boolean {
  return HTML_TAG.test(source.replace(HTML_BREAK_TAG, ''))
}

function isRegionComment(block: MarkdownSourceBlock): boolean {
  return block.kind === 'html' && REGION_COMMENT.test(block.source)
}

/** True when the whole block is an HTML comment (`<!-- ... -->`). */
export function isHtmlCommentSource(source: string): boolean {
  const trimmed = source.trim()
  if (!trimmed.startsWith(COMMENT_OPEN)) return false
  const close = trimmed.indexOf(COMMENT_CLOSE)
  if (close < 0) return false
  return trimmed.slice(close + COMMENT_CLOSE.length).trim() === ''
}

/** Author `<!-- ... -->`, not `region:*` machine comments. */
export function isAuthorHtmlCommentSource(source: string): boolean {
  return isHtmlCommentSource(source) && !REGION_COMMENT.test(source.trim())
}

function isAuthorHtmlComment(block: MarkdownSourceBlock): boolean {
  return block.kind === 'html' && isAuthorHtmlCommentSource(block.source)
}

function isStandaloneBreak(block: MarkdownSourceBlock): boolean {
  return block.kind === 'html' && STANDALONE_BREAK.test(block.source)
}

function atLineStart(source: string, index: number): boolean {
  return index === 0 || source[index - 1] === '\n'
}

function matchFenceOpen(
  source: string,
  index: number
): { marker: '`' | '~'; length: number; next: number } | null {
  let cursor = index
  let spaces = 0
  while (spaces < 3 && source[cursor] === ' ') {
    spaces += 1
    cursor += 1
  }
  const marker = source[cursor]
  if (marker !== '`' && marker !== '~') return null
  let length = 0
  while (source[cursor] === marker) {
    length += 1
    cursor += 1
  }
  if (length < 3) return null
  while (cursor < source.length && source[cursor] !== '\n' && source[cursor] !== '\r') {
    cursor += 1
  }
  return { marker, length, next: cursor }
}

function matchFenceClose(
  source: string,
  index: number,
  fence: { marker: '`' | '~'; length: number }
): number | null {
  let cursor = index
  let spaces = 0
  while (spaces < 3 && source[cursor] === ' ') {
    spaces += 1
    cursor += 1
  }
  let length = 0
  while (source[cursor] === fence.marker) {
    length += 1
    cursor += 1
  }
  if (length < fence.length) return null
  while (source[cursor] === ' ' || source[cursor] === '\t') cursor += 1
  if (cursor < source.length && source[cursor] !== '\n' && source[cursor] !== '\r') return null
  return cursor
}

function countBackticks(source: string, index: number): number {
  let length = 0
  while (source[index + length] === '`') length += 1
  return length
}

function expandCommentRemoval(
  source: string,
  start: number,
  end: number
): { start: number; end: number } {
  let lineStart = start
  while (lineStart > 0 && source[lineStart - 1] !== '\n') lineStart -= 1

  let after = end
  while (after < source.length && source[after] !== '\n' && source[after] !== '\r') after += 1

  const before = source.slice(lineStart, start)
  const rest = source.slice(end, after)
  if (before.trim() !== '' || rest.trim() !== '') return { start, end }

  if (source[after] === '\r') after += 1
  if (source[after] === '\n') after += 1
  return { start: lineStart, end: after }
}

/**
 * Drops HTML comments from a block that Milkdown will parse as normal Markdown.
 * Fenced and inline code keep their `<!-- -->` bytes.
 */
export function stripHtmlCommentsOutsideCode(source: string): string {
  if (!source.includes(COMMENT_OPEN)) return source

  const ranges: Array<{ start: number; end: number }> = []
  let index = 0
  let fence: { marker: '`' | '~'; length: number } | null = null
  let inlineTicks = 0

  while (index < source.length) {
    if (fence) {
      if (atLineStart(source, index)) {
        const close = matchFenceClose(source, index, fence)
        if (close != null) {
          index = close
          fence = null
          continue
        }
      }
      index += 1
      continue
    }

    if (inlineTicks > 0) {
      if (countBackticks(source, index) === inlineTicks) {
        index += inlineTicks
        inlineTicks = 0
        continue
      }
      index += 1
      continue
    }

    if (atLineStart(source, index)) {
      const open = matchFenceOpen(source, index)
      if (open) {
        fence = { marker: open.marker, length: open.length }
        index = open.next
        continue
      }
    }

    const ticks = countBackticks(source, index)
    if (ticks > 0) {
      inlineTicks = ticks
      index += ticks
      continue
    }

    if (source.startsWith(COMMENT_OPEN, index)) {
      const close = source.indexOf(COMMENT_CLOSE, index + COMMENT_OPEN.length)
      if (close < 0) break
      ranges.push(expandCommentRemoval(source, index, close + COMMENT_CLOSE.length))
      index = close + COMMENT_CLOSE.length
      continue
    }

    index += 1
  }

  if (ranges.length === 0) return source

  let result = ''
  let cursor = 0
  for (const range of ranges) {
    if (range.start < cursor) continue
    result += source.slice(cursor, range.start)
    cursor = range.end
  }
  return result + source.slice(cursor)
}

function fenceLanguage(source: string): string {
  // Only the opening fence line. `\s` must not eat the newline, or an unlabeled
  // fence whose first body line is `mindmap` / `mermaid` is misread as a diagram.
  return parseFencedCode(source).lang.toLowerCase()
}

function isDiagramFence(block: MarkdownSourceBlock): boolean {
  return block.kind === 'raw-fence' && DIAGRAM_LANGUAGES.has(fenceLanguage(block.source))
}

export function createProjectedRawBlockMarker(block: ProjectedRawBlock): string {
  return `<!--desk-raw-block:v1:${block.kind}:${block.hidden ? '1' : '0'}:${encodeBase64(block.source)}-->`
}

export function readProjectedRawBlockMarker(value: string): ProjectedRawBlock | null {
  const match = value.trim().match(MARKER)
  if (!match) return null
  try {
    return {
      kind: match[1] as ProjectedRawBlockKind,
      hidden: match[2] === '1',
      source: decodeBase64(match[3])
    }
  } catch {
    return null
  }
}

/**
 * Replaces only syntax that CommonMark cannot safely model with internal markers.
 * Fenced code is deliberately excluded so Crepe's normal code editor remains available.
 */
export function projectRawBlocksForMilkdown(
  source: string,
  options: { literalBlockIndexes?: ReadonlySet<number> } = {}
): string {
  const document = parseMarkdownSource(source)
  const replacements = new Map<string, string>()

  document.blocks.forEach((block, blockIndex) => {
    // 渲染忠实性机制：判为「不能忠实渲染」的块**按普通正文暴露**（行首块级记号加反斜杠），
    // 于是它在可视化视图里就是可选中/可编辑/可删除的普通内容，而不会被重新解析成容器。
    if (options.literalBlockIndexes?.has(blockIndex)) {
      replacements.set(block.id, escapeBlockSourceForLiteral(block.source))
      return
    }
    if (isDiagramFence(block)) {
      replacements.set(
        block.id,
        createProjectedRawBlockMarker({
          kind: 'raw-diagram',
          source: block.source,
          hidden: false
        })
      )
      return
    }
    // Leave standalone <br /> for Milkdown empty-paragraph round-trip; do not
    // project them as raw HTML cards.
    if (isStandaloneBreak(block)) return
    if (block.kind === 'raw-container' && isVisualCalloutSource(block.source)) {
      const parsed = parseContainerFences(block.source)
      const inner = parsed.body ? projectRawBlocksForMilkdown(`${parsed.body}\n`) : ''
      replacements.set(
        block.id,
        wrapProjectedCalloutBody(
          {
            calloutType: parsed.name as VisualCalloutType,
            title: parsed.title,
            openColons: parsed.openColons
          },
          inner
        )
      )
      return
    }
    if (shouldProjectBlock(block)) {
      const marker = createProjectedRawBlockMarker({
        kind: block.kind,
        source: block.source,
        // Frontmatter, reference definitions, and HTML comments are not visual
        // authoring. Hidden atoms keep bytes for reconcile without a source card.
        hidden:
          isRegionComment(block) ||
          isAuthorHtmlComment(block) ||
          block.kind === 'raw-frontmatter' ||
          block.kind === 'raw-reference-definition'
      })
      // Keep definitions in the parser input so reference usages still resolve. Remark consumes
      // them; the adjacent atom is what restores their exact source during serialization.
      replacements.set(
        block.id,
        block.kind === 'raw-reference-definition' ? `${block.source}\n${marker}` : marker
      )
      return
    }
    if (!NESTED_COMMENT_HOSTS.has(block.kind) || !block.source.includes(COMMENT_OPEN)) return
    const stripped = stripHtmlCommentsOutsideCode(block.source)
    if (stripped !== block.source) replacements.set(block.id, stripped)
  })

  return serializeMarkdownSource(document, replacements)
}

function rawBlockLabel(block: ProjectedRawBlock): string {
  if (block.kind === 'raw-frontmatter') return 'Frontmatter'
  if (block.kind === 'raw-generated-title') return '自动生成标题'
  if (block.kind === 'raw-generated-toc') return '自动生成目录'
  if (block.kind === 'raw-reference-definition') return '链接定义'
  if (block.kind === 'raw-diagram') {
    const lang = fenceLanguage(block.source)
    return lang ? `图表 · ${lang}` : '图表'
  }
  if (block.kind === 'table') return '表格 · HTML'
  if (block.kind === 'raw-container') {
    const name = block.source.match(/^ {0,3}:{3,}\s+([^\s]+)/)?.[1]
    return name ? `自定义容器 · ${name}` : '自定义容器'
  }
  if (block.kind === 'raw-component') {
    const name = block.source.match(/^ {0,3}<([A-Z][\w.-]*)/)?.[1]
    return name ? `组件 · ${name}` : '组件'
  }
  const tag = block.source.match(/^ {0,3}<\/?([a-z][\w.-]*)/)?.[1]
  return tag ? `HTML · ${tag}` : 'HTML'
}

function rawBlockPreview(source: string): string {
  const firstLine = source.split(/\r?\n/, 1)[0].trim()
  if (firstLine.length <= 96) return firstLine
  return `${firstLine.slice(0, 93)}…`
}

interface TocItem {
  level: number
  text: string
  href: string
}

function parseTocItems(source: string): TocItem[] {
  const items: TocItem[] = []
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^(\s*)- \[([^\]]+)\]\(#([^)]+)\)/)
    if (!match) continue
    const indent = [...match[1]].reduce((width, char) => width + (char === '\t' ? 2 : 1), 0)
    items.push({ level: Math.floor(indent / 2), text: match[2], href: `#${match[3]}` })
  }
  return items
}

function renderTocLevel(
  items: TocItem[],
  index: number,
  level: number,
  container: HTMLElement
): number {
  let cursor = index
  while (cursor < items.length) {
    const item = items[cursor]
    if (item.level < level) break

    const listItem = document.createElement('li')
    const anchor = document.createElement('a')
    anchor.textContent = item.text
    anchor.href = item.href
    anchor.className = 'desk-generated-toc__link'
    listItem.append(anchor)
    container.append(listItem)
    cursor += 1

    if (cursor < items.length && items[cursor].level > level) {
      const nested = document.createElement('ul')
      listItem.append(nested)
      cursor = renderTocLevel(items, cursor, level + 1, nested)
    }
  }
  return cursor
}

function renderGeneratedTitleNode(source: string): HTMLElement {
  const heading = document.createElement('h1')
  heading.className = 'desk-generated-title'
  heading.contentEditable = 'false'
  heading.setAttribute('data-title', '自动生成标题')

  const body = source.replace(/^ {0,3}#{1,6}[ \t]+/, '').trimEnd()
  const inlineLink = /\[([^\]]+)\]\(([^)\s]+)\)/g
  let lastIndex = 0
  for (const match of body.matchAll(inlineLink)) {
    const [, text, href] = match
    const linkStart = match.index ?? 0
    if (linkStart > lastIndex) {
      heading.append(document.createTextNode(body.slice(lastIndex, linkStart)))
    }
    if (/^(https?:|#)/i.test(href)) {
      const anchor = document.createElement('a')
      anchor.textContent = text
      anchor.href = href
      if (anchor.hostname.toLowerCase() === 'github.com') {
        anchor.setAttribute('data-tooltip', '在 Github 中打开')
      }
      heading.append(anchor)
    } else {
      heading.append(document.createTextNode(text))
    }
    lastIndex = linkStart + match[0].length
  }
  if (lastIndex < body.length) {
    heading.append(document.createTextNode(body.slice(lastIndex)))
  }
  return heading
}

function renderGeneratedTocNode(source: string): HTMLElement {
  const container = document.createElement('div')
  container.className = 'desk-generated-toc'
  container.contentEditable = 'false'
  container.setAttribute('data-title', '自动生成目录')

  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'desk-generated-toc__toggle'
  toggle.setAttribute('aria-expanded', 'true')
  toggle.setAttribute('aria-label', '折叠目录')
  const toggleLabel = document.createElement('span')
  toggleLabel.className = 'desk-generated-toc__toggle-label'
  toggleLabel.textContent = '目录'
  const toggleIcon = document.createElement('span')
  toggleIcon.className = 'desk-generated-toc__toggle-icon'
  toggleIcon.setAttribute('aria-hidden', 'true')
  toggle.append(toggleIcon, toggleLabel)

  const list = document.createElement('ul')
  list.className = 'desk-generated-toc__list'
  renderTocLevel(parseTocItems(source), 0, 0, list)

  toggle.addEventListener('click', (event) => {
    event.stopPropagation()
    const collapsed = container.classList.toggle('is-collapsed')
    toggle.setAttribute('aria-expanded', String(!collapsed))
    toggle.setAttribute('aria-label', collapsed ? '展开目录' : '折叠目录')
  })

  container.append(toggle, list)
  return container
}

/**
 * Builds the DOM that backs a projected raw-block atom. `raw-container` renders
 * its enclosed markdown as a faithful read-only container; every
 * other kind keeps the immutable source-card presentation. `resolveImage` lets
 * the hosting editor rewrite note-local relative image paths; when omitted
 * relative paths are dropped defensively.
 */
export function renderDeskRawBlockElement(
  block: ProjectedRawBlock,
  resolveImage?: ResolveImage
): HTMLElement {
  if (block.kind === 'raw-diagram' && !block.hidden) {
    const wrapper = document.createElement('div')
    wrapper.dataset.type = 'desk-raw-block'
    wrapper.dataset.kind = 'raw-diagram'
    wrapper.dataset.source = encodeBase64(block.source)
    wrapper.dataset.hidden = 'false'
    wrapper.contentEditable = 'false'
    const fence = parseFencedCode(block.source)
    wrapper.className =
      fence.lang === 'mermaid'
        ? 'desk-raw-block desk-raw-block--mermaid'
        : fence.lang === 'mindmap'
          ? 'desk-raw-block desk-raw-block--mindmap'
          : 'desk-raw-block desk-raw-block--diagram'
    if (fence.lang !== 'mermaid' && fence.lang !== 'mindmap') {
      const diagram = document.createElement('div')
      diagram.className = 'desk-diagram'
      wrapper.append(diagram)
    }
    return wrapper
  }
  if (block.kind === 'raw-container' && !block.hidden) {
    const container = renderContainerFromSource(block.source, resolveImage)
    const wrapper = document.createElement('div')
    wrapper.dataset.type = 'desk-raw-block'
    wrapper.dataset.kind = 'raw-container'
    wrapper.dataset.source = encodeBase64(block.source)
    wrapper.dataset.hidden = 'false'
    wrapper.contentEditable = 'false'
    wrapper.className = 'desk-raw-block desk-raw-block--container'
    wrapper.append(container)
    return wrapper
  }
  if (block.kind === 'raw-generated-title') {
    const rendered = renderGeneratedTitleNode(block.source)
    rendered.dataset.type = 'desk-raw-block'
    rendered.dataset.kind = block.kind
    rendered.dataset.source = encodeBase64(block.source)
    rendered.dataset.hidden = 'false'
    return rendered
  }
  if (block.kind === 'raw-generated-toc') {
    const rendered = renderGeneratedTocNode(block.source)
    rendered.dataset.type = 'desk-raw-block'
    rendered.dataset.kind = block.kind
    rendered.dataset.source = encodeBase64(block.source)
    rendered.dataset.hidden = 'false'
    return rendered
  }
  const element = document.createElement('div')
  element.dataset.type = 'desk-raw-block'
  element.dataset.kind = block.kind
  element.dataset.source = encodeBase64(block.source)
  element.dataset.hidden = String(block.hidden)
  element.contentEditable = 'false'
  element.title = '当前版本请在源码视图中编辑此内容'

  if (block.hidden) {
    element.className = 'desk-raw-block desk-raw-block--hidden'
    element.setAttribute('aria-hidden', 'true')
    return element
  }

  element.className = 'desk-raw-block'
  const label = document.createElement('span')
  label.className = 'desk-raw-block__label'
  label.textContent = rawBlockLabel(block)
  const preview = document.createElement('code')
  preview.className = 'desk-raw-block__preview'
  preview.textContent = rawBlockPreview(block.source)
  element.append(label, preview)
  return element
}

function replaceProjectionMarkers(node: ProjectionMarkdownNode): void {
  if (!node.children) return

  node.children = node.children.map((child) => {
    // Crepe's remark-math transformer creates a positionless `code` node with this exact
    // language. Preserve that provenance before the ProseMirror code-block model flattens it.
    if (child.type === 'code' && child.lang === 'LaTeX' && !child.position) {
      child.deskMathSource = true
    }
    const direct = child.type === 'html' ? readProjectedRawBlockMarker(child.value ?? '') : null
    if (direct) return { type: 'deskRawBlock', ...direct }

    const paragraphChild = child.type === 'paragraph' ? child.children?.[0] : undefined
    const paragraph =
      child.type === 'paragraph' && child.children?.length === 1 && paragraphChild?.type === 'html'
        ? readProjectedRawBlockMarker(paragraphChild.value ?? '')
        : null
    if (paragraph) return { type: 'deskRawBlock', ...paragraph }

    replaceProjectionMarkers(child)
    return child
  })
}

export const rawBlockProjectionRemark = $remark('deskRawBlockProjection', () => () => (tree) => {
  replaceProjectionMarkers(tree as ProjectionMarkdownNode)
})

export const rawBlockSchema = $nodeSchema('deskRawBlock', () => ({
  atom: true,
  group: 'block',
  isolating: true,
  // NodeSelection is required for keyboard selection, clipboard operations and
  // Milkdown's block drag provider. The previous `false` made the node view's
  // selectNode hook unreachable and was the shared cause of BUG2/BUG3.
  selectable: true,
  attrs: {
    kind: { default: 'html', validate: 'string' },
    source: { default: '', validate: 'string' },
    hidden: { default: false, validate: 'boolean' }
  },
  parseDOM: [
    {
      tag: 'div[data-type="desk-raw-block"]',
      getAttrs: (dom) => {
        const source = dom.dataset.source
        if (!source) return false
        try {
          return {
            kind: dom.dataset.kind ?? 'html',
            source: decodeBase64(source),
            hidden: dom.dataset.hidden === 'true'
          }
        } catch {
          return false
        }
      }
    }
  ],
  toDOM: (node) => {
    const block: ProjectedRawBlock = {
      kind: node.attrs.kind,
      source: node.attrs.source,
      hidden: node.attrs.hidden
    }
    return renderDeskRawBlockElement(block)
  },
  parseMarkdown: {
    match: (node) => node.type === 'deskRawBlock',
    runner: (state, node, type) => {
      state.addNode(type, {
        kind: node.kind,
        source: node.source,
        hidden: node.hidden
      })
    }
  },
  toMarkdown: {
    match: (node) => node.type.name === 'deskRawBlock',
    runner: (state, node) => {
      state.addNode('html', undefined, node.attrs.source)
    }
  }
}))

/**
 * Crepe normally serializes every `latex` fence as `$$` math. We retain provenance from its
 * remark-math transform so authored fences use the base code serializer while genuine math
 * nodes and freshly inserted `LaTeX` formula nodes still serialize as `$$`.
 */
export const sourcePreservingCodeBlockSchema = codeBlockSchema.extendSchema((base) => (ctx) => {
  const schema = base(ctx)
  return {
    ...schema,
    attrs: {
      ...schema.attrs,
      deskMathSource: { default: null },
      title: { default: '' },
      /** Encoded fence highlight ranges, e.g. `{1-3,7}` or `''`. */
      highlights: { default: '' },
      /** `:line-numbers`, `:line-numbers=30`, `:no-line-numbers`, or empty. */
      lineNumbers: { default: '' }
    },
    parseMarkdown: {
      match: schema.parseMarkdown.match,
      runner: (state, node, type) => {
        const meta = typeof node.meta === 'string' ? node.meta : ''
        const rawLanguage = String(node.lang ?? '')
        const combinedInfo = `${rawLanguage} ${meta}`.trim()
        state.openNode(type, {
          language: rawLanguage.replace(/:(?:no-)?line-numbers(?:=\d+)?\b/, ''),
          title: parseFenceTitleFromMeta(meta),
          highlights: encodeHighlightsAttr(parseHighlightRanges(meta)),
          lineNumbers: parseFenceLineNumbers(combinedInfo),
          deskMathSource: node.deskMathSource === true
        })
        if (typeof node.value === 'string' && node.value) state.addText(node.value)
        state.closeNode()
      }
    },
    toMarkdown: {
      match: schema.toMarkdown.match,
      runner: (state, node) => {
        const isMathSource =
          node.attrs.deskMathSource === true ||
          (node.attrs.deskMathSource == null && node.attrs.language === 'LaTeX')
        if (isMathSource) {
          state.addNode('math', undefined, node.content.firstChild?.text ?? '')
          return
        }
        const language = String(node.attrs.language ?? '')
        const title = String(node.attrs.title ?? '').trim()
        const highlights = decodeHighlightsAttr(String(node.attrs.highlights ?? ''))
        const lineNumbers = String(node.attrs.lineNumbers ?? '')
        const value = node.content.firstChild?.text ?? ''
        const info = buildFenceInfo(language, highlights, title, lineNumbers)
        // remark code node: lang is first token; meta is the rest.
        const langMatch = info.match(/^(\S+)(?:\s+([\s\S]*))?$/)
        const lang = langMatch?.[1] ?? language
        const meta = (langMatch?.[2] ?? '').trim()
        state.addNode('code', undefined, value, {
          lang,
          ...(meta ? { meta } : {})
        })
      }
    }
  }
})

const MUTABLE_RAW_KINDS = new Set(['raw-container', 'raw-component', 'raw-diagram'])

export function isHiddenRawBlock(node: {
  type: { name: string }
  attrs: Record<string, unknown>
}): boolean {
  return node.type.name === 'deskRawBlock' && node.attrs.hidden === true
}

/** Locked cards (frontmatter, generated TOC, …) cannot be deleted in-place. */
export function isImmutableRawBlock(node: {
  type: { name: string }
  attrs: Record<string, unknown>
}): boolean {
  if (node.type.name !== 'deskRawBlock') return false
  if (MUTABLE_RAW_KINDS.has(String(node.attrs.kind))) return false
  // Author comments are hidden so they do not steal visual interaction, but they
  // must remain deletable (⌘A+Delete, or deleting the surrounding visible range).
  if (node.attrs.kind === 'html' && isAuthorHtmlCommentSource(String(node.attrs.source ?? ''))) {
    return false
  }
  return true
}

function rawBlockSignatures(document: {
  descendants(
    visitor: (node: { type: { name: string }; attrs: Record<string, unknown> }) => void
  ): void
}): string[] {
  const signatures: string[] = []
  document.descendants((node) => {
    if (!isImmutableRawBlock(node)) return
    signatures.push(
      `${String(node.attrs.kind)}\u0000${String(node.attrs.hidden)}\u0000${String(node.attrs.source)}`
    )
  })
  return signatures
}

/**
 * Immutable raw cards (everything except the raw kinds with a source editor)
 * stay byte-faithful until their dedicated visual interactions are implemented:
 * their signature must be preserved identically across a transaction.
 * Adding new cards (e.g. via the slash menu) is allowed — only mutations of
 * existing non-container cards, or deletions, are rejected.
 */
export const immutableRawBlockPlugin = $prose(
  () =>
    new Plugin({
      filterTransaction: (transaction, state) => {
        if (!transaction.docChanged) return true
        const before = rawBlockSignatures(state.doc)
        // Notes without locked atoms skip the after-walk entirely.
        if (before.length === 0) return true
        const after = rawBlockSignatures(transaction.doc)
        if (before.length > after.length) return false
        // Every pre-existing card signature must survive in order; new cards
        // are fine (they may be inserted anywhere, so a plain prefix check is
        // not enough — match each `before` signature into `after` in order).
        let cursor = 0
        for (const signature of before) {
          const index = after.indexOf(signature, cursor)
          if (index < 0) return false
          cursor = index + 1
        }
        return true
      }
    })
)

/** Reflect fence line-number meta onto Crepe's code-block DOM. */
export const codeLineNumberMetaPlugin = $prose(
  () =>
    new Plugin({
      props: {
        decorations(state) {
          const decorations: Decoration[] = []
          state.doc.descendants((node, position) => {
            if (node.type.name !== 'code_block') return
            const meta = String(node.attrs.lineNumbers ?? '')
            if (meta === ':no-line-numbers') {
              decorations.push(
                Decoration.node(position, position + node.nodeSize, {
                  class: 'desk-code-no-line-numbers'
                })
              )
              return
            }
            const start = Number(meta.match(/:line-numbers=(\d+)/)?.[1] ?? 1)
            if (start > 1) {
              decorations.push(
                Decoration.node(position, position + node.nodeSize, {
                  class: 'desk-code-custom-line-start',
                  style: `--desk-code-line-start: ${start - 1}`
                })
              )
            }
          })
          return DecorationSet.create(state.doc, decorations)
        }
      }
    })
)

function parseInlineBadge(
  source: string
): { text: string; type: 'info' | 'tip' | 'warning' | 'danger' } | null {
  if (!/^<Badge\b[^>]*\/?>(?:<\/Badge>)?$/i.test(source.trim())) return null
  const template = document.createElement('template')
  template.innerHTML = source.trim()
  const element = template.content.firstElementChild
  if (!element || element.tagName.toLowerCase() !== 'badge') return null
  const requested = element.getAttribute('type')?.toLowerCase() ?? 'info'
  const type = ['info', 'tip', 'warning', 'danger'].includes(requested)
    ? (requested as 'info' | 'tip' | 'warning' | 'danger')
    : 'info'
  return { text: element.getAttribute('text') ?? element.textContent ?? '', type }
}

/** Render the low-frequency inline `<Badge>` syntax without changing its Markdown bytes. */
export const inlineBadgePlugin = $prose(
  () =>
    new Plugin({
      props: {
        nodeViews: {
          html(node) {
            const source = String(node.attrs.value ?? '')
            const badge = parseInlineBadge(source)
            const dom = document.createElement('span')
            dom.dataset.value = source
            dom.dataset.type = 'html'
            dom.contentEditable = 'false'
            if (!badge) {
              dom.textContent = source
              return { dom }
            }
            dom.className = 'desk-inline-badge'
            const app = createApp({ render: () => h(Badge, badge) })
            app.mount(dom)
            return { dom, destroy: () => app.unmount() }
          }
        }
      }
    })
)

export const rawBlockProjectionPlugins: MilkdownPlugin[] = [
  ...rawBlockProjectionRemark,
  ...deskCalloutRemark,
  ...rawBlockSchema,
  ...deskCalloutSchema,
  ...sourcePreservingCodeBlockSchema,
  immutableRawBlockPlugin,
  codeLineNumberMetaPlugin,
  inlineBadgePlugin
]
