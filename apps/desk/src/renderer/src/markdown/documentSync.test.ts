// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest'

import { createDocumentSync, type DocumentSyncHost } from './documentSync'
import { projectRawBlocksForMilkdown } from '../editor/markdown/rawBlockProjection'
import { degradableBlockIndexes, findAbsorbedBlocks } from '../editor/markdown/projectionFidelity'

interface Snapshot {
  from: number
  to: number
}

interface FakeHostOptions {
  /** 宿主的 props.content；默认与 source 相同。 */
  propContent?: string
  /**
   * 模拟编辑器：整篇替换之后「读回来」的 canonical。默认原样返回。
   * 真实编辑器会把降级后的文档重新序列化成忠实形态，用它可以构造收敛 / 不收敛两条路径。
   */
  canonicalAfterReplace?: (projected: string, replaceCount: number) => string
}

interface FakeHost {
  host: DocumentSyncHost<Snapshot>
  setPropContent(value: string): void
  /** 模拟用户在编辑器里改文档。 */
  setDocument(value: string): void
  /** 当前「编辑器文档」。 */
  document(): string
  /** 让会话认为编辑器已创建完成。 */
  markHostReady(): void
  /** 已被整篇替换过几次、内容分别是什么。 */
  replacements: string[]
  emitted: string[]
  status: string[]
  /** reportUnsavedDraft 的上报序列。 */
  draftStates: boolean[]
  /** reportDisplayLimited 的上报序列。 */
  displayLimited: Array<Array<{ index: number; line: number; kind: string }>>
  /** 取走已排队的空闲回调（测试自己控制何时执行）。 */
  takeIdle(): Array<() => void>
  /** 跑掉已排队的空闲回调；返回跑掉的数量。 */
  runIdle(): number
}

/**
 * 假宿主：不引入 Vue / Milkdown。
 * `readMarkdown()` 在 markHostReady() 之前返回 null，模拟「编辑器还没 ready」。
 */
function createFakeHost(initialDocument: string, options: FakeHostOptions = {}): FakeHost {
  let document = initialDocument
  let propContent = options.propContent ?? initialDocument
  let ready = false
  const idle: Array<() => void> = []
  const replacements: string[] = []
  const emitted: string[] = []
  const status: string[] = []
  const draftStates: boolean[] = []
  const displayLimited: Array<Array<{ index: number; line: number; kind: string }>> = []

  const host: DocumentSyncHost<Snapshot> = {
    readMarkdown: () => (ready ? document : null),
    readTopLevelNode: () => null,
    // 真宿主这里会把投影结果 dispatch 进 ProseMirror；这里直接当作新文档。
    replaceDocument: (projected) => {
      replacements.push(projected)
      document = options.canonicalAfterReplace
        ? options.canonicalAfterReplace(projected, replacements.length)
        : projected
    },
    captureViewState: () => null,
    restoreViewState: () => {},
    afterDocumentReplaced: () => {},
    emitSource: (source) => emitted.push(source),
    reportStatus: (message) => status.push(message),
    reportUnsavedDraft: (hasDraft) => draftStates.push(hasDraft),
    reportDisplayLimited: (items) => displayLimited.push(items),
    currentPropContent: () => propContent,
    flushPendingDrafts: () => {},
    scheduleIdle: (run) => idle.push(run)
  }

  return {
    host,
    setPropContent: (value) => {
      propContent = value
    },
    setDocument: (value) => {
      document = value
    },
    document: () => document,
    markHostReady: () => {
      ready = true
    },
    replacements,
    emitted,
    status,
    draftStates,
    displayLimited,
    takeIdle: () => idle.splice(0),
    runIdle: () => {
      const pending = idle.splice(0)
      for (const run of pending) run()
      return pending.length
    }
  }
}

/** 让排队的微任务跑完。 */
async function flushMicrotasks(): Promise<void> {
  await Promise.resolve()
  await Promise.resolve()
}

function startSession(
  source: string,
  options: FakeHostOptions = {}
): { fake: FakeHost; session: ReturnType<typeof createDocumentSync<Snapshot>> } {
  const fake = createFakeHost(options.propContent ?? source, options)
  const session = createDocumentSync<Snapshot>(fake.host, source)
  fake.markHostReady()
  session.markReady()
  return { fake, session }
}

/**
 * 真实投影链路里会长出「结构不忠实」的两组输入（与 projectionFidelity.test.ts 同源）。
 *
 * - 吞并：编辑器把源码里独立的 `222` 并进了提示块，于是 `222` 失去独立归宿；
 * - 结构性错位：canonical 多出一个块，降级计划落到**容器块**上 ——
 *   这一条才会让「按原文重投影」的字节和普通投影不同。
 */
