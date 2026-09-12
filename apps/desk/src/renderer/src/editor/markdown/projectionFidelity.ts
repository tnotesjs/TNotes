/**
 * 渲染忠实性判定（投影层）。
 *
 * 目的：回答「可视化结果是否忠实于磁盘原文」这一个问题，**不改数据、不写盘**。
 * 判定单位是顶层块：源码块与可视化序列化结果逐块对账，要求数量、顺序、内容三者守恒。
 *
 * 对账前会先把两侧一起过一遍「允许的规范化」（见 PROJECTION_CANONICALIZATIONS）。
 * 这份清单就是我们承诺支持的构造边界：清单之外的任何差异都判为不忠实，
 * 交给上层降级成「按原文保留」（外观是正文文字，底层逐字保留）。
 *
 * 白名单条目分两类（对账时一视同仁，区别只用于文档与后续策略）：
 * - 无损（lossy: false）：写法等价，信息没丢（围栏加长、`---`/`***`、转义写法…）
 * - 有损（lossy: true）：写法统一后无法还原（连续空行塌缩、CRLF→LF、表格重排…）
 */

import { parseMarkdownSource } from './sourcePreservation'

export type FidelityVerdict = 'faithful' | 'unfaithful'

export type FidelityReason = 'reordered' | 'absorbed' | 'lost' | 'extra' | 'content-changed'

export interface FidelityBlockResult {
  /** 源码块下标 */
  index: number
  kind: string
  verdict: FidelityVerdict
  reason?: FidelityReason
  /** 诊断用：被并进 / 多出来的块下标 */
  againstIndex?: number
  source: string
  canonical?: string
}

export interface FidelityReport {
  ok: boolean
  structureOk: boolean
  results: FidelityBlockResult[]
  /** 判为不忠实的块，供降级 / 守卫使用 */
  problematic: FidelityBlockResult[]
  sourceBlockCount: number
  canonicalBlockCount: number
}

interface Canonicalization {
  id: string
  /** 是否会丢信息（文档用；对账时两侧都应用） */
  lossy: boolean
  note: string
  apply: (markdown: string) => string
}

/* ------------------------------------------------------------------ *
 * 行扫描（围栏感知：围栏内的内容不参与文本级规范化）
 * ------------------------------------------------------------------ */

interface Line {
  text: string
  /** 在围栏 / 容器内部 */
  fenced: boolean
  /** 围栏 / 容器自身的边界行 */
  boundary: boolean
}

