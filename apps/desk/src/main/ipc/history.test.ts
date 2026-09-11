import { beforeEach, describe, expect, it, vi } from 'vitest'

const OID = 'a'.repeat(40)
const OID_2 = 'b'.repeat(40)

const mocks = vi.hoisted(() => {
  const handlers = new Map<string, (event: unknown, input: unknown) => Promise<unknown>>()
  const service = {
    list: vi.fn(async () => ({
      head: 'b'.repeat(40),
      commits: [],
      hasMore: false
    })),
    snapshot: vi.fn(async () => ({
      commit: 'a'.repeat(40),
      noteIndex: '0042',
      note: null,
      ambiguousNotePaths: [],
      assets: [],
      noteCandidates: [],
      limitations: []
    })),
    readNote: vi.fn(async () => ({
      commit: 'a'.repeat(40),
      relPath: 'notes/0042-note.md',
      oid: 'c'.repeat(40),
      bytes: 12,
      text: '# hi',
      snapshot: {
        commit: 'a'.repeat(40),
        noteIndex: '0042',
        note: null,
        ambiguousNotePaths: [],
        assets: [],
        noteCandidates: [],
        limitations: []
      }
    })),
    readAsset: vi.fn(async () => ({
      bytes: Buffer.from([1, 2, 3]),
      oid: 'd'.repeat(40),
      contentType: 'image/png'
    })),
    applyPlan: vi.fn(async () => ({
      operationId: 'history-restore-1',
      backupCommit: 'b'.repeat(40),
      restoreCommit: 'c'.repeat(40),
      writtenPaths: ['notes/0042. A.md', 'assets/0042-a.png'],
      headDrift: false
    })),
    plan: vi.fn(async () => ({
      id: 'history-restore-1',
      revision: 1,
      knowledgeBaseId: 'kb',
      rootPath: '/tmp/kb',
      head: 'b'.repeat(40),
      sourceCommit: 'a'.repeat(40),
      noteIndex: '0042',
      note: { relPath: 'notes/0042. A.md', oid: 'c'.repeat(40), bytes: 10 },
      resources: [{ relPath: 'assets/0042-a.png', oid: 'e'.repeat(40), bytes: 3 }],
      preserved: [{ relPath: 'assets/0042-new.png', oid: 'f'.repeat(40), bytes: 4 }],
      writePaths: ['notes/0042. A.md', 'assets/0042-a.png'],
      backupPaths: ['assets/0042-a.png', 'assets/0042-new.png', 'notes/0042. A.md'],
      backupMessage: 'backup: 0042 恢复历史版本前备份',
      limitations: [],
      createdAt: 1
    }))
  }
  return { handlers, service }
})

vi.mock('electron', () => ({
  ipcMain: {
    handle: (channel: string, handler: (event: unknown, input: unknown) => Promise<unknown>) => {
      mocks.handlers.set(channel, handler)
    },
    removeHandler: (channel: string) => mocks.handlers.delete(channel)
  },
  BrowserWindow: { getAllWindows: () => [] }
}))
vi.mock('../history/historyService', () => ({ historyService: mocks.service }))
vi.mock('../history/restorePlan', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../history/restorePlan')>()
  return { ...actual, historyRestorePlanStore: { put: vi.fn(), require: vi.fn(), drop: vi.fn() } }
})
vi.mock('../log', () => ({ deskLog: vi.fn() }))

import { IPC_CHANNELS } from '../../shared/contracts'
import { registerHistory } from './history'

const window = { webContents: { id: 1 } }
const getWindow = () => window as never
const event = { sender: { id: 1 } }

async function invoke(channel: string, input: unknown) {
  const handler = mocks.handlers.get(channel)
  if (!handler) throw new Error(`未注册的通道：${channel}`)
  return (await handler(event, input)) as { ok: boolean; value?: unknown; error?: { code: string } }
}

beforeEach(() => {
  mocks.handlers.clear()
  vi.clearAllMocks()
  registerHistory(getWindow)
})

