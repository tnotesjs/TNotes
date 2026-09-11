import { describe, expect, it } from 'vitest'

import {
  normalizePosixRelative,
  noteRelativeAssetPath,
  resolveNoteAssetRelPath
} from './noteAssetPath'

describe('normalizePosixRelative', () => {
  it('合并 . 与空段', () => {
    expect(normalizePosixRelative('./a//b/./c')).toBe('a/b/c')
  })

  it('解析 .. 但越界时返回 null', () => {
    expect(normalizePosixRelative('notes/a/../../assets/x.png')).toBe('assets/x.png')
    expect(normalizePosixRelative('../outside.png')).toBeNull()
  })
})

describe('resolveNoteAssetRelPath', () => {
  const noteRelPath = 'notes/0004. 边界与断链.md'

  it('把笔记相对路径解析成知识库相对路径', () => {
    expect(resolveNoteAssetRelPath(noteRelPath, '../assets/0004-drawing.excalidraw')).toBe(
      'assets/0004-drawing.excalidraw'
    )
    expect(resolveNoteAssetRelPath('notes/sub/0004. x.md', '../../assets/x.excalidraw')).toBe(
      'assets/x.excalidraw'
    )
    // `./assets/...` 在 notes/ 下指的是 notes/assets/…，不是库的 assets/，必须拒绝
    expect(resolveNoteAssetRelPath(noteRelPath, './assets/x.excalidraw')).toBeNull()
  })

  it('去掉查询串与锚点', () => {
    expect(resolveNoteAssetRelPath(noteRelPath, '../assets/x.excalidraw?raw=1#frag')).toBe(
      'assets/x.excalidraw'
    )
  })

  it('拒绝外部协议、绝对协议与越出 assets/ 的目标', () => {
    expect(resolveNoteAssetRelPath(noteRelPath, 'https://example.com/a.excalidraw')).toBeNull()
    expect(resolveNoteAssetRelPath(noteRelPath, '//host/a.excalidraw')).toBeNull()
    expect(resolveNoteAssetRelPath(noteRelPath, '#frag')).toBeNull()
    expect(resolveNoteAssetRelPath(noteRelPath, '../notes/other.md')).toBeNull()
    expect(resolveNoteAssetRelPath(noteRelPath, '../../../etc/passwd')).toBeNull()
  })

  it('笔记在库根时也能解析', () => {
    expect(resolveNoteAssetRelPath('0001. x.md', './assets/a.excalidraw')).toBe(
      'assets/a.excalidraw'
    )
  })
})

describe('noteRelativeAssetPath（插入组件用）', () => {
  it('从库根/notes/ 子目录都给出可解析回来的相对引用', () => {
    expect(noteRelativeAssetPath('notes/0001. x.md', 'assets/0001-a.excalidraw')).toBe(
      '../assets/0001-a.excalidraw'
    )
    expect(noteRelativeAssetPath('0001. x.md', 'assets/0001-a.excalidraw')).toBe(
      './assets/0001-a.excalidraw'
    )
    expect(noteRelativeAssetPath('notes/sub/0001. x.md', 'assets/0001-a.excalidraw')).toBe(
      '../../assets/0001-a.excalidraw'
    )
  })

  it('与 resolveNoteAssetRelPath 互为逆运算', () => {
    for (const note of ['notes/0001. x.md', '0001. x.md', 'notes/a/b/0001. x.md']) {
      const relative = noteRelativeAssetPath(note, 'assets/0001-a.excalidraw')
      expect(relative).not.toBeNull()
      expect(resolveNoteAssetRelPath(note, relative!)).toBe('assets/0001-a.excalidraw')
    }
  })

  it('空参数返回 null', () => {
    expect(noteRelativeAssetPath('', 'assets/a.excalidraw')).toBeNull()
    expect(noteRelativeAssetPath('notes/a.md', '')).toBeNull()
  })
})
