/**
 * 文档同步会话：把 MilkdownMarkdownEditor 里的「有状态编排」抽出来，单独可读、可测。
 *
 * 负责四件事，且只负责这四件：
 *
 *  1. **内容同步**：用户/程序化事务后把编辑器内容对账成可写盘 Markdown（`flush` / `queueFlush`）；
 *  2. **外部更新**：`props.content` 变化时整篇替换编辑器，且不把自己的替换当成用户编辑回写
 *     （`syncExternal` / `handleExternalContent`）；
 *  3. **保真检查**：空闲时判定渲染是否忠实，不忠实的块退化成「按原文显示」并同步基线
 *     （`scheduleFidelityCheck`）；
 *  4. **待保存内容 flush**：先落块内 Edit 草稿，再对账 emit（`flush`）。
 *
 * 算法本身在 `editor/markdown/`（`sourcePreservation` / `projectionFidelity` / `literalProjection`）。
 * 本模块只持有贯穿这些算法的那几份状态：当前原文、紧邻的 canonical 基线、上次 emit 的值、
 * 降级区域、「懒升级」段落、同步中标志。**视图连接与生命周期留在组件里**，通过 host 注入。
 *
 * 契约（三条都是行为约束，改动前先读）：
 *
 * - **基线必须与原文配对**：`source` 是「创建编辑器时用的那份原文」，`markReady()` 读到的
 *   canonical 是它的基线。初始化期间 `props.content` 变了，不要在 ready 前替换，
 *   而是在 ready 之后用 `syncExternal` 补一次（宿主负责这一步）。
 * - **`adoptSource` 不改文档**：调用方先自己完成文档替换，再调 `adoptSource(source)`，
 *   由它读取新 canonical、更新原文并清掉保真判定的去重键。
 *   `degradedRegionIndexes` 故意不在这里清：它是「文档块下标 → 原文」的活映射，
 *   清了会让原本按原文暴露的块被通用序列化器改写（会丢字节），不是 source 维度的缓存。
 * - **异步任务要认领自己的世代**：`queueFlush` 的微任务与 `scheduleFidelityCheck` 的空闲回调
 *   都带着调度时的 `generation`；`dispose()` 与 `syncExternal()` 会推进世代，
 *   于是排队的旧任务自动失效 —— 旧内容不会回写，旧检查也不会去降级新文档。
 *   卸载顺序：`flush()` → `dispose()` → 销毁编辑器。
 */
import { projectRawBlocksForMilkdown } from '../editor/markdown/rawBlockProjection'
import {
  reconcileMarkdownSource,
  type ReconcileOptions
} from '../editor/markdown/sourcePreservation'
import {
  literalRegionSourceFor,
  type LiteralWalkableNode
} from '../editor/markdown/literalProjection'
import {
  actionableProblems,
  classifyProjectionFidelity,
  degradableBlockIndexes,
  describeFidelityProblems,
  extendDegradationIndexes,
  findAbsorbedBlocks,
  type FidelityBlockResult
} from '../editor/markdown/projectionFidelity'

/** 视图快照由宿主定义（选区 + 滚动位置），模块只负责在替换前后原样带回。 */
export type DocumentSyncViewState = unknown

export interface DocumentSyncHost<ViewState = DocumentSyncViewState> {
  /** 当前编辑器 Markdown；`null` = 编辑器还没 ready（或已销毁）。 */
  readMarkdown(): string | null
  /** 当前文档第 `index` 个顶层节点（降级区域的「转义逐行原文」渲染用）。 */
  readTopLevelNode(index: number): LiteralWalkableNode | null
  /** 用投影后的 Markdown 整篇替换文档。 */
  replaceDocument(projectedMarkdown: string): void
  /** 整篇替换前抓取选区 / 滚动。 */
  captureViewState(): ViewState | null
  /** 整篇替换、基线更新、派生视图刷新之后再恢复选区 / 滚动。 */
  restoreViewState(state: ViewState | null): void
  /** 整篇替换后刷新从文档派生的视图（生成式 TOC、大纲）。 */
  afterDocumentReplaced(): void
  /** 把保真校正后的 Markdown 交给宿主写回（`emit('change')`）。 */
  emitSource(source: string): void
  /** 给用户的状态提示（吞并拦截、降级提示）。 */
  reportStatus(message: string): void
  /** 宿主 props 里的当前 content，用来判断「与外部值相同就不用 emit」。 */
  currentPropContent(): string
  /** 落块内 Edit 草稿（`flushPendingEdits`）。 */
  flushPendingDrafts(): void
  /** 空闲调度；默认 `requestIdleCallback`，退化 `setTimeout(300)`。单测可注入。 */
  scheduleIdle?(run: () => void): void
}

