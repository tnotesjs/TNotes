import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { extractAssetReferences } from '../src/asset-scan/extract'
import { extractExcalidraw } from '../src/asset-scan/excalidraw'
import { parseSrcsetCandidates } from '../src/asset-scan/srcset'
import { planRename } from '../src/asset-scan/plan'
import { scanAssets } from '../src/asset-scan/scan'
import { extractVueSfc } from '../src/asset-scan/vue'
import { writeExtendedAssetFixture, writeIncompleteCoverageFixture } from './helpers/assetScanFixture'

let root = ''

afterEach(async () => {
  if (root) await fs.rm(root, { recursive: true, force: true })
  root = ''
})

describe('P1-1b srcset / poster', () => {
  it('splits srcset candidates and keeps descriptors out of the dest', () => {
    const value = '../assets/srcset-1.png 1x, ../assets/srcset-2.png 2x'
    const candidates = parseSrcsetCandidates(value)
    expect(candidates.map((item) => item.url)).toEqual([
      '../assets/srcset-1.png',
      '../assets/srcset-2.png'
    ])
    expect(value.slice(candidates[0].start, candidates[0].end)).toBe('../assets/srcset-1.png')
  })

  it('extracts static poster as rewritable html-poster', () => {
    const source = '<video poster="../assets/poster.png"></video>\n'
    const { references } = extractAssetReferences(source, { sourceRelPath: 'notes/0001. a.md' })
    const poster = references.find((ref) => ref.syntax === 'html-poster')
    expect(poster?.rawUrl).toBe('../assets/poster.png')
    expect(poster?.rewritable).toBe(true)
  })
})

describe('P1-1b CSS / Vue / Excalidraw / reachability', () => {
  it('covers the extended adapter matrix and isolated cycles', async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'tnotes-p11b-'))
    await writeExtendedAssetFixture(root)
    const report = await scanAssets(root)
    const byPath = Object.fromEntries(report.assets.map((asset) => [asset.relPath, asset]))

    expect(byPath['assets/used.png']?.status).toBe('referenced')
    expect(byPath['assets/poster.png']?.status).toBe('referenced')
    expect(byPath['assets/srcset-1.png']?.status).toBe('referenced')
    expect(byPath['assets/srcset-2.png']?.status).toBe('referenced')
    expect(byPath['assets/style-bg.png']?.status).toBe('referenced')
    expect(byPath['assets/vue-icon.png']?.status).toBe('referenced')
    expect(byPath['assets/vue-static.png']?.status).toBe('referenced')
    expect(byPath['assets/vue-bg.png']?.status).toBe('referenced')
    expect(byPath['assets/page.html']?.status).toBe('referenced')
    expect(byPath['assets/theme.css']?.status).toBe('referenced')
    expect(byPath['assets/nested.css']?.status).toBe('referenced')
    expect(byPath['assets/css-bg.png']?.status).toBe('referenced')
    expect(byPath['assets/css-nested.png']?.status).toBe('referenced')
    expect(byPath['assets/html-img.png']?.status).toBe('referenced')
    expect(byPath['assets/excali-embed.png']?.status).toBe('referenced')
    expect(byPath['assets/board.excalidraw']?.status).toBe('protected')
    expect(byPath['assets/idle.png']?.status).toBe('idle-candidate')
    expect(byPath['assets/island.html']?.status).toBe('idle-candidate')
    expect(byPath['assets/island.css']?.status).toBe('idle-candidate')
    expect(byPath['assets/island.png']?.status).toBe('idle-candidate')
    expect(byPath['assets/commented.png']?.status).toBe('uncertain-affected')

    expect(report.references.some((ref) => ref.syntax === 'html-srcset' && ref.rewritable)).toBe(
      true
    )
    expect(report.references.some((ref) => ref.syntax === 'css-url' && ref.rewritable)).toBe(true)
    expect(report.references.some((ref) => ref.syntax === 'css-import' && ref.rewritable)).toBe(true)
    expect(report.references.some((ref) => ref.syntax === 'vue-import')).toBe(true)
    expect(report.references.some((ref) => ref.syntax === 'excalidraw-path' && ref.rewritable)).toBe(
      true
    )
    expect(report.references.some((ref) => /^data:/i.test(ref.rawUrl))).toBe(false)

    expect(report.coverageComplete).toBe(true)
    expect(report.adapters.find((item) => item.id === 'p1-1b-srcset')?.status).toBe('complete')
    expect(report.adapters.find((item) => item.id === 'p1-1b-css')?.status).toBe('complete')
    expect(report.adapters.find((item) => item.id === 'p1-1b-vue')?.status).toBe('complete')
    expect(report.adapters.find((item) => item.id === 'p1-1b-excalidraw')?.status).toBe('complete')

    const rename = planRename(report, {
      fromRelPath: 'assets/html-img.png',
      toRelPath: 'assets/html-img-renamed.png'
    })
    expect(rename.blockedReasons).toEqual([])
    expect(
      rename.patches.some(
        (patch) => patch.sourceRelPath === 'assets/page.html' && patch.expected === './html-img.png'
      )
    ).toBe(true)
  })

  it('does not treat Vue SFC parse success as complete when :src is dynamic', async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'tnotes-p11b-dyn-'))
    await writeIncompleteCoverageFixture(root)
    const report = await scanAssets(root)
    expect(report.coverageComplete).toBe(false)
    expect(report.batchCleanupAllowed).toBe(false)
    expect(report.diagnostics.some((item) => item.code === 'dynamic-expression')).toBe(true)
    expect(report.adapters.find((item) => item.id === 'p1-1b-vue')?.status).toBe('partial')
    expect(report.assets.find((asset) => asset.relPath === 'assets/idle.png')?.status).toBe(
      'uncertain-idle'
    )
  })
})

describe('extractVueSfc / extractExcalidraw', () => {
  it('keeps dynamic template bindings unknown after a successful SFC parse', () => {
    const source = `<template><img :src="dyn" /></template>\n<script setup>\nconst dyn = './x.png'\n</script>\n`
    const result = extractVueSfc(source, { sourceRelPath: 'Card.vue' })
    expect(result.parseError).toBeUndefined()
    expect(result.sawDynamicBinding).toBe(true)
    expect(result.references.some((ref) => ref.rewritable && ref.targetRelPath)).toBe(false)
  })

  it('skips data URLs, mime types and drawing labels that are not files', () => {
    const source = JSON.stringify({
      files: { a: { dataURL: 'data:image/png;base64,abc', mimeType: 'image/png' } },
      extra: './embed.png',
      label: 'case1: 冲突/缺失'
    })
    const result = extractExcalidraw(source, { sourceRelPath: 'assets/board.excalidraw' })
    expect(result.parseError).toBeUndefined()
    expect(result.references.some((ref) => ref.urlKind === 'data')).toBe(false)
    expect(result.references.some((ref) => ref.rawUrl === 'image/png')).toBe(false)
    expect(result.references.some((ref) => ref.rawUrl.includes('冲突'))).toBe(false)
    const local = result.references.find((ref) => ref.syntax === 'excalidraw-path')
    expect(local?.targetRelPath).toBe('assets/embed.png')
    expect(local?.rewritable).toBe(true)
  })
})
