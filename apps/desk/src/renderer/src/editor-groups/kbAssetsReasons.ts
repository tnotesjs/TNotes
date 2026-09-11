export type AssetWriteBlockCategory = 'coverage' | 'dirty' | 'stale-plan' | 'incomplete' | 'other'

export const ASSET_WRITE_BLOCK_LABELS: Record<AssetWriteBlockCategory, string> = {
  coverage: '仍需适配来源',
  dirty: '有未保存文档',
  'stale-plan': '计划过期',
  incomplete: '事务待恢复',
  other: '无法执行'
}

const GATE_CODES: Record<string, AssetWriteBlockCategory> = {
  'dirty-document': 'dirty',
  'pending-recovery': 'dirty',
  'save-in-flight': 'dirty',
  'attachment-in-flight': 'dirty',
  'window-unresponsive': 'dirty',
  'kb-settings-dirty': 'dirty',
  'pending-edits': 'dirty',
  'incomplete-journal': 'incomplete',
  'write-locked': 'incomplete',
  'needs-recovery': 'incomplete'
}

export interface ClassifiedAssetWriteBlock {
  category: AssetWriteBlockCategory
  label: string
  message: string
}

export function classifyAssetWriteMessage(message: string, code?: string): AssetWriteBlockCategory {
  if (code === 'REVISION_CONFLICT') return 'stale-plan'
  if (code && GATE_CODES[code]) return GATE_CODES[code]
  const text = message
  if (/计划已过期|引用来源已增减|扫描覆盖已变化|备份时文件已改变|回收备份时文件已改变/.test(text)) {
    return 'stale-plan'
  }
  if (/未完成的资源事务|事务待恢复|journal/.test(text)) return 'incomplete'
  if (
    /未保存|待恢复草稿|正在保存|正在写入本地附件|窗口未响应|块内编辑|知识库设置有未保存/.test(text)
  ) {
    return 'dirty'
  }
  if (
    /扫描覆盖未完成|未知引用|覆盖未完成|未知来源|不可改写|不确定的引用|整库禁用批量清理|无法证明未知来源/.test(
      text
    )
  ) {
    return 'coverage'
  }
  return 'other'
}

export function classifyAssetWriteBlocks(input: {
  planReasons?: string[]
  error?: { code?: string; message: string; details?: Record<string, unknown> } | null
}): ClassifiedAssetWriteBlock[] {
  const items: ClassifiedAssetWriteBlock[] = []
  const seen = new Set<string>()
  const push = (message: string, code?: string): void => {
    const trimmed = message.trim()
    if (!trimmed || seen.has(trimmed)) return
    seen.add(trimmed)
    const category = classifyAssetWriteMessage(trimmed, code)
    items.push({
      category,
      label: ASSET_WRITE_BLOCK_LABELS[category],
      message: trimmed
    })
  }

  for (const reason of input.planReasons ?? []) push(reason)

  const error = input.error
  if (!error) return items
  const blocked = error.details?.blockedReasons
  if (Array.isArray(blocked) && blocked.length > 0) {
    for (const reason of blocked) {
      if (typeof reason === 'string') {
        push(reason, error.code)
        continue
      }
      if (reason && typeof reason === 'object') {
        const rec = reason as { message?: unknown; code?: unknown }
        if (typeof rec.message === 'string') {
          push(rec.message, typeof rec.code === 'string' ? rec.code : error.code)
        }
      }
    }
    return items
  }
  push(error.message, error.code)
  return items
}

/**
 * 为什么这个资源不能重命名。
 *
 * 面板必须把入口真的禁掉并说清原因：`.excalidraw` 是绘图真相源（文件名由归属编号
 * 决定），资源面板不提供改名；让用户填完表单再被拒绝是很差的体验。
 */
export function renameBlockCode(asset: {
  renameAllowed: boolean
  protection: string[]
}): 'none' | 'excalidraw-source' | 'kb-icon' | 'symlink-escape' | 'coverage' {
  if (asset.renameAllowed) return 'none'
  if (asset.protection.includes('excalidraw-source')) return 'excalidraw-source'
  if (asset.protection.includes('kb-icon')) return 'kb-icon'
  if (asset.protection.includes('symlink-escape')) return 'symlink-escape'
  return 'coverage'
}

export function renameBlockReason(code: ReturnType<typeof renameBlockCode>): string {
  switch (code) {
    case 'excalidraw-source':
      return '画布文件名由归属编号决定（改名会让引用与归属失配），资源面板不提供重命名'
    case 'kb-icon':
      return '知识库图标文件名固定，不能重命名'
    case 'symlink-escape':
      return '该文件是指向库外的符号链接，不能重命名'
    case 'coverage':
      return '存在未知引用或扫描覆盖未完成，无法证明改名不会破坏引用'
    default:
      return ''
  }
}
