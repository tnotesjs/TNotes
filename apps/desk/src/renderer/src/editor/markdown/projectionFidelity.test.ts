// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { Editor, defaultValueCtx, rootCtx } from '@milkdown/kit/core'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'
import { getMarkdown } from '@milkdown/kit/utils'

import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins,
  renderDeskRawBlockElement
} from './rawBlockProjection'
import {
  FIDELITY_CASES,
  FIDELITY_CASE_D3,
  FIDELITY_CASE_FRONTMATTER
} from './projectionFidelity.cases'
import { parseMarkdownSource } from './sourcePreservation'
import {
  actionableProblems,
  canonicalizeMarkdown,
  classifyProjectionFidelity,
  degradableBlockIndexes,
  extendDegradationIndexes,
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

describe('projectionFidelity · 降级计划', () => {
  it('忠实的笔记不需要降级', async () => {
    const source = `${FIDELITY_CASE_FRONTMATTER}# 标题\n\n段落\n`
    const canonical = await projectToCanonical(source)
    expect(degradableBlockIndexes(source, canonical)).toEqual([])
  })

  it('被吞并时把整个涉及区域标成降级', () => {
    const source = '::: tip T\n\n111\n\n:::\n\n222\n'
    const canonical = '::: tip T\n\n111\n222\n\n:::'
    const indexes = degradableBlockIndexes(source, canonical)
    expect(indexes.length).toBeGreaterThan(0)
    expect(indexes).toContain(indexes[indexes.length - 1])
  })

  it('降级的块在投影里变成 unparsed 原始块，其余块照常', async () => {
    const source = `${FIDELITY_CASE_FRONTMATTER}# 标题\n\n::: tip T\n\n外层\n\n::: info I\n\n内层\n\n:::\n\n:::\n\n222\n`
    const canonical = await projectToCanonical(source)
    const indexes = degradableBlockIndexes(source, canonical)
    expect(indexes.length).toBeGreaterThan(0)
    const projected = projectRawBlocksForMilkdown(source, {
      forceRawBlockIndexes: new Set(indexes)
    })
    // 被降级的块写成 unparsed 原始块标记
    expect(projected).toContain('<!--desk-raw-block:v1:unparsed:0:')
    // 标题块没有被降级，仍然走正常投影
    const titleMarker = projectRawBlocksForMilkdown(source)
    expect(titleMarker).not.toContain('unparsed')
  })
})

async function canonicalFromVirtual(virtual: string): Promise<string> {
  const root = document.createElement('div')
  document.body.append(root)
  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, virtual)
    })
    .use(commonmark)
    .use(gfm)
    .use(rawBlockProjectionPlugins)
  editors.push(editor)
  await editor.create()
  return editor.action(getMarkdown())
}

describe('projectionFidelity · 降级之后的文档', () => {
  it('降级重建后的文档判为忠实', async () => {
    const source = `${FIDELITY_CASE_FRONTMATTER}::: tip T\n\n外层\n\n::: info I\n\n内层\n\n:::\n\n:::\n\n222\n`
    const before = await projectToCanonical(source)
    const indexes = degradableBlockIndexes(source, before)
    expect(indexes.length).toBeGreaterThan(0)

    // 迭代扩张直到忠实（与编辑器里的循环同一策略）
    let plan = indexes
    for (let round = 0; round < 8; round += 1) {
      const degraded = projectRawBlocksForMilkdown(source, {
        forceRawBlockIndexes: new Set(plan)
      })
      const rebuilt = await canonicalFromVirtual(degraded)
      if (classifyProjectionFidelity(source, rebuilt).ok) break
      plan = extendDegradationIndexes(source, rebuilt, plan)
    }
    const degraded = projectRawBlocksForMilkdown(source, {
      forceRawBlockIndexes: new Set(plan)
    })
    const after = await canonicalFromVirtual(degraded)
    const report = classifyProjectionFidelity(source, after)
    expect(report.ok, `降级后仍不忠实 → ${report.problematic.map((i) => i.reason).join(',')}`).toBe(
      true
    )
    // 未被降级的块照常渲染：段落 222 还在
    expect(after).toContain('222')
  })

  it('unparsed 块按「正文文字」渲染（带区分用的类名）', () => {
    const element = renderDeskRawBlockElement({
      kind: 'unparsed',
      source: '::: tip T\n\n原文\n',
      hidden: false
    })
    expect(element.dataset.kind).toBe('unparsed')
    expect(element.className).toContain('desk-raw-block--unparsed')
    expect(element.querySelector('.desk-raw-block__unparsed-text')?.textContent).toBe(
      '::: tip T\n\n原文'
    )
  })
})

