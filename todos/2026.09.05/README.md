# TNotes 共享 UI 与 SSG 迁移验收记录

状态：进行中。只有验收矩阵实际通过后才会标记阶段完成。

## 授权与工作区

- 用户要求实现 2026-09-05 长期决策第 1、2 部分，包含 VitePress 脱钩；不 push、不发布 npm。
- 每阶段完成后，各有改动的核心仓库分别创建一个 commit；不把准备性提交当成阶段完成。
- 关键步骤记录在本目录（本次用户要求优先于旧 AGENTS 中不保存 todos 的约定）。
- 工作根目录：`/Users/huyouda/tnotesjs/.worktrees/2026-09-05`。
- `ui`、`core`、`desk` 分支：`codex/shared-ui-ssg`。
- 起点：ui `f557025`、core `1049803`、desk `6239b5b`。
- 原始 core 的 workspace/CHANGELOG 未提交变更保留在原目录，不混入本任务提交。
- 原始 TNotes.docs 未提交变更保留；测试副本 `TNotes.docs-bak` 复制当前语料但排除 `.git`、node_modules、缓存和输出。
- 不推进知识图、反链或 @tnotesjs/kb。内部包通过本地打包/override 联调，不依赖未发布的注册表版本。

## 阶段 1：共享 UI

- [x] 语料与依赖清点，建立现有构建基线。
- [x] ui tokens / prose / 字体 / 暗色机制成为单一源，宿主只做必要映射。
- [x] 共享 Shiki JS 引擎工厂（单例、双主题、语言懒加载、meta、transformers）。
- [x] CodeBlock / CodeGroup（标题、语言、复制、全屏、tab）及两端接入；保留 Desk 编辑与源码保存行为。
- [x] 实测 VitePress 同名 fence/container 覆盖；行号与按块 meta 对齐。
- [x] 按语料处理 Badge、NotesTable、数学公式、图片预览等缺口。
- [x] 支持矩阵、HTML 快照对比、回归测试和 CI。
- [x] ui/core/desk 验证通过后各提交阶段 1。

## 阶段 2：冻结基线与薄 SSG

- [ ] 精确依赖与运行时、lockfile、容器时间胶囊、年度 audit、冻结补丁规则。
- [ ] VitePress 实际消费模块依赖闭包实验，记录规模、许可证与采用/否决原因。
- [ ] @tnotesjs/ssg 独立构建/开发/预览：Markdown、路由、内容数据加载、Vue SFC、片段导入、base、死链、搜索。
- [ ] core 构建入口/主题/配置与模板迁移，VitePress 仅保留冻结基线，不作为新链路运行依赖。
- [ ] TNotes.docs 副本功能/路由/资源/编辑/构建/预览验收，新增与删除/改名场景。
- [ ] 各核心仓库完整门禁；确认全链路无 VitePress 运行依赖；各提交阶段 2。

## 验收原则

- Markdown 为 canonical；未编辑内容不得因渲染或切换视图改变。
- 静态构建与 Desk 渲染使用同一语法/高亮实现；单测、HTML 对比与浏览器/Electron 行为验证互补。
- 不通过关闭死链检查、吞异常、删测试或把所有内容改成 raw HTML 来规避回归。
- 跟踪未完成项和失败的准确命令，不将环境限制说成通过。

## 关键步骤

### 00 — 工作区隔离

已创建三个独立 worktree 和无 Git 元数据的 TNotes.docs-bak。原始仓库与语料未修改；尚未提交任何阶段成果。

### 01 — 基线与 SSR 缺陷

- ui 基线：6 个测试、typecheck 通过；core 基线：176 个测试、typecheck、build 通过。
- 原始 TNotes.docs 构建命令退出 0，但日志曾出现 `Mindmap.vue` 在 SSR 读取 `document` 的 `ReferenceError`。共享 UI 的 Mermaid/Mindmap 主题探测已改为 SSR 安全，后续本地全量构建不再出现该错误。

### 02 — 共享代码块最小闭环

- `@tnotesjs/ui` 已提供唯一 tokens/prose/code 样式源、Shiki JavaScript 引擎单例、双主题、meta/行号解析、transformers、语言按需加载，以及 CodeBlock/CodeGroup 的复制、全屏和键盘 tab 行为。
- Core 保留 VitePress 的 Markdown/片段解析管线，只覆盖 fence 与 `::: code-group` 最终 DOM；新增真实 VitePress 渲染器测试，确认同名规则覆盖生效。
- Desk 只读 code-group 已实际挂载共享 Vue 组件，并显式 unmount；可编辑 code-group 仍保留现有 CodeMirror 写回行为。
- TNotes.docs-bak 使用本地 ui/core 完整构建成功（3696 transforms、104 chunks、约 15.5 秒），无 SSR `document` 异常。产物检查：19 个页面使用共享 Shiki DOM、1 个页面含共享 code-group；旧 `vp-code-group` 与旧 `class="language-*"` 页面均为 0。
- 当前通过：ui 10 tests + typecheck + build + pack dry-run；core 新增集成测试 2/2 + typecheck + build；Desk code-group 17 tests + typecheck + electron-vite build。

### 03 — 阶段 1 完整收口与门禁

- UI 新增共享 Badge、图片灯箱（导航、缩放、拖动、键盘与焦点恢复），并由 Core、Desk 全局接入；Core 内重复的 ImagePreview 与 CodeBlockFullscreen 已移除。NotesTable 保留 Core 的知识库数据适配器，渲染组件仍唯一来自 UI；数学公式两端原有链路已确认保留。
- 代码围栏已支持 `:line-numbers`、`:line-numbers=N`、`:no-line-numbers`，Desk 可视化编辑保存时保留原 meta。共享 fixture 分别由 Core 真实 Markdown renderer 与 Desk 运行时 Vue mount 验证标题、语言、行号和高亮行，两个仓库 CI 均执行相应测试。
- UI README 已加入“语法 × Core / Desk 可视化 / Desk 只读 / Desk 源码”支持矩阵；Core/Desk 仅保留宿主变量映射、编辑 hit area 与导航偏移，不再覆盖共享调色板和正文视觉语义。
- 最终门禁：UI 13 tests、typecheck、build、pack dry-run、diff-check；Core lint、179 tests、typecheck、build、diff-check；Desk lint（仅既有 4 条 warning）、531 tests、typecheck、build、Prettier check、diff-check，均通过。
- Electron 离线排版 E2E 通过：14 份 Inter 字体资源、本体/标题/粗体/斜体实际字体、可视化/只读排版、亮暗色多级列表 marker、Markdown 零改写。
- TNotes.docs-bak 全量构建通过（4046 transforms、348 chunks、约 16 秒）。44 个 HTML 页面中扫描到 50 个共享 Shiki 实例、5 个共享 code-group；旧 `vp-code-group` 与 `class="language-*"` 均为 0。
