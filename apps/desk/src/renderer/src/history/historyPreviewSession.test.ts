import { describe, expect, it, vi } from 'vitest'

import type { DeskResult, HistoryAssetDto, HistoryNoteDto } from '../../../shared/contracts'
import { createHistoryPreviewSession, HISTORY_SESSION_DISPOSED } from './historyPreviewSession'

const COMMIT_A = 'a'.repeat(40)
const COMMIT_B = 'b'.repeat(40)
const OID = 'c'.repeat(40)

function note(commit: string, text = '# hi'): DeskResult<HistoryNoteDto> {
  return {
    ok: true,
    value: {
      commit,
      relPath: 'notes/0042. 笔记/0042. 笔记.md',
      oid: OID,
      bytes: text.length,
      text,
      snapshot: {
        commit,
        noteIndex: '0042',
        note: { relPath: 'notes/0042. 笔记/0042. 笔记.md', oid: OID, noteUuid: null },
        ambiguousNotePaths: [],
        assets: [
          { relPath: 'assets/0042-a.excalidraw', oid: 'd'.repeat(40), mode: '100644', size: 2 }
        ],
        noteCandidates: [],
        limitations: []
      }
    }
  }
}

function asset(): DeskResult<HistoryAssetDto> {
  return {
    ok: true,
    value: {
      oid: 'd'.repeat(40),
      bytes: 2,
      contentType: 'application/json',
      url: 'tnotes-asset://history?x=1'
    }
  }
}

describe('历史预览会话', () => {
  it('加载正文时构造 commit 上下文（含快照白名单）', async () => {
    const session = createHistoryPreviewSession({
      api: { readNote: vi.fn(async () => note(COMMIT_A)), readAsset: vi.fn(async () => asset()) }
    })
    const loaded = await session.loadNote({
      knowledgeBaseId: 'kb',
      commit: COMMIT_A,
      noteIndex: '0042'
    })
    expect(loaded.kind).toBe('ready')
    if (loaded.kind !== 'ready') throw new Error('unreachable')
    expect(loaded.context.commit).toBe(COMMIT_A)
    expect(loaded.context.allowedPaths.get('assets/0042-a.excalidraw')).toBe('d'.repeat(40))
    session.dispose()
  })

  it('快速切换版本：旧请求的结果被丢弃，只有最新 commit 生效', async () => {
    const pending: Array<(value: DeskResult<HistoryNoteDto>) => void> = []
    const readNote = vi.fn(
      () =>
        new Promise<DeskResult<HistoryNoteDto>>((resolve) => {
          pending.push(resolve)
        })
    )
    const session = createHistoryPreviewSession({
      api: { readNote, readAsset: vi.fn(async () => asset()) }
    })
    const first = session.loadNote({ knowledgeBaseId: 'kb', commit: COMMIT_A, noteIndex: '0042' })
    const second = session.loadNote({ knowledgeBaseId: 'kb', commit: COMMIT_B, noteIndex: '0042' })
    // 先返回旧请求，再返回新请求：旧结果必须被丢弃
    pending[0]!(note(COMMIT_A))
    pending[1]!(note(COMMIT_B))
    expect((await first).kind).toBe('stale')
    const latest = await second
    expect(latest.kind).toBe('ready')
    if (latest.kind !== 'ready') throw new Error('unreachable')
    expect(latest.context.commit).toBe(COMMIT_B)
    session.dispose()
  })

  it('按 commit + blob OID 缓存画布文本，重复读取只取一次', async () => {
    const readAsset = vi.fn(async () => asset())
    const fetchText = vi.fn(async () => '{"type":"excalidraw","elements":[]}')
    const session = createHistoryPreviewSession({
      api: { readNote: vi.fn(async () => note(COMMIT_A)), readAsset },
      fetchText
    })
    const target = { knowledgeBaseId: 'kb', commit: COMMIT_A, noteIndex: '0042' }
    const first = await session.readAssetText(target, 'assets/0042-a.excalidraw', OID)
    const second = await session.readAssetText(target, 'assets/0042-a.excalidraw', OID)
    expect(first).toBe(second)
    expect(readAsset).toHaveBeenCalledTimes(1)
    expect(fetchText).toHaveBeenCalledTimes(1)
    expect(session.cachedAssetCount()).toBe(1)
    session.dispose()
    expect(session.cachedAssetCount()).toBe(0)
  })

  it('失败不缓存，切换回来可以重试', async () => {
    const readAsset = vi
      .fn<() => Promise<DeskResult<HistoryAssetDto>>>()
      .mockResolvedValueOnce({ ok: false, error: { code: 'UNKNOWN_PATH', message: '没有该文件' } })
      .mockResolvedValueOnce(asset())
    const session = createHistoryPreviewSession({
      api: { readNote: vi.fn(async () => note(COMMIT_A)), readAsset },
      fetchText: async () => '{}'
    })
    const target = { knowledgeBaseId: 'kb', commit: COMMIT_A, noteIndex: '0042' }
    await expect(session.readAssetText(target, 'assets/0042-a.excalidraw', OID)).rejects.toThrow(
      '没有该文件'
    )
    await expect(session.readAssetText(target, 'assets/0042-a.excalidraw', OID)).resolves.toBe('{}')
    session.dispose()
  })

  it('dispose 会中止在途资源请求并拒绝后续调用', async () => {
    let observedSignal: AbortSignal | null = null
    const session = createHistoryPreviewSession({
      api: {
        readNote: vi.fn(async () => note(COMMIT_A)),
        readAsset: vi.fn(async () => asset())
      },
      fetchText: async (_url, signal) => {
        observedSignal = signal
        return await new Promise<string>((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(new Error('请求已取消')))
        })
      }
    })
    const target = { knowledgeBaseId: 'kb', commit: COMMIT_A, noteIndex: '0042' }
    const pending = session.readAssetText(target, 'assets/0042-a.excalidraw', OID)
    await waitFor(() => observedSignal !== null)
    session.dispose()
    expect(observedSignal!.aborted).toBe(true)
    await expect(pending).rejects.toThrow('请求已取消')
    await expect(session.readAssetText(target, 'assets/0042-a.excalidraw', OID)).rejects.toThrow(
      HISTORY_SESSION_DISPOSED
    )
  })
})

async function waitFor(check: () => boolean, timeoutMs = 1000): Promise<void> {
  const deadline = Date.now() + timeoutMs
  while (!check()) {
    if (Date.now() > deadline) throw new Error('等待超时')
    await new Promise((resolve) => setTimeout(resolve, 1))
  }
}
