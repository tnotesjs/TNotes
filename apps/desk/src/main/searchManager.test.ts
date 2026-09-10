import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const listeners = new Map<string, Array<(...args: unknown[]) => void>>()
  const worker = {
    posted: [] as Array<Record<string, unknown>>,
    terminated: false,
    on(event: string, listener: (...args: unknown[]) => void) {
      const list = listeners.get(event) ?? []
      list.push(listener)
      listeners.set(event, list)
      return worker
    },
    postMessage(message: Record<string, unknown>) {
      worker.posted.push(message)
    },
    async terminate() {
      worker.terminated = true
      return 0
    },
    emit(event: string, ...args: unknown[]) {
      for (const listener of listeners.get(event) ?? []) listener(...args)
    },
    reset() {
      listeners.clear()
      worker.posted = []
      worker.terminated = false
    }
  }
  return {
    worker,
    Worker: vi.fn(function () {
      return worker
    })
  }
})

vi.mock('electron', () => ({
  app: { getPath: () => '/tmp/tnotes-test' },
  // deskLog 会遍历窗口广播日志
  BrowserWindow: { getAllWindows: () => [] }
}))

import { SearchManager } from './searchManager'

import type { Worker } from 'node:worker_threads'

const worker = mocks.worker
const createManager = () => new SearchManager(worker as unknown as Worker)

beforeEach(() => {
  vi.useFakeTimers()
  worker.reset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('SearchManager 工作线程丢失', () => {
  it('worker 退出后在途搜索立即失败，不再永久挂起', async () => {
    const manager = createManager()
    manager.setWorkspace('/tmp/kb')
    const building = manager.rebuild('/tmp/kb', [])
    const search = manager.search({ query: '任意', knowledgeBaseId: 'kb' })
    // 先挂上断言再触发退出，避免中间态被判成 unhandled rejection
    const expectation = expect(search).rejects.toThrow(/搜索索引不可用|已退出/)
    worker.emit('exit', 1)
    await expectation
    await expect(building).resolves.toBeUndefined()
    await manager.dispose()
  })

  it('worker 退出后 ready 结算，后续搜索给出可读错误而不是无限等待', async () => {
    const manager = createManager()
    manager.setWorkspace('/tmp/kb')
    worker.emit('exit', 137)
    await expect(manager.search({ query: 'x', knowledgeBaseId: 'kb' })).rejects.toThrow(
      /搜索索引不可用|已退出/
    )
    await manager.dispose()
  })

  it('请求超时后拒绝，避免线程不响应时无限等待', async () => {
    const manager = createManager()
    manager.setWorkspace('/tmp/kb')
    const building = manager.rebuild('/tmp/kb', [])
    const buildRequest = worker.posted.find((message) => message.type === 'build')
    worker.emit('message', {
      requestId: buildRequest?.requestId,
      ok: true,
      value: { documentCount: 0, cached: false }
    })
    await building

    const search = manager.search({ query: 'x', knowledgeBaseId: 'kb' })
    const expectation = expect(search).rejects.toThrow(/未响应/)
    await vi.advanceTimersByTimeAsync(15_000)
    await expectation
    await manager.dispose()
  })

  it('dispose 会结算在途请求与等待中的搜索', async () => {
    const manager = createManager()
    manager.setWorkspace('/tmp/kb')
    const search = manager.search({ query: 'x', knowledgeBaseId: 'kb' })
    const expectation = expect(search).rejects.toThrow()
    await manager.dispose()
    await expectation
  })
})
