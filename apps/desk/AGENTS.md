# Desk

Electron + Vue 3。可视化编辑器用 Milkdown / Crepe，源码视图是独立 CodeMirror 6。知识库读写 `@tnotesjs/kb`，预览 `@tnotesjs/ssg`，共享块 `@tnotesjs/ui`。

- Markdown 是磁盘 canonical。自定义语法经 `rawBlockProjection.ts` 投影为 `deskRawBlock`；`sourcePreservation.ts` 保证未编辑块字节级零 diff。
- 独占一行的 `<br />` 不投影，交给 Milkdown `remark-preserve-empty-line`。段内 / 表格内 `<br>` 仍走投影。
- 自由绘图的磁盘真相源是 `assets/*.excalidraw`，不是旁边的 `.svg` / `.png`。后者是历史派生产物。Desk 与 SSG 将共用 `@tnotesjs/ui` 的同一套 Excalidraw 组件消费该文件；组件落地前不得把 `.excalidraw` 当闲置删除。派生 SVG 的移除是后续专门迁移，不是当前资源清理的默认行为。
- 资源 journal / 回收区在 `userData/asset-journals|asset-recycle/<kb-root-sha256>/`，打开知识库时会先恢复未完成事务。未完成 journal 会暂停该库 Git 与写入。资源面板在确定性范围内可预览、执行重命名/回收/同笔记合并/sharp 有损压缩并按 journal 恢复；渲染端只提交计划 ID。IPC `assets:plan-*` / `assets:apply` / `assets:restore` / `assets:history` 受脏文档与 Git 门禁约束。压缩默认有损，禁止标成无损。
- 测试知识库在 `apps/desk/playground`。
- 门禁：`pnpm --filter desk lint && pnpm --filter desk test && pnpm --filter desk typecheck && pnpm --filter desk build && pnpm --filter desk exec prettier --check .`
- E2E（`scripts/e2e-*.mjs`）验的是 `out/`，改完先 `pnpm --filter desk exec electron-vite build`。
