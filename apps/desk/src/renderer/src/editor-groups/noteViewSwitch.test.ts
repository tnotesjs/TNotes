import { describe, expect, it } from 'vitest'

import { decideViewSwitch } from './noteViewSwitch'

const SPECIAL = '# 特殊原文（Desk 不支持的写法）\n\n::: unknown\n\nx\n\n:::\n'
const EDITED = `${SPECIAL}\n我刚写的一段。\n`

describe('保存被拦下时能否切到源码视图', () => {
  it('没有未 emit 的草稿 → 正常切换，不携带任何草稿', () => {
    expect(
      decideViewSwitch({ hasUnsavedDraft: false, draft: EDITED, storeSource: SPECIAL })
    ).toEqual({ kind: 'normal' })
  })

  it('有草稿但转换不完整（会吞并原文）→ 拒绝切换', () => {
    const decision = decideViewSwitch({
      hasUnsavedDraft: true,
      draft: EDITED,
      storeSource: SPECIAL,
      isAbsorbed: () => true
    })
    expect(decision.kind).toBe('blocked')
  })

  it('校验通过 → 允许切换，并把「特殊原文 + 新修改」一起带过去', () => {
    const decision = decideViewSwitch({
      hasUnsavedDraft: true,
      draft: EDITED,
      storeSource: SPECIAL,
      isAbsorbed: () => false
    })
    expect(decision).toEqual({ kind: 'switch-with-draft', carriedDraft: EDITED })
    if (decision.kind === 'switch-with-draft') {
      expect(decision.carriedDraft).toContain('特殊原文')
      expect(decision.carriedDraft).toContain('我刚写的一段。')
    }
  })

  it('拿不到草稿 / 拿不到原文基线 → 拒绝切换（不猜）', () => {
    expect(
      decideViewSwitch({ hasUnsavedDraft: true, draft: null, storeSource: SPECIAL }).kind
    ).toBe('blocked')
    expect(decideViewSwitch({ hasUnsavedDraft: true, draft: EDITED, storeSource: null }).kind).toBe(
      'blocked'
    )
  })

  it('默认走真实吞并检测：真·吞并草稿被拦下、干净草稿放行', () => {
    // 与 documentSync 的吞并用例同源：编辑器把独立的 222 并进了提示块
    const absorbed = '::: tip T\n\n111\n222\n\n:::'
    const source = '::: tip T\n\n111\n\n:::\n\n222\n'
    expect(
      decideViewSwitch({ hasUnsavedDraft: true, draft: absorbed, storeSource: source }).kind
    ).toBe('blocked')
    expect(
      decideViewSwitch({ hasUnsavedDraft: true, draft: source, storeSource: source }).kind
    ).toBe('switch-with-draft')
  })

  it('校验函数抛异常时按「不可信」处理，不切换', () => {
    const decision = decideViewSwitch({
      hasUnsavedDraft: true,
      draft: EDITED,
      storeSource: SPECIAL,
      isAbsorbed: () => {
        throw new Error('boom')
      }
    })
    expect(decision.kind).toBe('blocked')
  })
})
