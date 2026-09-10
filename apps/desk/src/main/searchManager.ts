import { createHash } from 'node:crypto'
import { EventEmitter } from 'node:events'
import { join } from 'node:path'
import { Worker } from 'node:worker_threads'
import { app } from 'electron'

import { deskLog } from './log'

import type { SearchIndexDocument } from './searchModel'
import type { SearchRequest, SearchResultDto } from '../shared/contracts'

interface WorkerResponse<T = unknown> {
  requestId: number
  ok: boolean
  value?: T
  error?: string
}

interface PendingRequest {
  resolve(value: unknown): void
  reject(error: Error): void
  timer: NodeJS.Timeout
}

/** 搜索 / 增量更新是毫秒级操作；超时说明线程已经不响应了。 */
const REQUEST_TIMEOUT_MS = 15_000
/** 首次建索引要读并解析整个工作区，给足时间但不能无限等。 */
const BUILD_TIMEOUT_MS = 120_000

interface SearchManagerEvents {
  changed: [{ status: 'idle' | 'building' | 'ready' | 'error'; documentCount: number }]
}

export class SearchManager {
  private readonly events = new EventEmitter<SearchManagerEvents>()
  private readonly worker: Worker
  private readonly pending = new Map<number, PendingRequest>()
  private requestId = 0
  private workspacePath: string | null = null
  private ready: Promise<void> = Promise.resolve()
  private resolveReady: (() => void) | null = null
  private status: 'idle' | 'building' | 'ready' | 'error' = 'idle'
  private documentCount = 0
  private disposed = false

  /** worker 可注入，便于在测试里模拟线程被杀 / 不响应。 */
  constructor(worker?: Worker) {
    this.worker = worker ?? new Worker(join(__dirname, 'searchWorker.js'))
    this.worker.on('message', (response: WorkerResponse) => {
      const pending = this.pending.get(response.requestId)
      if (!pending) return
      this.pending.delete(response.requestId)
      clearTimeout(pending.timer)
      if (response.ok) pending.resolve(response.value)
      else pending.reject(new Error(response.error || '搜索工作线程返回未知错误'))
    })
    this.worker.on('error', (error) => this.failWorker('error', error))
    // OOM / 被杀只会触发 exit：不处理的话 pending 与 ready 都不结算，搜索会永久挂起
    this.worker.on('exit', (code) =>
      this.failWorker(`exit ${code}`, new Error('搜索工作线程已退出'))
    )
  }

  private failWorker(reason: string, error: Error): void {
    if (this.disposed) return
    deskLog('search', 'worker lost', { reason, message: error.message })
    this.status = 'error'
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer)
      pending.reject(error)
    }
    this.pending.clear()
    this.resolveReady?.()
    this.resolveReady = null
    this.emitChanged()
  }

  onChanged(
    listener: (state: {
      status: 'idle' | 'building' | 'ready' | 'error'
      documentCount: number
    }) => void
  ): () => void {
    this.events.on('changed', listener)
    return () => this.events.off('changed', listener)
  }

  setWorkspace(workspacePath: string | null): void {
    if (workspacePath === this.workspacePath) return
    this.workspacePath = workspacePath
    this.documentCount = 0
    if (!workspacePath) {
      this.status = 'idle'
      this.ready = Promise.resolve()
      void this.request('clear', {})
      this.emitChanged()
      return
    }
    this.status = 'building'
    this.ready = new Promise((resolve) => {
      this.resolveReady = resolve
    })
    this.emitChanged()
  }

  async rebuild(workspacePath: string, documents: SearchIndexDocument[]): Promise<void> {
    if (workspacePath !== this.workspacePath) return
    this.status = 'building'
    this.emitChanged()
    try {
      const result = await this.request<{ documentCount: number; cached: boolean }>('build', {
        documents,
        cachePath: this.cachePath(workspacePath)
      })
      if (workspacePath !== this.workspacePath) return
      this.documentCount = result.documentCount
      this.status = 'ready'
      deskLog('search', result.cached ? 'cache restored' : 'index rebuilt', {
        workspacePath,
        documents: result.documentCount
      })
    } catch (error) {
      this.status = 'error'
      deskLog('search', 'index failed', error instanceof Error ? error.message : String(error))
    } finally {
      this.resolveReady?.()
      this.resolveReady = null
      this.emitChanged()
    }
  }

  /** Content-only note save: update just that document, no full rebuild. */
  async upsert(workspacePath: string, document: SearchIndexDocument): Promise<void> {
    if (workspacePath !== this.workspacePath) return
    try {
      const result = await this.request<{ documentCount: number }>('upsert', {
        document,
        cachePath: this.cachePath(workspacePath)
      })
      if (workspacePath !== this.workspacePath) return
      this.documentCount = result.documentCount
    } catch (error) {
      deskLog('search', 'upsert failed', error instanceof Error ? error.message : String(error))
    } finally {
      this.emitChanged()
    }
  }

  async search(request: SearchRequest): Promise<SearchResultDto[]> {
    if (!request.query.trim() || !this.workspacePath) return []
    await this.ready
    if (this.status === 'error') throw new Error('搜索索引不可用，请重新扫描工作区')
    return this.request<SearchResultDto[]>('search', {
      query: request.query,
      knowledgeBaseId: request.knowledgeBaseId,
      limit: request.limit ?? 40
    })
  }

  async dispose(): Promise<void> {
    this.disposed = true
    const error = new Error('搜索服务已关闭')
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timer)
      pending.reject(error)
    }
    this.pending.clear()
    // 正在等待索引就绪的搜索也必须被放行，否则它们会一直等下去
    this.resolveReady?.()
    this.resolveReady = null
    await this.worker.terminate()
    this.events.removeAllListeners()
  }

  private request<T>(
    type: string,
    payload: Record<string, unknown>,
    timeoutMs = type === 'build' ? BUILD_TIMEOUT_MS : REQUEST_TIMEOUT_MS
  ): Promise<T> {
    // dispose 之后仍可能有排队的调用（例如搜索在等 ready），直接拒绝而不是挂起
    if (this.disposed) return Promise.reject(new Error('搜索服务已关闭'))
    const requestId = (this.requestId += 1)
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId)
        reject(new Error(`搜索工作线程 ${timeoutMs}ms 未响应`))
      }, timeoutMs)
      this.pending.set(requestId, {
        resolve: (value) => resolve(value as T),
        reject,
        timer
      })
      this.worker.postMessage({ type, requestId, ...payload })
    })
  }

  private cachePath(workspacePath: string): string {
    const key = createHash('sha256').update(workspacePath).digest('hex').slice(0, 20)
    return join(app.getPath('userData'), 'search-index-v1', `${key}.json`)
  }

  private emitChanged(): void {
    this.events.emit('changed', { status: this.status, documentCount: this.documentCount })
  }
}

export const searchManager = new SearchManager()