const ABSORBING_SOURCE = '::: tip T\n\n111\n\n:::\n\n222\n'
const ABSORBED_CANONICAL = '::: tip T\n\n111\n222\n\n:::'
const ABSORBING_CANONICAL = '::: tip T\n\n111\n222\n\n:::\n'
const STRUCTURAL_CANONICAL = `333\n\n${ABSORBING_SOURCE}`

describe('documentSync 会话', () => {
  describe('内容同步', () => {
    it('文档没变时 flush 不 emit，也不整篇替换', () => {
      const { fake, session } = startSession('alpha\n\nbeta\n')
      session.flush()
      expect(fake.emitted).toEqual([])
      expect(fake.replacements).toEqual([])
    })

    it('编辑过之后 flush 才 emit 对账结果，且只 emit 一次', () => {
      const { fake, session } = startSession('alpha\n\n- beta\n')
      fake.setDocument('alpha\n\n- beta\n\n- gamma\n')
      session.flush()
      session.flush()
      expect(fake.emitted).toEqual(['alpha\n\n- beta\n\n- gamma\n'])
    })

    it('queueFlush 合并到一次微任务', async () => {
      const { fake, session } = startSession('alpha\n')
      fake.setDocument('alpha\n\nbeta\n')
      session.queueFlush()
      session.queueFlush()
      expect(fake.emitted).toEqual([])
      await flushMicrotasks()
      expect(fake.emitted).toEqual(['alpha\n\nbeta\n'])
    })
  })

  describe('外部更新', () => {
    it('syncExternal 整篇替换但不 emit，也不把自己当成用户编辑', async () => {
      const { fake, session } = startSession('alpha\n')
      fake.setPropContent('beta\n')
      await session.syncExternal('beta\n')
      expect(fake.replacements).toHaveLength(1)
      expect(fake.emitted).toEqual([])
      session.flush()
      expect(fake.emitted).toEqual([])
    })

    it('自己 emit 出去的值回流时不再次整篇替换（不循环回写）', async () => {
      const { fake, session } = startSession('alpha\n')
      fake.setDocument('alpha\n\nbeta\n')
      session.flush()
      const emitted = fake.emitted[0]
      expect(emitted).toBe('alpha\n\nbeta\n')
      const replacementsBefore = fake.replacements.length

      // 宿主把刚写回的值又通过 props 送回来
      fake.setPropContent(emitted)
      session.handleExternalContent(emitted)

      expect(fake.replacements).toHaveLength(replacementsBefore)
      expect(fake.emitted).toEqual([emitted])
    })

    it('真正的外部改动仍然整篇替换', async () => {
      const { fake, session } = startSession('alpha\n')
      fake.setPropContent('external\n')
      session.handleExternalContent('external\n')
      await flushMicrotasks()
      expect(fake.replacements).toEqual(['external\n'])
      expect(fake.document()).toBe('external\n')
    })
  })

  describe('创建期间 props 变化', () => {
    it('会话按创建时的原文建基线；ready 后补同步到新 props', async () => {
      const fake = createFakeHost('A\n')
      // 会话与编辑器用的是同一份 A
      const session = createDocumentSync<Snapshot>(fake.host, 'A\n')
      // 编辑器还在创建：此刻 readMarkdown() 仍是 null，任何 flush 都无处可写
      session.flush()
      expect(fake.emitted).toEqual([])
      expect(fake.replacements).toEqual([])

      fake.markHostReady()
      session.markReady()
      // 初始化期间 props 变成了 B —— 不能把 B 与 A 的编辑器内容配成一组基线
      fake.setPropContent('B\n')
      await session.syncExternal('B\n')

      expect(fake.document()).toBe('B\n')
      expect(fake.emitted).toEqual([])
      // 基线已经跟到 B：再 flush 不该冒出「A 被改成 B」的差异
      session.flush()
      expect(fake.emitted).toEqual([])
    })
  })

  describe('adoptSource', () => {
    it('采纳内部改写：调用方先替换文档，采纳后以新原文为基线 emit 一次', () => {
      const { fake, session } = startSession('# 1. A\n\n- x\n')
      // 调用方（标题编号）自己替换文档，再采纳新原文
      const rewritten = '# A\n\n- x\n'
      fake.host.replaceDocument(projectRawBlocksForMilkdown(rewritten))
      session.adoptSource(rewritten)

      // reconcile 以新原文为基准（原文与基线都跟上了，不会漏基线）
      expect(session.reconcile()).toBe(rewritten)
      // 宿主 props 还是旧值，所以要 emit 一次把新原文交出去
      session.flush()
      expect(fake.emitted).toEqual([rewritten])
      // 第二次不再重复
      session.flush()
      expect(fake.emitted).toEqual([rewritten])
    })
  })

  describe('保真检查 · 降级', () => {
    // 期望值由算法本身给出，不硬编码数字
    const plan = degradableBlockIndexes(ABSORBING_SOURCE, STRUCTURAL_CANONICAL)

    it('前置条件：这组输入确实需要降级，且降级会改变投影字节', () => {
      expect(plan.length).toBeGreaterThan(0)
      expect(
        projectRawBlocksForMilkdown(ABSORBING_SOURCE, { literalBlockIndexes: new Set(plan) })
      ).not.toBe(projectRawBlocksForMilkdown(ABSORBING_SOURCE))
    })

    it('判定出可降级块 → 按原文重投影一次并给出状态提示', () => {
      const { fake, session } = startSession(ABSORBING_SOURCE, {
        propContent: STRUCTURAL_CANONICAL,
        // 真实链路里降级后的文档重新读回来是忠实的；用源文本身代表忠实形态
        canonicalAfterReplace: () => ABSORBING_SOURCE
      })
      fake.setDocument(STRUCTURAL_CANONICAL)

      session.scheduleFidelityCheck()
      fake.runIdle()

      expect(fake.replacements).toHaveLength(1)
      // 替换进去的确实是「按原文降级版」，而不是原样的投影
      expect(fake.replacements[0]).toBe(
        projectRawBlocksForMilkdown(ABSORBING_SOURCE, { literalBlockIndexes: new Set(plan) })
      )
      expect(fake.status).toEqual([
        `有 ${plan.length} 处内容暂时不能安全排版，已按原文作为普通文字显示`
      ])
    })

    it('降级后仍不忠实 → 提示里报出剩余结构差异', () => {
      // 静止输入下区域扩张会立刻饱和（扩张逻辑本身由 projectionFidelity.test.ts 覆盖），
      // 这里要盯的是「没收敛」走的是另一条提示，而不是被当成成功。
      const { fake, session } = startSession(ABSORBING_SOURCE, {
        propContent: STRUCTURAL_CANONICAL,
        // 降级之后读回来依旧不忠实
        canonicalAfterReplace: () => STRUCTURAL_CANONICAL
      })
      fake.setDocument(STRUCTURAL_CANONICAL)

      session.scheduleFidelityCheck()
      fake.runIdle()

      expect(fake.replacements).toHaveLength(1)
      expect(fake.status).toHaveLength(1)
      expect(fake.status[0]).toContain('仍有')
      expect(fake.status[0]).toContain('处结构差异')
      // 走的是「没收敛」那条文案，不是收敛那条（收敛那条以「有 N 处…已按原文」开头）
      expect(fake.status[0]).not.toMatch(/^有 \d+ 处/)
    })

    it('判不出可降级块 → 不做替换、不提示', () => {
      const { fake, session } = startSession('alpha\n\nbeta\n')
      session.scheduleFidelityCheck()
      fake.runIdle()
      expect(fake.replacements).toEqual([])
      expect(fake.status).toEqual([])
    })

    it('同一份原文只判定一次，降级后不再重复替换', () => {
      const { fake, session } = startSession(ABSORBING_SOURCE, {
        propContent: STRUCTURAL_CANONICAL,
        canonicalAfterReplace: () => ABSORBING_SOURCE
      })
      fake.setDocument(STRUCTURAL_CANONICAL)

      session.scheduleFidelityCheck()
      fake.runIdle()
      const afterFirst = fake.replacements.length

      // 原文没变，再排一次不该重新判定 / 重新降级
      session.scheduleFidelityCheck()
      fake.runIdle()
      expect(fake.replacements).toHaveLength(afterFirst)
      expect(fake.status).toHaveLength(1)
    })
  })

  describe('保真检查 · 异步失效', () => {
    it('已排队的检查遇到外部替换后作废：不再读旧文档、不降级新文档', async () => {
      const { fake, session } = startSession(ABSORBING_SOURCE, {
        propContent: ABSORBED_CANONICAL
      })
      fake.setDocument(ABSORBED_CANONICAL)
      session.scheduleFidelityCheck()
      const stale = fake.takeIdle()
      expect(stale).toHaveLength(1)

      fake.setPropContent('external\n')
      await session.syncExternal('external\n')

      // 替换后才盯梢：旧回调若真的执行，至少会去读一次文档
      const reads = vi.spyOn(fake.host, 'readMarkdown')
      const replaces = vi.spyOn(fake.host, 'replaceDocument')
      const statuses = vi.spyOn(fake.host, 'reportStatus')
      stale.forEach((run) => run())

      expect(reads).not.toHaveBeenCalled()
      expect(replaces).not.toHaveBeenCalled()
      expect(statuses).not.toHaveBeenCalled()
      expect(fake.status).toEqual([])
    })

    it('外部替换之后仍能排新的检查，且它会针对新文档跑', async () => {
      const { fake, session } = startSession('alpha\n')
      await session.syncExternal('external\n')

      session.scheduleFidelityCheck()
      const pending = fake.takeIdle()
      expect(pending).toHaveLength(1)

      const reads = vi.spyOn(fake.host, 'readMarkdown')
      pending.forEach((run) => run())
      expect(reads).toHaveBeenCalled()
    })

    it('dispose 之后已排队的检查与后续排队都不再执行', () => {
      const { fake, session } = startSession('alpha\n')
      session.scheduleFidelityCheck()
      const stale = fake.takeIdle()
      session.dispose()

      const reads = vi.spyOn(fake.host, 'readMarkdown')
      stale.forEach((run) => run())
      expect(reads).not.toHaveBeenCalled()

      session.scheduleFidelityCheck()
      expect(fake.takeIdle()).toHaveLength(0)
    })

    it('dispose 之后排队的 flush 不再动文档', async () => {
      const { fake, session } = startSession('alpha\n')
      fake.setDocument('alpha\n\nbeta\n')
      session.queueFlush()
      session.dispose()

      await flushMicrotasks()
      expect(fake.replacements).toEqual([])
      expect(fake.emitted).toEqual([])
      expect(fake.status).toEqual([])
    })
  })

  describe('待保存内容 · flush', () => {
    it('已排队的 flush 遇到外部替换后作废；新任务仍能正常排队', async () => {
      const { fake, session } = startSession('alpha\n')
      fake.setDocument('alpha\n\nlocal\n')
      session.queueFlush()

      // 外部替换：宿主 props 还没回流（parent 尚未 re-render），仍是 alpha
      await session.syncExternal('external\n')
      await flushMicrotasks()
      // 旧任务若真的执行，会拿新文档对账、emit 出 external\n（与 props 不符）→ 泄漏
      expect(fake.emitted).toEqual([])

      // 新一代的任务照常排队并生效
      fake.setPropContent('external\n')
      fake.setDocument('external\n\nmore\n')
      session.queueFlush()
      await flushMicrotasks()
      expect(fake.emitted).toEqual(['external\n\nmore\n'])
    })

    it('flush 先落草稿再对账', () => {
      const fake = createFakeHost('alpha\n')
      const order: string[] = []
      const host: DocumentSyncHost<Snapshot> = {
        ...fake.host,
        flushPendingDrafts: () => order.push('drafts'),
        emitSource: (source) => {
          order.push('emit')
          fake.emitted.push(source)
        }
      }
      const session = createDocumentSync<Snapshot>(host, 'alpha\n')
      fake.markHostReady()
      session.markReady()
      fake.setDocument('alpha\n\nbeta\n')
      session.flush()
      expect(order).toEqual(['drafts', 'emit'])
    })

    it('dispose 之后 flush 既不落草稿也不 emit', () => {
      const { fake, session } = startSession('alpha\n')
      const spy = vi.spyOn(fake.host, 'flushPendingDrafts')
      session.dispose()
      session.flush()
      expect(spy).not.toHaveBeenCalled()
      expect(fake.emitted).toEqual([])
    })

    it('dispose 前落下的草稿仍然会被提交（卸载顺序 flush → dispose）', () => {
      const fake = createFakeHost('alpha\n')
      const session = createDocumentSync<Snapshot>(fake.host, 'alpha\n')
      fake.markHostReady()
      session.markReady()
      const spy = vi.spyOn(fake.host, 'flushPendingDrafts')
      fake.setDocument('alpha\n\nbeta\n')
      session.flush()
      session.dispose()
      expect(spy).toHaveBeenCalledTimes(1)
      expect(fake.emitted).toEqual(['alpha\n\nbeta\n'])
    })
  })

  describe('待保存内容 · 吞并拦截', () => {
    it('前置条件：这组输入确实会被判为吞并', () => {
      const absorbed = findAbsorbedBlocks(ABSORBING_SOURCE, ABSORBING_CANONICAL)
      expect(absorbed).toHaveLength(1)
    })

    it('内容被吞并时禁止 emit，并给出暂停保存的提示', () => {
      // 基线是忠实的原文；用户编辑之后编辑器把 222 并进了提示块 → 对账结果里它失去独立归宿
      const { fake, session } = startSession(ABSORBING_SOURCE)
      const absorbed = findAbsorbedBlocks(ABSORBING_SOURCE, ABSORBING_CANONICAL)
      fake.setDocument(ABSORBING_CANONICAL)

      session.flush()

      expect(fake.emitted).toEqual([])
      expect(absorbed.length).toBeGreaterThan(0)
      // 文案：说清「没保存」与「修改还在编辑器里」，不再引导用户切源码视图（那一步会丢修改）
      expect(fake.status).toEqual([
        '当前修改尚未保存：Desk 无法安全地把这次编辑写回源码，已暂停本次保存'
      ])
    })

    it('被「懒升级」豁免的段落不算吞并，正常 emit', () => {
      const { fake, session } = startSession(ABSORBING_SOURCE)
      const absorbed = findAbsorbedBlocks(ABSORBING_SOURCE, ABSORBING_CANONICAL)
      fake.setDocument(ABSORBING_CANONICAL)
      // 容器懒升级：这段内容的形状变化属于用户预期
      session.noteUpgradedParagraph(absorbed[0]!.source.trim())

      session.flush()

      expect(fake.status).toEqual([])
      expect(fake.emitted).toHaveLength(1)
    })
  })
})

