/**
 * Apply / restore asset plans. Large binaries are streamed and hashed; text
 * patches reuse applyAtomicWrites. Journal lives outside the knowledge base.
 */

import { createHash, randomUUID } from 'node:crypto'
import { constants as fsConstants } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

import { applyAtomicWrites } from '../atomic'
import { KbError } from '../errors'
import { ASSETS_DIR } from '../constants'
import { copyFileStreaming, hashFile, writeFileStreaming } from './hash'
import { fingerprintRefs, planMerge, planRecycle, planRename } from './plan'
import { scanAssets } from './scan'

import type {
  AssetJournalRecord,
  AssetJournalStage,
  AssetOperationPlan,
  AssetOperationResult,
  AssetSourcePatch
} from './types'

export interface AssetStorePaths {
  journalDir: string
  recycleDir: string
}

export interface ApplyAssetPlanOptions {
  /** Test-only: stop after this stage is persisted, before further mutation. */
  crashAfter?: AssetJournalStage
  /** Optimize payloads keyed by output relPath. Persisted into journal/outputs. */
  outputFiles?: Record<string, Uint8Array>
}

export function runSerializedAssetWork<T>(rootPath: string, work: () => Promise<T>): Promise<T> {
  return enqueue(rootPath, work)
}

const tails = new Map<string, Promise<unknown>>()

function enqueue<T>(rootPath: string, work: () => Promise<T>): Promise<T> {
  const key = path.resolve(rootPath)
  const previous = tails.get(key) ?? Promise.resolve()
  const run = previous.then(work, work)
  tails.set(
    key,
    run.then(
      () => undefined,
      () => undefined
    )
  )
  return run
}

export function applyPatchesToText(text: string, patches: AssetSourcePatch[]): string {
  const ordered = [...patches].sort((a, b) => b.startOffset - a.startOffset)
  let next = text
  for (const patch of ordered) {
    const actual = next.slice(patch.startOffset, patch.endOffset)
    if (actual !== patch.expected) {
      throw new KbError('REVISION_CONFLICT', `引用补丁已过期: ${patch.sourceRelPath}`, {
        expected: patch.expected,
        actual
      })
    }
    next = `${next.slice(0, patch.startOffset)}${patch.replacement}${next.slice(patch.endOffset)}`
  }
  return next
}

export async function fillPlanHashes(
  rootPath: string,
  plan: AssetOperationPlan
): Promise<AssetOperationPlan> {
  const inputHashes: Record<string, string> = {}
  for (const relPath of Object.keys(plan.inputHashes)) {
    inputHashes[relPath] = await hashFile(path.join(rootPath, relPath))
  }
  const backups = await Promise.all(
    plan.backups.map(async (item) => ({
      relPath: item.relPath,
      sha256: inputHashes[item.relPath] ?? (await hashFile(path.join(rootPath, item.relPath)))
    }))
  )
  const moves = await Promise.all(
    plan.moves.map(async (move) => ({
      ...move,
      sha256: inputHashes[move.fromRelPath] ?? (await hashFile(path.join(rootPath, move.fromRelPath)))
    }))
  )
  return { ...plan, inputHashes, backups, moves }
}

function journalRoot(store: AssetStorePaths, planId: string): string {
  return path.join(store.journalDir, planId)
}

function backupFile(store: AssetStorePaths, planId: string, relPath: string): string {
  return path.join(journalRoot(store, planId), 'files', relPath)
}

function recycleFile(store: AssetStorePaths, planId: string, relPath: string): string {
  return path.join(store.recycleDir, planId, relPath)
}

function outputFile(store: AssetStorePaths, planId: string, relPath: string): string {
  return path.join(journalRoot(store, planId), 'outputs', relPath)
}

function normalizePlan(plan: AssetOperationPlan): AssetOperationPlan {
  return {
    ...plan,
    outputs: plan.outputs ?? [],
    createdRelPaths: plan.createdRelPaths ?? []
  }
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, fsConstants.F_OK)
    return true
  } catch {
    return false
  }
}

