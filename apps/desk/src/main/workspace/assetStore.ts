import { createHash } from 'node:crypto'
import path from 'node:path'

import type { AssetStorePaths } from '@tnotesjs/kb'

/** Per-KB journal/recycle dirs in Desk userData. Never under the KB `assets/`. */
export function knowledgeBaseAssetStore(userDataDir: string, rootPath: string): AssetStorePaths {
  const key = createHash('sha256').update(path.resolve(rootPath)).digest('hex')
  return {
    journalDir: path.join(userDataDir, 'asset-journals', key),
    recycleDir: path.join(userDataDir, 'asset-recycle', key)
  }
}

export function knowledgeBaseAssetHashCache(userDataDir: string, rootPath: string): string {
  const key = createHash('sha256').update(path.resolve(rootPath)).digest('hex')
  return path.join(userDataDir, 'asset-hash-cache', `${key}.json`)
}
