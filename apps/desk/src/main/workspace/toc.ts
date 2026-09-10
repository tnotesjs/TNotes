import {
  collectSubtreeNoteIndexes,
  findGroupLineIndex,
  findNoteLineIndex,
  readTocLines,
  type TocEntryRef
} from '@tnotesjs/kb'
import type {
  DeletePreviewDto,
  KnowledgeBaseDetail,
  TocCreateGroupRequest,
  TocDeleteRequest,
  TocEntryRefDto,
  TocMoveRequest,
  TocRenameGroupRequest
} from '../../shared/contracts'

import { applySnapshotMutation, type MutationSideEffects } from './mutations'
import { resolveNoteIndex } from './noteIo'
import type { KnowledgeBaseHandle } from './types'

function kbEntryRef(handle: KnowledgeBaseHandle, entry: TocEntryRefDto): TocEntryRef {
  if (entry.type === 'note') {
    return { type: 'note', index: resolveNoteIndex(handle, entry.noteUuid) }
  }
  if (entry.type === 'folder') {
    return { type: 'group', groupPath: entry.folderPath }
  }
  throw new Error('基于行号的 TOC 引用已不支持，请使用笔记/分组引用')
}

export async function moveToc(
  handle: KnowledgeBaseHandle,
  request: TocMoveRequest,
  effects: MutationSideEffects
): Promise<KnowledgeBaseDetail> {
  const result = await handle.workspace.toc.move({
    source: kbEntryRef(handle, request.source),
    target: kbEntryRef(handle, request.target),
    placement: request.placement
  })
  return applySnapshotMutation(handle, result, effects)
}

export async function createTocGroup(
  handle: KnowledgeBaseHandle,
  request: TocCreateGroupRequest,
  effects: MutationSideEffects
): Promise<KnowledgeBaseDetail> {
  const placement = request.placement
  const result = await handle.workspace.toc.createGroup({
    title: request.title,
    placement:
      !placement || placement.type === 'root'
        ? placement
        : placement.type === 'note'
          ? {
              type: 'note',
              targetIndex: resolveNoteIndex(handle, placement.targetNoteUuid),
              placement: placement.placement
            }
          : { type: 'group', groupPath: placement.folderPath, placement: placement.placement }
  })
  return applySnapshotMutation(handle, result, effects)
}

export async function renameTocGroup(
  handle: KnowledgeBaseHandle,
  request: TocRenameGroupRequest,
  effects: MutationSideEffects
): Promise<KnowledgeBaseDetail> {
  const result = await handle.workspace.toc.renameGroup({
    groupPath: request.folderPath,
    title: request.title
  })
  return applySnapshotMutation(handle, result, effects)
}

export async function previewDelete(
  handle: KnowledgeBaseHandle,
  knowledgeBaseId: string,
  entry: TocEntryRefDto
): Promise<DeletePreviewDto> {
  // 子树内的笔记 = 将随删除移除的笔记（kb 的 removeEntry 会一并删除笔记文件）。
  const ref = kbEntryRef(handle, entry)
  const lines = await readTocLines(handle.rootPath)
  const lineIndex =
    ref.type === 'note'
      ? findNoteLineIndex(lines, ref.index)
      : findGroupLineIndex(lines, ref.groupPath)
  const indexes = new Set(collectSubtreeNoteIndexes(lines, lineIndex))
  const notes: DeletePreviewDto['notes'] = handle.snapshot.notes
    .filter((meta) => indexes.has(meta.index))
    .map((meta) => ({
      noteUuid: meta.frontmatter.id ?? meta.index,
      index: meta.index,
      title: meta.title,
      directoryPath: `${handle.rootPath}/${meta.relPath}`
    }))
  return {
    knowledgeBaseId,
    entry,
    notes,
    filePaths: notes.map((note) => note.directoryPath),
    directoryPaths: [],
    untrackedFilePaths: [],
    snapshotRevision: handle.snapshot.revision
  }
}

export async function deleteToc(
  handle: KnowledgeBaseHandle,
  request: TocDeleteRequest,
  effects: MutationSideEffects
): Promise<KnowledgeBaseDetail> {
  const result = await handle.workspace.toc.removeEntry(kbEntryRef(handle, request.entry))
  return applySnapshotMutation(handle, result, effects)
}