export interface DocumentSyncSession {
  /** 编辑器创建完成：以当前原文对应的 canonical 作为基线。 */
  markReady(): void
  /** 宿主 props 的 content 变化。自己刚 emit 出去的值会被识别并吞掉。 */
  handleExternalContent(content: string): void
  /** 整篇替换成外部内容（初次加载、切换笔记回填、外部改动）。 */
  syncExternal(content: string): Promise<void>
  /** 事务后的合并 flush（微任务去重）。 */
  queueFlush(): void
  /** 落草稿 → 对账 → emit。 */
  flush(): void
  /** 只对账不 emit；调用方拿它做内部改写（如标题编号）。 */
  reconcile(): string
  /**
   * 采纳一次内部改写：调用方必须**已经**把 `source` 替换进文档；
   * 这里读取新 canonical、更新原文、清掉保真判定去重键，并刷新派生视图。
   */
  adoptSource(source: string): void
  /** 容器懒升级产生的段落文本：这些块形状变化属于用户预期，不参与吞并拦截。 */
  noteUpgradedParagraph(text: string): void
  /** 排一次空闲保真检查（同一份原文只判定一次）。 */
  scheduleFidelityCheck(): void
  /** 是否正在做整篇替换（只读守卫用它放行同步事务）。 */
  isSynchronizing(): boolean
  /** 卸载前调用；之后所有排队任务与 flush 都失效。 */
  dispose(): void
}

