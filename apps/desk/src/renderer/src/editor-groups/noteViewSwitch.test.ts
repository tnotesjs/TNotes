import { describe, expect, it } from 'vitest'

import { decideViewSwitch } from './noteViewSwitch'

describe('保存被拦下时能否切到源码视图', () => {
  it('没有未 emit 的草稿 → 正常切换', () => {
    expect(decideViewSwitch({ hasUnsavedDraft: false })).toEqual({ kind: 'normal' })
  })

  it('有草稿 → 拒绝切换（不做任何「结构看起来没问题」的推断）', () => {
    const decision = decideViewSwitch({ hasUnsavedDraft: true })
    expect(decision.kind).toBe('blocked')
    if (decision.kind === 'blocked') {
      expect(decision.reason).toContain('保留编辑器')
    }
  })
})

/**
 * 验收反例（P1）：原文「标题 + 特殊原文」→ 草稿「标题 + 新增内容」。
 * 块数一致、结构报告只是 content-changed，与「用户主动改写」同形 ——
 * 旧实现据此放行；现在一律拒绝，不再把结构检查当完整性证明。
 */
describe('结构检查不能当作完整性证明', () => {
  it('同块数替换（特殊原文被换掉）也必须拒绝', () => {
    expect(decideViewSwitch({ hasUnsavedDraft: true }).kind).toBe('blocked')
  })
})
