/**
 * 恢复前的受控 flush（计划 H4）。
 *
 * 顺序：先把画布会话 settle（画布内容只存在内存里的最新场景会写盘），再保存笔记
 * 文档（含块内 pending edits），最后取一份**写完后**的写者快照交给主进程。
 * 任何一步失败都不允许继续创建恢复计划：否则备份里会是半份状态。
 */
import type { AssetEditorSnapshotDto } from '../../../shared/contracts'
import { settleExcalidrawSessions } from '../editor/excalidraw/sessionRegistry'

export interface HistoryFlushDeps {
  knowledgeBaseId: string
  /** 保存该库所有脏笔记（含块内 pending edits） */
  saveDocuments: () => Promise<void>
  /** 默认走真实画布会话登记表；测试可注入 */
  settleCanvases?: (knowledgeBaseId: string) => Promise<{
    settled: string[]
    failures: Array<{ relPath: string; message: string }>
  }>
  /** flush 之后的写者快照 */
  snapshot: () => AssetEditorSnapshotDto
}

export class HistoryFlushError extends Error {
  readonly paths: string[]

  constructor(paths: string[], message: string) {
    super(message)
    this.name = 'HistoryFlushError'
    this.paths = paths
  }
}

export async function flushHistoryWriters(deps: HistoryFlushDeps): Promise<AssetEditorSnapshotDto> {
  const settle = deps.settleCanvases ?? settleExcalidrawSessions
  const canvases = await settle(deps.knowledgeBaseId)
  if (canvases.failures.length > 0) {
    const paths = canvases.failures.map((failure) => failure.relPath)
    throw new HistoryFlushError(
      paths,
      `画布还有没写完的内容，先处理后再恢复：${canvases.failures
        .map((failure) => `${failure.relPath}（${failure.message}）`)
        .join('；')}`
    )
  }
  await deps.saveDocuments()
  return deps.snapshot()
}
