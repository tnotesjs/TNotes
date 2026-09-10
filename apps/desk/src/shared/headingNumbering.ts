/** 标题编号层级上限的共享常量与钳制（main 的 zod schema 与 renderer 的纯函数共用）。 */

export const HEADING_NUMBER_MAX_DEPTH = 6
export const HEADING_NUMBER_DEFAULT_MAX_DEPTH = 2

export function clampHeadingNumberMaxDepth(value: number): number {
  if (!Number.isFinite(value)) return HEADING_NUMBER_DEFAULT_MAX_DEPTH
  return Math.min(HEADING_NUMBER_MAX_DEPTH, Math.max(1, Math.round(value)))
}
