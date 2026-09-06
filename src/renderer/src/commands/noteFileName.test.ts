import { describe, expect, it } from 'vitest'

import { noteFileName } from './noteFileName'

describe('noteFileName', () => {
  it('prefers the real on-disk name and keeps the index prefix', () => {
    expect(
      noteFileName({ noteIndex: '0001', title: '欢迎', fileName: '0001. 欢迎.md' })
    ).toBe('0001. 欢迎')
    expect(
      noteFileName({ noteIndex: '0112', title: '前端', dirName: '0112.前端学习路线' })
    ).toBe('0112.前端学习路线')
  })

  it('falls back to index plus title', () => {
    expect(noteFileName({ noteIndex: '0038', title: '后台搜索' })).toBe('0038. 后台搜索')
  })
})
