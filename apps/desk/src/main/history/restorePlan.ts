import { randomUUID } from 'node:crypto'
import { access, stat, statfs } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'

import { reasonsFromEditorSnapshot, type AssetEditorSnapshot } from '../assetWriteGate'
import {
  assertCommitExists,
  GitHistoryError,
  listHistoryTree,
  readHistoryBlob,
  readHistorySnapshot,
  resolveHead
} from './gitHistory'
import { commitPaths, describePathContentAttributes, type CommitPathsResult } from './gitSnapshot'

/**
 * 恢复计划（计划 H4）。
 *
 * 渲染端**只能提交计划 ID**：源正文与资源字节都在主进程按 `commit + 快照白名单` 读取，
 * 计划在创建时就把「能不能安全恢复」验证完，并把影响范围固化成 DTO 给用户确认。
 *
 * 这里不写回任何文件：写回、恢复提交与崩溃恢复属于 H5。H4 负责
 * 「验证 + 固化 + 备份提交」三件事。
 */

export type HistoryRestorePlanErrorCode =
  | 'NOT_A_REPO'
  | 'NO_HEAD'
  | 'STALE_HEAD'
  | 'UNKNOWN_COMMIT'
  | 'NO_NOTE'
  | 'AMBIGUOUS_NOTE'
  | 'MISSING_SOURCE'
  | 'ATTRIBUTE_UNSAFE'
  | 'UNWRITABLE'
  | 'INSUFFICIENT_SPACE'
  | 'PENDING_WRITERS'
  | 'PLAN_NOT_FOUND'
  | 'PLAN_STALE'
  | 'GIT_FAILED'

export class HistoryRestorePlanError extends Error {
  readonly code: HistoryRestorePlanErrorCode
  readonly detail?: string
  /** 供界面展示的候选/限制说明 */
  readonly candidates?: string[]

  constructor(
    code: HistoryRestorePlanErrorCode,
    message: string,
    options: { detail?: string; candidates?: string[] } = {}
  ) {
    super(message)
    this.name = 'HistoryRestorePlanError'
    this.code = code
    this.detail = options.detail
    this.candidates = options.candidates
  }
}

export interface HistoryRestoreEntry {
  /** 写回目标（当前版本里的路径） */
  relPath: string
  /**
   * 读取 blob 的路径（源 commit 里的路径）。
   *
   * 笔记改名后这两者不同：正文要写**当前**文件名，但字节必须从历史文件名读，
   * 否则会报「该 commit 上不存在此文件」。
   */
  sourceRelPath?: string
  oid: string
  bytes: number
}

export interface HistoryRestorePlan {
  id: string
  revision: number
  knowledgeBaseId: string
  rootPath: string
  /** 创建计划时的 HEAD（写回/提交都必须还是它） */
  head: string
  sourceCommit: string
  noteIndex: string
  note: HistoryRestoreEntry
  /** 该 commit 里属于这篇笔记的资源 */
  resources: HistoryRestoreEntry[]
  /** 当前版本里比历史更新、恢复时原样保留的资源 */
  preserved: HistoryRestoreEntry[]
  /** 需要写回的路径（正文 + 历史资源） */
  writePaths: string[]
  /** 备份提交包含的路径（正文 + 该编号当前全部资源） */
  backupPaths: string[]
  backupMessage: string
  limitations: Array<{ code: string; message: string }>
  createdAt: number
}

export interface BuildHistoryRestorePlanInput {
  knowledgeBaseId: string
  noteIndex: string
  commit: string
  /** 事务开始时的 HEAD；不一致说明外部动过仓库 */
  expectedHead?: string
  /** 渲染端 flush 之后的写者快照；有未完成写入时拒绝创建计划 */
  writers?: AssetEditorSnapshot
}

export interface BuildHistoryRestorePlanDeps {
  assertCommit?: typeof assertCommitExists
  resolveHead?: typeof resolveHead
  listTree?: typeof listHistoryTree
  readSnapshot?: typeof readHistorySnapshot
  readBlob?: typeof readHistoryBlob
  probeAttributes?: typeof describePathContentAttributes
  checkWritable?: (rootPath: string) => Promise<void>
  freeBytes?: (rootPath: string) => Promise<number>
  now?: () => number
  newId?: () => string
}

