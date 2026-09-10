import { KbError } from '@tnotesjs/kb'

import type { RecoveryRecord } from '../shared/contracts'

export interface AssetWriteBlockReason {
  code:
    | 'dirty-document'
    | 'pending-recovery'
    | 'save-in-flight'
    | 'attachment-in-flight'
    | 'window-unresponsive'
    | 'kb-settings-dirty'
    | 'pending-edits'
    | 'incomplete-journal'
    | 'write-locked'
  message: string
}

export interface AssetEditorSnapshot {
  dirtyDocuments: Array<{ noteUuid: string; title: string; saving: boolean }>
  dirtyTabs: Array<{ type: string; title: string }>
  pendingRecoveries: Array<{ noteUuid: string; title: string }>
  pendingEdits: Array<{ noteUuid: string }>
  kbSettingsDirty: boolean
}

export function reasonsFromEditorSnapshot(snapshot: AssetEditorSnapshot): AssetWriteBlockReason[] {
  const reasons: AssetWriteBlockReason[] = []
  for (const doc of snapshot.dirtyDocuments) {
    if (doc.saving) {
      reasons.push({
        code: 'save-in-flight',
        message: `正在保存「${doc.title}」，请等待完成后再整理资源`
      })
    } else {
      reasons.push({
        code: 'dirty-document',
        message: `「${doc.title}」有未保存更改，请先保存或丢弃后再整理资源`
      })
    }
  }
  for (const tab of snapshot.dirtyTabs) {
    if (
      tab.type === 'kb-settings' ||
      snapshot.dirtyDocuments.some((doc) => doc.title === tab.title)
    ) {
      continue
    }
    reasons.push({
      code: 'dirty-document',
      message: `「${tab.title}」有未保存更改，请先保存或丢弃后再整理资源`
    })
  }
  if (snapshot.kbSettingsDirty) {
    reasons.push({
      code: 'kb-settings-dirty',
      message: '知识库设置有未保存更改，请先保存或丢弃后再整理资源'
    })
  }
  for (const recovery of snapshot.pendingRecoveries) {
    reasons.push({
      code: 'pending-recovery',
      message: `「${recovery.title}」有待恢复草稿，请先处理后再整理资源`
    })
  }
  for (const edit of snapshot.pendingEdits) {
    reasons.push({
      code: 'pending-edits',
      message: `笔记 ${edit.noteUuid} 有未提交的块内编辑，请先完成后再整理资源`
    })
  }
  return reasons
}

export function reasonsFromRecoveries(
  knowledgeBaseId: string,
  records: RecoveryRecord[]
): AssetWriteBlockReason[] {
  return records
    .filter((record) => record.knowledgeBaseId === knowledgeBaseId)
    .map((record) => ({
      code: 'pending-recovery' as const,
      message: `「${record.title}」有待恢复草稿，请先处理后再整理资源`
    }))
}

export class AssetWriteGate {
  private readonly txnLocks = new Set<string>()
  private readonly stickyLocks = new Map<string, string>()
  private readonly attachments = new Map<string, number>()

  inTransaction(knowledgeBaseId: string): boolean {
    return this.txnLocks.has(knowledgeBaseId)
  }

  isLocked(knowledgeBaseId: string): boolean {
    return this.txnLocks.has(knowledgeBaseId) || this.stickyLocks.has(knowledgeBaseId)
  }

  beginTransaction(knowledgeBaseId: string): void {
    this.txnLocks.add(knowledgeBaseId)
  }

  endTransaction(knowledgeBaseId: string): void {
    this.txnLocks.delete(knowledgeBaseId)
  }

  setSticky(knowledgeBaseId: string, reason: string): void {
    this.stickyLocks.set(knowledgeBaseId, reason)
  }

  clearSticky(knowledgeBaseId: string): void {
    this.stickyLocks.delete(knowledgeBaseId)
  }

  stickyReason(knowledgeBaseId: string): string | undefined {
    return this.stickyLocks.get(knowledgeBaseId)
  }

  beginAttachment(knowledgeBaseId: string): void {
    this.attachments.set(knowledgeBaseId, (this.attachments.get(knowledgeBaseId) ?? 0) + 1)
  }

  endAttachment(knowledgeBaseId: string): void {
    const next = (this.attachments.get(knowledgeBaseId) ?? 1) - 1
    if (next <= 0) this.attachments.delete(knowledgeBaseId)
    else this.attachments.set(knowledgeBaseId, next)
  }

  hasAttachmentInFlight(knowledgeBaseId: string): boolean {
    return (this.attachments.get(knowledgeBaseId) ?? 0) > 0
  }

  assertCanMutate(knowledgeBaseId: string): void {
    if (this.txnLocks.has(knowledgeBaseId)) {
      throw new KbError('INVALID_OPERATION', '资源整理进行中，已暂停该知识库的保存和附件写入', {
        knowledgeBaseId
      })
    }
    const sticky = this.stickyLocks.get(knowledgeBaseId)
    if (sticky) {
      throw new KbError('INVALID_OPERATION', `资源事务待恢复，已暂停该知识库写入（${sticky}）`, {
        knowledgeBaseId
      })
    }
  }
}

export const assetWriteGate = new AssetWriteGate()
