/**
 * 源码视图只支持“整节点图片”，不支持把图片嵌进普通文字。
 * 空列表项会在原位变成图片；其它位置统一追加一个顶级图片节点，避免破坏树层级。
 */
export function insertImageIntoSource(
  markdown: string,
  selectionStart: number,
  selectionEnd: number,
  relativePath: string,
  alt = '截图',
): string {
  const image = `![${alt.replace(/\]/g, '').trim() || '截图'}](${relativePath})`
  const start = Math.max(0, Math.min(markdown.length, selectionStart))
  const end = Math.max(start, Math.min(markdown.length, selectionEnd))
  const lineStart = markdown.lastIndexOf('\n', start - 1) + 1
  const nextBreak = markdown.indexOf('\n', end)
  const lineEnd = nextBreak < 0 ? markdown.length : nextBreak
  const line = markdown.slice(lineStart, lineEnd)
  const list = /^(\s*[-*+]\s+)(.*)$/.exec(line)

  if (list) {
    const contentStart = lineStart + list[1].length
    const contentEnd = lineEnd
    const replacesWholeContent = start <= contentStart && end >= contentEnd
    if (list[2].trim() === '' || replacesWholeContent) {
      return `${markdown.slice(0, contentStart)}${image}${markdown.slice(contentEnd)}`
    }
  }

  const body = markdown.trimEnd()
  return `${body}${body ? '\n\n' : ''}- ${image}\n`
}
