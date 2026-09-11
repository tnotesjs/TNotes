/**
 * 画布组件的剪贴板处理（计划 E7）。
 *
 * 复制：选中内容里有画布组件时，往剪贴板额外写一份带来源上下文的载荷
 * （知识库 / 笔记 / 每个组件的相对引用与解析结果），同时保留 PM 自己的
 * HTML/文本载荷，普通粘贴路径不受影响。
 *
 * 粘贴：
 * - 有本 App 载荷 → 按归属规则决定「沿用」还是「复制」；跨 KB 走「读源库 +
 *   在目标库创建」，同库走 `excalidraw.copy`；同一个源在一次粘贴里只复制一次
 * - 纯文本粘贴且整段就是若干组件行 → 同样检查归属并复制（代码围栏里的示例
 *   不是「整段都是组件」，因此不会被当成组件处理）
 * - 复制前先 flush 源画布会话，避免复制到过时的磁盘内容
 * - 撤销/重做只作用在这次插入的调用上；已复制的文件不会被删除
 */
import { Fragment } from '@milkdown/kit/prose/model'
import { closeHistory } from '@milkdown/kit/prose/history'
import { Plugin, TextSelection } from '@milkdown/kit/prose/state'
import type { EditorState, Transaction } from '@milkdown/kit/prose/state'
import type { EditorView } from '@milkdown/kit/prose/view'
import { $prose } from '@milkdown/kit/utils'

import type { MilkdownPlugin } from '@milkdown/kit/ctx'

import {
  buildExcalidrawSource,
  isExcalidrawSource,
  parseExcalidrawSource
} from '../editor/markdown/excalidrawComponent'
import {
  parseExcalidrawClipboardPayload,
  planExcalidrawPaste,
  recallExcalidrawClipboard,
  rememberExcalidrawClipboard,
  serializeExcalidrawClipboardPayload,
  type ExcalidrawClipboardEntry,
  type ExcalidrawPasteTarget
} from '../editor/markdown/excalidrawClipboard'
import { excalidrawOwnerIndex, noteIndexFromRelPath } from '../editor/markdown/excalidrawOwnership'
import { flushExcalidrawSessions } from '../editor/excalidraw/sessionRegistry'
import { useWorkspaceStore } from '../stores/workspace'
import { noteRelativeAssetPath, resolveNoteAssetRelPath } from './noteAssetPath'

export interface ExcalidrawClipboardDeps {
  knowledgeBaseId: () => string
  noteUuid: () => string
  noteIndex: () => string
  noteRelPath: () => string
  isEffectivelyReadOnly: () => boolean
}

interface RawBlockLike {
  type: { name: string }
  attrs: Record<string, unknown>
}

/** 选择范围内所有画布组件（按文档序）。 */
function selectedExcalidrawEntries(
  state: EditorState,
  noteRelPath: string
): ExcalidrawClipboardEntry[] {
  const entries: ExcalidrawClipboardEntry[] = []
  state.doc.nodesBetween(state.selection.from, state.selection.to, (node) => {
    const candidate = node as unknown as RawBlockLike
    if (candidate.type?.name !== 'deskRawBlock') return
    const source = String(candidate.attrs.source ?? '')
    if (!isExcalidrawSource(source)) return
    const parsed = parseExcalidrawSource(source)
    if (!parsed) return
    const relPath = resolveNoteAssetRelPath(noteRelPath, parsed.path)
    if (!relPath) return
    entries.push({ rawPath: parsed.path, relPath })
  })
  return entries
}

/** 纯文本粘贴：要求整段（每行）都是组件行，围栏示例/散文一律不当作组件。 */
function plainTextComponentPaths(text: string): string[] | null {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  if (lines.length === 0) return null
  const paths: string[] = []
  for (const line of lines) {
    if (!isExcalidrawSource(line)) return null
    const parsed = parseExcalidrawSource(line)
    if (!parsed) return null
    paths.push(parsed.path)
  }
  return paths
}

function insertSources(view: EditorView, sources: string[]): boolean {
  const schema = view.state.schema
  const rawBlock = schema.nodes.deskRawBlock
  if (!rawBlock || sources.length === 0) return false
  const blocks = sources.map((source) =>
    rawBlock.create({ kind: 'raw-component', source, hidden: false })
  )
  const paragraph = schema.nodes.paragraph.create()
  const fragment = Fragment.fromArray([...blocks, paragraph])
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
    // 选择不在根级块里：退化成在当前位置插入
    tr.insert(view.state.selection.from, fragment)
    caret = view.state.selection.from + 1
  }
  tr.setSelection(TextSelection.near(tr.doc.resolve(Math.min(caret, tr.doc.content.size))))
  // 每次粘贴都是独立的撤销分组：连续两次粘贴必须能各撤一次，
  // 不能被 prosemirror-history 的 500ms 相邻合并吞成一步
  closeHistory(tr)
  view.dispatch(tr)
  view.focus()
  return true
}

