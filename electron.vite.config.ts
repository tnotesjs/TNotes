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
        '@renderer': resolve('src/renderer/src'),
        // Use the prebundled ESM build: its diagram chunks ship with CJS deps
        // (dayjs etc.) already inlined. `mermaid.core` pulls raw dayjs.min.js
        // which has no ESM default export and blanks the whole editor when
        // mermaid is left un-optimized; optimizing mermaid.core instead rewrites
        // diagram chunks into flaky `.vite/deps/*` URLs (504).
        mermaid: 'mermaid/dist/mermaid.esm.min.mjs'
      }
    },
    plugins: [vue()],
    // Local file: packages change often; prebundling freezes an old export map.
    optimizeDeps: {
      exclude: ['@tnotesjs/ui', 'mermaid']
    }
  }
})
