import type { KbSnapshot, MutationResult, NoteDoc } from '@tnotesjs/kb'
import type { KnowledgeBaseDetail, NoteMutationDto } from '../../shared/contracts'

import { toDetail, toNoteDocument } from './dto'
import type { KnowledgeBaseHandle } from './types'

export type MutationSideEffects = {
  markInternalWrites: (changedFiles: Array<{ path: string; previousPath?: string }>) => void
  emitChanged: () => void
}

export async function applyNoteMutation(
  handle: KnowledgeBaseHandle,
  result: MutationResult<NoteDoc>,
  effects: MutationSideEffects
): Promise<NoteMutationDto> {
  effects.markInternalWrites(result.changedFiles)
  handle.snapshot = await handle.workspace.scan()
  effects.emitChanged()
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
  effects.markInternalWrites(result.changedFiles)
  handle.snapshot = result.value
  effects.emitChanged()
  return toDetail(handle)
}
