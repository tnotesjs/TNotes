import { existsSync } from 'fs'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vitest/config'

// Prefer a sibling ui checkout while iterating; fall back to the published
// package so CI / isolated installs (no ../ui) still resolve source .ts.
const uiSrc = (p: string): string => {
  const sibling = resolve(__dirname, '../ui/src', p)
  if (existsSync(sibling)) return sibling
  return resolve(__dirname, 'node_modules/@tnotesjs/ui/src', p)
}

export default defineConfig({
  plugins: [vue(), vueJsx()],
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
