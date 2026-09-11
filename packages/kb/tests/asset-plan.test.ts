import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  applyAssetPlan,
  applyPatchesToText,
  fillPlanHashes,
  recoverIncompleteJournals
} from '../src/asset-scan/apply'
import { planRecycle, planRename } from '../src/asset-scan/plan'
import { rewriteLocalAssetUrl } from '../src/asset-scan/paths'
import { scanAssets } from '../src/asset-scan/scan'
import { createWorkspace } from '../src/workspace'
import {
  PNG_1X1,
  writeIncompleteCoverageFixture,
  writeWritableAssetFixture
} from './helpers/assetScanFixture'

const workerPath = fileURLToPath(new URL('./helpers/assetApplyWorker.ts', import.meta.url))

let root = ''
let journalDir = ''
let recycleDir = ''

async function makeStoreDirs(): Promise<{ journalDir: string; recycleDir: string }> {
  journalDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tnotes-asset-journal-'))
  recycleDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tnotes-asset-recycle-'))
  return { journalDir, recycleDir }
}

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'tnotes-asset-plan-'))
  await writeWritableAssetFixture(root)
  await makeStoreDirs()
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
  await fs.rm(journalDir, { recursive: true, force: true })
  await fs.rm(recycleDir, { recursive: true, force: true })
})

describe('rewriteLocalAssetUrl', () => {
  it('keeps prefix, query and fragment', () => {
    expect(rewriteLocalAssetUrl('../assets/used.png?x=1#y', 'assets/renamed.png')).toBe(
      '../assets/renamed.png?x=1#y'
    )
    expect(rewriteLocalAssetUrl('./assets/mindmap.png', 'assets/mm.png')).toBe('./assets/mm.png')
    expect(rewriteLocalAssetUrl('/assets/used.png', 'assets/renamed.png')).toBeNull()
    expect(rewriteLocalAssetUrl('./used.png', 'assets/renamed.png', 'assets/page.html')).toBe(
      './renamed.png'
    )
  })
})

describe('plan preview', () => {
  it('does not write the knowledge base', async () => {
    const before = await fs.readFile(path.join(root, 'notes/0001. 图.md'))
    const report = await scanAssets(root)
    const plan = planRename(report, {
      fromRelPath: 'assets/used.png',
      toRelPath: 'assets/renamed.png'
    })
    expect(plan.blockedReasons).toEqual([])
    expect(plan.patches.length).toBeGreaterThan(0)
    const after = await fs.readFile(path.join(root, 'notes/0001. 图.md'))
    expect(after.equals(before)).toBe(true)
  })

  it('blocks reserved names, dest clashes and unknown coverage', async () => {
    const report = await scanAssets(root)
    expect(
      planRename(report, { fromRelPath: 'assets/used.png', toRelPath: 'assets/con.png' })
        .blockedReasons.length
    ).toBeGreaterThan(0)
    expect(
      planRename(report, { fromRelPath: 'assets/used.png', toRelPath: 'assets/idle.png' })
        .blockedReasons
    ).toContain('目标已存在: assets/idle.png')
    expect(
      planRename(report, { fromRelPath: 'assets/used.png', toRelPath: 'notes/escape.png' })
        .blockedReasons
    ).toContain('目标必须位于 assets/ 内')

    const incompleteRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'tnotes-asset-blocked-'))
    try {
      await writeIncompleteCoverageFixture(incompleteRoot)
      const incomplete = await scanAssets(incompleteRoot)
      expect(incomplete.coverageComplete).toBe(false)
      const rename = planRename(incomplete, {
        fromRelPath: 'assets/used.png',
        toRelPath: 'assets/renamed.png'
      })
      expect(rename.blockedReasons.length).toBeGreaterThan(0)
      const recycle = planRecycle(incomplete, ['assets/idle.png'])
      expect(recycle.blockedReasons.some((reason) => reason.includes('整库禁用批量清理'))).toBe(
        true
      )
      const drawing = planRecycle(incomplete, ['assets/board.excalidraw'])
      expect(drawing.blockedReasons.some((reason) => /Excalidraw|闲置|批量/.test(reason))).toBe(
        true
      )
    } finally {
      await fs.rm(incompleteRoot, { recursive: true, force: true })
    }
  })
})

