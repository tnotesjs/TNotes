import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createExcalidrawSession, persistedSceneSignature } from './editorSession'

const scene = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({
    type: 'excalidraw',
    elements: [{ id: 'rect-1' }],
    appState: { viewBackgroundColor: '#ffffff' },
    files: {},
    ...overrides
  })

/** 只改展示状态：appState 必须与基础场景合并，否则是「删掉了背景色」这种真变化 */
const viewChanged = (appState: Record<string, unknown>) =>
  scene({ appState: { viewBackgroundColor: '#ffffff', ...appState } })

function setup(options: { save?: ReturnType<typeof vi.fn>; initial?: string } = {}) {
  const save =
    options.save ??
    vi.fn(async ({ content }: { content: string }) => ({
      ok: true as const,
      revision: `rev-${content.length}-${Math.random().toString(16).slice(2, 6)}`
    }))
  const session = createExcalidrawSession({
    initialContent: options.initial ?? scene(),
    initialRevision: 'rev-0',
    save: save as never,
    debounceMs: 200,
    maxWaitMs: 1000
  })
  return { session, save }
}

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('画布编辑会话', () => {
  it('展示状态变化（平移/缩放/选中）不触发写盘', async () => {
    const { session, save } = setup()
    session.update(viewChanged({ scrollX: 120, zoom: { value: 2 } }))
    await vi.advanceTimersByTimeAsync(1500)

    expect(save).not.toHaveBeenCalled()
    expect(session.state.value).toBe('idle')
  })

  it('内容变化防抖 200ms 后写入一次', async () => {
    const { session, save } = setup()
    session.update(scene({ elements: [{ id: 'rect-1' }, { id: 'rect-2' }] }))
    expect(session.state.value).toBe('pending')

    await vi.advanceTimersByTimeAsync(199)
    expect(save).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)

    expect(save).toHaveBeenCalledTimes(1)
    expect(session.state.value).toBe('idle')
  })

  it('连续变化时最大等待 1s 强制落盘，不会被防抖无限推迟', async () => {
    const { session, save } = setup()
    for (let index = 0; index < 12; index += 1) {
      session.update(
        scene({ elements: Array.from({ length: index + 2 }, (_, i) => ({ id: `r${i}` })) })
      )
      await vi.advanceTimersByTimeAsync(100)
    }

    expect(save).toHaveBeenCalled()
  })

  it('写入串行：进行中的写入不会被并发覆盖，且旧完成回调不清掉新状态', async () => {
    const pending: Array<(value: { ok: true; revision: string }) => void> = []
    const save = vi.fn(
      () =>
        new Promise<{ ok: true; revision: string }>((resolve) => {
          pending.push(resolve)
        })
    )
    const { session } = setup({ save: save as never })

    session.update(scene({ elements: [{ id: 'first' }] }))
    await vi.advanceTimersByTimeAsync(200)
    expect(save).toHaveBeenCalledTimes(1)

    session.update(scene({ elements: [{ id: 'second' }] }))
    await vi.advanceTimersByTimeAsync(200)
    expect(save).toHaveBeenCalledTimes(1) // 仍在写入中，不并发

    pending[0]?.({ ok: true, revision: 'rev-1' })
    await vi.advanceTimersByTimeAsync(0)
    expect(save).toHaveBeenCalledTimes(2) // 写完后补写最新内容

    pending[1]?.({ ok: true, revision: 'rev-2' })
    await vi.advanceTimersByTimeAsync(0)
    expect(session.state.value).toBe('idle')
    expect(session.revision.value).toBe('rev-2')
  })

  it('写入失败保留最新内容并进入 failed，重试成功后回到 idle', async () => {
    const save = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, code: 'error', message: '磁盘满' })
      .mockResolvedValueOnce({ ok: true, revision: 'rev-ok' })
    const { session } = setup({ save: save as never })

    const latest = scene({ elements: [{ id: 'latest' }] })
    session.update(latest)
    await vi.advanceTimersByTimeAsync(200)

    expect(session.state.value).toBe('failed')
    expect(session.lastError.value).toBe('磁盘满')
    expect(session.currentContent()).toBe(latest) // 内容没丢

    await session.retry()
    expect(session.state.value).toBe('idle')
    expect(session.revision.value).toBe('rev-ok')
  })

  it('冲突单独标记，内容保留供用户选择', async () => {
    const save = vi.fn(async () => ({
      ok: false as const,
      code: 'conflict' as const,
      message: '已被外部修改'
    }))
    const { session } = setup({ save: save as never })
    session.update(scene({ elements: [{ id: 'mine' }] }))
    await vi.advanceTimersByTimeAsync(200)

    expect(session.state.value).toBe('conflict')
    // 冲突时保留我的内容等待用户决定，不能被清掉
    expect(session.hasPending()).toBe(true)
    expect(session.currentContent()).toContain('mine')
  })

  it('flush 立即写盘（切换承载位置/关闭入口）', async () => {
    const { session, save } = setup()
    session.update(scene({ elements: [{ id: 'pending' }] }))
    expect(save).not.toHaveBeenCalled()

    await session.flush()
    expect(save).toHaveBeenCalledTimes(1)
  })

  it('dispose 之后不再写盘', async () => {
    const { session, save } = setup()
    session.update(scene({ elements: [{ id: 'x' }] }))
    session.dispose()
    await vi.advanceTimersByTimeAsync(2000)
    expect(save).not.toHaveBeenCalled()
  })

  it('adopt 把首帧规范化结果当基线：不写盘，且之后相同内容不触发写入', async () => {
    const { session, save } = setup()
    // 模拟 Excalidraw 载入后补齐字段：元素与 appState 都被规范化
    const normalized = scene({
      elements: [{ id: 'rect-1', groupIds: [], frameId: null, roundness: null }],
      appState: { viewBackgroundColor: '#ffffff', gridSize: 20, gridStep: 5 }
    })
    session.update(normalized)
    expect(session.state.value).toBe('pending')

    session.adopt(normalized, 'rev-normalized')

    expect(session.state.value).toBe('idle')
    expect(session.hasPending()).toBe(false)
    expect(session.revision.value).toBe('rev-normalized')
    await vi.advanceTimersByTimeAsync(2000)
    expect(save).not.toHaveBeenCalled()

    // 同一份规范化内容再来一次（编辑器抖动）也不写
    session.update(normalized)
    await vi.advanceTimersByTimeAsync(2000)
    expect(save).not.toHaveBeenCalled()

    // 真正的内容变化照常写盘
    session.update(scene({ elements: [{ id: 'rect-1' }, { id: 'rect-2' }] }))
    await vi.advanceTimersByTimeAsync(200)
    expect(save).toHaveBeenCalledTimes(1)
  })

  it('adopt 之后 revision 不变时，写入仍会用最新 revision', async () => {
    const { session, save } = setup()
    session.adopt(scene({ elements: [{ id: 'normalized' }] }))
    expect(session.revision.value).toBe('rev-0')
    session.update(scene({ elements: [{ id: 'drawn' }] }))
    await vi.advanceTimersByTimeAsync(200)
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ expectedRevision: 'rev-0' }))
  })

  it('持久化指纹忽略展示状态但包含元素与内嵌文件', () => {
    const a = persistedSceneSignature(scene())
    expect(persistedSceneSignature(viewChanged({ scrollX: 10, zoom: { value: 1.5 } }))).toBe(a)
    expect(persistedSceneSignature(scene({ elements: [{ id: 'changed' }] }))).not.toBe(a)
    expect(
      persistedSceneSignature(scene({ files: { f1: { id: 'f1', dataURL: 'data:image/png' } } }))
    ).not.toBe(a)
  })
})
