# [0041. 在 react v19 中，移除了 UMD，推荐使用 ESM](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0041.%20%E5%9C%A8%20react%20v19%20%E4%B8%AD%EF%BC%8C%E7%A7%BB%E9%99%A4%E4%BA%86%20UMD%EF%BC%8C%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8%20ESM)

<!-- region:toc -->

- [1. 🔗 links](#1--links)
- [2. 🤔 什么是 UMD？](#2--什么是-umd)
- [3. 🤔 为什么移除 UMD？](#3--为什么移除-umd)
- [4. 📒 React 19 中的相关的变化及影响](#4--react-19-中的相关的变化及影响)
- [5. 📒 替代方案：使用 ESM](#5--替代方案使用-esm)

<!-- endregion:toc -->
- React 19 不再支持 UMD 构建，推动开发者使用更现代的 ESM 模块加载方式。
- 这种变化有助于减少复杂性，提高性能，并与现代 JavaScript 开发实践保持一致。如果您的项目仍在使用 UMD，需要尽快切换到 ESM。

## 1. 🔗 links

- https://zh-hans.react.dev/blog/2024/04/25/react-19-upgrade-guide#umd-builds-removed
  - react blog
  - UMD builds removed
  - ![](assets/2025-01-10-11-02-07.png)
  - **React 19** 中的一项重要变化：**UMD 构建将被移除**。
- https://juejin.cn/post/6844903927104667662
  - 掘金文章《可能是最详细的UMD模块入门指南》


## 2. 🤔 什么是 UMD？

- **UMD（Universal Module Definition）** 是一种模块格式，旨在兼容多种 JavaScript 环境（如浏览器、Node.js）。
- 过去，开发者可以通过简单的 `<script>` 标签直接在 HTML 文件中加载 UMD 格式的 React。

## 3. 🤔 为什么移除 UMD？

- **UMD 的局限性**：
  - 模块管理和加载效率较低。
  - 不适合现代 JavaScript 开发环境（如基于 ES Modules 的构建工具）。
- **现代替代方案**：
  - 现在的 Web 开发普遍采用 ESM（ES Modules），具有更好的性能、模块化和兼容性。

## 4. 📒 React 19 中的相关的变化及影响

- ![](assets/2025-01-10-11-02-07.png)
- 从 **React 19** 开始，官方将 **不再提供 UMD 构建**。
- 这是为了简化 React 的测试和发布流程，同时反映了现代 Web 开发的趋势（逐渐远离 UMD，转向 ESM）。
- **对于使用旧版 UMD 的项目**：
  - 必须更新为 ESM 格式。
  - 需要稍作调整以适应现代模块加载方式。
- **对于新项目**：
  - 影响较小，因为大多数项目已经使用 ESM 或现代构建工具（如 Vite、Webpack）。

## 5. 📒 替代方案：使用 ESM

- React 19 建议通过 **ESM（ES Modules）** 来加载 React，以下是示例代码：

```html
<script type="module">
  import React from "https://esm.sh/react@19/?dev"
  import ReactDOMClient from "https://esm.sh/react-dom@19/client?dev"
  // ...
</script>

<!--
type="module 表明这是一个模块化脚本。
esm.sh 这是一个 ESM 模块的 CDN，可以提供现代化的 React 构建版本。
-->
```
