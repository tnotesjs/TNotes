/// <reference types="vitest/config" />
import { env } from 'node:process'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  base: env.GITHUB_ACTIONS === 'true' ? '/tnotesjs/' : '/',
  plugins: [vue()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
