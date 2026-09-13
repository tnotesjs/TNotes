import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  base: './',
  // The shared UI package imports Vue's bundler build directly. VS Code
  // webviews are browser-only and do not expose Node's `process` global, so
  // replace the compile-time environment check while bundling.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    emptyOutDir: false,
    outDir: resolve(import.meta.dirname, 'dist/webview'),
    lib: {
      entry: resolve(import.meta.dirname, 'src/webview/main.ts'),
      formats: ['es'],
      fileName: () => 'webview.js',
      cssFileName: 'webview'
    },
    rollupOptions: {
      output: {
        assetFileNames: (asset) =>
          asset.name?.endsWith('.css') ? 'webview.css' : 'assets/[name][extname]'
      }
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
