# crepePort —— 从 `@milkdown/crepe` 移植过来的编辑器特性

这些文件是从 `@milkdown/crepe@7.22.1`（MIT）的 `lib/esm/feature/*` 复制并做最小改动的
源码，用来在**不依赖 crepe** 的前提下保留原有的 UI 行为、图标与 DOM 类名。

改动原则（每个文件头部也写了）：

- 去掉 Crepe 自己的 `FeaturesCtx` / `CrepeCtx` 两个 slice 与 `crepeFeatureConfig()` —— 那只
  用于 Crepe 的 feature 开关登记，我们用自己的装配参数表达；
- 把「只读」等从 Crepe 实例上读的状态改为回调参数（如 `placeholder`）；
- **其余（图标常量、文案默认值、配置键、插件实现）原样保留**，避免视觉/行为漂移；
- 补上 TypeScript 类型（配置类型直接复用 `@milkdown/kit/component/*` 导出的 `*Config`）。

已移植：`codeMirror`（code block + CodeMirror 装配）、`listItem`、`table`、`linkTooltip`、
`cursor`（含虚拟光标 `prosemirror-virtual-cursor`）、`placeholder`、`latex/`（`math_inline` /
块级 LaTeX schema、`remark-math`、KaTeX 渲染、输入规则、行内公式 tooltip、`$$` 代码块预览）。

`latex/` 直接取自 Crepe 的 **TypeScript 源码** `src/feature/latex/**`（不是编译产物），
只有两处改动：`index.ts` 去掉 Crepe 的 feature 开关登记、`inline-tooltip/component.tsx`
用等价的 `h()` 渲染函数重写（原文件是 JSX，本仓没有 JSX 编译管线）。

`blockEdit/`（P3）同样取自 `src/feature/block-edit/**`：`index.ts`（feature 入口）、
`menu/*`（斜杠菜单：`config.ts` 默认分组与图标、`component.tsx` Vue 菜单、`utils.ts` 项类型）、
`handle/*`（块手柄的 `+`/拖拽按钮）。同时移植了它依赖的两小块 Crepe 代码：
`utils/`（`group-builder` / `checker` / `types` / `keep-alive`）与 `icons/`（只取 block-edit
用到的 18 个图标）。改动同样只有「去掉 feature 登记表」这一处：`features.ts` 用显式参数
`{ latex, imageBlock, table }` 取代 Crepe 的 `useCrepeFeatures`，
并把 `buildMenu` 的参数改成结构化类型（两个 `GroupBuilder` 类各带私有字段，名义类型互不兼容）。

`toolbar/`（P4）取自 `src/feature/toolbar/**`：`index.ts`（`.milkdown-toolbar` 容器 +
TooltipProvider 的 shouldShow 判定）、`component.tsx`（Vue 工具条）、`config.ts`（默认项：
粗体/斜体/删除线 + 行内代码/公式/链接）、`features.ts`（`{ latex, ai }`，Desk 默认 ai:false
—— 「Ask AI」按钮与其依赖一并移除）。它依赖的 `utils/keyboard-shortcut.ts` 与 5 个图标
（bold/code/italic/link/strikethrough）也一并移植。

**至此 Crepe 里 Desk 用到的 12 个 feature 全部由本目录覆盖**（ai / top-bar / image-block
按计划未移植），`@milkdown/crepe` 已从依赖中移除。

本目录**刻意保持与上游一致**（便于 diff 与重新移植）：既不进 eslint，也在
`apps/desk/.prettierignore` 里排除（上游用的是另一套 prettier 配置）。仍受 `tsc` 约束。

上游许可：Milkdown / Crepe 均为 MIT。
