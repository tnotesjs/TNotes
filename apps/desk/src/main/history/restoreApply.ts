import fs from 'node:fs/promises'
import path from 'node:path'

import { writeFileAtomic } from '@tnotesjs/kb'

import { resolveHead, readHistoryBlob } from './gitHistory'
import { commitPaths } from './gitSnapshot'
import {
  createRestoreJournal,
  listRestoreJournals,
  readOriginalBytes,
  removeRestoreJournal,
  saveOriginalBytes,
  writeRestoreJournal,
  type RestoreJournal,
  type RestorePhase
} from './restoreJournal'
import type { HistoryRestorePlan } from './restorePlan'

/**
 * 历史恢复的写回与提交（计划 H5）。
 *
 * 阶段（每步都落盘，进程随时被杀都能判定进度）：
 * `planned → backing-up → backed-up → writing → written → committing → committed`
 * 任一步失败：文件按日志回滚到写回前状态，日志保留为 `failed`，备份提交保留。
 *
 * 幂等：恢复提交是否已经生成，用「父提交 + 树内容（每个目标路径的 blob OID）」判断，
 * 而不是只看提交说明；因此「提交成功但日志还没更新」被杀掉后不会重复提交。
 */

export interface ApplyHistoryRestoreDeps {
  journalDir: string
  writeFileAtomic?: (absolutePath: string, data: Uint8Array) => Promise<void>
  readBlob?: typeof readHistoryBlob
  resolveHead?: typeof resolveHead
  commitPaths?: typeof commitPaths
  gitExecutable?: string
  /** 崩溃模拟：每个阶段完成后调用；抛错即中断（测试用） */
  onPhase?: (phase: RestorePhase, journal: RestoreJournal) => Promise<void> | void
  now?: () => number
}

export interface ApplyHistoryRestoreResult {
  operationId: string
  backupCommit: string | null
  restoreCommit: string | null
  writtenPaths: string[]
  /** 备份提交时 HEAD 已经不是计划里的 HEAD */
  headDrift: boolean
}

export type RecoverHistoryRestoreOutcome =
  | {
      operationId: string
      status: 'completed'
      restoreCommit: string
      backupCommit: string | null
    }
  | {
      operationId: string
      status: 'rolled-back'
      backupCommit: string | null
      restoredPaths: string[]
      error: string
    }
  | { operationId: string; status: 'no-op'; backupCommit: string | null }

async function writeJournal(
  deps: ApplyHistoryRestoreDeps,
  journal: RestoreJournal,
  phase: RestorePhase
): Promise<void> {
  journal.phase = phase
  await writeRestoreJournal(deps.journalDir, journal)
  await deps.onPhase?.(phase, journal)
}

async function exists(absolutePath: string): Promise<boolean> {
  try {
    await fs.stat(absolutePath)
    return true
  } catch {
    return false
  }
}

/** 该路径在给定 commit 里的 blob OID（不存在返回 null）。 */
async function blobOidAt(
  deps: ApplyHistoryRestoreDeps,
  rootPath: string,
  commit: string,
  relPath: string
): Promise<string | null> {
  try {
    const blob = await (deps.readBlob ?? readHistoryBlob)(rootPath, { commit, relPath })
    return blob.oid
  } catch {
    return null
  }
}

/**
 * 目标是否已经全部落在 HEAD 里（即恢复提交已经存在）。
 *
 * 判据（计划 4.3）：HEAD 不是操作开始时的 HEAD、且每个目标路径在 HEAD 里的 blob
 * 都等于要写回的历史 blob。父提交关系由调用方用 `commitPaths` 的 expectedHead 兜底。
 */
async function restoreAlreadyCommitted(
  deps: ApplyHistoryRestoreDeps,
  journal: RestoreJournal
): Promise<boolean> {
  const resolve = deps.resolveHead ?? resolveHead
  const head = await resolve(journal.rootPath).catch(() => null)
  if (!head || head === journal.startHead) return false
  for (const entry of journal.entries) {
    const current = await blobOidAt(deps, journal.rootPath, head, entry.relPath)
    if (current !== entry.oid) return false
  }
  return journal.entries.length > 0
}

