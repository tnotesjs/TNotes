/**
 * 关窗 / 退出前的协调：主进程先接管 close（或 before-quit），请渲染端把未保存内容
 * flush / 询问完并回执，再真正关闭。渲染端迟迟不回执时按超时放过，避免应用永远
 * 退不掉（此时 recovery 快照仍是最长 250ms 的兜底）。
 */
export interface CloseGuardHost {
  /** 通知渲染端开始准备（通常是 webContents.send），不等待 */
  requestFlush: () => void
  /** 放行后真正执行的关闭动作（window.close / app.quit） */
  close: () => void
  /** 渲染端超时未回执时记录 */
  onTimeout?: (waitedMs: number) => void
  /** 渲染端已经销毁、无法回执时记录 */
  onUnavailable?: (error: unknown) => void
  timeoutMs?: number
}

export class CloseGuard {
  private approved = false
  private pending = false
  private resolvePending: ((proceed: boolean) => void) | null = null
  private readonly timeoutMs: number

  constructor(private readonly host: CloseGuardHost) {
    this.timeoutMs = host.timeoutMs ?? 5000
  }

  /** 已批准关闭：放行后重复触发不再拦截 */
  isApproved(): boolean {
    return this.approved
  }

  /** 别的流程（例如退出）已经处理过 flush：让后续事件直接放行 */
  approve(): void {
    this.approved = true
  }

  /** 渲染端回执入口：proceed=false 表示用户取消了退出 */
  settle(proceed: boolean): void {
    const resolve = this.resolvePending
    this.resolvePending = null
    resolve?.(proceed)
  }

  /**
   * 在 window 的 'close' 或 app 的 'before-quit' 里调用。
   * 返回 true 表示这次事件已被接管（调用方应 preventDefault）。
   */
  intercept(event: { preventDefault: () => void }): boolean {
    if (this.approved) return false
    event.preventDefault()
    if (this.pending) return true
    this.pending = true
    void this.run().finally(() => {
      this.pending = false
      this.resolvePending = null
    })
    return true
  }

  private async run(): Promise<void> {
    const proceed = await this.awaitRenderer()
    if (!proceed) return
    this.approved = true
    this.host.close()
  }

  private async awaitRenderer(): Promise<boolean> {
    const fromRenderer = new Promise<boolean>((resolve) => {
      this.resolvePending = resolve
    })
    let timer: ReturnType<typeof setTimeout> | null = null
    const fromTimeout = new Promise<boolean>((resolve) => {
      timer = setTimeout(() => {
        this.host.onTimeout?.(this.timeoutMs)
        resolve(true)
      }, this.timeoutMs)
    })
    try {
      this.host.requestFlush()
    } catch (error) {
      this.host.onUnavailable?.(error)
      if (timer) clearTimeout(timer)
      return true
    }
    const proceed = await Promise.race([fromRenderer, fromTimeout])
    if (timer) clearTimeout(timer)
    return proceed
  }
}
