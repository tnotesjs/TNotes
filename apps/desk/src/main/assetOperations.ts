/**
 * Main-process asset write coordinator: plan cache, dirty/Git gates, apply/restore.
 * Renderer submits plan IDs only.
 */

import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { BrowserWindow, ipcMain } from 'electron'

import {
  hashBytes,
  KbError,
  listAssetJournals,
  type AssetJournalRecord,
  type AssetOperationPlan,
  type AssetOperationResult,
  type AssetStorePaths
} from '@tnotesjs/kb'

import { IPC_CHANNELS } from '../shared/contracts'
import {
  assetWriteGate,
  reasonsFromEditorSnapshot,
  reasonsFromRecoveries,
  type AssetEditorSnapshot,
  type AssetWriteBlockReason
} from './assetWriteGate'
import { gitManager } from './gitManager'
import { loadRecoveries } from './recovery'
import { knowledgeBaseAssetStore } from './workspace/assetStore'
import { workspaceManager } from './workspaceManager'
import { encodeManager } from './encodeManager'
import { outputRelPath } from './imageEncode'

import type {
  AssetJournalDto,
  AssetOperationPlanDto,
  AssetOperationResultDto,
  AssetOptimizePreviewDto,
  AssetOptimizeSettings
} from '../shared/contracts'

const plans = new Map<string, { knowledgeBaseId: string; plan: AssetOperationPlan }>()
const planOutputs = new Map<string, Record<string, Uint8Array>>()
const GATE_TIMEOUT_MS = 2000

export interface AssetPrepareApplyEvent {
  knowledgeBaseId: string
  noteUuids: string[]
}

export interface AssetAppliedEvent {
  knowledgeBaseId: string
  noteUuids: string[]
  changedRelPaths: string[]
  revision: number
}

const assetRevisions = new Map<string, number>()

export function assetDisplayRevision(knowledgeBaseId: string): number {
  return assetRevisions.get(knowledgeBaseId) ?? 0
}

function bumpRevision(knowledgeBaseId: string): number {
  const next = (assetRevisions.get(knowledgeBaseId) ?? 0) + 1
  assetRevisions.set(knowledgeBaseId, next)
  return next
}

function toPlanDto(plan: AssetOperationPlan): AssetOperationPlanDto {
  return {
    id: plan.id,
    kind: plan.kind,
    generation: plan.generation,
    coverageComplete: plan.coverageComplete,
    blockedReasons: plan.blockedReasons,
    estimated: plan.estimated,
    moves: plan.moves.map((move) => ({
      fromRelPath: move.fromRelPath,
      toRelPath: move.toRelPath
    })),
    sourceRelPaths: [...new Set(plan.patches.map((patch) => patch.sourceRelPath))]
  }
}

function toHistoryDto(record: AssetJournalRecord): AssetJournalDto {
  return {
    planId: record.plan.id,
    kind: record.plan.kind,
    stage: record.stage,
    createdAt: record.createdAt,
    restorable: record.stage !== 'restored',
    estimated: record.plan.estimated,
    moves: record.plan.moves.map((move) => ({
      fromRelPath: move.fromRelPath,
      toRelPath: move.toRelPath
    }))
  }
}

function toResultDto(result: AssetOperationResult): AssetOperationResultDto {
  return {
    planId: result.planId,
    status: result.status,
    changedPaths: result.changedPaths,
    recoveryId: result.recoveryId,
    error: result.error
  }
}

function requireStore(knowledgeBaseId: string): {
  handle: ReturnType<typeof workspaceManager.getHandle>
  store: AssetStorePaths
} {
  const handle = workspaceManager.getHandle(knowledgeBaseId)
  const userDataDir = workspaceManager.assetUserDataDir()
  if (!userDataDir) {
    throw new KbError('INVALID_OPERATION', '资源 journal 目录尚未就绪')
  }
  return { handle, store: knowledgeBaseAssetStore(userDataDir, handle.rootPath) }
}

function rememberPlan(knowledgeBaseId: string, plan: AssetOperationPlan): AssetOperationPlanDto {
  plans.set(plan.id, { knowledgeBaseId, plan })
  return toPlanDto(plan)
}

export async function listAssetHistory(knowledgeBaseId: string): Promise<AssetJournalDto[]> {
  const { store } = requireStore(knowledgeBaseId)
  return (await listAssetJournals(store)).map(toHistoryDto)
}

function lookupPlan(knowledgeBaseId: string, planId: string): AssetOperationPlan {
  const stored = plans.get(planId)
  if (!stored || stored.knowledgeBaseId !== knowledgeBaseId) {
    throw new KbError('INVALID_OPERATION', '找不到该资源操作计划，请重新预览', { planId })
  }
  return stored.plan
}

