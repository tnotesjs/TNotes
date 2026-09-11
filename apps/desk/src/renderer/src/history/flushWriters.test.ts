import { describe, expect, it, vi } from 'vitest'

import { flushHistoryWriters, HistoryFlushError } from './flushWriters'

import type { AssetEditorSnapshotDto } from '../../../shared/contracts'

const emptySnapshot: AssetEditorSnapshotDto = {
  dirtyDocuments: [],
  dirtyTabs: [],
  pendingRecoveries: [],
  pendingEdits: [],
  kbSettingsDirty: false
}

describe('恢复前 flush', () => {
  it('先 settle 画布、再保存笔记，返回写完后的快照', async () => {
    const order: string[] = []
    const snapshot = await flushHistoryWriters({
      knowledgeBaseId: 'kb-1',
      settleCanvases: async () => {
        order.push('canvas')
        return { settled: ['assets/0042-a.excalidraw'], failures: [] }
      },
      saveDocuments: async () => {
        order.push('documents')
      },
      snapshot: () => {
        order.push('snapshot')
        return emptySnapshot
      }
    })
    expect(order).toEqual(['canvas', 'documents', 'snapshot'])
    expect(snapshot).toEqual(emptySnapshot)
  })

  it('画布写不完就停下，不保存文档、不出快照', async () => {
    const saveDocuments = vi.fn(async () => undefined)
    const snapshot = vi.fn(() => emptySnapshot)
    const error = await flushHistoryWriters({
      knowledgeBaseId: 'kb-1',
      settleCanvases: async () => ({
        settled: [],
        failures: [{ relPath: 'assets/0042-a.excalidraw', message: '磁盘已满' }]
      }),
      saveDocuments,
      snapshot
    }).catch((cause: unknown) => cause)

    expect(error).toBeInstanceOf(HistoryFlushError)
    expect((error as HistoryFlushError).paths).toEqual(['assets/0042-a.excalidraw'])
    expect((error as Error).message).toContain('磁盘已满')
    expect(saveDocuments).not.toHaveBeenCalled()
    expect(snapshot).not.toHaveBeenCalled()
  })

  it('只有该知识库的画布被 settle（默认实现透传知识库 ID）', async () => {
    const settleCanvases = vi.fn(async () => ({ settled: [], failures: [] }))
    await flushHistoryWriters({
      knowledgeBaseId: 'kb-7',
      settleCanvases,
      saveDocuments: async () => undefined,
      snapshot: () => emptySnapshot
    })
    expect(settleCanvases).toHaveBeenCalledWith('kb-7')
  })
})
