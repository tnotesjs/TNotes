/**
 * Image encode backends. Lives in Desk, not @tnotesjs/kb.
 * - sharp: lossy re-encode (speed + size are the goals). Never label the result lossless.
 * - oxipng: lossless PNG optimisation via WASM. Slower, smaller, no quality/format/resize.
 */

import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

import sharp from 'sharp'

export type AssetOptimizeOutputFormat = 'keep' | 'webp' | 'jpeg'
export type AssetOptimizeEncoder = 'sharp' | 'oxipng'

export interface EncodeImageOptions {
  /** Defaults to sharp when omitted. */
  encoder?: AssetOptimizeEncoder
  quality: number
  maxDimension: number | null
  outputFormat: AssetOptimizeOutputFormat
  jpegBackground?: string
  /** oxipng level 1-6. Higher is smaller and slower; the library does not recommend >4. */
  oxipngLevel?: number
}

export interface EncodeImageResult {
  skipped?: string
  output?: Uint8Array
  outputExt?: string
  width?: number
  height?: number
  bytesBefore: number
  bytesAfter?: number
  ms: number
  lossy: boolean
  encoder: AssetOptimizeEncoder
  format?: string
}

const SKIP_EXT = new Set(['.gif', '.svg', '.excalidraw', '.html', '.htm', '.css', '.js', '.ts'])

function clampQuality(value: number): number {
  if (!Number.isFinite(value)) return 80
  return Math.min(100, Math.max(40, Math.round(value)))
}

function clampOxipngLevel(value: number | undefined): number {
  if (!Number.isFinite(value)) return 2
  return Math.min(6, Math.max(1, Math.round(value as number)))
}

function extOf(fileName: string): string {
  const ext = path.posix.extname(fileName).toLowerCase()
  return ext === '.jpeg' ? '.jpg' : ext
}

function formatFromExt(ext: string): 'png' | 'jpeg' | 'webp' | 'avif' | null {
  if (ext === '.png') return 'png'
  if (ext === '.jpg') return 'jpeg'
  if (ext === '.webp') return 'webp'
  if (ext === '.avif') return 'avif'
  return null
}

function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength) as ArrayBuffer
}

interface OxipngModule {
  default: (
    data: ArrayBuffer,
    options?: { level?: number; interlace?: boolean; optimiseAlpha?: boolean }
  ) => Promise<ArrayBuffer>
  init: (input: ArrayBuffer | Uint8Array) => Promise<unknown>
}

/**
 * Load @jsquash/oxipng, initialising its WASM by hand: the packaged glue resolves
 * the `.wasm` with `fetch(new URL(..., import.meta.url))`, which does not work in
 * Electron's main process / worker threads, so we read the bytes ourselves.
 */
let oxipng: Promise<OxipngModule> | null = null

function resolvePackageFile(relative: string): string {
  // Electron main + encode worker are bundled as CJS, so `__filename` exists there.
  if (typeof __filename === 'string') return createRequire(__filename).resolve(relative)
  // Vitest / ESM contexts resolve from the package root instead.
  return createRequire(pathToFileURL(path.join(process.cwd(), 'index.js')).href).resolve(relative)
}

function loadOxipng(): Promise<OxipngModule> {
  if (!oxipng) {
    oxipng = (async (): Promise<OxipngModule> => {
      const specifier = '@jsquash/oxipng/optimise.js'
      const module = (await import(/* @vite-ignore */ specifier)) as unknown as OxipngModule
      const wasm = readFileSync(
        resolvePackageFile('@jsquash/oxipng/codec/pkg/squoosh_oxipng_bg.wasm')
      )
      await module.init(wasm)
      return module
    })().catch((error: unknown) => {
      oxipng = null
      throw error
    })
  }
  return oxipng
}

async function encodeWithOxipng(
  input: Uint8Array,
  options: EncodeImageOptions,
  started: number
): Promise<EncodeImageResult> {
  const bytesBefore = input.byteLength
  const skip = (reason: string, extra: Partial<EncodeImageResult> = {}): EncodeImageResult => ({
    skipped: reason,
    bytesBefore,
    ms: Date.now() - started,
    lossy: false,
    encoder: 'oxipng',
    ...extra
  })

  if (options.outputFormat !== 'keep') {
    return skip('无损优化不支持转码，输出格式需为「保持原格式」')
  }

  // Extension lies in real knowledge bases (a ".png" that is actually WebP), and
  // oxipng panics on non-PNG input, so trust the bytes instead.
  let detected: string | undefined
  try {
    detected = (await sharp(Buffer.from(input), { failOn: 'error' }).metadata()).format
  } catch {
    detected = undefined
  }
  if (detected !== 'png') {
    return skip(`无损优化仅支持 PNG（实际是 ${detected ?? '无法识别的格式'}）`)
  }

  try {
    const { default: optimise } = await loadOxipng()
    const output = await optimise(toArrayBuffer(input), {
      level: clampOxipngLevel(options.oxipngLevel)
    })
    const encoded = Buffer.from(output)
    if (encoded.byteLength >= bytesBefore) {
      return skip('优化后没有变小', { format: 'png' })
    }
    const meta = await sharp(encoded).metadata()
    return {
      output: new Uint8Array(encoded),
      outputExt: '.png',
      width: meta.width,
      height: meta.height,
      bytesBefore,
      bytesAfter: encoded.byteLength,
      ms: Date.now() - started,
      lossy: false,
      encoder: 'oxipng',
      format: 'png'
    }
  } catch (error) {
    return skip(error instanceof Error ? error.message : '无法优化')
  }
}