export async function planAssetRename(input: {
  knowledgeBaseId: string
  fromRelPath: string
  toRelPath: string
  generation?: number
}): Promise<AssetOperationPlanDto> {
  const handle = workspaceManager.getHandle(input.knowledgeBaseId)
  const plan = await handle.workspace.assets.planRename({
    fromRelPath: input.fromRelPath,
    toRelPath: input.toRelPath,
    generation: input.generation
  })
  return rememberPlan(input.knowledgeBaseId, plan)
}

export async function planAssetRecycle(input: {
  knowledgeBaseId: string
  relPaths: string[]
  generation?: number
}): Promise<AssetOperationPlanDto> {
  const handle = workspaceManager.getHandle(input.knowledgeBaseId)
  const plan = await handle.workspace.assets.planRecycle({
    relPaths: input.relPaths,
    generation: input.generation
  })
  return rememberPlan(input.knowledgeBaseId, plan)
}

export async function planAssetMerge(input: {
  knowledgeBaseId: string
  keepRelPath: string
  dropRelPaths: string[]
  generation?: number
}): Promise<AssetOperationPlanDto> {
  const handle = workspaceManager.getHandle(input.knowledgeBaseId)
  const plan = await handle.workspace.assets.planMerge({
    keepRelPath: input.keepRelPath,
    dropRelPaths: input.dropRelPaths,
    generation: input.generation
  })
  return rememberPlan(input.knowledgeBaseId, plan)
}

async function encodeAssetFiles(
  knowledgeBaseId: string,
  relPaths: string[],
  options: AssetOptimizeSettings
): Promise<{
  preview: AssetOptimizePreviewDto
  outputs: Record<string, Uint8Array>
  items: Array<{
    fromRelPath: string
    toRelPath: string
    outputSha256: string
    bytesAfter: number
  }>
}> {
  if (options.encoder === 'oxipng') {
    throw new KbError('INVALID_OPERATION', 'oxipng 尚未接入，请使用 sharp 有损压缩')
  }
  const handle = workspaceManager.getHandle(knowledgeBaseId)
  const items: AssetOptimizePreviewDto['items'] = []
  const outputs: Record<string, Uint8Array> = {}
  const planItems: Array<{
    fromRelPath: string
    toRelPath: string
    outputSha256: string
    bytesAfter: number
  }> = []
  for (const relPath of relPaths) {
    const abs = path.join(handle.rootPath, relPath)
    if (!abs.startsWith(path.resolve(handle.rootPath) + path.sep)) {
      throw new KbError('INVALID_OPERATION', `资源路径越界: ${relPath}`)
    }
    const data = new Uint8Array(await fs.readFile(abs))
    const encoded = await encodeManager.encode(data, path.posix.basename(relPath), {
      quality: options.quality,
      maxDimension: options.maxDimension,
      outputFormat: options.outputFormat
    })
    if (encoded.skipped || !encoded.output || encoded.bytesAfter == null) {
      items.push({
        fromRelPath: relPath,
        toRelPath: relPath,
        bytesBefore: encoded.bytesBefore,
        ms: encoded.ms,
        skipped: encoded.skipped ?? '无法压缩',
        lossy: true,
        encoder: 'sharp',
        width: encoded.width,
        height: encoded.height,
        format: encoded.format
      })
      continue
    }
    const toRelPath = outputRelPath(relPath, encoded.outputExt ?? path.posix.extname(relPath))
    const mime = encoded.format === 'jpg' ? 'jpeg' : (encoded.format ?? 'webp')
    const previewDataUrl =
      encoded.output.byteLength <= 350_000
        ? `data:image/${mime};base64,${Buffer.from(encoded.output).toString('base64')}`
        : undefined
    items.push({
      fromRelPath: relPath,
      toRelPath,
      bytesBefore: encoded.bytesBefore,
      bytesAfter: encoded.bytesAfter,
      width: encoded.width,
      height: encoded.height,
      ms: encoded.ms,
      lossy: true,
      encoder: 'sharp',
      format: encoded.format,
      previewDataUrl
    })
    outputs[toRelPath] = encoded.output
    planItems.push({
      fromRelPath: relPath,
      toRelPath,
      outputSha256: hashBytes(encoded.output),
      bytesAfter: encoded.bytesAfter
    })
  }
  return {
    preview: {
      items,
      bytesBefore: items.reduce((sum, item) => sum + item.bytesBefore, 0),
      bytesAfter: items.reduce((sum, item) => sum + (item.bytesAfter ?? item.bytesBefore), 0),
      skippedCount: items.filter((item) => item.skipped).length
    },
    outputs,
    items: planItems
  }
}

