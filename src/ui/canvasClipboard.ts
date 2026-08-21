import { cloneSubtree, parseMarkdown } from '@tnotesjs/mindmap-core'
import type { MindmapNode, MindmapSession } from '@tnotesjs/mindmap-core'

const LIST_LINE_RE = /^\s*[-*+]\s+/

function clipboardNodes(text: string): MindmapNode[] {
  const fragment = text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => {
      if (LIST_LINE_RE.test(line)) return line
      const match = /^(\s*)(.*)$/.exec(line)!
      return `${match[1]}- ${match[2]}`
    })
    .join('\n')
  if (!fragment) return []
  const parsed = parseMarkdown(`# _\n\n${fragment}\n`)
  if (!parsed.valid) return []
  return parsed.doc.root.children.map((node) => cloneSubtree(node))
}

/** 把剪贴板中的普通文字 / Markdown 列表作为当前主题后的同级子树插入。 */
export function pasteCanvasOutline(session: MindmapSession, anchorId: string, text: string): string[] {
  const nodes = clipboardNodes(text)
  const anchor = session.document.find(anchorId)
  if (!anchor || nodes.length === 0) return []
  const insertedIds: string[] = []
  session.transact((doc) => {
    const parent = anchor === session.focusRootNode ? anchor : (anchor.parent ?? session.focusRootNode)
    let index = anchor === session.focusRootNode ? parent.children.length : parent.children.indexOf(anchor) + 1
    for (const source of nodes) {
      const inserted = doc.addNode(parent, { ...source.content, image: source.content.image ? { ...source.content.image } : null }, index++)
      inserted.collapsed = source.collapsed
      for (const child of [...source.children]) doc.move(child, inserted, inserted.children.length)
      insertedIds.push(inserted.id)
    }
  })
  session.selectMany(insertedIds, insertedIds[insertedIds.length - 1] ?? null, insertedIds[0] ?? null)
  return insertedIds
}
