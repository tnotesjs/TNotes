import { describe, expect, it } from 'vitest'

import {
  describeCommit,
  resolveSelection,
  restoreDisabledReason,
  shallowNotice,
  summarizeChangedPaths,
  truncatedNotice
} from './historyPaneModel'

import type { HistoryCommitSummaryDto } from '../../../shared/contracts'

function commit(overrides: Partial<HistoryCommitSummaryDto> = {}): HistoryCommitSummaryDto {
  return {
    oid: 'a'.repeat(40),
    shortOid: 'aaaaaaa',
    committedAt: 1_700_000_000,
    authorName: 'T',
    subject: 'docs: 更新',
    parents: [],
    changedPaths: [],
    isMerge: false,
    touchesIndex: true,
    ...overrides
  }
}

const formatTime = (seconds: number): string => `t${seconds}`

describe('历史条目变更概览', () => {
  it('区分正文与资源改动', () => {
    expect(
      summarizeChangedPaths([
        'notes/0042. A.md',
        'assets/0042-a.png',
        'assets/0042-b.excalidraw',
        'TOC.md'
      ])
    ).toEqual({ notes: 1, assets: 2, total: 4 })
  })

  it('条目副标题给出短 OID、时间与变更数量', () => {
    const text = describeCommit(
      commit({
        changedPaths: ['notes/0042. A.md', 'assets/0042-a.png', 'TOC.md']
      }),
      formatTime
    )
    expect(text).toBe('aaaaaaa · t1700000000 · 正文 1 · 资源 1 · 其他 1')
  })

  it('没有路径变化与合并提交都有明确文字', () => {
    expect(describeCommit(commit(), formatTime)).toContain('无路径变化')
    expect(describeCommit(commit({ isMerge: true }), formatTime)).toContain('合并')
  })
})

describe('浅克隆与恢复门禁文案', () => {
  it('完整仓库不显示浅克隆提示', () => {
    expect(shallowNotice({ shallow: false })).toBe('')
    expect(shallowNotice(null)).toBe('')
  })

  it('浅克隆明确说明本地历史不完整', () => {
    expect(shallowNotice({ shallow: true })).toContain('浅克隆')
  })

  it('命中扫描上限时说明只扫描了一部分，完整历史不提示', () => {
    expect(truncatedNotice({ truncated: false })).toBe('')
    expect(truncatedNotice({ truncated: true })).toContain('只扫描了最近的一部分')
  })

  it('恢复禁用原因按优先级给出：未选版本 → 非文本正文 → H4/H5 门禁', () => {
    expect(
      restoreDisabledReason({ hasSelection: false, gate: { open: false, body: 'unknown' } })
    ).toContain('选择一个历史版本')
    expect(
      restoreDisabledReason({ hasSelection: true, gate: { open: false, body: 'binary' } })
    ).toContain('不是文本文件')
    expect(
      restoreDisabledReason({ hasSelection: true, gate: { open: false, body: 'text' } })
    ).toContain('H4/H5')
    expect(restoreDisabledReason({ hasSelection: true, gate: { open: true, body: 'text' } })).toBe(
      ''
    )
  })
})

describe('选中版本解析', () => {
  const commits = [commit({ oid: 'b'.repeat(40) }), commit({ oid: 'c'.repeat(40) })]

  it('选中的版本还在列表里就保留，否则回到最新一条', () => {
    expect(resolveSelection(commits, 'c'.repeat(40))).toBe('c'.repeat(40))
    expect(resolveSelection(commits, 'd'.repeat(40))).toBe('b'.repeat(40))
    expect(resolveSelection([], 'd'.repeat(40))).toBe('')
  })
})
