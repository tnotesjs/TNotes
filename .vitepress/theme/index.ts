/**
 * .vitepress/theme/index.ts
 */

// https://vitepress.dev/zh/guide/custom-theme

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import RootFolder from '../components/RootFolder.vue'
import './custom.css'

export default {
  extends: DefaultTheme,

  // doc: https://vitepress.dev/zh/guide/extending-default-theme#registering-global-components
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('RootFolder', RootFolder)
  },
} satisfies Theme