describe('历史 IPC 契约', () => {
  it('注册四个通道并把参数转成主进程调用', async () => {
    await invoke(IPC_CHANNELS.historyList, {
      knowledgeBaseId: 'kb',
      noteIndex: '0042',
      skip: 10,
      limit: 20
    })
    expect(mocks.service.list).toHaveBeenCalledWith('kb', {
      noteIndex: '0042',
      head: undefined,
      skip: 10,
      limit: 20
    })

    await invoke(IPC_CHANNELS.historySnapshot, {
      knowledgeBaseId: 'kb',
      commit: OID,
      noteIndex: '0042',
      noteUuid: 'note-1'
    })
    expect(mocks.service.snapshot).toHaveBeenCalledWith('kb', {
      knowledgeBaseId: 'kb',
      commit: OID,
      noteIndex: '0042',
      noteUuid: 'note-1'
    })

    await invoke(IPC_CHANNELS.historyReadNote, {
      knowledgeBaseId: 'kb',
      commit: OID,
      noteIndex: '0042'
    })
    expect(mocks.service.readNote).toHaveBeenCalledTimes(1)
  })

  it('拒绝任意 revision 表达式，只接受完整 40 位 OID', async () => {
    for (const commit of [
      'HEAD',
      'HEAD~1',
      'main',
      'a1b2c3',
      'refs/heads/main',
      OID.slice(0, 39)
    ]) {
      const result = await invoke(IPC_CHANNELS.historySnapshot, {
        knowledgeBaseId: 'kb',
        commit,
        noteIndex: '0042'
      })
      expect(result.ok).toBe(false)
      expect(result.error?.code).toBe('INVALID_REQUEST')
    }
    expect(mocks.service.snapshot).not.toHaveBeenCalled()
  })

  it('拒绝非四位编号与非 40 位 OID 的资源请求', async () => {
    const badIndex = await invoke(IPC_CHANNELS.historySnapshot, {
      knowledgeBaseId: 'kb',
      commit: OID,
      noteIndex: '42'
    })
    expect(badIndex.ok).toBe(false)

    const badCommit = await invoke(IPC_CHANNELS.historyReadAsset, {
      knowledgeBaseId: 'kb',
      commit: 'HEAD',
      relPath: 'assets/0042-x.png'
    })
    expect(badCommit.ok).toBe(false)

    const emptyPath = await invoke(IPC_CHANNELS.historyReadAsset, {
      knowledgeBaseId: 'kb',
      commit: OID,
      relPath: ''
    })
    expect(emptyPath.ok).toBe(false)
    expect(mocks.service.readAsset).not.toHaveBeenCalled()
  })

  it('资源只回 URL 与元数据，不回字节本体', async () => {
    const result = await invoke(IPC_CHANNELS.historyReadAsset, {
      knowledgeBaseId: 'kb',
      commit: OID,
      relPath: 'assets/0042-x.png'
    })
    expect(result.ok).toBe(true)
    const value = result.value as { oid: string; bytes: number; contentType: string; url: string }
    expect(value).toEqual({
      oid: 'd'.repeat(40),
      bytes: 3,
      contentType: 'image/png',
      url: expect.stringContaining('tnotes-asset://history?')
    })
    // 字节不允许进入 IPC 返回值（只能过受限协议）
    expect(Object.keys(value).sort()).toEqual(['bytes', 'contentType', 'oid', 'url'])
    const url = new URL(value.url)
    expect(url.searchParams.get('knowledgeBaseId')).toBe('kb')
    expect(url.searchParams.get('commit')).toBe(OID)
    expect(url.searchParams.get('path')).toBe('assets/0042-x.png')
    expect(mocks.service.readAsset).toHaveBeenCalledWith('kb', {
      commit: OID,
      relPath: 'assets/0042-x.png'
    })
  })

  it('未知字段被剥离，不会转发到主进程服务', async () => {
    const result = await invoke(IPC_CHANNELS.historyList, {
      knowledgeBaseId: 'kb',
      head: OID_2,
      content: 'x'
    })
    expect(result.ok).toBe(true)
    expect(mocks.service.list).toHaveBeenCalledWith('kb', {
      noteIndex: undefined,
      head: OID_2,
      skip: undefined,
      limit: undefined
    })
  })

  it('创建恢复计划：只回影响范围与计划 ID，写入路径不出主进程', async () => {
    const result = await invoke(IPC_CHANNELS.historyPlan, {
      knowledgeBaseId: 'kb',
      noteIndex: '0042',
      commit: OID,
      expectedHead: OID_2,
      writers: {
        dirtyDocuments: [],
        dirtyTabs: [],
        pendingRecoveries: [],
        pendingEdits: [],
        kbSettingsDirty: false
      }
    })
    expect(result.ok).toBe(true)
    const value = result.value as Record<string, unknown>
    expect(value.planId).toBe('history-restore-1')
    expect(value.writeCount).toBe(2)
    expect(value.backupMessage).toContain('backup: 0042')
    expect(value.resources).toEqual([{ relPath: 'assets/0042-a.png', bytes: 3 }])
    // 计划里的 OID / 磁盘路径不能出现在渲染端 DTO 里
    const serialized = JSON.stringify(value)
    expect(serialized).not.toContain('e'.repeat(40))
    expect(serialized).not.toContain('/tmp/kb')
    expect(serialized).not.toContain('writePaths')
    expect(mocks.service.plan).toHaveBeenCalledWith('kb', {
      noteIndex: '0042',
      commit: OID,
      expectedHead: OID_2,
      writers: expect.objectContaining({ kbSettingsDirty: false })
    })
  })

  it('执行恢复只接受计划 ID + revision', async () => {
    const result = await invoke(IPC_CHANNELS.historyApply, {
      planId: 'history-restore-1',
      revision: 1
    })
    expect(result.ok).toBe(true)
    expect(result.value).toMatchObject({
      operationId: 'history-restore-1',
      restoreCommit: 'c'.repeat(40),
      headDrift: false
    })
    expect(mocks.service.applyPlan).toHaveBeenCalledWith('history-restore-1', 1)

    // 渲染端不能传路径、内容或任意提交
    const injected = await invoke(IPC_CHANNELS.historyApply, {
      planId: 'history-restore-1',
      revision: 1,
      writePaths: ['../../etc/passwd'],
      content: 'x'
    })
    expect(injected.ok).toBe(true)
    expect(mocks.service.applyPlan).toHaveBeenLastCalledWith('history-restore-1', 1)

    const missingRevision = await invoke(IPC_CHANNELS.historyApply, { planId: 'x' })
    expect(missingRevision.ok).toBe(false)
    expect(missingRevision.error?.code).toBe('INVALID_REQUEST')
  })

  it('恢复计划同样拒绝 revision 表达式与坏快照', async () => {
    const badCommit = await invoke(IPC_CHANNELS.historyPlan, {
      knowledgeBaseId: 'kb',
      noteIndex: '0042',
      commit: 'HEAD~1'
    })
    expect(badCommit.ok).toBe(false)

    const badWriters = await invoke(IPC_CHANNELS.historyPlan, {
      knowledgeBaseId: 'kb',
      noteIndex: '0042',
      commit: OID,
      writers: { dirtyDocuments: 'nope' }
    })
    expect(badWriters.ok).toBe(false)
    expect(mocks.service.plan).not.toHaveBeenCalled()
  })

  it('拒绝来自未知页面的请求', async () => {
    const handler = mocks.handlers.get(IPC_CHANNELS.historyList)!
    const result = (await handler({ sender: { id: 99 } }, { knowledgeBaseId: 'kb' })) as {
      ok: boolean
    }
    expect(result.ok).toBe(false)
    expect(mocks.service.list).not.toHaveBeenCalled()
  })
})
