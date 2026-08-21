# TNotes Mindmap VSCode 插件设计

## 目标

让 `*.tn-mindmap.md` 保持标准文本文件，同时在 VSCode 中提供大纲、脑图和源码三种编辑视图。Markdown 始终是唯一持久化数据源。

## 分层

- `@tnotesjs/mindmap-core`：解析、文档模型、会话、布局与 Canvas 编辑器。
- Vue 编辑组件：位于本仓库 `src/ui`，与 VSCode Webview 一起独立构建。
- WebView Host：管理视图状态、格式合法性、搜索、图片粘贴和编辑消息。
- Extension Host：通过 `CustomTextEditorProvider` 对接 `TextDocument`、`WorkspaceEdit`、`workspace.fs` 和本地资源 URI。

## 文档同步

1. Extension Host 发送带 `TextDocument.version` 的完整快照。
2. WebView 每次核心会话事务发送完整 Markdown 和 `baseVersion`。
3. Extension Host 串行执行 `WorkspaceEdit`，成功后回传新版本。
4. 外部编辑、撤销或 Git 操作产生的 `onDidChangeTextDocument` 再回流 WebView。
5. 文本相等时双方均不重复写入，避免消息回环。

第一版使用完整文档替换换取确定性；后续如超大文档性能需要，可在协议不变的前提下增加增量 patch。

## 图片

WebView 只在消息传输中临时使用 base64，Markdown 永不存储 base64。Extension Host 将图片写入当前文档同级的 `assets/`，返回相对路径与 `asWebviewUri`，成功后编辑器才插入图片节点。

## 安全

- WebView 使用 nonce CSP，脚本和样式只允许扩展资源。
- 本地资源根仅包含扩展构建目录和当前文档目录。
- 外部链接只允许 `http:` 与 `https:`，交由 `vscode.env.openExternal`。
- Workspace 未受信任时拒绝写入图片资源，但文本编辑仍可使用。

## 与 Web 版同步

`mindmap-web` 和本插件都依赖 `@tnotesjs/mindmap-core`，核心数据与 Canvas 行为不在 UI 仓库里分叉。当 Web 版的 Vue 交互组件有需要同步的修改时，应将对应变更同步到本仓库并同时运行两端回归；后续可根据维护成本再抽离独立 UI 包。
