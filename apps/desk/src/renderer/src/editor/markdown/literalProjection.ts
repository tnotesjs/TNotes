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
