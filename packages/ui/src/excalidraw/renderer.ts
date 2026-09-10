/**
 * 只读画布渲染器的纯逻辑：与 Vue 组件解耦，便于单测。
 *
 * 职责：解析场景 → 命中缓存或懒加载导出 → 产出可直接给 <img> 的 data URL。
 * 不做文件写入；过期结果一律丢弃；释放时清空 data URL。
 */
import { ref, type Ref } from 'vue'

import { parseExcalidrawScene, sceneCacheKey, svgCache, type SvgCache } from './scene'

export type ExcalidrawViewState = 'idle' | 'loading' | 'ready' | 'error'

export interface ExcalidrawSvgRenderer {
  state: Ref<ExcalidrawViewState>
  errorReason: Ref<string>
  dataUrl: Ref<string>
  render(): Promise<void>
  dispose(): void
}

export interface ExcalidrawSvgRendererOptions {
  getContent: () => string
  /** undefined 表示跟随宿主（由组件解析 .dark 后回传） */
  getTheme: () => 'light' | 'dark'
  /** 引擎版本进缓存键：升级 Excalidraw 后旧缓存自动失效 */
  engine?: string
  cache?: SvgCache
  /** 便于测试注入；默认动态 import 真实导出器 */
  loadExporter?: () => Promise<{
    renderExcalidrawSvg: (scene: unknown, options: { dark: boolean }) => Promise<string>
  }>
}

export function toSvgDataUrl(svg: string): string {
  // encodeURIComponent：中文文本与特殊字符在 data URL 里都安全
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export function createExcalidrawSvgRenderer(
  options: ExcalidrawSvgRendererOptions
): ExcalidrawSvgRenderer {
  const state = ref<ExcalidrawViewState>('idle')
  const errorReason = ref('')
  const dataUrl = ref('')
  const cache = options.cache ?? svgCache
  const engine = options.engine ?? 'excalidraw-0.18.1'
  const loadExporter = options.loadExporter ?? (() => import('./exporter') as Promise<never>)
  let generation = 0
  let disposed = false

  function fail(reason: string): void {
    state.value = 'error'
    errorReason.value = reason
    dataUrl.value = ''
  }

  async function render(): Promise<void> {
    if (disposed) return
    const current = (generation += 1)
    const content = options.getContent()
    const dark = options.getTheme() === 'dark'

    const parsed = parseExcalidrawScene(content)
    if (!parsed.ok) {
      fail(parsed.reason)
      return
    }
    if (parsed.scene.elements.length === 0) {
      fail('空画布')
      return
    }

    const key = sceneCacheKey(content, dark, engine)
    const cached = cache.get(key)
    if (cached !== undefined) {
      dataUrl.value = toSvgDataUrl(cached)
      errorReason.value = ''
      state.value = 'ready'
      return
    }

    state.value = 'loading'
    try {
      const exporter = await loadExporter()
      const svg = await exporter.renderExcalidrawSvg(parsed.scene, { dark })
      if (disposed || current !== generation) return // 过期结果：内容或主题已更新
      cache.set(key, svg)
      dataUrl.value = toSvgDataUrl(svg)
      errorReason.value = ''
      state.value = 'ready'
    } catch (error) {
      if (disposed || current !== generation) return
      fail(error instanceof Error ? error.message : String(error))
    }
  }

  function dispose(): void {
    disposed = true
    generation += 1
    dataUrl.value = ''
    state.value = 'idle'
  }

  return { state, errorReason, dataUrl, render, dispose }
}
