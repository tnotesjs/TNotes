# @tnotesjs/ui

TNotes 内置块的 Vue 组件。消费方：`@tnotesjs/ssg`、Desk。需要 `vue` `^3.5`。样式用 `--tn-*`（`src/styles/tokens.css`）。

自由绘图尚未做成组件。磁盘真相源约定为知识库 `assets/*.excalidraw`（Desk 与 SSG 将只维护这一套数据）。配套 SVG 是历史派生，组件落地并改引用后再单独迁移删除。

```bash
pnpm add @tnotesjs/ui
```

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
