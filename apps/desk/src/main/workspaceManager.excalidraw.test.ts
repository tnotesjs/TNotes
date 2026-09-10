import { afterEach, describe, expect, it } from 'vitest'

import { assetWriteGate } from './assetWriteGate'
import { WorkspaceManager } from './workspaceManager'

/**
 * 画布写入必须和笔记保存走同一道写入门禁：资源事务进行中（或库被
 * sticky 锁住）时不能写盘，否则整理中途会产生孤儿文件或半套引用。
 */
describe('画布写入的写入门禁', () => {
  afterEach(() => {
    assetWriteGate.endTransaction('kb-canvas')
    assetWriteGate.clearSticky('kb-canvas')
  })

  function managerWithHandle(): WorkspaceManager {
    const manager = new WorkspaceManager()
    const internals = manager as unknown as {
      scanState: { handles: Map<string, { rootPath: string }> }
    }
    internals.scanState.handles.set('kb-canvas', { rootPath: '/tmp' } as never)
    return manager
  }

  it('资源事务进行中拒绝画布创建/写入/复制', async () => {
    const manager = managerWithHandle()
    assetWriteGate.beginTransaction('kb-canvas')

    await expect(manager.createExcalidraw('kb-canvas', 'note-1')).rejects.toThrow(/资源整理进行中/)
    await expect(
      manager.writeExcalidraw('kb-canvas', {
        relPath: 'assets/0042-26-09-11-10-20-30.excalidraw',
        content: '{"type":"excalidraw","elements":[]}',
        expectedRevision: 'rev-1'
      })
    ).rejects.toThrow(/资源整理进行中/)
    await expect(
      manager.copyExcalidraw('kb-canvas', 'assets/0042-26-09-11-10-20-30.excalidraw', 'note-2')
    ).rejects.toThrow(/资源整理进行中/)
  })

  it('未完成 journal 的 sticky 锁同样拦住画布写入', async () => {
    const manager = managerWithHandle()
    assetWriteGate.setSticky('kb-canvas', 'incomplete-journal')

    await expect(
      manager.writeExcalidraw('kb-canvas', {
        relPath: 'assets/0042-26-09-11-10-20-30.excalidraw',
        content: '{"type":"excalidraw","elements":[]}',
        expectedRevision: 'rev-1'
      })
    ).rejects.toThrow(/待恢复/)
  })
})
