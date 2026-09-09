import { createHash, randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import { dirname } from 'node:path'
import { parentPort } from 'node:worker_threads'
import MiniSearch from 'minisearch'

import {
  createSearchIndex,
  querySearchIndex,
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
  version: 3
  /** id → content hash, so upserts can recompute the signature in-worker. */
  revisions: Record<string, string>
  index: ReturnType<MiniSearch<SearchIndexDocument>['toJSON']>
}

let currentIndex = createSearchIndex([])
let currentRevisions: Record<string, string> = {}
let cacheWriteTimer: ReturnType<typeof setTimeout> | null = null

function signatureFromRevisions(revisions: Record<string, string>): string {
  const hash = createHash('sha256')
  for (const id of Object.keys(revisions).sort()) {
    hash.update(id)
    hash.update('\0')
    hash.update(revisions[id] ?? '')
    hash.update('\0')
  }
  return hash.digest('hex')
}

async function readCache(cachePath: string, signature: string): Promise<boolean> {
  try {
    const cache = JSON.parse(await fs.readFile(cachePath, 'utf8')) as CachedSearchIndex
    if (cache.version !== 3 || !cache.revisions) return false
    // v3 stores per-document revisions; the signature is derived from them.
    if (signatureFromRevisions(cache.revisions) !== signature) return false
    currentIndex = MiniSearch.loadJSON<SearchIndexDocument>(
      JSON.stringify(cache.index),
      searchOptions()
    )
    currentRevisions = cache.revisions
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
    version: 3,
    revisions: currentRevisions,
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
  const revisions: Record<string, string> = {}
  for (const document of request.documents) revisions[document.id] = document.revision
  const signature = signatureFromRevisions(revisions)
  const cached = await readCache(request.cachePath, signature)
  if (!cached) {
    currentIndex = createSearchIndex(request.documents)
    currentRevisions = revisions
    await writeCacheNow(request.cachePath)
  }
  return { documentCount: currentIndex.documentCount, cached }
}

async function upsert(request: UpsertRequest): Promise<{ documentCount: number }> {
  if (currentIndex.has(request.document.id)) currentIndex.discard(request.document.id)
  currentIndex.add(request.document)
  currentRevisions[request.document.id] = request.document.revision
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
        currentRevisions = {}
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
