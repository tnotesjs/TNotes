import { describe, expect, it } from 'vitest'

import { normalizePosixRelative, resolveNoteAssetRelPath } from './noteAssetPath'

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
