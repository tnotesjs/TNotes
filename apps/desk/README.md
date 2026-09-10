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

## 资源面板

入口：知识库右键「资源」、导航栏 ⋯、「>资源」命令。默认扫描当前库；已管理库汇总只跳转，不跨库写文件。

确定性范围内可预览并执行重命名、移入回收区、同笔记内容合并，以及 **sharp 有损压缩**（设置里可改默认质量/格式；oxipng 未接入）。渲染端只提交计划 ID。存在未保存文档、待恢复草稿、未完成资源事务或过期计划时拒绝执行。覆盖未完成（动态 Vue 绑定、未解析脚本等）时关闭批量清理，相关重命名也会被拒绝。HTML `srcset`/`poster`、CSS、Vue SFC 静态引用和 Excalidraw 内嵌路径已纳入扫描。粘贴本地图片时，同一笔记归属内相同字节会复用已有文件。

回收区与 journal 在 Desk `userData`，不随知识库 Git 走，也不进入 SSG 站点。资源更新后缩略图走 `tnotes-asset://…&v=<revision>`。干净标签在资源写成功后按磁盘重开，并尽量恢复光标与滚动，不额外 serialize。

GIF 不自动压缩或转视频：Desk 用 `<img>` 播放动画；SSG 原样复制；GitHub Markdown 对 GIF 的循环/自动播放因查看器而异。SVG 与 `.excalidraw` 不栅格化覆盖。

打包：`pnpm --filter desk build:mac` / `build:win` / `build:linux`。Windows/Linux 上的 sharp 原生模块尚未在本机验证。推送 `desk@*` tag 触发多平台 Release。

macOS 若提示「已损坏」：

```bash
xattr -dr com.apple.quarantine "/Applications/TNotes Desk.app"
```
