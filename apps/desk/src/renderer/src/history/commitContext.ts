/**
 * 历史提交上下文（计划 H2）。
 *
 * 历史预览里的每一个本地资源都必须能回答「哪个 KB、哪个 commit、哪个 blob OID」，
 * 缓存键用 blob OID 而不是当前路径；任何拿不到 commit 上下文的引用一律不加载，
 * 绝不回退到当前磁盘 resolver（`tnotes-asset://asset`）。
 */

const RESOURCE_SCHEME = /^[a-z][a-z\d+.-]*:/i
const SAFE_RASTER_DATA = /^data:image\/(?:avif|bmp|gif|jpeg|png|webp);base64,[a-z\d+/\s]*={0,2}$/i

export interface HistoryCommitContext {
  knowledgeBaseId: string
  commit: string
  /** 该 commit 下这篇笔记的路径；相对引用都相对它解析 */
  noteRelPath: string
  /** 该 commit 快照允许读取的路径 → blob OID */
  allowedPaths: ReadonlyMap<string, string>
}

export interface HistoryCommitContextInput {
  knowledgeBaseId: string
  commit: string
  noteRelPath: string
  /** 快照里的条目，用于白名单与 OID 缓存键 */
  entries: Array<{ relPath: string; oid: string }>
}

export type HistoryResource =
  | { kind: 'inline'; url: string; cacheKey: string }
  | { kind: 'local'; relPath: string; oid: string; url: string; cacheKey: string; source: string }
  | { kind: 'remote'; source: string; reason: string }
  | { kind: 'unsupported'; source: string; reason: string }
  | { kind: 'missing'; source: string; reason: string }

export function createHistoryCommitContext(input: HistoryCommitContextInput): HistoryCommitContext {
  const allowedPaths = new Map<string, string>()
  for (const entry of input.entries) allowedPaths.set(entry.relPath, entry.oid)
  return {
    knowledgeBaseId: input.knowledgeBaseId,
    commit: input.commit,
    noteRelPath: input.noteRelPath,
    allowedPaths
  }
}

/** 缓存键必须含 commit 与 blob OID：改名/当前文件变化都不影响命中。 */
export function historyCacheKey(commit: string, oid: string): string {
  return `${commit}:${oid}`
}

export function historyAssetUrl(
  context: Pick<HistoryCommitContext, 'knowledgeBaseId' | 'commit'>,
  relPath: string
): string {
  const params = new URLSearchParams({
    knowledgeBaseId: context.knowledgeBaseId,
    commit: context.commit,
    path: relPath
  })
  return `tnotes-asset://history?${params.toString()}`
}

/** 归一化 posix 相对路径；`..` 越出根时返回 null。 */
export function normalizeHistoryRelative(value: string): string | null {
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
 * Markdown 解析器会把链接/图片目标做 URL 归一化（空格、中文变成 `%20`/百分号编码，
 * `<...>` 目标去掉尖括号），所以查快照白名单前要先解码一次。
 */
export function decodeHistoryPath(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/** 笔记内相对引用 → 知识库相对路径（不限制目录，历史里可能存在任意目录的资源）。 */
export function resolveHistoryRelPath(noteRelPath: string, source: string): string | null {
  const clean = decodeHistoryPath(source.split(/[?#]/, 1)[0] ?? '').trim()
  if (!clean) return null
  const noteDir = noteRelPath.split('/').slice(0, -1).join('/')
  const joined = noteDir ? `${noteDir}/${clean}` : clean
  return normalizeHistoryRelative(joined)
}

/**
 * 解析历史预览里的一个引用。
 *
 * - 本地相对路径：必须在该 commit 的白名单里，否则报缺失（不回退当前磁盘）
 * - `https://`：远程是「当前网络内容」，标记而不是假装归档
 * - `data:`：只放行安全的位图内联
 * - 其它 scheme / 协议相对 / `#` 锚点：不支持
 */
export function resolveHistoryResource(
  context: HistoryCommitContext,
  source: string
): HistoryResource {
  if (!source) {
    return { kind: 'unsupported', source, reason: '空引用' }
  }
  if (source.startsWith('https://')) {
    return {
      kind: 'remote',
      source,
      reason: '远程内容来自当前网络，历史版本无法保证重现'
    }
  }
  if (source.startsWith('data:')) {
    if (SAFE_RASTER_DATA.test(source)) {
      return { kind: 'inline', url: source, cacheKey: 'inline' }
    }
    return { kind: 'unsupported', source, reason: '只放行位图 data URL' }
  }
  if (RESOURCE_SCHEME.test(source) || source.startsWith('//') || source.startsWith('#')) {
    return { kind: 'unsupported', source, reason: '历史预览不加载该协议或锚点引用' }
  }
  const relPath = resolveHistoryRelPath(context.noteRelPath, source)
  if (!relPath) {
    return { kind: 'unsupported', source, reason: '引用越出知识库范围' }
  }
  const oid = context.allowedPaths.get(relPath)
  if (!oid) {
    return {
      kind: 'missing',
      source,
      reason: `该提交里没有 ${relPath}`
    }
  }
  return {
    kind: 'local',
    source,
    relPath,
    oid,
    cacheKey: historyCacheKey(context.commit, oid),
    url: historyAssetUrl(context, relPath)
  }
}
