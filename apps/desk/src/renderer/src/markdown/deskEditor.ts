import {
  Editor,
  EditorStatus,
  defaultValueCtx,
  editorViewCtx,
  editorViewOptionsCtx,
  rootCtx
} from '@milkdown/kit/core'
import type { CodeBlockConfig } from '@milkdown/kit/component/code-block'
import { block } from '@milkdown/kit/plugin/block'
import { clipboard } from '@milkdown/kit/plugin/clipboard'
import { history } from '@milkdown/kit/plugin/history'
import { indent, indentConfig } from '@milkdown/kit/plugin/indent'
import { listener } from '@milkdown/kit/plugin/listener'
import { trailing } from '@milkdown/kit/plugin/trailing'
import { upload } from '@milkdown/kit/plugin/upload'
import { commonmark } from '@milkdown/kit/preset/commonmark'
import { gfm } from '@milkdown/kit/preset/gfm'
import { getMarkdown } from '@milkdown/kit/utils'

import {
  blockEdit,
  type BlockEditFeatureConfig,
  type DeskBlockEditFeatures
} from './crepePort/blockEdit'
import { codeMirror } from './crepePort/codemirror'
import { cursor } from './crepePort/cursor'
import { latex, type LatexFeatureConfig } from './crepePort/latex'
import { linkTooltip } from './crepePort/linktooltip'
import { listItem } from './crepePort/listitem'
import { placeholder, type DeskPlaceholderConfig } from './crepePort/placeholder'
import { table } from './crepePort/table'
import { toolbar, type ToolbarFeatureConfig } from './crepePort/toolbar'
import { type DeskToolbarFeatures } from './crepePort/toolbar/features'
import { applyDeskEditorConfigs, type DeskEditorConfigOptions } from './deskEditorConfigs'

/**
 * Desk 的编辑器装配（替代 `@milkdown/crepe` 的 `Crepe` 类）。
 *
 * 这里复刻的是 Crepe `lib/esm/builder.js` 里那套基座装配：
 *   `Editor.make().config(root/defaultValue/editable/indent=4).use(commonmark, listener,
 *   history, indent, trailing, clipboard, upload, gfm)`
 * 外加 Crepe 各 feature 中属于「kit 直供能力」的部分（code block / list item / table /
 * link tooltip / cursor / placeholder / block handle），见 `crepePort/`（MIT 移植，附来源）。
 *
 * **尚未并入**（迁移计划里的后续阶段）：
 *   - latex（`math_inline` / `math_block` / remark-math / KaTeX 预览）—— 阶段 P2
 *   - 选区格式工具条（Crepe toolbar）—— 阶段 P4
 * 在这些并入之前，可视化编辑器仍走 Crepe；本模块由 canonical 快照测试与后续切换使用。
 *
 * 与 Crepe 的语义对齐点：`getMarkdown()` = `editor.action(getMarkdown())`、
 * `setReadonly()` = 闭包可编辑标记 + `view.setProps({ editable })`、`destroy()` =
 * `editor.destroy()`。
 */
export interface DeskEditorOptions extends DeskEditorConfigOptions {
  root: HTMLElement
  defaultValue: string
  /** Desk 的代码块配置（语言、CodeMirror 扩展、主题、复制按钮文案等）。 */
  codeBlock: Partial<CodeBlockConfig>
  placeholder?: DeskPlaceholderConfig
  /** 行内/块级公式（`math_inline`、`$$` 代码块预览、KaTeX 选项）。 */
  latex?: LatexFeatureConfig
  /** 斜杠菜单 / 块手柄（与 Crepe 装配共用 `createDeskBlockEditConfig` 的产物）。 */
  blockEdit?: BlockEditFeatureConfig
  /** 斜杠菜单里按 feature 显隐的项（默认 latex 开、image-block 关、table 开，与生产一致）。 */
  blockEditFeatures?: DeskBlockEditFeatures
  /** 选区格式工具条（图标/文案/自定义项）。 */
  toolbar?: ToolbarFeatureConfig
  /** 工具条里按 feature 显隐的项（默认 latex 开、ai 关 —— Desk 没有 AI）。 */
  toolbarFeatures?: DeskToolbarFeatures
}

export interface DeskEditorHandle {
  /** Milkdown `Editor`：Desk 自己的插件都挂在它上面。 */
  editor: Editor
  getMarkdown(): string
  setReadonly(value: boolean): void
  destroy(): Promise<void>
}

export function createDeskEditor(options: DeskEditorOptions): DeskEditorHandle {
  let editable = !options.isReadOnly()

  const editor = Editor.make()
    .config((ctx) => {
      ctx.set(rootCtx, options.root)
      ctx.set(defaultValueCtx, options.defaultValue)
      ctx.set(editorViewOptionsCtx, { editable: () => editable })
      ctx.update(indentConfig.key, (value) => ({ ...value, size: 4 }))
    })
    .use(commonmark)
    .use(listener)
    .use(history)
    .use(indent)
    .use(trailing)
    .use(clipboard)
    .use(upload)
    .use(gfm)
    .use(block)

  // 序列化选项、删除线快捷键、块手柄过滤、图片上传：与生产装配共用同一份配置。
  applyDeskEditorConfigs(editor, options)

  codeMirror(editor, options.codeBlock)
  listItem(editor)
  table(editor)
  linkTooltip(editor)
  cursor(editor)
  placeholder(editor, { config: options.placeholder, isReadOnly: options.isReadOnly })
  latex(editor, options.latex)
  blockEdit(editor, options.blockEdit, options.blockEditFeatures)
  toolbar(editor, options.toolbar, options.toolbarFeatures)

  return {
    editor,
    getMarkdown: () => editor.action(getMarkdown()),
    setReadonly: (value) => {
      editable = !value
      if (editor.status === EditorStatus.Created) {
        editor.action((ctx) => ctx.get(editorViewCtx).setProps({ editable: () => editable }))
      }
    },
    destroy: async () => {
      await editor.destroy()
    }
  }
}
