/**
 * 移植自 `@milkdown/crepe@7.22.1` 的 `src/feature/latex/index.ts`（MIT）。
 *
 * 改动：去掉 Crepe 的 `FeaturesCtx`/`CrepeCtx`、`DefineFeature` 类型与
 * 「必须先开 code-mirror」的 feature 标志查询（Desk 的装配里 code block 恒在），
 * 其余（`$$` 代码块预览、行内公式 tooltip、schema、输入规则、remark 插件）原样保留。
 *
 * 这一坨属于**序列化等价性**：`math_inline` schema 与 `remark-math` 决定 `$x^2$` 的
 * 解析/写回形态，改动前后 canonical 必须逐字节一致（见 deskEditorCanonical.test.ts）。
 */
import { codeBlockConfig } from '@milkdown/kit/component/code-block'
import type { Editor } from '@milkdown/kit/core'
import katex, { type KatexOptions } from 'katex'

import { blockLatexSchema } from './block-latex'
import { toggleLatexCommand } from './command'
import { confirmIcon } from './confirmIcon'
import { mathInlineSchema } from './inline-latex'
import { inlineLatexTooltip } from './inline-tooltip/tooltip'
import { LatexInlineTooltip } from './inline-tooltip/view'
import { mathBlockInputRule, mathInlineInputRule } from './input-rule'
import { remarkMathBlockPlugin, remarkMathPlugin } from './remark'

export interface LatexConfig {
  katexOptions: KatexOptions
  inlineEditConfirm: string
}

export type LatexFeatureConfig = Partial<LatexConfig>

export function latex(editor: Editor, config?: LatexFeatureConfig): void {
  editor
    .config((ctx) => {
      ctx.update(codeBlockConfig.key, (prev) => ({
        ...prev,
        renderPreview: (language, content, applyPreview) => {
          if (language.toLowerCase() === 'latex' && content.length > 0) {
            return renderLatex(content, config?.katexOptions)
          }
          const renderPreview = prev.renderPreview
          return renderPreview(language, content, applyPreview)
        }
      }))

      ctx.set(inlineLatexTooltip.key, {
        view: (view) => {
          return new LatexInlineTooltip(ctx, view, {
            inlineEditConfirm: config?.inlineEditConfirm ?? confirmIcon,
            ...config
          })
        }
      })
    })
    .use(remarkMathPlugin)
    .use(remarkMathBlockPlugin)
    .use(mathInlineSchema)
    .use(inlineLatexTooltip)
    .use(mathInlineInputRule)
    .use(mathBlockInputRule)
    .use(blockLatexSchema)
    .use(toggleLatexCommand)
}

function renderLatex(content: string, options?: KatexOptions): string {
  return katex.renderToString(content, {
    ...options,
    throwOnError: false,
    displayMode: true
  })
}
