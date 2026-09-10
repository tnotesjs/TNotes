/**
 * 只读画布场景的解析与缓存键。
 *
 * 不写任何文件：只读视图只把 JSON 解析成场景，导出结果只进内存缓存。
 */

export interface ExcalidrawScene {
  elements: unknown[]
  appState: Record<string, unknown>
  files: Record<string, unknown>
}

export type SceneParseResult = { ok: true; scene: ExcalidrawScene } | { ok: false; reason: string }

export function parseExcalidrawScene(content: string): SceneParseResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    return { ok: false, reason: '画布内容不是合法 JSON' }
  }
  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, reason: '画布内容不是场景对象' }
  }
  const candidate = parsed as Partial<ExcalidrawScene> & { type?: unknown }
  if (candidate.type !== 'excalidraw' || !Array.isArray(candidate.elements)) {
    return { ok: false, reason: '不是 Excalidraw 场景' }
  }
  return {
    ok: true,
    scene: {
      elements: candidate.elements,
      appState:
        candidate.appState && typeof candidate.appState === 'object'
          ? (candidate.appState as Record<string, unknown>)
          : {},
      files:
        candidate.files && typeof candidate.files === 'object'
          ? (candidate.files as Record<string, unknown>)
          : {}
    }
  }
}

/** FNV-1a：浏览器里不需要 node:crypto，仅用于内存缓存键。 */
export function sceneCacheKey(content: string, dark: boolean, engine: string): string {
  let hash = 0x811c9dc5
  for (let index = 0; index < content.length; index += 1) {
    hash ^= content.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return `${engine}:${dark ? 'dark' : 'light'}:${hash.toString(16)}:${content.length}`
}

/**
 * 有界内存缓存：画布越大缓存越值钱，但不能无上限。
 * 只存字符串，卸载后由组件负责释放 Blob/data URL。
 */
export class SvgCache {
  private readonly entries = new Map<string, string>()

  constructor(private readonly limit = 24) {}

  get(key: string): string | undefined {
    const value = this.entries.get(key)
    if (value === undefined) return undefined
    // 命中后移到末尾，实现 LRU 淘汰
    this.entries.delete(key)
    this.entries.set(key, value)
    return value
  }

  set(key: string, value: string): void {
    this.entries.delete(key)
    this.entries.set(key, value)
    while (this.entries.size > this.limit) {
      const oldest = this.entries.keys().next().value
      if (oldest === undefined) break
      this.entries.delete(oldest)
    }
  }

  clear(): void {
    this.entries.clear()
  }

  get size(): number {
    return this.entries.size
  }
}

/** 模块级共享缓存：同一篇笔记的多个入口（卡片/全屏）复用同一份导出结果。 */
export const svgCache = new SvgCache()
