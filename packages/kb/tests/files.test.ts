import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  KB_TEXT_MAX_BYTES,
  classifyKbPath,
  isLikelyTextPath,
  languageForKbPath,
  listKbDirectory,
  looksLikeText,
  readKbTextFile
} from '../src/files'

let root = ''

const write = async (relPath: string, content: string | Uint8Array): Promise<void> => {
  const absolute = path.join(root, relPath)
  await fs.mkdir(path.dirname(absolute), { recursive: true })
  await fs.writeFile(absolute, content)
}

beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), 'kb-files-'))
  await write('tnotes.json', '{ "title": "文件浏览" }\n')
  await write('TOC.md', '- [ ] 0001. 笔记\n')
  await write('README.md', '# 说明\n')
  await write('.gitignore', 'node_modules/\n.tnotes/dist\n')
  await write('.gitattributes', '* text=auto\n')
  await write('.npmrc', 'shamefully-hoist=true\n')
  await write('package.json', '{ "name": "kb" }\n')
  await write('notes/0001. 笔记.md', '# 笔记\n')
  await write('imgs/pic.png', new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01]))
  await write('assets/a.png', new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0x01]))
  await write('.git/config', '[core]\n\trepositoryformatversion = 0\n')
  await write('node_modules/pkg/index.js', 'module.exports = 1\n')
  await write('.tnotes/dist/index.html', '<html></html>\n')
  await write('.DS_Store', new Uint8Array([0x00, 0x01, 0x02]))
})

afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true })
})

