# TNotes Mindmap Web

极简可编辑思维导图 Web 应用。**数据即 Markdown**：一个 `.md` 文件 = 一张脑图，脑图格式文件约定命名为 `*.tn-mindmap.md`。

## 开发

```bash
pnpm install
pnpm dev        # 本地开发
pnpm test       # 引擎单元测试（vitest）
pnpm typecheck  # vue-tsc 类型检查
pnpm lint       # eslint
pnpm build      # 生产构建
```

## 脑图格式（`*.tn-mindmap.md`）

文件即脑图：只包含「H1 + 无序列表」，解析只读这部分，回写也只输出这部分。

```markdown
# 根节点（H1）

- 一级节点
  - 二级节点（2 空格缩进 = 一级嵌套；解析宽容 2/4 空格/Tab，回写统一 2 空格）
  - [链接节点](https://example.com)
  - [ ] 任务节点（未完成）
  - [x] 任务节点（已完成）
  - ![图片节点|300](https://example.com/a.png)   # |300 为宽度 px（Obsidian 风格）
```

- 无 H1 时以文件名作虚拟根，多个顶级列表项并列其下
- 非脑图内容（frontmatter、附录段落等）解析时忽略、回写时丢弃；导入非 `*.tn-mindmap.md` 文件会提示

## 交互（参照幕布）

- 单击选中，双击 / F2 内联编辑；编辑中 Enter 提交并新建同级继续录入，Esc 取消
- Enter 新建同级、Tab / Shift+Tab 升降级、Delete 删除、方向键导航
- 拖拽移动节点（挂接预览）、折叠/展开子树、Cmd/Ctrl+Z 撤销重做
- 滚轮平移、Cmd/Ctrl+滚轮缩放、适配按钮
- 大纲双视图（可编辑，与画布同源同步）、搜索定位（Cmd/Ctrl+F）、聚焦子树（面包屑返回）

## 结构

```text
src/
├── engine/     # 【抽离边界】纯 TS 引擎，零 Vue 依赖，对外只经 engine/index.ts
│   ├── model/        # 文档模型（树 + 编辑操作 + 快照）
│   ├── markdown/     # parser / serializer（文件即脑图）
│   ├── commands/     # 历史栈（快照式）
│   ├── layout/       # 右向紧凑树布局（measurer 注入，可测）
│   ├── render/       # SVG 渲染（视口虚拟渲染，千级节点）
│   └── editor.ts     # MindmapEditor 门面（交互 + 事件）
├── ui/         # Vue 薄包装（MindmapEditor.vue / OutlinePanel / SearchBar / MarkdownPanel）
└── App.vue     # 工具栏 + 三栏布局 + 导入导出
```

性能设计：布局 O(n)；渲染只挂载视口内节点（通常 < 200 个 DOM）；文本测量走 canvas `measureText`。

## 演进

验收通过后：`src/engine/` 整目录抽离为 `tnotesjs/mindmap-core`（npm 包），再由 mindmap-web、`@tnotesjs/core`（VitePress MarkMap 组件）、`mindmap-vscode`（Custom Editor，`filenamePattern: "*.tn-mindmap.md"`）三方依赖。
