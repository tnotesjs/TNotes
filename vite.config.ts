import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const require = createRequire(import.meta.url)
const uiFocusBreadcrumbs = join(
  dirname(require.resolve('@tnotesjs/ui')),
  'components/Mindmap/FocusBreadcrumbs.vue',
)

export default defineConfig({
  plugins: [vue()],
  base: './',
  // The shared UI package imports Vue's bundler build directly. VS Code
  // webviews are browser-only and do not expose Node's `process` global, so
  // replace the compile-time environment check while bundling.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  resolve: {
    // Avoid the package barrel — it re-exports WordList (needs sass) and Mermaid.
    alias: {
      '@tnotesjs/ui/FocusBreadcrumbs.vue': uiFocusBreadcrumbs,
    },
  },
  build: {
    emptyOutDir: false,
    outDir: resolve(import.meta.dirname, 'dist/webview'),
    lib: {
      entry: resolve(import.meta.dirname, 'src/webview/main.ts'),
      formats: ['es'],
      fileName: () => 'webview.js',
      cssFileName: 'webview',
    },
    rollupOptions: {
      output: {
        assetFileNames: (asset) => asset.name?.endsWith('.css') ? 'webview.css' : 'assets/[name][extname]',
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
