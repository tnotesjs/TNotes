import { cpSync, existsSync } from 'node:fs'
import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

/**
 * Excalidraw 官方字体随包分发。
 *
 * 官方包把资源基址硬编码成 esm.sh CDN；Desk 的 CSP 只允许 self/data，
 * 不把字体放进产物就会出现 `font-src` 报错 + 画布回退字体。渲染端把
 * `EXCALIDRAW_ASSET_PATH` 指到 `tnotes-asset://app/excalidraw/`，主进程
 * 的协议处理器再把 `out/renderer` 下的文件读出来。
 */
function copyExcalidrawFonts(): Plugin {
  let outDir = resolve('out/renderer')
  return {
    name: 'desk:copy-excalidraw-fonts',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const source = resolve(
        '../../packages/ui/node_modules/@excalidraw/excalidraw/dist/prod/fonts'
      )
      if (!existsSync(source)) {
        this.warn(`未找到 Excalidraw 字体目录，画布文本将回退：${source}`)
        return
      }
      cpSync(source, resolve(outDir, 'excalidraw/fonts'), { recursive: true })
    }
  }
}

/**
 * Monaco 的 json / css / html / typescript 语言特性各自会拉起一个 web worker
 * （ts.worker 12.7MB、css 1.9MB、html 1.3MB、json 若干）。Desk 出于 file:// + CSP
 * 的限制**不注册任何 worker**（见 `src/renderer/src/monaco/monaco.ts`），这些 worker
 * 永远不会被请求，却会被打进 `out/renderer/assets`，白送约 16MB 进安装包。
 *
 * 这里把它们换成空模块：词法高亮仍由 `basic-languages` 的 Monarch 提供
 * （markdown / json / yaml / …），只是没有语义校验、格式化与补全 —— 与"不注册 worker"
 * 的取舍完全一致。只对 monaco 内部的引用生效，不碰业务代码。
 */
function stubMonacoLanguageFeatures(): Plugin {
  const STUB = '\0desk:monaco-language-features-stub'
  const pattern = /languages\/features\/(json|css|html|typescript)\/register\.js$/
  return {
    name: 'desk:stub-monaco-language-features',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer?.includes('monaco-editor')) return null
      return pattern.test(source) ? STUB : null
    },
    load(id) {
      return id === STUB ? 'export {}\n' : null
    }
  }
}

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/main/index.ts'),
          searchWorker: resolve('src/main/searchWorker.ts'),
          encodeWorker: resolve('src/main/encodeWorker.ts')
        },
        external: ['sharp']
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
      alias: [
        { find: '@renderer', replacement: resolve('src/renderer/src') },
        // Use the prebundled ESM build: its diagram chunks ship with CJS deps
        // (dayjs etc.) already inlined. `mermaid.core` pulls raw dayjs.min.js
        // which has no ESM default export and blanks the whole editor when
        // mermaid is left un-optimized; optimizing mermaid.core instead rewrites
        // diagram chunks into flaky `.vite/deps/*` URLs (504).
        { find: 'mermaid', replacement: 'mermaid/dist/mermaid.esm.min.mjs' }
      ]
    },
    plugins: [vue(), vueJsx(), copyExcalidrawFonts(), stubMonacoLanguageFeatures()],
    // Local file: packages change often; prebundling freezes an old export map.
    optimizeDeps: {
      exclude: ['@tnotesjs/ui', 'mermaid']
    }
  }
})
