# TNotes Nav

VSCode 扩展，Activity Bar 里浏览本地知识库 TOC 并打开笔记。扩展 id：`tnotesjs.tnotes-nav`。

| 模式     | 识别条件                           |
| -------- | ---------------------------------- |
| 多知识库 | 顶层存在任意 `TNotes.*` 目录       |
| 单知识库 | 顶层同时有 `tnotes.json`、`TOC.md` |

- `tnotesNav.rootPath`：扫描根；留空用当前打开的文件夹
- `tnotesNav.blacklist`：多库模式下隐藏的知识库文件夹名

```bash
pnpm --filter tnotes-nav build
pnpm --filter tnotes-nav package
```

Open Folder 打开含 `TNotes.*` 的目录或某个知识库根，再 `F5`。