async function copyCanvas(input: {
  decision: ReturnType<typeof planExcalidrawPaste>[number]
  target: ExcalidrawPasteTarget
}): Promise<string | null> {
  const { decision, target } = input
  if (decision.kind !== 'copy') return null
  if (!decision.crossKnowledgeBase) {
    const copied = await window.desk.excalidraw.copy({
      knowledgeBaseId: target.knowledgeBaseId,
      fromRelPath: decision.source.relPath,
      toNoteUuid: target.noteUuid
    })
    return copied.ok ? copied.value.relPath : null
  }
  const source = await window.desk.excalidraw.read({
    knowledgeBaseId: decision.source.knowledgeBaseId,
    relPath: decision.source.relPath
  })
  if (!source.ok || !source.value.valid) return null
  const created = await window.desk.excalidraw.create({
    knowledgeBaseId: target.knowledgeBaseId,
    noteUuid: target.noteUuid,
    content: source.value.content
  })
  return created.ok ? created.value.relPath : null
}

async function applyClipboardPaste(
  view: EditorView,
  payloadText: string | null,
  plainPaths: string[] | null,
  deps: ExcalidrawClipboardDeps
): Promise<void> {
  const workspace = useWorkspaceStore()
  const target: ExcalidrawPasteTarget = {
    knowledgeBaseId: deps.knowledgeBaseId(),
    noteUuid: deps.noteUuid(),
    noteIndex: deps.noteIndex(),
    noteRelPath: deps.noteRelPath()
  }
  const sources: string[] = []
  const payload = parseExcalidrawClipboardPayload(payloadText)

  if (payload) {
    const decisions = planExcalidrawPaste({ payload, target })
    const copiedBySource = new Map<string, string>()
    for (const decision of decisions) {
      if (decision.kind === 'reuse') {
        sources.push(buildExcalidrawSource({ path: decision.rawPath }))
        continue
      }
      if (decision.kind === 'diagnostic') {
        workspace.error = decision.message
        sources.push(buildExcalidrawSource({ path: decision.entry.rawPath }))
        continue
      }
      let newRelPath = copiedBySource.get(decision.dedupeKey)
      if (!newRelPath) {
        // 复制前先把源画布写完，避免复制到过时内容
        await flushExcalidrawSessions(decision.source.knowledgeBaseId, decision.source.relPath)
        const copied = await copyCanvas({ decision, target })
        if (!copied) {
          workspace.error = `画布复制失败，已保留原引用：${decision.source.relPath}`
          sources.push(buildExcalidrawSource({ path: decision.entry.rawPath }))
          continue
        }
        newRelPath = copied
        copiedBySource.set(decision.dedupeKey, copied)
      }
      const relative = noteRelativeAssetPath(target.noteRelPath, newRelPath) ?? newRelPath
      sources.push(buildExcalidrawSource({ path: relative }))
    }
  } else if (plainPaths) {
    const targetIndex = target.noteIndex || (noteIndexFromRelPath(target.noteRelPath) ?? '')
    for (const rawPath of plainPaths) {
      const relPath = resolveNoteAssetRelPath(target.noteRelPath, rawPath)
      const owner = relPath ? excalidrawOwnerIndex(relPath) : null
      if (!relPath || !owner || !/^\d{4}$/.test(targetIndex) || owner === targetIndex) {
        // 解析不出来 / 没有归属信息：保留原文，交给卡片的归属诊断
        if (relPath && owner && !/^\d{4}$/.test(targetIndex)) {
          workspace.error = '当前笔记缺少四位编号，未复制画布（文件名归属需要它）'
        } else if (relPath && !owner) {
          workspace.error = `画布文件名缺少四位笔记编号前缀，未复制：${relPath}`
        }
        sources.push(buildExcalidrawSource({ path: rawPath }))
        continue
      }
      const read = await window.desk.excalidraw.read({
        knowledgeBaseId: target.knowledgeBaseId,
        relPath
      })
      if (!read.ok) {
        workspace.error = `跨笔记引用无法复制（源不存在或不可读），已保留原文：${relPath}`
        sources.push(buildExcalidrawSource({ path: rawPath }))
        continue
      }
      await flushExcalidrawSessions(target.knowledgeBaseId, relPath)
      const created = await window.desk.excalidraw.create({
        knowledgeBaseId: target.knowledgeBaseId,
        noteUuid: target.noteUuid,
        content: read.value.content
      })
      if (!created.ok) {
        workspace.error = `画布复制失败，已保留原引用：${relPath}`
        sources.push(buildExcalidrawSource({ path: rawPath }))
        continue
      }
      const relative = noteRelativeAssetPath(target.noteRelPath, created.value.relPath)
      sources.push(buildExcalidrawSource({ path: relative ?? created.value.relPath }))
    }
  }

  if (sources.length === 0) return
  if (!view.dom.isConnected) return
  insertSources(view, sources)
}

