import { EventEmitter } from 'node:events'
import { randomUUID } from 'node:crypto'
import { watch, type FSWatcher } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createWorkspace } from '@tnotesjs/kb'

import { deskLog } from '../log'

import { knowledgeBaseId } from './dto'
import { KNOWLEDGE_BASE_NAME, type KnowledgeBaseHandle, type WorkspaceManagerEvents } from './types'

/** Mutable runtime state shared between WorkspaceManager and scan/watch helpers. */
export interface WorkspaceScanState {
  handles: Map<string, KnowledgeBaseHandle>
  workspacePath: string | null
  watchers: Map<string, FSWatcher>
  refreshTimer: NodeJS.Timeout | null
  scanTail: Promise<void>
  internalWriteUntil: Map<string, number>
  lastWatcherError: string
  lastWatcherErrorAt: number
  events: EventEmitter<WorkspaceManagerEvents>
  emitChanged: () => void
}

export function markInternalWrites(
  state: WorkspaceScanState,
  changedFiles: Array<{ path: string; previousPath?: string }>
): void {
  const until = Date.now() + 1500
  for (const changed of changedFiles) {
    state.internalWriteUntil.set(path.normalize(changed.path), until)
    if (changed.previousPath) {
      state.internalWriteUntil.set(path.normalize(changed.previousPath), until)
    }
  }
}

/**
 * Hand-written notes may lack a frontmatter id (the renderer identity and the
 * comment mapping key). Backfill once, logged, idempotent.
 */
async function backfillMissingNoteIds(handle: KnowledgeBaseHandle): Promise<void> {
  const missing = handle.snapshot.notes.filter((note) => !note.frontmatter.id)
  for (const note of missing) {
    try {
      await handle.workspace.notes.setFrontmatter({
        index: note.index,
        updates: { id: randomUUID() }
      })
      deskLog('workspace', 'backfilled note id', { relPath: note.relPath })
    } catch (error) {
      deskLog(
        'workspace',
        'note id backfill failed',
        error instanceof Error ? error.message : String(error)
      )
    }
  }
  if (missing.length > 0) {
    handle.snapshot = await handle.workspace.scan()
  }
}

export async function scan(state: WorkspaceScanState): Promise<void> {
  if (!state.workspacePath) return
  const entries = await fs.readdir(state.workspacePath, { withFileTypes: true })
  const candidates = entries
    .filter((entry) => entry.isDirectory() && KNOWLEDGE_BASE_NAME.test(entry.name))
    .sort((left, right) => left.name.localeCompare(right.name))
  const previousByPath = new Map(
    [...state.handles.values()].map((handle) => [handle.rootPath, handle])
  )
  const next = new Map<string, KnowledgeBaseHandle>()

  for (const candidate of candidates) {
    const rootPath = path.join(state.workspacePath, candidate.name)
    const existing = previousByPath.get(rootPath)
    const workspace = existing?.workspace ?? createWorkspace({ rootPath })
    const handle: KnowledgeBaseHandle = {
      id: existing?.id ?? knowledgeBaseId(rootPath),
      name: candidate.name,
      rootPath,
      workspace,
      snapshot: await workspace.scan()
    }
    await backfillMissingNoteIds(handle)
    next.set(handle.id, handle)
    previousByPath.delete(rootPath)
  }

  state.handles = next
  syncKnowledgeBaseWatchers(state)
  deskLog('workspace', 'scan complete', {
    path: state.workspacePath,
    knowledgeBases: next.size
  })
}

export async function enqueueScan(state: WorkspaceScanState): Promise<void> {
  state.scanTail = state.scanTail
    .then(() => scan(state))
    .catch((error) => {
      deskLog('workspace', 'scan failed', error instanceof Error ? error.message : String(error))
    })
  await state.scanTail
}

export function startWatchers(state: WorkspaceScanState, workspacePath: string): void {
  createWatcher(state, 'workspace', workspacePath, false, (_event, fileName) => {
    if (!fileName) return
    const [topLevelName] = fileName.toString().split(path.sep)
    if (topLevelName && KNOWLEDGE_BASE_NAME.test(topLevelName)) {
      scheduleRefresh(state)
    }
  })
  syncKnowledgeBaseWatchers(state)
}

function createWatcher(
  state: WorkspaceScanState,
  key: string,
  targetPath: string,
  recursive: boolean,
  listener: (eventType: 'rename' | 'change', fileName: string | null) => void
): void {
  if (state.watchers.has(key)) return
  let watcher: FSWatcher
  try {
    watcher = watch(targetPath, { recursive }, listener)
  } catch (error) {
    logWatcherError(state, error)
    return
  }
  watcher.on('error', (error) => logWatcherError(state, error))
  state.watchers.set(key, watcher)
}

function logWatcherError(state: WorkspaceScanState, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  const now = Date.now()
  if (message !== state.lastWatcherError || now - state.lastWatcherErrorAt > 5000) {
    state.lastWatcherError = message
    state.lastWatcherErrorAt = now
    deskLog('workspace:watcher', 'error', message)
  }
}

export function syncKnowledgeBaseWatchers(state: WorkspaceScanState): void {
  if (!state.workspacePath || !state.watchers.has('workspace')) return
  const expectedKeys = new Set(['workspace'])
  for (const handle of state.handles.values()) {
    const key = `knowledge-base:${handle.rootPath}`
    expectedKeys.add(key)
    createWatcher(state, key, handle.rootPath, true, (_event, fileName) => {
      if (!fileName) return
      const relativePath = fileName.toString()
      if (shouldIgnoreKnowledgeBasePath(relativePath)) return
      handleWatchedPath(state, handle, path.join(handle.rootPath, relativePath))
    })
  }

  for (const [key, watcher] of state.watchers) {
    if (!expectedKeys.has(key)) {
      watcher.close()
      state.watchers.delete(key)
    }
  }
}

function shouldIgnoreKnowledgeBasePath(relativePath: string): boolean {
  const segments = relativePath.split(path.sep).filter(Boolean)
  return segments.some((segment) => {
    return (
      segment === '.git' ||
      segment === 'node_modules' ||
      segment === 'dist' ||
      segment === '.tnotes'
    )
  })
}

function handleWatchedPath(
  state: WorkspaceScanState,
  handle: KnowledgeBaseHandle,
  changedPath: string
): void {
  const normalizedPath = path.normalize(changedPath)
  const internalUntil = state.internalWriteUntil.get(normalizedPath) ?? 0
  if (internalUntil >= Date.now()) return
  state.internalWriteUntil.delete(normalizedPath)

  for (const note of handle.snapshot.notes) {
    if (path.normalize(path.join(handle.rootPath, note.relPath)) === normalizedPath) {
      state.events.emit('noteExternalChanged', {
        knowledgeBaseId: handle.id,
        noteUuid: note.frontmatter.id ?? note.index
      })
      break
    }
  }
  scheduleRefresh(state)
}

export function scheduleRefresh(state: WorkspaceScanState): void {
  if (state.refreshTimer) clearTimeout(state.refreshTimer)
  state.refreshTimer = setTimeout(() => {
    state.refreshTimer = null
    void enqueueScan(state).then(() => state.emitChanged())
  }, 250)
}

export async function stopWatcher(state: WorkspaceScanState): Promise<void> {
  for (const watcher of state.watchers.values()) watcher.close()
  state.watchers.clear()
}

export async function disposeHandles(state: WorkspaceScanState): Promise<void> {
  state.handles.clear()
}
