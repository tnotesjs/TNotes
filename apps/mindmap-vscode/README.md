# TNotes Mindmap for VSCode

用大纲 / 脑图 / 源码编辑 `*.tn-mindmap.md`。引擎 `@tnotesjs/mindmap-core`，Webview UI 在 `src/ui`。

非法 Markdown（无 H1 等）只开源码视图。粘贴图片写入文档同级 `assets/`，Markdown 只存相对路径。

```bash
pnpm --filter tnotes-mindmap-vscode check
```

打开本目录后 `F5`。测试工作区：`fixtures/workspace`。