const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})(.*)$/
const FENCE_CLOSE = /^ {0,3}(`{3,}|~{3,})[ \t]*$/
const COLON_FENCE = /^ {0,3}(:{3,})(?:[ \t]*(.*))?$/

function scanLines(markdown: string): Line[] {
  const out: Line[] = []
  let fence: { marker: string; length: number } | null = null
  for (const text of markdown.split('\n')) {
    if (fence) {
      const close = text.match(FENCE_CLOSE)
      if (close && close[1]![0] === fence.marker && close[1]!.length >= fence.length) {
        fence = null
        out.push({ text, fenced: true, boundary: true })
      } else {
        out.push({ text, fenced: true, boundary: false })
      }
      continue
    }
    const open = text.match(FENCE_OPEN)
    if (open && (open[1]![0] !== '`' || !open[2]!.includes('`'))) {
      fence = { marker: open[1]![0]!, length: open[1]!.length }
      out.push({ text, fenced: true, boundary: true })
      continue
    }
    if (COLON_FENCE.test(text)) {
      out.push({ text, fenced: false, boundary: true })
      continue
    }
    out.push({ text, fenced: false, boundary: false })
  }
  return out
}

function mapUnfenced(markdown: string, fn: (text: string) => string): string {
  return scanLines(markdown)
    .map((line) => (line.fenced && !line.boundary ? line.text : fn(line.text)))
    .join('\n')
}

/* ------------------------------------------------------------------ *
 * 允许的规范化清单
 * ------------------------------------------------------------------ */

/** 分割线：`---` / `***` / `___` / `- - -` → `---` */
const THEMATIC_BREAK_LINE = /^ {0,3}((\*[ \t]*){3,}|(-[ \t]*){3,}|(_[ \t]*){3,})$/
/** 无序列表记号 */
const BULLET_LINE = /^(\s*)([*+-])[ \t]+/

function normalizeBullets(markdown: string): string {
  const out: string[] = []
  let previous: { indent: string; marker: string } | null = null
  for (const line of scanLines(markdown)) {
    const text = line.text
    const match = !line.fenced && !THEMATIC_BREAK_LINE.test(text) ? text.match(BULLET_LINE) : null
    if (!match) {
      if (!line.fenced || line.boundary) previous = null
      out.push(text)
      continue
    }
    const indent = match[1] ?? ''
    const marker = match[2] ?? ''
    // markdown 里「记号类型变了」= 新列表；源侧补一个空行，模拟序列化后的分块结果
    if (previous && previous.indent === indent && previous.marker !== marker) {
      if (out[out.length - 1] !== '') out.push('')
    }
    out.push(text.replace(BULLET_LINE, (_, pad: string) => `${pad}- `))
    previous = { indent, marker }
  }
  return out.join('\n')
}

function normalizeTables(markdown: string): string {
  const lines = scanLines(markdown)
  const out: string[] = []
  const isRow = (line: Line): boolean => !line.fenced && line.text.trim().startsWith('|')
  let index = 0
  while (index < lines.length) {
    const line = lines[index]!
    if (!isRow(line)) {
      out.push(line.text)
      index += 1
      continue
    }
    const rows: string[][] = []
    while (index < lines.length && isRow(lines[index]!)) {
      rows.push(
        lines[index]!.text.trim()
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((cell) => cell.trim())
      )
      index += 1
    }
    // 列数取整表最大值（两侧收敛到同一形状）；分隔行统一成 columns 个 ---，数据行补空但不截断
    const columns = Math.max(...rows.map((row) => row.length))
    const padded = rows.map((row) => {
      const next = [...row]
      while (next.length < columns) next.push('')
      return next
    })
    const isDelimiterRow = (row: string[]): boolean =>
      row.length > 0 && row.every((cell) => /^:?-{1,}:?$/.test(cell))
    if (rows.length > 1 && isDelimiterRow(rows[1]!)) {
      padded[1] = Array.from({ length: columns }, () => '---')
    }
    for (const row of padded) out.push(`| ${row.join(' | ')} |`)
  }
  return out.join('\n')
}

export const PROJECTION_CANONICALIZATIONS: Canonicalization[] = [
  {
    id: 'crlf',
    lossy: true,
    note: 'CRLF 统一为 LF',
    apply: (markdown) => markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  },
  {
    id: 'trailing-whitespace',
    lossy: true,
    note: '文件末尾多余空行去掉（行尾空格属于内容，这里不动）',
    apply: (markdown) => `${markdown.replace(/[\s\n]+$/, '')}\n`
  },
  {
    id: 'blank-runs',
    lossy: true,
    note: '连续空行塌成一个（围栏内不算）',
    apply: (markdown) => {
      const out: string[] = []
      let blank = 0
      for (const line of scanLines(markdown)) {
        if (!line.fenced && line.text.trim() === '') {
          blank += 1
          if (blank > 1) continue
          out.push('')
          continue
        }
        blank = 0
        out.push(line.text)
      }
      return out.join('\n')
    }
  },
  {
    id: 'thematic-break',
    lossy: false,
    note: '分割线统一写成 ---（`***`/`___`/`- - -` 都算同一条）',
    apply: (markdown) =>
      mapUnfenced(markdown, (text) => (THEMATIC_BREAK_LINE.test(text) ? '---' : text))
  },
  {
    id: 'bullet-marker',
    lossy: true,
    note: '无序列表统一用 -（记号类型变化处保留「新列表」的边界）',
    apply: normalizeBullets
  },
  {
    id: 'colon-fence-width',
    lossy: false,
    note: '容器围栏宽度按嵌套深度重写（::: / :::: 只是写法，嵌套关系不变）',
    apply: (markdown) => {
      const out: string[] = []
      let depth = 0
      for (const text of markdown.split('\n')) {
        const match = text.match(COLON_FENCE)
        if (!match) {
          out.push(text)
          continue
        }
        const body = (match[2] ?? '').trim()
        if (body) {
          depth += 1
          out.push(`${':'.repeat(depth + 2)} ${body}`)
        } else {
          out.push(':'.repeat(Math.max(depth + 2, 3)))
          depth = Math.max(0, depth - 1)
        }
      }
      return out.join('\n')
    }
  },
  {
    id: 'table-shape',
    lossy: true,
    note: '表格重排：单元格空格、列数补齐、分隔行写法统一',
    apply: normalizeTables
  },
  {
    id: 'escape',
    lossy: false,
    note: '转义写法等价：`\\[` 与 `[` 视为同一段文字',
    apply: (markdown) =>
      mapUnfenced(markdown, (text) =>
        text.replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, '$1')
      )
  },
  {
    id: 'frontmatter-id',
    lossy: false,
    note: '笔记 frontmatter 的 id 由 Desk 回填（手写笔记没有），对账时忽略该行',
    apply: (markdown) => {
      const match = markdown.match(/^---\n[\s\S]*?\n---/)
      if (!match) return markdown
      return match[0].replace(/^id:.*$/gm, '') + markdown.slice(match[0].length)
    }
  }
]

/** 把两侧一起过一遍允许的规范化（顺序固定，幂等）。 */
export function canonicalizeMarkdown(markdown: string): string {
  return PROJECTION_CANONICALIZATIONS.reduce((acc, step) => step.apply(acc), markdown)
}

/* ------------------------------------------------------------------ *
 * 判定
 * ------------------------------------------------------------------ */

/** 只由闭合标记组成的行（容器 `:::`、代码围栏），块尾的这些行属于结构不属于内容 */
const CLOSER_LINE = /^ {0,3}(:{3,}|`{3,}|~{3,})[ \t]*$/

function trimTrailingClosers(text: string): string {
  const lines = text.split('\n')
  let end = lines.length
  while (end > 0) {
    const line = lines[end - 1]!
    if (line.trim() === '' || CLOSER_LINE.test(line)) {
      end -= 1
      continue
    }
    break
  }
  return lines.slice(0, end).join('\n')
}

function comparableBlocks(markdown: string): string[] {
  return parseMarkdownSource(canonicalizeMarkdown(markdown)).blocks.map((block) =>
    trimTrailingClosers(block.source)
  )
}

/**
 * 源码 ↔ 可视化结果 逐块对账。
 *
 * - 内容在可视化结果里找不到独立归宿 → 被吞并（`absorbed`）或丢失（`lost`）
 * - 位置对不上但内容还在 → 顺序被改（`reordered`）
 * - 可视化结果多出来的块 → `extra`
 */
export function classifyProjectionFidelity(source: string, canonical: string): FidelityReport {
  const sourceBlocks = parseMarkdownSource(canonicalizeMarkdown(source)).blocks
  const canonicalBlocks = parseMarkdownSource(canonicalizeMarkdown(canonical)).blocks
  const sourceComparable = comparableBlocks(source)
  const canonicalComparable = comparableBlocks(canonical)
  const results: FidelityBlockResult[] = []

  sourceComparable.forEach((text, index) => {
    const block = sourceBlocks[index]!
    if (canonicalComparable[index] === text) {
      results.push({ index, kind: block.kind, verdict: 'faithful', source: block.source })
      return
    }
    const anywhere = canonicalComparable.indexOf(text)
    if (anywhere >= 0) {
      results.push({
        index,
        kind: block.kind,
        verdict: 'unfaithful',
        reason: 'reordered',
        againstIndex: anywhere,
        source: block.source,
        canonical: canonicalComparable[index]
      })
      return
    }
    // 同下标的块「自己长大」= 内容被改（content-changed）；只有内容跑到**别的**块里才算吞并
    const absorbed = canonicalComparable.findIndex(
      (other, otherIndex) => otherIndex !== index && other.includes(text)
    )
    if (absorbed >= 0) {
      results.push({
        index,
        kind: block.kind,
        verdict: 'unfaithful',
        reason: 'absorbed',
        againstIndex: absorbed,
        source: block.source,
        canonical: canonicalComparable[absorbed]
      })
      return
    }
    const partial = canonicalComparable.findIndex(
      (other) => other.length > 0 && text.includes(other)
    )
    if (partial >= 0) {
      results.push({
        index,
        kind: block.kind,
        verdict: 'unfaithful',
        reason: 'content-changed',
        againstIndex: partial,
        source: block.source,
        canonical: canonicalComparable[partial]
      })
      return
    }
    results.push({
      index,
      kind: block.kind,
      verdict: 'unfaithful',
      reason: 'lost',
      source: block.source,
      canonical: canonicalComparable[index]
    })
  })

  const extras: FidelityBlockResult[] = []
  for (let index = sourceComparable.length; index < canonicalComparable.length; index += 1) {
    extras.push({
      index,
      kind: canonicalBlocks[index]!.kind,
      verdict: 'unfaithful',
      reason: 'extra',
      source: canonicalBlocks[index]!.source
    })
  }

  const problematic = [...results.filter((item) => item.verdict === 'unfaithful'), ...extras]
  return {
    ok: problematic.length === 0 && sourceComparable.length === canonicalComparable.length,
    structureOk: sourceComparable.length === canonicalComparable.length,
    results,
    problematic,
    sourceBlockCount: sourceComparable.length,
    canonicalBlockCount: canonicalComparable.length
  }
}

/**
 * 保存守卫的「正向证据」判定：只挑出「内容被并进别的块」的源码块。
 *
 * 与 `classifyProjectionFidelity` 的区别：这里**不**把「块整段消失」当问题 ——
 * 那可能是用户主动删除；只有「内容还在、却没了独立归宿」才足以拒绝写盘。
 */
export function findAbsorbedBlocks(
  originalSource: string,
  canonical: string
): FidelityBlockResult[] {
  const sourceBlocks = parseMarkdownSource(canonicalizeMarkdown(originalSource)).blocks
  const sourceComparable = comparableBlocks(originalSource)
  const canonicalComparable = comparableBlocks(canonical)
  const findings: FidelityBlockResult[] = []

  sourceComparable.forEach((text, index) => {
    if (canonicalComparable.includes(text)) return
    const absorbed = canonicalComparable.findIndex(
      (other, otherIndex) => otherIndex !== index && other.includes(text)
    )
    if (absorbed < 0) return
    findings.push({
      index,
      kind: sourceBlocks[index]!.kind,
      verdict: 'unfaithful',
      reason: 'absorbed',
      againstIndex: absorbed,
      source: sourceBlocks[index]!.source,
      canonical: canonicalComparable[absorbed]
    })
  })
  return findings
}
