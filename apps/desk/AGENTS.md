# Desk

Electron + Vue 3。可视化编辑器用 Milkdown / Crepe，源码视图是独立 CodeMirror 6。知识库读写 `@tnotesjs/kb`，预览 `@tnotesjs/ssg`，共享块 `@tnotesjs/ui`。

- Markdown 是磁盘 canonical。自定义语法经 `rawBlockProjection.ts` 投影为 `deskRawBlock`；`sourcePreservation.ts` 保证未编辑块字节级零 diff。
- 独占一行的 `<br />` 不投影，交给 Milkdown `remark-preserve-empty-line`。段内 / 表格内 `<br>` 仍走投影。
- 自由绘图的磁盘真相源是 `assets/*.excalidraw`，不是旁边的 `.svg` / `.png`。后者是历史派生产物。Desk 与 SSG 共用 `@tnotesjs/ui` 的同一套 Excalidraw 组件消费该文件：Desk 侧是标签页（`editor-groups/ExcalidrawTabPane.vue`）与笔记内嵌卡片（`markdown/deskRawBlockView/excalidraw.ts`），两者共用 `editor/excalidraw/canvasController.ts`；SSG 侧是 `data-tn-island="excalidraw"` 只读岛。`.excalidraw` 的清理保护仍然有效，派生 SVG 的移除是后续专门迁移，不是当前资源清理的默认行为。
- 画布写入必须走 `window.desk.excalidraw.*` 受限 IPC（只允许 `assets/*.excalidraw`、≤32MB、写要带 `expectedRevision`），并经过资源写入门禁；画布标签页/卡片打开期间该库的有未写完内容的画布会阻止资源整理。画布内容变化**不改笔记源码**，只有组件 `path`/`height` 变化才定点改写那一行。
- 归属规则：`.excalidraw` 文件名四位前缀是主人。笔记内嵌卡片只接受自己编号的画布（其它编号只给诊断、不打开写编辑）；跨笔记粘贴由 `markdown/excalidrawClipboardPlugin.ts` 自动复制一份目标编号的文件，不共享源文件。
- 资源 journal / 回收区在 `userData/asset-journals|asset-recycle/<kb-root-sha256>/`，打开知识库时会先恢复未完成事务。未完成 journal 会暂停该库 Git 与写入。资源面板在确定性范围内可预览、执行重命名/回收/同笔记合并/sharp 有损压缩并按 journal 恢复；渲染端只提交计划 ID。IPC `assets:plan-*` / `assets:apply` / `assets:restore` / `assets:history` 受脏文档与 Git 门禁约束。压缩默认有损，禁止标成无损。
- 测试知识库在 `apps/desk/playground`。
- 门禁：`pnpm --filter desk lint && pnpm --filter desk test && pnpm --filter desk typecheck && pnpm --filter desk build && pnpm --filter desk exec prettier --check .`
- E2E（`scripts/e2e-*.mjs`）验的是 `out/`，改完先 `pnpm --filter desk exec electron-vite build`。
