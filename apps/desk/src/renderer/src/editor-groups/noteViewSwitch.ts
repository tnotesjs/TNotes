/**
 * 保存被拦下时的「能不能安全切到源码视图」判定。
 *
 * 背景：可视化编辑器与源码视图是两个 `v-if` / `v-else` 的组件，切换会**销毁**前者。
 * 保存被拦下时（`emitReconciledSource` 拒绝写回），编辑器里比 store 新的那部分修改
 * **只存在编辑器内存里** —— 直接切过去，用户刚写的内容会当场消失。
 *
 * 所以切换前必须判定：
 * 1. 没有未 emit 的草稿 → 正常切换；
 * 2. 有草稿 → 用**与保存同一条校验**（吞并检测）复验，确认不会丢原文块，才允许把草稿
 *    作为源码视图初值带过去；
 * 3. 复验不过 → 拒绝切换（保留编辑器），由调用方提示用户先处理草稿。
 *
 * `exportDraft()` 出来的 Markdown **默认不可信**：它可能正是「写回去会吞掉原文」的那份，
 * 这里绝不把它当成可保存的源码。
 */

import { findAbsorbedBlocks } from '../editor/markdown/projectionFidelity'

export type ViewSwitchDecision =
  /** 正常切换：没有未 emit 的草稿。 */
  | { kind: 'normal' }
  /** 允许切换，并把草稿作为源码视图初值（保存仍走原有校验）。 */
  | { kind: 'switch-with-draft'; carriedDraft: string }
  /** 危险切换：草稿无法安全携带，必须保留编辑器。 */
  | { kind: 'blocked'; reason: string }

export interface ViewSwitchInput {
  hasUnsavedDraft: boolean
  draft: string | null
  /** store 里最后一次成功写入的内容（也就是吞并检测的「原文」基线）。 */
  storeSource: string | null
  /** 可注入，便于单测；默认真实的吞并检测。 */
  isAbsorbed?: (source: string, draft: string) => boolean
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
  const absorbed = input.isAbsorbed ?? defaultIsAbsorbed
  let safe = false
  try {
    safe = !absorbed(input.storeSource, draft)
  } catch {
    safe = false
  }
  if (!safe) {
    return {
      kind: 'blocked',
      reason: '当前修改无法完整转换到源码视图（会丢原文内容），已在原地保留编辑器。'
    }
  }
  return { kind: 'switch-with-draft', carriedDraft: draft }
}

function defaultIsAbsorbed(source: string, draft: string): boolean {
  return findAbsorbedBlocks(source, draft).length > 0
}
