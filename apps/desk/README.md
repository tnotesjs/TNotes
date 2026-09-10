# TNotes Desk

本地优先的 TNotes 桌面客户端（Electron）。`TOC.md` 是目录结构的唯一真相源。

```bash
pnpm --filter desk dev
pnpm --filter desk lint
pnpm --filter desk test
pnpm --filter desk typecheck
pnpm --filter desk build
```

给 Agent 的编辑器约束见 [AGENTS.md](./AGENTS.md)。

打包：`pnpm --filter desk build:mac` / `build:win` / `build:linux`。推送 `desk@*` tag 触发多平台 Release。

macOS 若提示「已损坏」：

```bash
xattr -dr com.apple.quarantine "/Applications/TNotes Desk.app"
```