export async function previewAssetOptimize(input: {
  knowledgeBaseId: string
  relPaths: string[]
  options: AssetOptimizeSettings
}): Promise<AssetOptimizePreviewDto> {
  const { preview } = await encodeAssetFiles(input.knowledgeBaseId, input.relPaths, input.options)
  return preview
}

export async function planAssetOptimize(input: {
  knowledgeBaseId: string
  relPaths: string[]
  options: AssetOptimizeSettings
  generation?: number
}): Promise<AssetOperationPlanDto> {
  const handle = workspaceManager.getHandle(input.knowledgeBaseId)
  const encoded = await encodeAssetFiles(input.knowledgeBaseId, input.relPaths, input.options)
  const plan = await handle.workspace.assets.planOptimize(encoded.items, input.generation)
  if (plan.blockedReasons.length === 0) {
    planOutputs.set(plan.id, encoded.outputs)
  }
  return rememberPlan(input.knowledgeBaseId, plan)
}

async function collectEditorSnapshots(knowledgeBaseId: string): Promise<AssetEditorSnapshot[]> {
  const windows = (BrowserWindow.getAllWindows?.() ?? []).filter(
    (window) => !window.isDestroyed() && !window.webContents.isDestroyed()
  )
  if (windows.length === 0) {
    throw new KbError('INVALID_OPERATION', '没有可校验的编辑器窗口，已拒绝资源写操作', {
      code: 'window-unresponsive'
    })
  }
  const requestId = randomUUID()
  const pending = new Map<number, AssetEditorSnapshot>()
  return await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup()
      reject(
        new KbError('INVALID_OPERATION', '有编辑器窗口未响应，已拒绝资源写操作', {
          code: 'window-unresponsive',
          replied: pending.size,
          expected: windows.length
        })
      )
    }, GATE_TIMEOUT_MS)
    const onReply = (
      event: Electron.IpcMainEvent,
      payload: { requestId?: string; knowledgeBaseId?: string; snapshot?: AssetEditorSnapshot }
    ): void => {
      if (payload?.requestId !== requestId || payload.knowledgeBaseId !== knowledgeBaseId) return
      if (!payload.snapshot) return
      pending.set(event.sender.id, payload.snapshot)
      if (pending.size >= windows.length) {
        cleanup()
        resolve([...pending.values()])
      }
    }
    const cleanup = (): void => {
      clearTimeout(timer)
      ipcMain.removeListener(IPC_CHANNELS.assetsGateReply, onReply)
    }
    ipcMain.on(IPC_CHANNELS.assetsGateReply, onReply)
    for (const window of windows) {
      window.webContents.send(IPC_CHANNELS.assetsGateQuery, { requestId, knowledgeBaseId })
    }
  })
}

function broadcast(channel: string, payload: unknown): void {
  for (const window of BrowserWindow.getAllWindows?.() ?? []) {
    if (!window.isDestroyed()) window.webContents.send(channel, payload)
  }
}

function noteUuidsForPlan(knowledgeBaseId: string, plan: AssetOperationPlan): string[] {
  const handle = workspaceManager.getHandle(knowledgeBaseId)
  const relPaths = new Set([
    ...plan.patches.map((patch) => patch.sourceRelPath),
    ...plan.backups.map((item) => item.relPath)
  ])
  return handle.snapshot.notes
    .filter((note) => relPaths.has(note.relPath))
    .map((note) => note.frontmatter.id ?? note.index)
}

async function collectBlockReasons(
  knowledgeBaseId: string,
  options: { allowIncompleteJournal?: boolean } = {}
): Promise<AssetWriteBlockReason[]> {
  const reasons: AssetWriteBlockReason[] = []
  if (assetWriteGate.hasAttachmentInFlight(knowledgeBaseId)) {
    reasons.push({
      code: 'attachment-in-flight',
      message: '正在写入本地附件，请等待完成后再整理资源'
    })
  }
  if (!options.allowIncompleteJournal && assetWriteGate.stickyReason(knowledgeBaseId)) {
    reasons.push({
      code: 'incomplete-journal',
      message: '该知识库有未完成的资源事务，请先恢复后再继续'
    })
  }
  const recoveries = await loadRecoveries(workspaceManager.getOverview().path)
  reasons.push(...reasonsFromRecoveries(knowledgeBaseId, recoveries))
  const snapshots = await collectEditorSnapshots(knowledgeBaseId)
  for (const snapshot of snapshots) reasons.push(...reasonsFromEditorSnapshot(snapshot))
  return reasons
}

