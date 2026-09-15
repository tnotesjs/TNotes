/**
 * 保存被拦下时的「能不能切到源码视图」判定。
 *
 * 背景：可视化编辑器与源码视图是两个 `v-if` / `v-else` 的组件，切换会**销毁**前者。
 * 保存被拦下时（`emitReconciledSource` 拒绝写回），编辑器里比 store 新的那部分修改
 * **只存在编辑器内存里**。
 *
 * ## 结论：有草稿就一律不自动携带
 *
 * 曾经想用「结构检查通过」当完整性证明（吞并为空 + 块数 1:1 + 无 lost / extra），
 * 但这条路是错的：**原文块被替换成别的块**（如「特殊原文」变成「新增内容」）时，
 * 块数一致、结构报告也只是 `content-changed` —— 与「用户主动改写这一段」完全同形。
 * 没有事务级的编辑记录，就区分不了「用户改的」和「转换丢的」。
 *
 * 所以：**证明不了就不携带**。这里只回答「能不能安全切」：有草稿 → 不行，保留编辑器。
 * 用户的出口只有两条，都不绕过保护：
 * - 在可视化编辑器里把问题处理掉（例如撤销那次改动），回归正常保存；
 * - 「复制当前修改」把草稿取出来留存（先预览，再确认）。
 *
 * 曾经有过「复制成功后就允许切换」的逃生口，但它保护不了「复制等待期间新写的修改」，
 * 也保护不了「导出本身就有遗漏」的情形 —— 已删除，不再新增绕过保护的入口。
 *
 * `exportDraft()` 出来的内容默认**不可信**：这里不做任何「看起来没问题就放行」的推断。
 */

export type ViewSwitchDecision =
  /** 正常切换：没有未 emit 的草稿。 */
  | { kind: 'normal' }
  /** 危险切换：编辑器里有未写回的草稿，必须保留编辑器。 */
  | { kind: 'blocked'; reason: string }

export interface ViewSwitchInput {
  hasUnsavedDraft: boolean
}

export function decideViewSwitch(input: ViewSwitchInput): ViewSwitchDecision {
  if (!input.hasUnsavedDraft) return { kind: 'normal' }
  return {
    kind: 'blocked',
    reason: '编辑器里还有未写回的修改，无法保证完整转换到源码视图，已在原地保留编辑器。'
  }
}
