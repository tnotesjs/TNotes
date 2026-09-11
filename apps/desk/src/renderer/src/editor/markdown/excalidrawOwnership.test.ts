import { describe, expect, it } from 'vitest'

import {
  checkExcalidrawOwnership,
  excalidrawOwnerIndex,
  noteIndexFromRelPath
} from './excalidrawOwnership'

const CANVAS = 'assets/0004-26-09-10-15-30-00.excalidraw'

describe('归属解析', () => {
  it('从文件名取四位前缀', () => {
    expect(excalidrawOwnerIndex(CANVAS)).toBe('0004')
    expect(excalidrawOwnerIndex('assets/drawing.excalidraw')).toBeNull()
    expect(noteIndexFromRelPath('notes/0001. 标题.md')).toBe('0001')
    expect(noteIndexFromRelPath('notes/标题.md')).toBeNull()
  })
})

describe('checkExcalidrawOwnership', () => {
  it('编号一致才允许内嵌编辑', () => {
    expect(
      checkExcalidrawOwnership({
        relPath: CANVAS,
        noteIndex: '0004',
        noteRelPath: 'notes/0004. 边界.md'
      })
    ).toEqual({ ok: true, ownerIndex: '0004' })
  })

  it('编号不一致给诊断，不打开写编辑', () => {
    const result = checkExcalidrawOwnership({
      relPath: CANVAS,
      noteIndex: '0001',
      noteRelPath: 'notes/0001. 开始.md'
    })
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.code).toBe('mismatch')
    expect(result.message).toContain('0004')
    expect(result.message).toContain('0001')
  })

  it('文件名没有前缀时给 missing-owner', () => {
    const result = checkExcalidrawOwnership({
      relPath: 'assets/drawing.excalidraw',
      noteIndex: '0001',
      noteRelPath: 'notes/0001. x.md'
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('missing-owner')
  })

  it('笔记本身没有编号时用 unknown-note-index（不发明 0000）', () => {
    const result = checkExcalidrawOwnership({
      relPath: CANVAS,
      noteIndex: '',
      noteRelPath: 'notes/README.md'
    })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.code).toBe('unknown-note-index')
  })

  it('会话没有编号时用笔记文件名兜底', () => {
    expect(
      checkExcalidrawOwnership({
        relPath: CANVAS,
        noteIndex: '',
        noteRelPath: 'notes/0004. 边界.md'
      })
    ).toEqual({ ok: true, ownerIndex: '0004' })
  })
})
