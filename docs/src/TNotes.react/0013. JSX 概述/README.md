# [0013. JSX 概述](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0013.%20JSX%20%E6%A6%82%E8%BF%B0)

<!-- region:toc -->

- [1. 📒 JSX 概述](#1--jsx-概述)
- [2. 💻 demos.1 - 一个简单的 React 组件示例](#2--demos1---一个简单的-react-组件示例)

<!-- endregion:toc -->
- 这篇笔记简单介绍了 JSX 的一些基础知识点，有关 JSX 的更多细节，会在其他笔记中介绍。

## 1. 📒 JSX 概述

- **JSX 是什么**
  - JSX 是 JavaScript XML 的缩写，它是 React 中用于描述用户界面的一种语法扩展。
  - JSX 是由 Facebook 起草的 JS 扩展语法，是一种将 HTML 和 JavaScript 混合使用的扩展语法。
  - 虽然 JSX 看起来很像 HTML，但实际上它是 JavaScript 的一部分，并且最终会被编译成纯 JavaScript 代码。
  - JSX 允许开发者在 JavaScript 代码中直接编写类似 HTML 的结构，这样可以更直观地将 UI 与逻辑结合起来。
- **JSX 的本质**
  - 从数据类型层面来看，JSX 本质上是一个 JS 对象。
  - JSX 会被 babel 编译，最终会被转换为 `React.createElement` 函数调用，是一个 React Element 对象。
- **JSX 必须单根**
  - 每个 JSX 表达式，有且仅有一个根节点。
  - 如果有多个根，可以使用 `<React.Fragment></React.Fragment>` 来包裹这些根节点。
  - `<React.Fragment></React.Fragment>` 可以简写为 `<></>`。
- **🤔 为什么 jsx 必须单根？**
  - jsx 表达式 -> 等效的 `React.createElement` 函数调用。
  - 调用 `React.createElement` 必须有一个根，如果有多个根，没法调，都不知道咋传参。
  - jsx 表达式会被 babel 编译，转为等效的 `React.createElement` 写法。如果 jsx 有多个根节点，那显然是没法转的，因为 `React.createElement` 这个 API 创建的是一棵树，在创建这棵树的时候传入的第一个参数 type 表示的是根节点的类型。
- **声明式**
  - JSX 是声明式的，这意味着你可以描述你的应用应该显示什么，而不是如何进行 DOM 操作来改变应用的状态。这使得代码更容易理解和维护。
- **嵌入表达式**
  - 你可以在 JSX 中使用大括号 `{}` 来嵌入任何有效的 JavaScript 表达式。
  - 例如，变量、函数调用或计算结果都可以被嵌入到 JSX 中。
- **属性**
  - JSX 属性和 HTML 属性非常相似，但有一些不同之处。
    - `class` 在 HTML 中对应 `className` 在 JSX 中，因为 `class` 是 JavaScript 的保留字。
- **事件处理**
  - JSX 中的事件处理函数是以驼峰命名法（camelCase）来写的，比如 `onClick` 而不是 `onclick`，这些事件处理函数接收一个事件对象作为参数。
- **必须要有结束标记**
  - 每个 JSX 元素必须有结束标记（XML 规范）。
  - 对于没有内容的元素，如 `<img>` 或 `<input>`，JSX 支持自闭合标签，比如 `<img src={imageSrc} />`。
- **注释**
  - 在 JSX 中添加注释需要使用花括号 `{/* ... */}`。

## 2. 💻 demos.1 - 一个简单的 React 组件示例

::: code-group

```jsx [jsx 式写法]
import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Welcome name="Tdahuyou" />
  </StrictMode>
)
```

```jsx{4-11,15} [React.createElement 式写法]
import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'

function Welcome(props) {
  return createElement(
    "h1",
    null,
    "Hello, ",
    props.name
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {createElement(Welcome, {name: "Tdahuyou"})}
  </StrictMode>
)
```

:::

- 最终的渲染结果及生成的真实 DOM 结构：
  - ![](assets/2025-01-17-16-51-14.png)
  - ![](assets/2025-01-17-16-51-55.png)
- 在这个例子中，`<Welcome name="Tdahuyou" />` 是一个 JSX 表达式，它表示一个 `Welcome` 组件的实例，传递了 `name` 属性。这个组件内部返回了一个包含动态内容的 `<h1>` 标签。
- 实际上，你在项目中使用的 JSX 是 `React.createElement` 的语法糖，最终会通过 Babel 这样的工具将 JSX 代码转换为纯粹的 JavaScript 代码。Babel 会把 JSX 代码转换成 `React.createElement` 函数调用，这是 React 用来创建虚拟 DOM 节点的方法。
- 通过这个简单的 demo，我们不难得出以下结论：
  - 其实 JSX 并不是开发 React 项目所必需的，你如果更喜欢使用 `React.createElement(Welcome, {name: "Tdahuyou"})` 这种写法而非 `<Welcome name="Tdahuyou" />` 这种写法的话，那么完全可以舍弃 JSX。
  - 尽管 JSX 不是必需的，但它极大地提高了开发效率和代码的可读性，因此在 React 社区中得到了广泛的应用。
  - 在日常开发中应该很少会有人更倾向于 `React.createElement` 这种写法，相较而言 JSX 显然更加直观，因此我们更多使用的是 JSX 这种写法来描述页面。
  - 不过也不要认为 `React.createElement` 这种写法就毫无意义，如果你编写的脚本不会通过 Babel 这样的工具进行编译处理，直接拿来运行的话，那就得使用 `React.createElement` 这种写法了。
