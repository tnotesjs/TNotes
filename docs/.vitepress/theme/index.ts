// doc
// https://vitepress.dev/zh/guide/custom-theme

// .vitepress/theme/index.ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import RootFolder from '../components/RootFolder.vue'
import './custom.css'

export default {
  extends: DefaultTheme,

  // doc: https://vitepress.dev/zh/guide/extending-default-theme#registering-global-components
  // enhanceApp({ app }) {
  //   // 注册自定义全局组件
  //   app.component("MyGlobalComponent", MyGlobalComponent);
  // },

  // doc: https://vitepress.dev/zh/guide/extending-default-theme#registering-global-components
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('RootFolder', RootFolder)
  },
} satisfies Theme
