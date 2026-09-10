import { existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, describe, expect, it } from 'vitest'

import { scanAssets } from '../src/asset-scan/scan'

const kbsRoot = fileURLToPath(new URL('../../../../kbs', import.meta.url))
const TARGETS = ['TNotes.docs', 'TNotes.canvas'] as const

let copiesRoot = ''

function skipped(name: string): boolean {
  return name === 'node_modules' || name === '.git' || name === '.tnotes' || name === '.DS_Store'
}

async function hashKnowledgeBase(rootPath: string): Promise<string> {
  const hash = createHash('sha256')
  async function walk(dir: string, rel: string): Promise<void> {
    const entries = (await fs.readdir(dir, { withFileTypes: true })).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    for (const entry of entries) {
      if (skipped(entry.name) || entry.name.startsWith('.')) continue
      const nextRel = rel ? `${rel}/${entry.name}` : entry.name
      const next = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(next, nextRel)
        continue
      }
      hash.update(nextRel)
      hash.update(await fs.readFile(next))
    }
  }
  await walk(rootPath, '')
  return hash.digest('hex')
}

async function copyKnowledgeBase(from: string, to: string): Promise<void> {
  await fs.cp(from, to, {
    recursive: true,
    filter: (source) => {
      const rel = path.relative(from, source)
      return !rel.split(path.sep).some((part) => skipped(part))
    }
  })
}

afterEach(async () => {
  if (copiesRoot) await fs.rm(copiesRoot, { recursive: true, force: true })
  copiesRoot = ''
})

describe.skipIf(!existsSync(kbsRoot))('real knowledge-base copies (read-only scan)', () => {
  it('scans docs and canvas copies without touching the originals', async () => {
    const originals = []
    for (const name of TARGETS) {
      const rootPath = path.join(kbsRoot, name)
      expect(existsSync(rootPath), rootPath).toBe(true)
      originals.push({ name, rootPath, hash: await hashKnowledgeBase(rootPath) })
    }

    copiesRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'tnotes-real-kb-'))
    const reports = []
    for (const item of originals) {
      const copy = path.join(copiesRoot, item.name)
      const started = Date.now()
      await copyKnowledgeBase(item.rootPath, copy)
      const report = await scanAssets(copy)
      reports.push({
        name: item.name,
        ms: Date.now() - started,
        coverageComplete: report.coverageComplete,
        batchCleanupAllowed: report.batchCleanupAllowed,
        assetCount: report.stats.assetCount,
        assetBytes: report.stats.assetBytes,
        determined: report.stats.determinedReferenceCount,
        uncertain: report.stats.uncertainReferenceCount,
        broken: report.brokenLinks.length,
        adapters: report.adapters.map((adapter) => `${adapter.id}:${adapter.status}`),
        diagnostics: [...new Set(report.diagnostics.map((diag) => diag.code))],
        samples: {
          image: report.assets.find((asset) => asset.kind === 'image')?.relPath ?? null,
          excalidraw: report.assets.find((asset) => asset.kind === 'excalidraw')?.relPath ?? null,
          protected: report.assets.filter((asset) => asset.protection.length > 0).length,
          mindmap: report.references.filter((ref) => ref.syntax.startsWith('mindmap')).length,
          encoded: report.references.filter((ref) => /%[0-9A-Fa-f]{2}/.test(ref.rawUrl)).length,
          htmlVue: report.diagnostics.filter(
            (diag) => diag.code === 'unparsed-component' || diag.code === 'unparsed-source'
          ).length
        }
      })
      expect(report.assets.length).toBeGreaterThan(0)
    }

    console.info('P1-5 real KB scan', JSON.stringify(reports, null, 2))
    const docs = reports.find((item) => item.name === 'TNotes.docs')
    const canvas = reports.find((item) => item.name === 'TNotes.canvas')
    expect(docs?.samples.excalidraw).toBeTruthy()
    expect(docs?.samples.image).toBeTruthy()
    expect(docs?.determined).toBeGreaterThan(0)
    expect(docs?.adapters.some((item) => item.startsWith('p1-1b-srcset:'))).toBe(true)
    expect(docs?.adapters.some((item) => item.startsWith('p1-1b-css:'))).toBe(true)
    expect(docs?.adapters.some((item) => item.startsWith('p1-1b-vue:'))).toBe(true)
    expect(docs?.adapters.some((item) => item.startsWith('p1-1b-excalidraw:'))).toBe(true)
    expect(canvas?.assetCount).toBeGreaterThan(0)
    expect(canvas?.samples.image || canvas?.assetCount).toBeTruthy()

    for (const item of originals) {
      expect(await hashKnowledgeBase(item.rootPath)).toBe(item.hash)
    }
    console.info('P1-5 real KB scan', JSON.stringify(reports, null, 2))
  }, 180_000)
})
