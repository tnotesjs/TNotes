/**
 * 懒加载的导出适配：**唯一**静态引用 @excalidraw/excalidraw 的地方。
 * 宿主（Desk 卡片 / SSG 客户端）通过动态 import 使用它，避免把编辑器打进首屏。
 */
import { exportToSvg } from '@excalidraw/excalidraw'

import { getExcalidrawAssetPath, inlineExcalidrawFonts } from './fonts'

import type { ExcalidrawScene } from './scene'

export interface ExcalidrawExportOptions {
  /** 深色主题导出；只影响显示，不修改磁盘 appState */
  dark: boolean
  /** 导出背景；文档自身语义优先，默认沿用场景里的 viewBackgroundColor */
  background?: boolean
  /** 本地字体基址；缺省用 window.EXCALIDRAW_ASSET_PATH */
  fontBase?: string
  /** 便于测试注入 */
  fetchImpl?: typeof fetch
}

/**
 * 生成自包含的 SVG 字符串。实测官方导出会内嵌 @font-face 与内联图片 data URL，
 * 因此可以安全地作为 <img src="data:image/svg+xml…"> 渲染：没有脚本执行、
 * 没有外部网络请求。
 */
export async function renderExcalidrawSvg(
  scene: ExcalidrawScene,
  options: ExcalidrawExportOptions
): Promise<string> {
  const svg = await exportToSvg({
    elements: scene.elements as never,
    appState: {
      ...(scene.appState as Record<string, unknown>),
      exportWithDarkMode: options.dark,
      ...(options.background === undefined ? {} : { exportBackground: options.background })
    },
    files: (scene.files ?? {}) as never
  })
  // 只读路径必须自包含：把 CDN/相对字体换成 data URL，离线与 <img> 渲染才不掉字体
  const inlined = await inlineExcalidrawFonts(svg.outerHTML, {
    base: options.fontBase ?? getExcalidrawAssetPath(),
    fetchImpl: options.fetchImpl
  })
  if (inlined.remaining.length > 0) {
    // 不能静默：宿主据此提示「字体未内联，离线可能掉字体」
    console.warn('[tnotes] excalidraw fonts not inlined', inlined.remaining.slice(0, 3))
  }
  return inlined.svg
}
