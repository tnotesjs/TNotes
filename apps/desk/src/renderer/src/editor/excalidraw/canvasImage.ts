/**
 * 笔记里的「画布图片」。
 *
 * 模型：`.excalidraw` 是真相源，笔记里引用的是一张**同名派生的 `.svg`**
 * （`0013-x.excalidraw` ↔ `0013-x.svg`）。这张图完全按普通图片处理（拖拽改尺寸、
 * 描述、对齐，都走 `deskImageView`），只有三处不同：
 *
 * 1. 不走压缩（`.svg` 本来就在资源压缩的跳过名单里）
 * 2. 悬浮工具条多一项「编辑」→ 打开该画布的标签页
 * 3. 标签页开着时，图上的 src 换成内存里导出的 data URL（实时），并居中显示一支笔
 *
 * 判据只有一条：**同名 `.excalidraw` 在 → 可编辑；不在 → 就是一张普通图片**（主进程探测）。
 *
 * 后缀常量在渲染端本地声明：`@tnotesjs/kb` 是主进程的 Node 包，渲染端不引它。
 * 规则本身（同目录同名、只换后缀）必须与 `packages/kb/src/excalidraw.ts` 保持一致。
 */
import { currentExcalidrawContent, subscribeExcalidrawContent } from './sessionRegistry'

const EXCALIDRAW_EXTENSION = '.excalidraw'
const EXCALIDRAW_DERIVED_EXTENSION = '.svg'

/** 新建画布的占位图：先让笔记里有东西，第一次编辑后就被真图替换 */
export function placeholderCanvasSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="300" viewBox="0 0 480 300" role="img" aria-label="画布">
  <rect x="1" y="1" width="478" height="298" rx="12" fill="none" stroke="#adb5bd" stroke-width="1.5" stroke-dasharray="7 7"/>
  <g transform="translate(240 130)" fill="none" stroke="#868e96" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="-78" y="-24" width="48" height="48" rx="9"/>
    <path d="M0 -24 L24 0 L0 24 L-24 0 Z"/>
    <circle cx="78" cy="0" r="24"/>
  </g>
  <text x="240" y="212" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="15" fill="#868e96">画布</text>
