/// <reference types="vitest/config" />
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { env } from 'node:process'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const require = createRequire(import.meta.url)
const uiFocusBreadcrumbs = join(
  dirname(require.resolve('@tnotesjs/ui')),
  'components/Mindmap/FocusBreadcrumbs.vue'
)

export default defineConfig({
  base: env.GITHUB_ACTIONS === 'true' ? '/tnotesjs/' : '/',
  plugins: [vue()],
  resolve: {
    // Avoid the package barrel — it re-exports WordList (needs sass) and Mermaid.
    alias: {
      '@tnotesjs/ui/FocusBreadcrumbs.vue': uiFocusBreadcrumbs
    }
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
