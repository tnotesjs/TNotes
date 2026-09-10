# TNotes Mindmap for VSCode

在 VSCode 中使用大纲、思维导图和源码三种方式编辑 `*.tn-mindmap.md`。Markdown 是唯一持久化数据源，文件仍可由 Git、其它编辑器和 `@tnotesjs/mindmap-core` 直接消费。

## MVP 能力

- 将 `*.tn-mindmap.md` 默认关联为 VSCode Custom Text Editor。
- 复用 Web 版的大纲、脑图、源码、搜索、聚焦、折叠和快捷键交互。
- 使用 `TextDocument.version` 和串行 `WorkspaceEdit` 同步，外部修改会回流 Webview，版本冲突时以 VSCode 最新内容为准。
- `Cmd/Ctrl+S` 先提交 Webview 草稿，再等待编辑队列完成并调用 VSCode 保存。
- 无 H1 等非法 Markdown 只允许使用源码视图，修复后自动恢复其它视图。
- 粘贴图片时写入文档同级 `assets/`，Markdown 只保存相对路径，不保存 base64。
- 图片通过 `asWebviewUri` 渲染；外链只允许 `http:` 和 `https:` 并交由 VSCode 打开。

## 本地开发

```bash
pnpm install
pnpm check
```

在 VSCode 中打开本目录，按 `F5` 启动 Extension Development Host。默认测试工作区位于 `fixtures/workspace`。

也可以安装已构建的 VSIX：

```bash
code --install-extension ./tnotes-mindmap-vscode-0.1.0.vsix
```

文档模型、会话、布局和 Canvas 通过 `@tnotesjs/mindmap-core` 消费；VSCode Webview 使用的 Vue 编辑组件在 `src/ui`。

更多设计说明见 [docs/DESIGN.md](docs/DESIGN.md)。
