import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { writeFileAtomic } from '@tnotesjs/kb'

import {
  applyHistoryRestore,
  HistoryRestoreBusyError,
  isHistoryRestoreInFlight,
  recoverHistoryRestore
} from './restoreApply'
import { readHistoryBlob } from './gitHistory'
import { commitPaths } from './gitSnapshot'
import {
  createRestoreJournal,
  historyRestoreJournalDir,
  listRestoreJournals,
  saveOriginalBytes,
  writeRestoreJournal,
  type RestoreJournal,
  type RestorePhase
} from './restoreJournal'
import { buildHistoryRestorePlan, type HistoryRestorePlan } from './restorePlan'

let root = ''
let userData = ''

function git(args: string[]): string {
  return execFileSync('git', ['-c', 'core.quotepath=false', ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, LC_ALL: 'C' }
  })
}

async function write(relPath: string, content: string | Buffer): Promise<void> {
  const target = path.join(root, relPath)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, content)
}

function commit(message: string): string {
  git(['add', '-A'])
  git(['commit', '-q', '-m', message])
  return git(['rev-parse', 'HEAD']).trim()
}

const NOTE_V1 = '---\nid: 11111111-1111-4111-8111-111111111111\n---\n\n# A\n\n历史正文 v1\n'
const NOTE_V2 = '---\nid: 11111111-1111-4111-8111-111111111111\n---\n\n# A\n\n当前正文 v2\n'
const PNG_V1 = Buffer.from([1, 2, 3, 4])
const PNG_V2 = Buffer.from([9, 9, 9, 9, 9, 9])

function journalDir(): string {
  return historyRestoreJournalDir(userData, root)
}

async function read(relPath: string): Promise<Buffer> {
  return await fs.readFile(path.join(root, relPath))
}

async function setup(): Promise<{ oldCommit: string; head: string }> {
  await write('notes/0042. A.md', NOTE_V1)
  await write('assets/0042-a.png', PNG_V1)
  await write('notes/0043. B.md', '---\nid: 22222222-2222-4222-8222-222222222222\n---\n\n# B\n')
  const oldCommit = commit('feat: 历史版本')
  await write('notes/0042. A.md', NOTE_V2)
  await write('assets/0042-a.png', PNG_V2)
  await write('assets/0042-new.png', Buffer.from([7, 7]))
  const head = commit('note: 当前版本')
  return { oldCommit, head }
}

async function planFor(oldCommit: string) {
  return await buildHistoryRestorePlan(root, {
    knowledgeBaseId: 'kb-1',
    noteIndex: '0042',
    commit: oldCommit
  })
}

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-restore-apply-'))
  userData = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-restore-userdata-'))
  git(['init', '-q'])
  git(['config', 'user.email', 't@example.com'])
  git(['config', 'user.name', 'T'])
  git(['config', 'commit.gpgsign', 'false'])
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
  await fs.rm(userData, { recursive: true, force: true })
})