describe('applyPatchesToText', () => {
  it('leaves unrelated bytes including {w=} and CRLF', () => {
    const source = '![宽图](../assets/used.png) {w=400px}\r\nnext\r\n'
    const start = source.indexOf('../assets/used.png')
    const patched = applyPatchesToText(source, [
      {
        sourceRelPath: 'notes/a.md',
        startOffset: start,
        endOffset: start + '../assets/used.png'.length,
        expected: '../assets/used.png',
        replacement: '../assets/renamed.png'
      }
    ])
    expect(patched).toBe('![宽图](../assets/renamed.png) {w=400px}\r\nnext\r\n')
  })
})

describe('apply / restore', () => {
  it('renames a referenced image and mindmap dest, then restores', async () => {
    const ws = createWorkspace({ rootPath: root, assetStore: { journalDir, recycleDir } })
    const original = await fs.readFile(path.join(root, 'notes/0001. 图.md'), 'utf8')
    const plan = await ws.assets.planRename({
      fromRelPath: 'assets/used.png',
      toRelPath: 'assets/renamed.png'
    })
    expect(plan.blockedReasons).toEqual([])
    expect(plan.patches.some((patch) => patch.expected.includes('?download=1#frag'))).toBe(true)

    const applied = await ws.assets.applyPlan(plan)
    expect(applied.status).toBe('applied')
    await expect(fs.access(path.join(root, 'assets/used.png'))).rejects.toThrow()
    await fs.access(path.join(root, 'assets/renamed.png'))
    const rewritten = await fs.readFile(path.join(root, 'notes/0001. 图.md'), 'utf8')
    expect(rewritten).toContain('../assets/renamed.png) {w=400px}')
    expect(rewritten).toContain('../assets/renamed.png?download=1#frag')
    expect(rewritten).toContain('./assets/mindmap.png')
    expect(rewritten).toContain('![截图|400]')
    expect(rewritten.includes('{w=400px}')).toBe(true)

    const restored = await ws.assets.restorePlan(plan.id)
    expect(restored.status).toBe('applied')
    expect(await fs.readFile(path.join(root, 'notes/0001. 图.md'), 'utf8')).toBe(original)
    await fs.access(path.join(root, 'assets/used.png'))
    await expect(fs.access(path.join(root, 'assets/renamed.png'))).rejects.toThrow()
  })

  it('recycles an idle candidate via copy-verify-delete and restores it', async () => {
    const ws = createWorkspace({ rootPath: root, assetStore: { journalDir, recycleDir } })
    const plan = await ws.assets.planRecycle({ relPaths: ['assets/idle.png'] })
    expect(plan.blockedReasons).toEqual([])
    const applied = await ws.assets.applyPlan(plan)
    expect(applied.status).toBe('applied')
    await expect(fs.access(path.join(root, 'assets/idle.png'))).rejects.toThrow()
    await fs.access(path.join(recycleDir, plan.id, 'assets/idle.png'))
    expect(recycleDir.startsWith(path.join(root, 'assets'))).toBe(false)

    const restored = await ws.assets.restorePlan(plan.id)
    expect(restored.status).toBe('applied')
    await fs.access(path.join(root, 'assets/idle.png'))
  })

  it('lists applied and restored journals for history', async () => {
    const ws = createWorkspace({ rootPath: root, assetStore: { journalDir, recycleDir } })
    const plan = await ws.assets.planRecycle({ relPaths: ['assets/idle.png'] })
    await ws.assets.applyPlan(plan)
    const listed = await ws.assets.listJournals()
    expect(listed).toHaveLength(1)
    expect(listed[0]?.plan.id).toBe(plan.id)
    expect(listed[0]?.stage).toBe('applied')
    await ws.assets.restorePlan(plan.id)
    expect((await ws.assets.listJournals())[0]?.stage).toBe('restored')
  })

  it('rejects a stale plan after the source changes', async () => {
    const ws = createWorkspace({ rootPath: root, assetStore: { journalDir, recycleDir } })
    const plan = await ws.assets.planRename({
      fromRelPath: 'assets/used.png',
      toRelPath: 'assets/renamed.png'
    })
    await fs.appendFile(path.join(root, 'notes/0001. 图.md'), '\nextra\n')
    const result = await ws.assets.applyPlan(plan)
    expect(result.status).toBe('failed')
    expect(result.error).toMatch(/过期|改变/)
    await fs.access(path.join(root, 'assets/used.png'))
  })

  it('does not delete the source when stopped after backup', async () => {
    const report = await scanAssets(root)
    const plan = await fillPlanHashes(
      root,
      planRename(report, { fromRelPath: 'assets/used.png', toRelPath: 'assets/renamed.png' })
    )
    const result = await applyAssetPlan(
      root,
      plan,
      { journalDir, recycleDir },
      { crashAfter: 'backed-up' }
    )
    expect(result.status).toBe('needs-recovery')
    await fs.access(path.join(root, 'assets/used.png'))
    await expect(fs.access(path.join(root, 'assets/renamed.png'))).rejects.toThrow()

    const recovered = await recoverIncompleteJournals(root, { journalDir, recycleDir })
    expect(recovered[0]?.status).toBe('applied')
    await fs.access(path.join(root, 'assets/used.png'))
  })

  it('recovers after mutation starts and refuses to overwrite a newer file', async () => {
    const report = await scanAssets(root)
    const plan = await fillPlanHashes(
      root,
      planRename(report, { fromRelPath: 'assets/used.png', toRelPath: 'assets/renamed.png' })
    )
    const interrupted = await applyAssetPlan(
      root,
      plan,
      { journalDir, recycleDir },
      { crashAfter: 'applying' }
    )
    expect(interrupted.status).toBe('needs-recovery')

    await recoverIncompleteJournals(root, { journalDir, recycleDir })
    await fs.access(path.join(root, 'assets/used.png'))

    const applied = await applyAssetPlan(root, plan, { journalDir, recycleDir })
    expect(applied.status).toBe('applied')
    await fs.writeFile(path.join(root, 'assets/used.png'), 'newer-bytes')
    const refused = await restoreAssetPlanSafe(plan.id)
    expect(refused.status).toBe('failed')
    expect(refused.error).toMatch(/较新/)
    expect(await fs.readFile(path.join(root, 'assets/used.png'), 'utf8')).toBe('newer-bytes')
    await fs.access(path.join(journalDir, plan.id, 'files', 'assets/used.png'))
  })

  it('refuses apply when journal/recycle would live under assets/', async () => {
    const ws = createWorkspace({ rootPath: root })
    const plan = await ws.assets.planRecycle({ relPaths: ['assets/idle.png'] })
    await expect(
      Promise.resolve().then(() =>
        ws.assets.applyPlan(plan, {
          journalDir: path.join(root, 'assets', '.journal'),
          recycleDir: path.join(root, 'assets', '.recycle')
        })
      )
    ).rejects.toThrow(/assets/)
  })
})