const NOTE_INDEX = /^(\d{4})[.\s-]/
const ASSET_OWNER = /^(\d{4})-/

/** 写回本身的字节数之外，至少留 8MB 余量 */
const SPACE_SLACK_BYTES = 8 * 1024 * 1024

export function assetOwnerOf(relPath: string): string | null {
  const basename = relPath.split('/').pop() ?? ''
  return ASSET_OWNER.exec(basename)?.[1] ?? null
}

export function noteIndexOf(relPath: string): string | null {
  const basename = relPath.split('/').pop() ?? ''
  return NOTE_INDEX.exec(basename)?.[1] ?? null
}

async function pathExists(absolutePath: string): Promise<boolean> {
  try {
    await stat(absolutePath)
    return true
  } catch {
    return false
  }
}

/** 把 gitHistory 的错误码映射成计划错误码，避免把底层实现漏给界面。 */
function mapGitError(error: unknown, fallback: HistoryRestorePlanErrorCode): never {
  if (error instanceof HistoryRestorePlanError) throw error
  if (error instanceof GitHistoryError) {
    if (error.code === 'NOT_A_REPO') {
      throw new HistoryRestorePlanError('NOT_A_REPO', error.message)
    }
    if (error.code === 'UNKNOWN_COMMIT') {
      throw new HistoryRestorePlanError('UNKNOWN_COMMIT', '该提交不在当前知识库里，无法恢复')
    }
    if (error.code === 'NO_HEAD') {
      throw new HistoryRestorePlanError('NO_HEAD', error.message)
    }
    throw new HistoryRestorePlanError('GIT_FAILED', error.message, { detail: error.code })
  }
  throw new HistoryRestorePlanError(
    fallback,
    error instanceof Error ? error.message : String(error)
  )
}

async function defaultCheckWritable(rootPath: string): Promise<void> {
  await access(rootPath, constants.W_OK | constants.X_OK)
}

async function defaultFreeBytes(rootPath: string): Promise<number> {
  const stats = await statfs(rootPath)
  return stats.bavail * stats.bsize
}

