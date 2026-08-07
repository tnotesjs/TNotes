export type LocalIdeId = 'vscode' | 'cursor'

export const DEFAULT_LOCAL_IDE: LocalIdeId = 'vscode'

export const LOCAL_IDE_STORAGE_KEY = 'knowledge-navigator-local-ide'

const IDE_SCHEMES: Record<LocalIdeId, string> = {
  vscode: 'vscode',
  cursor: 'cursor',
}

export function normalizeLocalIde(
  value: string | null | undefined,
): LocalIdeId {
  return value === 'cursor' ? 'cursor' : DEFAULT_LOCAL_IDE
}

export function toIdeFileUrl(
  filePath: string,
  ide: LocalIdeId = DEFAULT_LOCAL_IDE,
): string {
  const scheme = IDE_SCHEMES[normalizeLocalIde(ide)]
  return `${scheme}://file/${filePath}`
}

/**
 * 构建本地 IDE 打开链接（VS Code / Cursor）
 */
export function buildIdeLink(
  tnotesDir: string,
  repoTitle: string,
  notePath?: string,
  ide: LocalIdeId = DEFAULT_LOCAL_IDE,
): string {
  let path = `${tnotesDir}/TNotes.${repoTitle}`

  if (notePath) {
    const cleanPath = notePath
      .replace('https://tnotesjs.github.io/', '')
      .replace('/README', '')
    path = `${tnotesDir}/${cleanPath}`
  }

  return toIdeFileUrl(path, ide)
}

/**
 * @deprecated 使用 buildIdeLink(..., 'vscode')
 */
export function buildVSCodeLink(
  tnotesDir: string,
  repoTitle: string,
  notePath?: string,
): string {
  return buildIdeLink(tnotesDir, repoTitle, notePath, 'vscode')
}

/**
 * 构建 GitHub 仓库链接
 */
export function buildGitHubLink(repoTitle: string): string {
  return `https://github.com/tnotesjs/TNotes.${repoTitle}`
}
