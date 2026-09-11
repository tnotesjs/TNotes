import { describe, expect, it } from 'vitest'

import type { DeletePreviewDto } from '../../shared/contracts'
import { deleteConsequenceLines, isEmptyDeletePreview } from './deletePreview'

function preview(overrides: Partial<DeletePreviewDto> = {}): DeletePreviewDto {
  return {
    knowledgeBaseId: 'kb-a',
    entry: { type: 'folder', folderPath: ['空分组'] },
    notes: [],
    filePaths: [],
    directoryPaths: [],
    untrackedFilePaths: [],
    uncommittedFilePaths: [],
    gitReady: true,
    snapshotRevision: '1',
    ...overrides
  }
}

describe('deleteConsequenceLines', () => {
  it('Git 状态没就绪时说明「读不到」，而不是谎称都已提交', () => {
    expect(deleteConsequenceLines(preview({ gitReady: false }))).toEqual([
      '暂时读不到 Git 状态，无法确认哪些内容已提交；需要留下当前版本可先点「先记录当前版本」。'
    ])
  })

  it('全部已提交时不堆文案', () => {
    expect(deleteConsequenceLines(preview({ filePaths: ['/kb/notes/1.md'] }))).toEqual([])
  })

  it('未跟踪与未提交分别给一句可读后果', () => {
    expect(
      deleteConsequenceLines(
        preview({
          untrackedFilePaths: ['/kb/notes/1.md', '/kb/notes/2.md'],
          uncommittedFilePaths: ['/kb/notes/3.md']
        })
      )
    ).toEqual([
      '2 个文件尚未被 Git 跟踪，删除后无法找回。',
      '1 个文件的改动尚未提交，删除后这部分改动无法找回；需要留下当前版本就先提交一次。'
    ])
  })
})

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