export function createDocumentSync<ViewState = DocumentSyncViewState>(
  host: DocumentSyncHost<ViewState>,
  /**
   * 初始原文：必须是「创建编辑器时用的那份 content」。会话在这里记录它，
   * `markReady()` 再把编辑器的 canonical 读成它的基线 —— 两者必须配对。
   */
  initialSource: string
): DocumentSyncSession {
  /** 最近一次外部/内部采纳的原文（磁盘真相）。 */
  let source = initialSource
  /** 紧邻上一次整篇替换后的 canonical，对账时作为块边界基线。 */
  let baselineCanonical = ''
  /** 上一次 emit 出去的内容：用来识别「props 回流的就是我们自己写的」。 */
  let lastEmitted: string | null = null
  /** 正在整篇替换：期间禁止对账 emit，只读守卫也据此放行。 */
  let synchronizing = false

  let disposed = false
  /** 世代号：`dispose()` 与 `syncExternal()` 推进它，让排队的异步任务失效。 */
  let generation = 0

  let contentSyncQueued = false
  let fidelityScheduled = false
  /** 已判定过的原文：同一份不再重复判定（否则会拿降级后的结果反污染判定）。 */
  let fidelityCheckedFor: string | null = null

  /**
   * 「按原文暴露」的区域（降级产生的普通正文）在基线里的块下标。
   * 写盘时用它告诉 reconcile：这些块被编辑过就用渲染的「转义逐行原文」，
   * 不要交给通用序列化器（否则会出现 `\` 断行、转义丢失，重新加载又会变回容器）。
   */
  let degradedRegionIndexes = new Set<number>()

  /** 被「懒升级」重投影过的段落文本：这些块从文本变成容器属于用户预期内的形状变化。 */
  const upgradedParagraphTexts = new Set<string>()

  function literalRegionOptions(): ReconcileOptions {
    if (degradedRegionIndexes.size === 0) return {}
    return {
      literalRegions: {
        baselineIndexes: degradedRegionIndexes,
        render: (currentIndex: number) => {
          const node = host.readTopLevelNode(currentIndex)
          if (!node) return null
          return literalRegionSourceFor(node)
        }
      }
    }
  }

  /** 推进世代，并清掉排队标志 —— 否则旧任务失效后新任务会以为「已经排过了」而不排。 */
  function invalidatePending(): void {
    generation += 1
    contentSyncQueued = false
    fidelityScheduled = false
  }

  function scheduleIdle(run: () => void): void {
    if (host.scheduleIdle) {
      host.scheduleIdle(run)
      return
    }
    const idle = (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
      .requestIdleCallback
    if (typeof idle === 'function') idle(run)
    else window.setTimeout(run, 300)
  }

  /**
   * 空闲时检查渲染忠实性：结构性不忠实的块退化成「按原文显示」（unparsed 原始块），
   * 并把基线同步成新文档 —— 未编辑的块在保存时仍然逐字取原文。
   * 只在空闲做，不拖慢打开；判定/重建的成本只在真有问题的笔记上付一次。
   */
  function scheduleFidelityCheck(): void {
    if (disposed || fidelityScheduled) return
    fidelityScheduled = true
    const token = generation
    scheduleIdle(() => {
      // 排队期间发生过 dispose 或外部替换：这份检查已经不属于当前文档。
      if (disposed || token !== generation) return
      fidelityScheduled = false
      if (host.readMarkdown() === null || synchronizing) return
      // 同一份内容只判定一次：降级会把文档换成「退化形态」，再判定就会基于退化结果
      // 算出更小的计划（实测把真正被降级的块挤出记录，写盘覆盖因此失效）。
      if (fidelityCheckedFor === source) return
      fidelityCheckedFor = source
      let plan = degradableBlockIndexes(source, host.readMarkdown() ?? '')
      // 计划为空 = 这篇笔记现在没有任何「按原文暴露」的区域，清掉记录
      degradedRegionIndexes = new Set(plan)
      if (plan.length === 0) return
      let remaining = 0
      // 首轮问题（降级前）与最后一轮问题：文案要能说清「哪儿对不上」
      let firstRoundProblems: FidelityBlockResult[] = []
      let lastProblems: FidelityBlockResult[] = []
      for (let round = 0; round < 8; round += 1) {
        synchronizing = true
        try {
          host.replaceDocument(
            projectRawBlocksForMilkdown(source, { literalBlockIndexes: new Set(plan) })
          )
          baselineCanonical = host.readMarkdown() ?? baselineCanonical
          host.afterDocumentReplaced()
        } finally {
          synchronizing = false
        }
        const report = classifyProjectionFidelity(source, host.readMarkdown() ?? '')
        // 收敛判据是「没有可行动的结构性问题」：content-changed（行内 <br/> 等规范化）
        // 不该继续驱动降级，否则会一路吃掉无关内容。
        const actionable = actionableProblems(report)
        if (round === 0) firstRoundProblems = actionable
        if (actionable.length === 0) {
          remaining = 0
          break
        }
        remaining = actionable.length
        lastProblems = actionable
        const next = extendDegradationIndexes(source, host.readMarkdown() ?? '', plan)
        if (next.length === plan.length) break
        plan = next
      }
      const details = describeFidelityProblems(
        source,
        remaining > 0 ? lastProblems : firstRoundProblems
      )
      // 控制台留全量细节：状态栏只放得下前两条，用户要定位时看这里
      console.warn('[desk] 保真检查发现结构差异', {
        remaining,
        degradedBlockIndexes: plan,
        problems: details,
        firstRound: describeFidelityProblems(source, firstRoundProblems)
      })
      host.reportStatus(
        remaining === 0
          ? `有 ${plan.length} 处内容暂时不能安全排版，已按原文作为普通文字显示`
          : `有内容暂时不能安全排版，已按原文作为普通文字显示（仍有 ${remaining} 处结构差异${details.length > 0 ? `：${details.slice(0, 2).join('；')}${details.length > 2 ? ` 等 ${details.length} 处` : ''}` : ''}）`
      )
    })
  }

  /**
   * 对账一次并把结果 emit 出去。
   * 吞并（原文内容被并进别的块）是会丢数据的结构，坚决不写盘：只报状态，不改文件。
   */
  function emitReconciledSource(): void {
    if (disposed || synchronizing) return
    const markdown = host.readMarkdown()
    if (markdown === null) return
    const preserved = reconcileMarkdownSource(
      source,
      baselineCanonical,
      markdown,
      literalRegionOptions()
    )
    const absorbed = findAbsorbedBlocks(source, preserved).filter(
      (item) => !upgradedParagraphTexts.has(item.source.trim())
    )
    if (absorbed.length > 0) {
      console.error('[desk] 保存被拦截：检测到原文内容被并入其它块', absorbed)
      host.reportStatus(
        `检测到 ${absorbed.length} 处内容会被写坏，已暂停保存；你的文件没有被修改（可切到源码视图检查）`
      )
      return
    }
    if (preserved === host.currentPropContent() || preserved === lastEmitted) return
    lastEmitted = preserved
    host.emitSource(preserved)
  }

  function flush(): void {
    if (disposed) return
    host.flushPendingDrafts()
    emitReconciledSource()
  }

  function queueFlush(): void {
    if (disposed || contentSyncQueued) return
    contentSyncQueued = true
    const token = generation
    queueMicrotask(() => {
      // 排队期间外部替换 / 卸载过：这条 flush 属于上一份文档，丢掉。
      if (disposed || token !== generation) return
      contentSyncQueued = false
      emitReconciledSource()
    })
  }

  async function syncExternal(content: string): Promise<void> {
    if (disposed || host.readMarkdown() === null) return
    const viewState = host.captureViewState()
    // 替换前先推进世代：上一份文档排队的 flush / 保真检查全部作废，
    // 免得拿旧原文算出来的计划去降级新文档。
    invalidatePending()
    synchronizing = true
    source = content
    lastEmitted = null
    upgradedParagraphTexts.clear()
    try {
      host.replaceDocument(projectRawBlocksForMilkdown(content))
      baselineCanonical = host.readMarkdown() ?? ''
      host.afterDocumentReplaced()
      scheduleFidelityCheck()
      host.restoreViewState(viewState)
    } finally {
      synchronizing = false
    }
  }

  return {
    markReady(): void {
      if (disposed) return
      // 基线必须与创建编辑器时用的原文配对；不在这里重新读 props。
      baselineCanonical = host.readMarkdown() ?? ''
    },

    handleExternalContent(content: string): void {
      if (disposed || host.readMarkdown() === null) return
      // props 回流的就是我们自己刚 emit 的：吞掉，不回写也不整篇替换。
      if (content === lastEmitted) {
        lastEmitted = null
        return
      }
      void syncExternal(content)
    },

    syncExternal,

    queueFlush,

    flush,

    reconcile(): string {
      const markdown = host.readMarkdown()
      if (markdown === null) return source
      return reconcileMarkdownSource(source, baselineCanonical, markdown, literalRegionOptions())
    },

    adoptSource(next: string): void {
      if (disposed) return
      source = next
      baselineCanonical = host.readMarkdown() ?? baselineCanonical
      // 判定去重键跟着原文走；降级区域下标是文档维度的活映射，故意保留（见文件头）。
      fidelityCheckedFor = null
      host.afterDocumentReplaced()
    },

    noteUpgradedParagraph(text: string): void {
      upgradedParagraphTexts.add(text)
    },

    scheduleFidelityCheck,

    isSynchronizing(): boolean {
      return synchronizing
    },

    dispose(): void {
      disposed = true
      invalidatePending()
    }
  }
}
