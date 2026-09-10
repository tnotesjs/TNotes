import { ref } from 'vue'

interface PendingEdit {
  knowledgeBaseId?: () => string
  noteUuid?: () => string
  dirty(): boolean
  flush(): void
}

const editors = new Set<PendingEdit>()
const version = ref(0)

export function registerPendingEdit(editor: PendingEdit): {
  changed(): void
  dispose(): void
} {
  editors.add(editor)
  version.value += 1
  return {
    changed: () => {
      version.value += 1
    },
    dispose: () => {
      editors.delete(editor)
      version.value += 1
    }
  }
}

function matching(knowledgeBaseId: string, noteUuid: string): PendingEdit[] {
  return [...editors].filter(
    (editor) => editor.knowledgeBaseId?.() === knowledgeBaseId && editor.noteUuid?.() === noteUuid
  )
}

export function hasPendingEdits(knowledgeBaseId: string, noteUuid: string): boolean {
  // Block-local drafts are not part of the document until their Edit panel commits.
  void version.value
  return matching(knowledgeBaseId, noteUuid).some((editor) => editor.dirty())
}

export function pendingEditNoteUuids(knowledgeBaseId: string): string[] {
  void version.value
  const uuids = new Set<string>()
  for (const editor of editors) {
    if (editor.knowledgeBaseId?.() === knowledgeBaseId && editor.dirty()) {
      const noteUuid = editor.noteUuid?.()
      if (noteUuid) uuids.add(noteUuid)
    }
  }
  return [...uuids]
}

export function flushPendingEdits(
  knowledgeBaseId: string,
  noteUuid: string,
  options: { requireClean?: boolean } = {}
): void {
  for (const editor of matching(knowledgeBaseId, noteUuid)) {
    if (editors.has(editor) && editor.dirty()) editor.flush()
  }
  if (options.requireClean === false) return
  if (hasPendingEdits(knowledgeBaseId, noteUuid)) {
    throw new Error('块内编辑尚未提交，请先完成编辑后再关闭标签页。')
  }
}
