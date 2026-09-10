# Desk 开发上下文（给 Agent 的交接文档）

> 跨设备交接用短快照。进行中事项写进本文件或当面说明即可；细节以代码与 git 历史为准。

## 项目快照

- 定位：TNotes 本地优先桌面客户端（Electron + Vue 3 + TypeScript）。
- 编辑器：`@milkdown/crepe`（可视化）+ 独立 CodeMirror 6 源码编辑器。
- 知识库读写：workspace 内 `@tnotesjs/kb`；站点预览走 `@tnotesjs/ssg`；共享块走 `@tnotesjs/ui`。
- 验证门禁（在 `apps/desk` 下，或 root `pnpm --filter desk`）：`pnpm lint && pnpm test && pnpm typecheck && pnpm build && pnpm exec prettier --check .`
- Dev：`pnpm dev`（Electron + Vite）。运行态 UI 优先用仓库内 Playwright Electron E2E（`scripts/e2e-*.mjs`，验的是 `out/`，改完需先 `pnpm exec electron-vite build`）。

## 关键决策（勿回退）

- Markdown 为磁盘 canonical；源码视图独立 CodeMirror。
- 自定义语法（frontmatter、容器、组件、引用定义、生成标题/目录、HTML 等）经 `rawBlockProjection.ts` 投影为 `deskRawBlock` 原子；`sourcePreservation.ts` 保证未编辑块字节级零 diff。
- **独占一行的 `<br />` 不投影**：交给 Milkdown `remark-preserve-empty-line`（空段落 ↔ `<br />`），与官方 playground 一致。段内 / 表格内 `<br>` 仍走原路径。
- 不做协同 / AI / 后端；不需要 `plugin-collab`、`yjs` 等。

## 环境

- 测试知识库：`apps/desk/playground` 下各 TNotes.* 知识库。
- Node 22 / pnpm 11（本机可能更高版本）。