function throwIfBlocked(reasons: AssetWriteBlockReason[]): void {
  if (reasons.length === 0) return
  const unique = [...new Map(reasons.map((reason) => [reason.message, reason])).values()]
  throw new KbError('INVALID_OPERATION', unique.map((reason) => reason.message).join('；'), {
    blockedReasons: unique
  })
}

async function runGuardedWrite(
  knowledgeBaseId: string,
  work: () => Promise<AssetOperationResult>,
  options: { allowIncompleteJournal?: boolean; noteUuids?: string[] } = {}
): Promise<AssetOperationResultDto> {
  gitManager.pauseForAssetWrite(knowledgeBaseId)
  assetWriteGate.beginTransaction(knowledgeBaseId)
  let keepPaused = false
  try {
    await gitManager.waitForIdle(knowledgeBaseId)
    throwIfBlocked(
      await collectBlockReasons(knowledgeBaseId, {
        allowIncompleteJournal: options.allowIncompleteJournal
      })
    )
    broadcast(IPC_CHANNELS.assetsPrepareApply, {
      knowledgeBaseId,
      noteUuids: options.noteUuids ?? []
    } satisfies AssetPrepareApplyEvent)
    const result = await work()
    keepPaused = result.status === 'needs-recovery' || result.status === 'failed'
    return toResultDto(result)
  } catch (error) {
    keepPaused = Boolean(assetWriteGate.stickyReason(knowledgeBaseId))
    throw error
  } finally {
    broadcast(IPC_CHANNELS.assetsApplySettled, {
      knowledgeBaseId,
      noteUuids: options.noteUuids ?? []
    })
    assetWriteGate.endTransaction(knowledgeBaseId)
    if (keepPaused) {
      assetWriteGate.setSticky(knowledgeBaseId, 'incomplete-journal')
      gitManager.pauseForAssetWrite(knowledgeBaseId)
    } else if (!assetWriteGate.isLocked(knowledgeBaseId)) {
      gitManager.resumeAfterAssetWrite(knowledgeBaseId)
    }
  }
}

export async function applyAssetPlan(
  knowledgeBaseId: string,
  planId: string
): Promise<AssetOperationResultDto> {
  const plan = lookupPlan(knowledgeBaseId, planId)
  if (plan.blockedReasons.length > 0) {
    throw new KbError('INVALID_OPERATION', plan.blockedReasons.join('；'), {
      blockedReasons: plan.blockedReasons
    })
  }
  const { handle, store } = requireStore(knowledgeBaseId)
  const noteUuids = noteUuidsForPlan(knowledgeBaseId, plan)
  const dto = await runGuardedWrite(
    knowledgeBaseId,
    async () => {
      const result = await handle.workspace.assets.applyPlan(plan, store, {
        outputFiles: planOutputs.get(plan.id)
      })
      if (result.status === 'applied') {
        workspaceManager.markAssetMutation(handle.rootPath, result.changedPaths)
        for (const noteUuid of noteUuids) {
          workspaceManager.emitNoteExternalChanged(knowledgeBaseId, noteUuid)
        }
        const revision = bumpRevision(knowledgeBaseId)
        broadcast(IPC_CHANNELS.assetsApplied, {
          knowledgeBaseId,
          noteUuids,
          changedRelPaths: result.changedPaths,
          revision
        } satisfies AssetAppliedEvent)
      }
      await workspaceManager.syncAssetWriteHolds()
      return result
    },
    { noteUuids }
  )
  return dto
}

export async function restoreAssetPlan(
  knowledgeBaseId: string,
  planId: string
): Promise<AssetOperationResultDto> {
  const { handle, store } = requireStore(knowledgeBaseId)
  const stored = plans.get(planId)
  const noteUuids = stored ? noteUuidsForPlan(knowledgeBaseId, stored.plan) : []
  return runGuardedWrite(
    knowledgeBaseId,
    async () => {
      const result = await handle.workspace.assets.restorePlan(planId, store)
      if (result.status === 'applied') {
        workspaceManager.markAssetMutation(handle.rootPath, result.changedPaths)
        for (const noteUuid of noteUuids) {
          workspaceManager.emitNoteExternalChanged(knowledgeBaseId, noteUuid)
        }
        const revision = bumpRevision(knowledgeBaseId)
        broadcast(IPC_CHANNELS.assetsApplied, {
          knowledgeBaseId,
          noteUuids,
          changedRelPaths: result.changedPaths,
          revision
        } satisfies AssetAppliedEvent)
      }
      await workspaceManager.syncAssetWriteHolds()
      return result
    },
    { allowIncompleteJournal: true, noteUuids }
  )
}
