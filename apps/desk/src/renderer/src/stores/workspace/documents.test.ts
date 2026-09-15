// @vitest-environment happy-dom

import { ref } from 'vue'

import { describe, expect, it, vi } from 'vitest'

import type { RecoveryRecord } from '../../../../shared/contracts'

import { createDocuments, type DocumentsContext } from './documents'
import type { DocumentSession } from './helpers'

function makeSession(overrides: Partial<DocumentSession> = {}): DocumentSession {
  return {
    document: {
      uuid: 'note-1',
      title: '笔记',
      content: '# 原文\n',
      revision: 'r1',
      knowledgeBaseId: 'kb'
    },
    content: '# 原文\n',
    dirty: false,
    preserveSourceOnSave: false,
    externalConflict: false,
    saving: false,
    unsavedDraft: false,
    ...overrides
  } as unknown as DocumentSession
}

function makeContext(session: DocumentSession = makeSession()) {
  const documents = ref<Record<string, DocumentSession>>({ 'kb:note-1': session })
  const error = ref<string | null>(null)
  const status = ref<string | null>(null)
  const pendingRecoveries = ref<RecoveryRecord[]>([])
  const deleteRecoveryApi = vi.fn(async () => ({ ok: true, value: undefined }) as const)
  Object.defineProperty(window, 'desk', {
    configurable: true,
    value: {
      recovery: { delete: deleteRecoveryApi },
      notes: {
        read: vi.fn(async () => ({ ok: true, value: { content: '# 磁盘内容\n' } }) as const)
      }
    }
  })
  const ctx = {
    editor: { setNoteDirty: vi.fn() },
    documents,
    activeDocumentKey: ref('kb:note-1'),
    settings: ref({ autosave: { enabled: false, delayMs: 1000 } }),
    autosaveTimers: new Map<string, NodeJS.Timeout>(),
    recoveryTimers: new Map<string, NodeJS.Timeout>(),
    error,
    status,
    setDocumentSession: (key: string, next: DocumentSession) => {
      documents.value = { ...documents.value, [key]: next }
    },
    pendingRecoveries,
    deleteRecovery: vi.fn()
  } as unknown as DocumentsContext
  return {
    ctx,
    documents,
    error,
    pendingRecoveries,
    recoveryDelete: deleteRecoveryApi,
    editor: ctx.editor as { setNoteDirty: ReturnType<typeof vi.fn> }
  }
}

function recoveryRecord(overrides: Partial<RecoveryRecord> = {}): RecoveryRecord {
  return {
    version: 1,
    knowledgeBaseId: 'kb',
    noteUuid: 'note-1',
    title: '笔记',
    content: '# 草稿\n',
    revision: 'r1',
    updatedAt: new Date(0).toISOString(),
    ...overrides
  }
}

describe('外部冲突标记', () => {
  it('用户继续输入不会清掉外部冲突标记（需要显式选择载入磁盘/保留编辑）', () => {
    const session = makeSession({ dirty: true, externalConflict: true })
    const { ctx, documents } = makeContext(session)
    const docs = createDocuments(ctx)

    docs.updateDocumentContent('kb:note-1', '# 原文\n\n继续编辑\n', true)

    expect(documents.value['kb:note-1']?.content).toBe('# 原文\n\n继续编辑\n')
    expect(documents.value['kb:note-1']?.externalConflict).toBe(true)
  })

  it('没有冲突时保持无冲突，不会凭空出现横幅', () => {
    const { ctx, documents } = makeContext(makeSession())
    const docs = createDocuments(ctx)

    docs.updateDocumentContent('kb:note-1', '# 原文\n\n编辑\n', true)

    expect(documents.value['kb:note-1']?.externalConflict).toBe(false)
  })
})

describe('恢复快照的 path 记录', () => {
  it('旧版带 path 的记录不会被静默丢弃：给出提示且不删除', async () => {
    const { ctx, error, pendingRecoveries, recoveryDelete } = makeContext()
    const docs = createDocuments(ctx)

    await docs.prepareRecoveries([
      recoveryRecord({ path: 'README.md', title: 'README' }),
      recoveryRecord({ noteUuid: 'note-1' })
    ])

    expect(pendingRecoveries.value).toHaveLength(1)
    expect(pendingRecoveries.value[0]?.noteUuid).toBe('note-1')
    expect(error.value).toMatch(/README/)
    // 不删：用户至少还能在磁盘上找到这份快照
    expect(recoveryDelete).not.toHaveBeenCalledWith({
      knowledgeBaseId: 'kb',
      noteUuid: 'note-1'
    })
  })

  it('磁盘内容与快照一致时清理该条记录', async () => {
    const { ctx, pendingRecoveries, recoveryDelete } = makeContext()
    const docs = createDocuments(ctx)

    await docs.prepareRecoveries([recoveryRecord({ content: '# 磁盘内容\n' })])

    expect(pendingRecoveries.value).toHaveLength(0)
    expect(recoveryDelete).toHaveBeenCalledOnce()
  })
})

describe('未 emit 的草稿状态', () => {
  it('置位时把文档标成「有未保存修改」，关闭标签/窗口就会提示', () => {
    const { ctx, documents, editor } = makeContext()
    const store = createDocuments(ctx)

    store.setDocumentUnsavedDraft('kb:note-1', true)

    expect(documents.value['kb:note-1']?.unsavedDraft).toBe(true)
    // dirty 是关闭守卫（ClosingResource.dirty）看的标志：必须是 true
    expect(documents.value['kb:note-1']?.dirty).toBe(true)
    expect(editor.setNoteDirty).toHaveBeenLastCalledWith('kb', 'note-1', true)
  })

  it('标记清除后，dirty 回到「内容 vs 磁盘」的真实状态', () => {
    const { ctx, documents } = makeContext()
    const store = createDocuments(ctx)
    store.setDocumentUnsavedDraft('kb:note-1', true)

    store.setDocumentUnsavedDraft('kb:note-1', false)

    expect(documents.value['kb:note-1']?.unsavedDraft).toBe(false)
    // 内容仍等于磁盘内容 → 不再算未保存
    expect(documents.value['kb:note-1']?.dirty).toBe(false)
  })

  it('丢弃修改时一并清掉草稿标记', async () => {
    const { ctx, documents } = makeContext(makeSession({ unsavedDraft: true, dirty: true }))
    const store = createDocuments(ctx)

    await store.discardDocumentChanges('kb:note-1')

    expect(documents.value['kb:note-1']?.unsavedDraft).toBe(false)
    expect(documents.value['kb:note-1']?.dirty).toBe(false)
  })
})
