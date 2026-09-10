import { describe, expect, it } from 'vitest'

import type { DeletePreviewDto } from '../../shared/contracts'
import { isEmptyDeletePreview } from './deletePreview'

function preview(overrides: Partial<DeletePreviewDto> = {}): DeletePreviewDto {
  return {
    knowledgeBaseId: 'kb-a',
    entry: { type: 'folder', folderPath: ['空分组'] },
    notes: [],
    filePaths: [],
    directoryPaths: [],
    untrackedFilePaths: [],
    snapshotRevision: '1',
    ...overrides
  }
}

describe('isEmptyDeletePreview', () => {
  it('treats a folder with no notes or files as empty', () => {
    expect(isEmptyDeletePreview(preview())).toBe(true)
  })

  it('requires confirmation when any notes or files would be removed', () => {
    expect(
      isEmptyDeletePreview(
        preview({
          entry: { type: 'note', noteUuid: 'n1' },
          notes: [
            {
              noteUuid: 'n1',
              index: '0001',
              title: '第一篇',
              directoryPath: '/kb/notes/0001.md'
            }
          ],
          filePaths: ['/kb/notes/0001.md']
        })
      )
    ).toBe(false)
    expect(isEmptyDeletePreview(preview({ directoryPaths: ['/kb/notes'] }))).toBe(false)
    expect(isEmptyDeletePreview(preview({ untrackedFilePaths: ['scratch.txt'] }))).toBe(false)
  })
})
