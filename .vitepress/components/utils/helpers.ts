/**
 * 格式化时间戳为 yyyy-mm-dd hh:mm:ss
 */
export function formatTimestamp(timestamp: number | undefined): string {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 构建 VS Code 打开链接
 */
export function buildVSCodeLink(
  tnotesDir: string,
  repoTitle: string,
  notePath?: string
): string {
  let path = `${tnotesDir}/TNotes.${repoTitle}`

  if (notePath) {
    const cleanPath = notePath
      .replace('https://tnotesjs.github.io/', '')
      .replace('/README', '')
    path = `${tnotesDir}/${cleanPath}`
  }

  return `vscode://file/${path}`
}

/**
 * 构建 GitHub 仓库链接
 */
export function buildGitHubLink(repoTitle: string): string {
  return `https://github.com/tnotesjs/TNotes.${repoTitle}`
}
