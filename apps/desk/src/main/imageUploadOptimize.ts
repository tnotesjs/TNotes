/**
 * Apply Desk `imageUpload.optimize` defaults to paste/upload payloads before
 * GitHub upload or local assets write. Same encoder as the settings playground
 * and the KB assets panel; skip quietly when encode declines (GIF/SVG/etc.).
 *
 * Encodes through `encodeManager` (worker thread, in-process fallback) for the
 * same reason the assets panel does: the oxipng backend is synchronous WASM and
 * takes seconds on a real PNG, which would otherwise freeze the whole main
 * process — every window and IPC call — for the duration of a single paste.
 */

import { encodeManager } from './encodeManager'
import { toEncodeImageOptions } from './optimizeStrength'
import { loadSettings } from './settings'

import type { AttachmentWriteLocalRequest } from '../shared/contracts'

function withOutputExtension(fileName: string, outputExt: string): string {
  const trimmed = fileName.trim() || `image-${Date.now()}`
  const dot = trimmed.lastIndexOf('.')
  if (dot <= 0) return `${trimmed}${outputExt}`
  return `${trimmed.slice(0, dot)}${outputExt}`
}

export async function maybeOptimizeUploadRequest<T extends AttachmentWriteLocalRequest>(
  request: T
): Promise<T> {
  const optimize = loadSettings().imageUpload.optimize
  const result = await encodeManager.encode(
    request.data,
    request.fileName,
    toEncodeImageOptions({
      ...optimize,
      // 全局设置不再暴露「最大边」；粘贴 / 图床上传始终保持原分辨率。
      maxDimension: null
    })
  )
  if (result.skipped || !result.output || !result.outputExt) return request
  return {
    ...request,
    data: result.output,
    fileName: withOutputExtension(request.fileName, result.outputExt)
  }
}
