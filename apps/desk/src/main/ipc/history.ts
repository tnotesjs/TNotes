import { historyService } from '../history/historyService'
import { IPC_CHANNELS } from '../../shared/contracts'
import { historyAssetSchema, historyListSchema, historySnapshotSchema } from './schemas'
import { handle, type GetWindow } from './shared'

/**
 * 只读历史 IPC（计划 H1/H2）。
 *
 * 参数在这里就被约束成「四位编号 + 完整 40 位 OID + 快照内路径」，
 * 渲染端拿不到任意 revision 表达式或任意文件读取能力。
 */
export function registerHistory(getWindow: GetWindow): () => void {
  handle(IPC_CHANNELS.historyList, getWindow, historyListSchema, (input) =>
    historyService.list(input.knowledgeBaseId, {
      noteIndex: input.noteIndex,
      head: input.head,
      skip: input.skip,
      limit: input.limit
    })
  )
  handle(IPC_CHANNELS.historySnapshot, getWindow, historySnapshotSchema, (input) =>
    historyService.snapshot(input.knowledgeBaseId, input)
  )
  handle(IPC_CHANNELS.historyReadNote, getWindow, historySnapshotSchema, (input) =>
    historyService.readNote(input.knowledgeBaseId, input)
  )
  handle(IPC_CHANNELS.historyReadAsset, getWindow, historyAssetSchema, async (input) => {
    const asset = await historyService.readAsset(input.knowledgeBaseId, {
      commit: input.commit,
      relPath: input.relPath
    })
    const params = new URLSearchParams({
      knowledgeBaseId: input.knowledgeBaseId,
      commit: input.commit,
      path: input.relPath
    })
    return {
      oid: asset.oid,
      bytes: asset.bytes.byteLength,
      contentType: asset.contentType,
      // 渲染端直接用这个 URL；字节由 tnotes-asset://history 协议按 commit 读
      url: `tnotes-asset://history?${params.toString()}`
    }
  })
  return () => undefined
}
