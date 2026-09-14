/**
 * 画布图片（`![](./assets/0013-x.svg)`）的跨笔记复制。
 *
 * 复制走 ProseMirror 默认路径（就是一段 markdown），这里只在**粘贴到别的笔记**时
 * 拦一次：把 `.excalidraw` 复制成目标笔记编号的新文件，再按新内容重新导出同名的
 * `.svg`，最后把插入的引用改成新路径。规则见 `canvasImageRefs.ts`。
 *
 * 为什么重新导出而不是直接拷 `.svg`：派生图必须与源画布一致，而源库里的那张
 * 有可能是旧的（导出是节流的）；顺手也保证两边的字体都已内联。
 */
import { Fragment } from '@milkdown/kit/prose/model'
import { closeHistory } from '@milkdown/kit/prose/history'
import { Plugin, TextSelection } from '@milkdown/kit/prose/state'
import type { EditorState } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'
import { serializeImageMarkdown } from '@tnotesjs/ui/image-markdown'

import type { MilkdownPlugin } from '@milkdown/kit/ctx'

import { exportCanvasSvg } from '../editor/excalidraw/canvasImage'
import { flushExcalidrawSessions } from '../editor/excalidraw/sessionRegistry'
import { useWorkspaceStore } from '../stores/workspace'
import { noteRelativeAssetPath, resolveNoteAssetRelPath } from './noteAssetPath'
import {
  canvasSvgRefsInHtml,
  canvasSvgRefsInText,
  mergeCanvasRefs,
  needsCanvasCopy,
  sourceRelPathForSvg,
  type CanvasImageRef
} from '../editor/markdown/canvasImageRefs'

export interface CanvasImageClipboardDeps {
  knowledgeBaseId: () => string
  noteUuid: () => string
  noteIndex: () => string
  noteRelPath: () => string
  isEffectivelyReadOnly: () => boolean
}

/** 从选中的图片节点里挑出画布引用（把图片按 markdown 序列化后复用同一套解析） */
export function canvasRefsInSelection(
  state: EditorState,
  resolveRelPath: (rawPath: string) => string | null
): CanvasImageRef[] {
  const markdown: string[] = []
  state.doc.nodesBetween(state.selection.from, state.selection.to, (node) => {
    if (node.type.name !== 'image') return
    markdown.push(
      serializeImageMarkdown({
        alt: String(node.attrs.alt ?? ''),
        src: String(node.attrs.src ?? ''),
        width: String(node.attrs.width ?? ''),
        align: String(node.attrs.align ?? 'left') as 'left' | 'center' | 'right'
      })
    )
  })
  const refs = canvasSvgRefsInText(markdown.join('\n'), resolveRelPath)
  return refs
}

/** 复制一份画布并在目标笔记里重新导出派生图；返回新的 `.svg` KB 相对路径 */
async function copyCanvasPair(input: {
  knowledgeBaseId: string
  noteUuid: string
  sourceRelPath: string
}): Promise<string | null> {
  const copied = await window.desk.excalidraw.copy({
    knowledgeBaseId: input.knowledgeBaseId,
    fromRelPath: input.sourceRelPath,
    toNoteUuid: input.noteUuid
  })
  if (!copied.ok) return null
  const read = await window.desk.excalidraw.read({
    knowledgeBaseId: input.knowledgeBaseId,
    relPath: copied.value.relPath
  })
  if (!read.ok || !read.value.valid) return null
  let svg: string
  try {
    svg = await exportCanvasSvg(read.value.content)
  } catch {
    // 空画布复制过去只剩源文件：引用指向一张还不存在的派生图，先按失败处理
    return null
  }
  const derived = await window.desk.excalidraw.writeDerived({
    knowledgeBaseId: input.knowledgeBaseId,
    sourceRelPath: copied.value.relPath,
    content: svg
  })
  return derived.ok ? derived.value.relPath : null
}

function insertImages(
  view: EditorView,
  images: Array<{ src: string; alt: string; width: string; align: string }>
): boolean {
  const schema = view.state.schema
  const image = schema.nodes.image
  if (!image || images.length === 0) return false
  const nodes = images.map((entry) =>
    image.create({
      src: entry.src,
      alt: entry.alt,
      title: '',
      width: entry.width,
      align: entry.align
    })
  )
  const paragraph = schema.nodes.paragraph.create()
  const fragment = Fragment.fromArray([...nodes, paragraph])
  const tr = view.state.tr
  let caret = view.state.selection.from
  try {
    const $from = view.state.selection.$from
    const start = $from.before(1)
    const end = $from.after(1)
    const parentIsEmptyParagraph =
      $from.parent.type === schema.nodes.paragraph && $from.parent.content.size === 0
    if (parentIsEmptyParagraph) {
      tr.replaceWith(start, end, fragment)
      caret = start + 1
    } else {
      tr.insert(end, fragment)
      caret = end + 1
    }
  } catch {
    tr.insert(view.state.selection.from, fragment)
    caret = view.state.selection.from + 1
  }
  tr.setSelection(TextSelection.near(tr.doc.resolve(Math.min(caret, tr.doc.content.size))))
  closeHistory(tr)
  view.dispatch(tr)
  view.focus()
  return true
}

