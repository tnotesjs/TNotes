function platformName(): string {
  if (typeof navigator === 'undefined') return ''
  const data = navigator as Navigator & { userAgentData?: { platform?: string } }
  return `${data.userAgentData?.platform ?? ''} ${navigator.platform ?? ''} ${navigator.userAgent ?? ''}`.toLowerCase()
}

export function isApplePlatform(): boolean {
  return /mac|iphone|ipad|ipod/.test(platformName())
}

export function primaryShortcut(key: string, options: { shift?: boolean } = {}): string {
  if (isApplePlatform()) return `${options.shift ? '⇧' : ''}⌘${key}`
  return `Ctrl+${options.shift ? 'Shift+' : ''}${key}`
}

export function altShortcut(key: string): string {
  return isApplePlatform() ? `⌥${key}` : `Alt+${key}`
}
