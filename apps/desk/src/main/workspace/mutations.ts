import type { KbSnapshot, MutationResult, NoteDoc } from '@tnotesjs/kb'
import type { KnowledgeBaseDetail, NoteMutationDto } from '../../shared/contracts'

import { toDetail, toNoteDocument } from './dto'
import type { KnowledgeBaseHandle, WorkspaceChangeHint } from './types'

export type MutationSideEffects = {
  markInternalWrites: (
    rootPath: string,
    changedFiles: Array<{ path: string; previousPath?: string }>
  ) => void
  emitChanged: (hint?: WorkspaceChangeHint) => void
}

export async function applyNoteMutation(
  handle: KnowledgeBaseHandle,
  result: MutationResult<NoteDoc>,
  effects: MutationSideEffects
): Promise<NoteMutationDto> {
  effects.markInternalWrites(handle.rootPath, result.changedFiles)
  const contentOnly = result.changedFiles.every((file) => file.kind === 'updated')
  const noteIndex = handle.snapshot.notes.findIndex((note) => note.index === result.value.index)
  if (contentOnly && noteIndex >= 0) {
    // Content-only save: TOC / config / file listing are untouched, so patch
    // the snapshot entry instead of rescanning every note in the kb.
    const notes = [...handle.snapshot.notes]
    notes[noteIndex] = { ...notes[noteIndex], frontmatter: result.value.frontmatter }
    handle.snapshot = { ...handle.snapshot, notes }
    effects.emitChanged({
      kind: 'content',
      knowledgeBaseId: handle.id,
      noteUuid: result.value.frontmatter.id ?? result.value.index
    })
  } else {
    handle.snapshot = await handle.workspace.scan()
    effects.emitChanged()
  }
  return {
    note: toNoteDocument(handle, result.value),
    knowledgeBase: toDetail(handle),
    changedFiles: result.changedFiles
  }
}

export function applySnapshotMutation(
  handle: KnowledgeBaseHandle,
  result: MutationResult<KbSnapshot>,
  effects: MutationSideEffects
): KnowledgeBaseDetail {
  effects.markInternalWrites(handle.rootPath, result.changedFiles)
  handle.snapshot = result.value
  effects.emitChanged()
  return toDetail(handle)
}