async function rollback(deps: ApplyHistoryRestoreDeps, journal: RestoreJournal): Promise<string[]> {
  const write = deps.writeFileAtomic ?? writeFileAtomic
  const restored: string[] = []
  for (const [index, entry] of journal.entries.entries()) {
    // 只要原始字节已经入库就要回滚（写入与写日志之间被杀时 written 可能仍是 false）
    if (!entry.originalSaved) continue
    const absolute = path.join(journal.rootPath, entry.relPath)
    if (!entry.originalExisted) {
      await fs.rm(absolute, { force: true })
      restored.push(entry.relPath)
      continue
    }
    const original = await readOriginalBytes(deps.journalDir, journal, index)
    if (original === null) continue
    await write(absolute, original)
    restored.push(entry.relPath)
  }
  return restored
}

/** 同一知识库同时只允许一个恢复：第二个请求直接拒绝，不排队。 */
const inFlight = new Set<string>()

export function isHistoryRestoreInFlight(rootPath: string): boolean {
  return inFlight.has(path.resolve(rootPath))
}

export class HistoryRestoreBusyError extends Error {
  readonly code = 'RESTORE_IN_FLIGHT'

  constructor(rootPath: string) {
    super(`该知识库已有恢复在进行：${rootPath}`)
    this.name = 'HistoryRestoreBusyError'
  }
}

export async function applyHistoryRestore(
  plan: HistoryRestorePlan,
  deps: ApplyHistoryRestoreDeps
): Promise<ApplyHistoryRestoreResult> {
  const key = path.resolve(plan.rootPath)
  if (inFlight.has(key)) throw new HistoryRestoreBusyError(plan.rootPath)
  inFlight.add(key)
  try {
    return await applyHistoryRestoreLocked(plan, deps)
  } finally {
    inFlight.delete(key)
  }
}