describe('applyHistoryRestore', () => {
  it('备份 → 写回 → 恢复提交，正文与资源回到历史字节，较新资源保留', async () => {
    const { oldCommit, head } = await setup()
    const plan = await planFor(oldCommit)

    // 写回前还有一笔未提交修改：必须进备份提交
    await write('notes/0042. A.md', `${NOTE_V2}\n恢复前的最后一笔\n`)

    const result = await applyHistoryRestore(plan, { journalDir: journalDir() })

    expect(result.backupCommit).toBeTruthy()
    expect(result.restoreCommit).toBeTruthy()
    expect(result.writtenPaths.sort()).toEqual(['assets/0042-a.png', 'notes/0042. A.md'])
    // 文件字节回到历史版本
    expect((await read('notes/0042. A.md')).toString()).toBe(NOTE_V1)
    expect(await read('assets/0042-a.png')).toEqual(PNG_V1)
    // 较新资源原样保留
    expect(await read('assets/0042-new.png')).toEqual(Buffer.from([7, 7]))
    // 无关笔记不动
    expect((await read('notes/0043. B.md')).toString()).toContain('# B')

    const log = git(['log', '--format=%H%x1f%s']).trim().split('\n')
    expect(log[0]).toContain(`restore: 0042 恢复到 ${oldCommit.slice(0, 7)}`)
    expect(log[1]).toContain(plan.backupMessage)
    expect(log[2]).toContain('note: 当前版本')
    // 旧提交保持不动
    expect(git(['log', '--format=%H'])).toContain(head)
    // 日志清理干净
    expect(await listRestoreJournals(journalDir())).toEqual([])
  })

  it('写回后没有新变化时不重复提交，且恢复提交只含目标路径', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    await write('notes/0042. A.md', NOTE_V2)
    const result = await applyHistoryRestore(plan, { journalDir: journalDir() })
    const changed = git(['show', '--name-only', '--format=', result.restoreCommit!])
      .trim()
      .split('\n')
    expect(changed.sort()).toEqual(['assets/0042-a.png', 'notes/0042. A.md'])
    // 只读路径都写回后，HEAD 树应与历史提交树在这些路径上一致
    for (const relPath of plan.writePaths) {
      expect(git(['show', `${result.restoreCommit}:${relPath}`])).toBe(
        git(['show', `${oldCommit}:${relPath}`])
      )
    }
  })

  it('写回中途失败：文件按日志回滚，备份提交保留，日志标记 failed', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    await write('assets/0042-untouched.png', Buffer.from([5, 5, 5]))
    // 写回前还有一笔未提交修改：必须进备份提交，失败回滚要回到这一笔
    await write('notes/0042. A.md', `${NOTE_V2}\n恢复前的最后一笔\n`)
    const beforeNote = await read('notes/0042. A.md')

    const writeFile = vi.fn(async (absolutePath: string, data: Uint8Array) => {
      // 第一个文件（正文）写完，第二个文件（资源）失败
      if (absolutePath.endsWith('0042-a.png')) throw new Error('EIO: 写盘失败')
      await writeFileAtomic(absolutePath, data)
    })
    const failure = await applyHistoryRestore(plan, {
      journalDir: journalDir(),
      writeFileAtomic: writeFile
    }).catch((error: Error) => error)

    expect(failure).toBeInstanceOf(Error)
    // 同进程失败会立刻回滚：正文回到写回前
    expect(await read('notes/0042. A.md')).toEqual(beforeNote)
    const journals = await listRestoreJournals(journalDir())
    expect(journals).toHaveLength(1)
    expect(journals[0]!.phase).toBe('failed')
    expect(journals[0]!.backupCommit).toBeTruthy()
    // 备份提交仍可用（可从历史 UI 找回），并且收进了「恢复前的最后一笔」
    expect(git(['log', '--format=%H'])).toContain(journals[0]!.backupCommit!)
    expect(git(['show', `${journals[0]!.backupCommit}:notes/0042. A.md`])).toContain(
      '恢复前的最后一笔'
    )
    expect(await read('assets/0042-untouched.png')).toEqual(Buffer.from([5, 5, 5]))
  })
})

/**
 * 真实进程终止的模拟：直接在磁盘上构造「被杀在某个阶段」的现场
 * （写回循环与生产代码同序：先存原始字节、再原子替换、然后落日志），
 * 再让 `recoverHistoryRestore` 去处理它。
 */
async function simulateCrashState(
  plan: HistoryRestorePlan,
  phase: RestorePhase,
  writtenCount: number
): Promise<RestoreJournal> {
  const dir = journalDir()
  const backup = await commitPaths(root, plan.backupPaths, plan.backupMessage, {})
  const journal = createRestoreJournal({
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
      return { relPath, oid: entry?.oid ?? '', bytes: entry?.bytes ?? 0 }
    })
  })
  journal.backupCommit = backup.commit
  journal.phase = phase
  for (const [index, entry] of journal.entries.entries()) {
    if (index >= writtenCount) break
    const absolute = path.join(root, entry.relPath)
    let existed = true
    try {
      await fs.stat(absolute)
    } catch {
      existed = false
    }
    if (existed) {
      await saveOriginalBytes(dir, journal, index, await fs.readFile(absolute))
    }
    entry.originalExisted = existed
    entry.originalSaved = true
    const blob = await readHistoryBlob(root, { commit: plan.sourceCommit, relPath: entry.relPath })
    await writeFileAtomic(absolute, blob.bytes)
    entry.written = true
  }
  await writeRestoreJournal(dir, journal)
  return journal
}

