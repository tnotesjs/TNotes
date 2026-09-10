import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { commitPaths, describePathContentAttributes, GitSnapshotError } from './gitSnapshot'

let root = ''

function git(args: string[], options: { indexFile?: string } = {}): string {
  return execFileSync('git', ['-c', 'core.quotepath=false', ...args], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      LC_ALL: 'C',
      ...(options.indexFile ? { GIT_INDEX_FILE: options.indexFile } : {})
    }
  })
}

async function write(relPath: string, content: string): Promise<void> {
  const target = path.join(root, relPath)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, content)
}

async function remove(relPath: string): Promise<void> {
  await fs.rm(path.join(root, relPath), { force: true })
}

/** 真实索引 + 工作区在「提交前后」的完整状态快照 */
function workspaceState(): { status: string; staged: string; unstaged: string; untracked: string } {
  return {
    status: git(['status', '--porcelain']).trim(),
    staged: git(['diff', '--cached', '--name-status']).trim(),
    unstaged: git(['diff', '--name-status']).trim(),
    untracked: git(['ls-files', '--others', '--exclude-standard']).trim()
  }
}

/** 只保留与目标路径无关的条目：已提交路径本就该从 status 里消失 */
function unrelatedState(targets: string[]): Record<string, string> {
  const keep = (text: string): string =>
    text
      .split('\n')
      .filter((line) => line.trim() && !targets.some((target) => line.includes(target)))
      .sort()
      .join('\n')
  const state = workspaceState()
  return {
    status: keep(state.status),
    staged: keep(state.staged),
    unstaged: keep(state.unstaged),
    untracked: keep(state.untracked)
  }
}

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-history-git-'))
  git(['init', '-q', '-b', 'main'])
  git(['config', 'user.email', 'desk@example.com'])
  git(['config', 'user.name', 'Desk Test'])
  await write('notes/0001. 笔记.md', '# 0001\n')
  await write('notes/0002. 另一篇.md', '# 0002\n')
  await write('assets/0001-a.png', 'a')
  await write('TOC.md', '- [ ] 0001. 笔记\n- [ ] 0002. 另一篇\n')
  git(['add', '-A'])
  git(['commit', '-q', '-m', 'init'])
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
})

describe('H0 · 按路径提交的隔离性', () => {
  it('无关的已暂存/未暂存/未跟踪改动都不进提交，且状态原样保留', async () => {
    // 无关改动：0002 已暂存、TOC 未暂存、0003 未跟踪
    await write('notes/0002. 另一篇.md', '# 0002 暂存改动\n')
    git(['add', 'notes/0002. 另一篇.md'])
    await write('TOC.md', '- [ ] 0001. 笔记\n')
    await write('notes/0003. 新笔记.md', '# 0003\n')
    // 目标改动
    await write('notes/0001. 笔记.md', '# 0001 已修改\n')
    await write('assets/0001-b.png', 'b')
    await remove('assets/0001-a.png')

    const targets = ['notes/0001. 笔记.md', 'assets/0001-a.png', 'assets/0001-b.png']
    const before = unrelatedState(targets)
    const result = await commitPaths(root, targets, 'backup: 0001')
    expect(result.commit).toBeTruthy()

    // 提交内容只含目标路径
    expect(git(['show', '--name-status', '--format=', 'HEAD']).trim().split('\n').sort()).toEqual([
      'A\tassets/0001-b.png',
      'D\tassets/0001-a.png',
      'M\tnotes/0001. 笔记.md'
    ])
    // 提交树里 0002 / TOC 仍是 HEAD 之前的内容
    expect(git(['show', 'HEAD:notes/0002. 另一篇.md'])).toBe('# 0002\n')
    expect(git(['show', 'HEAD:TOC.md'])).toBe('- [ ] 0001. 笔记\n- [ ] 0002. 另一篇\n')

    // 真实索引与工作区：无关条目完全保持原状，已提交路径不再显示为任何差异
    const after = unrelatedState(targets)
    expect(after).toEqual(before)
    expect(after.staged).toContain('M\tnotes/0002. 另一篇.md')
    expect(workspaceState().status).not.toContain('0001')
    expect(after.untracked).toContain('notes/0003. 新笔记.md')
  })

  it('笔记改名：提交里是「删旧名 + 增新名」，TOC 字节不动', async () => {
    await fs.rename(
      path.join(root, 'notes/0001. 笔记.md'),
      path.join(root, 'notes/0001. 改名后.md')
    )
    const result = await commitPaths(
      root,
      ['notes/0001. 笔记.md', 'notes/0001. 改名后.md'],
      'backup: 0001 rename'
    )
    expect(result.commit).toBeTruthy()
    // git 可能把它识别成 rename；关键是新名字进了提交树、旧名字不再存在
    expect(git(['show', 'HEAD:notes/0001. 改名后.md'])).toBe('# 0001\n')
    expect(() => git(['cat-file', '-e', 'HEAD:notes/0001. 笔记.md'])).toThrow()
    expect(git(['diff', '--cached', '--name-only']).trim()).toBe('')
    expect(git(['show', 'HEAD:TOC.md'])).toBe('- [ ] 0001. 笔记\n- [ ] 0002. 另一篇\n')
  })

  it('目标路径没有变化时不产生提交', async () => {
    const result = await commitPaths(root, ['notes/0001. 笔记.md'], 'backup: 0001')
    expect(result.commit).toBeNull()
    // HEAD 未移动
    expect(git(['log', '--oneline']).trim().split('\n')).toHaveLength(1)
  })

  it('目标文件部分暂存时拒绝，不静默丢弃暂存版本', async () => {
    await write('notes/0001. 笔记.md', '# 暂存版本\n')
    git(['add', 'notes/0001. 笔记.md'])
    await write('notes/0001. 笔记.md', '# 工作区版本\n')

    await expect(commitPaths(root, ['notes/0001. 笔记.md'], 'backup: 0001')).rejects.toMatchObject({
      code: 'PARTIAL_STAGED'
    })
    // 拒绝后 HEAD 与暂存内容都不变
    expect(git(['log', '--oneline']).trim().split('\n')).toHaveLength(1)
    expect(git(['diff', '--cached', '--name-only']).trim()).toBe('notes/0001. 笔记.md')
  })

  it('无关文件部分暂存不阻塞目标提交', async () => {
    await write('notes/0002. 另一篇.md', '# 暂存版本\n')
    git(['add', 'notes/0002. 另一篇.md'])
    await write('notes/0002. 另一篇.md', '# 工作区版本\n')
    await write('notes/0001. 笔记.md', '# 0001 改动\n')

    const targets = ['notes/0001. 笔记.md']
    const before = unrelatedState(targets)
    const result = await commitPaths(root, targets, 'backup: 0001')
    expect(result.commit).toBeTruthy()
    expect(git(['show', 'HEAD:notes/0002. 另一篇.md'])).toBe('# 0002\n')
    expect(unrelatedState(targets)).toEqual(before)
  })

  it('HEAD 被外部改动时拒绝（预览失效）', async () => {
    const head = git(['rev-parse', 'HEAD']).trim()
    await write('TOC.md', 'external\n')
    git(['add', 'TOC.md'])
    git(['commit', '-q', '-m', 'external commit'])
    await write('notes/0001. 笔记.md', '# 0001 改动\n')

    await expect(
      commitPaths(root, ['notes/0001. 笔记.md'], 'backup: 0001', { expectedHead: head })
    ).rejects.toMatchObject({ code: 'STALE_HEAD' })
  })

  it('没有提交历史时给出明确错误', async () => {
    const empty = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-history-empty-'))
    try {
      execFileSync('git', ['init', '-q'], { cwd: empty })
      await expect(commitPaths(empty, ['a.md'], 'x')).rejects.toMatchObject({ code: 'NO_HEAD' })
    } finally {
      await fs.rm(empty, { recursive: true, force: true })
    }
  })
})

