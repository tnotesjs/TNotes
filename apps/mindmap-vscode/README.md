# TNotes Mindmap for VSCode

用大纲 / 脑图 / 源码编辑 `*.tn-mindmap.md`。引擎 `@tnotesjs/mindmap-core`，公共 UI 在 `@tnotesjs/ui/mindmap-editor`（本包只保留宿主适配：扩展进程、`assets/` 读写、webview 桥与 `--mm-*` 主题变量）。

非法 Markdown（无 H1 等）只开源码视图。粘贴图片写入文档同级 `assets/`，Markdown 只存相对路径。

```bash
pnpm --filter tnotes-mindmap-vscode check
```

打开本目录后 `F5`。测试工作区：`fixtures/workspace`。
