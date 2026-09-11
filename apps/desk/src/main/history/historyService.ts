import path from 'node:path'

import type { AssetEditorSnapshotDto } from '../../shared/contracts'
import { workspaceManager } from '../workspaceManager'
import { buildHistoryRestorePlan, type HistoryRestorePlan } from './restorePlan'
import {
  listHistoryCommits,
  readHistoryBlob,
  readHistorySnapshot,
  resolveHead,
  type GitHistoryOptions,
  type HistoryCommitSummary,
  type HistorySnapshotManifest
} from './gitHistory'

/**
 * 历史读取服务（计划 H1/H2）。
 *
 * 渲染端只给 knowledgeBaseId + 已校验的 commit/path，主进程负责把 KB 根路径
 * 交给 gitHistory，并用 manifest 限制可读路径；任何 revision 表达式、任意文件
 * 读取都在这里被挡住。
 */
export interface HistoryListResult {
  head: string
  commits: HistoryCommitSummary[]
  hasMore: boolean
  /** 浅克隆：更早的历史不在本地，界面要明确提示 */
  shallow: boolean
  /** 命中扫描上限：更早的相关提交没读完，界面要说明 */
  truncated: boolean
}

export interface HistoryBlobResult {
  commit: string
  relPath: string
  oid: string
  bytes: number
  text: string | null
}

export class HistoryService {
  constructor(private readonly options: GitHistoryOptions = {}) {}

  private rootOf(knowledgeBaseId: string): string {
    return workspaceManager.getHandle(knowledgeBaseId).rootPath
  }

  async list(
    knowledgeBaseId: string,
    input: { noteIndex?: string; head?: string; skip?: number; limit?: number } = {}
  ): Promise<HistoryListResult> {
    return await listHistoryCommits(this.rootOf(knowledgeBaseId), {
      ...this.options,
      ...input
    })
  }

  async snapshot(
    knowledgeBaseId: string,
    input: { commit: string; noteIndex: string; noteUuid?: string }
  ): Promise<HistorySnapshotManifest> {
    return await readHistorySnapshot(this.rootOf(knowledgeBaseId), input, this.options)
  }

  /** 读取历史笔记正文（限制在快照清单里） */
  async readNote(
    knowledgeBaseId: string,
    input: { commit: string; noteIndex: string; noteUuid?: string }
  ): Promise<HistoryBlobResult & { snapshot: HistorySnapshotManifest }> {
    const root = this.rootOf(knowledgeBaseId)
    const snapshot = await readHistorySnapshot(root, input, this.options)
    if (!snapshot.note) {
      throw new Error(
        snapshot.ambiguousNotePaths.length > 0
          ? `编号 ${input.noteIndex} 在该提交下有多个笔记文件：${snapshot.ambiguousNotePaths.join('、')}`
          : `该提交里找不到编号 ${input.noteIndex} 的笔记文件`
      )
    }
    const blob = await readHistoryBlob(
      root,
      { commit: input.commit, relPath: snapshot.note.relPath },
      this.options
    )
    return {
      commit: blob.commit,
      relPath: blob.relPath,
      oid: blob.oid,
      bytes: blob.bytes.byteLength,
      text: blob.text,
      snapshot
    }
  }

  /** 只读资源字节（历史图片 / `.excalidraw` 等），限制在该 commit 真实存在的路径 */
  async readAsset(
    knowledgeBaseId: string,
    input: { commit: string; relPath: string }
  ): Promise<{ bytes: Buffer; oid: string; contentType: string }> {
    const root = this.rootOf(knowledgeBaseId)
    const blob = await readHistoryBlob(root, input, this.options)
    return {
      bytes: blob.bytes,
      oid: blob.oid,
      contentType: contentTypeFor(blob.relPath)
    }
  }

  async head(knowledgeBaseId: string): Promise<string | null> {
    return await resolveHead(this.rootOf(knowledgeBaseId), this.options)
  }

  /**
   * 创建恢复计划（H4）：只做验证与固化，不写任何文件。
   * 渲染端只能拿到计划 DTO（写入路径与字节数），实际字节仍在主进程。
   */
  async plan(
    knowledgeBaseId: string,
    input: {
      noteIndex: string
      commit: string
      expectedHead?: string
      writers?: AssetEditorSnapshotDto
    }
  ): Promise<HistoryRestorePlan> {
    return await buildHistoryRestorePlan(this.rootOf(knowledgeBaseId), {
      knowledgeBaseId,
      noteIndex: input.noteIndex,
      commit: input.commit,
      expectedHead: input.expectedHead,
      writers: input.writers
    })
  }
}

export const MIME_BY_EXTENSION: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.excalidraw': 'application/json',
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff'
}

export function contentTypeFor(relPath: string): string {
  return MIME_BY_EXTENSION[path.extname(relPath).toLowerCase()] ?? 'application/octet-stream'
}

export const historyService = new HistoryService()
