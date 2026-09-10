import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { CloseGuard } from './closeGuard'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function makeGuard(overrides: Partial<ConstructorParameters<typeof CloseGuard>[0]> = {}) {
  const requestFlush = vi.fn()
  const close = vi.fn()
  const guard = new CloseGuard({ requestFlush, close, timeoutMs: 1000, ...overrides })
  return { guard, requestFlush, close }
}

describe('CloseGuard', () => {
  it('第一次 close 被接管：先通知渲染端，不立即关闭', () => {
    const { guard, requestFlush, close } = makeGuard()
    const event = { preventDefault: vi.fn() }

    expect(guard.intercept(event)).toBe(true)
    expect(event.preventDefault).toHaveBeenCalledOnce()
    expect(requestFlush).toHaveBeenCalledOnce()
    expect(close).not.toHaveBeenCalled()
  })

  it('渲染端回执 proceed=true 后才真正关闭，并放行后续事件', async () => {
    const { guard, close } = makeGuard()
    guard.intercept({ preventDefault: vi.fn() })
    guard.settle(true)
    await vi.runAllTimersAsync()

    expect(close).toHaveBeenCalledOnce()
    const second = { preventDefault: vi.fn() }
    expect(guard.intercept(second)).toBe(false)
    expect(second.preventDefault).not.toHaveBeenCalled()
  })

  it('用户取消（proceed=false）时不关闭，下次还能再次询问', async () => {
    const { guard, close, requestFlush } = makeGuard()
    guard.intercept({ preventDefault: vi.fn() })
    guard.settle(false)
    await vi.runAllTimersAsync()

    expect(close).not.toHaveBeenCalled()
    guard.intercept({ preventDefault: vi.fn() })
    expect(requestFlush).toHaveBeenCalledTimes(2)
  })

  it('重复触发只询问一次，避免连点红叉弹多次对话框', () => {
    const { guard, requestFlush } = makeGuard()
    guard.intercept({ preventDefault: vi.fn() })
    guard.intercept({ preventDefault: vi.fn() })
    guard.intercept({ preventDefault: vi.fn() })

    expect(requestFlush).toHaveBeenCalledOnce()
  })

  it('渲染端超时不回执时放过退出，避免应用永远退不掉', async () => {
    const onTimeout = vi.fn()
    const { guard, close } = makeGuard({ onTimeout })
    guard.intercept({ preventDefault: vi.fn() })

    await vi.advanceTimersByTimeAsync(1000)
    expect(onTimeout).toHaveBeenCalledWith(1000)
    expect(close).toHaveBeenCalledOnce()
  })

  it('渲染端已销毁时直接放行', async () => {
    const onUnavailable = vi.fn()
    const { guard, close } = makeGuard({
      onUnavailable,
      requestFlush: () => {
        throw new Error('Object has been destroyed')
      }
    })
    guard.intercept({ preventDefault: vi.fn() })
    await vi.runAllTimersAsync()

    expect(onUnavailable).toHaveBeenCalledOnce()
    expect(close).toHaveBeenCalledOnce()
  })
})
