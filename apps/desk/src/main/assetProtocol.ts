import { net, protocol } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import { deskLog } from './log'
import { workspaceManager } from './workspaceManager'

const SCHEME = 'tnotes-asset'

export function registerAssetScheme(): void {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: SCHEME,
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        stream: true,
        // 字体是 CORS 受限资源：渲染端从 tnotes-asset:// 取字体必须带 ACAO，
        // 否则 FontFace 抛 NetworkError、画布回退字体
        corsEnabled: true
      }
    }
  ])
}

/** 产物内静态资源的类型；字体是主要目标。 */
const APP_MIME: Record<string, string> = {
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
}

/**
 * 应用自带静态资源（目前是 Excalidraw 官方字体）。
 *
 * 渲染端把 `EXCALIDRAW_ASSET_PATH` 指到 `tnotes-asset://app/excalidraw/`；
 * 这里只允许读渲染端产物目录内的文件，越界一律 404。
 * 读进内存再回包：`net.fetch(file://…)` 的流式 body 在这个自定义协议下会让
 * 渲染端拿到 NetworkError（实测 img/fetch/FontFace 全失败）。
 */
function resolveAppFile(requestedPath: string): string | null {
  // 与加载 renderer/index.html 用同一个锚点：主进程产物在 out/main，
  // 渲染端产物是它的兄弟目录（打包后同在 asar 内）
  const root = path.join(__dirname, '..', 'renderer')
  const normalized = path.normalize(decodeURIComponent(requestedPath)).replace(/^([/\\])+/, '')
  const absolute = path.resolve(root, normalized)
  if (absolute !== root && !absolute.startsWith(root + path.sep)) return null
  return absolute
}

async function appFileResponse(absolutePath: string): Promise<Response> {
  const data = await fs.readFile(absolutePath)
  return new Response(new Uint8Array(data), {
    status: 200,
    headers: {
      'content-type':
        APP_MIME[path.extname(absolutePath).toLowerCase()] ?? 'application/octet-stream',
      'access-control-allow-origin': '*'
    }
  })
}

export function handleAssetProtocol(): void {
  protocol.handle(SCHEME, async (request) => {
    try {
      const url = new URL(request.url)
      if (url.hostname === 'app') {
        const absolutePath = resolveAppFile(url.pathname)
        if (!absolutePath) return new Response('Not found', { status: 404 })
        return await appFileResponse(absolutePath)
      }
      if (url.hostname !== 'asset') return new Response('Not found', { status: 404 })
      const knowledgeBaseId = url.searchParams.get('knowledgeBaseId') ?? ''
      const requestedPath = url.searchParams.get('path') ?? ''
      const absolutePath = await workspaceManager.resolveNoteAsset(knowledgeBaseId, requestedPath)
      return net.fetch(pathToFileURL(absolutePath).toString())
    } catch (error) {
      deskLog(
        'asset-protocol',
        'request rejected',
        error instanceof Error ? error.message : String(error)
      )
      return new Response('Not found', { status: 404 })
    }
  })
}
