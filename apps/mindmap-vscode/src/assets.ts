import path from 'node:path'

const MIME_EXTENSIONS: Readonly<Record<string, string>> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg'
}

export function extensionForMime(mime: string): string {
  return MIME_EXTENSIONS[mime.toLowerCase()] ?? 'png'
}

export function createAssetFileName(
  mime: string,
  now = new Date(),
  random = Math.random()
): string {
  const stamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z')
    .replace('T', '-')
  const suffix = Math.floor(random * 0xffffff)
    .toString(16)
    .padStart(6, '0')
  return `image-${stamp}-${suffix}.${extensionForMime(mime)}`
}

export function assetRelativePath(fileName: string): string {
  const safeName = path.posix.basename(fileName).replace(/[^-a-zA-Z0-9_.]/g, '-')
  return `assets/${safeName}`
}

export function referencedAssetPaths(markdown: string): string[] {
  const paths = new Set<string>()
  const pattern = /!\[[^\]]*\]\((assets\/[-a-zA-Z0-9_.]+)(?:\s+"[^"]*")?\)/g
  for (const match of markdown.matchAll(pattern)) paths.add(match[1])
  return [...paths]
}
