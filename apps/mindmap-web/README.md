# TNotes Mindmap Web

`*.tn-mindmap.md` 即脑图。在线：<https://tnotesjs.github.io/tnotesjs/>

合法文件恰好一个 H1；H1 前除空行外不能有内容，H1 后只能是无序列表。非法源码不自动规范化；修复前只用源码视图。

```markdown
# 根

- 一级
  - 二级
  - [链接](https://example.com)
  - [ ] 待办
  - ![图|300](https://example.com/a.png)
```

落盘后创建 `<作品名>/<作品名>.tn-mindmap.md` 与 `assets/`。图片写文件、Markdown 只存相对路径。引擎在 `@tnotesjs/mindmap-core`。

```bash
pnpm --filter @tnotesjs/mindmap-web dev
pnpm --filter @tnotesjs/mindmap-web test
pnpm --filter @tnotesjs/mindmap-web build
```
