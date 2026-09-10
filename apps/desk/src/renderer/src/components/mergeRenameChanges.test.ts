import { describe, expect, it } from 'vitest'
import { mergeRenameChanges } from './mergeRenameChanges'
import type { GitFileChangeDto } from '../../../shared/contracts'

function change(
  partial: Partial<GitFileChangeDto> & { path: string; status: GitFileChangeDto['status'] }
): GitFileChangeDto {
  return { staged: false, worktree: true, ...partial }
}

describe('mergeRenameChanges', () => {
  it('合并同索引的 deleted+untracked（笔记 .md）为一条 renamed', () => {
    const raw = [
      change({ path: 'notes/0016. TNotes 更新日志.md', status: 'deleted' }),
      change({ path: 'notes/0016. TNotes 更新日志111.md', status: 'untracked' })
    ]
    const merged = mergeRenameChanges(raw)
    expect(merged).toHaveLength(1)
    expect(merged[0]).toMatchObject({
      path: 'notes/0016. TNotes 更新日志111.md',
      previousPath: 'notes/0016. TNotes 更新日志.md',
      status: 'renamed'
    })
  })

  it('不同索引的 deleted/untracked 不合并', () => {
    const raw = [
      change({ path: 'notes/0016. 旧.md', status: 'deleted' }),
      change({ path: 'notes/0024. 新.md', status: 'untracked' })
    ]
    expect(mergeRenameChanges(raw)).toHaveLength(2)
  })

  it('仅单独的 deleted 或 untracked 保持不变', () => {
    const deleted = change({ path: 'notes/0016. X.md', status: 'deleted' })
    const untracked = change({ path: 'notes/0016. X.md', status: 'untracked' })
    expect(mergeRenameChanges([deleted])).toHaveLength(1)
    expect(mergeRenameChanges([untracked])).toHaveLength(1)
  })

  it('非 notes 路径（TOC.md / tnotes.json）不受影响', () => {
    const toc = change({ path: 'TOC.md', status: 'modified' })
    const config = change({ path: 'tnotes.json', status: 'modified' })
    expect(mergeRenameChanges([toc, config])).toHaveLength(2)
  })

  it('合并后的重命名条目前部保留 untracked 富化字段（noteUuid）', () => {
    const raw = [
      change({ path: 'notes/0016. 旧.md', status: 'deleted' }),
      change({
        path: 'notes/0016. 新.md',
        status: 'untracked',
        noteUuid: 'uuid-1',
        noteIndex: '0016',
        noteTitle: '新'
      })
    ]
    const merged = mergeRenameChanges(raw)
    expect(merged[0]).toMatchObject({ noteUuid: 'uuid-1', noteIndex: '0016', noteTitle: '新' })
  })

  it('软删（旧路径 D + .trash 下同索引 U）合并为一条 renamed', () => {
    const raw = [
      change({ path: 'notes/0005. Broken.md', status: 'deleted' }),
      change({ path: 'notes/.trash/0005. Broken.md', status: 'untracked' })
    ]
    const merged = mergeRenameChanges(raw)
    expect(merged).toHaveLength(1)
    expect(merged[0]).toMatchObject({
      path: 'notes/.trash/0005. Broken.md',
      previousPath: 'notes/0005. Broken.md',
      status: 'renamed'
    })
  })
})
