/**
 * Markdown → 思维导图文档。
 * 「文件即脑图」：只认第一个 H1 + 其后首个无序列表块，其余内容解析时忽略
 * （由 hasExtraContent 标记，回写时会被丢弃）。
 * 缩进宽容解析：2/4 空格、Tab 均可；列表项附属的缩进段落视为附属内容跳过。
 */

import { MindmapDocument } from '../model/document'
import type { MindmapNode } from '../model/document'
import { parseInline } from '../model/inline'

const H1_RE = /^#(?!#)\s+(\S.*)$/
const LIST_RE = /^(\s*)[-*+]\s+(.*)$/
const CHECK_RE = /^\[( |x|X)\]\s+(.*)$/

export interface ParseResult {
  doc: MindmapDocument
  /** 文件中存在 H1+列表块之外的非空内容（回写时会丢弃） */
  hasExtraContent: boolean
}

/** 前导空白换算为列宽：空格 1，Tab 2 */
function indentColumn(whitespace: string): number {
  let col = 0
  for (const ch of whitespace) {
    if (ch === ' ') col += 1
    else if (ch === '\t') col += 2
  }
  return col
}

export function parseMarkdown(md: string, fileName = '未命名'): ParseResult {
  const lines = md.split(/\r?\n/)

  let h1Index = -1
  let title = ''
  for (let i = 0; i < lines.length; i++) {
    const m = H1_RE.exec(lines[i])
    if (m) {
      h1Index = i
      title = m[1].trim()
      break
    }
  }

  const doc = new MindmapDocument(h1Index >= 0 ? title : fileName)

  const searchStart = h1Index >= 0 ? h1Index + 1 : 0
  let listStart = -1
  for (let i = searchStart; i < lines.length; i++) {
    if (LIST_RE.test(lines[i])) {
      listStart = i
      break
    }
  }

  const consumed = new Set<number>()
  if (h1Index >= 0) consumed.add(h1Index)

  if (listStart >= 0) {
    // stack[d] = 深度 d 的缩进列；depthNode[d] = 深度 d 最近一个节点
    const stack: number[] = []
    const depthNode: MindmapNode[] = []

    let i = listStart
    while (i < lines.length) {
      const line = lines[i]
      if (line.trim() === '') {
        consumed.add(i)
        i++
        continue
      }
      const m = LIST_RE.exec(line)
      if (!m) {
        if (/^\s/.test(line)) {
          // 列表项附属的缩进内容（段落/代码块等）：跳过，不进脑图
          i++
          continue
        }
        break
      }

      const col = indentColumn(m[1])
      let depth: number
      if (stack.length === 0) {
        stack.push(col)
        depth = 0
      } else if (col > stack[stack.length - 1]) {
        stack.push(col)
        depth = stack.length - 1
      } else {
        while (stack.length > 0 && stack[stack.length - 1] > col) stack.pop()
        if (stack.length === 0) {
          stack.push(col)
          depth = 0
        } else if (stack[stack.length - 1] === col) {
          depth = stack.length - 1
        } else {
          // 比当前层略深但未到下一级：视为下一层
          stack.push(col)
          depth = stack.length - 1
        }
      }

      let checked: boolean | null = null
      let contentRaw = m[2].trim()
      const cm = CHECK_RE.exec(contentRaw)
      if (cm) {
        checked = cm[1].toLowerCase() === 'x'
        contentRaw = cm[2].trim()
      }
      const content = parseInline(contentRaw)
      content.checked = checked

      const parent = depth === 0 ? doc.root : (depthNode[depth - 1] ?? doc.root)
      const node = doc.addNode(parent, content)
      depthNode.length = depth
      depthNode[depth] = node

      consumed.add(i)
      i++
    }
  }

  let hasExtraContent = false
  for (let i = 0; i < lines.length; i++) {
    if (consumed.has(i)) continue
    if (lines[i].trim() === '') continue
    hasExtraContent = true
    break
  }

  return { doc, hasExtraContent }
}
