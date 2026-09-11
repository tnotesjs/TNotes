import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { readHistoryBlob, GitHistoryError } from './gitHistory'
import {
  backupBeforeRestore,
  buildHistoryRestorePlan,
  createHistoryRestorePlanStore,
  HistoryRestorePlanError,
  toHistoryRestorePlanDto
} from './restorePlan'

let root = ''

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

const NOTE_V1 = '---\nid: 11111111-1111-4111-8111-111111111111\n---\n\n# A\n\nv1\n'
const NOTE_V2 = '---\nid: 11111111-1111-4111-8111-111111111111\n---\n\n# A\n\nv2\n'

/** 索引条目（路径/blob/mode/stage）+ 工作区状态：证明备份提交没夹带无关内容 */
function indexState(): string {
  return `${git(['status', '--porcelain'])}\n---\n${git(['ls-files', '--stage'])}`
}

async function setupRepo(): Promise<{ oldCommit: string; newCommit: string }> {
  await write('notes/0042. A.md', NOTE_V1)
  await write('assets/0042-a.png', Buffer.from([1, 2, 3]))
  await write('assets/0042-keep.png', Buffer.from([4, 5, 6]))
  await write('notes/0043. B.md', '---\nid: 22222222-2222-4222-8222-222222222222\n---\n\n# B\n')
  const oldCommit = commit('feat: 初始版本')
  await write('notes/0042. A.md', NOTE_V2)
  await fs.rm(path.join(root, 'assets/0042-a.png'))
  await write('assets/0042-new.png', Buffer.from([7, 8, 9]))
  const newCommit = commit('note: 新版本（删除旧资源、新增资源）')
  return { oldCommit, newCommit }
}

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-restore-'))
  git(['init', '-q'])
  git(['config', 'user.email', 't@example.com'])
  git(['config', 'user.name', 'T'])
  git(['config', 'commit.gpgsign', 'false'])
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
})

