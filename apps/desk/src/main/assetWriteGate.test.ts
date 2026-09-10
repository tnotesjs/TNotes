import { describe, expect, it } from 'vitest'

import { AssetWriteGate, reasonsFromEditorSnapshot, reasonsFromRecoveries } from './assetWriteGate'

describe('reasonsFromEditorSnapshot', () => {
  it('lists dirty documents, in-flight saves, recoveries and pending edits', () => {
    const reasons = reasonsFromEditorSnapshot({
      dirtyDocuments: [
        { noteUuid: 'a', title: '草稿', saving: false },
        { noteUuid: 'b', title: '保存中', saving: true }
      ],
      dirtyTabs: [{ type: 'note', title: '草稿' }],
      pendingRecoveries: [{ noteUuid: 'c', title: '恢复稿' }],
      pendingEdits: [{ noteUuid: 'd' }],
      kbSettingsDirty: true
    })
    const codes = reasons.map((reason) => reason.code)
    expect(codes).toContain('dirty-document')
    expect(codes).toContain('save-in-flight')
    expect(codes).toContain('pending-recovery')
    expect(codes).toContain('pending-edits')
    expect(codes).toContain('kb-settings-dirty')
    expect(reasons.some((reason) => reason.message.includes('草稿'))).toBe(true)
  })
})

describe('reasonsFromRecoveries', () => {
  it('matches by knowledgeBaseId even when path is missing', () => {
    const reasons = reasonsFromRecoveries('kb-1', [
      {
        version: 1,
        knowledgeBaseId: 'kb-1',
        noteUuid: 'note-1',
        title: '无 path 草稿',
        content: 'x',
        revision: 'r',
        updatedAt: '2026-09-10T00:00:00.000Z'
      },
      {
        version: 1,
        knowledgeBaseId: 'kb-2',
        noteUuid: 'note-2',
        title: '其他库',
        content: 'y',
        revision: 'r',
        updatedAt: '2026-09-10T00:00:00.000Z'
      }
    ])
    expect(reasons).toHaveLength(1)
    expect(reasons[0]?.message).toContain('无 path 草稿')
  })
})

describe('AssetWriteGate', () => {
  it('blocks mutations during a transaction and sticky incomplete journals', () => {
    const gate = new AssetWriteGate()
    gate.beginTransaction('kb')
    expect(() => gate.assertCanMutate('kb')).toThrow(/资源整理进行中/)
    gate.endTransaction('kb')
    gate.assertCanMutate('kb')
    gate.setSticky('kb', 'incomplete-journal')
    expect(() => gate.assertCanMutate('kb')).toThrow(/待恢复/)
    gate.clearSticky('kb')
    gate.assertCanMutate('kb')
  })

  it('tracks attachment in-flight independently of the txn lock', () => {
    const gate = new AssetWriteGate()
    expect(gate.hasAttachmentInFlight('kb')).toBe(false)
    gate.beginAttachment('kb')
    gate.beginAttachment('kb')
    expect(gate.hasAttachmentInFlight('kb')).toBe(true)
    gate.endAttachment('kb')
    expect(gate.hasAttachmentInFlight('kb')).toBe(true)
    gate.endAttachment('kb')
    expect(gate.hasAttachmentInFlight('kb')).toBe(false)
  })
})