/** 粘贴处理：只处理「解析得出、且归属不是本笔记」的画布引用 */
async function applyCanvasImagePaste(
  view: EditorView,
  payload: { text: string; html: string },
  deps: CanvasImageClipboardDeps
): Promise<void> {
  const workspace = useWorkspaceStore()
  const noteRelPath = deps.noteRelPath()
  const targetIndex = deps.noteIndex()
  const resolveRelPath = (rawPath: string): string | null =>
    resolveNoteAssetRelPath(noteRelPath, rawPath)
  // 两条来源都要看：markdown 文本（纯文本粘贴）与富文本（同 App 内复制图片节点）
  const refs = mergeCanvasRefs(
    canvasSvgRefsInText(payload.text, resolveRelPath),
    canvasSvgRefsInHtml(payload.html, resolveRelPath)
  ).filter((ref) => needsCanvasCopy(ref, targetIndex))
  // 富文本里通常没有 alt（描述挂在 <img> 上，序列化后不一定保留）：
  // 复制单个图片节点时 text/plain 恰好就是描述，用它补回去，别把描述弄丢
  const textAlt = payload.text.trim()
  if (textAlt && !textAlt.includes('\n') && textAlt.length <= 120) {
    for (const ref of refs) if (!ref.alt) ref.alt = textAlt
  }
  if (refs.length === 0) return

  // 复制是异步的：先把默认粘贴压住，复制完再自己插入
  const results: Array<{ src: string; alt: string; width: string; align: string }> = []
  const copiedBySource = new Map<string, string>()
  for (const ref of refs) {
    let svgRelPath = copiedBySource.get(ref.sourceRelPath)
    if (!svgRelPath) {
      // 源画布可能还有没写完的内容：先冲刷，避免复制到过时版本
      await flushExcalidrawSessions(deps.knowledgeBaseId(), ref.sourceRelPath)
      const copied = await copyCanvasPair({
        knowledgeBaseId: deps.knowledgeBaseId(),
        noteUuid: deps.noteUuid(),
        sourceRelPath: ref.sourceRelPath
      })
      if (!copied) {
        workspace.error = `画布复制失败，已保留原引用：${ref.svgRelPath}`
        results.push({ src: ref.rawPath, alt: ref.alt, width: ref.width, align: ref.align })
        continue
      }
      svgRelPath = copied
      copiedBySource.set(ref.sourceRelPath, copied)
    }
    const relative = noteRelativeAssetPath(noteRelPath, svgRelPath) ?? svgRelPath
    results.push({ src: relative, alt: ref.alt, width: ref.width, align: ref.align })
  }

  if (!view.dom.isConnected) return
  insertImages(view, results)
  workspace.status = `已复制 ${refs.length} 张画布（资源随之拷贝，不与原笔记共享）`
}

export function createCanvasImageClipboardPlugin(deps: CanvasImageClipboardDeps): MilkdownPlugin {
  return $prose(
    () =>
      new Plugin({
        view: (view) => {
          // 粘贴挂 view.dom 捕获：要赶在 ProseMirror 默认粘贴之前决定是否接管
          const onPaste = (event: Event): void => {
            if (!(event instanceof ClipboardEvent) || !event.clipboardData) return
            if (deps.isEffectivelyReadOnly()) return
            const payload = {
              text: event.clipboardData.getData('text/plain'),
              html: event.clipboardData.getData('text/html')
            }
            if (!payload.text.includes('.svg') && !payload.html.includes('.svg')) return
            const noteRelPath = deps.noteRelPath()
            const resolveRelPath = (rawPath: string): string | null =>
              resolveNoteAssetRelPath(noteRelPath, rawPath)
            const needsCopy = mergeCanvasRefs(
              canvasSvgRefsInText(payload.text, resolveRelPath),
              canvasSvgRefsInHtml(payload.html, resolveRelPath)
            ).some((ref) => needsCanvasCopy(ref, deps.noteIndex()))
            if (!needsCopy) return
            event.preventDefault()
            event.stopPropagation()
            void applyCanvasImagePaste(view, payload, deps)
          }
          view.dom.addEventListener('paste', onPaste, true)
          return {
            destroy: () => {
              view.dom.removeEventListener('paste', onPaste, true)
            }
          }
        }
      }) as never
  )
}

/** 供单测使用 */
export const canvasSourceForSvgForTest = sourceRelPathForSvg
