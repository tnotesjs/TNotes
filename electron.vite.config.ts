import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/main/index.ts'),
          searchWorker: resolve('src/main/searchWorker.ts')
        }
      }
    }
  },
  preload: {},
  renderer: {
    server: {
      // Support the documented sibling-package override used while developing @tnotesjs/ui.
      fs: { allow: [resolve('..')] }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    // Local file: packages change often; prebundling freezes an old export map.
    optimizeDeps: {
      exclude: ['@tnotesjs/ui']
    }
  }
})