async function writeJournal(store: AssetStorePaths, record: AssetJournalRecord): Promise<void> {
  const dir = journalRoot(store, record.plan.id)
  await fs.mkdir(dir, { recursive: true })
  const staged = path.join(dir, `.manifest.${randomUUID()}.tmp`)
  await fs.writeFile(staged, `${JSON.stringify(record, null, 2)}\n`)
  const handle = await fs.open(staged, 'r+')
  try {
    await handle.sync()
  } finally {
    await handle.close()
  }
  await fs.rename(staged, path.join(dir, 'manifest.json'))
}

async function readJournal(
  store: AssetStorePaths,
  planId: string
): Promise<AssetJournalRecord | null> {
  try {
    const raw = await fs.readFile(path.join(journalRoot(store, planId), 'manifest.json'), 'utf8')
    return journalWithPlan(JSON.parse(raw) as AssetJournalRecord)
  } catch {
    return null
  }
}

function journalWithPlan(record: AssetJournalRecord): AssetJournalRecord {
  return { ...record, plan: normalizePlan(record.plan) }
}

class PlannedCrash extends Error {
  readonly stage: AssetJournalStage
  constructor(stage: AssetJournalStage) {
    super(`ASSET_PLANNED_CRASH:${stage}`)
    this.name = 'PlannedCrash'
    this.stage = stage
  }
}

function maybeHardCrash(stage: AssetJournalStage): void {
  if (process.env.TNOTES_ASSET_CRASH_AFTER === stage) {
    process.exit(1)
  }
}

async function persistStage(
  store: AssetStorePaths,
  record: AssetJournalRecord,
  stage: AssetJournalStage,
  crashAfter?: AssetJournalStage
): Promise<AssetJournalRecord> {
  const next = { ...record, stage }
  await writeJournal(store, next)
  maybeHardCrash(stage)
  if (crashAfter === stage) throw new PlannedCrash(stage)
  return next
}

async function verifyPlanFresh(rootPath: string, plan: AssetOperationPlan): Promise<void> {
  if (plan.blockedReasons.length > 0) {
    throw new KbError('INVALID_OPERATION', plan.blockedReasons.join('；'), {
      blockedReasons: plan.blockedReasons
    })
  }
  for (const [relPath, expected] of Object.entries(plan.inputHashes)) {
    const actual = await hashFile(path.join(rootPath, relPath))
    if (actual !== expected) {
      throw new KbError('REVISION_CONFLICT', `计划已过期: ${relPath} 已改变`)
    }
  }
  const report = await scanAssets(rootPath, {
    generation: plan.generation,
    includeHashes: plan.kind === 'merge'
  })
  if (report.coverageComplete !== plan.coverageComplete) {
    throw new KbError('REVISION_CONFLICT', '扫描覆盖已变化，请重新生成计划')
  }
  if (plan.kind === 'rename' && plan.moves[0]?.toRelPath) {
    const again = planRename(report, {
      fromRelPath: plan.moves[0].fromRelPath,
      toRelPath: plan.moves[0].toRelPath
    })
    if (again.blockedReasons.length > 0) {
      throw new KbError('INVALID_OPERATION', again.blockedReasons.join('；'), {
        blockedReasons: again.blockedReasons
      })
    }
    if (again.refFingerprint !== plan.refFingerprint) {
      throw new KbError('REVISION_CONFLICT', '引用来源已增减，请重新生成计划')
    }
  }
  if (plan.kind === 'recycle') {
    const again = planRecycle(
      report,
      plan.moves.map((move) => move.fromRelPath)
    )
    if (again.blockedReasons.length > 0) {
      throw new KbError('INVALID_OPERATION', again.blockedReasons.join('；'), {
        blockedReasons: again.blockedReasons
      })
    }
  }
  if (plan.kind === 'merge') {
    const drops = new Set(plan.moves.map((move) => move.fromRelPath))
    const keepRelPath = Object.keys(plan.inputHashes).find(
      (relPath) => relPath.startsWith(`${ASSETS_DIR}/`) && !drops.has(relPath)
    )
    if (!keepRelPath) throw new KbError('INVALID_OPERATION', '合并计划缺少保留文件')
    const again = planMerge(report, { keepRelPath, dropRelPaths: [...drops] })
    if (again.blockedReasons.length > 0) {
      throw new KbError('INVALID_OPERATION', again.blockedReasons.join('；'), {
        blockedReasons: again.blockedReasons
      })
    }
    if (again.refFingerprint !== plan.refFingerprint) {
      throw new KbError('REVISION_CONFLICT', '引用来源已增减，请重新生成计划')
    }
  }
  if (plan.kind === 'optimize') {
    const fromPaths = plan.outputs.map((item) => item.fromRelPath ?? item.relPath)
    const refs = report.references.filter(
      (ref) => fromPaths.includes(ref.targetRelPath ?? '') && ref.rewritable
    )
    if (plan.patches.length > 0 && fingerprintRefs(refs) !== plan.refFingerprint) {
      throw new KbError('REVISION_CONFLICT', '引用来源已增减，请重新生成计划')
    }
    for (const created of plan.createdRelPaths) {
      const destAbs = path.join(rootPath, created)
      if (await pathExists(destAbs)) {
        throw new KbError('INVALID_OPERATION', `目标已存在: ${created}`)
      }
    }
  }
}

