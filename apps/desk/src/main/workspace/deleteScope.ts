import { commitPaths } from '../history/gitSnapshot'

import type { DeleteCommitResultDto, DeletePreviewDto } from '../../shared/contracts'

/**
 * 「删除前先记录当前版本」（计划 P1-2 决策：删除本身不自动提交）。
 *
 * 只有在用户**显式点击**对话框里的按钮时才会写 Git；提交复用 H0 的按路径独立索引，
 * 只包含这次要删除的范围，不夹带其它已暂存/未暂存内容；范围内没有变化不产生空提交。
 */

export interface DeleteCommitInput {
  knowledgeBaseId: string
  rootPath: string
  preview: DeletePreviewDto
  untrackedFilePaths: string[]
  uncommittedFilePaths: string[]
  gitExecutable?: string
}

/** 提交说明：沿用计划 §4.3 的 `backup:` 约定，并带上可读的范围描述。 */
export function deleteBackupMessage(preview: DeletePreviewDto): string {
  if (preview.notes.length === 1) {
    const note = preview.notes[0]!
    return `backup: ${note.index} ${note.title} 删除前记录当前版本`
  }
  if (preview.notes.length > 1) {
    return `backup: 删除前记录当前版本（${preview.notes.length} 篇笔记）`
  }
  return 'backup: 删除前记录当前版本'
}

/** 提交后重新预览：范围里已经没有未提交内容。 */
export function withCommittedRange(preview: DeletePreviewDto): DeletePreviewDto {
  return { ...preview, untrackedFilePaths: [], uncommittedFilePaths: [] }
}

export async function commitDeleteScope(input: DeleteCommitInput): Promise<DeleteCommitResultDto> {
  const paths = [...input.preview.filePaths, ...input.preview.directoryPaths]
  const result = await commitPaths(input.rootPath, paths, deleteBackupMessage(input.preview), {
    gitExecutable: input.gitExecutable
  })
  return {
    commit: result.commit,
    preview: result.commit === null ? input.preview : withCommittedRange(input.preview)
  }
}
