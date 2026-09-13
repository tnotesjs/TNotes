# Desk

Electron + Vue 3。可视化编辑器用 Milkdown / ProseMirror（**自组装配**：`src/renderer/src/markdown/deskEditor.ts` + 从 Crepe 移植的特性 `crepePort/`，不再依赖 `@milkdown/crepe`），源码视图是独立 CodeMirror 6。知识库读写 `@tnotesjs/kb`，预览 `@tnotesjs/ssg`，共享块 `@tnotesjs/ui`。

- Markdown 是磁盘 canonical。自定义语法经 `rawBlockProjection.ts` 投影为 `deskRawBlock`；`sourcePreservation.ts` 保证未编辑块字节级零 diff。
- 独占一行的 `<br />` 不投影，交给 Milkdown `remark-preserve-empty-line`。段内 / 表格内 `<br>` 仍走投影。
- 自由绘图的磁盘真相源是 `assets/*.excalidraw`，不是旁边的 `.svg` / `.png`。后者是历史派生产物。Desk 与 SSG 共用 `@tnotesjs/ui` 的同一套 Excalidraw 组件消费该文件：Desk 侧是标签页（`editor-groups/ExcalidrawTabPane.vue`）与笔记内嵌卡片（`markdown/deskRawBlockView/excalidraw.ts`），两者共用 `editor/excalidraw/canvasController.ts`；SSG 侧是 `data-tn-island="excalidraw"` 只读岛。`.excalidraw` 的清理保护仍然有效，派生 SVG 的移除是后续专门迁移，不是当前资源清理的默认行为。
- 画布写入必须走 `window.desk.excalidraw.*` 受限 IPC（只允许 `assets/*.excalidraw`、≤32MB、写要带 `expectedRevision`），并经过资源写入门禁；画布标签页/卡片打开期间该库的有未写完内容的画布会阻止资源整理。画布内容变化**不改笔记源码**，只有组件 `path`/`height` 变化才定点改写那一行。
- 归属规则：`.excalidraw` 文件名四位前缀是主人。笔记内嵌卡片只接受自己编号的画布（其它编号只给诊断、不打开写编辑）；跨笔记粘贴由 `markdown/excalidrawClipboardPlugin.ts` 自动复制一份目标编号的文件，不共享源文件。
- 资源 journal / 回收区在 `userData/asset-journals|asset-recycle/<kb-root-sha256>/`，打开知识库时会先恢复未完成事务。未完成 journal 会暂停该库 Git 与写入。资源面板在确定性范围内可预览、执行重命名/回收/同笔记合并/sharp 有损压缩并按 journal 恢复；渲染端只提交计划 ID。IPC `assets:plan-*` / `assets:apply` / `assets:restore` / `assets:history` 受脏文档与 Git 门禁约束。压缩默认有损，禁止标成无损。
- 历史版本（笔记与资源）：只读部分在 `main/history/gitHistory.ts`（按四位编号关联历史文件名与同编号资源、固定 HEAD 分页、只收 40 位 OID + 快照内路径），`renderer/history/*` 是只读渲染（commit 上下文 + `tnotes-asset://history` 协议，缓存键 `commit:blobOID`，绝不回退当前磁盘）。
- 恢复分成两段：`history:plan` 只验证并固化影响范围（不改文件），`history:apply` 执行写回。渲染端**只能提交计划 ID + revision**，字节与路径不出主进程；确认前必须先受控 flush（画布 settle → 保存笔记 → 写者快照），有未完成写入就拒绝建计划。
- 恢复的写回是「阶段日志 + 原始字节」事务：日志与回滚数据在 `userData/history-restore-journals/<kb-root-sha256>/`（**不在 KB 里、不进 Git**），阶段 `planned → backing-up → backed-up → writing → written → committing → committed`，每步落盘。备份提交与恢复提交都复用 H0 的按路径独立索引（`main/history/gitSnapshot.ts`），不夹带其它暂存内容、无变化不产生空提交。
- 崩溃恢复：打开知识库时 `workspaceManager.syncAssetWriteHolds()` 会先跑 `recoverHistoryRestore`——写完一半按日志回滚，提交已生成则按「父提交 + 目标路径 blob OID」识别并清理日志（不重复提交）。仍有 `failed` 日志时沿用 `incomplete-journal` 暂停该库 Git 与写入（目前没有「确认失败日志」的 UI 入口，属于已知遗留）。
- 恢复与资源整理**共用** `withAssetWriteGuard`（`main/assetOperations.ts`）这一把写事务锁：同一知识库同时只允许一个写事务，互斥不排队；恢复期间自动写被暂停，恢复后笔记重新读盘、画布在下次可见时 `revalidate`（提示「磁盘上的画布已被其他入口修改」而不是静默覆盖）。
- 三类「版本/日志」不要混用：Git commit 是笔记与资源的版本真相；`asset-journals` 是资源整理的事务日志；`history-restore-journals` 是历史恢复的事务日志。画布的临时恢复数据仍走画布会话自己的机制，不写进这三者。
- 测试知识库在 `apps/desk/playground`。
- 门禁：`pnpm --filter desk lint && pnpm --filter desk test && pnpm --filter desk typecheck && pnpm --filter desk build && pnpm format:check`（格式化检查用**根目录**的 `pnpm format:check`，与 CI 一致 —— prettier 只读运行目录下的 `.prettierignore`，在 `apps/desk` 里跑不到根目录的排除项）
- E2E（`scripts/e2e-*.mjs`）验的是 `out/`，改完先 `pnpm --filter desk exec electron-vite build`。