async function restoreAssetPlanSafe(planId: string) {
  const ws = createWorkspace({ rootPath: root, assetStore: { journalDir, recycleDir } })
  return ws.assets.restorePlan(planId)
}

describe('subprocess crash journal', () => {
  it('recovers after a real process.exit between backup and mutation', async () => {
    const report = await scanAssets(root)
    const plan = await fillPlanHashes(root, planRecycle(report, ['assets/idle.png']))
    const configPath = path.join(journalDir, 'worker-config.json')
    await fs.writeFile(
      configPath,
      `${JSON.stringify({ rootPath: root, plan, journalDir, recycleDir }, null, 2)}\n`
    )
    const worker = await spawnWorker(configPath, 'backed-up')
    expect(worker.code, worker.stderr || worker.stdout).not.toBe(0)
    const listing = await fs.readdir(journalDir, { recursive: true })
    expect(listing.some((name) => String(name).endsWith('manifest.json'))).toBe(true)
    await fs.access(path.join(root, 'assets/idle.png'))

    const recovered = await recoverIncompleteJournals(root, { journalDir, recycleDir })
    expect(recovered[0]?.status).toBe('applied')
    await fs.access(path.join(root, 'assets/idle.png'))
  })

  it('recovers after a real process.exit once applying has been journaled', async () => {
    const report = await scanAssets(root)
    const plan = await fillPlanHashes(
      root,
      planRename(report, { fromRelPath: 'assets/mindmap.png', toRelPath: 'assets/mm-renamed.png' })
    )
    const original = await fs.readFile(path.join(root, 'notes/0001. 图.md'), 'utf8')
    const configPath = path.join(journalDir, 'worker-config-applying.json')
    await fs.writeFile(
      configPath,
      `${JSON.stringify({ rootPath: root, plan, journalDir, recycleDir }, null, 2)}\n`
    )
    const worker = await spawnWorker(configPath, 'applying')
    expect(worker.code, worker.stderr || worker.stdout).not.toBe(0)
    const listing = await fs.readdir(journalDir, { recursive: true })
    expect(listing.some((name) => String(name).endsWith('manifest.json'))).toBe(true)

    const recovered = await recoverIncompleteJournals(root, { journalDir, recycleDir })
    expect(recovered[0]?.status).toBe('applied')
    expect(await fs.readFile(path.join(root, 'notes/0001. 图.md'), 'utf8')).toBe(original)
    await fs.access(path.join(root, 'assets/mindmap.png'))
  })

  it('merges same-note duplicate files and restores both', async () => {
    await fs.writeFile(path.join(root, 'assets/0001-keep.png'), PNG_1X1)
    await fs.writeFile(path.join(root, 'assets/0001-drop.png'), PNG_1X1)
    await fs.appendFile(
      path.join(root, 'notes/0001. 图.md'),
      '\n![a](../assets/0001-keep.png)\n![b](../assets/0001-drop.png)\n'
    )
    const ws = createWorkspace({ rootPath: root, assetStore: { journalDir, recycleDir } })
    const plan = await ws.assets.planMerge({
      keepRelPath: 'assets/0001-keep.png',
      dropRelPaths: ['assets/0001-drop.png']
    })
    expect(plan.blockedReasons).toEqual([])
    expect(plan.kind).toBe('merge')
    const applied = await ws.assets.applyPlan(plan)
    expect(applied.status).toBe('applied')
    await expect(fs.access(path.join(root, 'assets/0001-drop.png'))).rejects.toThrow()
    const note = await fs.readFile(path.join(root, 'notes/0001. 图.md'), 'utf8')
    expect(note).toContain('../assets/0001-keep.png')
    expect(note).not.toContain('../assets/0001-drop.png')
    const restored = await ws.assets.restorePlan(plan.id)
    expect(restored.status).toBe('applied')
    await fs.access(path.join(root, 'assets/0001-drop.png'))
    expect(await fs.readFile(path.join(root, 'notes/0001. 图.md'), 'utf8')).toContain(
      '../assets/0001-drop.png'
    )
  })

  it('does not merge cross-note identical bytes', async () => {
    await fs.writeFile(path.join(root, 'assets/0001-a.png'), PNG_1X1)
    await fs.writeFile(path.join(root, 'assets/0002-b.png'), PNG_1X1)
    const ws = createWorkspace({ rootPath: root, assetStore: { journalDir, recycleDir } })
    const plan = await ws.assets.planMerge({
      keepRelPath: 'assets/0001-a.png',
      dropRelPaths: ['assets/0002-b.png']
    })
    expect(plan.blockedReasons.some((reason) => reason.includes('不可合并'))).toBe(true)
  })

  it('applies an in-place optimize payload and restores original bytes', async () => {
    const smaller = new Uint8Array([1, 2, 3, 4])
    const { hashBytes } = await import('../src/asset-scan/hash')
    const digest = hashBytes(smaller)
    const original = await fs.readFile(path.join(root, 'assets/idle.png'))
    const ws = createWorkspace({ rootPath: root, assetStore: { journalDir, recycleDir } })
    const plan = await ws.assets.planOptimize([
      {
        fromRelPath: 'assets/idle.png',
        toRelPath: 'assets/idle.png',
        outputSha256: digest,
        bytesAfter: smaller.byteLength
      }
    ])
    expect(plan.blockedReasons).toEqual([])
    const applied = await ws.assets.applyPlan(plan, undefined, {
      outputFiles: { 'assets/idle.png': smaller }
    })
    expect(applied.status).toBe('applied')
    expect(await fs.readFile(path.join(root, 'assets/idle.png'))).toEqual(Buffer.from(smaller))
    const restored = await ws.assets.restorePlan(plan.id)
    expect(restored.status).toBe('applied')
    expect(await fs.readFile(path.join(root, 'assets/idle.png'))).toEqual(original)
  })
})

async function spawnWorker(
  configPath: string,
  crashAfter: string
): Promise<{ code: number; stderr: string; stdout: string }> {
  const require = createRequire(fileURLToPath(new URL('../package.json', import.meta.url)))
  const esbuildMain = require.resolve('esbuild', { paths: [require.resolve('tsup')] })
  const { build } = require(esbuildMain) as {
    build: (options: Record<string, unknown>) => Promise<unknown>
  }
  const outfile = `${configPath}.worker.cjs`
  await build({
    entryPoints: [workerPath],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile,
    logLevel: 'silent'
  })
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [outfile, configPath], {
      env: { ...process.env, TNOTES_ASSET_CRASH_AFTER: crashAfter },
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let stderr = ''
    let stdout = ''
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString()
    })
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString()
    })
    child.on('error', reject)
    child.on('close', (code) => {
      resolve({ code: code ?? 1, stderr, stdout })
    })
  })
}
