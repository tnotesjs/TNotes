import type { DeletePreviewDto } from '../../shared/contracts'

/** True when delete only rewrites TOC.md — no notes or files would be removed. */
export function isEmptyDeletePreview(preview: DeletePreviewDto): boolean {
  return (
    preview.notes.length === 0 &&
    preview.filePaths.length === 0 &&
    preview.directoryPaths.length === 0 &&
    preview.untrackedFilePaths.length === 0
  )
}
