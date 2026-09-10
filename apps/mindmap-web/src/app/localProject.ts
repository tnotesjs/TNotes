/** Chrome File System Access API 的最小适配层。业务层只依赖这些可测试接口。 */

export interface WritableFileLike {
  write(data: Blob | string): Promise<void>
  close(): Promise<void>
}

export interface FileHandleLike {
  readonly kind: 'file'
  readonly name: string
  getFile(): Promise<File>
  createWritable(): Promise<WritableFileLike>
}

export interface DirectoryHandleLike {
  readonly kind: 'directory'
  readonly name: string
  entries(): AsyncIterableIterator<[string, FileHandleLike | DirectoryHandleLike]>
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<DirectoryHandleLike>
  getFileHandle(name: string, options?: { create?: boolean }): Promise<FileHandleLike>
  removeEntry?(name: string, options?: { recursive?: boolean }): Promise<void>
}

export type DirectoryPicker = (options?: { mode?: 'read' | 'readwrite'; id?: string }) => Promise<DirectoryHandleLike>

export class ProjectExistsError extends Error {
  constructor(name: string) {
    super(`目标位置已存在「${name}」，为避免覆盖，请换一个作品名称`)
    this.name = 'ProjectExistsError'
  }
}

export class InvalidProjectError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidProjectError'
  }
}

export function normalizeProjectName(input: string): string {
  const name = input.trim()
  if (!name) throw new InvalidProjectError('作品名称不能为空')
  const hasControlCharacter = [...name].some((character) => character.charCodeAt(0) < 32)
  if (name === '.' || name === '..' || /[\\/]/.test(name) || hasControlCharacter) {
    throw new InvalidProjectError('作品名称不能包含路径分隔符或控制字符')
  }
  if (name.endsWith('.')) throw new InvalidProjectError('作品名称不能以句点结尾')
  return name
}

async function hasEntry(directory: DirectoryHandleLike, name: string): Promise<boolean> {
  for await (const [entryName] of directory.entries()) {
    if (entryName === name) return true
  }
  return false
}

async function writeFile(handle: FileHandleLike, data: Blob | string): Promise<void> {
  const writable = await handle.createWritable()
  await writable.write(data)
  await writable.close()
}

function extensionForMime(mime: string): string {
  switch (mime.toLowerCase()) {
    case 'image/jpeg': return 'jpg'
    case 'image/webp': return 'webp'
    case 'image/gif': return 'gif'
    case 'image/svg+xml': return 'svg'
    default: return 'png'
  }
}

function randomSuffix(): string {
  return globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)
}

export function createAssetFileName(blob: Blob, now = new Date()): string {
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '-',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('')
  return `image-${stamp}-${randomSuffix()}.${extensionForMime(blob.type)}`
}

export class LocalProject {
  private constructor(
    readonly name: string,
    readonly directory: DirectoryHandleLike,
    private readonly markdownFile: FileHandleLike,
    private readonly assetsDirectory: DirectoryHandleLike,
  ) {}

  get fileName(): string {
    return `${this.name}.tn-mindmap.md`
  }

  static async create(parent: DirectoryHandleLike, rawName: string, markdown: string): Promise<LocalProject> {
    const name = normalizeProjectName(rawName)
    if (await hasEntry(parent, name)) throw new ProjectExistsError(name)

    let created = false
    try {
      const directory = await parent.getDirectoryHandle(name, { create: true })
      created = true
      const assets = await directory.getDirectoryHandle('assets', { create: true })
      const markdownFile = await directory.getFileHandle(`${name}.tn-mindmap.md`, { create: true })
      await writeFile(markdownFile, markdown)
      return new LocalProject(name, directory, markdownFile, assets)
    } catch (error) {
      // 只回滚本次刚创建的目录；不触碰任何预先存在的用户数据。
      if (created && parent.removeEntry) {
        try { await parent.removeEntry(name, { recursive: true }) } catch { /* 保留原始错误 */ }
      }
      throw error
    }
  }

  static async open(directory: DirectoryHandleLike): Promise<{ project: LocalProject; markdown: string }> {
    const name = normalizeProjectName(directory.name)
    const expected = `${name}.tn-mindmap.md`
    const mindmapFiles: string[] = []
    for await (const [entryName, entry] of directory.entries()) {
      if (entry.kind === 'file' && entryName.endsWith('.tn-mindmap.md')) mindmapFiles.push(entryName)
    }
    if (mindmapFiles.length !== 1 || mindmapFiles[0] !== expected) {
      throw new InvalidProjectError(`作品目录中必须只有一个 ${expected} 文件`)
    }
    const markdownFile = await directory.getFileHandle(expected)
    const assets = await directory.getDirectoryHandle('assets', { create: true })
    const markdown = await (await markdownFile.getFile()).text()
    return { project: new LocalProject(name, directory, markdownFile, assets), markdown }
  }

  async writeMarkdown(markdown: string): Promise<void> {
    await writeFile(this.markdownFile, markdown)
  }

  async writeAsset(blob: Blob, fileName = createAssetFileName(blob)): Promise<string> {
    if (!/^[-a-zA-Z0-9_.]+$/.test(fileName) || fileName === '.' || fileName === '..') {
      throw new InvalidProjectError('资源文件名不合法')
    }
    const handle = await this.assetsDirectory.getFileHandle(fileName, { create: true })
    await writeFile(handle, blob)
    return `assets/${fileName}`
  }

  async readAsset(relativePath: string): Promise<File> {
    const match = /^assets\/([-a-zA-Z0-9_.]+)$/.exec(relativePath)
    if (!match || match[1] === '.' || match[1] === '..') throw new InvalidProjectError('资源路径不合法')
    return (await this.assetsDirectory.getFileHandle(match[1])).getFile()
  }
}

export function getDirectoryPicker(): DirectoryPicker | null {
  const candidate = (window as Window & { showDirectoryPicker?: DirectoryPicker }).showDirectoryPicker
  return candidate ? candidate.bind(window) : null
}
