# [0002. srcExclude 配置需要忽略的文档内容](https://github.com/Tdahuyou/TNotes.vitepress/tree/main/notes/0002.%20srcExclude%20%E9%85%8D%E7%BD%AE%E9%9C%80%E8%A6%81%E5%BF%BD%E7%95%A5%E7%9A%84%E6%96%87%E6%A1%A3%E5%86%85%E5%AE%B9)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 测试 srcExclude 配置](#2--demos1---测试-srcexclude-配置)

<!-- endregion:toc -->

## 1. 📒 概述

- **`srcExclude` 在开发环境下是没啥用的，主要作用体现在生产环境。**
- Issue #4310: `srcExclude` 配置在开发模式下的行为讨论
  - https://github.com/vuejs/vitepress/issues/4310
  - 该 GitHub 问题报告（Issue #4310）讨论了在使用 vitepress dev 命令时，srcExclude 配置项不起作用的问题。​
- 在 [VitePress 项目](https://github.com/vuejs/vitepress) 中，Issue [#4310](https://github.com/vuejs/vitepress/issues/4310) 讨论了在使用 `vitepress dev` 命令时，`srcExclude` 配置项未能按预期工作的情况。
- 问题描述：用户在 `.vitepress/config.mts` 文件中添加了以下配置：

```javascript
{
  srcExclude: [
    "./README.md",
    "./infra/**"
  ],
}
```

- 然而，即使进行了上述配置，访问 `/README` 和 `/infra/README` 页面时，仍然能够看到这些页面的内容。这表明这些路径并未被成功排除。
- 在讨论中，维护者指出以下关键点：
  - **开发模式的行为**
    - 在开发模式下（即运行 `vitepress dev`），虽然 `srcExclude` 配置会阻止指定路径被默认发现（例如不会出现在侧边栏或导航链接中），但如果用户直接访问这些路径（通过手动输入 URL），VitePress 并不会阻止它们的加载。这意味着：
    - 这些路径未被主动索引或链接。
    - 用户仍然可以通过手动输入 URL 来访问这些页面。
  - **生产模式的行为**
    - 在生产模式下（即运行 `vitepress build`），`srcExclude` 配置应能正常工作，确保指定的路径不会被包含在生成的站点中。
    - 因此，这种行为在开发模式下是预期的，但可能需要在文档中对此进行说明，以避免用户产生困惑。
  - **解决方案与建议**
    - **文档改进**：建议在 VitePress 官方文档中明确说明 `srcExclude` 在开发模式和生产模式下的行为差异，帮助用户更好地理解其作用范围。
    - **用户注意事项**：如果用户希望在开发模式下完全阻止某些路径的访问，可以考虑结合其他方式（如自定义路由逻辑或中间件）来实现更严格的限制。

## 2. 💻 demos.1 - 测试 srcExclude 配置

::: code-group

```ts [config.mts]
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcExclude: ['./api-examples.md', './hidden'], // [!code focus]
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
```

:::

- 这是使用 vitepress 搭建的一个默认 vitepress 项目。
- 改动部分：
  - 在根目录下新增了一个 hidden 目录，并新建了两个文件 1.md 和 2.md。
- 核心代码：`srcExclude: ['./api-examples.md', './hidden'],`
- 测试：
  - `npm run tn:dev` 如果加上 srcExclude，依旧可以通过手动改动地址栏访问到 `['./api-examples.md', './hidden']` 文档内容。
  - `npm run tn:build`
    - 如果加上 srcExclude，会发现最终打包结果 dist 目录中并没有 hidden 文件夹和 api-examples.html 文件。
      - ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-04-00-52-36.png)
    - 如果去掉 srcExclude，则会在 dist 目录中看到 hidden 文件夹和 api-examples.html 文件。
      - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-04-00-55-47.png)
- 一些补充说明：
  - **需求**：
    - 在写笔记的时候，在 src 中包含了大量其他的 .md 文档，这些文档完全没必要被 vitepress 处理，想要通过配置，将相关文档给忽略掉。
    - 处理这些没必要的文档会严重影响性能，导致文档的热更明显卡顿。
  - **踩坑**：
    - 实际在写这篇笔记的时候，官方文档并没有说明 **`srcExclude` 在开发环境下是没啥用的，主要作用体现在生产环境**。
    - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-04-00-34-10.png)
    - 这是在写这篇笔记时 `2025.04.04` 官方文档对 `srcExclude` 配置的全部描述。
    - 因此有了这篇笔记和这个 demo。
- 除了可以通过 `srcExclude` 配置来忽略某些源文件，也可以通过 vitepress 的 `vite.server.watch.ignored` 配置项来忽略对某些文件的监听；或者手写插件，让那些本该被忽略的文件若被用户刻意修改 URL 访问到，加载之后的内容为空。

::: code-group

```ts {5-25} [config.mts]
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcExclude: ['./api-examples.md', './hidden'],
  vite: {
    server: {
      watch: {
        // 改动这些内容不会再热更。
        ignored: ['./api-examples.md', '**/hidden/**'],
      },
    },
    plugins: [
      {
        // 处理 srcExclude 仅在生产环境 build 有效的问题，在开发环境 dev 如果通过手动修改地址栏跳转，应该被隐藏的文档依旧会被 vitepress 处理，这个插件可以让请求到的内容为空。
        name: 'ignore-hidden',
        enforce: 'pre',
        load(id) {
          if (id.includes('api-examples') || id.includes('hidden')) {
            return ''
          }
        },
      },
    ],
  },

  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          // { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
```

:::