describe('buildHistoryRestorePlan', () => {
  it('固化影响范围：正文用当前路径、列出历史资源与保留的较新资源', async () => {
    const { oldCommit, newCommit } = await setupRepo()
    const plan = await buildHistoryRestorePlan(root, {
      knowledgeBaseId: 'kb-1',
      noteIndex: '0042',
      commit: oldCommit,
      expectedHead: newCommit
    })

    expect(plan.head).toBe(newCommit)
    expect(plan.sourceCommit).toBe(oldCommit)
    // 正文写当前文件名（不是历史文件名）
    expect(plan.note.relPath).toBe('notes/0042. A.md')
    expect(plan.resources.map((item) => item.relPath).sort()).toEqual([
      'assets/0042-a.png',
      'assets/0042-keep.png'
    ])
    // 当前版本新增的资源不在历史里 → 恢复时保留
    expect(plan.preserved.map((item) => item.relPath)).toEqual(['assets/0042-new.png'])
    expect(plan.writePaths).toEqual([
      'notes/0042. A.md',
      'assets/0042-a.png',
      'assets/0042-keep.png'
    ])
    // 备份要覆盖该编号当前全部资源（含较新的），但不含其它笔记
    // 备份覆盖该编号当前 HEAD 里真实存在的路径（已删除的 0042-a.png 没有内容可备份）
    expect(plan.backupPaths).toEqual([
      'assets/0042-keep.png',
      'assets/0042-new.png',
      'notes/0042. A.md'
    ])
    expect(plan.backupMessage).toContain('backup: 0042')
    expect(plan.limitations).toEqual([])

    const dto = toHistoryRestorePlanDto(plan)
    expect(dto.writeCount).toBe(3)
    expect(dto.totalBytes).toBeGreaterThan(0)
    expect(dto.backupRequired).toBe(true)
    expect(dto.preserved).toEqual([{ relPath: 'assets/0042-new.png', bytes: 3 }])
  })

  it('笔记改名后：正文写当前文件名，但 blob 来源是历史文件名', async () => {
    await write('notes/0042. A.md', NOTE_V1)
    await write('assets/0042-a.png', Buffer.from([1, 2, 3]))
    const oldCommit = commit('feat: 初始版本')
    git(['mv', 'notes/0042. A.md', 'notes/0042. A 改名.md'])
    await write('notes/0042. A 改名.md', NOTE_V2)
    const head = commit('rename: 笔记改名')

    const plan = await buildHistoryRestorePlan(root, {
      knowledgeBaseId: 'kb-1',
      noteIndex: '0042',
      commit: oldCommit,
      expectedHead: head
    })
    expect(plan.note.relPath).toBe('notes/0042. A 改名.md')
    expect(plan.note.sourceRelPath).toBe('notes/0042. A.md')
    expect(plan.writePaths).toContain('notes/0042. A 改名.md')
    // 当前版本名不会出现在历史提交里：必须用 sourceRelPath 读 blob
    await expect(
      readHistoryBlob(root, { commit: oldCommit, relPath: plan.note.relPath })
    ).rejects.toBeInstanceOf(GitHistoryError)
    const blob = await readHistoryBlob(root, {
      commit: oldCommit,
      relPath: plan.note.sourceRelPath!
    })
    expect(blob.text).toBe(NOTE_V1)
  })

  it('HEAD 外部漂移、非法 OID、缺提交都拒绝', async () => {
    const { oldCommit } = await setupRepo()
    await expect(
      buildHistoryRestorePlan(root, {
        knowledgeBaseId: 'kb-1',
        noteIndex: '0042',
        commit: oldCommit,
        expectedHead: 'f'.repeat(40)
      })
    ).rejects.toMatchObject({ code: 'STALE_HEAD' })
    await expect(
      buildHistoryRestorePlan(root, { knowledgeBaseId: 'kb-1', noteIndex: '0042', commit: 'HEAD' })
    ).rejects.toMatchObject({ code: 'UNKNOWN_COMMIT' })
    await expect(
      buildHistoryRestorePlan(root, {
        knowledgeBaseId: 'kb-1',
        noteIndex: '0042',
        commit: 'c'.repeat(40)
      })
    ).rejects.toMatchObject({ code: 'UNKNOWN_COMMIT' })
  })

  it('当前版本找不到该编号的笔记时拒绝（不按旧名字新建）', async () => {
    const { oldCommit } = await setupRepo()
    await fs.rm(path.join(root, 'notes/0042. A.md'))
    const head = commit('chore: 删除笔记')
    await expect(
      buildHistoryRestorePlan(root, {
        knowledgeBaseId: 'kb-1',
        noteIndex: '0042',
        commit: oldCommit,
        expectedHead: head
      })
    ).rejects.toMatchObject({ code: 'NO_NOTE' })
  })

  it('当前版本编号重复时报歧义并给出候选', async () => {
    const { oldCommit } = await setupRepo()
    await write('notes/0042. A 副本.md', NOTE_V2)
    const head = commit('chore: 制造重复编号')
    const error = await buildHistoryRestorePlan(root, {
      knowledgeBaseId: 'kb-1',
      noteIndex: '0042',
      commit: oldCommit,
      expectedHead: head
    }).catch((cause: unknown) => cause)
    expect(error).toBeInstanceOf(HistoryRestorePlanError)
    expect((error as HistoryRestorePlanError).code).toBe('AMBIGUOUS_NOTE')
    expect((error as HistoryRestorePlanError).candidates?.sort()).toEqual([
      'notes/0042. A 副本.md',
      'notes/0042. A.md'
    ])
  })

  it('渲染端还有未完成写入时拒绝创建计划', async () => {
    const { oldCommit } = await setupRepo()
    await expect(
      buildHistoryRestorePlan(root, {
        knowledgeBaseId: 'kb-1',
        noteIndex: '0042',
        commit: oldCommit,
        writers: {
          dirtyDocuments: [{ noteUuid: 'n1', title: 'A', saving: false }],
          dirtyTabs: [],
          pendingRecoveries: [],
          pendingEdits: [],
          kbSettingsDirty: false
        }
      })
    ).rejects.toMatchObject({ code: 'PENDING_WRITERS' })

    // flush 之后（空快照）可以创建
    const plan = await buildHistoryRestorePlan(root, {
      knowledgeBaseId: 'kb-1',
      noteIndex: '0042',
      commit: oldCommit,
      writers: {
        dirtyDocuments: [],
        dirtyTabs: [],
        pendingRecoveries: [],
        pendingEdits: [],
        kbSettingsDirty: false
      }
    })
    expect(plan.id).toMatch(/^history-restore-/)
  })

  it('clean/smudge 或 CRLF 检出路径拒绝按 blob 恢复', async () => {
    const { oldCommit } = await setupRepo()
    await write('.gitattributes', '*.md filter=lfs\n*.png text eol=crlf\n')
    const head = commit('chore: 加属性')
    await expect(
      buildHistoryRestorePlan(root, {
        knowledgeBaseId: 'kb-1',
        noteIndex: '0042',
        commit: oldCommit,
        expectedHead: head
      })
    ).rejects.toMatchObject({ code: 'ATTRIBUTE_UNSAFE' })
  })

  it('不可写与空间不足都在计划阶段拒绝', async () => {
    const { oldCommit } = await setupRepo()
    await expect(
      buildHistoryRestorePlan(
        root,
        { knowledgeBaseId: 'kb-1', noteIndex: '0042', commit: oldCommit },
        { checkWritable: async () => Promise.reject(new Error('EACCES')) }
      )
    ).rejects.toMatchObject({ code: 'UNWRITABLE' })
    await expect(
      buildHistoryRestorePlan(
        root,
        { knowledgeBaseId: 'kb-1', noteIndex: '0042', commit: oldCommit },
        { freeBytes: async () => 0 }
      )
    ).rejects.toMatchObject({ code: 'INSUFFICIENT_SPACE' })
  })

  it('源资源对象缺失时拒绝（对象损坏/被裁剪）', async () => {
    const { oldCommit } = await setupRepo()
    await expect(
      buildHistoryRestorePlan(
        root,
        { knowledgeBaseId: 'kb-1', noteIndex: '0042', commit: oldCommit },
        {
          readBlob: (async () => {
            throw new Error('对象缺失')
          }) as never
        }
      )
    ).rejects.toMatchObject({ code: 'MISSING_SOURCE' })
  })
})

