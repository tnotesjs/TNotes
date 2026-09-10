import { app, net } from 'electron'

import { compareVersions } from '../shared/version'

import { deskLog } from './log'

import type { UpdateStatusDto } from '../shared/contracts'

// monorepo（tnotesjs/tnotesjs）里只有 desk 会创建 GitHub Release，tag 形如 desk@x.y.z；
// 用列表端点 + 前缀过滤，避免将来其他包建 Release 后 /releases/latest 误中
const RELEASES_API = 'https://api.github.com/repos/tnotesjs/tnotesjs/releases?per_page=10'
export const RELEASES_PAGE = 'https://github.com/tnotesjs/tnotesjs/releases'
const TAG_PREFIX = 'desk@'
const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000
const STARTUP_DELAY_MS = 8000
const REQUEST_TIMEOUT_MS = 10_000

interface ReleasePayloadItem {
  tag_name?: unknown
  html_url?: unknown
}

class UpdateManager {
  private status: UpdateStatusDto = { state: 'idle', currentVersion: app.getVersion() }
  private readonly listeners = new Set<(status: UpdateStatusDto) => void>()
  private intervalTimer: NodeJS.Timeout | null = null
  private startupTimer: NodeJS.Timeout | null = null
  private autoCheck = true
  private started = false

  onChanged(callback: (status: UpdateStatusDto) => void): () => void {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  }

  getStatus(): UpdateStatusDto {
    return this.status
  }

  configure(autoCheck: boolean): void {
    this.autoCheck = autoCheck
    if (this.started) this.schedule()
  }

  start(): void {
    this.started = true
    if (!app.isPackaged) return
    this.schedule()
  }

  stop(): void {
    this.started = false
    if (this.startupTimer) clearTimeout(this.startupTimer)
    if (this.intervalTimer) clearInterval(this.intervalTimer)
    this.startupTimer = null
    this.intervalTimer = null
  }

  private schedule(): void {
    if (this.startupTimer) clearTimeout(this.startupTimer)
    if (this.intervalTimer) clearInterval(this.intervalTimer)
    this.startupTimer = null
    this.intervalTimer = null
    if (!this.autoCheck) return
    this.startupTimer = setTimeout(() => void this.check(), STARTUP_DELAY_MS)
    this.intervalTimer = setInterval(() => void this.check(), CHECK_INTERVAL_MS)
  }

  private setStatus(next: UpdateStatusDto): void {
    this.status = next
    for (const listener of this.listeners) listener(next)
  }

  async check(): Promise<UpdateStatusDto> {
    const currentVersion = app.getVersion()
    this.setStatus({ ...this.status, state: 'checking', currentVersion })
    try {
      const response = await net.fetch(RELEASES_API, {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': `tnotes-desk/${currentVersion}`
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      })
      if (!response.ok) throw new Error(`GitHub 返回异常状态（${response.status}）`)
      const payload = (await response.json()) as ReleasePayloadItem[] | unknown
      const release = Array.isArray(payload)
        ? payload.find(
            (item) => typeof item.tag_name === 'string' && item.tag_name.startsWith(TAG_PREFIX)
          )
        : undefined
      const latestVersion =
        typeof release?.tag_name === 'string' ? release.tag_name.slice(TAG_PREFIX.length) : ''
      if (!latestVersion) throw new Error('未从 GitHub 获取到 desk 版本号')
      const hasUpdate = compareVersions(latestVersion, currentVersion) > 0
      this.setStatus({
        state: hasUpdate ? 'available' : 'up-to-date',
        currentVersion,
        latestVersion,
        releaseUrl:
          typeof release?.html_url === 'string' && release.html_url.startsWith('https://')
            ? release.html_url
            : RELEASES_PAGE,
        checkedAt: new Date().toISOString()
      })
    } catch (error) {
      const cause = error instanceof Error && error.cause instanceof Error ? error.cause : error
      const message = cause instanceof Error ? cause.message : String(cause)
      deskLog('update', 'check failed', message)
      this.setStatus({
        state: 'error',
        currentVersion,
        checkedAt: new Date().toISOString(),
        message: `检查更新失败：${message}`
      })
    }
    return this.status
  }
}

export const updateManager = new UpdateManager()
