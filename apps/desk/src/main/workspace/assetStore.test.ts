import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { knowledgeBaseAssetStore } from './assetStore'

describe('knowledgeBaseAssetStore', () => {
  it('puts journal and recycle under userData, keyed by resolved root, not assets/', () => {
    const userDataDir = path.join(os.tmpdir(), 'desk-user-data')
    const rootPath = path.join(os.tmpdir(), 'kb', 'TNotes.demo')
    const store = knowledgeBaseAssetStore(userDataDir, rootPath)
    expect(store.journalDir.startsWith(path.join(userDataDir, 'asset-journals'))).toBe(true)
    expect(store.recycleDir.startsWith(path.join(userDataDir, 'asset-recycle'))).toBe(true)
    expect(store.journalDir.includes(`${path.sep}assets${path.sep}`)).toBe(false)
    expect(store.recycleDir.includes(`${path.sep}assets${path.sep}`)).toBe(false)
    const again = knowledgeBaseAssetStore(userDataDir, `${rootPath}${path.sep}`)
    expect(again.journalDir).toBe(store.journalDir)
  })

  it('does not claim another knowledge base by folder name', async () => {
    const userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'desk-user-data-'))
    const a = knowledgeBaseAssetStore(userDataDir, path.join(userDataDir, 'kbs', 'TNotes.a'))
    const b = knowledgeBaseAssetStore(userDataDir, path.join(userDataDir, 'other', 'TNotes.a'))
    expect(a.journalDir).not.toBe(b.journalDir)
  })
})
