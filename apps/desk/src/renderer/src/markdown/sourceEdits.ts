/**
 * 源码视图的纯文本编辑操作。
 *
 * 这些逻辑原来长在 CodeMirror 的 dispatch 里；换成 Monaco 之后必须保持**逐字节相同**
 * 的结果（外部有 e2e 与用户习惯依赖它），所以抽成与编辑器无关的纯函数：
 * 输入「原文 + 选区 + 参数」，输出「新文本 + 新选区」。
 * 组件只负责把结果喂给编辑器，测试直接测这一层。
 */

export interface TextEdit {
  /** 替换后的完整文本 */
  text: string
  /** 真正替换 [from, to) 的那段文本（编辑器 executeEdits 用这个，不能用 text.slice） */
  insert: string
  /** 被替换的区间（左闭右开） */
  from: number
  to: number
  /** 编辑后应当设置的选区 */
  selectionFrom: number
  selectionTo: number
}

export function clampOffset(offset: number, length: number): number {
  if (!Number.isFinite(offset)) return 0
  return Math.max(0, Math.min(offset, length))
}

/** 行首偏移表：用于与 CodeMirror `lineAt` 一致地确定「某个偏移落在哪一行」 */
function lineStarts(text: string): number[] {
  const starts = [0]
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === '\n') starts.push(index + 1)
  }
  return starts
}

/** 与 CodeMirror `doc.lineAt(pos)` 同语义：`pos` 落在哪一行（含行尾换行符位置） */
function lineIndexAt(starts: number[], offset: number, length: number): number {
  const target = clampOffset(offset, length)
  let low = 0
  let high = starts.length - 1
  while (low < high) {
    const mid = Math.ceil((low + high) / 2)
    if (starts[mid] <= target) low = mid
    else high = mid - 1
  }
  return low
}

function lineEndAt(starts: number[], index: number, length: number): number {
  return index + 1 < starts.length ? starts[index + 1] - 1 : length
}

/** 在指定偏移插入文本；不给位置就用选区起点 */
export function insertTextEdit(
  text: string,
  insert: string,
  position?: number,
  selectionFrom = 0
): TextEdit {
  const at = clampOffset(position ?? selectionFrom, text.length)
  return {
    text: `${text.slice(0, at)}${insert}${text.slice(at)}`,
    insert,
    from: at,
    to: at,
    selectionFrom: at + insert.length,
    selectionTo: at + insert.length
  }
}

/** 行内包裹：没有选中就用占位文字，选中内容保持被选住 */
export function wrapSelectionEdit(
  text: string,
  from: number,
  to: number,
  prefix: string,
  suffix: string,
  placeholder = '文字'
): TextEdit {
  const start = clampOffset(Math.min(from, to), text.length)
  const end = clampOffset(Math.max(from, to), text.length)
  const selected = text.slice(start, end) || placeholder
  const inserted = `${prefix}${selected}${suffix}`
  return {
    text: `${text.slice(0, start)}${inserted}${text.slice(end)}`,
    insert: inserted,
    from: start,
    to: end,
    selectionFrom: start + prefix.length,
    selectionTo: start + prefix.length + selected.length
  }
}

/** 逐行加前缀（引用、列表等）：整段替换，保持整段被选住 */
export function prefixLinesEdit(text: string, from: number, to: number, prefix: string): TextEdit {
  const starts = lineStarts(text)
  const firstIndex = lineIndexAt(starts, Math.min(from, to), text.length)
  const lastIndex = lineIndexAt(starts, Math.max(from, to), text.length)
  const start = starts[firstIndex]
  const end = lineEndAt(starts, lastIndex, text.length)
  const source = text.slice(start, end)
  const inserted = source
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n')
  return {
    text: `${text.slice(0, start)}${inserted}${text.slice(end)}`,
    insert: inserted,
    from: start,
    to: end,
    selectionFrom: start,
    selectionTo: start + inserted.length
  }
}

/**
 * 行级前缀（标题 / 列表 / 引用）：先剥掉已有的块级标记再套新前缀。
 *
 * `1. ` 会按行号编成有序列表；空前缀表示「变成普通段落」。
 */
export function setLinePrefixEdit(
  text: string,
  from: number,
  to: number,
  prefix: string
): TextEdit {
  const starts = lineStarts(text)
  const firstIndex = lineIndexAt(starts, Math.min(from, to), text.length)
  const lastIndex = lineIndexAt(starts, Math.max(from, to), text.length)
  const start = starts[firstIndex]
  const end = lineEndAt(starts, lastIndex, text.length)
  const source = text.slice(start, end)
  const inserted = source
    .split('\n')
    .map((line, index) => {
      const content = line.replace(
        /^\s{0,3}(?:#{1,6}\s+|>\s+|(?:[-+*]|\d+[.)])\s+(?:\[[ xX]\]\s+)?)?/,
        ''
      )
      const resolvedPrefix = prefix === '1. ' ? `${index + 1}. ` : prefix
      return `${resolvedPrefix}${content}`
    })
    .join('\n')
  return {
    text: `${text.slice(0, start)}${inserted}${text.slice(end)}`,
    insert: inserted,
    from: start,
    to: end,
    selectionFrom: start,
    selectionTo: start + inserted.length
  }
}

/** 整篇替换（标题编号会用到）；保持光标在文档开头 */
export function replaceAllEdit(text: string, next: string): TextEdit {
  return {
    text: next,
    insert: next,
    from: 0,
    to: text.length,
    selectionFrom: 0,
    selectionTo: 0
  }
}
