import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  GitHistoryError,
  listHistoryCommits,
  listHistoryTree,
  readHistoryBlob,
  readHistorySnapshot,
  resolveHead
} from './gitHistory'

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

/** 读历史前后的仓库状态（工作区/索引/HEAD），用于证明「只读」 */
function repoState(): { status: string; head: string; indexEntries: string } {
  return {
    status: git(['status', '--porcelain']).trim(),
    head: git(['rev-parse', 'HEAD']).trim(),
    // 索引内容（路径/blob/mode/stage）作为「索引未被改动」的证据
    indexEntries: git(['ls-files', '--stage']).trim()
  }
}

const NOTE_V1 = '---\nid: 11111111-1111-4111-8111-111111111111\n---\n\n# A\n\nv1\n'
const NOTE_V2 = '---\nid: 11111111-1111-4111-8111-111111111111\n---\n\n# A\n\nv2 资源也变了\n'

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-history-'))
  git(['init', '-q'])
  git(['config', 'user.email', 't@example.com'])
  git(['config', 'user.name', 'T'])
  git(['config', 'commit.gpgsign', 'false'])
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
})

describe('listHistoryCommits（只读分页）', () => {
  it('包含首次提交、按固定 HEAD 分页无重复无漏项，且不修改仓库', async () => {
    await write('notes/0001. A.md', NOTE_V1)
    const first = commit('feat: 首次提交')
    await write('assets/0001-a.png', Buffer.from([0x89, 0x50, 0x4e, 0x47]))
    commit('asset: 新增资源')
    await write('notes/0002. B.md', '---\nid: 22222222-2222-4222-8222-222222222222\n---\n\n# B\n')
    commit('feat: 另一篇笔记')
    await write('notes/0001. A.md', NOTE_V2)
    commit('note: 更新正文')

    const before = repoState()
    const head = await resolveHead(root)
    expect(head).toBe(git(['rev-parse', 'HEAD']).trim())

    const page1 = await listHistoryCommits(root, { head: head!, limit: 2 })
    expect(page1.commits).toHaveLength(2)
    expect(page1.hasMore).toBe(true)
    const page2 = await listHistoryCommits(root, { head: head!, skip: 2, limit: 2 })
    expect(page2.commits).toHaveLength(2)
    expect(page2.hasMore).toBe(false)
    const page3 = await listHistoryCommits(root, { head: head!, skip: 4, limit: 2 })
    expect(page3.commits).toHaveLength(0)
    expect(page3.hasMore).toBe(false)

    const all = [...page1.commits, ...page2.commits, ...page3.commits].map((item) => item.oid)
    expect(new Set(all).size).toBe(all.length)
    expect(all).toHaveLength(4)
    expect(all.at(-1)).toBe(first)
    expect(repoState()).toEqual(before)
  })

  it('按编号过滤：改名前后连续、资源单独改动可见、无关提交不显示', async () => {
    await write('notes/0001. A.md', NOTE_V1)
    commit('feat: 首次提交')
    await write('assets/0001-a.png', Buffer.from([1, 2, 3]))
    commit('asset: 只改资源')
    await write('notes/0001. A.md', NOTE_V2)
    await write('notes/0002. B.md', '---\nid: 22222222-2222-4222-8222-222222222222\n---\n\n# B\n')
    commit('feat: 无关笔记 + 正文')
    git(['mv', 'notes/0001. A.md', 'notes/0001. A renamed.md'])
    commit('rename: 笔记改名')
    await write(
      'notes/0002. B.md',
      '---\nid: 22222222-2222-4222-8222-222222222222\n---\n\n# B\n\n只改 B\n'
    )
    commit('note: 只改 B')

    const page = await listHistoryCommits(root, { noteIndex: '0001' })
    const subjects = page.commits.map((item) => item.subject)
    expect(subjects).toContain('feat: 首次提交')
    expect(subjects).toContain('asset: 只改资源')
    expect(subjects).toContain('feat: 无关笔记 + 正文')
    expect(subjects).toContain('rename: 笔记改名')
    expect(subjects).not.toContain('note: 只改 B')
    // 改名后的提交仍然命中（同编号）
    const rename = page.commits.find((item) => item.subject === 'rename: 笔记改名')
    expect(rename?.changedPaths).toContain('notes/0001. A.md')
    expect(rename?.changedPaths).toContain('notes/0001. A renamed.md')
  })

  it('合并提交不被忽略', async () => {
    await write('notes/0001. A.md', NOTE_V1)
    commit('feat: 首次提交')
    const trunk = git(['rev-parse', '--abbrev-ref', 'HEAD']).trim()
    git(['checkout', '-q', '-b', 'topic'])
    await write('assets/0001-b.png', Buffer.from([9]))
    commit('asset: 分支上加资源')
    git(['checkout', '-q', trunk])
    await write('notes/0002. B.md', '---\nid: 22222222-2222-4222-8222-222222222222\n---\n\n# B\n')
    commit('feat: 主干加笔记')
    git(['merge', '-q', '--no-ff', '-m', 'merge: 合并 topic', 'topic'])

    const page = await listHistoryCommits(root, { noteIndex: '0001' })
    const merge = page.commits.find((item) => item.isMerge)
    expect(merge, '合并提交必须出现在历史里').toBeTruthy()
    expect(merge?.changedPaths).toContain('assets/0001-b.png')
  })

  it('拒绝非 OID 的 revision 表达式', async () => {
    await write('notes/0001. A.md', NOTE_V1)
    commit('feat: 首次提交')
    await expect(listHistoryCommits(root, { head: 'HEAD~1' })).rejects.toBeInstanceOf(
      GitHistoryError
    )
  })
})

