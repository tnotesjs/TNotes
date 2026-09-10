import type { ClosingResource } from './closeTabs'

/**
 * 画布标签页的关闭资源。
 *
 * 画布没有保存按钮：内容变化后由 E3 会话自动写盘。因此关闭 / 退出时不做
 * "存不存" 的提问，而是先把待写入内容 flush 掉；只有写入真的失败（或磁盘
 * 冲突）才让用户选择重试（保存）或丢弃本地修改。会话状态由 pane 持有，
 * 这里只做按 tabId 的注册表，避免 store 直接依赖 Vue 组件内部状态。
 */
const registry = new Map<string, ClosingResource>()

export function registerExcalidrawCloseHandler(tabId: string, entry: ClosingResource): void {
  registry.set(tabId, entry)
}

export function unregisterExcalidrawCloseHandler(tabId: string): void {
  registry.delete(tabId)
}

export function excalidrawCloseResource(tabId: string): ClosingResource | null {
  return registry.get(tabId) ?? null
}
