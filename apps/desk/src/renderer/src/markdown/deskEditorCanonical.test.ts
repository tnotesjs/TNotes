// @vitest-environment happy-dom

/**
 * canonical 快照闸门：把「可视化编辑器序列化出来的 markdown」固定成可对比的基线。
 *
 * 迁移 `@milkdown/crepe` → 自组 `@milkdown/kit` 时，唯一的硬约束就是**逐字节等价** ——
 * 忠实性判定、sourcePreservation、写盘形态全都建立在 canonical 上。
 *
 * golden 用 Crepe 装配生成（迁移前的现状），随后由 kit 装配对齐；
 * 重新生成：`UPDATE_DESK_CANONICAL=1 pnpm --filter desk exec vitest run deskEditorCanonical`
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Crepe } from '@milkdown/crepe'
import { getMarkdown } from '@milkdown/kit/utils'
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
import { applyDeskEditorConfigs } from './deskEditorConfigs'
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

/**
 * canonical 输出只由「schema + remark 插件 + 序列化选项」决定，因此两条装配路径都挂
 * 同一组投影/图片插件、走同一份共享配置（`applyDeskEditorConfigs`），差异只可能来自装配层。
 */
const testDeps = {
  isReadOnly: () => false,
  uploadImage: async () => ({ src: 'https://example.com/uploaded.png' })
}

async function canonicalFromCrepe(source: string): Promise<string> {
  const root = createRoot()
  // 必须与生产一致：Desk 关掉了 ImageBlock（见 MilkdownMarkdownEditor.vue），
  // 否则基线会把 image-block 特性带来的序列化差异也记进 golden。
  const crepe = new Crepe({
    root,
    defaultValue: projectRawBlocksForMilkdown(source),
    features: { [Crepe.Feature.ImageBlock]: false }
  })
  crepe.editor.use(rawBlockProjectionPlugins)
  crepe.editor.use(imageAttrPlugins)
  applyDeskEditorConfigs(crepe.editor, testDeps)
  try {
    await crepe.create()
    return crepe.editor.action(getMarkdown())
  } finally {
    await crepe.destroy()
  }
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
  it('Crepe 装配（现状基线）与 golden 一致', async () => {
    const actual: Record<string, string> = {}
    for (const testCase of DESK_CANONICAL_CASES) {
      actual[testCase.name] = await canonicalFromCrepe(testCase.source)
    }

    if (UPDATE) {
      writeGolden(actual)
      return
    }

    const golden = readGolden()
    for (const testCase of DESK_CANONICAL_CASES) {
      expect(actual[testCase.name], testCase.name).toBe(golden[testCase.name])
    }
  }, 120_000)

  // 已经成立：基座 + kit 直供能力 + 共享配置就足以逐字节复现 canonical（公式亦然 ——
  // 有没有 remark-math，`$x^2$` 的序列化字节都一样）。所以这条断言从现在起就开着，
  // 后续 P2–P4 每并入一个 feature 都要继续保持绿。
  // 注意：canonical 等价 **不等于** 渲染等价 —— latex 的 KaTeX 预览、斜杠菜单、工具条
  // 仍必须移植（P2–P4），否则是可见的 UI 回归。
  it('kit 自组装配与 golden 一致', async () => {
    const golden = readGolden()
    for (const testCase of DESK_CANONICAL_CASES) {
      const canonical = await canonicalFromKit(testCase.source)
      expect(canonical, testCase.name).toBe(golden[testCase.name])
    }
  }, 120_000)
})
