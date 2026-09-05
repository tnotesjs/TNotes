import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// The linked @tnotesjs/ui publishes source .ts via the "import" condition and
// built dist via "node". Vitest resolves with the node condition, which would
// require a fresh ui build on every edit — alias the dual-condition subpaths
// to source instead.
const uiSrc = (p: string): string => resolve(__dirname, '../ui/src', p)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: /^@tnotesjs\/ui\/code$/, replacement: uiSrc('code/highlight.ts') },
      {
        find: /^@tnotesjs\/ui\/footprints-parse$/,
        replacement: uiSrc('components/Footprints/parse.ts')
      },
      {
        find: /^@tnotesjs\/ui\/mindmap-parse$/,
        replacement: uiSrc('components/Mindmap/markdown.ts')
      }
    ]
  },
  server: {
    // Keep tests usable with the same sibling @tnotesjs/ui override as the app build.
    fs: { allow: [resolve('..')] }
  }
})
