/**
 * Lossy image encode via sharp. Lives in Desk, not @tnotesjs/kb.
 * Speed and output size are the product goals; results are never labeled lossless.
 */

import path from 'node:path'

import sharp from 'sharp'

export type AssetOptimizeOutputFormat = 'keep' | 'webp' | 'jpeg'

export interface EncodeImageOptions {
  quality: number
  maxDimension: number | null
  outputFormat: AssetOptimizeOutputFormat
  jpegBackground?: string
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
  lossy: true
  encoder: 'sharp'
  format?: string
}

const SKIP_EXT = new Set(['.gif', '.svg', '.excalidraw', '.html', '.htm', '.css', '.js', '.ts'])

function clampQuality(value: number): number {
  if (!Number.isFinite(value)) return 80
  return Math.min(100, Math.max(40, Math.round(value)))
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

export async function encodeImage(
  input: Uint8Array,
  fileName: string,
  options: EncodeImageOptions
): Promise<EncodeImageResult> {
  const started = Date.now()
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
