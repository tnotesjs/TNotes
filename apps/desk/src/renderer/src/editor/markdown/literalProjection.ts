/**
 * 把「不能忠实渲染」的块按**普通正文**暴露出来。
 *
 * 为什么需要转义：`:::`、` ``` `、`- `、`#`、`|`、`<` 这些在 markdown 里是块级语法的开头，
 * 如果原样当正文，解析时又会被认成容器/围栏/列表/表格，用户就永远改不动它。
 * 这里只给**行首那个危险字符**加一个反斜杠（渲染出来还是原文，反斜杠不显示），
 * 于是它变成真正的普通段落：能选中、能编辑、能删除，行内格式（**加粗**、`代码`）保持自然。
 *
 * 只处理块级构造；行内构造故意不动 —— 目标是"让内容重新变成可编辑的普通内容"。
 */

interface EscapeRule {
  pattern: RegExp
  /** 组：1 = 行首缩进，2 = 需要转义的危险记号 */
  replace: (match: RegExpMatchArray) => string
}

const RULES: EscapeRule[] = [
  // 容器围栏 / 代码围栏
  { pattern: /^(\s*)(:{3,})/, replace: (m) => `${m[1]}\\${m[2]}` },
  { pattern: /^(\s*)(`{3,}|~{3,})/, replace: (m) => `${m[1]}\\${m[2]}` },
  // 标题
  { pattern: /^(\s*)(#{1,6})(?=\s|$)/, replace: (m) => `${m[1]}\\${m[2]}` },
  // 无序列表 / 有序列表
  { pattern: /^(\s*)([-+*])(?=\s)/, replace: (m) => `${m[1]}\\${m[2]}` },
  { pattern: /^(\s*)(\d{1,9}[.)])(?=\s)/, replace: (m) => `${m[1]}\\${m[2]}` },
  // 引用块
  { pattern: /^(\s*)(>)/, replace: (m) => `${m[1]}\\${m[2]}` },
  // 表格
  { pattern: /^(\s*)(\|)/, replace: (m) => `${m[1]}\\${m[2]}` },
  // HTML 块
  { pattern: /^(\s*)(<)/, replace: (m) => `${m[1]}\\${m[2]}` },
  // 分割线 / setext 下划线（整行只有 - * _ =）
  { pattern: /^(\s*)([-*_=])([-*_=\s]*)$/, replace: (m) => `${m[1]}\\${m[2]}${m[3]}` }
]

export function escapeLineForLiteral(line: string): string {
  for (const rule of RULES) {
    const match = line.match(rule.pattern)
    // 只改行首那一段，行余下部分原样保留
    if (match) return `${rule.replace(match)}${line.slice(match[0].length)}`
  }
  return line
}

/** 逐行转义，保留原有换行结构（空行照旧，段落边界由空行表达） */
export function escapeBlockSourceForLiteral(source: string): string {
  return source
    .split('\n')
    .map((line) => (line.trim() === '' ? line : escapeLineForLiteral(line)))
    .join('\n')
}

/**
 * 把整段降级内容做成**一个段落**：逐行转义后，用行内 `<br />` 连接。
 *
 * 为什么必须是一个块：写盘走 `reconcileMarkdownSource`，它靠「块数 + 块形」一一对应
 * 来回用原文字节。如果把这段拆成 N 个段落，原文 1 个块就会对不上 N 个段落，
 * 匹配退化后原块字节会被拼进别的块 → 保存守卫判定"内容会被写坏"→ 用户存不了盘
 * （实测：选中删除后提示无法保存）。一个块对回原来的块，映射就干净了。
 *
 * 空行也变成一个多余的 `<br />`（视觉上仍是空一行），因为它们不能真的留空 ——
 * 空行会把段落切断，就又不是一个块了。
 */
export function literalParagraphSourceFor(source: string): string {
  const lines = source.split('\n')
  while (lines.length > 0 && lines[lines.length - 1]!.trim() === '') lines.pop()
  return lines
    .map((line) => (line.trim() === '' ? '' : escapeLineForLiteral(line)))
    .join('<br />\n')
}

/**
 * 把文档节点还原成「带换行的文本」：硬换行算一个换行，图片还原成 markdown。
 * 供写盘时重建"转义逐行原文"用。
 */
export function literalTextFromNode(node: LiteralWalkableNode): string {
  let out = ''
  node.descendants((child) => {
    if (child.isText) {
      out += child.text ?? ''
      return false
    }
    if (child.type.name === 'hardbreak' || child.type.name === 'hard_break') {
      out += '\n'
      return false
    }
    if (child.type.name === 'image') {
      out += `![${String(child.attrs?.alt ?? '')}](${String(child.attrs?.src ?? '')})`
      return false
    }
    return true
  })
  return out
}

/** 结构化最小接口：只要能把节点树走一遍就够了（避免把 ProseMirror 类型引进来） */
export interface LiteralWalkableNode {
  isText: boolean
  text?: string | null
  type: { name: string }
  attrs?: Record<string, unknown>
  descendants: (fn: (node: LiteralWalkableNode) => boolean | void) => void
}

/** 把文档节点渲染成写盘要用的「转义逐行原文」；空内容返回 null（交给原逻辑） */
export function literalRegionSourceFor(node: LiteralWalkableNode): string | null {
  const text = literalTextFromNode(node)
  return text.trim() === '' ? null : escapeBlockSourceForLiteral(text)
}
