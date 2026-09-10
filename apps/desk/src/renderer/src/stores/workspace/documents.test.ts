// @vitest-environment happy-dom

import { ref } from 'vue'

import { describe, expect, it, vi } from 'vitest'

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
    ...overrides
  } as unknown as DocumentSession
}

function makeContext(session: DocumentSession) {
  const documents = ref<Record<string, DocumentSession>>({ 'kb:note-1': session })
  const error = ref<string | null>(null)
  const status = ref<string | null>(null)
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
    deleteRecovery: vi.fn()
  } as unknown as DocumentsContext
  return { ctx, documents, editor: ctx.editor as { setNoteDirty: ReturnType<typeof vi.fn> } }
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