describe('未 emit 的草稿（保存被拦下）', () => {
  const SOURCE = ABSORBING_SOURCE
  const BLOCKED = ABSORBED_CANONICAL

  /** 模拟「第一次修改就被拦下」：用户改完，对账认为写回去会吞掉原文。 */
  function startBlocked(): {
    fake: FakeHost
    session: ReturnType<typeof createDocumentSync<Snapshot>>
  } {
    const { fake, session } = startSession(SOURCE, { propContent: SOURCE })
    fake.setDocument(BLOCKED)
    session.flush()
    return { fake, session }
  }

  it('首次修改即受阻：置草稿标记、提示「当前修改尚未保存」，且不 emit', () => {
    const { fake, session } = startBlocked()
    expect(fake.emitted).toEqual([])
    expect(session.hasUnsavedDraft()).toBe(true)
    expect(fake.draftStates).toEqual([true])
    expect(fake.status.at(-1)).toContain('当前修改尚未保存')
    // 不再把用户往「切到源码视图」那条丢数据的路引
    expect(fake.status.at(-1)).not.toContain('源码视图')
  })

  it('exportDraft 拿得到编辑器当前内容（但不做任何可信承诺）', () => {
    const { fake, session } = startBlocked()
    expect(session.exportDraft()).toBe(BLOCKED)
    fake.setDocument(`${BLOCKED}\n新写的一行\n`)
    expect(session.exportDraft()).toBe(`${BLOCKED}\n新写的一行\n`)
  })

  it('问题解决后草稿标记清除（内容回到与 store 一致时无需再写盘）', () => {
    const { fake, session } = startBlocked()
    fake.setDocument(SOURCE)
    session.flush()
    expect(session.hasUnsavedDraft()).toBe(false)
    expect(fake.draftStates).toEqual([true, false])
    expect(fake.emitted).toEqual([])
  })

  it('整篇替换（切换笔记 / 外部改动）会清掉草稿标记', async () => {
    const { fake, session } = startBlocked()
    await session.syncExternal('另一篇\n')
    expect(session.hasUnsavedDraft()).toBe(false)
    expect(fake.draftStates.at(-1)).toBe(false)
  })
})

describe('以源码显示的清单上报', () => {
  it('没有降级区域时上报空清单（UI 据此收起提示）', () => {
    const { fake, session } = startSession('# 标题\n\n正文\n')
    session.scheduleFidelityCheck()
    fake.runIdle()
    expect(fake.displayLimited.at(-1)).toEqual([])
  })

  it('存在降级区域时报出「行号 + 类型」清单', () => {
    // 用吞并构造：编辑器把独立的 222 并进提示块 → 这块会被降级成按原文显示
    const { fake, session } = startSession(ABSORBING_SOURCE, {
      canonicalAfterReplace: () => ABSORBING_CANONICAL
    })
    fake.setDocument(ABSORBING_CANONICAL)
    session.scheduleFidelityCheck()
    fake.runIdle()

    const reported = fake.displayLimited.at(-1) ?? []
    expect(reported.length).toBeGreaterThan(0)
    expect(reported[0]).toMatchObject({ index: expect.any(Number), line: expect.any(Number) })
    expect(typeof reported[0]?.kind).toBe('string')
  })
})
