import { deskLog } from './log'

import type { PreviewStartResult, PreviewStateDto } from '../shared/contracts'

/** Minimal structural type — avoids coupling to a specific vite install copy. */
interface PreviewServerLike {
  httpServer?: {
    address(): unknown
    close(callback?: () => void): void
  } | null
  close?: () => Promise<void> | void
}

interface PreviewHandle {
  state: PreviewStateDto
  server: PreviewServerLike | null
  stopping: boolean
}

/** dirName（0001. 标题）→ 规范路由 `/notes/{n}`。 */
function notePreviewUrl(baseUrl: string, noteDirName?: string): string {
  if (!noteDirName) return baseUrl
  const index = noteDirName.match(/^(\d{1,4})\b/)?.[1]
  if (!index) return `${baseUrl}notes/${encodeURIComponent(noteDirName)}`
  return `${baseUrl}notes/${Number(index)}`
}

/**
 * Embedded preview: runs @tnotesjs/ssg's on-demand Vite SSR in-process.
 * No per-kb package.json / tn:dev script needed.
 */
export class PreviewManager {
  private handles = new Map<string, PreviewHandle>()
  private listener: ((state: PreviewStateDto) => void) | null = null

  onChanged(listener: (state: PreviewStateDto) => void): () => void {
    this.listener = listener
    return () => {
      if (this.listener === listener) this.listener = null
    }
  }

  list(): PreviewStateDto[] {
    return [...this.handles.values()].map((handle) => ({ ...handle.state }))
  }

  async start(
    knowledgeBaseId: string,
    knowledgeBaseName: string,
    repoDir: string,
    noteDirName?: string
  ): Promise<PreviewStartResult> {
    const existing = this.handles.get(knowledgeBaseId)
    if (existing?.server) {
      return {
        state: { ...existing.state },
        url: existing.state.baseUrl ? notePreviewUrl(existing.state.baseUrl, noteDirName) : null
      }
    }

    const state: PreviewStateDto = {
      knowledgeBaseId,
      knowledgeBaseName,
      status: 'starting',
      port: null,
      baseUrl: null,
      error: null
    }
    const handle: PreviewHandle = { state, server: null, stopping: false }
    this.handles.set(knowledgeBaseId, handle)
    this.emit(state)

    try {
      const { createDevServer, resolveConfig } = await import('@tnotesjs/ssg')
      const config = await resolveConfig(repoDir)
      const server = await createDevServer(repoDir)
      handle.server = server
      const address = server.httpServer?.address()
      const port = address && typeof address === 'object' ? address.port : config.port
      handle.state = {
        ...handle.state,
        status: 'ready',
        port,
        baseUrl: `http://localhost:${port}${config.base}`,
        error: null
      }
      this.emit(handle.state)
      deskLog('preview', 'started', { knowledgeBaseId, port })
    } catch (error) {
      handle.state = {
        ...handle.state,
        status: 'error',
        error: error instanceof Error ? error.message : String(error)
      }
      this.emit(handle.state)
      deskLog('preview', 'start failed', handle.state.error)
    }

    return {
      state: { ...handle.state },
      url: handle.state.baseUrl ? notePreviewUrl(handle.state.baseUrl, noteDirName) : null
    }
  }

  async stop(knowledgeBaseId: string): Promise<PreviewStateDto> {
    const handle = this.handles.get(knowledgeBaseId)
    if (!handle) {
      return {
        knowledgeBaseId,
        knowledgeBaseName: knowledgeBaseId,
        status: 'idle',
        port: null,
        baseUrl: null,
        error: null
      }
    }
    await this.stopHandle(handle)
    this.handles.delete(knowledgeBaseId)
    const state: PreviewStateDto = { ...handle.state, status: 'idle', error: null }
    this.emit(state)
    return state
  }

  async stopAll(): Promise<void> {
    await Promise.all([...this.handles.values()].map((handle) => this.stopHandle(handle)))
    this.handles.clear()
  }

  private async stopHandle(handle: PreviewHandle): Promise<void> {
    handle.stopping = true
    const server = handle.server
    handle.server = null
    if (!server) return
    if (server.close) {
      await Promise.race([
        Promise.resolve(server.close()),
        new Promise<void>((resolve) => setTimeout(resolve, 2500)),
      ])
      return
    }
    await new Promise<void>((resolve) => {
      server.httpServer?.close(() => resolve())
      setTimeout(resolve, 2500)
    })
  }

  private emit(state: PreviewStateDto): void {
    this.listener?.({ ...state })
  }
}

export const previewManager = new PreviewManager()