async function allBackupsPresent(store: AssetStorePaths, plan: AssetOperationPlan): Promise<boolean> {
  if (plan.backups.length === 0) return false
  for (const item of plan.backups) {
    if (!(await pathExists(backupFile(store, plan.id, item.relPath)))) return false
  }
  return true
}

async function backupPlanFiles(
  rootPath: string,
  plan: AssetOperationPlan,
  store: AssetStorePaths
): Promise<void> {
  for (const item of plan.backups) {
    const from = path.join(rootPath, item.relPath)
    const to = backupFile(store, plan.id, item.relPath)
    const digest = await copyFileStreaming(from, to)
    if (digest !== item.sha256) {
      throw new KbError('REVISION_CONFLICT', `备份时文件已改变: ${item.relPath}`)
    }
  }
  if (plan.kind === 'recycle' || plan.kind === 'merge' || plan.moves.some((move) => !move.toRelPath)) {
    for (const move of plan.moves) {
      const from = path.join(rootPath, move.fromRelPath)
      const to = recycleFile(store, plan.id, move.fromRelPath)
      const digest = await copyFileStreaming(from, to)
      if (digest !== move.sha256) {
        throw new KbError('REVISION_CONFLICT', `回收备份时文件已改变: ${move.fromRelPath}`)
      }
    }
  }
}

async function applyMutations(
  rootPath: string,
  plan: AssetOperationPlan,
  store: AssetStorePaths
): Promise<string[]> {
  const changed: string[] = []
  if (plan.kind === 'rename') {
    const move = plan.moves[0]
    if (!move?.toRelPath) throw new KbError('INVALID_OPERATION', '重命名计划缺少目标路径')
    const destAbs = path.join(rootPath, move.toRelPath)
    if (await pathExists(destAbs)) {
      throw new KbError('INVALID_OPERATION', `目标已存在: ${move.toRelPath}`)
    }
    await copyFileStreaming(path.join(rootPath, move.fromRelPath), destAbs)
    changed.push(move.toRelPath)
  }

  if (plan.kind === 'optimize') {
    for (const output of plan.outputs) {
      const from = outputFile(store, plan.id, output.relPath)
      const digest = await copyFileStreaming(from, path.join(rootPath, output.relPath))
      if (digest !== output.sha256) {
        throw new KbError('REVISION_CONFLICT', `优化产物校验失败: ${output.relPath}`)
      }
      changed.push(output.relPath)
    }
  }

  const bySource = new Map<string, AssetSourcePatch[]>()
  for (const patch of plan.patches) {
    const list = bySource.get(patch.sourceRelPath) ?? []
    list.push(patch)
    bySource.set(patch.sourceRelPath, list)
  }
  const writes = []
  for (const [relPath, patches] of bySource) {
    const abs = path.join(rootPath, relPath)
    const text = await fs.readFile(abs, 'utf8')
    writes.push({ path: abs, data: applyPatchesToText(text, patches) })
    changed.push(relPath)
  }
  if (writes.length > 0) await applyAtomicWrites(writes)

  for (const move of plan.moves) {
    if (plan.kind === 'rename' || !move.toRelPath) {
      await fs.rm(path.join(rootPath, move.fromRelPath), { force: false })
      changed.push(move.fromRelPath)
    }
  }
  return [...new Set(changed)]
}

