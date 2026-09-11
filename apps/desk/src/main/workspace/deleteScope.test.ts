import { execFileSync } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { commitDeleteScope, deleteBackupMessage, withCommittedRange } from './deleteScope'

import type { DeletePreviewDto } from '../../shared/contracts'

let root = ''

function git(args: string[]): string {
  return execFileSync('git', ['-c', 'core.quotepath=false', ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, LC_ALL: 'C' }
  })
}

async function write(relPath: string, content: string): Promise<void> {
  const target = path.join(root, relPath)
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, content)
}

function preview(overrides: Partial<DeletePreviewDto> = {}): DeletePreviewDto {
  return {
    knowledgeBaseId: 'kb-1',
    entry: { type: 'note', noteUuid: 'n1' },
    notes: [
      {
        noteUuid: 'n1',
        index: '0042',
        title: '待删除',
        directoryPath: path.join(root, 'notes/0042. 待删除')
      }
    ],
    filePaths: [path.join(root, 'notes/0042. 待删除/0042. 待删除.md')],
    directoryPaths: [path.join(root, 'notes/0042. 待删除')],
    untrackedFilePaths: [],
    uncommittedFilePaths: [],
    gitReady: true,
    snapshotRevision: 'r1',
    ...overrides
  }
}

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-delete-scope-'))
  git(['init', '-q'])
  git(['config', 'user.email', 't@example.com'])
  git(['config', 'user.name', 'T'])
  git(['config', 'commit.gpgsign', 'false'])
  await write('notes/0042. 待删除/0042. 待删除.md', '# 已提交内容\n')
  await write('notes/0043. 无关/0043. 无关.md', '# 无关\n')
  git(['add', '-A'])
  git(['commit', '-q', '-m', 'feat: 初始'])
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
})

describe('删除前记录当前版本', () => {
  it('提交范围只含目标路径，不夹带无关改动、无变化不产生空提交', async () => {
    // 目标里有未提交改动；范围外也有（不能进提交）
    await write('notes/0042. 待删除/0042. 待删除.md', '# 已提交内容\n未提交的一笔\n')
    await write('notes/0042. 待删除/未跟踪.md', '未跟踪内容\n')
    await write('notes/0043. 无关/0043. 无关.md', '# 无关\n别人的改动\n')

    const result = await commitDeleteScope({
      knowledgeBaseId: 'kb-1',
      rootPath: root,
      preview: preview(),
      untrackedFilePaths: [path.join(root, 'notes/0042. 待删除/未跟踪.md')],
      uncommittedFilePaths: [path.join(root, 'notes/0042. 待删除/0042. 待删除.md')]
    })

    expect(result.commit).toBeTruthy()
    expect(git(['log', '-1', '--format=%s']).trim()).toBe('backup: 0042 待删除 删除前记录当前版本')
    const changed = git(['show', '--name-only', '--format=', '-z', result.commit!])
      .split('\0')
      .map((value) => value.replace(/^\n+/, '').trim())
      .filter(Boolean)
      .sort()
    expect(changed).toEqual(['notes/0042. 待删除/0042. 待删除.md', 'notes/0042. 待删除/未跟踪.md'])
    // 提交后预览里的计数归零
    expect(result.preview.untrackedFilePaths).toEqual([])
    expect(result.preview.uncommittedFilePaths).toEqual([])
    // 范围外的改动仍留在工作区
    expect(git(['status', '--porcelain'])).toContain('notes/0043. 无关/0043. 无关.md')
  })

  it('范围内没有变化时不提交，预览原样返回', async () => {
    const result = await commitDeleteScope({
      knowledgeBaseId: 'kb-1',
      rootPath: root,
      preview: preview(),
      untrackedFilePaths: [],
      uncommittedFilePaths: []
    })
    expect(result.commit).toBeNull()
    expect(result.preview).toMatchObject({ snapshotRevision: 'r1' })
    expect(git(['log', '--oneline']).trim().split('\n')).toHaveLength(1)
  })

  it('提交说明按范围给可读描述', () => {
    expect(deleteBackupMessage(preview())).toContain('backup: 0042 待删除')
    expect(
      deleteBackupMessage(
        preview({
          notes: [
            { noteUuid: 'n1', index: '0042', title: 'A', directoryPath: '/a' },
            { noteUuid: 'n2', index: '0043', title: 'B', directoryPath: '/b' }
          ]
        })
      )
    ).toBe('backup: 删除前记录当前版本（2 篇笔记）')
    expect(deleteBackupMessage(preview({ notes: [] }))).toBe('backup: 删除前记录当前版本')
  })

  it('withCommittedRange 只清空两个计数', () => {
    const committed = withCommittedRange(
      preview({ untrackedFilePaths: ['/a'], uncommittedFilePaths: ['/b'] })
    )
    expect(committed.untrackedFilePaths).toEqual([])
    expect(committed.uncommittedFilePaths).toEqual([])
    expect(committed.filePaths).toHaveLength(1)
  })
})
