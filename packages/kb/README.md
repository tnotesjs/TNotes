# @tnotesjs/kb

TNotes 知识库读写 API + `tnotes-kb` CLI。

- 单文件知识库格式：`tnotes.json` + `TOC.md` + `notes/` + `assets/`
- 提供知识库扫描、笔记读写、TOC 解析/回写、完成趋势统计、Git 集成等能力
- 被 [`@tnotesjs/ssg`](../ssg)、[TNotes Desk](../../apps/desk) 等消费

> 本包位于 monorepo [tnotesjs/tnotesjs](https://github.com/tnotesjs/tnotesjs) 的 `packages/kb`。

## CLI

```bash
tnotes-kb update    # 扫描笔记，回填 tnotes.json 统计与完成趋势
```

## License

MIT
