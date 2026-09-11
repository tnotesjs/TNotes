import type { DeletePreviewDto } from '../../shared/contracts'

/**
 * 删除后果说明：只讲用户需要知道的后果，不堆文案。
 *
 * - 未跟踪：git 里从来没有过 → 删了就没了
 * - 有未提交改动：git 里只有上一次提交的内容 → 这次改动没了
 */
export function deleteConsequenceLines(preview: DeletePreviewDto): string[] {
  if (!preview.gitReady) {
    // 读不到 Git 状态时不能声称「都已提交」——那是错的
    return [
      '暂时读不到 Git 状态，无法确认哪些内容已提交；需要留下当前版本可先点「先记录当前版本」。'
    ]
  }
  const lines: string[] = []
  if (preview.untrackedFilePaths.length > 0) {
    lines.push(`${preview.untrackedFilePaths.length} 个文件尚未被 Git 跟踪，删除后无法找回。`)
  }
  if (preview.uncommittedFilePaths.length > 0) {
    lines.push(
      `${preview.uncommittedFilePaths.length} 个文件的改动尚未提交，删除后这部分改动无法找回；需要留下当前版本就先提交一次。`
    )
  }
  return lines
}

/** True when delete only rewrites TOC.md — no notes or files would be removed. */
export function isEmptyDeletePreview(preview: DeletePreviewDto): boolean {
  return (
    preview.notes.length === 0 &&
    preview.filePaths.length === 0 &&
    preview.directoryPaths.length === 0 &&
    preview.untrackedFilePaths.length === 0
  )
}
