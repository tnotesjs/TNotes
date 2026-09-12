// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, rootCtx } from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'
import { getMarkdown } from '@milkdown/kit/utils'

import { projectRawBlocksForMilkdown, rawBlockProjectionPlugins } from './rawBlockProjection'
import {
  FIDELITY_CASES,
  FIDELITY_CASE_D3,
  FIDELITY_CASE_FRONTMATTER
} from './projectionFidelity.cases'
import {
  canonicalizeMarkdown,
  classifyProjectionFidelity,
  findAbsorbedBlocks
} from './projectionFidelity'

const editors: Editor[] = []

afterEach(async () => {
  await Promise.all(editors.splice(0).map((editor) => editor.destroy()))
  document.body.replaceChildren()
})

async function projectToCanonical(source: string): Promise<string> {
  const root = document.createElement('div')
  document.body.append(root)
  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, projectRawBlocksForMilkdown(source))
    })
    .use(commonmark)
    .use(gfm)
    .use(rawBlockProjectionPlugins)
  editors.push(editor)
  await editor.create()
  return editor.action(getMarkdown())
}

describe('projectionFidelity · 判定', () => {
  it('完全相同判为忠实', () => {
    const source = '# 标题\n\n段落一\n\n段落二\n'
    expect(classifyProjectionFidelity(source, source).ok).toBe(true)
  })

  it('允许的规范化全部放行', () => {
    const pairs: Array<[string, string]> = [
      ['---\n\n正文\n', '***\n\n正文\n'],
      ['* 项目\n+ 项目二\n', '- 项目\n\n- 项目二\n'],
      ['111\r\n\r\n222\r\n', '111\n\n222\n'],
      ['111\n\n\n\n222\n', '111\n\n222\n'],
      ['111 ![图]( 222\n', '111 !\\[图]\\( 222\n'],
      ['::: tip T\n\n内\n\n:::\n', ':::: tip T\n\n内\n\n::::\n'],
      ['::: tip T\n\n111\n', '::: tip T\n\n111\n\n:::\n'],
      ['---\nid: x\n---\n\n正文\n', '---\nid: y\n---\n\n正文\n']
    ]
    for (const [source, canonical] of pairs) {
      const report = classifyProjectionFidelity(source, canonical)
      expect(report.ok, `应判忠实：${JSON.stringify(source)} ↔ ${JSON.stringify(canonical)}`).toBe(
        true
      )
    }
  })

  it('行尾空格被吞掉判为不忠实（硬换行有意义）', () => {
    const report = classifyProjectionFidelity('111  \n\n222\n', '111\n\n222\n')
    expect(report.ok).toBe(false)
    expect(report.problematic[0]?.reason).toBe('content-changed')
  })

  it('内容被并进别的块判为 absorbed', () => {
    const source = '::: tip T\n\n111\n\n:::\n\n222\n'
    const canonical = '::: tip T\n\n111\n222\n\n:::\n'
    const report = classifyProjectionFidelity(source, canonical)
    expect(report.ok).toBe(false)
    expect(report.problematic.map((item) => item.reason)).toContain('absorbed')
  })

  it('块消失判为 lost，多出来判为 extra，顺序变了判为 reordered', () => {
    const lost = classifyProjectionFidelity('111\n\n222\n', '111\n')
    expect(lost.problematic[0]?.reason).toBe('lost')
    expect(lost.structureOk).toBe(false)

    const extra = classifyProjectionFidelity('111\n', '111\n\n222\n')
    expect(extra.problematic[0]?.reason).toBe('extra')

    const reordered = classifyProjectionFidelity('111\n\n222\n', '222\n\n111\n')
    expect(reordered.problematic[0]?.reason).toBe('reordered')
  })

  it('保存守卫只认「内容还在、但没了独立归宿」，不误伤主动删除', () => {
    // 用户主动删掉一段：内容彻底不在了 → 不是问题
    expect(findAbsorbedBlocks('111\n\n222\n\n333\n', '111\n\n333\n')).toEqual([])
    // 内容被邻居吞掉：必须拦
    const absorbed = findAbsorbedBlocks(
      '::: tip T\n\n111\n\n:::\n\n222\n',
      '::: tip T\n\n111\n222\n\n:::\n'
    )
    expect(absorbed).toHaveLength(1)
    expect(absorbed[0]?.reason).toBe('absorbed')
    expect(absorbed[0]?.source).toContain('222')
  })

  it('canonicalizeMarkdown 是幂等的', () => {
    for (const item of FIDELITY_CASES) {
      const once = canonicalizeMarkdown(item.source)
      expect(canonicalizeMarkdown(once)).toBe(once)
    }
  })
})

describe('projectionFidelity · 用例集（真实投影链路）', () => {
  it.each([...FIDELITY_CASES, FIDELITY_CASE_D3])('$id $title（$expected）', async (item) => {
    const source = `${FIDELITY_CASE_FRONTMATTER}${item.source}`
    const canonical = await projectToCanonical(source)
    const report = classifyProjectionFidelity(source, canonical)
    const detail = report.problematic
      .map((block) => `${block.reason}@${block.index}:${JSON.stringify(block.source.slice(0, 30))}`)
      .join(' | ')
    if (item.expected === 'faithful') {
      expect(report.ok, `${item.id} 判为不忠实 → ${detail}`).toBe(true)
    } else {
      expect(report.ok, `${item.id} 已变成忠实，请更新用例期望`).toBe(false)
    }
  })
})
