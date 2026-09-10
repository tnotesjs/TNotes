// E0/E2 验证用最小页面：产物固定在 e0-spike/.e0-dist，不参与 packages/ui 的正式构建。
// 这里不 import 'vite'（packages/ui 没有该依赖），插件从 devDependencies 直接引入。
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
  build: {
    outDir: '.e0-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        view: new URL('./view.html', import.meta.url).pathname,
        editor: new URL('./editor.html', import.meta.url).pathname
      }
    }
  }
}