describe('recoverHistoryRestore（真实进程终止模拟）', () => {
  it('写回中崩溃（写了一半）：重启后按日志回滚到写回前状态，备份提交保留', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    await write('notes/0042. A.md', `${NOTE_V2}\n恢复前的最后一笔\n`)
    const beforeNote = await read('notes/0042. A.md')
    const beforePng = await read('assets/0042-a.png')

    await simulateCrashState(plan, 'writing', 1)
    // 崩溃现场：第一个文件已经是历史内容
    expect((await read('notes/0042. A.md')).toString()).toBe(NOTE_V1)

    const outcomes = await recoverHistoryRestore({ journalDir: journalDir() })
    expect(outcomes).toHaveLength(1)
    expect(outcomes[0]).toMatchObject({ status: 'rolled-back' })
    expect(await read('notes/0042. A.md')).toEqual(beforeNote)
    expect(await read('assets/0042-a.png')).toEqual(beforePng)
    const backup = (outcomes[0] as { backupCommit: string }).backupCommit
    expect(backup).toBeTruthy()
    expect(git(['log', '--format=%H'])).toContain(backup)
    expect(git(['show', `${backup}:notes/0042. A.md`])).toContain('恢复前的最后一笔')
    expect((await read('notes/0042. A.md')).toString()).toContain('恢复前的最后一笔')
    expect(git(['log', '--format=%s'])).not.toContain('restore: 0042')
  })

  it('全部写完但提交前崩溃：回滚所有文件，不产生恢复提交', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    const beforeNote = await read('notes/0042. A.md')
    const beforePng = await read('assets/0042-a.png')

    await simulateCrashState(plan, 'committing', plan.writePaths.length)
    expect(await read('assets/0042-a.png')).toEqual(PNG_V1)

    const outcomes = await recoverHistoryRestore({ journalDir: journalDir() })
    expect(outcomes[0]).toMatchObject({ status: 'rolled-back' })
    expect(await read('notes/0042. A.md')).toEqual(beforeNote)
    expect(await read('assets/0042-a.png')).toEqual(beforePng)
    expect(git(['log', '--format=%s'])).not.toContain('restore: 0042')
  })

  it('提交已生成但日志没来得及更新：重启识别已有提交，不重复提交', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)

    // 先正常跑完一次（提交已生成、日志已清理）
    const applied = await applyHistoryRestore(plan, { journalDir: journalDir() })
    const commitsBefore = git(['log', '--format=%H']).trim().split('\n')

    // 复原「日志还在磁盘上、阶段是 committing」的现场
    await simulateCrashState(plan, 'committing', plan.writePaths.length)
    const outcomes = await recoverHistoryRestore({ journalDir: journalDir() })

    expect(outcomes[0]).toMatchObject({ status: 'completed' })
    expect(await listRestoreJournals(journalDir())).toEqual([])
    expect(git(['log', '--format=%H']).trim().split('\n')).toEqual(commitsBefore)
    expect(
      git(['log', '--format=%s'])
        .split('\n')
        .filter((line) => line.startsWith('restore:')).length
    ).toBe(1)
    expect(applied.restoreCommit).toBe(commitsBefore[0])
  })

  it('还没写文件就崩溃：不回滚、不提交，备份提交保留', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    await write('notes/0042. A.md', `${NOTE_V2}\n未提交的一笔\n`)
    const beforeNote = await read('notes/0042. A.md')

    await simulateCrashState(plan, 'backed-up', 0)

    const outcomes = await recoverHistoryRestore({ journalDir: journalDir() })
    expect(outcomes[0]!.status).toBe('no-op')
    expect((outcomes[0] as { backupCommit: string }).backupCommit).toBeTruthy()
    expect(await read('notes/0042. A.md')).toEqual(beforeNote)
    expect(git(['log', '--format=%s'])).not.toContain('restore: 0042')
  })

  it('恢复是幂等的：重复 recover 不会重复提交或改文件', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    await simulateCrashState(plan, 'writing', 1)

    await recoverHistoryRestore({ journalDir: journalDir() })
    const noteAfterFirst = await read('notes/0042. A.md')
    const commitsAfterFirst = git(['log', '--format=%H']).trim()

    const second = await recoverHistoryRestore({ journalDir: journalDir() })
    expect(second).toHaveLength(1)
    expect(second[0]!.status).toBe('no-op')
    expect(await read('notes/0042. A.md')).toEqual(noteAfterFirst)
    expect(git(['log', '--format=%H']).trim()).toBe(commitsAfterFirst)
  })
})

