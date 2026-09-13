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
`cursor`（含虚拟光标 `prosemirror-virtual-cursor`）、`placeholder`。

待移植（见迁移计划）：`latex`（P2）、斜杠菜单（P3）、`toolbar`（P4）。

上游许可：Milkdown / Crepe 均为 MIT。