export async function encodeImage(
  input: Uint8Array,
  fileName: string,
  options: EncodeImageOptions
): Promise<EncodeImageResult> {
  const started = Date.now()
  if (options.encoder === 'oxipng') return encodeWithOxipng(input, options, started)

  const bytesBefore = input.byteLength
  const ext = extOf(fileName)
  if (SKIP_EXT.has(ext) || ext === '.ico' || ext === '.bmp') {
    return {
      skipped:
        ext === '.gif'
          ? 'GIF 动画不自动压缩或转视频'
          : ext === '.svg' || ext === '.excalidraw'
            ? '矢量/绘图源不栅格化覆盖'
            : `跳过 ${ext || '未知类型'}`,
      bytesBefore,
      ms: Date.now() - started,
      lossy: true,
      encoder: 'sharp'
    }
  }

  const quality = clampQuality(options.quality)
  try {
    let pipeline = sharp(Buffer.from(input), { animated: false, failOn: 'error' }).rotate()
    const meta = await pipeline.metadata()
    if ((meta.pages ?? 1) > 1) {
      return {
        skipped: '动画/多帧图片不按静态帧替换',
        bytesBefore,
        ms: Date.now() - started,
        lossy: true,
        encoder: 'sharp'
      }
    }
    const width = meta.width ?? 0
    const height = meta.height ?? 0
    const max = options.maxDimension
    if (max && max > 0 && (width > max || height > max)) {
      pipeline = pipeline.resize({
        width: max,
        height: max,
        fit: 'inside',
        withoutEnlargement: true
      })
    }

    const want = options.outputFormat
    const hasAlpha = Boolean(meta.hasAlpha)
    let outputExt = ext
    let encoded: Buffer
    if (want === 'keep' && formatFromExt(ext) === 'avif') {
      return {
        skipped: 'AVIF 再编码偏慢，本期跳过',
        bytesBefore,
        ms: Date.now() - started,
        lossy: true,
        encoder: 'sharp'
      }
    }

    if (want === 'jpeg' || (want === 'keep' && formatFromExt(ext) === 'jpeg')) {
      if (hasAlpha && want === 'jpeg' && !options.jpegBackground) {
        return {
          skipped: '透明图转 JPEG 需要先选择背景色',
          bytesBefore,
          ms: Date.now() - started,
          lossy: true,
          encoder: 'sharp'
        }
      }
      if (hasAlpha && options.jpegBackground) {
        pipeline = pipeline.flatten({ background: options.jpegBackground })
      }
      // mozjpeg: smaller files at similar speed for typical screenshots.
      encoded = await pipeline.jpeg({ quality, mozjpeg: true }).toBuffer()
      outputExt = '.jpg'
    } else if (want === 'webp' || (want === 'keep' && formatFromExt(ext) === 'webp')) {
      encoded = await pipeline.webp({ quality, effort: 2, smartSubsample: true }).toBuffer()
      outputExt = '.webp'
    } else if (want === 'keep' && formatFromExt(ext) === 'png') {
      encoded = await pipeline
        .png({
          // zlib 6 + palette/effort 1: size from quantization, speed from low effort.
          compressionLevel: 6,
          adaptiveFiltering: false,
          effort: 1,
          quality,
          palette: quality < 100
        })
        .toBuffer()
      outputExt = '.png'
    } else {
      encoded = await pipeline.webp({ quality, effort: 2, smartSubsample: true }).toBuffer()
      outputExt = '.webp'
    }

    if (encoded.byteLength >= bytesBefore) {
      return {
        skipped: '优化后没有变小',
        bytesBefore,
        ms: Date.now() - started,
        lossy: true,
        encoder: 'sharp',
        width,
        height,
        format: outputExt.slice(1)
      }
    }

    const outMeta = await sharp(encoded).metadata()
    return {
      output: new Uint8Array(encoded),
      outputExt,
      width: outMeta.width ?? width,
      height: outMeta.height ?? height,
      bytesBefore,
      bytesAfter: encoded.byteLength,
      ms: Date.now() - started,
      lossy: true,
      encoder: 'sharp',
      format: outputExt.slice(1)
    }
  } catch (error) {
    return {
      skipped: error instanceof Error ? error.message : '无法解码',
      bytesBefore,
      ms: Date.now() - started,
      lossy: true,
      encoder: 'sharp'
    }
  }
}

export function outputRelPath(fromRelPath: string, outputExt: string): string {
  const current = path.posix.extname(fromRelPath)
  if (!current) return `${fromRelPath}${outputExt}`
  if (current.toLowerCase() === outputExt) return fromRelPath
  return `${fromRelPath.slice(0, -current.length)}${outputExt}`
}