describe('恢复计划 store', () => {
  it('只凭计划 ID + revision 取用，过期/不匹配都拒绝', async () => {
    const { oldCommit } = await setupRepo()
    const plan = await buildHistoryRestorePlan(root, {
      knowledgeBaseId: 'kb-1',
      noteIndex: '0042',
      commit: oldCommit
    })
    let clock = plan.createdAt
    const store = createHistoryRestorePlanStore({ ttlMs: 1000, now: () => clock })
    store.put(plan)
    expect(store.require(plan.id, 1).id).toBe(plan.id)
    expect(() => store.require(plan.id, 2)).toThrow(/版本不一致/)
    expect(() => store.require('history-restore-x')).toThrow(/不存在或已过期/)

    clock += 5000
    expect(() => store.require(plan.id)).toThrow(/不存在或已过期/)
    expect(store.size()).toBe(0)
  })

  it('超过上限时淘汰最旧计划', async () => {
    const { oldCommit } = await setupRepo()
    const store = createHistoryRestorePlanStore({ limit: 2, now: () => 1000 })
    for (const suffix of ['a', 'b', 'c']) {
      const plan = await buildHistoryRestorePlan(
        root,
        { knowledgeBaseId: 'kb-1', noteIndex: '0042', commit: oldCommit },
        { newId: () => `plan-${suffix}`, now: () => suffix.charCodeAt(0) }
      )
      store.put(plan)
    }
    expect(store.size()).toBe(2)
    expect(() => store.require('plan-a')).toThrow(/不存在或已过期/)
    expect(store.require('plan-c').id).toBe('plan-c')
  })
})