async function applyHistoryRestoreLocked(
  plan: HistoryRestorePlan,
  deps: ApplyHistoryRestoreDeps
): Promise<ApplyHistoryRestoreResult> {
  const write = deps.writeFileAtomic ?? writeFileAtomic
  const readBlob = deps.readBlob ?? readHistoryBlob
  const resolve = deps.resolveHead ?? resolveHead
  const commit = deps.commitPaths ?? commitPaths

  const journal = createRestoreJournal(
    {
      knowledgeBaseId: plan.knowledgeBaseId,
      rootPath: plan.rootPath,
      noteIndex: plan.noteIndex,
      sourceCommit: plan.sourceCommit,
      startHead: plan.head,
      restoreMessage: `restore: ${plan.noteIndex} 恢复到 ${plan.sourceCommit.slice(0, 7)}`,
      backupMessage: plan.backupMessage,
      entries: plan.writePaths.map((relPath) => {
        const entry =
          relPath === plan.note.relPath
            ? plan.note
            : plan.resources.find((item) => item.relPath === relPath)
        return {
          relPath,
          // 改名后正文的 blob 在历史路径上
          sourceRelPath: entry?.sourceRelPath ?? relPath,
          oid: entry?.oid ?? '',
          bytes: entry?.bytes ?? 0
        }
      })
    },
    { now: deps.now }
  )

  const headBefore = await resolve(plan.rootPath).catch(() => null)
  const headDrift = headBefore !== null && headBefore !== plan.head

  try {
    await writeJournal(deps, journal, 'planned')

    // 1) 备份提交（按 H0 的按路径隔离索引；无变化不产生提交）
    await writeJournal(deps, journal, 'backing-up')
    const backup = await commit(plan.rootPath, plan.backupPaths, plan.backupMessage, {
      gitExecutable: deps.gitExecutable
    })
    journal.backupCommit = backup.commit
    await writeJournal(deps, journal, 'backed-up')

    // 2) 写回前确认 HEAD 仍是备份后的状态，避免覆盖别人的新提交
    const headNow = await resolve(plan.rootPath).catch(() => null)
    const expectedHead = backup.commit ?? plan.head
    if (headNow !== expectedHead) {
      throw new Error(`仓库 HEAD 已被外部改动（期望 ${expectedHead.slice(0, 7)}），停止恢复`)
    }

    // 3) 逐文件写回：先存原始字节再原子替换
    await writeJournal(deps, journal, 'writing')
    for (const [index, entry] of journal.entries.entries()) {
      const absolute = path.join(plan.rootPath, entry.relPath)
      const existed = await exists(absolute)
      if (existed) {
        const original = await fs.readFile(absolute)
        await saveOriginalBytes(deps.journalDir, journal, index, original)
      }
      entry.originalExisted = existed
      entry.originalSaved = true
      await writeRestoreJournal(deps.journalDir, journal)

      const blob = await readBlob(plan.rootPath, {
        commit: plan.sourceCommit,
        relPath: entry.sourceRelPath ?? entry.relPath
      })
      await write(absolute, blob.bytes)
      entry.written = true
      await writeRestoreJournal(deps.journalDir, journal)
    }
    await writeJournal(deps, journal, 'written')

    // 4) 恢复提交：只限本次写回路径；已存在（崩溃后重试）则复用
    await writeJournal(deps, journal, 'committing')
    let restoreCommit: string | null = null
    if (await restoreAlreadyCommitted(deps, journal)) {
      restoreCommit = await resolve(plan.rootPath)
    } else {
      const restored = await commit(plan.rootPath, plan.writePaths, journal.restoreMessage, {
        gitExecutable: deps.gitExecutable,
        expectedHead: backup.commit ?? plan.head
      })
      restoreCommit = restored.commit ?? (await resolve(plan.rootPath))
    }
    journal.restoreCommit = restoreCommit
    await writeJournal(deps, journal, 'committed')
    await removeRestoreJournal(deps.journalDir, journal.operationId)

    return {
      operationId: journal.operationId,
      backupCommit: journal.backupCommit,
      restoreCommit,
      writtenPaths: journal.entries.map((entry) => entry.relPath),
      headDrift
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    journal.error = message
    let restoredPaths: string[] = []
    try {
      restoredPaths = await rollback(deps, journal)
    } catch (rollbackError) {
      journal.error = `${message}；回滚也失败：${
        rollbackError instanceof Error ? rollbackError.message : String(rollbackError)
      }`
    }
    journal.phase = 'failed'
    await writeRestoreJournal(deps.journalDir, journal)
    throw Object.assign(new Error(journal.error), {
      operationId: journal.operationId,
      restoredPaths,
      backupCommit: journal.backupCommit
    })
  }
}

/**
 * 启动/重新打开知识库时恢复未完成事务。
 *
 * - 恢复提交已经落地 → 视为完成，清理日志
 * - 还在写文件 → 用日志里的原始字节回滚，日志保留为 `failed`（备份提交保留）
 * - 还没写任何文件 → 只保留备份提交，记为 `failed` 供人工确认
 */
export async function recoverHistoryRestore(
  deps: ApplyHistoryRestoreDeps
): Promise<RecoverHistoryRestoreOutcome[]> {
  const journals = await listRestoreJournals(deps.journalDir)
  const outcomes: RecoverHistoryRestoreOutcome[] = []
  for (const journal of journals) {
    if (journal.phase === 'failed') {
      outcomes.push({
        operationId: journal.operationId,
        status: 'no-op',
        backupCommit: journal.backupCommit
      })
      continue
    }
    if (await restoreAlreadyCommitted(deps, journal)) {
      const head = await (deps.resolveHead ?? resolveHead)(journal.rootPath)
      journal.restoreCommit = head ?? journal.restoreCommit
      await removeRestoreJournal(deps.journalDir, journal.operationId)
      outcomes.push({
        operationId: journal.operationId,
        status: 'completed',
        restoreCommit: head ?? '',
        backupCommit: journal.backupCommit
      })
      continue
    }
    const anyWritten = journal.entries.some((entry) => entry.written)
    if (!anyWritten) {
      journal.phase = 'failed'
      journal.error = '进程在写回开始前结束；备份提交已保留'
      await writeRestoreJournal(deps.journalDir, journal)
      outcomes.push({
        operationId: journal.operationId,
        status: 'no-op',
        backupCommit: journal.backupCommit
      })
      continue
    }
    const restoredPaths = await rollback(deps, journal)
    journal.phase = 'failed'
    journal.error = '进程在写回过程中结束；已按日志回滚到写回前状态，备份提交保留'
    await writeRestoreJournal(deps.journalDir, journal)
    outcomes.push({
      operationId: journal.operationId,
      status: 'rolled-back',
      backupCommit: journal.backupCommit,
      restoredPaths,
      error: journal.error
    })
  }
  return outcomes
}
