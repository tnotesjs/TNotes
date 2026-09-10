# TNotes Monorepo

TNotes 生态系统全部代码包的 monorepo（pnpm workspace）。

## 布局

| 目录 | 包 | 说明 |
| --- | --- | --- |
| `packages/kb` | `@tnotesjs/kb` | 知识库读写 API + `tnotes-kb` CLI |
| `packages/ssg` | `@tnotesjs/ssg` | 静态站点生成器（`tnotes-ssg`） |
| `packages/ui` | `@tnotesjs/ui` | 共享 UI 组件 |
| `packages/mindmap-core` | `@tnotesjs/mindmap-core` | 思维导图核心 |
| `apps/desk` | `desk` | TNotes Desk（Electron 桌面端） |
| `apps/nav` | `tnotes-nav` | VSCode 导航扩展 |
| `apps/mindmap-vscode` | `tnotes-mindmap-vscode` | VSCode 思维导图扩展 |
| `apps/mindmap-web` | `@tnotesjs/mindmap-web` | 思维导图 Web 版 |

## 约定

- 内部依赖一律 `workspace:*`，发布时由 pnpm 自动改写为真实版本号。
- tag 格式 `<目录名>@<版本>`（如 `kb@0.4.2`、`desk@0.5.1`）；desk 推 tag 触发 8 平台 Release。
- npm 发布：`pnpm -r --filter='./packages/*' publish --no-git-checks`（拓扑序：mindmap-core / kb → ui → ssg）。
- Node >= 22，pnpm 11.10.0（corepack 锁定）。

## 常用命令

```bash
pnpm install        # 一次装齐所有包
pnpm build          # 全部构建
pnpm test           # 全部测试
pnpm typecheck      # 全部类型检查
pnpm lint           # 全部 lint
pnpm format:check   # prettier 检查（CI 门禁）
```
