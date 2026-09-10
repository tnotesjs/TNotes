import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { createWorkspace } from '@tnotesjs/kb'

import { backfillMissingNoteIds, type WorkspaceScanState } from './scan'
import type { KnowledgeBaseHandle } from './types'

const cleanups: Array<() => Promise<void>> = []

afterEach(async () => {
  while (cleanups.length > 0) {
    await cleanups.pop()?.()
  }
})

async function makeHandleWithoutNoteId(): Promise<KnowledgeBaseHandle> {
  const rootPath = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-scan-'))
  cleanups.push(async () => fs.rm(rootPath, { recursive: true, force: true }))
  await fs.mkdir(path.join(rootPath, 'notes'), { recursive: true })
  await fs.writeFile(path.join(rootPath, 'tnotes.json'), '{ "title": "测试库" }\n')
  await fs.writeFile(path.join(rootPath, 'TOC.md'), '- [ ] 0001. 手写笔记\n')
  await fs.writeFile(path.join(rootPath, 'notes', '0001. 手写笔记.md'), '# 手写笔记\n\n正文。\n')
  const workspace = createWorkspace({ rootPath })
  return {
    id: 'kb-test',
    name: 'TNotes.test',
    rootPath,
    workspace,
    snapshot: await workspace.scan()
  }
}

function makeState(): WorkspaceScanState {
  return { internalWriteUntil: new Map() } as unknown as WorkspaceScanState
}

describe('backfillMissingNoteIds', () => {
  it('回填缺失的笔记 id，并把这次写盘标记为内部写入', async () => {
    const handle = await makeHandleWithoutNoteId()
    const state = makeState()
    expect(handle.snapshot.notes[0]?.frontmatter.id).toBeFalsy()

    await backfillMissingNoteIds(state, handle)

    const notePath = path.normalize(path.join(handle.rootPath, 'notes', '0001. 手写笔记.md'))
    const until = state.internalWriteUntil.get(notePath) ?? 0
    // 不标记的话，fs.watch 会把这次回填当成外部修改
    expect(until).toBeGreaterThan(Date.now())
    expect(handle.snapshot.notes[0]?.frontmatter.id).toBeTruthy()
    expect(await fs.readFile(notePath, 'utf8')).toMatch(/^---\nid: /)
  })
})