describe('列一层目录', () => {
  it('列出库根：保留点文件与配置，过滤 .git / node_modules / 构建产物 / 系统垃圾', async () => {
    const entries = await listKbDirectory(root)
    const names = entries.map((entry) => entry.name)
    expect(names).toContain('tnotes.json')
    expect(names).toContain('.gitignore')
    expect(names).toContain('.gitattributes')
    expect(names).toContain('package.json')
    expect(names).toContain('notes')
    expect(names).not.toContain('.git')
    expect(names).not.toContain('node_modules')
    expect(names).not.toContain('.tnotes')
    expect(names).not.toContain('.DS_Store')
  })

  it('目录在前，各自按自然序（0009 在 0010 之前）', async () => {
    await write('notes/0009. a.md', '# a\n')
    await write('notes/0010. b.md', '# b\n')
    const entries = await listKbDirectory(root, 'notes')
    expect(entries.map((entry) => entry.name)).toEqual([
      '0001. 笔记.md',
      '0009. a.md',
      '0010. b.md'
    ])
    const rootEntries = await listKbDirectory(root)
    expect(rootEntries[0]?.kind).toBe('directory')
    const firstFileIndex = rootEntries.findIndex((entry) => entry.kind === 'file')
    expect(rootEntries.slice(0, firstFileIndex).every((entry) => entry.kind === 'directory')).toBe(
      true
    )
  })

  it('文件带字节数与文本线索，目录不带', async () => {
    const entries = await listKbDirectory(root)
    const readme = entries.find((entry) => entry.name === 'README.md')
    const notes = entries.find((entry) => entry.name === 'notes')
    expect(readme).toMatchObject({ kind: 'file', textLike: true })
    expect(readme?.bytes).toBeGreaterThan(0)
    expect(notes).toMatchObject({ kind: 'directory', bytes: null, textLike: false })
  })

  it('只有被拒绝内容的目录整体不列（.tnotes 只剩 dist），真空目录照列', async () => {
    await fs.mkdir(path.join(root, 'empty-dir'), { recursive: true })
    const names = (await listKbDirectory(root)).map((entry) => entry.name)
    expect(names).toContain('empty-dir')
    expect(names).not.toContain('.tnotes')
    // 往 .tnotes 里放一个用户可维护的文件，它就该出现
    await write('.tnotes/site.json', '{}\n')
    expect((await listKbDirectory(root)).map((entry) => entry.name)).toContain('.tnotes')
  })

  it('拒绝名单里的目录自己也进不去', async () => {
    await expect(listKbDirectory(root, '.git')).rejects.toMatchObject({ code: 'INVALID_OPERATION' })
    await expect(listKbDirectory(root, 'node_modules')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
    await expect(listKbDirectory(root, '.tnotes/dist')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
  })

  it('路径越界与不存在的目录给明确错误', async () => {
    await expect(listKbDirectory(root, '../outside')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
    await expect(listKbDirectory(root, 'not-there')).rejects.toMatchObject({
      code: 'NOTE_NOT_FOUND'
    })
  })
})

describe('文本判定按字节', () => {
  it('NUL 字节判二进制，合法 UTF-8 判文本（含中文与空文件）', () => {
    expect(looksLikeText(new Uint8Array([0x68, 0x69]))).toBe(true)
    expect(looksLikeText(new TextEncoder().encode('中文\n'))).toBe(true)
    expect(looksLikeText(new Uint8Array())).toBe(true)
    expect(looksLikeText(new Uint8Array([0x68, 0x00, 0x69]))).toBe(false)
    expect(looksLikeText(new Uint8Array([0xff, 0xfe, 0xfd]))).toBe(false)
  })

  it('采样刚好切在多字节字符中间时仍判为文本', () => {
    const bytes = new TextEncoder().encode('中文')
    expect(looksLikeText(bytes.subarray(0, 5))).toBe(true)
  })

  it('无扩展名的配置文件算文本线索', () => {
    expect(isLikelyTextPath('.gitignore')).toBe(true)
    expect(isLikelyTextPath('.npmrc')).toBe(true)
    expect(isLikelyTextPath('LICENSE')).toBe(true)
    expect(isLikelyTextPath('notes/0001. a.md')).toBe(true)
    expect(isLikelyTextPath('assets/a.png')).toBe(false)
    expect(isLikelyTextPath('assets/a.excalidraw')).toBe(false)
  })

  it('语言 id 覆盖常见配置与代码文件', () => {
    expect(languageForKbPath('README.md')).toBe('markdown')
    expect(languageForKbPath('package.json')).toBe('json')
    expect(languageForKbPath('pnpm-workspace.yaml')).toBe('yaml')
    expect(languageForKbPath('.npmrc')).toBe('ini')
    expect(languageForKbPath('deploy.js')).toBe('javascript')
    expect(languageForKbPath('.github/workflows/deploy.yml')).toBe('yaml')
    expect(languageForKbPath('.gitignore')).toBe('plaintext')
    expect(languageForKbPath('LICENSE')).toBe('plaintext')
  })
})

describe('读文本文件', () => {
  it('读出内容并保留字节特征（BOM / CRLF 只上报不改写）', async () => {
    await write('crlf.txt', '\ufeffline1\r\nline2\r\n')
    const read = await readKbTextFile(root, 'crlf.txt')
    expect(read.content).toBe('line1\r\nline2\r\n')
    expect(read.hasBom).toBe(true)
    expect(read.eol).toBe('crlf')
    expect(read.revision).toMatch(/^[0-9a-f]+$/)
  })

  it('LF / 混合换行分别识别', async () => {
    expect((await readKbTextFile(root, 'README.md')).eol).toBe('lf')
    await write('mixed.txt', 'a\nb\r\nc')
    expect((await readKbTextFile(root, 'mixed.txt')).eol).toBe('mixed')
    await write('none.txt', 'single-line')
    expect((await readKbTextFile(root, 'none.txt')).eol).toBe('none')
  })

  it('二进制文件不会被当文本读出来', async () => {
    await expect(readKbTextFile(root, 'assets/a.png')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
    // 即使把扩展名伪装成文本，字节判定也挡得住
    await write('fake.md', new Uint8Array([0x00, 0x01, 0x02, 0x03]))
    await expect(readKbTextFile(root, 'fake.md')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
  })

  it('拒绝名单、目录、越界与不存在的文件都给明确错误', async () => {
    await expect(readKbTextFile(root, '.git/config')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
    await expect(readKbTextFile(root, 'node_modules/pkg/index.js')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
    await expect(readKbTextFile(root, 'notes')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
    await expect(readKbTextFile(root, '../outside.txt')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
    await expect(readKbTextFile(root, 'nope.txt')).rejects.toMatchObject({
      code: 'NOTE_NOT_FOUND'
    })
    await expect(readKbTextFile(root, '')).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
  })

  it('超过上限的文件拒绝打开', async () => {
    await write('big.txt', 'x'.repeat(64))
    await expect(readKbTextFile(root, 'big.txt', { maxBytes: 16 })).rejects.toMatchObject({
      code: 'INVALID_OPERATION'
    })
    expect(KB_TEXT_MAX_BYTES).toBeGreaterThan(1024 * 1024)
  })

  it('同一文件两次读取 revision 相同，内容变了 revision 也变', async () => {
    const first = await readKbTextFile(root, 'README.md')
    const second = await readKbTextFile(root, 'README.md')
    expect(second.revision).toBe(first.revision)
    await write('README.md', '# 说明（改了）\n')
    const third = await readKbTextFile(root, 'README.md')
    expect(third.revision).not.toBe(first.revision)
  })
})

describe('路径策略', () => {
  it('本阶段一律只读，理由说明清楚', () => {
    expect(classifyKbPath('README.md')).toMatchObject({ openable: true, writable: false })
    expect(classifyKbPath('README.md').reason).toContain('只支持查看')
  })

  it('拒绝名单里的路径不可打开', () => {
    for (const relPath of ['.git/config', 'node_modules/x.js', '.tnotes/dist/index.html']) {
      expect(classifyKbPath(relPath).openable).toBe(false)
      expect(classifyKbPath(relPath).reason).toBeTruthy()
    }
  })

  it('越界路径直接判不可打开', () => {
    expect(classifyKbPath('../../etc/passwd').openable).toBe(false)
  })
})
