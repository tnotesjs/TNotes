import { describe, expect, it } from 'vitest'
import {
  InvalidProjectError,
  LocalProject,
  ProjectExistsError,
  createAssetFileName,
  normalizeProjectName,
} from './localProject'
import type { DirectoryHandleLike, FileHandleLike, WritableFileLike } from './localProject'

class MemoryFile implements FileHandleLike {
  readonly kind = 'file' as const
  data = new Blob()
  failWrite = false

  constructor(readonly name: string) {}

  async getFile(): Promise<File> {
    return new File([this.data], this.name, { type: this.data.type })
  }

  async createWritable(): Promise<WritableFileLike> {
    return {
      write: async (data) => {
        if (this.failWrite) throw new Error('disk full')
        this.data = typeof data === 'string' ? new Blob([data], { type: 'text/markdown' }) : data
      },
      close: async () => {},
    }
  }
}

class MemoryDirectory implements DirectoryHandleLike {
  readonly kind = 'directory' as const
  readonly children = new Map<string, MemoryDirectory | MemoryFile>()

  constructor(readonly name: string) {}

  async *entries(): AsyncIterableIterator<[string, MemoryDirectory | MemoryFile]> {
    yield* this.children.entries()
  }

  async getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<MemoryDirectory> {
    const current = this.children.get(name)
    if (current instanceof MemoryDirectory) return current
    if (current || !options?.create) throw new DOMException('Not found', 'NotFoundError')
    const created = new MemoryDirectory(name)
    this.children.set(name, created)
    return created
  }

  async getFileHandle(name: string, options?: { create?: boolean }): Promise<MemoryFile> {
    const current = this.children.get(name)
    if (current instanceof MemoryFile) return current
    if (current || !options?.create) throw new DOMException('Not found', 'NotFoundError')
    const created = new MemoryFile(name)
    this.children.set(name, created)
    return created
  }

  async removeEntry(name: string): Promise<void> {
    this.children.delete(name)
  }
}

describe('LocalProject', () => {
  it('创建独立作品目录、同名主文件和 assets，并写入初始源码', async () => {
    const parent = new MemoryDirectory('workspace')
    const project = await LocalProject.create(parent, 'project-1', '# Project 1\n')

    expect(project.name).toBe('project-1')
    expect(project.fileName).toBe('project-1.tn-mindmap.md')
    const directory = parent.children.get('project-1') as MemoryDirectory
    expect([...directory.children.keys()].sort()).toEqual(['assets', 'project-1.tn-mindmap.md'])
    expect(await ((directory.children.get(project.fileName) as MemoryFile).data).text()).toBe('# Project 1\n')
  })

  it('目标作品目录已存在时拒绝覆盖', async () => {
    const parent = new MemoryDirectory('workspace')
    await parent.getDirectoryHandle('existing', { create: true })
    await expect(LocalProject.create(parent, 'existing', '# T\n')).rejects.toBeInstanceOf(ProjectExistsError)
  })

  it('图片写入 assets 并只返回可持久化的相对路径', async () => {
    const parent = new MemoryDirectory('workspace')
    const project = await LocalProject.create(parent, 'images', '# Images\n')
    const path = await project.writeAsset(new Blob(['png-data'], { type: 'image/png' }), 'shot.png')

    expect(path).toBe('assets/shot.png')
    expect(await (await project.readAsset(path)).text()).toBe('png-data')
  })

  it('打开作品时严格校验“目录名 = 唯一脑图文件名”', async () => {
    const valid = new MemoryDirectory('notes')
    const file = await valid.getFileHandle('notes.tn-mindmap.md', { create: true })
    await (await file.createWritable()).write('# Notes\n')
    const opened = await LocalProject.open(valid)
    expect(opened.markdown).toBe('# Notes\n')

    const invalid = new MemoryDirectory('wrong')
    await invalid.getFileHandle('another.tn-mindmap.md', { create: true })
    await invalid.getFileHandle('second.tn-mindmap.md', { create: true })
    await expect(LocalProject.open(invalid)).rejects.toBeInstanceOf(InvalidProjectError)
  })

  it('拒绝路径穿越作品名和资源路径', async () => {
    expect(() => normalizeProjectName('../secret')).toThrow(InvalidProjectError)
    const parent = new MemoryDirectory('workspace')
    const project = await LocalProject.create(parent, 'safe', '# Safe\n')
    await expect(project.readAsset('assets/../secret')).rejects.toBeInstanceOf(InvalidProjectError)
  })

  it('资源名使用图片 MIME 对应的扩展名', () => {
    const name = createAssetFileName(new Blob([], { type: 'image/jpeg' }), new Date(2026, 7, 18, 3, 4, 5))
    expect(name).toMatch(/^image-20260818-030405-[a-z0-9-]{8}\.jpg$/)
  })
})