describe('backupBeforeRestore', () => {
  it('只提交该编号路径，保留无关已暂存内容，无变化时不产生空提交', async () => {
    const { oldCommit } = await setupRepo()
    // 无关文件：已暂存 + 未暂存
    await write(
      'notes/0099. 无关.md',
      '---\nid: 99999999-9999-4999-8999-999999999999\n---\n\n# 无关\n'
    )
    git(['add', 'notes/0099. 无关.md'])
    await write('TOC.md', '- [ ] 0042. A\n')
    const before = indexState()

    const plan = await buildHistoryRestorePlan(root, {
      knowledgeBaseId: 'kb-1',
      noteIndex: '0042',
      commit: oldCommit
    })
    // 目标笔记在计划创建后又被改了一笔：备份必须把它收进去
    await write(
      'notes/0042. A.md',
      '---\nid: 11111111-1111-4111-8111-111111111111\n---\n\n# A\n\nv3 恢复前的最后一笔\n'
    )
    const first = await backupBeforeRestore(plan)
    expect(first.commit).toBeTruthy()
    expect(first.paths).toEqual(plan.backupPaths)

    // 提交树里包含全部目标路径；改动路径只可能来自目标集合（不夹带无关文件）
    const tree = git(['ls-tree', '-r', '--name-only', first.commit!]).trim().split('\n').sort()
    for (const relPath of plan.backupPaths) expect(tree).toContain(relPath)
    const changed = git(['show', '--name-only', '--format=', first.commit!])
      .trim()
      .split('\n')
      .sort()
    expect(changed.length).toBeGreaterThan(0)
    for (const relPath of changed) expect(plan.backupPaths).toContain(relPath)
    expect(git(['log', '-1', '--format=%s', first.commit!]).trim()).toBe(plan.backupMessage)
    // 备份里的正文是恢复前的工作区内容
    expect(git(['show', `${first.commit}:notes/0042. A.md`])).toContain('v3 恢复前的最后一笔')

    // 无关的已暂存条目仍在索引里且 blob 未变；TOC.md 仍保持未暂存
    const unrelated = (state: string): string =>
      state
        .split('---\n')[1]!
        .split('\n')
        .filter((line) => !plan.backupPaths.some((relPath) => line.includes(`\t${relPath}`)))
        .join('\n')
    expect(unrelated(indexState())).toBe(unrelated(before))
    expect(git(['status', '--porcelain'])).toMatch(/A\s+"?notes\/0099\. 无关\.md"?/)
    // 工作区里未跟踪/未暂存的无关文件不受影响
    expect(git(['status', '--porcelain'])).toContain('TOC.md')

    // 再备份一次：目标路径没有新变化 → 不产生空提交，但报告 HEAD 已经因备份而前移
    const second = await backupBeforeRestore(plan)
    expect(second.commit).toBeNull()
    expect(second.headDrift).toBe(true)
  })

  it('strictHead 下 HEAD 漂移拒绝备份', async () => {
    const { oldCommit } = await setupRepo()
    const plan = await buildHistoryRestorePlan(root, {
      knowledgeBaseId: 'kb-1',
      noteIndex: '0042',
      commit: oldCommit
    })
    await write(
      'notes/0042. A.md',
      '---\nid: 11111111-1111-4111-8111-111111111111\n---\n\n# A\n\n外部又改了\n'
    )
    commit('chore: 外部提交')
    const drifted = await backupBeforeRestore(plan)
    expect(drifted.headDrift).toBe(true)
    expect(drifted.commit).toBeNull()
    await expect(backupBeforeRestore(plan, { strictHead: true })).rejects.toMatchObject({
      code: 'STALE_HEAD'
    })
  })
})
