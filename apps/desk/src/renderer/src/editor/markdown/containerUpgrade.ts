/**
 * 懒升级：把用户**手写的容器语法**（当普通段落敲进去的）在合适时机变成真正的块。
 *
 * 为什么需要它：可视化视图里的打字只是普通文本编辑，markdown → 块的投影只在建文档时跑；
 * 所以用户敲 `::: tip T` … `:::` 不会立刻变成提示块（要切一次视图或重开笔记才生效）。
 * 这里在**光标离开这一段**时判定：若这几段合起来是一个**完整**的容器（开头 `::: 类型 标题`
 * + 结尾 `:::`），就只把这一段重新投影成容器节点 —— 不打断打字，也不会因为半个 `:::` 就变形。
 *
 * 只处理已知的提示块类型（tip/info/warning/danger）且**不含嵌套**，其余交给原有投影/降级链路。
 */

import type { Node as ProseNode } from '@milkdown/kit/prose/model'
import { Plugin } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'
import { TextSelection } from '@milkdown/kit/prose/state'

export interface ContainerLinesMatch {
  type: string
  title: string
  openColons: string
}

const CONTAINER_OPEN = /^ {0,3}(:{3,})[ \t]*(tip|info|warning|danger)\b[ \t]*(.*)$/i
const CONTAINER_CLOSE = /^ {0,3}:{3,}[ \t]*$/
const CONTAINER_ANY = /^ {0,3}:{3,}/

/** 这几行合起来是不是一个完整的提示块（纯函数，便于测试） */
export function matchContainerLines(lines: readonly string[]): ContainerLinesMatch | null {
  if (lines.length < 3) return null
  const open = lines[0]!.match(CONTAINER_OPEN)
  if (!open) return null
  if (!CONTAINER_CLOSE.test(lines[lines.length - 1]!)) return null
  for (let index = 1; index < lines.length - 1; index += 1) {
    // 中间还有围栏 → 嵌套或结构不简单，这里不升级
    if (CONTAINER_ANY.test(lines[index]!)) return null
  }
  return {
    type: (open[2] ?? '').toLowerCase(),
    title: (open[3] ?? '').trim(),
    openColons: open[1] ?? ':::'
  }
}

/** 把文档里的几段拼回 markdown（段与段之间空一行） */
export function containerMarkdownFor(lines: readonly string[]): string {
  return `${lines.join('\n\n')}\n`
}

interface ContainerRun {
  from: number
  to: number
  lines: string[]
}

/** 从某一段出发，向外找"开头行 + 结尾行"组成的那一段连续段落 */
export function findContainerRun(doc: ProseNode, index: number): ContainerRun | null {
  const child = (at: number): ProseNode | null =>
    at >= 0 && at < doc.childCount ? doc.child(at) : null
  const isParagraph = (node: ProseNode | null): boolean => node?.type.name === 'paragraph'
  if (!isParagraph(child(index))) return null

  let start = index
  for (let at = index; at >= 0 && index - at <= 40; at -= 1) {
    if (!isParagraph(child(at))) break
    if (CONTAINER_OPEN.test(child(at)!.textContent)) {
      start = at
      break
    }
  }
  if (start === index && !CONTAINER_OPEN.test(child(start)!.textContent)) return null

  let end = -1
  for (let at = start; at < doc.childCount && at - start <= 40; at += 1) {
    if (!isParagraph(child(at))) break
    if (at > start && CONTAINER_CLOSE.test(child(at)!.textContent)) {
      end = at
      break
    }
  }
  if (end < 0) return null

  const lines: string[] = []
  let from = -1
  let to = -1
  let offset = 0
  for (let at = 0; at <= end; at += 1) {
    const node = child(at)!
    if (at === start) from = offset
    if (at === end) to = offset + node.nodeSize
    if (at >= start) lines.push(node.textContent)
    offset += node.nodeSize
  }
  if (from < 0 || to < 0 || !matchContainerLines(lines)) return null
  return { from, to, lines }
}

export interface UpgradeResult {
  lines: string[]
  nodeType: string
}

/**
 * 把 index 所在的「完整容器段落段」替换成真正的容器节点。
 * parser 由调用方提供（Milkdown 的 parser + 我们的投影），返回解析后的文档节点。
 */
export function upgradeContainerAt(
  view: EditorView,
  parser: (markdown: string) => ProseNode,
  index: number
): UpgradeResult | null {
  const run = findContainerRun(view.state.doc, index)
  if (!run) return null
  const parsed = parser(containerMarkdownFor(run.lines))
  const nodes: ProseNode[] = []
  parsed.forEach((node) => nodes.push(node))
  if (nodes.length !== 1) return null
  const node = nodes[0]!
  if (node.type.name !== 'deskCallout') return null

  const tr = view.state.tr.replaceWith(run.from, run.to, node)
  const caret = Math.min(run.from + node.nodeSize - 1, tr.doc.content.size)
  tr.setSelection(TextSelection.near(tr.doc.resolve(caret), -1))
  tr.setMeta('addToHistory', true)
  view.dispatch(tr)
  return { lines: run.lines, nodeType: node.type.name }
}

/** 光标所在位置对应的顶层块下标；-1 表示不在顶层块内 */
export function topLevelBlockIndexAt(doc: ProseNode, pos: number): number {
  const target = Math.max(0, Math.min(pos, doc.content.size))
  let index = -1
  let offset = 0
  for (let at = 0; at < doc.childCount; at += 1) {
    const node = doc.child(at)!
    if (target >= offset && target <= offset + node.nodeSize) {
      index = at
      break
    }
    offset += node.nodeSize
  }
  return index
}

export interface ContainerUpgradeOptions {
  /** 懒解析：编辑器就绪后再取 parser */
  parser: () => ((markdown: string) => ProseNode) | null
  /** 升级成功时回调（用来记录这一段，避免保存守卫误判） */
  onUpgraded?: (result: UpgradeResult) => void
}

/**
 * 光标**离开**某一段时尝试升级。放在 queueMicrotask 里做，避免在 PM 的
 * 选区事务周期内再派发事务。
 */
export function createContainerUpgradePlugin(options: ContainerUpgradeOptions): Plugin {
  let lastIndex = -1
  return new Plugin({
    view(view) {
      lastIndex = topLevelBlockIndexAt(view.state.doc, view.state.selection.from)
      return {
        update: (nextView, previous) => {
          if (nextView.state.selection.eq(previous.selection)) return
          const current = topLevelBlockIndexAt(nextView.state.doc, nextView.state.selection.from)
          const previousIndex = lastIndex
          lastIndex = current
          if (previousIndex < 0 || previousIndex === current) return
          const parser = options.parser()
          if (!parser) return
          queueMicrotask(() => {
            if (nextView.isDestroyed) return
            if (previousIndex >= nextView.state.doc.childCount) return
            const result = upgradeContainerAt(nextView, parser, previousIndex)
            if (result) options.onUpgraded?.(result)
          })
        }
      }
    }
  })
}