describe('projectionFidelity · 降级最小性', () => {
  it('只降级出问题的区域，后面的正常段落不动', async () => {
    const source = [
      '---',
      'id: fidelity-e2e',
      '---',
      '',
      '::: tip 正常提示块',
      '',
      '正常正文',
      '',
      ':::',
      '',
      '::: tip T',
      '',
      '外层',
      '',
      '::: info I',
      '',
      '内层',
      '',
      ':::',
      '',
      ':::',
      '',
      '222',
      ''
    ].join('\n')
    // 找到 222 段落所在的顶层块下标
    const sourceBlocks = parseMarkdownSource(source).blocks
    const plainIndex = sourceBlocks.findIndex((block) => block.source.trim() === '222')
    expect(plainIndex).toBeGreaterThan(0)

    let plan = degradableBlockIndexes(source, await projectToCanonical(source))
    for (let round = 0; round < 6; round += 1) {
      const rebuilt = await canonicalFromVirtual(
        projectRawBlocksForMilkdown(source, { forceRawBlockIndexes: new Set(plan) })
      )
      if (classifyProjectionFidelity(source, rebuilt).ok) break
      plan = extendDegradationIndexes(source, rebuilt, plan)
    }
    expect(plan, `plan=${JSON.stringify(plan)} plainIndex=${plainIndex}`).not.toContain(plainIndex)
    const rebuilt = await canonicalFromVirtual(
      projectRawBlocksForMilkdown(source, { forceRawBlockIndexes: new Set(plan) })
    )
    expect(classifyProjectionFidelity(source, rebuilt).ok).toBe(true)
    expect(rebuilt).toContain('222')
  })
})

describe('projectionFidelity · 降级不吞无关内容', () => {
  it('嵌套容器前面的正常段落/表格/列表不会被降级', async () => {
    // 回归：收敛判据一度用 report.ok，导致只剩 content-changed（行内 <br/> 规范化）时
    // 循环仍以为没收敛，一路向左把正常内容吞成原文卡片。
    const source = [
      '---',
      'id: x',
      '---',
      '',
      '# 标题',
      '',
      '普通段落里的行内换行：第一行<br/>第二行。',
      '',
      '| 表头一 | 表头二 |',
      '| --- | --- |',
      '| 第一行<br/>第二行 | 普通单元格 |',
      '',
      '- 列表项 A',
      '- 列表项 B',
      '',
      '::: tip 外层',
      '外层正文',
      '',
      '::: info 内层',
      '内层正文',
      '',
      ':::',
      '',
      ':::',
      '',
      '收尾段落。',
      ''
    ].join('\n')
    const blocks = parseMarkdownSource(source).blocks
    const contentIndexes = blocks
      .map((block, index) => ({ block, index }))
      .filter(
        ({ block }) =>
          block.source.includes('<br/>') || block.kind === 'table' || block.kind === 'list'
      )
      .map(({ index }) => index)
    expect(contentIndexes.length).toBeGreaterThanOrEqual(3)

    let plan = degradableBlockIndexes(source, await projectToCanonical(source))
    for (let round = 0; round < 8; round += 1) {
      const rebuilt = await canonicalFromVirtual(
        projectRawBlocksForMilkdown(source, { forceRawBlockIndexes: new Set(plan) })
      )
      const report = classifyProjectionFidelity(source, rebuilt)
      if (actionableProblems(report).length === 0) break
      const next = extendDegradationIndexes(source, rebuilt, plan)
      if (next.length === plan.length) break
      plan = next
    }
    for (const index of contentIndexes) {
      expect(plan, `plan=${JSON.stringify(plan)} 不该包含内容块 ${index}`).not.toContain(index)
    }
    expect(plan.length).toBeGreaterThan(0)
  })
})
