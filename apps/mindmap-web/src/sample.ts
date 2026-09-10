export const SAMPLE_MARKDOWN = `# TNotes Mindmap 使用指南

- 这是什么
  - 一个以 Markdown 为唯一数据源的大纲与思维导图编辑器
  - 同一份 *.tn-mindmap.md 文件可在大纲、脑图和源码视图之间切换
  - 当前优先支持最新版 Chrome，Web 版为纯静态应用，不依赖账号或云端存储
- 快速开始
  - 单击主题开始编辑，Enter 新建同级主题，Tab 新建或缩进为下级主题
  - 使用方向键在主题间移动，拖拽主题可调整层级与顺序
  - Cmd/Ctrl+B 加粗，Cmd/Ctrl+I 斜体，Cmd/Ctrl+U 下划线
  - Cmd/Ctrl+E 切换行内代码，Cmd/Ctrl+K 添加链接，Cmd/Ctrl+Shift+L 切换待办
  - 光标停在主题内且没有选择文字时，格式快捷键会作用于整个主题
  - Cmd/Ctrl+F 搜索当前文档；脑图中搜索会切换到可编辑的大纲结果视图
- 文件与图片
  - 可以直接编辑内存草稿，也可以打开或创建本地作品目录
  - 首次粘贴图片时，按引导创建本地作品，图片会写入作品目录的 assets 文件夹
  - [ ] 尝试编辑这个待办主题
  - [x] 已经打开默认测试示例
- mindmap-web
  - 浏览器端编辑应用，负责大纲、脑图、源码视图和本地文件交互
  - [GitHub 仓库](https://github.com/tnotesjs/mindmap-web)
  - [在线体验](https://tnotesjs.github.io/mindmap-web/)
- mindmap-core
  - 与界面无关的 TypeScript 核心，提供 Markdown 解析、文档会话、布局和画布编辑能力
  - 可供 Web、VS Code 插件和只读渲染场景复用
  - [GitHub 仓库](https://github.com/tnotesjs/mindmap-core)
  - [npm 包](https://www.npmjs.com/package/@tnotesjs/mindmap-core)
- 数据原则
  - Markdown 是唯一持久化数据源，界面状态不会取代原始文档
  - 合法文档必须且只能有一个 H1 根主题
  - 源码格式非法时，只允许留在源码视图修复；保存前会再次提醒
`

/** 生成约 count 个节点的压力测试脑图 */
export function generateStressMarkdown(count: number): string {
  const lines: string[] = [`# 压力测试（${count} 节点）`, '']
  const branches = 12
  const perBranch = Math.max(1, Math.floor((count - 1) / branches))
  for (let b = 0; b < branches; b++) {
    lines.push(`- 分支 ${b + 1}`)
    let quota = perBranch
    let topic = 0
    while (quota > 0) {
      topic++
      lines.push(`  - 主题 ${b + 1}.${topic}`)
      quota--
      const leaves = Math.min(quota, 12)
      for (let j = 1; j <= leaves; j++) {
        lines.push(`    - 节点 ${b + 1}.${topic}.${j}`)
        quota--
        if (j % 4 === 0 && quota > 0) {
          lines.push(`      - 叶子 ${b + 1}.${topic}.${j}.1`)
          quota--
        }
      }
    }
  }
  return lines.join('\n') + '\n'
}
