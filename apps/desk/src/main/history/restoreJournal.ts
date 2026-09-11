import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { writeFileAtomic } from '@tnotesjs/kb'

/**
 * 历史恢复的事务日志（计划 H5，对应计划第 4 节的阶段日志）。
 *
 * 设计约束：
 * - 日志与「写回前的原始字节」都在 Desk userData 下（绝不放 KB 里，也不进 Git）
 * - 每个阶段、每个文件写完都落盘，进程被杀后能判定「文件写到哪一步、提交有没有发生」
 * - 备份 commit 一旦成功就保留，不因后续失败删除或 rewrite
 * - 收尾判定必须依赖「父提交 + 树内容」而不只是提交说明
 */

export type RestorePhase =
  /** 计划已固化，尚未动任何文件 */
  | 'planned'
  /** 正在生成备份提交 */
  | 'backing-up'
  /** 备份提交已生成（或确认无需备份） */
  | 'backed-up'
  /** 正在逐文件写回 */
  | 'writing'
  /** 所有文件已写完，尚未提交 */
  | 'written'
  /** 正在生成恢复提交 */
  | 'committing'
  /** 恢复提交已生成 */
  | 'committed'
  /** 写回失败：文件已按日志回滚或保持原样，日志保留供人工处理 */
  | 'failed'

export interface RestoreJournalEntry {
  relPath: string
  /** 读取 blob 的历史路径（改名后与 relPath 不同） */
  sourceRelPath?: string
  /** 要写回的历史 blob OID */
  oid: string
  bytes: number
  /** 原始字节是否已存进日志目录（写回前必须先存） */
  originalSaved: boolean
  /** 原始文件是否存在（不存在时回滚要删除文件） */
  originalExisted: boolean
  written: boolean
}

export interface RestoreJournal {
  version: 1
  operationId: string
  knowledgeBaseId: string
  rootPath: string
  noteIndex: string
  sourceCommit: string
  /** 操作开始时的 HEAD */
  startHead: string
  backupCommit: string | null
  restoreCommit: string | null
  restoreMessage: string
  backupMessage: string
  phase: RestorePhase
  entries: RestoreJournalEntry[]
  createdAt: number
  updatedAt: number
  error?: string
}

/** 每个 KB 一个目录：`userData/history-restore-journals/<kb-root-sha256>/`。 */
export function historyRestoreJournalDir(userDataDir: string, rootPath: string): string {
  const key = createHash('sha256').update(path.resolve(rootPath)).digest('hex')
  return path.join(userDataDir, 'history-restore-journals', key)
}

function journalFile(dir: string, operationId: string): string {
  return path.join(dir, `${operationId}.json`)
}

function originalFile(dir: string, operationId: string, index: number): string {
  return path.join(dir, 'originals', `${operationId}-${index}.bin`)
}

export interface CreateRestoreJournalInput {
  knowledgeBaseId: string
  rootPath: string
  noteIndex: string
  sourceCommit: string
  startHead: string
  restoreMessage: string
  backupMessage: string
  entries: Array<{ relPath: string; oid: string; bytes: number }>
}

export function createRestoreJournal(
  input: CreateRestoreJournalInput,
  options: { operationId?: string; now?: () => number } = {}
): RestoreJournal {
  const now = options.now ?? (() => Date.now())
  return {
    version: 1,
    operationId: options.operationId ?? `history-restore-${randomUUID()}`,
    knowledgeBaseId: input.knowledgeBaseId,
    rootPath: input.rootPath,
    noteIndex: input.noteIndex,
    sourceCommit: input.sourceCommit,
    startHead: input.startHead,
    backupCommit: null,
    restoreCommit: null,
    restoreMessage: input.restoreMessage,
    backupMessage: input.backupMessage,
    phase: 'planned',
    entries: input.entries.map((entry) => ({
      ...entry,
      originalSaved: false,
      originalExisted: false,
      written: false
    })),
    createdAt: now(),
    updatedAt: now()
  }
}

export async function writeRestoreJournal(dir: string, journal: RestoreJournal): Promise<void> {
  journal.updatedAt = Date.now()
  await fs.mkdir(dir, { recursive: true })
  await writeFileAtomic(
    journalFile(dir, journal.operationId),
    `${JSON.stringify(journal, null, 2)}\n`
  )
}

export async function readRestoreJournal(
  dir: string,
  operationId: string
): Promise<RestoreJournal | null> {
  try {
    const raw = await fs.readFile(journalFile(dir, operationId), 'utf8')
    const parsed = JSON.parse(raw) as RestoreJournal
    if (parsed?.version !== 1 || !parsed.operationId) return null
    return parsed
  } catch {
    return null
  }
}

export async function listRestoreJournals(dir: string): Promise<RestoreJournal[]> {
  let names: string[]
  try {
    names = await fs.readdir(dir)
  } catch {
    return []
  }
  const journals: RestoreJournal[] = []
  for (const name of names) {
    if (!name.endsWith('.json')) continue
    const journal = await readRestoreJournal(dir, name.slice(0, -'.json'.length))
    if (journal) journals.push(journal)
  }
  return journals.sort((a, b) => a.createdAt - b.createdAt)
}

export async function removeRestoreJournal(dir: string, operationId: string): Promise<void> {
  await fs.rm(journalFile(dir, operationId), { force: true })
  // 原始字节文件按 operationId 前缀命名：一次性清掉，避免残留用户内容
  let names: string[] = []
  try {
    names = await fs.readdir(path.join(dir, 'originals'))
  } catch {
    return
  }
  await Promise.all(
    names
      .filter((name) => name.startsWith(`${operationId}-`))
      .map((name) => fs.rm(path.join(dir, 'originals', name), { force: true }))
  )
}

/** 写回前把原文件字节存进日志目录（回滚的唯一依据）。 */
export async function saveOriginalBytes(
  dir: string,
  journal: RestoreJournal,
  index: number,
  data: Uint8Array
): Promise<void> {
  const target = originalFile(dir, journal.operationId, index)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await writeFileAtomic(target, data)
}

export async function readOriginalBytes(
  dir: string,
  journal: RestoreJournal,
  index: number
): Promise<Buffer | null> {
  try {
    return await fs.readFile(originalFile(dir, journal.operationId, index))
  } catch {
    return null
  }
}

/** 日志是否还没走到终态（成功清理或失败保留）。 */
export function isUnfinishedJournal(journal: RestoreJournal): boolean {
  return journal.phase !== 'failed'
}
