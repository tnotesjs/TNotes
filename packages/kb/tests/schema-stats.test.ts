import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { clearKbIcon, replaceKbIcon } from '../src/assets'
import { isValidKbName, parseRepoNameFromRemoteUrl, resolveKbName } from '../src/name'
import {
  fillCompletedNotesCount,
  parseCompletedNoteIndexes,
  updateCompletedNotesStats
} from '../src/stats'
import { createWorkspace } from '../src/workspace'

const execFileAsync = promisify(execFile)

let root: string

async function write(rel: string, content: string | Uint8Array): Promise<void> {
  const full = path.join(root, rel)
  await fs.mkdir(path.dirname(full), { recursive: true })
  await fs.writeFile(full, content)
}

async function git(args: string[], cwd = root): Promise<void> {
  await execFileAsync('git', args, { cwd })
}

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'tnotes-kb-schema-'))
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
})

describe('kb name helpers', () => {
  it('validates GitHub-style names', () => {
    expect(isValidKbName('TNotes.docs')).toBe(true)
    expect(isValidKbName('a_b-c.1')).toBe(true)
    expect(isValidKbName('')).toBe(false)
    expect(isValidKbName('has space')).toBe(false)
    expect(isValidKbName('中文')).toBe(false)
  })

  it('parses repo names from remote URLs', () => {
    expect(parseRepoNameFromRemoteUrl('https://github.com/tnotesjs/TNotes.docs.git')).toBe(
      'TNotes.docs'
    )
    expect(parseRepoNameFromRemoteUrl('git@github.com:tnotesjs/TNotes.vite.git')).toBe(
      'TNotes.vite'
    )
    expect(parseRepoNameFromRemoteUrl('ssh://git@github.com/org/repo')).toBe('repo')
  })

  it('resolves name with configured → origin → directory fallback', () => {
    expect(
      resolveKbName({
        configured: 'Configured',
        originUrl: 'https://github.com/x/FromOrigin.git',
        directoryName: 'DirName'
      })
    ).toBe('Configured')
    expect(
      resolveKbName({
        configured: '',
        originUrl: 'https://github.com/x/FromOrigin.git',
        directoryName: 'DirName'
      })
    ).toBe('FromOrigin')
    expect(
      resolveKbName({
        configured: null,
        originUrl: null,
        directoryName: 'Valid.Dir'
      })
    ).toBe('Valid.Dir')
    expect(
      resolveKbName({
        configured: null,
        originUrl: null,
        directoryName: '有空格'
      })
    ).toBe(null)
  })
})

describe('kb icon fixed filename', () => {
  it('replaces prior extensions and clears on demand', async () => {
    const first = await replaceKbIcon(root, 'png', new Uint8Array([1, 2, 3]))
    expect(first.relPath).toBe('assets/.tn-kb-icon.png')
    expect(first.icon).toEqual({ src: '../assets/.tn-kb-icon.png' })

    const second = await replaceKbIcon(root, '.svg', new TextEncoder().encode('<svg/>'))
    expect(second.deleted).toContain('assets/.tn-kb-icon.png')
    expect(second.relPath).toBe('assets/.tn-kb-icon.svg')
    expect(await fs.readdir(path.join(root, 'assets'))).toEqual(['.tn-kb-icon.svg'])

    const cleared = await clearKbIcon(root)
    expect(cleared.deleted).toEqual(['assets/.tn-kb-icon.svg'])
    expect(await fs.readdir(path.join(root, 'assets'))).toEqual([])
  })

  it('does not let gc delete the kb icon', async () => {
    await write('tnotes.json', '{}\n')
    await write('TOC.md', '- [ ] 0001. A\n')
    await write('notes/0001. A.md', '# A\n')
    await replaceKbIcon(root, 'png', new Uint8Array([9]))
    const ws = createWorkspace({ rootPath: root })
    const dry = await ws.assets.gc()
    expect(dry.unreferenced).toEqual([])
  })
})

describe('config name validation', () => {
  it('rejects invalid names', async () => {
    await write('tnotes.json', '{}\n')
    await write('TOC.md', '\n')
    const ws = createWorkspace({ rootPath: root })
    await expect(ws.config.set({ name: 'bad name' })).rejects.toThrow(/知识库名称/)
  })
})

describe('completed notes stats', () => {
  it('dedupes indexes and fills month gaps', () => {
    const indexes = parseCompletedNoteIndexes(
      ['- [x] 0001. A', '- [ ] 0002. B', '- [x] 0001. A again', '- [x] 0003. C'].join('\n')
    )
    expect([...indexes].sort()).toEqual(['0001', '0003'])

    expect(fillCompletedNotesCount({ '26.01': 1, '26.03': 3 }, '26.01', '26.04')).toEqual({
      '26.01': 1,
      '26.02': 1,
      '26.03': 3,
      '26.04': 3
    })
  })

  it('updates stats from TOC git history when enabled', async () => {
    await git(['init'])
    await git(['config', 'user.email', 'test@example.com'])
    await git(['config', 'user.name', 'Test'])

    await write(
      'tnotes.json',
      JSON.stringify({ title: 'demo', stats: { enabled: true } }, null, 2) + '\n'
    )
    await write('TOC.md', '- [x] 0001. Alpha\n- [ ] 0002. Beta\n')
    await write('notes/0001. Alpha.md', '# Alpha\n')
    await write('notes/0002. Beta.md', '# Beta\n')
    await git(['add', '.'])
    await git(['commit', '-m', 'init'])

    await write('TOC.md', '- [x] 0001. Alpha\n- [x] 0002. Beta\n')
    await git(['add', 'TOC.md'])
    await git(['commit', '-m', 'complete beta'])

    const result = await updateCompletedNotesStats(root)
    const counts = result.value.completedNotesCount ?? {}
    const keys = Object.keys(counts).sort()
    expect(keys.length).toBeGreaterThanOrEqual(1)
    expect(counts[keys[keys.length - 1]]).toBe(2)

    const saved = JSON.parse(await fs.readFile(path.join(root, 'tnotes.json'), 'utf8'))
    expect(saved.stats.enabled).toBe(true)
    expect(saved.stats.completedNotesCount).toEqual(counts)
  })

  it('refuses to write when stats.enabled is false', async () => {
    await git(['init'])
    await write('tnotes.json', JSON.stringify({ stats: { enabled: false } }) + '\n')
    await write('TOC.md', '- [x] 0001. A\n')
    await expect(updateCompletedNotesStats(root)).rejects.toThrow(/未开启/)
  })
})