export async function buildHistoryRestorePlan(
  rootPath: string,
  input: BuildHistoryRestorePlanInput,
  deps: BuildHistoryRestorePlanDeps = {}
): Promise<HistoryRestorePlan> {
  const assertCommit = deps.assertCommit ?? assertCommitExists
  const resolve = deps.resolveHead ?? resolveHead
  const listTree = deps.listTree ?? listHistoryTree
  const readSnapshot = deps.readSnapshot ?? readHistorySnapshot
  const readBlob = deps.readBlob ?? readHistoryBlob
  const probeAttributes = deps.probeAttributes ?? describePathContentAttributes
  const checkWritable = deps.checkWritable ?? defaultCheckWritable
  const freeBytes = deps.freeBytes ?? defaultFreeBytes
  const now = deps.now ?? (() => Date.now())
  const newId = deps.newId ?? (() => `history-restore-${randomUUID()}`)

  if (!/^[0-9a-f]{40}$/.test(input.commit)) {
    throw new HistoryRestorePlanError('UNKNOWN_COMMIT', '恢复来源必须是完整的 40 位 commit OID')
  }

  // 1. 当前 HEAD 与外部漂移
  let head: string | null
  try {
    head = await resolve(rootPath)
  } catch (error) {
    if (error instanceof GitHistoryError && error.code === 'NOT_A_REPO') {
      throw new HistoryRestorePlanError('NOT_A_REPO', error.message)
    }
    throw error
  }
  if (!head) {
    throw new HistoryRestorePlanError('NO_HEAD', '当前知识库还没有提交，无法恢复历史版本')
  }
  if (input.expectedHead && input.expectedHead !== head) {
    throw new HistoryRestorePlanError('STALE_HEAD', '仓库 HEAD 已被外部改动，请重新预览后再恢复', {
      detail: `expected ${input.expectedHead}, actual ${head}`
    })
  }

  // 2. 渲染端必须先 flush：未完成的写入不能进备份，也不能被静默覆盖
  if (input.writers) {
    const reasons = reasonsFromEditorSnapshot(input.writers)
    if (reasons.length > 0) {
      throw new HistoryRestorePlanError(
        'PENDING_WRITERS',
        `还有未完成的写入，先保存或丢弃再恢复：${reasons.map((reason) => reason.message).join('；')}`,
        { detail: reasons.map((reason) => reason.code).join(',') }
      )
    }
  }

  // 2.5 源提交必须真实存在（浅克隆/对象被裁剪都要说清楚）
  try {
    await assertCommit(rootPath, input.commit)
  } catch (error) {
    mapGitError(error, 'UNKNOWN_COMMIT')
  }

  // 3. 当前文件名唯一
  let headTree: Awaited<ReturnType<typeof listHistoryTree>>
  try {
    headTree = await listTree(rootPath, head)
  } catch (error) {
    mapGitError(error, 'GIT_FAILED')
  }
  const currentNotes = headTree
    .filter(
      (entry) =>
        entry.relPath.startsWith('notes/') && noteIndexOf(entry.relPath) === input.noteIndex
    )
    .map((entry) => entry.relPath)
  if (currentNotes.length === 0) {
    throw new HistoryRestorePlanError(
      'NO_NOTE',
      `当前版本里找不到编号 ${input.noteIndex} 的笔记文件，无法恢复`
    )
  }
  if (currentNotes.length > 1) {
    throw new HistoryRestorePlanError(
      'AMBIGUOUS_NOTE',
      `编号 ${input.noteIndex} 在当前版本里有多个笔记文件，请先处理重复编号：${currentNotes.join('、')}`,
      { candidates: currentNotes }
    )
  }
  const currentNotePath = currentNotes[0]!

  // 4. 源快照完整
  let snapshot: Awaited<ReturnType<typeof readHistorySnapshot>>
  try {
    snapshot = await readSnapshot(rootPath, {
      commit: input.commit,
      noteIndex: input.noteIndex
    })
  } catch (error) {
    mapGitError(error, 'MISSING_SOURCE')
  }
  if (!snapshot.note) {
    throw new HistoryRestorePlanError(
      'MISSING_SOURCE',
      snapshot.ambiguousNotePaths.length > 0
        ? `编号 ${input.noteIndex} 在该提交下有多个笔记文件：${snapshot.ambiguousNotePaths.join('、')}`
        : `该提交里没有编号 ${input.noteIndex} 的笔记文件`,
      { candidates: snapshot.ambiguousNotePaths }
    )
  }

  let noteBlob: Awaited<ReturnType<typeof readHistoryBlob>>
  try {
    noteBlob = await readBlob(rootPath, {
      commit: input.commit,
      relPath: snapshot.note.relPath
    })
  } catch (error) {
    throw new HistoryRestorePlanError(
      'MISSING_SOURCE',
      `历史正文读不出来（对象可能缺失）：${snapshot.note.relPath}（${
        error instanceof Error ? error.message : String(error)
      }）`
    )
  }
  const resources: HistoryRestoreEntry[] = []
  for (const asset of snapshot.assets) {
    try {
      const blob = await readBlob(rootPath, { commit: input.commit, relPath: asset.relPath })
      resources.push({ relPath: asset.relPath, oid: blob.oid, bytes: blob.bytes.byteLength })
    } catch (error) {
      throw new HistoryRestorePlanError(
        'MISSING_SOURCE',
        `历史资源读不出来（对象可能缺失）：${asset.relPath}（${
          error instanceof Error ? error.message : String(error)
        }）`
      )
    }
  }

  const note: HistoryRestoreEntry = {
    relPath: currentNotePath,
    sourceRelPath: snapshot.note.relPath,
    oid: noteBlob.oid,
    bytes: noteBlob.bytes.byteLength
  }
  const sourcePaths = new Set(resources.map((resource) => resource.relPath))

  // 5. 较新资源：当前 HEAD 里属于该编号、但历史提交里没有的，恢复时保留不删
  const preserved: HistoryRestoreEntry[] = headTree
    .filter(
      (entry) =>
        entry.relPath.startsWith('assets/') && assetOwnerOf(entry.relPath) === input.noteIndex
    )
    .filter((entry) => !sourcePaths.has(entry.relPath))
    .map((entry) => ({ relPath: entry.relPath, oid: entry.oid, bytes: entry.size }))

  const writePaths = [currentNotePath, ...resources.map((resource) => resource.relPath)]
  // 备份只覆盖「现在真的存在于 HEAD 或磁盘上」的该编号路径：
  // 在 HEAD 里已删除、磁盘上也没有的路径没有内容可备份（也不能进 `git add -A` 的 pathspec）
  const trackedIndexPaths = [
    currentNotePath,
    ...headTree
      .filter(
        (entry) =>
          entry.relPath.startsWith('assets/') && assetOwnerOf(entry.relPath) === input.noteIndex
      )
      .map((entry) => entry.relPath)
  ]
  const onDisk: string[] = []
  for (const relPath of writePaths) {
    if (trackedIndexPaths.includes(relPath)) continue
    if (await pathExists(path.resolve(rootPath, relPath))) onDisk.push(relPath)
  }
  const backupPaths = [...new Set([...trackedIndexPaths, ...onDisk])].sort()

  // 6. clean/smudge 与行尾：H0 已证明这类路径的「工作区字节」与「Git blob」不等价
  const attributes = await probeAttributes(rootPath, writePaths)
  const unsafe = attributes.filter((entry) => entry.filter !== '' || entry.eol === 'crlf')
  if (unsafe.length > 0) {
    throw new HistoryRestorePlanError(
      'ATTRIBUTE_UNSAFE',
      `以下路径配置了 clean/smudge 过滤器或 CRLF 检出，按 blob 写回会改掉工作区字节，拒绝恢复：${unsafe
        .map((entry) => entry.path)
        .join('、')}`,
      { detail: JSON.stringify(unsafe) }
    )
  }

  // 7. 权限与容量
  try {
    await checkWritable(rootPath)
  } catch {
    throw new HistoryRestorePlanError('UNWRITABLE', `知识库目录不可写：${rootPath}`)
  }
  const totalBytes = writePaths.reduce(
    (sum, relPath) =>
      sum +
      (relPath === currentNotePath
        ? note.bytes
        : (resources.find((resource) => resource.relPath === relPath)?.bytes ?? 0)),
    0
  )
  const free = await freeBytes(rootPath)
  if (free < totalBytes + SPACE_SLACK_BYTES) {
    throw new HistoryRestorePlanError(
      'INSUFFICIENT_SPACE',
      `磁盘空间不足：需要约 ${totalBytes} 字节，可用 ${free} 字节`
    )
  }

  return {
    id: newId(),
    revision: 1,
    knowledgeBaseId: input.knowledgeBaseId,
    rootPath,
    head,
    sourceCommit: input.commit,
    noteIndex: input.noteIndex,
    note,
    resources,
    preserved,
    writePaths,
    backupPaths,
    backupMessage: `backup: ${input.noteIndex} 恢复历史版本前备份`,
    limitations: snapshot.limitations,
    createdAt: now()
  }
}

