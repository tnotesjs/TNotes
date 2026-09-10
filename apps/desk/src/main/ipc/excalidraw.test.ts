import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const handlers = new Map<string, (event: unknown, input: unknown) => Promise<unknown>>()
  const manager = {
    createExcalidraw: vi.fn(async () => ({
      knowledgeBaseId: 'kb',
      relPath: 'assets/0042-26-09-11-10-20-30.excalidraw',
      ownerNoteIndex: '0042',
      revision: 'rev-1'
    })),
    readExcalidraw: vi.fn(async () => ({
      knowledgeBaseId: 'kb',
      relPath: 'assets/0042-26-09-11-10-20-30.excalidraw',
      ownerNoteIndex: '0042',
      revision: 'rev-1',
      content: '{"type":"excalidraw","elements":[]}',
      valid: true,
      bytes: 34
    })),
    writeExcalidraw: vi.fn(async () => ({
      knowledgeBaseId: 'kb',
      relPath: 'assets/0042-26-09-11-10-20-30.excalidraw',
      ownerNoteIndex: '0042',
      revision: 'rev-2'
    })),
    copyExcalidraw: vi.fn(async () => ({
      knowledgeBaseId: 'kb',
      relPath: 'assets/0043-26-09-11-10-20-30.excalidraw',
      ownerNoteIndex: '0043',
      revision: 'rev-1'
    }))
  }
  return { handlers, manager }
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
vi.mock('../workspaceManager', () => ({ workspaceManager: mocks.manager }))
vi.mock('../log', () => ({ deskLog: vi.fn() }))

import { IPC_CHANNELS } from '../../shared/contracts'
import { registerExcalidraw } from './excalidraw'

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
  registerExcalidraw(getWindow)
})

describe('画布 IPC 契约', () => {
  it('注册四个通道并把参数转成主进程调用', async () => {
    await invoke(IPC_CHANNELS.excalidrawCreate, {
      knowledgeBaseId: 'kb',
      noteUuid: 'note-1'
    })
    expect(mocks.manager.createExcalidraw).toHaveBeenCalledWith('kb', 'note-1', undefined)

    await invoke(IPC_CHANNELS.excalidrawCopy, {
      knowledgeBaseId: 'kb',
      fromRelPath: 'assets/0042-26-09-11-10-20-30.excalidraw',
      toNoteUuid: 'note-2'
    })
    expect(mocks.manager.copyExcalidraw).toHaveBeenCalledWith(
      'kb',
      'assets/0042-26-09-11-10-20-30.excalidraw',
      'note-2'
    )
  })

  it('拒绝 assets/ 之外或非 .excalidraw 的路径', async () => {
    const outside = await invoke(IPC_CHANNELS.excalidrawRead, {
      knowledgeBaseId: 'kb',
      relPath: 'notes/0042-x.excalidraw'
    })
    expect(outside.ok).toBe(false)
    expect(outside.error?.code).toBe('INVALID_REQUEST')

    const wrongExtension = await invoke(IPC_CHANNELS.excalidrawRead, {
      knowledgeBaseId: 'kb',
      relPath: 'assets/0042-x.png'
    })
    expect(wrongExtension.ok).toBe(false)
    expect(mocks.manager.readExcalidraw).not.toHaveBeenCalled()
  })

  it('写入必须带 expectedRevision', async () => {
    const missing = await invoke(IPC_CHANNELS.excalidrawWrite, {
      knowledgeBaseId: 'kb',
      relPath: 'assets/0042-x.excalidraw',
      content: '{"type":"excalidraw","elements":[]}'
    })
    expect(missing.ok).toBe(false)

    const ok = await invoke(IPC_CHANNELS.excalidrawWrite, {
      knowledgeBaseId: 'kb',
      relPath: 'assets/0042-x.excalidraw',
      content: '{"type":"excalidraw","elements":[]}',
      expectedRevision: 'rev-1'
    })
    expect(ok.ok).toBe(true)
    expect(mocks.manager.writeExcalidraw).toHaveBeenCalledWith('kb', {
      relPath: 'assets/0042-x.excalidraw',
      content: '{"type":"excalidraw","elements":[]}',
      expectedRevision: 'rev-1'
    })
  })

  it('拒绝超过 32MB 的画布内容', async () => {
    const huge = await invoke(IPC_CHANNELS.excalidrawWrite, {
      knowledgeBaseId: 'kb',
      relPath: 'assets/0042-x.excalidraw',
      content: 'x'.repeat(32 * 1024 * 1024 + 1),
      expectedRevision: 'rev-1'
    })
    expect(huge.ok).toBe(false)
    expect(mocks.manager.writeExcalidraw).not.toHaveBeenCalled()
  })

  it('拒绝来自未知页面的请求', async () => {
    const handler = mocks.handlers.get(IPC_CHANNELS.excalidrawRead)!
    const result = (await handler(
      { sender: { id: 99 } },
      {
        knowledgeBaseId: 'kb',
        relPath: 'assets/0042-x.excalidraw'
      }
    )) as { ok: boolean }
    expect(result.ok).toBe(false)
    expect(mocks.manager.readExcalidraw).not.toHaveBeenCalled()
  })
})
