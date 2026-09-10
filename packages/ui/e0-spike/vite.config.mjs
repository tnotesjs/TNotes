// E0 验证用最小页面：产物固定在 e0-spike/.e0-dist，不参与 packages/ui 的正式构建。
// 这里不 import 'vite'（packages/ui 没有该依赖），直接导出配置对象。
export default {
  build: { outDir: '.e0-dist', emptyOutDir: true }
}
