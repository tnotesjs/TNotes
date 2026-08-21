# VSCode 插件 MVP 验收

## 自动化结果

2026-08-21 在 VSCode 1.134.0 的隔离 Extension Development Host 中完成：

- Extension 激活并注册 `tnotesMindmap.editor`。
- 合法文档真实 Webview 成功挂载，三种视图均可用，脑图 Canvas 已渲染。
- 源码编辑通过 `WorkspaceEdit` 回写 `TextDocument`，开启 VSCode 自动保存后内容已从磁盘重新读取确认。
- 真实粘贴一张 PNG 后，在文档同级创建 `assets/image-*.png`，Markdown 写入 `![截图](assets/image-*.png)`。
- 非法文档自动进入源码视图，大纲和脑图按钮禁用，并展示“文档必须包含且仅包含一个 H1”的定位诊断。
- Webview 的 CSP 资源加载、Vue 挂载和 Extension/Webview `ready` 握手均通过。

代码级校验：

- VSCode 扩展：3 个测试文件、9 条测试通过。
- 迁移时已将 VSCode Webview 使用的 UI 回归测试一并收入独立仓库。
- 两侧 TypeScript/Vue 类型检查和 ESLint 均通过。
- Extension Host 与 Webview 生产构建通过，VSIX 可成功生成。

## 明早快速验收

1. 在 `vscode-extension` 中按 `F5`，进入 Extension Development Host。
2. 打开 `fixtures/workspace/demo.tn-mindmap.md`，确认默认使用 TNotes Mindmap 编辑器。
3. 在大纲、脑图、源码三种视图各修改一次节点，按 `Cmd/Ctrl+S`，再用普通文本编辑器打开同一文件确认 Markdown 已保存。
4. 复制一张截图并粘贴到节点，确认同级 `assets/` 出现图片，Markdown 中是相对路径。
5. 打开 `fixtures/workspace/invalid-e2e.tn-mindmap.md`，确认只能使用源码视图；补上 H1 后确认大纲和脑图恢复。
6. 同时打开普通文本编辑器修改该文件，确认 Webview 能接收 VSCode 的最新内容。

## 当前边界

- MVP 只面向最新 VSCode 桌面版和受信任的本地工作区；未受信任工作区禁止图片写入。
- 同步协议第一版使用完整 Markdown 替换，优先保证一致性；超大文档后续可升级为增量 patch。
- 插件已独立建仓；当前 Vue 编辑层保留在插件仓库中，后续再根据两端同步成本决定是否抽离共享 UI 包。
- 本轮无法使用 macOS 辅助功能直接驱动 VSCode 界面（系统未授予 Computer Use 权限），因此真实验收由 VSCode CLI、Extension 日志和 Chromium DevTools Protocol 自动完成。
