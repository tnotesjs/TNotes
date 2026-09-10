import { pasteDisplayWidthPx, serializeImageMarkdown } from '@tnotesjs/ui/image-markdown'

export async function readImageNaturalWidth(file: File): Promise<number> {
  const createBitmap = globalThis.createImageBitmap
  if (typeof createBitmap === 'function') {
    try {
      const bitmap = await createBitmap(file)
      const width = bitmap.width
      bitmap.close()
      if (width > 0) return width
    } catch {
      // Fall through to HTMLImageElement for formats createImageBitmap rejects.
    }
  }
  const url = URL.createObjectURL(file)
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image.naturalWidth)
      image.onerror = () => reject(new Error('Failed to read image size'))
      image.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function resolvePastedImageWidth(
  file: File,
  devicePixelRatio = globalThis.devicePixelRatio || 1
): Promise<string> {
  try {
    return pasteDisplayWidthPx(await readImageNaturalWidth(file), devicePixelRatio)
  } catch {
    return ''
  }
}

export async function pastedImageMarkdown(file: File, src: string): Promise<string> {
  return serializeImageMarkdown({
    alt: '',
    src,
    width: await resolvePastedImageWidth(file)
  })
}
