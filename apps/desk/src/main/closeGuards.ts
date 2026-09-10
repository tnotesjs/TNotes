import type { BrowserWindow } from 'electron'

import { CloseGuard } from './closeGuard'

/**
 * 关窗 / 退出的协调器登记处：主进程 index.ts 负责创建，IPC 层在收到渲染端回执时
 * 按窗口找到对应的 guard。
 */
const windowGuards = new Map<BrowserWindow, CloseGuard>()
let quitGuard: CloseGuard | null = null

export function registerWindowGuard(window: BrowserWindow, guard: CloseGuard): void {
  windowGuards.set(window, guard)
}

export function unregisterWindowGuard(window: BrowserWindow): void {
  windowGuards.delete(window)
}

export function getWindowGuard(window: BrowserWindow): CloseGuard | undefined {
  return windowGuards.get(window)
}

/** 退出流程复用同一个 guard，避免重复询问 */
export function ensureQuitGuard(create: () => CloseGuard): CloseGuard {
  quitGuard ??= create()
  return quitGuard
}

/** 渲染端回执：proceed=false 表示用户取消了退出 */
export function settleCloseGuards(window: BrowserWindow | null, proceed: boolean): void {
  if (window && !window.isDestroyed()) windowGuards.get(window)?.settle(proceed)
  quitGuard?.settle(proceed)
}
