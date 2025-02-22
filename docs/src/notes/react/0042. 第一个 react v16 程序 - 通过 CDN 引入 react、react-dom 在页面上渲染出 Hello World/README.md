# [0042. 第一个 react v16 程序 - 通过 CDN 引入 react、react-dom 在页面上渲染出 Hello World](https://github.com/Tdahuyou/react/tree/main/0042.%20%E7%AC%AC%E4%B8%80%E4%B8%AA%20react%20v16%20%E7%A8%8B%E5%BA%8F%20-%20%E9%80%9A%E8%BF%87%20CDN%20%E5%BC%95%E5%85%A5%20react%E3%80%81react-dom%20%E5%9C%A8%E9%A1%B5%E9%9D%A2%E4%B8%8A%E6%B8%B2%E6%9F%93%E5%87%BA%20Hello%20World)

<!-- region:toc -->
- [1. 🔗 相关链接](#1--相关链接)
- [2. 📒 通过 CDN 的方式引入相关依赖](#2--通过-cdn-的方式引入相关依赖)
- [3. 📒 API 简介 - `React.createElement`](#3--api-简介---reactcreateelement)
- [4. 📒 API 简介 - `React.render`](#4--api-简介---reactrender)
- [5. 💻 demos.1 - 在页面上渲染出 Hello World](#5--demos1---在页面上渲染出-hello-world)
- [6. 💻 demos.2 - 初步认识 React.createElement 和 JSX](#6--demos2---初步认识-reactcreateelement-和-jsx)
- [7. 🤔 `React.createElement` 跟 `document.createElement` 是一样的吗？](#7--reactcreateelement-跟-documentcreateelement-是一样的吗)
- [8. 🤔 `react` 核心库和 `react-dom` 库之间的关系是？](#8--react-核心库和-react-dom-库之间的关系是)
- [9. 🤔 为什么一旦使用了 `JSX` 语法，就必须要引入 `react` 核心库？](#9--为什么一旦使用了-jsx-语法就必须要引入-react-核心库)
- [10. 🤔 通过脚手架（比如 vite、umi、create-react-app）来搭建工程 vs. 通过（.html）页面的方式来直接引入 react 相关的库](#10--通过脚手架比如-viteumicreate-react-app来搭建工程-vs-通过html页面的方式来直接引入-react-相关的库)
<!-- endregion:toc -->
- 知识点
  - React.createElement 的基本使用
  - React Element 是不可变的
  - ReactDOM.render 的基本使用
  - JSX 其实就是 React.createElement 的简写，是一个语法糖。
- 本节不使用任何脚手架工具，通过 CDN 引入 react、react-dom，直接在（.html）页面上使用 react，实现一个 demo - 在页面上渲染出 Hello World。并借此 demo 来熟悉 React.createElement 和 ReactDOM.render 的基本用法。

## 1. 🔗 相关链接

- https://zh-hans.react.dev/reference/react/createElement
  - react createElement
- https://zh-hans.react.dev/reference/react-dom/render
  - react render - `React.render(reactNode, domNode, callback?)`
  - 注：在未来 React v19 中，此 API 将被移除。

## 2. 📒 通过 CDN 的方式引入相关依赖

```html
<!-- React 的核心库，与宿主环境无关 -->
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<!-- 依赖核心库，将核心的功能与页面结合 -->
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

- **注意版本**：这里引入的都是 `v16` 版。
- 这是早期写的 react 笔记，从现在这个时间点（2025 年 1 月 18 日 08:32:00）来看，最新的 react 版本应该是 v19 了，没记错的话 v16 应该是两年前左右（22 年初那会儿吧，当时大学还没毕业呢）发布的。

## 3. 📒 API 简介 - `React.createElement`

- 参数1：需要创建的 html 元素的名称，比如 h1 表示 h1 标签
- 参数2：元素属性，比如 id、class、style、onClick 等等，可以以一个对象的形式传入
- 参数3 ~ 参数n：子元素列表，比如 h1 标签中的文本内容，可以以一个字符串的形式传入，也可以传入由 React.createElement 创建的 React 元素
- 返回值是一个 React 元素，这个元素可以作为 ReactDOM.render 的第一个参数，表示要渲染的内容。
- **牢记由 React.createElement 创建的 react 元素是不可变的**
  - 虽然 JSX 元素是一个对象，但是该对象中的所有属性都是不可更改的。
  - 如果确实需要更改元素的属性，需要重新创建 JSX 元素。
  - 注：`react 元素 == JSX == React.createElement 创建的元素`
  - 当我们在口语表述 “react 元素”、“jsx”、“React.createElement 创建的元素”…… 这些内容的时候，大多时候想要表达的都是一个意思。

## 4. 📒 API 简介 - `React.render`

- 参数1：要渲染的内容，可以是 React 元素，也可以是字符串，也可以是数字，也可以是布尔值，也可以是 null，也可以是 undefined。
- 参数2：要渲染到哪个容器中，可以是一个 DOM 元素。
- 作用：将指定内容渲染到指定的容器中。

## 5. 💻 demos.1 - 在页面上渲染出 Hello World

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <!-- 这是接下来要渲染内容的容器 -->
  <div id="root"></div>
  <!-- React 的核心库，与宿主环境无关 -->
  <script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
  <!-- 依赖核心库，将核心的功能与页面结合 -->
  <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
  <script>
    // 创建一个 H1 元素
    const h1 = React.createElement("h1", {}, "Hello World");
    // 将 H1 元素渲染到 root 容器中
    ReactDOM.render(h1, document.getElementById("root"));
  </script>
</body>

</html>
```

- 最终渲染结果如下图所示：
- ![](assets/2024-09-18-10-37-59.png)

## 6. 💻 demos.2 - 初步认识 React.createElement 和 JSX

::: code-group

```html [React.createElement 式写法]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <div id="root"></div>
    <script
      crossorigin
      src="https://unpkg.com/react@16/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
    ></script>
    <script>
      // 创建一个 span 元素
      const span = React.createElement(
        'span',
        {
          title: '这是一个 span 元素',
        },
        'this is a span element'
      );

      // 创建一个 img 元素
      const img = React.createElement('img', {
        src: 'https://avatars.githubusercontent.com/u/125541114?v=4',
        width: '100px',
      });

      // 创建一个 div 元素
      const div = React.createElement('div', {}, '123', img, span);
      // 123、img、span 这些都会成为该 div 的子元素

      ReactDOM.render(div, document.getElementById('root'));
    </script>
  </body>
</html>
```

```html [JSX 式写法]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>

  <body>
    <div id="root"></div>
    <script
      crossorigin
      src="https://unpkg.com/react@16/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
    ></script>

    <!-- 引入 babel，用于编译 JSX，最终效果跟 React.createElement 函数调用的效果是完全一致的。 -->
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>

    <script type="text/babel">
      // const span = React.createElement("span", {
      //   title: '这是一个 span 元素'
      // }, "this is a span element");
      // const img = React.createElement('img', { src: 'https://avatars.githubusercontent.com/u/125541114?v=4', width: '100px' });
      // const div = React.createElement("div", {}, "123", img, span);

      // 最终要渲染的元素是由 React.createElement 创建的。
      // 但是使用 React.createElement 创建的话，写起来不是很舒服，和传统的 html 写法不太一样。
      // 因此，React 还给我们提供了 JSX 的语法。
      // 比如上述结构，我们如果改用 JSX 的写法来改写，最终页面上渲染出来的效果是完全等效的。
      // 在实际开发中，我们更多使用的也是 JSX 的语法来写我们的 React 组件。
      const div = (
        <div>
          123
          <img
            src="https://avatars.githubusercontent.com/u/125541114?v=4"
            width="100px"
          />
          <span title="这是一个 span 元素">this is a span element</span>
        </div>
      )

      ReactDOM.render(div, document.getElementById('root'))
    </script>
  </body>
</html>
```

:::

- `<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>` 需要引入 Babel 来编译 JSX。
- `<script type='text/babel'>` 需要让浏览器知道这部分的 JS 是需要交给 Babel 编译处理的脚本。
- 两者的最终渲染结果都是一样的，如下图所示：
- ![](assets/2024-09-18-10-49-30.png)

## 7. 🤔 `React.createElement` 跟 `document.createElement` 是一样的吗？

- 别想了，不可能是一样的。
- react 核心库是很纯粹的，里边是不包含任何跟宿主环境（比如，BOM `window`、DOM `document`）相关的 API 的，因此它们不可能是一个玩意儿。
- 可以认为前者 `React.createElement` 返回的就是一个跟宿主环境无关的普通 js 对象，在这个对象中记录了需要如何在页面上渲染出一个真实的元素节点的相关信息，它需要配合 react-dom 库一起使用，将它的返回结果丢给 react-dom，由 react-dom 去解析这些信息，渲染出真实 dom。
  - 【扩展】这里提到了 `React.createElement` 的返回值是一个普通的 js 对象，其实这就是 React 的虚拟 dom（virtual dom）。要知道 **虚拟 DOM** 并非啥多么神奇的技术，它实际上就是对实际 DOM 的抽象，它允许 React 在不影响浏览器性能的情况下高效地更新用户界面（更新信息暂时记录到虚拟 DOM 对象身上，最后明确需要修改的具体内容之后，才会转为真实 DOM 操作，触发页面更新）。当应用的状态发生变化时，React 会首先在虚拟 DOM 上进行更新和差异计算（diffing algorithm），然后将实际需要更改的部分批量应用到真实的 DOM 上，从而减少直接操作 DOM 所带来的性能开销。

## 8. 🤔 `react` 核心库和 `react-dom` 库之间的关系是？

- React 核心库提供了构建用户界面所需的所有基本功能，压根就不关心元素具体如何渲染。
  - `React` 核心库主要负责提供创建和管理组件所需的 API 和工具。它定义了如何声明组件、状态管理和生命周期方法等核心概念。
  - 它包含了如 `React.Component` 类、`useState`, `useEffect` 等 Hooks 函数以及 `React.createElement` 等用于创建 React 元素的方法。
  - 这个库不关心组件最终会被渲染到哪里，它可以是浏览器中的 DOM 节点，也可以是原生移动应用的视图组件（如在 React Native 中）。
- ReactDOM 则专注于将由 React 库创建的 react 元素（虚拟 DOM）渲染到浏览器环境中。`react-dom` 这个中间的 `-` 符号，可以将其理解为“连接”，就是将 react 和 dom 相互连接起来的意思。
- react 的这种设计，使得它不仅局限于浏览器环境中，还可以应用于其他场景，比如 **React Native** 就是在移动端使用 React 构建原生应用的一个例子。

## 9. 🤔 为什么一旦使用了 `JSX` 语法，就必须要引入 `react` 核心库？

- 比较官方的答复：
  - JSX 语法，是 react 官方提供的语法，它基于 react 的核心库，所以必须引入 react 核心库。
  - JSX 允许开发者在 JavaScript 代码中嵌入类似 HTML 的语法，但这种语法并不直接被 JavaScript 引擎理解。JSX 是 React 等库的一种语法糖，背后需要通过工具（如 Babel）进行编译转化成标准的 JavaScript 代码。
- **JSX 不是 es 官方标准吗？**
  - JSX 在最初是由 React 团队提出的，并被 React 社区广泛采用。对于是否将 JSX 纳入 JavaScript 标准，曾有过讨论。截止目前（2024 年 11 月 6 日 07:22:47）ES 官方没有将 JSX 纳入规范标准，如果要使用 JSX 的话，需要在中间加一层 bable 来对 JSX 进行编译。2017年，Babel 发布了支持 JSX 语法的编译器插件，使得使用 JSX 更加方便。
- **什么叫 JSX 基于 react 核心库？**
  - JSX 经过 babel 编译之后，会变成 `React.createElement` 函数调用，而 `React.createElement` 是 react 核心库中的一个函数。最终会返回一个 react 元素对象（虚拟 DOM），这个对象包含了所有需要渲染的信息，包括标签名、属性、子元素等。

## 10. 🤔 通过脚手架（比如 vite、umi、create-react-app）来搭建工程 vs. 通过（.html）页面的方式来直接引入 react 相关的库

- 如果想要快速搭建一个 react 项目，推荐使用脚手架，因为脚手架会帮我们做更多的工程配置，比如 babel 的配置，webpack 的配置，eslint 的配置等，这些配置都帮我们做了，我们只需要关注业务代码就可以了。
- 脚手架能做的在页面上也都能做，脚手架解决的问题无非是做了工程的一些初始的模块化处理，让工程结构更清晰，帮我们省去搭建工程的步骤，最终运行的打包产物，依旧是这种传统的 html 页面形式，本质是没变的。通过本节这种页面级的形式来引入 react，省掉中间嵌套的包裹层，或许能更好地帮助我们理解 react 的本质。