export interface BackupBeforeRestoreResult extends CommitPathsResult {
  /** 备份时 HEAD 已经不是计划创建时的 HEAD（外部提交过） */
  headDrift: boolean
}

/**
 * 备份提交：用 H0 的按路径提交能力，只提交该编号的正文与资源，
 * 不夹带其它已暂存/未暂存内容；目标没有变化时不产生空提交。
 *
 * 默认**允许** HEAD 漂移（外部在这期间提交过）：备份是纯增量、按路径的，仍然应该
 * 把用户还没提交的内容保住；漂移事实通过 `headDrift` 返回，H5 写回前必须因此停止。
 * 需要严格按 H0 拒绝时传 `strictHead: true`。
 */
export async function backupBeforeRestore(
  plan: HistoryRestorePlan,
  options: { gitExecutable?: string; strictHead?: boolean } = {}
): Promise<BackupBeforeRestoreResult> {
  const headBefore = await resolveHead(plan.rootPath).catch(() => null)
  const result = await commitPaths(plan.rootPath, plan.backupPaths, plan.backupMessage, {
    expectedHead: options.strictHead ? plan.head : undefined,
    gitExecutable: options.gitExecutable
  })
  return { ...result, headDrift: headBefore !== null && headBefore !== plan.head }
}

export interface HistoryRestorePlanStore {
  put(plan: HistoryRestorePlan): HistoryRestorePlan
  /** 渲染端只给计划 ID（可选 revision）：拿不到或过期都拒绝 */
  require(id: string, revision?: number): HistoryRestorePlan
  drop(id: string): void
  size(): number
  /** 清理超过 TTL 的计划（用户开着对话框很久之后 HEAD 早变了） */
  prune(now?: number): number
}