describe('readHistorySnapshot / readHistoryBlob', () => {
  it('按编号找到历史笔记与同编号资源，并支持改名后的旧文件名', async () => {
    await write('notes/0001. A.md', NOTE_V1)
    await write('assets/0001-a.png', Buffer.from([0x89, 0x50]))
    const first = commit('feat: 首次提交')
    git(['mv', 'notes/0001. A.md', 'notes/0001. A renamed.md'])
    commit('rename: 笔记改名')

    const snapshot = await readHistorySnapshot(root, { commit: first, noteIndex: '0001' })
    expect(snapshot.note).toMatchObject({
      relPath: 'notes/0001. A.md',
      noteUuid: '11111111-1111-4111-8111-111111111111'
    })
    expect(snapshot.assets.map((entry) => entry.relPath)).toEqual(['assets/0001-a.png'])
    expect(snapshot.limitations).toEqual([])

    const blob = await readHistoryBlob(root, {
      commit: first,
      relPath: 'notes/0001. A.md',
      allow: ['notes/0001. A.md']
    })
    expect(blob.text).toContain('v1')
    expect(blob.oid).toBe(snapshot.note?.oid)

    // 二进制资源按字节读
    const asset = await readHistoryBlob(root, { commit: first, relPath: 'assets/0001-a.png' })
    expect([...asset.bytes.subarray(0, 2)]).toEqual([0x89, 0x50])
    expect(asset.text).toBeNull()
  })

  it('同编号多个笔记文件时报告歧义，不任选一个', async () => {
    await write('notes/0001. A.md', NOTE_V1)
    await write(
      'notes/0001. 旧名.md',
      '---\nid: 33333333-3333-4333-8333-333333333333\n---\n\n# 旧\n'
    )
    const oid = commit('feat: 同编号两个文件')

    const snapshot = await readHistorySnapshot(root, { commit: oid, noteIndex: '0001' })
    expect(snapshot.note).toBeNull()
    expect(snapshot.ambiguousNotePaths).toEqual(['notes/0001. A.md', 'notes/0001. 旧名.md'])
    expect(snapshot.limitations.map((item) => item.code)).toContain('reused-index')

    // 给了 UUID 就能唯一确定
    const resolved = await readHistorySnapshot(root, {
      commit: oid,
      noteIndex: '0001',
      noteUuid: '33333333-3333-4333-8333-333333333333'
    })
    expect(resolved.note?.relPath).toBe('notes/0001. 旧名.md')
  })

  it('列出限制：非标准路径、缺 UUID、无归属资源', async () => {
    await write('notes/0001-A.md', '# 没有 frontmatter')
    await write('assets/0001-a.png', Buffer.from([1]))
    await write('assets/idle.png', Buffer.from([2]))
    const oid = commit('feat: 边界')

    const snapshot = await readHistorySnapshot(root, { commit: oid, noteIndex: '0001' })
    const codes = snapshot.limitations.map((item) => item.code)
    expect(codes).toContain('non-standard-note-path')
    expect(codes).toContain('unknown-uuid')
    expect(codes).toContain('unowned-assets')
    expect(snapshot.assets.map((entry) => entry.relPath)).toEqual(['assets/0001-a.png'])
  })

  it('中文/空格/括号路径与 tree 枚举都正常', async () => {
    await write('notes/0001. 中文 (1).md', NOTE_V1)
    await write('assets/0001-中文 (1).png', Buffer.from([7]))
    const oid = commit('feat: 编码路径')

    const tree = await listHistoryTree(root, oid)
    expect(tree.map((entry) => entry.relPath)).toContain('assets/0001-中文 (1).png')
    const snapshot = await readHistorySnapshot(root, { commit: oid, noteIndex: '0001' })
    expect(snapshot.note?.relPath).toBe('notes/0001. 中文 (1).md')
    const blob = await readHistoryBlob(root, { commit: oid, relPath: 'notes/0001. 中文 (1).md' })
    expect(blob.text).toContain('v1')
  })

  it('拒绝清单外路径与空仓库', async () => {
    expect(await resolveHead(root)).toBeNull()
    await expect(listHistoryCommits(root)).rejects.toBeInstanceOf(GitHistoryError)

    await write('notes/0001. A.md', NOTE_V1)
    const oid = commit('feat: 首次提交')
    await expect(
      readHistoryBlob(root, { commit: oid, relPath: 'notes/9999. 不存在.md' })
    ).rejects.toMatchObject({ code: 'UNKNOWN_PATH' })
    await expect(
      readHistoryBlob(root, {
        commit: oid,
        relPath: 'notes/0001. A.md',
        allow: ['assets/0001-a.png']
      })
    ).rejects.toMatchObject({ code: 'UNKNOWN_PATH' })
  })
})
