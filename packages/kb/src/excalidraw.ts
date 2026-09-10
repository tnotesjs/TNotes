/**
 * src/excalidraw.ts
 *
 * `.excalidraw` 源文件是自由绘图的唯一真相源：只保存一份，图片内嵌在 JSON 的
 * `files` 里，不拆成 assets 图片，也不维护旁路 SVG/PNG。
 *
 * 本模块只做「文件级」的事：归属前缀校验、排他命名、原子写、期望版本校验、
 * 同笔记复制。会话/自动写入/撤销历史由宿主负责（Desk 主进程 + 编辑器适配层）。
 */

import fs from 'node:fs/promises'
import path from 'node:path'

import { writeFileAtomic } from './atomic'
import { ASSETS_DIR } from './constants'
import { KbError } from './errors'
import { hashBytes } from './asset-scan/hash'
import { ownerNoteIndexFromName } from './asset-scan/owner'

export const EXCALIDRAW_EXTENSION = '.excalidraw'

/** 单文件上限：画布内嵌图片会显著放大 JSON，给足空间但不能无上限。 */
const MAX_DOCUMENT_BYTES = 32 * 1024 * 1024

export interface ExcalidrawDocumentRef {
  relPath: string
  ownerNoteIndex: string
  revision: string
}

export interface ExcalidrawDocument extends ExcalidrawDocumentRef {
  content: string
  /** JSON 解析 + type 校验是否通过；false 时宿主必须只报错，不得写回。 */
  valid: boolean
  bytes: number
}

export interface CreateExcalidrawDocumentInput {
  ownerNoteIndex: string
  /** 空场景 JSON；由宿主用官方 serializeAsJSON 生成，缺省用内置最小场景 */
  content?: string
  /** 便于测试与可复现命名 */
  now?: Date
}

export interface WriteExcalidrawDocumentInput {
  relPath: string
  content: string
  /** 读取时的 revision；不一致说明磁盘被外部改过 */
  expectedRevision: string
}

export interface CopyExcalidrawDocumentInput {
  fromRelPath: string
  /** 目标笔记编号：跨笔记复制必须换前缀，禁止跨笔记共享同一文件 */
  toOwnerNoteIndex: string
  now?: Date
}

/** 最小合法空场景。字段与官方 serializeAsJSON 输出保持同一形状。 */
export function emptyExcalidrawScene(): string {
  return `${JSON.stringify(
    {
      type: 'excalidraw',
      version: 2,
      source: 'tnotes-desk',
      elements: [],
      appState: { gridSize: null, viewBackgroundColor: '#ffffff' },
      files: {}
    },
    null,
    2
  )}\n`
}

function normalizeOwnerIndex(index: string): string {
  const trimmed = index.trim()
  if (!/^\d{4}$/.test(trimmed)) {
    throw new KbError('INVALID_INDEX', `笔记编号必须是四位数字：${index}`)
  }
  return trimmed
}

