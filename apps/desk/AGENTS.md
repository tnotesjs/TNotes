# Desk

Electron + Vue 3。可视化编辑器用 Milkdown / Crepe，源码视图是独立 CodeMirror 6。知识库读写 `@tnotesjs/kb`，预览 `@tnotesjs/ssg`，共享块 `@tnotesjs/ui`。

- Markdown 是磁盘 canonical。自定义语法经 `rawBlockProjection.ts` 投影为 `deskRawBlock`；`sourcePreservation.ts` 保证未编辑块字节级零 diff。
- 独占一行的 `<br />` 不投影，交给 Milkdown `remark-preserve-empty-line`。段内 / 表格内 `<br>` 仍走投影。
- 测试知识库在 `apps/desk/playground`。
- 门禁：`pnpm --filter desk lint && pnpm --filter desk test && pnpm --filter desk typecheck && pnpm --filter desk build && pnpm --filter desk exec prettier --check .`
- E2E（`scripts/e2e-*.mjs`）验的是 `out/`，改完先 `pnpm --filter desk exec electron-vite build`。
