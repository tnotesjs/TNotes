import { describe, expect, it, vi } from 'vitest'

import {
  excalidrawSessionKey,
  flushExcalidrawSessions,
  hasExcalidrawSession,
  registerExcalidrawSession
} from './sessionRegistry'

describe('画布会话登记表', () => {
  it('按知识库 + 路径登记，注销后不再出现', () => {
    const handle = { settle: vi.fn(async () => undefined) }
    const dispose = registerExcalidrawSession('kb-a', 'assets/a.excalidraw', handle)
    expect(hasExcalidrawSession('kb-a', 'assets/a.excalidraw')).toBe(true)
    expect(hasExcalidrawSession('kb-b', 'assets/a.excalidraw')).toBe(false)
    expect(hasExcalidrawSession('kb-a', 'assets/b.excalidraw')).toBe(false)
    dispose()
    expect(hasExcalidrawSession('kb-a', 'assets/a.excalidraw')).toBe(false)
  })

  it('flush 同一路径的所有会话（标签页 + 内嵌卡片可能同时打开）', async () => {
    const first = { settle: vi.fn(async () => undefined) }
    const second = { settle: vi.fn(async () => undefined) }
    const disposeFirst = registerExcalidrawSession('kb-a', 'assets/a.excalidraw', first)
    const disposeSecond = registerExcalidrawSession('kb-a', 'assets/a.excalidraw', second)

    await flushExcalidrawSessions('kb-a', 'assets/a.excalidraw')

    expect(first.settle).toHaveBeenCalledOnce()
    expect(second.settle).toHaveBeenCalledOnce()
    disposeFirst()
    disposeSecond()
  })

  it('单个会话 flush 抛错不影响其它会话与调用方', async () => {
    const failing = {
      settle: vi.fn(async () => {
        throw new Error('磁盘已被外部修改')
      })
    }
    const ok = { settle: vi.fn(async () => undefined) }
    const disposeFailing = registerExcalidrawSession('kb-a', 'assets/a.excalidraw', failing)
    const disposeOk = registerExcalidrawSession('kb-a', 'assets/a.excalidraw', ok)

    await expect(flushExcalidrawSessions('kb-a', 'assets/a.excalidraw')).resolves.toBeUndefined()
    expect(ok.settle).toHaveBeenCalledOnce()
    disposeFailing()
    disposeOk()
  })

  it('key 用不可见分隔符，避免拼接歧义', () => {
    expect(excalidrawSessionKey('kb', 'assets/a.excalidraw')).toBe('kb\u0000assets/a.excalidraw')
  })
})
