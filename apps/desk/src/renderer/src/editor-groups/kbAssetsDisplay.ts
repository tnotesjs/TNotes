// 资源面板的展示辅助：标签、体积、缩略图 URL 与「能不能安全预览」的判定。
// 抽成独立模块，列表、网格与详情区共用同一套判断，避免三处各写一份。

import type { AssetRecordDto } from '../../../shared/contracts'

export function formatBytes(value: number): string {
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

export function statusLabel(status: string): string {
  if (status === 'referenced') return '已引用'
  if (status === 'idle-candidate') return '疑似闲置'
  if (status === 'uncertain-idle') return '闲置未确定'
  if (status === 'uncertain-affected') return '不确定影响'
  if (status === 'protected') return '受保护'
  return status
}

export function kindLabel(kind: string): string {
  if (kind === 'image') return '图片'
  if (kind === 'svg') return 'SVG'
  if (kind === 'gif') return 'GIF'
  if (kind === 'excalidraw') return 'Excalidraw'
  if (kind === 'html') return 'HTML'
  if (kind === 'css') return 'CSS'
  return '其他'
}

/** 非图片资源的占位标记：一个汉字或字母，够区分类型即可。 */
export function kindBadge(kind: string): string {
  return kindLabel(kind).slice(0, 1)
}

export function protectionLabel(reason: string): string {
  if (reason === 'kb-icon') return '知识库图标'
  if (reason === 'symlink-escape') return '符号链接越界'
  if (reason === 'excalidraw-source') return '自由绘图真相源，不可清理；派生产物不能覆盖它'
  return reason
}

/** 列表缩略图沿用既有判断：只认浏览器能直接解码的位图。 */
export function canPreviewThumb(asset: AssetRecordDto): boolean {
  return asset.kind === 'image' || asset.kind === 'gif'
}

/**
 * 详情与网格用 `<img>` 预览。SVG 也走同一受限 URL —— 作为图片加载不会执行脚本，
 * 绝不把 SVG / HTML 内联注入成 DOM。
 */
export function canPreviewAsset(asset: AssetRecordDto): boolean {
  return canPreviewThumb(asset) || asset.kind === 'svg'
}

/** 受限资源 URL；`v` 用于写入后让缓存失效（沿用既有约定）。 */
export function assetThumbSrc(knowledgeBaseId: string, relPath: string, revision: number): string {
  const params = new URLSearchParams({
    knowledgeBaseId,
    path: relPath,
    v: String(revision)
  })
  return `tnotes-asset://asset?${params.toString()}`
}
