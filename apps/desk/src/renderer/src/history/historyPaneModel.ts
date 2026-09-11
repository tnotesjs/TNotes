/**
 * 历史标签页的纯展示逻辑（计划 H3）。
 *
 * 与 Vue 组件分开，便于单测：提交条目的变更概览、浅克隆提示、恢复按钮禁用原因。
 * 这些文案是用户唯一能看到的「为什么不能恢复」，所以必须有测试保证不漏说原因。
 */
import type { HistoryCommitSummaryDto, HistoryListResultDto } from '../../../shared/contracts'

export interface HistoryRestoreGate {
  /** H4/H5 门禁是否已开放（当前恒为 false） */
  open: boolean
  /** 选中版本正文是否可安全写回：未知（未加载）/可写/不可写 */
  body: 'unknown' | 'text' | 'binary'
}

export interface HistoryPaneEntriesInput {
  commits: HistoryCommitSummaryDto[]
  selectedCommit: string
}

/** 把改动路径拆成「正文 / 资源 / 其他」，用于条目上的变更概览。 */
export function summarizeChangedPaths(changedPaths: string[]): {
  notes: number
  assets: number
  total: number
} {
  let notes = 0
  let assets = 0
  for (const changed of changedPaths) {
    const basename = changed.split('/').pop() ?? ''
    if (changed.startsWith('notes/') && /^\d{4}[.\s-]/.test(basename)) notes += 1
    else if (changed.startsWith('assets/')) assets += 1
  }
  return { notes, assets, total: changedPaths.length }
}

/** 条目副标题：短 OID + 时间 + 变更概览 + 合并/资源标记。 */
export function describeCommit(
  commit: HistoryCommitSummaryDto,
  formatTime: (seconds: number) => string
): string {
  const { notes, assets, total } = summarizeChangedPaths(commit.changedPaths)
  const parts = [commit.shortOid, formatTime(commit.committedAt)]
  const changes: string[] = []
  if (notes > 0) changes.push(`正文 ${notes}`)
  if (assets > 0) changes.push(`资源 ${assets}`)
  const other = total - notes - assets
  if (other > 0) changes.push(`其他 ${other}`)
  parts.push(changes.length > 0 ? changes.join(' · ') : '无路径变化')
  if (commit.isMerge) parts.push('合并')
  return parts.join(' · ')
}

/** 浅克隆提示；完整仓库返回空字符串。 */
export function shallowNotice(page: Pick<HistoryListResultDto, 'shallow'> | null): string {
  if (!page?.shallow) return ''
  return '浅克隆仓库：本地只有克隆深度内的提交，更早的版本不在这台机器上。'
}

/** 扫描上限提示：更早的相关提交没有全部读出，必须说明而不是假装到底。 */
export function truncatedNotice(page: Pick<HistoryListResultDto, 'truncated'> | null): string {
  if (!page?.truncated) return ''
  return '历史很长，只扫描了最近的一部分提交；更早的相关版本可能没有列出。'
}

/**
 * 恢复按钮禁用原因（按钮文案固定，原因必须说清）。
 *
 * 顺序即优先级：先选版本，再看正文能不能写回，最后才是 H4/H5 门禁。
 */
export function restoreDisabledReason(input: {
  hasSelection: boolean
  gate: HistoryRestoreGate
}): string {
  if (!input.hasSelection) return '先在左侧选择一个历史版本'
  if (input.gate.body === 'binary') return '该版本正文不是文本文件，无法恢复'
  if (!input.gate.open) return '恢复需要备份提交与事务日志（计划 H4/H5），当前只能浏览'
  return ''
}

/** 选中版本是否仍在当前页的列表里（决定切版本后要不要保留选中）。 */
export function resolveSelection(
  commits: HistoryCommitSummaryDto[],
  selectedCommit: string
): string {
  if (selectedCommit && commits.some((commit) => commit.oid === selectedCommit)) {
    return selectedCommit
  }
  return commits[0]?.oid ?? ''
}
