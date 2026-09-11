# @tnotesjs/kb

知识库读写 API + `tnotes-kb` CLI。格式：`tnotes.json` + `TOC.md` + `notes/` + `assets/`。

## 资源扫描与整理

`workspace.assets.analyze` 只读扫描引用。传入 `includeHashes: true` 时计算 SHA-256 并给出同笔记可合并重复组。`planRename` / `planRecycle` / `planMerge` / `planOptimize` 只生成计划，不写知识库。`applyPlan` / `restorePlan` / `listJournals` 需要调用方传入独立的 `journalDir` / `recycleDir`，禁止放在 `assets/` 下（SSG 会递归原样复制整个 `assets/`）。优化产物由 Desk 传入 `outputFiles`，KB 不依赖 sharp。

`assets.add` 在文件名含 `NNNN-` 归属前缀且内容与同笔记已有兼容类型文件相同时复用路径（`reused: true`）。知识库图标与 `.excalidraw` 不参加内容复用。

扫描范围：全部实际笔记（含未入 TOC）、README、TOC、`tnotes.json` 图标、笔记中的 mindmap fence，以及 HTML / CSS / Vue SFC / Excalidraw 资源文件。跳过 `.git`、`node_modules`、`dist`、`out`、`.cache`。不下载远程 URL，不把远程地址当本地断链。引用图区分根可达与仅孤立资源互相引用；闲置候选 = assets − 根可达 − 受保护 − 不确定影响。

资源状态：

| 状态                 | 含义                                             |
| -------------------- | ------------------------------------------------ |
| `referenced`         | 已被已解析根来源引用                             |
| `idle-candidate`     | 覆盖完成且未被引用，可作为清理候选               |
| `uncertain-idle`     | 看起来闲置，但覆盖未完成，不能当可清理           |
| `uncertain-affected` | 可能被未适配语法提到                             |
| `protected`          | 知识库图标、越界符号链接、`.excalidraw` 真相源等 |

`coverageComplete` / `batchCleanupAllowed` 为 false 时关闭整库批量清理，并拒绝无法证明与未知来源无关的重命名。`renameAllowed` 是单文件门禁。

已适配：Markdown / HTML `src` `href` `srcset` `poster`、CSS `url()` `@import`、Vue SFC 静态属性与静态 import、Excalidraw 内嵌本地路径（data URL 不当本地文件）。动态 Vue 绑定（`:src` / `v-bind:src` / `v-bind` 对象 / 动态 `import()`）即使 SFC 解析成功也不视为覆盖完成。`.js` / `.ts` 等脚本资源仍未解析。普通围栏、注释、行内代码中的路径只保护、不改写。

Desk 将 journal / 回收区放在应用 `userData/asset-journals|asset-recycle/<kb-root-sha256>/`。渲染端只提交计划 ID。输入哈希或引用来源变化会拒绝过期计划；恢复拒绝覆盖后来编辑的文件。旧 `gc({ delete: true })` 仅扫描 `notes/` 顶层 Markdown 的整文件正则，不能作为新清理依据。

`assets/*.excalidraw` 是自由绘图的可编辑真相源。同名或配套 `.svg` 等是派生产物；扫描与清理必须保留 `.excalidraw`。等 Desk / SSG 共用的 UI 组件落地后，再做一次专门迁移去掉派生文件。

```bash
tnotes-kb update
```
