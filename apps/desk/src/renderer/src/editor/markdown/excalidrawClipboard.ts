/**
 * 画布组件的剪贴板上下文与粘贴计划（计划 E7）。
 *
 * 归属规则：`.excalidraw` 的四位前缀是**主人**，组件是**使用状态**。
 * - 同笔记（前缀与目标笔记编号一致）粘贴：保持原文件，只按目标笔记目录
 *   重新计算相对引用
 * - 跨笔记 / 跨 KB 粘贴：按目标笔记编号复制一份新文件，再插入新引用；
 *   同一个源在一次粘贴里只复制一次（下次粘贴是独立副本，不建立跨笔记共享）
 * - 没有前缀 / 笔记没有编号 / 解析不出来：保留原文并给诊断，不猜目录
 */
import { excalidrawOwnerIndex, noteIndexFromRelPath } from './excalidrawOwnership'
import { noteRelativeAssetPath } from '../../markdown/noteAssetPath'

export const EXCALIDRAW_CLIPBOARD_MIME = 'application/x-tnotes-excalidraw'

export interface ExcalidrawClipboardEntry {
  /** 复制时组件里的相对引用原文 */
  rawPath: string
  /** 复制时解析出来的知识库相对路径 */
  relPath: string
}

export interface ExcalidrawClipboardPayload {
  version: 1
  knowledgeBaseId: string
  noteUuid: string
  noteRelPath: string
  noteIndex: string
  entries: ExcalidrawClipboardEntry[]
}

export function serializeExcalidrawClipboardPayload(payload: ExcalidrawClipboardPayload): string {
  return JSON.stringify(payload)
}

export function parseExcalidrawClipboardPayload(
  text: string | null | undefined
): ExcalidrawClipboardPayload | null {
  if (!text) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return null
  }
  if (!parsed || typeof parsed !== 'object') return null
  const candidate = parsed as Partial<ExcalidrawClipboardPayload>
  if (candidate.version !== 1) return null
  if (typeof candidate.knowledgeBaseId !== 'string' || !candidate.knowledgeBaseId) return null
  if (!Array.isArray(candidate.entries) || candidate.entries.length === 0) return null
  const entries: ExcalidrawClipboardEntry[] = []
  for (const entry of candidate.entries) {
    if (!entry || typeof entry !== 'object') return null
    const item = entry as Partial<ExcalidrawClipboardEntry>
    if (typeof item.relPath !== 'string' || !item.relPath) return null
    entries.push({
      rawPath: typeof item.rawPath === 'string' ? item.rawPath : item.relPath,
      relPath: item.relPath
    })
  }
  return {
    version: 1,
    knowledgeBaseId: candidate.knowledgeBaseId,
    noteUuid: typeof candidate.noteUuid === 'string' ? candidate.noteUuid : '',
    noteRelPath: typeof candidate.noteRelPath === 'string' ? candidate.noteRelPath : '',
    noteIndex: typeof candidate.noteIndex === 'string' ? candidate.noteIndex : '',
    entries
  }
}

export interface ExcalidrawPasteTarget {
  knowledgeBaseId: string
  noteUuid: string
  noteIndex: string
  noteRelPath: string
}

export type ExcalidrawPasteDecision =
  /** 同笔记：沿用原文件，只是相对引用按目标笔记目录重算 */
  | { kind: 'reuse'; entry: ExcalidrawClipboardEntry; relPath: string; rawPath: string }
  /** 需要复制：same-kb 用 copy IPC，cross-kb 走「读源 + 在目标库创建」 */
  | {
      kind: 'copy'
      entry: ExcalidrawClipboardEntry
      source: { knowledgeBaseId: string; relPath: string }
      crossKnowledgeBase: boolean
      /** 同一个源在一次粘贴里的去重键 */
      dedupeKey: string
    }
  | { kind: 'diagnostic'; entry: ExcalidrawClipboardEntry; code: string; message: string }

/** 用于「同一个源只复制一次」：同库看 relPath，跨库还要带上来源库。 */
export function excalidrawPasteDedupeKey(knowledgeBaseId: string, relPath: string): string {
  return `${knowledgeBaseId}\u0000${relPath}`
}

export function planExcalidrawPaste(input: {
  payload: ExcalidrawClipboardPayload
  target: ExcalidrawPasteTarget
}): ExcalidrawPasteDecision[] {
  const { payload, target } = input
  const targetIndex = target.noteIndex || (noteIndexFromRelPath(target.noteRelPath) ?? '')
  return payload.entries.map((entry) => {
    const owner = excalidrawOwnerIndex(entry.relPath)
    if (!owner) {
      return {
        kind: 'diagnostic',
        entry,
        code: 'missing-owner',
        message: `画布文件名缺少四位笔记编号前缀，未复制：${entry.relPath}`
      }
    }
    if (!/^\d{4}$/.test(targetIndex)) {
      return {
        kind: 'diagnostic',
        entry,
        code: 'unknown-note-index',
        message: '当前笔记缺少四位编号，未复制画布（文件名归属需要它）'
      }
    }
    const sameKnowledgeBase = payload.knowledgeBaseId === target.knowledgeBaseId
    if (sameKnowledgeBase && owner === targetIndex) {
      const relativized = noteRelativeAssetPath(target.noteRelPath, entry.relPath)
      return {
        kind: 'reuse',
        entry,
        relPath: entry.relPath,
        rawPath: relativized ?? entry.rawPath
      }
    }
    return {
      kind: 'copy',
      entry,
      source: { knowledgeBaseId: payload.knowledgeBaseId, relPath: entry.relPath },
      crossKnowledgeBase: !sameKnowledgeBase,
      dedupeKey: excalidrawPasteDedupeKey(payload.knowledgeBaseId, entry.relPath)
    }
  })
}

/**
 * 最近一次「带来源上下文」的复制。
 *
 * 为什么不用自定义 MIME：ProseMirror 自己的 copy 处理器会 `clearData()`，而
 * Chromium 也不把网页自定义格式暴露给 Electron 原生剪贴板读取。因此把来源上下文
 * 放在渲染端缓存里，用**复制时写进剪贴板的原文**做精确匹配——粘贴时文本完全一致
 * 才用缓存里的来源（跨 KB 判断靠它），否则走纯文本规则（避免把围栏示例当组件）。
 */
let lastCopied: { text: string; payload: ExcalidrawClipboardPayload } | null = null

/** 归一化剪贴板文本：换行统一 + 去掉首尾空白，避免平台差异导致匹配失败。 */
export function normalizeClipboardText(text: string): string {
  return text.replace(/\r\n?/g, '\n').trim()
}

export function rememberExcalidrawClipboard(
  clipboardText: string,
  payload: ExcalidrawClipboardPayload
): void {
  const key = normalizeClipboardText(clipboardText)
  if (!key) return
  lastCopied = { text: key, payload }
}

export function recallExcalidrawClipboard(
  clipboardText: string
): ExcalidrawClipboardPayload | null {
  const key = normalizeClipboardText(clipboardText)
  if (!key || !lastCopied) return null
  return lastCopied.text === key ? lastCopied.payload : null
}

export function resetExcalidrawClipboard(): void {
  lastCopied = null
}
