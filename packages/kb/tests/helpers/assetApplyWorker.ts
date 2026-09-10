/**
 * Crash-recovery worker. Spawned as a real subprocess so journal tests can
 * `process.exit` instead of catching an in-process exception.
 *
 * Usage: node assetApplyWorker.cjs <config.json>
 */
import fs from 'node:fs/promises'

import { applyAssetPlan } from '../../src/asset-scan/apply'

async function main(): Promise<void> {
  const configPath = process.argv[2]
  if (!configPath) {
    console.error('assetApplyWorker: missing config path')
    process.exit(2)
  }

  const config = JSON.parse(await fs.readFile(configPath, 'utf8')) as {
    rootPath: string
    plan: import('../../src/asset-scan/types').AssetOperationPlan
    journalDir: string
    recycleDir: string
  }

  const result = await applyAssetPlan(config.rootPath, config.plan, {
    journalDir: config.journalDir,
    recycleDir: config.recycleDir
  })
  await fs.writeFile(`${configPath}.result.json`, `${JSON.stringify(result, null, 2)}\n`)
}

void main()
