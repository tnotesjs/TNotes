/**
 * 行内 `<br>` 家族（`<br>` / `<br/>` / `<br />`）→ ProseMirror 硬换行。
 *
 * 背景：markdown 里的行内 `<br>` 以前会被静默丢掉——段落走正常 Milkdown 解析，
 * schema 里没有行内 html 节点；而表格一旦含 HTML 标签就整块隔离成 raw block
 * （`rawBlockProjection.ts`），于是单元格换行在可视化视图里既看不到也编不了。
 *
 * 这里的做法：
 * - 解析：把行内 html 且值为 `<br>` 家族的节点换成 mdast `break`，并把**原始拼写**
 *   记在 `data.deskHtmlBreak` 上；
 * - 序列化：带原始拼写的 `break` 原样写回（表格行不能换行，必须保持 `<br>` 形式）；
 *   其它 `break`（编辑器里 Shift+Enter 产生的）沿用 mdast-util-to-markdown 的默认行为。
 *
 * 注意：`mdast-util-to-markdown` 的 `exports` 只开放入口，深导入它的默认 handler 与
 * `patternInScope` 会被挡，所以下面按 2.1.0 的实现等价复刻（带出处注释），并保持行为一致。
 */

/** 行内 `<br>` 家族的 mdast 节点 type 名（与 `remark-stringify` 的 break 对齐）。 */
export const HTML_BREAK_TYPE = 'break'

/** 记录原始拼写的 data 字段名。 */
export const DESK_HTML_BREAK = 'deskHtmlBreak'

const HTML_BREAK_RE = /^<br\s*\/?>$/i

/** 允许出现行内节点的父节点类型：只有这些位置才把 html 节点当行内 `<br>` 处理。 */
const INLINE_PARENTS = new Set([
  'paragraph',
  'heading',
  'tableCell',
  'emphasis',
  'strong',
  'link',
  'delete',
  'footnoteDefinition'
])

interface MdastNode {
  type: string
  value?: string
  children?: MdastNode[]
  data?: Record<string, unknown>
  [key: string]: unknown
}

/** 自写的极简遍历：只走 children，避免为一个映射引入额外依赖。 */
function walkInlineHtml(
  node: MdastNode,
  replace: (parent: MdastNode, index: number) => void
): void {
  const children = node.children
  if (!Array.isArray(children)) return
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index]
    if (!child) continue
    if (
      child.type === 'html' &&
      typeof child.value === 'string' &&
      HTML_BREAK_RE.test(child.value.trim())
    ) {
      replace(node, index)
      continue
    }
    walkInlineHtml(child, replace)
  }
}

export function htmlBreakToHardBreak(tree: unknown): void {
  if (!tree || typeof tree !== 'object') return
  walkInlineHtml(tree as MdastNode, (parent, index) => {
    if (!INLINE_PARENTS.has(parent.type)) return
    const original = parent.children?.[index]
    if (!original) return
    parent.children![index] = {
      type: HTML_BREAK_TYPE,
      data: { [DESK_HTML_BREAK]: String(original.value) }
    }
  })
}

/** remark 插件：`ctx.update(remarkPluginsCtx, (list) => [...list, remarkHtmlBreakToBreak])`。 */
export function remarkHtmlBreakToBreak(): (tree: unknown) => void {
  return htmlBreakToHardBreak
}

/**
 * `pattern-in-scope`（mdast-util-to-markdown 2.1.0 `lib/util/pattern-in-scope.js` 的等价实现；
 * 该包 exports 只开放入口、也不在 desk 的可解析依赖里，所以这里用结构化类型而不是导入它）。
 * `stack` 里是 ConstructName 字符串。
 */
interface UnsafePattern {
  character?: string
  /** 库里的 ConstructName 是字面量联合；这里只关心「是否在栈里」，用 unknown 收口。 */
  inConstruct?: unknown
  notInConstruct?: unknown
}
function listInScope(stack: readonly string[], list: unknown, none: boolean): boolean {
  const names = typeof list === 'string' ? [list] : Array.isArray(list) ? list : []
  if (names.length === 0) return none
  return names.some((name) => typeof name === 'string' && stack.includes(name))
}

function patternInScope(stack: readonly string[], pattern: UnsafePattern): boolean {
  return (
    listInScope(stack, pattern.inConstruct, true) &&
    !listInScope(stack, pattern.notInConstruct, false)
  )
}

/**
 * 纯函数：决定一个硬换行在 markdown 里写成什么（便于单测）。
 * - 来自行内 `<br>` 的硬换行：写回原拼写（`<br/>` 保持 `<br/>`），表格里也合法；
 * - 其它硬换行：与 mdast-util-to-markdown 默认一致——换行不安全的构造（表格 / atx 标题等，
 *   由 `unsafe` 声明）退化成空格，否则写 `\` + 换行。
 */
export function breakMarkdown(
  data: Record<string, unknown> | undefined,
  stack: readonly string[],
  unsafe: readonly UnsafePattern[],
  before = ''
): string {
  const spelling = data?.[DESK_HTML_BREAK]
  if (typeof spelling === 'string' && spelling) return spelling
  for (const pattern of unsafe) {
    if (pattern.character === '\n' && patternInScope(stack, pattern)) {
      return /[ \t]/.test(before) ? '' : ' '
    }
  }
  return '\\\n'
}
