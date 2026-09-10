import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import { dirname } from 'node:path'
import { parentPort } from 'node:worker_threads'
import MiniSearch from 'minisearch'

import {
  createSearchIndex,
  querySearchIndex,
  searchDocumentFingerprint,
  searchFingerprintSignature,
  searchOptions,
  type SearchIndexDocument
} from './searchModel'

import type { SearchResultDto } from '../shared/contracts'

interface BuildRequest {
  type: 'build'
  requestId: number
  documents: SearchIndexDocument[]
  cachePath: string
}

interface UpsertRequest {
  type: 'upsert'
  requestId: number
  document: SearchIndexDocument
  cachePath: string
}

interface SearchRequest {
  type: 'search'
  requestId: number
  query: string
  knowledgeBaseId: string | null
  limit: number
}

interface ClearRequest {
  type: 'clear'
  requestId: number
}

type WorkerRequest = BuildRequest | UpsertRequest | SearchRequest | ClearRequest

interface CachedSearchIndex {
  version: 4
  /**
   * id → 文档指纹（revision + 文件名 + 标题 + 编号），让 upsert 能在 worker 内
   * 重算签名；只存正文哈希会让重命名后的索引一直命中旧缓存。
   */
  fingerprints: Record<string, string>
  index: ReturnType<MiniSearch<SearchIndexDocument>['toJSON']>
}

let currentIndex = createSearchIndex([])
let currentFingerprints: Record<string, string> = {}
let cacheWriteTimer: ReturnType<typeof setTimeout> | null = null

async function readCache(cachePath: string, signature: string): Promise<boolean> {
  try {
    const cache = JSON.parse(await fs.readFile(cachePath, 'utf8')) as CachedSearchIndex
    if (cache.version !== 4 || !cache.fingerprints) return false
    // v4 stores per-document fingerprints; the signature is derived from them.
    if (searchFingerprintSignature(cache.fingerprints) !== signature) return false
    currentIndex = MiniSearch.loadJSON<SearchIndexDocument>(
      JSON.stringify(cache.index),
      searchOptions()
    )
    currentFingerprints = cache.fingerprints
    return true
  } catch {
    return false
  }
}

async function writeCacheNow(cachePath: string): Promise<void> {
  await fs.mkdir(dirname(cachePath), { recursive: true })
  // Unique tmp name: a debounced write may overlap with a build's write.
  const temporary = `${cachePath}.${randomUUID()}.tmp`
  const payload = `${JSON.stringify({
    version: 4,
    fingerprints: currentFingerprints,
    index: currentIndex.toJSON()
  } satisfies CachedSearchIndex)}\n`
  await fs.writeFile(temporary, payload, 'utf8')
  await fs.rename(temporary, cachePath)
}

/** Debounce cache writes so rapid edit bursts coalesce into one write. */
function scheduleCacheWrite(cachePath: string): void {
  if (cacheWriteTimer) clearTimeout(cacheWriteTimer)
  cacheWriteTimer = setTimeout(() => {
    cacheWriteTimer = null
    void writeCacheNow(cachePath).catch(() => undefined)
  }, 2_000)
}

async function build(request: BuildRequest): Promise<{ documentCount: number; cached: boolean }> {
  const fingerprints: Record<string, string> = {}
  for (const document of request.documents) {
    fingerprints[document.id] = searchDocumentFingerprint(document)
  }
  const signature = searchFingerprintSignature(fingerprints)
  const cached = await readCache(request.cachePath, signature)
  if (!cached) {
    currentIndex = createSearchIndex(request.documents)
    currentFingerprints = fingerprints
    await writeCacheNow(request.cachePath)
  }
  return { documentCount: currentIndex.documentCount, cached }
}

async function upsert(request: UpsertRequest): Promise<{ documentCount: number }> {
  if (currentIndex.has(request.document.id)) currentIndex.discard(request.document.id)
  currentIndex.add(request.document)
  currentFingerprints[request.document.id] = searchDocumentFingerprint(request.document)
  scheduleCacheWrite(request.cachePath)
  return { documentCount: currentIndex.documentCount }
}

function sendSuccess(requestId: number, value: unknown): void {
  parentPort?.postMessage({ requestId, ok: true, value })
}

function sendFailure(requestId: number, error: unknown): void {
  parentPort?.postMessage({
    requestId,
    ok: false,
    error: error instanceof Error ? error.message : String(error)
  })
}

let requestQueue: Promise<void> = Promise.resolve()

function handle(request: WorkerRequest): Promise<void> {
  return (async () => {
    try {
      if (request.type === 'build') {
        sendSuccess(request.requestId, await build(request))
        return
      }
      if (request.type === 'upsert') {
        sendSuccess(request.requestId, await upsert(request))
        return
      }
      if (request.type === 'clear') {
        currentIndex = createSearchIndex([])
        currentFingerprints = {}
        sendSuccess(request.requestId, undefined)
        return
      }
      const results: SearchResultDto[] = querySearchIndex(
        currentIndex,
        request.query,
        request.knowledgeBaseId,
        request.limit
      )
      sendSuccess(request.requestId, results)
    } catch (error) {
      sendFailure(request.requestId, error)
    }
  })()
}

// Serialize requests so an upsert can never interleave with an in-flight build.
parentPort?.on('message', (request: WorkerRequest) => {
  requestQueue = requestQueue.then(() => handle(request))
})