</svg>
`
}

/** 源画布路径 → 派生 SVG 路径（与 kb 层同一规则） */
export function derivedSvgRelPath(sourceRelPath: string): string {
  const normalized = sourceRelPath.replaceAll('\\', '/')
  return `${normalized.slice(0, -EXCALIDRAW_EXTENSION.length)}${EXCALIDRAW_DERIVED_EXTENSION}`
}

/** 笔记里引用的 `.svg` 路径 → 同名源画布路径（不看文件在不在） */
export function sourceRelPathForDerived(derivedRelPath: string): string {
  const normalized = derivedRelPath.replaceAll('\\', '/')
  return `${normalized.slice(0, -EXCALIDRAW_DERIVED_EXTENSION.length)}${EXCALIDRAW_EXTENSION}`
}

/**
 * 「这张 `.svg` 能不能编辑」的主进程探测结果缓存。
 *
 * 图片视图每次渲染都要问一次，但文件在不在是低频变化；缓存 30s，命中后同步返回，
 * 避免每张图都走一趟 IPC。
 */
const PROBE_TTL_MS = 30_000
const probeCache = new Map<string, { at: number; source: string | null }>()

function probeKey(knowledgeBaseId: string, svgRelPath: string): string {
  return `${knowledgeBaseId}\u0000${svgRelPath}`
}

/** 同步读缓存（命中即用，未命中返回 undefined 表示需要异步探测） */
export function cachedCanvasSource(
  knowledgeBaseId: string,
  svgRelPath: string
): string | null | undefined {
  const hit = probeCache.get(probeKey(knowledgeBaseId, svgRelPath))
  if (!hit) return undefined
  if (Date.now() - hit.at > PROBE_TTL_MS) {
    probeCache.delete(probeKey(knowledgeBaseId, svgRelPath))
    return undefined
  }
  return hit.source
}

/** 探测同名源画布；null = 普通图片 */
export async function probeCanvasSource(
  knowledgeBaseId: string,
  svgRelPath: string
): Promise<string | null> {
  const key = probeKey(knowledgeBaseId, svgRelPath)
  const cached = cachedCanvasSource(knowledgeBaseId, svgRelPath)
  if (cached !== undefined) return cached
  const result = await window.desk.excalidraw.sourceForDerived({
    knowledgeBaseId,
    relPath: svgRelPath
  })
  const source = result.ok ? (result.value.source?.relPath ?? null) : null
  probeCache.set(key, { at: Date.now(), source })
  return source
}

/** 主动失效（新建/删除画布后调用） */
export function invalidateCanvasSource(knowledgeBaseId: string, svgRelPath?: string): void {
  if (svgRelPath) {
    probeCache.delete(probeKey(knowledgeBaseId, svgRelPath))
    return
  }
  for (const key of [...probeCache.keys()]) {
    if (key.startsWith(`${knowledgeBaseId}\u0000`)) probeCache.delete(key)
  }
}

/**
 * 导出画布为自包含 SVG（与右键导出同一条官方路径），并写入同名派生文件。
 *
 * 导出能力动态引入：不打开画布就不加载 Excalidraw。
 */
export async function exportCanvasSvg(content: string): Promise<string> {
  const entry = await import('@tnotesjs/ui/excalidraw-view')
  const parsed = entry.parseExcalidrawScene(content)
  if (!parsed.ok) throw new Error(parsed.reason)
  if (parsed.scene.elements.length === 0) throw new Error('空画布')
  const { renderExcalidrawSvg } = await entry.loadExcalidrawExporter()
  // 派生图固定浅色：深色宿主用 CSS 反色（与 Excalidraw 自己的深色做法一致）
  return await renderExcalidrawSvg(parsed.scene, { dark: false })
}

/** 实时预览节流：编辑期间图要跟着变，但不必每帧导出一次 */
const PREVIEW_THROTTLE_MS = 220
/** 落盘节流：比画布自身的写入（200ms 防抖 / 1s 上限）更慢，避免写盘风暴 */
const WRITE_DEBOUNCE_MS = 1200

interface DerivedSync {
  knowledgeBaseId: string
  sourceRelPath: string
  listeners: Set<(dataUrl: string) => void>
  /** 最近一次成功导出的 SVG 与 data URL */
  svg: string | null
  dataUrl: string
  /** 最近一次拿到的内存场景（还没导出） */
  pendingContent: string
  exportTimer: number | null
  writeTimer: number | null
  refs: number
  unsubscribe: (() => void) | null
  exporting: boolean
  lastError: string
  revision: number
}

const syncs = new Map<string, DerivedSync>()
/** 空闲条目上限：留着是为了「版本号 + 最近一张图」不被过早丢掉，但也不能无限涨 */
const MAX_IDLE_SYNCS = 8

function trimIdleSyncs(): void {
  for (const [key, sync] of syncs) {
    if (syncs.size <= MAX_IDLE_SYNCS) return
    if (sync.listeners.size === 0 && sync.refs === 0) syncs.delete(key)
  }
}

const syncKey = (knowledgeBaseId: string, sourceRelPath: string): string =>
  `${knowledgeBaseId}\u0000${sourceRelPath}`

function getSync(knowledgeBaseId: string, sourceRelPath: string): DerivedSync {
  const key = syncKey(knowledgeBaseId, sourceRelPath)
  const existing = syncs.get(key)
  if (existing) return existing
  const created: DerivedSync = {
    knowledgeBaseId,
    sourceRelPath,
    listeners: new Set(),
    svg: null,
    dataUrl: '',
    pendingContent: '',
    exportTimer: null,
    writeTimer: null,
    refs: 0,
    unsubscribe: null,
    exporting: false,
    lastError: '',
    revision: 0
  }
  syncs.set(key, created)
  return created
}

function notifyPreview(sync: DerivedSync): void {
  for (const listener of [...sync.listeners]) listener(sync.dataUrl)
}

/** 导出一次并广播；写盘单独节流 */
async function exportOnce(sync: DerivedSync): Promise<void> {
  if (sync.exporting) return
  const content = sync.pendingContent
  if (!content) return
  sync.exporting = true
  try {
    const svg = await exportCanvasSvg(content)
    if (svg === sync.svg) return
    sync.svg = svg
    sync.dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    sync.lastError = ''
    notifyPreview(sync)
    scheduleWrite(sync)
  } catch (error) {
    // 空画布是正常状态（占位图继续显示），其余只记录：笔记里那张图不能因此变空
    const message = error instanceof Error ? error.message : String(error)
    if (message !== '空画布') {
      sync.lastError = message
      console.warn('[tnotes] 画布派生 SVG 导出失败', message)
    }
  } finally {
    sync.exporting = false
  }
}

function scheduleExport(sync: DerivedSync, delay = PREVIEW_THROTTLE_MS): void {
  if (sync.exportTimer != null) window.clearTimeout(sync.exportTimer)
  sync.exportTimer = window.setTimeout(() => {
    sync.exportTimer = null
    void exportOnce(sync)
  }, delay)
}

function scheduleWrite(sync: DerivedSync): void {
  if (sync.writeTimer != null) window.clearTimeout(sync.writeTimer)
  sync.writeTimer = window.setTimeout(() => {
    sync.writeTimer = null
    void flushWrite(sync)
  }, WRITE_DEBOUNCE_MS)
}

/** 把最近一次导出写进同名 `.svg`（失败只记录：占位图继续显示，下次再写） */
async function flushWrite(sync: DerivedSync): Promise<void> {
  const svg = sync.svg
  if (!svg) return
  const result = await window.desk.excalidraw.writeDerived({
    knowledgeBaseId: sync.knowledgeBaseId,
    sourceRelPath: sync.sourceRelPath,
    content: svg
  })
  if (result.ok) {
    // 版本号 +1：笔记里那张图的 URL 会带上它，绕过同 URL 的内存缓存
    sync.revision += 1
    return
  }
  sync.lastError = result.error.message
  console.warn('[tnotes] 画布派生 SVG 写盘失败', result.error.message)
}

/** 同步完成后再读一次最新内容，避免"停手后最后一笔没进去" */
async function flushPending(sync: DerivedSync): Promise<void> {
  if (sync.exportTimer != null) {
    window.clearTimeout(sync.exportTimer)
    sync.exportTimer = null
  }
  if (sync.writeTimer != null) {
    window.clearTimeout(sync.writeTimer)
    sync.writeTimer = null
  }
  await exportOnce(sync)
  await flushWrite(sync)
}

/**
 * 开始跟随某个打开中的画布：内容一变就重导出（节流），并节流写回同名 `.svg`。
 *
 * 由画布标签页在挂载/卸载时成对调用；引用计数保证多个入口不会重复订阅。
 */
export function startCanvasDerivedSync(knowledgeBaseId: string, sourceRelPath: string): () => void {
  const sync = getSync(knowledgeBaseId, sourceRelPath)
  sync.refs += 1
  if (sync.refs === 1) {
    const initial = currentExcalidrawContent(knowledgeBaseId, sourceRelPath)
    if (initial) {
      sync.pendingContent = initial
      scheduleExport(sync, 0)
    }
    sync.unsubscribe = subscribeExcalidrawContent(
      knowledgeBaseId,
      sourceRelPath,
      (content: string) => {
        sync.pendingContent = content
        scheduleExport(sync)
      }
    )
  }
  let stopped = false
  return () => {
    if (stopped) return
    stopped = true
    sync.refs -= 1
    if (sync.refs > 0) return
    sync.unsubscribe?.()
    sync.unsubscribe = null
    // 关闭前把最后一笔落盘：否则笔记里的图会停在上一版
    void flushPending(sync).then(() => trimIdleSyncs())
  }
}

/** 订阅该画布最近一次导出的 data URL（画布没打开时立刻回空串） */
export function subscribeCanvasPreview(
  knowledgeBaseId: string,
  sourceRelPath: string,
  listener: (dataUrl: string) => void
): () => void {
  const sync = getSync(knowledgeBaseId, sourceRelPath)
  sync.listeners.add(listener)
  listener(sync.dataUrl)
  return () => {
    sync.listeners.delete(listener)
    trimIdleSyncs()
  }
}

/** 最近一次导出的 data URL（画布没打开/还没导出时为空串） */
export function latestCanvasPreview(knowledgeBaseId: string, sourceRelPath: string): string {
  return syncs.get(syncKey(knowledgeBaseId, sourceRelPath))?.dataUrl ?? ''
}

/**
 * 派生文件的缓存版本号：写盘成功后 +1，笔记里那张图的 URL 带上它就能绕过
 * Chromium 对同一 URL 的内存缓存（`.svg` 是原地覆写的）。
 */
export function canvasAssetRevision(knowledgeBaseId: string, sourceRelPath: string): number {
  return syncs.get(syncKey(knowledgeBaseId, sourceRelPath))?.revision ?? 0
}
