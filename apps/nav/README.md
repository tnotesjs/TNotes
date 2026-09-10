# TNotes Nav

本地 TNotes 知识库导航扩展：在 Activity Bar 中浏览知识库列表与只读 TOC，快速打开笔记。

- 扩展 id：`tnotesjs.tnotes-nav`
- 仓库：[github.com/tnotesjs/nav](https://github.com/tnotesjs/nav)

## 使用方式

1. 安装扩展后打开 Activity Bar 中的 **TNotes Nav**
2. 顶部地址栏默认为当前打开的文件夹；可改路径后点右侧刷新加载
3. 按根目录结构自动识别模式（见下）

也可设置 `tnotesNav.rootPath` 固定扫描根目录。

## 模式

| 模式 | 识别条件 | 界面 |
| --- | --- | --- |
| 多知识库 | 顶层存在任意 `TNotes.*` 目录 | 左栏知识库列表 + 右栏 TOC |
| 单知识库 | 顶层同时有 `.tnotes.json`、`TOC.md`、`sidebar.json`、`index.md` | 全宽 TOC，页眉为库 icon + 标题 |
| 未识别 | 以上都不满足 | 提示「未识别到 TNotes 知识库」 |

## 功能

- 多库左右分栏（可拖分割线）；单库全宽 TOC
- 知识库 icon、置顶；右键：复制路径、打开终端（多库）
- TOC：置顶快捷区 → **变更**（git 改动）→ 根 `README.md` → 只读目录树
- Git：知识库级 dirty / ahead / behind；笔记级字母标记（M / U / A / D / R）
- 点击笔记或根 README 在编辑器中打开；折叠 / 置顶按库持久化

## 配置

| 配置项 | 说明 |
| --- | --- |
| `tnotesNav.rootPath` | 扫描根目录；留空则使用当前打开的文件夹 |
| `tnotesNav.blacklist` | 多库模式下隐藏的知识库文件夹名 |

## 开发

```bash
pnpm install
pnpm run build
```

用 **Open Folder** 打开 `tnotesjs`（多库）或某个 `TNotes.*`（单库），再 `F5` 启动 Extension Development Host。

打包：

```bash
pnpm run package
```

## License

[MIT](./LICENSE)
