import { describe, expect, it } from 'vitest'

import { parseGitStatus } from './gitManager'

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
