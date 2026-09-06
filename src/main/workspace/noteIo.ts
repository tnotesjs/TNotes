import path from 'node:path'
import fs from 'node:fs/promises'
import prettier from 'prettier'

import {
  KbError,
  parseNoteContent,
  serializeNoteContent,
  type NoteFrontmatter,
  type Placement
} from '@tnotesjs/kb'
import { loadSettings, settingsForKnowledgeBase } from '../settings'

import type {
  AttachmentWriteLocalRequest,
  AttachmentWriteLocalResult,
  NoteCreateRequest,
  NoteDocumentDto,
  NoteMutationDto,
  NoteRenameRequest,
  NoteSaveRequest,
  NoteUpdateConfigRequest
} from '../../shared/contracts'

import { toNoteDocument } from './dto'
import { applyNoteMutation, type MutationSideEffects } from './mutations'
import type { KnowledgeBaseHandle } from './types'

export type { MutationSideEffects as NoteMutationSideEffects }

/** Renderer-facing identity is the frontmatter uuid; resolve to the kb index. */
export function resolveNoteIndex(handle: KnowledgeBaseHandle, noteUuid: string): string {
  const note = handle.snapshot.notes.find(
    (item) => item.frontmatter.id === noteUuid || item.index === noteUuid
  )
  if (!note) throw new KbError('NOTE_NOT_FOUND', `笔记不存在: ${noteUuid}`, { noteUuid })
  return note.index
}

function toKbPlacement(
  handle: KnowledgeBaseHandle,
  placement: NoteCreateRequest['placement']
): Placement | undefined {
  if (!placement || placement.type === 'root') return placement
  if (placement.type === 'note') {
    return {
      type: 'note',
      targetIndex: resolveNoteIndex(handle, placement.targetNoteUuid),
      placement: placement.placement
    }
  }
  return { type: 'group', groupPath: placement.folderPath, placement: placement.placement }
}

export async function readNote(
  handle: KnowledgeBaseHandle,
  noteUuid: string
): Promise<NoteDocumentDto> {
  return toNoteDocument(
    handle,
    await handle.workspace.notes.read(resolveNoteIndex(handle, noteUuid))
  )
}

export function resolveNotesTable(
  handle: KnowledgeBaseHandle,
  ids: string[]
): {
  notes: Array<{
    id: string
    title: string
    description: string
    noteUuid: string | null
  }>
  missingIds: string[]
} {
  const byIndex = new Map(handle.snapshot.notes.map((note) => [note.index, note]))
  const missingIds: string[] = []
  const notes: Array<{
    id: string
    title: string
    description: string
    noteUuid: string | null
  }> = []

  for (const id of ids) {
    const note = byIndex.get(id)
    if (!note) {
      missingIds.push(id)
      continue
    }
    notes.push({
      id,
      title: note.title,
      description: note.frontmatter.description ?? '',
      noteUuid: note.frontmatter.id ?? note.index
    })
  }

  return { notes, missingIds }
}

/** Keep only whitelist keys; pin id from the snapshot so a lost atom cannot drop giscus mapping. */
function normalizeWhitelistedFrontmatter(
  content: string,
  existing?: NoteFrontmatter
): string {
  const { frontmatter, body } = parseNoteContent(content)
  return serializeNoteContent(
    {
      id: existing?.id ?? frontmatter.id,
      description: frontmatter.description ?? existing?.description
    },
    body
  )
}

export async function saveNote(
  handle: KnowledgeBaseHandle,
  request: NoteSaveRequest,
  effects: MutationSideEffects
): Promise<NoteMutationDto> {
  const settings = loadSettings()
  const override = settingsForKnowledgeBase(settings, handle.id)
  const usePrettier = request.prettier ?? override.prettier ?? settings.prettier
  let content = request.content
  if (usePrettier) {
    try {
      content = await prettier.format(request.content, { parser: 'markdown' })
    } catch {
      // 格式失败不阻塞保存（原文落盘）。
      content = request.content
    }
  }
  const index = resolveNoteIndex(handle, request.noteUuid)
  const existing = handle.snapshot.notes.find((note) => note.index === index)?.frontmatter
  content = normalizeWhitelistedFrontmatter(content, existing)
  const result = await handle.workspace.notes.save({
    index,
    content,
    expectedRevision: request.expectedRevision
  })
  return applyNoteMutation(handle, result, effects)
}

export async function createNote(
  handle: KnowledgeBaseHandle,
  request: NoteCreateRequest,
  effects: MutationSideEffects
): Promise<NoteMutationDto> {
  const result = await handle.workspace.notes.create({
    title: request.title,
    placement: toKbPlacement(handle, request.placement)
  })
  return applyNoteMutation(handle, result, effects)
}

export async function renameNote(
  handle: KnowledgeBaseHandle,
  request: NoteRenameRequest,
  effects: MutationSideEffects
): Promise<NoteMutationDto> {
  const result = await handle.workspace.notes.rename({
    index: resolveNoteIndex(handle, request.noteUuid),
    title: request.title
  })
  return applyNoteMutation(handle, result, effects)
}

export async function updateNoteConfig(
  handle: KnowledgeBaseHandle,
  request: NoteUpdateConfigRequest,
  effects: MutationSideEffects
): Promise<NoteMutationDto> {
  const index = resolveNoteIndex(handle, request.noteUuid)
  const { done, ...frontmatterUpdates } = request.updates

  // done 归 TOC 复选框所有；description 归 frontmatter。
  if (typeof done === 'boolean') {
    await handle.workspace.toc.setDone({ index, done })
  }
  const result = await handle.workspace.notes.setFrontmatter({
    index,
    updates: frontmatterUpdates,
    expectedRevision: request.expectedRevision
  })
  return applyNoteMutation(handle, result, effects)
}

export async function writeLocalAttachment(
  handle: KnowledgeBaseHandle,
  request: AttachmentWriteLocalRequest,
  effects: MutationSideEffects
): Promise<AttachmentWriteLocalResult> {
  const result = await handle.workspace.assets.add({
    fileName: request.fileName,
    data: request.data
  })
  const absolutePath = path.join(handle.rootPath, result.relPath)
  effects.markInternalWrites([{ path: result.relPath }])
  handle.snapshot = await handle.workspace.scan()
  effects.emitChanged()
  return { absolutePath, markdownPath: result.markdownPath }
}

const IMAGE_EXTENSIONS = new Set([
  '.avif',
  '.bmp',
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.webp'
])

/**
 * Resolve an editor image reference to an absolute path. New-architecture
 * references are kb-level (`../assets/x.png`); resolution is confined to the
 * kb root.
 */
export async function resolveNoteAsset(
  handle: KnowledgeBaseHandle,
  requestedPath: string
): Promise<string> {
  const normalized = requestedPath.replaceAll('\\', '/')
  const match = normalized.match(/^(?:\.\.\/|\.\/)?(assets\/.+)$/)
  if (!match) throw new Error('不支持的资源路径')
  const absolutePath = path.resolve(handle.rootPath, match[1])
  if (!absolutePath.startsWith(path.resolve(handle.rootPath) + path.sep)) {
    throw new Error('资源路径越界')
  }
  const extension = path.extname(absolutePath).toLocaleLowerCase()
  if (!IMAGE_EXTENSIONS.has(extension)) throw new Error('不支持的图片类型')
  const stat = await fs.stat(absolutePath)
  if (!stat.isFile()) throw new Error('图片不存在')
  return absolutePath
}