export const HISTORY_PLAN_TTL_MS = 30 * 60 * 1000
export const HISTORY_PLAN_LIMIT = 20

export function createHistoryRestorePlanStore(
  options: {
    ttlMs?: number
    limit?: number
    now?: () => number
  } = {}
): HistoryRestorePlanStore {
  const ttlMs = options.ttlMs ?? HISTORY_PLAN_TTL_MS
  const limit = options.limit ?? HISTORY_PLAN_LIMIT
  const now = options.now ?? (() => Date.now())
  const plans = new Map<string, HistoryRestorePlan>()

  function prune(at = now()): number {
    let removed = 0
    for (const [id, plan] of plans) {
      if (at - plan.createdAt > ttlMs) {
        plans.delete(id)
        removed += 1
      }
    }
    return removed
  }

  return {
    put(plan) {
      prune()
      plans.set(plan.id, plan)
      while (plans.size > limit) {
        const oldest = [...plans.values()].sort((a, b) => a.createdAt - b.createdAt)[0]
        if (!oldest) break
        plans.delete(oldest.id)
      }
      return plan
    },
    require(id, revision) {
      prune()
      const plan = plans.get(id)
      if (!plan) {
        throw new HistoryRestorePlanError('PLAN_NOT_FOUND', '恢复计划不存在或已过期，请重新预览')
      }
      if (revision !== undefined && revision !== plan.revision) {
        throw new HistoryRestorePlanError('PLAN_STALE', '恢复计划版本不一致，请重新预览')
      }
      return plan
    },
    drop(id) {
      plans.delete(id)
    },
    size: () => plans.size,
    prune
  }
}

export const historyRestorePlanStore = createHistoryRestorePlanStore()

export function toHistoryRestorePlanDto(plan: HistoryRestorePlan): {
  planId: string
  revision: number
  knowledgeBaseId: string
  sourceCommit: string
  head: string
  noteIndex: string
  note: { relPath: string; bytes: number }
  resources: Array<{ relPath: string; bytes: number }>
  preserved: Array<{ relPath: string; bytes: number }>
  writeCount: number
  totalBytes: number
  backupMessage: string
  backupRequired: boolean
  limitations: Array<{ code: string; message: string }>
} {
  const totalBytes = plan.writePaths.reduce((sum, relPath) => {
    if (relPath === plan.note.relPath) return sum + plan.note.bytes
    return sum + (plan.resources.find((resource) => resource.relPath === relPath)?.bytes ?? 0)
  }, 0)
  return {
    planId: plan.id,
    revision: plan.revision,
    knowledgeBaseId: plan.knowledgeBaseId,
    sourceCommit: plan.sourceCommit,
    head: plan.head,
    noteIndex: plan.noteIndex,
    note: { relPath: plan.note.relPath, bytes: plan.note.bytes },
    resources: plan.resources.map((resource) => ({
      relPath: resource.relPath,
      bytes: resource.bytes
    })),
    preserved: plan.preserved.map((entry) => ({ relPath: entry.relPath, bytes: entry.bytes })),
    writeCount: plan.writePaths.length,
    totalBytes,
    backupMessage: plan.backupMessage,
    // 只读路径不会产生提交；备份路径里只有正文+资源，永远需要一次备份（除非没变化，由 H5 判定）
    backupRequired: plan.backupPaths.length > 0,
    limitations: plan.limitations
  }
}

export function describePlanPaths(plan: HistoryRestorePlan): string {
  return [...plan.writePaths, ...plan.preserved.map((entry) => entry.relPath)]
    .map((relPath) => path.posix.normalize(relPath))
    .join('\n')
}