async function applyAssetPlanUnlocked(
  rootPath: string,
  plan: AssetOperationPlan,
  store: AssetStorePaths,
  options: ApplyAssetPlanOptions
): Promise<AssetOperationResult> {
  if (plan.blockedReasons.length > 0) {
    return {
      planId: plan.id,
      status: 'blocked',
      changedPaths: [],
      error: plan.blockedReasons.join('；')
    }
  }

  const incomplete = (await listIncompleteJournals(store)).filter(
    (record) => path.resolve(record.rootPath) === path.resolve(rootPath)
  )
  if (incomplete.some((record) => record.plan.id === plan.id)) {
    return {
      planId: plan.id,
      status: 'needs-recovery',
      changedPaths: [],
      recoveryId: plan.id,
      error: '该计划有未完成事务，请先恢复'
    }
  }
  const other = incomplete.find((record) => record.plan.id !== plan.id)
  if (other) {
    return {
      planId: plan.id,
      status: 'needs-recovery',
      changedPaths: [],
      recoveryId: other.plan.id,
      error: '存在未完成的资源事务，请先恢复'
    }
  }

  let record: AssetJournalRecord = {
    version: 1,
    stage: 'pending',
    plan,
    rootPath: path.resolve(rootPath),
    createdAt: new Date().toISOString()
  }
  try {
    await verifyPlanFresh(rootPath, plan)
    record = await persistStage(store, record, 'pending', options.crashAfter)
    await backupPlanFiles(rootPath, plan, store)
    if (plan.outputs.length > 0) {
      for (const output of plan.outputs) {
        const data = options.outputFiles?.[output.relPath]
        if (!data) {
          throw new KbError('INVALID_OPERATION', `缺少优化产物: ${output.relPath}`)
        }
        const digest = await writeFileStreaming(outputFile(store, plan.id, output.relPath), data)
        if (digest !== output.sha256) {
          throw new KbError('REVISION_CONFLICT', `优化产物校验失败: ${output.relPath}`)
        }
      }
    }
    record = await persistStage(store, record, 'backed-up', options.crashAfter)
    record = await persistStage(store, record, 'applying', options.crashAfter)
    const changedPaths = await applyMutations(rootPath, plan, store)
    record = await persistStage(store, record, 'applied', options.crashAfter)
    return {
      planId: plan.id,
      status: 'applied',
      changedPaths,
      recoveryId: plan.id
    }
  } catch (error) {
    if (error instanceof PlannedCrash) {
      return {
        planId: plan.id,
        status: 'needs-recovery',
        changedPaths: [],
        recoveryId: plan.id,
        error: error.message
      }
    }
    try {
      await writeJournal(store, { ...record, stage: 'failed' })
    } catch {
      // Keep the earlier persisted stage for recoverIncompleteJournals.
    }
    return {
      planId: plan.id,
      status: 'failed',
      changedPaths: [],
      recoveryId: plan.id,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

function hashBytes(data: string | Uint8Array): string {
  return createHash('sha256').update(data).digest('hex')
}

async function expectedLiveHashes(
  store: AssetStorePaths,
  plan: AssetOperationPlan,
  item: { relPath: string; sha256: string }
): Promise<Set<string>> {
  const allowed = new Set<string>([item.sha256])
  const output = plan.outputs.find((entry) => entry.relPath === item.relPath)
  if (output) allowed.add(output.sha256)
  const filePatches = plan.patches.filter((patch) => patch.sourceRelPath === item.relPath)
  if (filePatches.length > 0) {
    const original = await fs.readFile(backupFile(store, plan.id, item.relPath), 'utf8')
    allowed.add(hashBytes(applyPatchesToText(original, filePatches)))
  }
  return allowed
}

async function pathHash(filePath: string): Promise<string | null> {
  try {
    return await hashFile(filePath)
  } catch {
    return null
  }
}

async function restoreAssetPlanUnlocked(
  rootPath: string,
  planId: string,
  store: AssetStorePaths
): Promise<AssetOperationResult> {
  const record = await readJournal(store, planId)
  if (!record) {
    throw new KbError('INVALID_OPERATION', `找不到恢复记录 ${planId}`)
  }
  if (!(await allBackupsPresent(store, record.plan))) {
    await persistStage(store, record, 'restored')
    return {
      planId,
      status: 'applied',
      changedPaths: [],
      recoveryId: planId
    }
  }
  await persistStage(store, record, 'restoring')
  const plan = record.plan
  try {
    for (const item of plan.backups) {
      const current = await pathHash(path.join(rootPath, item.relPath))
      if (!current) continue
      const allowed = await expectedLiveHashes(store, plan, item)
      if (!allowed.has(current)) {
        throw new KbError('INVALID_OPERATION', `恢复拒绝覆盖较新文件: ${item.relPath}`, {
          relPath: item.relPath
        })
      }
    }
    const dest =
      plan.kind === 'rename'
        ? plan.moves[0]?.toRelPath
        : undefined
    const destAbs = dest ? path.join(rootPath, dest) : null
    const destHash = destAbs ? await pathHash(destAbs) : null
    if (dest && destHash && destHash !== plan.moves[0].sha256) {
      throw new KbError('INVALID_OPERATION', `恢复拒绝删除较新的重命名目标: ${dest}`)
    }
    for (const created of plan.createdRelPaths) {
      const expected = plan.outputs.find((item) => item.relPath === created)?.sha256
      const current = await pathHash(path.join(rootPath, created))
      if (current && expected && current !== expected) {
        throw new KbError('INVALID_OPERATION', `恢复拒绝删除较新的优化产物: ${created}`)
      }
    }

    for (const item of plan.backups) {
      await copyFileStreaming(
        backupFile(store, plan.id, item.relPath),
        path.join(rootPath, item.relPath)
      )
    }
    if (destAbs && destHash) await fs.rm(destAbs, { force: true })
    for (const created of plan.createdRelPaths) {
      await fs.rm(path.join(rootPath, created), { force: true })
    }
    await persistStage(store, record, 'restored')
    return {
      planId,
      status: 'applied',
      changedPaths: plan.backups.map((item) => item.relPath),
      recoveryId: planId
    }
  } catch (error) {
    await writeJournal(store, { ...record, stage: 'failed' })
    return {
      planId,
      status: 'failed',
      changedPaths: [],
      recoveryId: planId,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export async function applyAssetPlan(
  rootPath: string,
  plan: AssetOperationPlan,
  store: AssetStorePaths,
  options: ApplyAssetPlanOptions = {}
): Promise<AssetOperationResult> {
  return enqueue(rootPath, () => applyAssetPlanUnlocked(rootPath, plan, store, options))
}

export async function restoreAssetPlan(
  rootPath: string,
  planId: string,
  store: AssetStorePaths
): Promise<AssetOperationResult> {
  return enqueue(rootPath, () => restoreAssetPlanUnlocked(rootPath, planId, store))
}

/** Resume interrupted apply/restore. Safe to run more than once. */
export async function recoverIncompleteJournals(
  rootPath: string,
  store: AssetStorePaths
): Promise<AssetOperationResult[]> {
  return enqueue(rootPath, async () => {
    let ids: string[] = []
    try {
      ids = await fs.readdir(store.journalDir)
    } catch {
      return []
    }
    const results: AssetOperationResult[] = []
    for (const planId of ids) {
      const record = await readJournal(store, planId)
      if (!record) continue
      if (path.resolve(record.rootPath) !== path.resolve(rootPath)) continue
      if (record.stage === 'applied' || record.stage === 'restored') continue
      results.push(await restoreAssetPlanUnlocked(rootPath, planId, store))
    }
    return results
  })
}

export async function listAssetJournals(store: AssetStorePaths): Promise<AssetJournalRecord[]> {
  let ids: string[] = []
  try {
    ids = await fs.readdir(store.journalDir)
  } catch {
    return []
  }
  const records: AssetJournalRecord[] = []
  for (const planId of ids) {
    const record = await readJournal(store, planId)
    if (record) records.push(record)
  }
  records.sort((a, b) => {
    const byTime = b.createdAt.localeCompare(a.createdAt)
    return byTime !== 0 ? byTime : b.plan.id.localeCompare(a.plan.id)
  })
  return records
}

export async function listIncompleteJournals(store: AssetStorePaths): Promise<AssetJournalRecord[]> {
  return (await listAssetJournals(store)).filter(
    (record) => record.stage !== 'applied' && record.stage !== 'restored'
  )
}