/** KB 相对路径 → 绝对路径，并确认没有逃出 assets/ 与 KB 根。 */
function resolveDocumentPath(rootPath: string, relPath: string): string {
  const normalized = relPath.replaceAll('\\', '/').replace(/^\.\//, '')
  if (!normalized.startsWith(`${ASSETS_DIR}/`)) {
    throw new KbError('INVALID_OPERATION', `画布必须放在 ${ASSETS_DIR}/ 下：${relPath}`)
  }
  if (path.posix.extname(normalized).toLowerCase() !== EXCALIDRAW_EXTENSION) {
    throw new KbError('INVALID_OPERATION', `只允许 ${EXCALIDRAW_EXTENSION} 源文件：${relPath}`)
  }
  const withinAssets = path.posix.normalize(normalized)
  if (!withinAssets.startsWith(`${ASSETS_DIR}/`)) {
    throw new KbError('INVALID_OPERATION', `画布路径越界：${relPath}`)
  }
  const root = path.resolve(rootPath)
  const absolute = path.resolve(root, withinAssets)
  if (!absolute.startsWith(root + path.sep)) {
    throw new KbError('INVALID_OPERATION', `画布路径越界：${relPath}`)
  }
  return absolute
}

function assertOwnership(relPath: string, expectedOwner?: string): string {
  const owner = ownerNoteIndexFromName(path.posix.basename(relPath))
  if (!owner) {
    throw new KbError(
      'INVALID_OPERATION',
      `画布文件名缺少四位笔记编号前缀，无法确定归属：${path.posix.basename(relPath)}`
    )
  }
  if (expectedOwner && owner !== normalizeOwnerIndex(expectedOwner)) {
    throw new KbError(
      'INVALID_OPERATION',
      `画布归属为 ${owner}，与目标笔记 ${expectedOwner} 不一致`,
      { owner, expectedOwner }
    )
  }
  return owner
}

function assertValidScene(content: string, relPath: string): void {
  const bytes = Buffer.byteLength(content, 'utf8')
  if (bytes > MAX_DOCUMENT_BYTES) {
    throw new KbError('INVALID_OPERATION', `画布文件过大（${bytes} 字节）`, {
      limit: MAX_DOCUMENT_BYTES
    })
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch (error) {
    throw new KbError('INVALID_OPERATION', `画布不是合法 JSON，已拒绝写入：${relPath}`, {
      cause: error instanceof Error ? error.message : String(error)
    })
  }
  if (!isExcalidrawScene(parsed)) {
    throw new KbError('INVALID_OPERATION', `不是 Excalidraw 场景，已拒绝写入：${relPath}`)
  }
}

function isExcalidrawScene(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const scene = value as { type?: unknown; elements?: unknown }
  return scene.type === 'excalidraw' && Array.isArray(scene.elements)
}

/** 与本地粘贴资源同一约定：`0042-YY-MM-DD-HH-mm-ss`。 */
function timestampName(now: Date): string {
  const pad = (value: number): string => String(value).padStart(2, '0')
  return [
    pad(now.getFullYear() % 100),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('-')
}

/**
 * 排他命名：同一秒内多次创建也不能互相覆盖。用 `wx` 打开，冲突则换后缀重试，
 * 因此并发创建（多窗口/多入口）不会写坏彼此的文件。
 */
async function createExclusive(
  rootPath: string,
  ownerNoteIndex: string,
  content: string,
  now: Date
): Promise<string> {
  const base = `${normalizeOwnerIndex(ownerNoteIndex)}-${timestampName(now)}`
  const assetsDir = path.join(path.resolve(rootPath), ASSETS_DIR)
  await fs.mkdir(assetsDir, { recursive: true })
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const suffix = attempt === 0 ? '' : `-${attempt}`
    const fileName = `${base}${suffix}${EXCALIDRAW_EXTENSION}`
    const absolute = path.join(assetsDir, fileName)
    try {
      await fs.writeFile(absolute, content, { encoding: 'utf8', flag: 'wx' })
      return `${ASSETS_DIR}/${fileName}`
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') continue
      throw error
    }
  }
  throw new KbError('INVALID_OPERATION', '同一秒内创建了过多画布，请稍后重试')
}

export async function createExcalidrawDocument(
  rootPath: string,
  input: CreateExcalidrawDocumentInput
): Promise<ExcalidrawDocumentRef> {
  const content = input.content ?? emptyExcalidrawScene()
  assertValidScene(content, 'new')
  const relPath = await createExclusive(
    rootPath,
    input.ownerNoteIndex,
    content,
    input.now ?? new Date()
  )
  return {
    relPath,
    ownerNoteIndex: normalizeOwnerIndex(input.ownerNoteIndex),
    revision: hashBytes(content)
  }
}

export async function readExcalidrawDocument(
  rootPath: string,
  relPath: string
): Promise<ExcalidrawDocument> {
  const owner = assertOwnership(relPath)
  const absolute = resolveDocumentPath(rootPath, relPath)
  let content: string
  try {
    content = await fs.readFile(absolute, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new KbError('NOTE_NOT_FOUND', `画布文件不存在：${relPath}`)
    }
    throw error
  }
  let valid = false
  try {
    valid = isExcalidrawScene(JSON.parse(content))
  } catch {
    valid = false
  }
  return {
    relPath,
    ownerNoteIndex: owner,
    revision: hashBytes(content),
    content,
    valid,
    bytes: Buffer.byteLength(content, 'utf8')
  }
}

export async function writeExcalidrawDocument(
  rootPath: string,
  input: WriteExcalidrawDocumentInput
): Promise<ExcalidrawDocumentRef> {
  // 归属与路径先校验：写操作绝不允许把文件写到别人的前缀上或库外
  const owner = assertOwnership(input.relPath)
  const absolute = resolveDocumentPath(rootPath, input.relPath)
  assertValidScene(input.content, input.relPath)

  let current: string
  try {
    current = await fs.readFile(absolute, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new KbError('NOTE_NOT_FOUND', `画布文件不存在：${input.relPath}`)
    }
    throw error
  }
  if (hashBytes(current) !== input.expectedRevision) {
    throw new KbError('REVISION_CONFLICT', `画布已被外部修改：${input.relPath}`, {
      expected: input.expectedRevision,
      actual: hashBytes(current)
    })
  }
  await writeFileAtomic(absolute, input.content)
  return { relPath: input.relPath, ownerNoteIndex: owner, revision: hashBytes(input.content) }
}

export async function copyExcalidrawDocument(
  rootPath: string,
  input: CopyExcalidrawDocumentInput
): Promise<ExcalidrawDocumentRef> {
  const source = await readExcalidrawDocument(rootPath, input.fromRelPath)
  if (!source.valid) {
    throw new KbError('INVALID_OPERATION', `源画布不是合法场景，已拒绝复制：${input.fromRelPath}`)
  }
  // 复制保留全部内容与内嵌图片；目标换前缀，绝不跨笔记共享同一文件
  return await createExcalidrawDocument(rootPath, {
    ownerNoteIndex: input.toOwnerNoteIndex,
    content: source.content,
    now: input.now
  })
}
