/**
 * 历史预览会话（计划 H2）。
 *
 * 负责：按 commit 加载正文、构造 commit 上下文、按需读取历史资源文本，
 * 并在快速切换版本时取消请求、丢弃过时结果、释放内容缓存。
 *
 * 历史图片直接用 `tnotes-asset://history` 协议 URL（不落 Blob URL），所以释放动作
 * 是「中止在途请求 + 清空按 commit+OID 缓存」；画布正文文本走同一套缓存。
 *
 * 这里不碰 ProseMirror/Milkdown：历史预览是纯只读渲染，任何写回接口都不存在。
 */
import type { DeskResult, HistoryAssetDto, HistoryNoteDto } from '../../../shared/contracts'
import { createHistoryCommitContext, type HistoryCommitContext } from './commitContext'

export interface HistoryPreviewTarget {
  knowledgeBaseId: string
  commit: string
  noteIndex: string
  noteUuid?: string
}

export type HistoryNoteLoad =
  | { kind: 'ready'; note: HistoryNoteDto; context: HistoryCommitContext }
  | { kind: 'stale' }
  | { kind: 'error'; message: string }

export interface HistoryApiLike {
  readNote: (request: {
    knowledgeBaseId: string
    commit: string
    noteIndex: string
    noteUuid?: string
  }) => Promise<DeskResult<HistoryNoteDto>>
  readAsset: (request: {
    knowledgeBaseId: string
    commit: string
    relPath: string
  }) => Promise<DeskResult<HistoryAssetDto>>
}

export interface HistoryPreviewSession {
  /** 加载某个 commit 的笔记；被更新的加载超过时返回 `stale`，调用方不得使用结果 */
  loadNote(target: HistoryPreviewTarget): Promise<HistoryNoteLoad>
  /** 按 commit + blob OID 缓存读取资源文本（画布 JSON 等）；结果随会话释放 */
  readAssetText(target: HistoryPreviewTarget, relPath: string, oid: string): Promise<string>
  /** 缓存命中数，便于测试与诊断 */
  cachedAssetCount(): number
  /** 取消在途请求、清空缓存；之后本会话不可再用 */
  dispose(): void
}

export interface HistoryPreviewSessionOptions {
  api?: HistoryApiLike
  fetchText?: (url: string, signal: AbortSignal) => Promise<string>
}

export const HISTORY_SESSION_DISPOSED = '历史预览会话已释放'

export function createHistoryPreviewSession(
  options: HistoryPreviewSessionOptions = {}
): HistoryPreviewSession {
  const api: HistoryApiLike = options.api ?? {
    readNote: (request) => window.desk.history.readNote(request),
    readAsset: (request) => window.desk.history.readAsset(request)
  }
  const fetchText =
    options.fetchText ??
    (async (url: string, signal: AbortSignal) => {
      const response = await fetch(url, { signal, cache: 'no-cache' })
      if (!response.ok) throw new Error(`历史资源读取失败（HTTP ${response.status}）`)
      return await response.text()
    })
  let generation = 0
  let disposed = false
  const aborts = new Set<AbortController>()
  const assetTexts = new Map<string, Promise<string>>()

  function assertLive(): void {
    if (disposed) throw new Error(HISTORY_SESSION_DISPOSED)
  }

  function trackAbort(): AbortController {
    const controller = new AbortController()
    aborts.add(controller)
    return controller
  }

  function releaseAbort(controller: AbortController): void {
    aborts.delete(controller)
  }

  async function loadNote(target: HistoryPreviewTarget): Promise<HistoryNoteLoad> {
    assertLive()
    const current = (generation += 1)
    const controller = trackAbort()
    let result: DeskResult<HistoryNoteDto>
    try {
      result = await api.readNote({
        knowledgeBaseId: target.knowledgeBaseId,
        commit: target.commit,
        noteIndex: target.noteIndex,
        noteUuid: target.noteUuid
      })
    } catch (error) {
      releaseAbort(controller)
      if (generation !== current) return { kind: 'stale' }
      return { kind: 'error', message: error instanceof Error ? error.message : String(error) }
    }
    releaseAbort(controller)
    if (generation !== current) return { kind: 'stale' }
    if (!result.ok) return { kind: 'error', message: result.error.message }
    const note = result.value
    const entries = [
      ...(note.snapshot.note ? [note.snapshot.note] : []),
      ...note.snapshot.assets,
      ...note.snapshot.noteCandidates
    ].map((entry) => ({ relPath: entry.relPath, oid: entry.oid }))
    return {
      kind: 'ready',
      note,
      context: createHistoryCommitContext({
        knowledgeBaseId: target.knowledgeBaseId,
        commit: note.commit,
        noteRelPath: note.relPath,
        entries
      })
    }
  }

  async function readAssetText(
    target: HistoryPreviewTarget,
    relPath: string,
    oid: string
  ): Promise<string> {
    assertLive()
    const cacheKey = `${target.commit}:${oid}`
    const cached = assetTexts.get(cacheKey)
    if (cached) return await cached
    const controller = trackAbort()
    const pending = (async () => {
      try {
        const result = await api.readAsset({
          knowledgeBaseId: target.knowledgeBaseId,
          commit: target.commit,
          relPath
        })
        if (!result.ok) throw new Error(result.error.message)
        return await fetchText(result.value.url, controller.signal)
      } finally {
        releaseAbort(controller)
      }
    })()
    assetTexts.set(cacheKey, pending)
    try {
      return await pending
    } catch (error) {
      // 失败不缓存：下次切换回来要能重试
      assetTexts.delete(cacheKey)
      throw error
    }
  }

  function dispose(): void {
    if (disposed) return
    disposed = true
    generation += 1
    for (const controller of aborts) controller.abort()
    aborts.clear()
    assetTexts.clear()
  }

  return {
    loadNote,
    readAssetText,
    cachedAssetCount: () => assetTexts.size,
    dispose
  }
}
