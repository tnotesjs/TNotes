// @vitest-environment happy-dom

/**
 * canonical 快照闸门：把「可视化编辑器序列化出来的 markdown」固定成可对比的基线。
 *
 * 迁移 `@milkdown/crepe` → 自组 `@milkdown/kit` 时，唯一的硬约束就是**逐字节等价** ——
 * 忠实性判定、sourcePreservation、写盘形态全都建立在 canonical 上。
 *
 * golden 是**迁移前用 Crepe 装配录制的冻结基线**（去掉 crepe 依赖后仍然保留，作为
 * 「序列化不许漂移」的长期契约）；当前由自组装配逐字节对齐。
 * 重新生成：`UPDATE_DESK_CANONICAL=1 pnpm --filter desk exec vitest run deskEditorCanonical`
 * （只在确认行为变化是有意为之、并复核 diff 之后才重新生成。）
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it, vi } from 'vitest'

/**
 * happy-dom 环境没有 doctype → `document.compatMode === 'BackCompat'`，而 KaTeX 会拒绝在
 * quirks mode 下渲染（`KaTeX doesn't work in quirks mode`）。这是**测试环境**问题（真实
 * 浏览器是标准模式），所以在任何模块求值前把 compatMode 声明成标准模式 —— 与
 * `markdownInputRules.test.ts` 的做法一致。
 */
vi.hoisted(() => {
  Object.defineProperty(document, 'compatMode', { configurable: true, value: 'CSS1Compat' })
})

import { imageAttrPlugins } from '../editor/markdown/imageAttrs'
import {
  projectRawBlocksForMilkdown,
  rawBlockProjectionPlugins
} from '../editor/markdown/rawBlockProjection'
import { createDeskEditor } from './deskEditor'
import { DESK_CANONICAL_CASES } from './deskEditorCanonical.cases'

const goldenPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '__golden__',
  'deskEditorCanonical.json'
)
const UPDATE = process.env.UPDATE_DESK_CANONICAL === '1'

function createRoot(): HTMLElement {
  const root = document.createElement('div')
  document.body.append(root)
  return root
}

/** 装配依赖：只读回调与图片上传（canonical 输出与它们无关，但配置需要）。 */
const testDeps = {
  isReadOnly: () => false,
  uploadImage: async () => ({ src: 'https://example.com/uploaded.png' })
}

async function canonicalFromKit(source: string): Promise<string> {
  const root = createRoot()
  const handle = createDeskEditor({
    root,
    defaultValue: projectRawBlocksForMilkdown(source),
    codeBlock: {},
    ...testDeps
  })
  handle.editor.use(rawBlockProjectionPlugins)
  handle.editor.use(imageAttrPlugins)
  try {
    await handle.editor.create()
    return handle.getMarkdown()
  } finally {
    await handle.destroy()
  }
}

function readGolden(): Record<string, string> {
  return JSON.parse(readFileSync(goldenPath, 'utf8')) as Record<string, string>
}

function writeGolden(actual: Record<string, string>): void {
  mkdirSync(dirname(goldenPath), { recursive: true })
  writeFileSync(goldenPath, `${JSON.stringify(actual, null, 2)}\n`)
}

describe('canonical 快照（装配层等价性）', () => {
  it('自组装配的 canonical 与冻结基线逐字节一致', async () => {
    const actual: Record<string, string> = {}
    for (const testCase of DESK_CANONICAL_CASES) {
      actual[testCase.name] = await canonicalFromKit(testCase.source)
    }

    // 只在明确要更新基线时才写盘（默认路径永远是对比，避免「顺手把漂移录进去」）。
    if (UPDATE) {
      writeGolden(actual)
      return
    }

    const golden = readGolden()
    for (const testCase of DESK_CANONICAL_CASES) {
      expect(actual[testCase.name], testCase.name).toBe(golden[testCase.name])
    }
  }, 120_000)
})
