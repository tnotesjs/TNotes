import { join } from 'node:path'
import { Worker } from 'node:worker_threads'

import { encodeImage, type EncodeImageOptions, type EncodeImageResult } from './imageEncode'

interface WorkerResponse {
  requestId: number
  ok: boolean
  value?: EncodeImageResult
  error?: string
}

/**
 * Encode off the main thread when the worker boots; fall back to in-process
 * sharp if the worker fails to start (tests / unpack issues).
 */
export class EncodeManager {
  private worker: Worker | null = null
  private requestId = 0
  private readonly pending = new Map<
    number,
    { resolve: (value: EncodeImageResult) => void; reject: (error: Error) => void }
  >()

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
      this.worker.on('error', () => {
        this.worker = null
      })
    } catch {
      this.worker = null
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
      this.pending.set(requestId, { resolve, reject })
      this.worker?.postMessage({ type: 'encode', requestId, fileName, data, options })
    })
  }

  async dispose(): Promise<void> {
    await this.worker?.terminate()
    this.worker = null
  }
}

export const encodeManager = new EncodeManager()
