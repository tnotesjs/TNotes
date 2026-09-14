# @tnotesjs/ui

TNotes 内置块的 Vue 组件。消费方：`@tnotesjs/ssg`、Desk。需要 `vue` `^3.5`。样式用 `--tn-*`（`src/styles/tokens.css`）。

自由绘图尚未做成组件。磁盘真相源约定为知识库 `assets/*.excalidraw`（Desk 与 SSG 将只维护这一套数据）。配套 SVG 是历史派生，组件落地并改引用后再单独迁移删除。

```bash
pnpm add @tnotesjs/ui
```

### 代码块（`CodeBlock` / `CodeGroup`）

默认行为跟 VitePress 一致，**不限制高度**：

- 宽度不超出正文容器，超长单行在代码块内横向滚动，页面不会被撑宽；
- 原始换行与缩进原样保留（`white-space: pre`），不强制换行；
- 高度由内容撑开，没有 `max-height`，也不会出现内部纵向滚动。

**折叠是显式、可选的视图状态**：只有长代码块（默认 > 20 行）标题左侧才有折叠 Icon，
点一下收起 / 再点展开。折叠状态**只存在当前页面的内存里** —— 不写进 markdown、
不写 localStorage，刷新或重新进入页面一律回到展开。代码分组切换 tab 时，
新露出来的面板若处于收起状态会自动展开。

收藏的视觉与交互：`--tn-code-collapse-height`（默认 `360px`）控制收起后可见的高度。

````md
```js
console.log('短代码块：没有折叠 Icon')
```

```ts:line-numbers {2} [multi.ts]
function add(a: number, b: number) {
  const sum = a + b
  return sum
}
```

```text [one-line.txt]
这一行很长很长……它在代码块内横向滚动，不会把页面撑宽
```

```js [long.js]
// 超过 20 行 → 标题左侧出现折叠 Icon
```

::: code-group

```js [a-short.js]
console.log('a')
```

```ts [b-long.ts]
// 长的那一个 tab 才有折叠 Icon
```

:::
````

作者不需要写任何额外标记：行数决定有没有那颗 Icon。站点读者可以随时收起 / 展开，
编辑器（Desk）里也是同一套规则，且光标点进收起的代码块会自动展开。

### `BilibiliVideo`

| Prop       | Default  |
| ---------- | -------- |
| `id`       | required |
| `autoplay` | `false`  |
| `muted`    | `false`  |

```md
<BilibiliVideo id="BV1QR4y1y7GG" :autoplay="true" :muted="true" />
```

### `WordList`

| Prop              | Default                   |
| ----------------- | ------------------------- |
| `words`           | `[]`                      |
| `needSort`        | `false`                   |
| `wordsBaseUrl`    | en-words blob URL         |
| `wordsRawBaseUrl` | en-words raw URL          |
| `features`        | `WORD_LIST_FEATURES_FULL` |

```md
<WordList :words="['cancel', 'salary']" :needSort="true" />
```

`WORD_LIST_FEATURES_FULL`：卡片 + 拉取词表 + 菜单钉住 / 自动展开。`WORD_LIST_FEATURES_STATIC`：全关。

### `Mermaid`

围栏语言 `mermaid`；` ```mermaid center ` 居中。

| Prop                 | Default   |
| -------------------- | --------- |
| `source`             | `''`      |
| `graph`              | `''`      |
| `id`                 | auto      |
| `center`             | `false`   |
| `isDark`             | auto      |
| `securityLevel`      | `'loose'` |
| `enableCopy`         | `true`    |
| `enableFullscreen`   | `true`    |
| `enableCenterToggle` | `true`    |

### `MindmapEditor`（`@tnotesjs/ui/mindmap-editor`）

思维导图编辑器的**唯一实现**。`@tnotesjs/ui/mindmap` 那个块（`Mindmap.vue`）是给 SSG / Desk 笔记
内嵌用的「预览 + 可选编辑」；本入口导出它内部复用的编辑器组件，供自带页面外壳的宿主直接组装。
当前宿主：`apps/mindmap-web`、`apps/mindmap-vscode`。

| 导出                                                                          | 说明                                           |
| ----------------------------------------------------------------------------- | ---------------------------------------------- |
| `MindmapView`                                                                 | 脑图画布（含选区工具条 / 右键菜单 / 链接浮层） |
| `OutlineView`                                                                 | 大纲视图（拖拽、行内富文本、折叠）             |
| `MarkdownView`                                                                | 源码视图（防抖回流 + 诊断定位）                |
| `SearchBar`                                                                   | 三视图共用的搜索条                             |
| `FocusBreadcrumbs`                                                            | 进入主题后的面包屑（与主 barrel 同源）         |
| `AppIcon` / `IconButton` / `CollapseMenu`                                     | 外壳按钮与图标                                 |
| `CanvasContextMenu` / `LinkPopover` / `RichInlineEditor` / `SelectionToolbar` | 上面几个组件的组成件，供未来宿主自行组装       |
| `insertImageIntoSource`                                                       | 源码视图的整节点图片插入                       |
| `pasteCanvasOutline` / `readMindmapClipboard` / `writeMindmapClipboard`       | 脑图剪贴板（含无权限时的进程内回退）           |
| `resolveAfterDropLevel` / `DropLevel`                                         | 大纲拖拽落点解析                               |
| `primaryShortcut` / `altShortcut` / `isApplePlatform`                         | 平台快捷键文案                                 |

**浮层挂载点（`teleportTo`）**：`MindmapView`（并透传给 `CanvasContextMenu` / `LinkPopover`）接受
`teleportTo?: string`。默认 `undefined` = 就地渲染——浮层是 `position: fixed`，嵌在笔记里的宿主
（Desk / SSG）teleport 到 `body` 会脱离笔记的层叠上下文。整页宿主传 `'body'`。

**宿主职责（不属于本包）**：`MindmapSession` 的归属与生命周期、`--mm-*` 主题变量
（`--mm-canvas-bg` / `--mm-panel-bg` / `--mm-border` / `--mm-text` / `--mm-text-dim` / `--mm-hover` /
`--mm-selected-bg` / `--mm-accent` / `--mm-edit-bg`）、落盘、图片写入、宿主快捷键到组件
`defineExpose` 钩子的桥接（`OutlineView` 的 `locateNode` / `selectAllFromHost` / `undoFromHost` /
`redoFromHost`，`MarkdownView` 的 `selectAllFromHost` / `flushDraft`）。

改公共交互只改这里一处，三个宿主同时生效。
