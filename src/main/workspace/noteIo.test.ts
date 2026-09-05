import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { createWorkspace } from '@tnotesjs/kb'

import { toNoteDocument } from './dto'
import { readNote, resolveNoteAsset, resolveNoteIndex, saveNote } from './noteIo'
import type { KnowledgeBaseHandle } from './types'

const cleanups: Array<() => Promise<void>> = []

afterEach(async () => {
  while (cleanups.length > 0) {
    await cleanups.pop()?.()
  }
})

async function makeHandle(): Promise<KnowledgeBaseHandle> {
  const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-kb-'))
  cleanups.push(async () => fs.rm(rootPath, { recursive: true, force: true }))
  await fs.mkdir(path.join(rootPath, 'notes'), { recursive: true })
  await fs.writeFile(path.join(rootPath, 'tnotes.json'), '{ "title": "测试库" }\n')
  await fs.writeFile(path.join(rootPath, 'TOC.md'), '- [ ] 0001. 第一篇\n- [x] 0002. 第二篇\n')
  await fs.writeFile(path.join(rootPath, 'notes', '0001. 第一篇.md'), '# 第一篇\n\n正文。\n')
  await fs.writeFile(
    path.join(rootPath, 'notes', '0002. 第二篇.md'),
    '---\nid: note-uuid-2\n---\n\n# 第二篇\n'
  )
  const workspace = createWorkspace({ rootPath })
  const handle: KnowledgeBaseHandle = {
    id: 'kb-test',
    name: 'TNotes.test',
    rootPath,
    workspace,
    snapshot: await workspace.scan()
  }
  return handle
}

const noopEffects = {
  markInternalWrites: () => {},
  emitChanged: () => {}
}

describe('desk noteIo over @tnotesjs/kb', () => {
  it('resolves renderer uuid (frontmatter id) to the note index', async () => {
    const handle = await makeHandle()
    expect(resolveNoteIndex(handle, 'note-uuid-2')).toBe('0002')
    // 无 id 的笔记回退到索引号
    expect(resolveNoteIndex(handle, '0001')).toBe('0001')
    expect(() => resolveNoteIndex(handle, 'missing')).toThrowError()
  })

  it('reads a note document with the new single-file shape', async () => {
    const handle = await makeHandle()
    const doc = await readNote(handle, 'note-uuid-2')
    expect(doc.fileName).toBe('0002. 第二篇.md')
    expect(doc.relPath).toBe('notes/0002. 第二篇.md')
    expect(doc.filePath).toBe(path.join(handle.rootPath, 'notes', '0002. 第二篇.md'))
    expect(doc.config.done).toBe(true)
    expect(doc.content).toContain('# 第二篇')
  })

  it('saves note content with revision conflict detection', async () => {
    const handle = await makeHandle()
    const doc = await readNote(handle, '0001')
    const saved = await saveNote(
      handle,
      {
        knowledgeBaseId: handle.id,
        noteUuid: '0001',
        content: '# 第一篇\n\n改过的正文。\n',
        expectedRevision: doc.revision,
        prettier: false
      },
      noopEffects
    )
    expect(saved.note.content).toContain('改过的正文')
    await expect(
      saveNote(
        handle,
        {
          knowledgeBaseId: handle.id,
          noteUuid: '0001',
          content: 'stale',
          expectedRevision: doc.revision,
          prettier: false
        },
        noopEffects
      )
    ).rejects.toThrowError(/外部修改/)
  })

  it('resolves kb-level asset references and rejects traversal', async () => {
    const handle = await makeHandle()
    await fs.mkdir(path.join(handle.rootPath, 'assets'), { recursive: true })
    await fs.writeFile(path.join(handle.rootPath, 'assets', 'pic.png'), 'png')
    await expect(resolveNoteAsset(handle, '../assets/pic.png')).resolves.toBe(
      path.join(handle.rootPath, 'assets', 'pic.png')
    )
    await expect(resolveNoteAsset(handle, '../outside/pic.png')).rejects.toThrowError()
    await expect(resolveNoteAsset(handle, '../assets/pic.exe')).rejects.toThrowError()
  })

  it('maps note documents without leaking legacy fields', async () => {
    const handle = await makeHandle()
    const doc = await readNote(handle, '0001')
    const dto = toNoteDocument(handle, {
      ...(await handle.workspace.notes.read('0001'))
    })
    expect(dto).not.toHaveProperty('directoryPath')
    expect(dto).not.toHaveProperty('readmePath')
    expect(dto).not.toHaveProperty('configPath')
    expect(doc.dirName).toBe('0001. 第一篇')
  })
})