export function createExcalidrawClipboardPlugin(deps: ExcalidrawClipboardDeps): MilkdownPlugin {
  return $prose(
    () =>
      new Plugin({
        view: (view) => {
          // 拷贝挂 document 冒泡：ProseMirror 自己的 copy 处理器会先 clearData()，
          // 只有排在它之后写入的载荷才留得住；raw block 的 stopEvent 也不会影响
          // document 级监听。
          const onCopy = (event: Event): void => {
            if (!(event instanceof ClipboardEvent) || !event.clipboardData) return
            if (deps.isEffectivelyReadOnly()) return
            const target = event.target
            if (!(target instanceof Node) || !view.dom.contains(target)) return
            const entries = selectedExcalidrawEntries(view.state, deps.noteRelPath())
            if (entries.length === 0) return
            const sources = entries
              .map((entry) =>
                buildExcalidrawSource({ path: entry.rawPath, trailingNewline: false })
              )
              .join('\n')
            // raw block 的 stopEvent 会让 ProseMirror 跳过自己的 copy 处理器（事件目标在
            // 节点视图里），所以这里自己序列化并 preventDefault，否则浏览器默认动作会用
            // DOM 选区覆盖剪贴板内容，自定义文本留不住。
            const slice = view.state.selection.content()
            const serialized = view.serializeForClipboard(slice)
            const clipboardText = serialized.text ? `${serialized.text}\n${sources}` : sources
            event.clipboardData.setData('text/html', serialized.dom.innerHTML)
            event.clipboardData.setData('text/plain', clipboardText)
            event.preventDefault()
            rememberExcalidrawClipboard(clipboardText, {
              version: 1,
              knowledgeBaseId: deps.knowledgeBaseId(),
              noteUuid: deps.noteUuid(),
              noteRelPath: deps.noteRelPath(),
              noteIndex: deps.noteIndex(),
              entries
            })
          }
          // 粘贴挂 view.dom 捕获：要赶在 ProseMirror 默认粘贴之前 preventDefault
          const onPaste = (event: Event): void => {
            if (!(event instanceof ClipboardEvent) || !event.clipboardData) return
            if (deps.isEffectivelyReadOnly()) return
            const text = event.clipboardData.getData('text/plain')
            // 先看缓存（本 App 刚复制过同样一组组件 → 知道来源 KB/笔记）；
            // 缓存没有再要求「整段都是组件行」，避免把围栏示例当组件。
            const remembered = recallExcalidrawClipboard(text)
            const plainPaths = remembered ? null : plainTextComponentPaths(text)
            if (!remembered && !plainPaths) return
            event.preventDefault()
            event.stopPropagation()
            void applyClipboardPaste(
              view,
              remembered ? serializeExcalidrawClipboardPayload(remembered) : null,
              plainPaths,
              deps
            )
          }
          const ownerDocument = view.dom.ownerDocument
          ownerDocument.addEventListener('copy', onCopy)
          view.dom.addEventListener('paste', onPaste, true)
          return {
            destroy: () => {
              ownerDocument.removeEventListener('copy', onCopy)
              view.dom.removeEventListener('paste', onPaste, true)
            }
          }
        }
      }) as never
  )
}

/** 供单测使用：插入多个组件原子。 */
export function insertExcalidrawSourcesForTest(view: EditorView, sources: string[]): boolean {
  return insertSources(view, sources)
}

/** 供单测使用：解析纯文本组件粘贴。 */
export function plainTextComponentsForTest(text: string): string[] | null {
  return plainTextComponentPaths(text)
}

/** 供单测使用：读取选择范围内的组件。 */
export function selectedExcalidrawEntriesForTest(
  state: EditorState,
  noteRelPath: string
): ExcalidrawClipboardEntry[] {
  return selectedExcalidrawEntries(state, noteRelPath)
}

/** 供单测使用：事务类型（避免未使用导入告警）。 */
export type { Transaction }
