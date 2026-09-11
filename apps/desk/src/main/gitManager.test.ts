import { describe, expect, it } from 'vitest'

import {
  changesInsideTargets,
  GitManager,
  parseGitStatus,
  shouldScheduleAutoPush
} from './gitManager'

describe('Git porcelain parser', () => {
  it('parses tracked, untracked, renamed and conflicted paths', () => {
    const result = parseGitStatus(
      ' M notes/0001. 标题.md\0?? assets/new.png\0R  notes/0002. 新.md\0notes/0002. 旧.md\0UU TOC.md\0'
    )
    expect(result).toMatchObject([
      { path: 'notes/0001. 标题.md', status: 'modified', worktree: true },
      { path: 'assets/new.png', status: 'untracked' },
      {
        path: 'notes/0002. 新.md',
        previousPath: 'notes/0002. 旧.md',
        status: 'renamed',
        staged: true
      },
      { path: 'TOC.md', status: 'conflicted' }
    ])
  })
})

describe('changesInsideTargets', () => {
  const root = '/kb'
  const changes = [
    { path: 'notes/0042. A/0042. A.md', status: 'modified', staged: false, worktree: true },
    { path: 'notes/0042. A/0042. A 副本.md', status: 'untracked', staged: false, worktree: false },
    { path: 'assets/0042-a.png', status: 'modified', staged: true, worktree: false },
    { path: 'notes/0043. B/0043. B.md', status: 'modified', staged: false, worktree: true },
    { path: 'TOC.md', status: 'modified', staged: false, worktree: true }
  ] as const

  it('按文件与目录前缀匹配，且不做兄弟目录的前缀误判', () => {
    const inside = changesInsideTargets([...changes], root, ['/kb/notes/0042. A'])
    expect(inside.map((change) => change.path)).toEqual([
      'notes/0042. A/0042. A.md',
      'notes/0042. A/0042. A 副本.md'
    ])
    // 0043 不能因为 0042 的前缀被带进来
    expect(
      changesInsideTargets([...changes], root, ['/kb/notes/0042. A']).some((change) =>
        change.path.includes('0043')
      )
    ).toBe(false)
  })

  it('单文件目标精确匹配，空目标返回空', () => {
    expect(
      changesInsideTargets([...changes], root, ['/kb/assets/0042-a.png']).map(
        (change) => change.path
      )
    ).toEqual(['assets/0042-a.png'])
    expect(changesInsideTargets([...changes], root, [])).toEqual([])
  })
})

describe('删除范围提示（Git 未就绪时不能抛错）', () => {
  it('仓库还没注册时返回空数组，而不是让调用方失败', () => {
    const manager = new GitManager()
    // 启动后 configure 是 2 秒防抖：这个窗口内点删除必须还能弹出对话框
    expect(manager.untrackedFilesInside('未注册的知识库', ['/kb/notes/1.md'])).toEqual([])
    expect(manager.uncommittedFilesInside('未注册的知识库', ['/kb/notes/1.md'])).toEqual([])
    // 调用方要用 isReady 区分「真的没有变更」与「还读不到」
    expect(manager.isReady('未注册的知识库')).toBe(false)
  })
})

describe('shouldScheduleAutoPush', () => {
  it('does not reschedule while asset writes are paused', () => {
    expect(
      shouldScheduleAutoPush({
        enabled: true,
        paused: true,
        hasChanges: true,
        conflict: false,
        behind: 0
      })
    ).toBe(false)
    expect(
      shouldScheduleAutoPush({
        enabled: true,
        paused: false,
        hasChanges: true,
        conflict: false,
        behind: 0
      })
    ).toBe(true)
  })
})
