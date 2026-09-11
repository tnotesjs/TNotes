import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  send: vi.fn(),
  gateReplyListeners: new Set<(event: { sender: { id: number } }, payload: unknown) => void>(),
  pauseForAssetWrite: vi.fn(),
  resumeAfterAssetWrite: vi.fn(),
  waitForIdle: vi.fn(async () => undefined),
  loadRecoveries: vi.fn(async () => [])
}))

vi.mock('electron', () => ({
  BrowserWindow: {
    getAllWindows: () => [
      {
        isDestroyed: () => false,
        webContents: { send: mocks.send, isDestroyed: () => false }
      }
    ]
  },
  ipcMain: {
    handle: vi.fn(),
    removeHandler: vi.fn(),
    on: (
      channel: string,
      listener: (event: { sender: { id: number } }, payload: unknown) => void
    ) => {
      if (channel === 'assets:gate-reply') mocks.gateReplyListeners.add(listener)
    },
    off: vi.fn(),
    once: vi.fn(),
    removeListener: (
      channel: string,
      listener: (event: { sender: { id: number } }, payload: unknown) => void
    ) => {
      if (channel === 'assets:gate-reply') mocks.gateReplyListeners.delete(listener)
    },
    removeAllListeners: vi.fn()
  }
}))
vi.mock('./gitManager', () => ({
  gitManager: {
    pauseForAssetWrite: mocks.pauseForAssetWrite,
    resumeAfterAssetWrite: mocks.resumeAfterAssetWrite,
    waitForIdle: mocks.waitForIdle,
    isPausedForAssetWrite: () => false
  }
}))
vi.mock('./recovery', () => ({ loadRecoveries: mocks.loadRecoveries }))
vi.mock('./workspaceManager', () => ({
  workspaceManager: {
    getOverview: () => ({ path: '/tmp/ws' }),
    getHandle: () => ({ snapshot: { notes: [] } })
  }
}))
vi.mock('./log', () => ({ deskLog: vi.fn() }))

import { assetWriteGate } from './assetWriteGate'
import { withAssetWriteGuard } from './assetOperations'

const EMPTY_SNAPSHOT = {
  dirtyDocuments: [],
  dirtyTabs: [],
  pendingRecoveries: [],
  pendingEdits: [],
  kbSettingsDirty: false
}

/** 模拟渲染端回复 gate-query（真实窗口会这么做）。 */
function answerGateQuery(payload: unknown): void {
  const request = payload as { requestId: string; knowledgeBaseId: string }
  for (const listener of mocks.gateReplyListeners) {
    listener(
      { sender: { id: 1 } },
      {
        requestId: request.requestId,
        knowledgeBaseId: request.knowledgeBaseId,
        snapshot: EMPTY_SNAPSHOT
      }
    )
  }
}

const KB = 'kb-guard'

beforeEach(() => {
  mocks.send.mockReset()
  mocks.gateReplyListeners.clear()
  mocks.send.mockImplementation((channel: string, payload: unknown) => {
    if (channel === 'assets:gate-query') queueMicrotask(() => answerGateQuery(payload))
  })
  mocks.pauseForAssetWrite.mockClear()
  mocks.resumeAfterAssetWrite.mockClear()
  assetWriteGate.endTransaction(KB)
  assetWriteGate.clearSticky(KB)
})

describe('写事务闸门（资源整理与历史恢复共用）', () => {
  it('已经有一个写事务在跑时直接拒绝，不排队也不并行', async () => {
    let release: () => void = () => undefined
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const first = withAssetWriteGuard(KB, async () => {
      await gate
      return 'first'
    })
    await vi.waitFor(() => expect(assetWriteGate.inTransaction(KB)).toBe(true))

    await expect(withAssetWriteGuard(KB, async () => 'second')).rejects.toMatchObject({
      message: expect.stringContaining('另一项写事务')
    })
    release()
    await expect(first).resolves.toBe('first')
    expect(assetWriteGate.inTransaction(KB)).toBe(false)
  })

  it('广播 prepare/settled 并暂停、恢复该库 Git', async () => {
    await withAssetWriteGuard(KB, async () => 'ok', { noteUuids: ['note-1'] })
    const channels = mocks.send.mock.calls
      .map(([channel]) => channel)
      .filter((channel) => channel !== 'assets:gate-query')
    expect(channels).toEqual(['assets:prepare-apply', 'assets:apply-settled'])
    const prepare = mocks.send.mock.calls.find(([channel]) => channel === 'assets:prepare-apply')
    expect(prepare?.[1]).toMatchObject({ knowledgeBaseId: KB, noteUuids: ['note-1'] })
    expect(mocks.pauseForAssetWrite).toHaveBeenCalledWith(KB)
    expect(mocks.resumeAfterAssetWrite).toHaveBeenCalledWith(KB)
    expect(mocks.waitForIdle).toHaveBeenCalledWith(KB)
  })

  it('工作失败也要结束事务并广播 settled', async () => {
    await expect(
      withAssetWriteGuard(KB, async () => {
        throw new Error('写盘失败')
      })
    ).rejects.toThrow('写盘失败')
    expect(assetWriteGate.inTransaction(KB)).toBe(false)
    expect(
      mocks.send.mock.calls
        .map(([channel]) => channel)
        .filter((channel) => channel !== 'assets:gate-query')
    ).toEqual(['assets:prepare-apply', 'assets:apply-settled'])
  })

  it('shouldKeepPaused 为真时留下 sticky 暂停（需要人工恢复）', async () => {
    await withAssetWriteGuard(KB, async () => 'needs-recovery', {
      shouldKeepPaused: (value) => value === 'needs-recovery'
    })
    expect(assetWriteGate.stickyReason(KB)).toBe('incomplete-journal')
    expect(mocks.resumeAfterAssetWrite).not.toHaveBeenCalled()
  })

  it('未完成 journal 的 sticky 会挡住新的写事务', async () => {
    assetWriteGate.setSticky(KB, 'incomplete-journal')
    await expect(withAssetWriteGuard(KB, async () => 'x')).rejects.toMatchObject({
      message: expect.stringContaining('未完成的资源事务')
    })
    expect(assetWriteGate.inTransaction(KB)).toBe(false)
  })
})
