import { join } from 'node:path'
import { Worker } from 'node:worker_threads'

import { encodeImage, type EncodeImageOptions, type EncodeImageResult } from './imageEncode'

interface WorkerResponse {
  requestId: number
  ok: boolean
  value?: EncodeImageResult
  error?: string
}

interface PendingEncode {
  data: Uint8Array
  fileName: string
  options: EncodeImageOptions
  resolve: (value: EncodeImageResult) => void
  reject: (error: Error) => void
}

/**
 * Encode off the main thread when the worker boots; fall back to in-process
 * sharp if the worker fails to start (tests / unpack issues).
 *
 * A worker that dies mid-request must not leave the caller waiting forever, so
 * anything still in flight is re-run in-process instead of hanging.
 */
export class EncodeManager {
  private worker: Worker | null = null
  private disposed = false
  private requestId = 0
  private readonly pending = new Map<number, PendingEncode>()

  constructor() {
    try {
      this.worker = new Worker(join(__dirname, 'encodeWorker.js'))
      this.worker.on('message', (response: WorkerResponse) => {
        const pending = this.pending.get(response.requestId)
        if (!pending) return
        this.pending.delete(response.requestId)
        if (response.ok && response.value) pending.resolve(response.value)
        else pending.reject(new Error(response.error || '编码工作线程返回未知错误'))
      })
      // 'error' fires for a crash before startup, 'exit' for any termination.
      // Both can strand in-flight requests, so drain them on either.
      this.worker.on('error', () => this.handleWorkerLoss('编码工作线程异常退出'))
      this.worker.on('exit', () => this.handleWorkerLoss('编码工作线程已退出'))
    } catch {
      this.worker = null
    }
  }

  private handleWorkerLoss(reason: string, lost: Worker | null = this.worker): void {
    if (!lost) return
    if (this.worker === lost) this.worker = null
    const pending = [...this.pending.values()]
    this.pending.clear()
    for (const item of pending) {
      if (this.disposed) {
        item.reject(new Error(reason))
        continue
      }
      void encodeImage(item.data, item.fileName, item.options).then(item.resolve, item.reject)
    }
  }

  async encode(
    data: Uint8Array,
    fileName: string,
    options: EncodeImageOptions
  ): Promise<EncodeImageResult> {
    if (!this.worker) return encodeImage(data, fileName, options)
    const requestId = (this.requestId += 1)
    return await new Promise((resolve, reject) => {
      this.pending.set(requestId, { data, fileName, options, resolve, reject })
      this.worker?.postMessage({ type: 'encode', requestId, fileName, data, options })
    })
  }

  async dispose(): Promise<void> {
    this.disposed = true
    const worker = this.worker
    this.worker = null
    await worker?.terminate()
    this.handleWorkerLoss('编码工作线程已关闭', worker)
  }
}

export const encodeManager = new EncodeManager()
