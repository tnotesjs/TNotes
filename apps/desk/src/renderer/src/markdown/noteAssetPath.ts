/**
 * 笔记内相对资源路径 → 知识库相对路径。
 *
 * 笔记正文里的引用是相对笔记目录的（`../assets/x.excalidraw`、`./assets/x.png`），
 * 而画布 IPC 只接受知识库相对路径（`assets/x.excalidraw`，且限制在 assets/ 下）。
 * 这里做纯字符串解析，越界或不落在 assets/ 下一律返回 null。
 */

/** 归一化 posix 相对路径；`..` 越出根时返回 null。 */
export function normalizePosixRelative(value: string): string | null {
  const segments: string[] = []
  for (const segment of value.replaceAll('\\', '/').split('/')) {
    if (!segment || segment === '.') continue
    if (segment === '..') {
      if (segments.length === 0) return null
      segments.pop()
      continue
    }
    segments.push(segment)
  }
  return segments.join('/')
}

/**
 * `noteRelPath` 是笔记的知识库相对路径（`notes/0004. 边界/0004. x.md`），
 * `source` 是组件里的原始引用。结果必须落在 `assets/` 下。
 */
export function resolveNoteAssetRelPath(noteRelPath: string, source: string): string | null {
  if (!noteRelPath || !source) return null
  if (/^[a-z][a-z\d+.-]*:/i.test(source) || source.startsWith('//') || source.startsWith('#')) {
    return null
  }
  const clean = source.split(/[?#]/, 1)[0] ?? ''
  if (!clean) return null
  const noteDir = noteRelPath.split('/').slice(0, -1).join('/')
  const joined = noteDir ? `${noteDir}/${clean}` : clean
  const normalized = normalizePosixRelative(joined)
  if (!normalized) return null
  return normalized.startsWith('assets/') ? normalized : null
}

/**
 * 反向：知识库相对路径 → 笔记相对引用（插入组件时用）。
 *
 * `notesDir` 表示笔记所在目录（空字符串表示笔记就在库根）。
 */
export function noteRelativeAssetPath(noteRelPath: string, assetRelPath: string): string | null {
  if (!noteRelPath || !assetRelPath) return null
  const noteDir = noteRelPath.split('/').slice(0, -1)
  const assetSegments = assetRelPath.split('/').filter(Boolean)
  if (assetSegments.length === 0) return null
  let common = 0
  while (
    common < noteDir.length &&
    common < assetSegments.length - 1 &&
    noteDir[common] === assetSegments[common]
  ) {
    common += 1
  }
  const up = noteDir.length - common
  const prefix = up > 0 ? '../'.repeat(up) : './'
  return `${prefix}${assetSegments.slice(common).join('/')}`
}
