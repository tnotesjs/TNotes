# TNotes Monorepo

| 目录                    | 包                       | 说明                |
| ----------------------- | ------------------------ | ------------------- |
| `packages/kb`           | `@tnotesjs/kb`           | 知识库读写 + CLI    |
| `packages/ssg`          | `@tnotesjs/ssg`          | 静态站点生成        |
| `packages/ui`           | `@tnotesjs/ui`           | 共享 UI             |
| `packages/mindmap-core` | `@tnotesjs/mindmap-core` | 思维导图引擎        |
| `apps/desk`             | `desk`                   | Electron 桌面端     |
| `apps/nav`              | `tnotes-nav`             | VSCode 导航扩展     |
| `apps/mindmap-vscode`   | `tnotes-mindmap-vscode`  | VSCode 思维导图扩展 |
| `apps/mindmap-web`      | `@tnotesjs/mindmap-web`  | 思维导图 Web        |

内部依赖 `workspace:^`。tag：`<目录名>@<版本>`（`desk@*` 触发桌面 Release）。npm：`pnpm -r --filter='./packages/*' publish --no-git-checks`。Node >= 22，pnpm 11.10.0。

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
```
