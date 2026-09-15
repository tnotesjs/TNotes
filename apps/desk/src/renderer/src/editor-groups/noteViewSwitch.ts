/**
 * 保存被拦下时的「能不能安全切到源码视图」判定。
 *
 * 背景：可视化编辑器与源码视图是两个 `v-if` / `v-else` 的组件，切换会**销毁**前者。
 * 保存被拦下时（`emitReconciledSource` 拒绝写回），编辑器里比 store 新的那部分修改
 * **只存在编辑器内存里** —— 直接切过去，用户刚写的内容会当场消失。
 *
 * 判定原则：**证明不了完整，就不许切**（保留编辑器，由调用方给出口）。
 *
 * - 没有未 emit 的草稿 → 正常切换；
 * - 有草稿 → 必须过完整性证明：既不能吞并原文（保存那条校验），也不能有整块丢失 /
 *   多出的结构差异（`lost` / `extra`）；
 * - 证明不过（拿不到草稿 / 拿不到基线 / 校验抛错 / 任一项不干净）→ 拒绝切换。
 *
 * 为什么要加 `lost` / `extra`：`findAbsorbedBlocks` **只查吞并**，「原文某段整块消失」
 * 它不看 —— 只凭它放行，等于把「没吞并」误当成「转换完整」。
 *
 * 传入的 `draft` 应当是**保留原文那份对账结果**（`session.reconcile()`），
 * 而不是编辑器序列化出来的裸 canonical：前者对未编辑块逐字取原文，后者会顺手规范化。
 * 无论如何，它都是「待证明」的输入，不是可信源码。
 */

import {
  actionableProblems,
  canonicalizeMarkdown,
  classifyProjectionFidelity,
  findAbsorbedBlocks
} from '../editor/markdown/projectionFidelity'
import { parseMarkdownSource } from '../editor/markdown/sourcePreservation'

export type ViewSwitchDecision =
  /** 正常切换：没有未 emit 的草稿。 */
  | { kind: 'normal' }
  /** 允许切换，并把草稿带进文档会话（保存仍走原有校验）。 */
  | { kind: 'switch-with-draft'; carriedDraft: string }
  /** 危险切换：草稿无法证明完整，必须保留编辑器。 */
  | { kind: 'blocked'; reason: string }

export interface ViewSwitchInput {
  hasUnsavedDraft: boolean
  /** 待证明的草稿（建议传 `session.reconcile()` 的保留原文结果）。 */
  draft: string | null
  /** store 里最后一次成功写入的内容（也就是校验用的「原文」基线）。 */
  storeSource: string | null
  /** 可注入，便于单测；默认真实的**完整**性证明。 */
  isComplete?: (source: string, draft: string) => boolean
}

export function decideViewSwitch(input: ViewSwitchInput): ViewSwitchDecision {
  if (!input.hasUnsavedDraft) return { kind: 'normal' }
  const draft = input.draft
  if (typeof draft !== 'string' || draft.length === 0) {
    return { kind: 'blocked', reason: '拿不到当前修改，无法安全转换到源码视图。' }
  }
  if (typeof input.storeSource !== 'string') {
    return { kind: 'blocked', reason: '拿不到原文基线，无法验证这次转换是否完整。' }
  }
  const isComplete = input.isComplete ?? defaultIsComplete
  let safe = false
  try {
    safe = isComplete(input.storeSource, draft)
  } catch {
    safe = false
  }
  if (!safe) {
    return {
      kind: 'blocked',
      reason: '当前修改无法证明完整转换到源码视图（可能丢原文内容），已在原地保留编辑器。'
    }
  }
  return { kind: 'switch-with-draft', carriedDraft: draft }
}

/**
 * 完整性证明。
 *
 * 三条一起看，缺一不可：
 * 1. **吞并**：`findAbsorbedBlocks`（与保存同一条校验）—— 原文内容被并进别的块；
 * 2. **块数 1:1**：投影机制保证「1 个原块 ↔ 1 个块」，数量一变就说明有块被吞 / 丢 / 多出。
 *    这条专门堵「整段消失」：那种情况下 verdict 只是 `content-changed` / `reordered`
 *    （看起来跟正常编辑一模一样），只看 verdict 会被放行；
 * 3. **结构对应**：`actionableProblems`（吞并 / 丢失 / 多出）为空。
 *
 * 已知边界（宁可保守）：块数一致但「同一位置被换成别的块」这种替换式丢失，靠现有信息
 * 无法与「用户改写这一段」区分 —— 所以这条通道依然只用于**证明通过**的情形，
 * 证明不过一律保留编辑器；最差只是「这次不能切」，不会丢内容。
 */
export function defaultIsComplete(source: string, draft: string): boolean {
  if (findAbsorbedBlocks(source, draft).length > 0) return false
  const sourceBlocks = parseMarkdownSource(canonicalizeMarkdown(source)).blocks
  const draftBlocks = parseMarkdownSource(canonicalizeMarkdown(draft)).blocks
  if (sourceBlocks.length !== draftBlocks.length) return false
  return actionableProblems(classifyProjectionFidelity(source, draft)).length === 0
}