describe('H0 · 提交失败时的安全', () => {
  it('pre-commit hook 失败时不产生提交，目标改动仍在工作区', async () => {
    const hookDir = path.join(root, '.git', 'hooks')
    await fs.mkdir(hookDir, { recursive: true })
    const hook = path.join(hookDir, 'pre-commit')
    await fs.writeFile(hook, '#!/bin/sh\nexit 1\n', { mode: 0o755 })
    await write('notes/0001. 笔记.md', '# 0001 改动\n')

    await expect(commitPaths(root, ['notes/0001. 笔记.md'], 'backup: 0001')).rejects.toMatchObject({
      code: 'GIT_FAILED'
    })
    expect(git(['log', '--oneline']).trim().split('\n')).toHaveLength(1)
    expect(await fs.readFile(path.join(root, 'notes/0001. 笔记.md'), 'utf8')).toBe('# 0001 改动\n')
    expect(git(['diff', '--name-only']).trim()).toBe('notes/0001. 笔记.md')
  })
})

describe('GitSnapshotError', () => {
  it('携带可读的 code', () => {
    const error = new GitSnapshotError('PARTIAL_STAGED', 'x')
    expect(error.code).toBe('PARTIAL_STAGED')
    expect(error.name).toBe('GitSnapshotError')
  })
})

describe('H0 · Git 属性与过滤器的影响', () => {
  it('CRLF + core.autocrlf 时 blob 与工作区字节并不相同（还原不能依赖 blob）', async () => {
    git(['config', 'core.autocrlf', 'true'])
    await write('notes/0001. 笔记.md', '# 0001\r\n\r\n正文\r\n')
    const result = await commitPaths(root, ['notes/0001. 笔记.md'], 'backup: 0001')
    expect(result.commit).toBeTruthy()

    const blob = git(['show', 'HEAD:notes/0001. 笔记.md'])
    const worktree = await fs.readFile(path.join(root, 'notes/0001. 笔记.md'), 'utf8')
    expect(worktree).toContain('\r\n')
    expect(blob).toBe('# 0001\n\n正文\n')
  })

  it('.gitattributes 的 clean/smudge 过滤器会被探测到', async () => {
    await write('.gitattributes', 'notes/*.md filter=desk-test\n')
    git(['config', 'filter.desk-test.clean', 'cat'])
    git(['config', 'filter.desk-test.smudge', 'cat'])
    await write('notes/0001. 笔记.md', '# 0001\n')

    const attributes = await describePathContentAttributes(root, ['notes/0001. 笔记.md', 'TOC.md'])
    const note = attributes.find((item) => item.path === 'notes/0001. 笔记.md')
    const toc = attributes.find((item) => item.path === 'TOC.md')
    expect(note?.filter).toBe('desk-test')
    expect(toc?.filter).toBe('')
  })
})

describe('H0 · 签名失败', () => {
  it('开启 gpg 签名但不可用时提交失败且 HEAD 不动（不使用 --no-verify 绕过）', async () => {
    git(['config', 'commit.gpgSign', 'true'])
    await write('notes/0001. 笔记.md', '# 0001 改动\n')
    const before = git(['rev-parse', 'HEAD']).trim()

    await expect(commitPaths(root, ['notes/0001. 笔记.md'], 'backup: 0001')).rejects.toMatchObject({
      code: 'GIT_FAILED'
    })
    expect(git(['rev-parse', 'HEAD']).trim()).toBe(before)
    expect(await fs.readFile(path.join(root, 'notes/0001. 笔记.md'), 'utf8')).toBe('# 0001 改动\n')
  })
})
