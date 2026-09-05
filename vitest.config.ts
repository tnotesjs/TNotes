import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  server: {
    // Keep tests usable with the same sibling @tnotesjs/ui override as the app build.
    fs: { allow: [resolve('..')] }
  }
})