describe('写回与并发保护', () => {
  it('写回前 HEAD 被外部改动则停止并回滚，且不产生恢复提交', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    const before = await read('notes/0042. A.md')

    // 备份提交之后、写回之前外部又提交了一笔：用 onPhase 在 backed-up 时改仓库
    await applyHistoryRestore(plan, {
      journalDir: journalDir(),
      onPhase: async (phase) => {
        if (phase === 'backed-up') {
          await write(
            'notes/0099. 外部.md',
            '---\nid: 99999999-9999-4999-8999-999999999999\n---\n\n# 外部\n'
          )
          commit('chore: 外部提交')
        }
      }
    }).catch(() => undefined)

    expect(await read('notes/0042. A.md')).toEqual(before)
    expect(git(['log', '--format=%s'])).not.toContain('restore: 0042')
    const journals = await listRestoreJournals(journalDir())
    expect(journals[0]!.phase).toBe('failed')
  })

  it('计划只提交目标路径：无关已暂存内容在恢复前后保持一致', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    await write(
      'notes/0098. 暂存.md',
      '---\nid: 88888888-8888-4888-8888-888888888888\n---\n\n# 暂存\n'
    )
    git(['add', 'notes/0098. 暂存.md'])
    const stagedBefore = git(['ls-files', '--stage', 'notes/0098. 暂存.md'])

    await applyHistoryRestore(plan, { journalDir: journalDir() })

    expect(git(['ls-files', '--stage', 'notes/0098. 暂存.md'])).toBe(stagedBefore)
    // 该暂存文件没有被任何提交带走
    expect(git(['log', '--all', '--format=%H', '--', 'notes/0098. 暂存.md']).trim()).toBe('')
  })
})

describe('改名后的恢复（真实缺陷回归）', () => {
  it('写回把历史正文写到当前文件名上（不读错历史路径、不新建旧名文件）', async () => {
    await write('notes/0042. A.md', NOTE_V1)
    await write('assets/0042-a.png', PNG_V1)
    const oldCommit = commit('feat: 历史版本')
    git(['mv', 'notes/0042. A.md', 'notes/0042. A 改名.md'])
    await write('notes/0042. A 改名.md', NOTE_V2)
    const head = commit('rename: 笔记改名')
    const plan = await buildHistoryRestorePlan(root, {
      knowledgeBaseId: 'kb-1',
      noteIndex: '0042',
      commit: oldCommit,
      expectedHead: head
    })

    const result = await applyHistoryRestore(plan, { journalDir: journalDir() })

    expect((await read('notes/0042. A 改名.md')).toString()).toBe(NOTE_V1)
    await expect(fs.stat(path.join(root, 'notes/0042. A.md'))).rejects.toThrow()
    expect(result.writtenPaths.sort()).toEqual(['assets/0042-a.png', 'notes/0042. A 改名.md'])
  })
})

describe('恢复互斥', () => {
  it('同一知识库同时只允许一个恢复，第二个直接拒绝', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    let release: () => void = () => undefined
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    const first = applyHistoryRestore(plan, {
      journalDir: journalDir(),
      onPhase: async (phase) => {
        if (phase === 'planned') await gate
      }
    })
    await vi.waitFor(() => expect(isHistoryRestoreInFlight(root)).toBe(true))
    await expect(applyHistoryRestore(plan, { journalDir: journalDir() })).rejects.toBeInstanceOf(
      HistoryRestoreBusyError
    )
    release()
    await first
    expect(isHistoryRestoreInFlight(root)).toBe(false)
  })
})

describe('恢复提交内容', () => {
  it('写回的是 blob 原始字节（含二进制资源），不经过文本转换', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    // 写回目标之一是多字节二进制
    await write('assets/0042-a.png', Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]))
    const result = await applyHistoryRestore(plan, { journalDir: journalDir() })
    expect(await read('assets/0042-a.png')).toEqual(PNG_V1)
    expect(git(['cat-file', '-p', `${result.restoreCommit}:assets/0042-a.png`])).toBeTruthy()
  })

  it('写回失败时给出可读错误并保留日志', async () => {
    const { oldCommit } = await setup()
    const plan = await planFor(oldCommit)
    const writeFile = vi.fn(async (absolutePath: string, data: Uint8Array) => {
      if (absolutePath.endsWith('0042. A.md')) throw new Error('ENOSPC: 磁盘已满')
      await fs.writeFile(absolutePath, data)
    })
    const error = await applyHistoryRestore(plan, {
      journalDir: journalDir(),
      writeFileAtomic: writeFile
    }).catch((cause: Error) => cause)
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toContain('磁盘已满')
    const journals = await listRestoreJournals(journalDir())
    expect(journals[0]!.phase).toBe('failed')
    expect(journals[0]!.error).toContain('磁盘已满')
    expect(git(['log', '--format=%s'])).not.toContain('restore: 0042')
  })
})
