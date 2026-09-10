import { afterEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const servers: Array<{ close: ReturnType<typeof vi.fn>; httpServer: { address(): unknown } }> = []
  const resolvers: Array<() => void> = []
  return { servers, resolvers }
})

vi.mock('@tnotesjs/ssg', () => ({
  resolveConfig: async () => ({ base: '/', port: 5199 }),
  createDevServer: () =>
    new Promise((resolve) => {
      const server = {
        close: vi.fn(async () => undefined),
        httpServer: { address: () => ({ port: 5199 }) }
      }
      mocks.servers.push(server)
      mocks.resolvers.push(() => resolve(server))
    })
}))

vi.mock('./log', () => ({ deskLog: vi.fn() }))

import { PreviewManager } from './preview'

/** 等 beginStart 走到 createDevServer（resolveConfig 是异步的） */
async function waitForStartCall(): Promise<void> {
  for (let tick = 0; tick < 50 && mocks.resolvers.length === 0; tick += 1) {
    await Promise.resolve()
  }
}

afterEach(() => {
  mocks.servers.length = 0
  mocks.resolvers.length = 0
})

describe('PreviewManager 启停竞态', () => {
  it('并发点击预览只启动一个 dev server', async () => {
    const manager = new PreviewManager()
    const first = manager.start('kb', 'kb', '/repo')
    const second = manager.start('kb', 'kb', '/repo')
    await waitForStartCall()
    mocks.resolvers.forEach((resolve) => resolve())
    const [a, b] = await Promise.all([first, second])

    expect(mocks.servers).toHaveLength(1)
    expect(a.url).toBe(b.url)
    expect(a.state.status).toBe('ready')
    expect(manager.list()).toHaveLength(1)
  })

  it('启动期间被 stop：晚到的 server 会被关掉，状态保持 idle', async () => {
    const manager = new PreviewManager()
    const starting = manager.start('kb', 'kb', '/repo')
    const stopping = manager.stop('kb')
    await waitForStartCall()
    mocks.resolvers.forEach((resolve) => resolve())
    const [started] = await Promise.all([starting, stopping])

    expect(mocks.servers).toHaveLength(1)
    expect(mocks.servers[0].close).toHaveBeenCalled()
    expect(started.state.status).toBe('idle')
    expect(manager.list()).toHaveLength(0)
  })

  it('已就绪时重复 start 复用同一个 server', async () => {
    const manager = new PreviewManager()
    const first = manager.start('kb', 'kb', '/repo')
    await waitForStartCall()
    mocks.resolvers.forEach((resolve) => resolve())
    await first

    const again = await manager.start('kb', 'kb', '/repo')
    expect(mocks.servers).toHaveLength(1)
    expect(again.state.status).toBe('ready')
  })
})
