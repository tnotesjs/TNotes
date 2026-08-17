# TNotes Mindmap Web

极简思维导图 Web 应用，交互复刻幕布。**数据即 Markdown**：一个 `.md` 文件 = 一张脑图，脑图格式文件约定命名为 `*.tn-mindmap.md`。

## 开发

```bash
pnpm install
pnpm dev        # 本地开发
pnpm test       # 引擎单元测试（vitest）
pnpm typecheck  # vue-tsc 类型检查
pnpm lint       # eslint
pnpm build      # 生产构建
```

## 三个视图（互斥切换，状态共享）

幕布式视图切换：一次只展示一个视图；折叠状态、聚焦路径、选中节点保存在无头会话层，跨视图同步。

- **大纲**：DOM 列表。回车新增同级并连续录入、Tab 降级 / Shift+Tab 升级、Delete 删除、拖拽移动、点击 bullet 进入主题、双击编辑、空行提交即删；万级节点虚拟滚动
- **脑图**：Canvas 渲染。Tab 新增子节点、Enter 新增同级、双击/F2 编辑、拖拽挂接、折叠/展开（位置补偿）、Cmd/Ctrl+Z 撤销、滚轮平移、Cmd/Ctrl+滚轮缩放
- **源码**：全屏 Markdown 编辑，300ms 防抖双向同步

通用：Cmd/Ctrl+F 搜索定位、聚焦子树（头部面包屑返回上级）、明暗色跟随系统。

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

## 结构

```text
src/
├── engine/     # 【抽离边界】纯 TS 引擎，零 Vue 依赖
│   ├── model/          # 文档模型（树 + 编辑操作 + 快照）
│   ├── markdown/       # parser / serializer（文件即脑图）
│   ├── commands/       # 历史栈（快照式）
│   ├── layout/         # 右向紧凑树布局（measurer 注入，可测）
│   ├── render/         # canvasRenderer（视口内重绘）+ hitTest（纯函数命中检测）
│   ├── session.ts      # MindmapSession 无头会话（三视图共享的状态与操作）
│   └── canvasEditor.ts # CanvasEditor 脑图视图控制器（交互 + 内联编辑覆盖层）
├── ui/         # 互斥视图：OutlineView / MindmapView / MarkdownView + SearchBar
└── App.vue     # 工具栏 + 视图切换 Tab + 聚焦面包屑 + 导入导出
```

性能设计：布局 O(n)（实测千级 < 100ms）；Canvas 每帧只画视口内元素（恒定 < 200 个）；大纲万级虚拟滚动；文本测量走 canvas `measureText`。

## 演进

验收通过后：`src/engine/` 整目录抽离为 `tnotesjs/mindmap-core`（npm 包），再由 mindmap-web、`@tnotesjs/core`（VitePress MarkMap 组件）、`mindmap-vscode`（Custom Editor，`filenamePattern: "*.tn-mindmap.md"`）三方依赖。
