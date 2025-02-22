# [0048. HTML Tag vs. React Element vs. JSX Element](https://github.com/Tdahuyou/react/tree/main/0048.%20HTML%20Tag%20vs.%20React%20Element%20vs.%20JSX%20Element)

<!-- region:toc -->
- [1. 📒 三者的关系与区别](#1--三者的关系与区别)
- [2. 📒 React 中的 HTML Tag](#2--react-中的-html-tag)
- [3. 📒 JSX Element](#3--jsx-element)
- [4. 📒 React Element](#4--react-element)
- [5. 🤔 为什么要写这篇笔记？](#5--为什么要写这篇笔记)
<!-- endregion:toc -->

## 1. 📒 三者的关系与区别

| **术语**           | **React 中的 HTML Tag 和 JSX Element**   | **React Element**                                                       |
| ------------------ | ---------------------------------------- | ----------------------------------------------------------------------- |
| **本质**           | React Element 语法糖                     | 描述 UI 的 JavaScript 对象                                              |
| **用途**           | 降低 React Element 的书写成本            | React 内部使用，描述 UI 的结构                                          |
| **需要编译**       | ✅                                       | ❌                                                                      |
| **示例**           | `<div className="container">Hello</div>` | `{ type: 'div', props: { className: 'container', children: 'Hello' } }` |

- **React 中的 HTML Tag 和 JSX Element** 是一种语法糖，帮助开发者更方便地编写 React Element，最终会被编译为 `React.createElement` 调用。
- **React Element** 是 React 内部的数据结构，用于描述 UI 的状态和结构。

## 2. 📒 React 中的 HTML Tag

- **在 React 中，JSX 中的 HTML Tag 是一种语法糖，用于更直观地描述 UI 结构，最终会被转换为 React Element。**
- **注意：**
  - 这里提到的 **HTML Tag** 是指在 JSX 语句中使用的类似 HTML 的标签，比如 `<div>`、`<span>` 等，而非原生的 HTML 中的标签。
  - 这些标签看起来像是原生的 HTML 标签，但它们实际上是 React 中的一种特殊语法，最终会被编译为 JavaScript 对象（React Element）。
- **定义：**
  - 在 JSX 中使用的 HTML Tag（如 `<div>`、`<span>` 等）并不是真正的原生 HTML 标签，而是 React 提供的一种语法糖。
  - 这些标签最终会被 Babel 等工具编译为 `React.createElement` 调用，生成对应的 `React Element`。
- **特点：**
  - 它们是 JSX 语法的一部分，用于描述 UI 的结构。
  - 这些标签可以接受属性（props），并且可以嵌套子元素。
  - 它们的 **命名遵循 HTML 的标准**，但本质上是 React 的抽象。
    - **命名遵循 HTML 的标准**：也就是传统的 HTML 标签名咋写，在 JSX 中就咋写。
    - 不过需要注意一些特殊属性的命名，比如：
      - 样式属性应该写为 `className`，而不是 `class`；
      - `<label>` 标签的 `for` 属性应该写为 `htmlFor`，而不是 `for`；
      - ……
- **示例：**

```jsx
const element = <div className="container">Hello, World!</div>

// 经过编译后，上述代码会变成：

const element = React.createElement(
  'div',
  { className: 'container' },
  'Hello, World!'
)
```

## 3. 📒 JSX Element

- JSX Element 是一种语法糖，它的作用是让开发者更容易地编写 React Element。
- **定义：**
  - JSX Element 是 JSX 语法中的一部分，它最终会被编译成 `React.createElement` 调用，从而生成 React Element。
  - JSX 允许开发者在 JavaScript 中编写类似 HTML 的代码。
- **特点：**
  - JSX 提供了一种更直观、更简洁的方式来描述 UI 结构。
  - JSX 不是必需的，但它极大地简化了 React 的开发体验。
  - JSX 最终会被 Babel 等工具编译为普通的 JavaScript 代码。
- **示例：**

```jsx
const jsxElement = <div className="container">Hello, World!</div>

// 经过编译后，上述代码会变成：

const jsxElement = React.createElement(
  'div',
  { className: 'container' },
  'Hello, World!'
)
```

## 4. 📒 React Element

- **React Element 是 React 内部使用的数据结构，用于描述 UI 的结构和状态。**
- **定义：**
  - React Element 是对 UI 的轻量级描述，是一个普通的 JavaScript 对象。
  - 它包含了组件类型（type）、属性（props）以及子元素（children）等信息。
- **特点：**
  - React Element 可以通过 JSX 或 `React.createElement` 创建。
  - 它们不是真实的 DOM 节点，而是对 DOM 节点或组件的描述。
  - React 使用这些描述对象来高效地更新和渲染 UI。
- **示例：**

```javascript
const reactElement = React.createElement(
  'div',
  { className: 'container' },
  'Hello, World!'
)

// 上述代码生成的 React Element 对象类似于：

{
  type: 'div',
  props: {
    className: 'container',
    children: 'Hello, World!'
  },
  // ... other props
}
```


## 5. 🤔 为什么要写这篇笔记？

- 在学习过程中，被一些概念搞得晕头转向，感觉它们好像是一个东西，但是有些时候又存在冲突，比如：
  - `React Component`
  - `React Element`
  - `JSX Element`
  - `HTML Tag`
  - ……
- 🌰 举一个描述互相冲突的示例：
  - 先来看看官方原话：
    - ![](assets/2025-02-15-05-49-02.png)
    - https://react.dev/learn
    - `React component names must always start with a capital letter, while HTML tags must be lowercase.`
    - **1️⃣ React 组件命名必须以大写字母开头，而 HTML 标签则必须以小写字母开头。**
  - 组件名必须以大驼峰的形式来命名，这句话本身是没错的，可是还有一些说法，比如：
    - **2️⃣ HTML TAG 是 React 组件。**
    - 这句话其实也没说错，HTML Tag 是 React 帮我们预先定义好的特殊的内置组件。
    - 但是如果将 1️⃣、2️⃣ 结合起来看，描述就冲突了。
- 一些个人经验之谈：
  - 在学习过程中，会遇到很多类似这样描述冲突的 🌰 示例，很多时候没必要死扣字眼，重点在于 **理解描述本身在其所在的上下文中想要传达含义**。
    - 1️⃣ 强调的是命名规则上的区别（大小写），是从语法层面出发，帮助开发者区分 HTML 标签和自定义组件。
    - 2️⃣ 强调的是本质上的相似性（都是 React Element），是从内部实现的角度出发，揭示 HTML 标签和自定义组件的共同本质。
    - **1️⃣ React 组件命名必须以大写字母开头，而 HTML 标签则必须以小写字母开头。**
      - 这句话中的 **React 组件**，它指代的是我们在 React 中书写的函数组件和类组件，对于这些组件我们需要按照规范来命名，必须采用大驼峰的形式来写。
      - 可以认为这里的 **React 组件** 是不包含 **HTML 标签** 的。
    - **2️⃣ HTML TAG 是 React 组件。**
      - 这句话想要强调的是 **HTML TAG** 的本质其实是 **React Element** 的语法糖，它跟 **React 组件** 一样，最终都会被转为 `React.createElement` 函数调用，生成对应的 `React Element`，从这一层面来说的话，**HTML TAG** 跟 **React 组件** 本质是一样的。
  - **🤔 为什么会出现这些冲突性的描述呢？**
    - `React Component`、`React Element`、`JSX Element`、`HTML Tag`、…… 这些玩意儿在 React 中，其实都是用来描述 UI 的，它们最终都会被转为 `React.createElement` 调用，生成对应的 `React Element`。正是因为它们存在这一共性，所以在很多描述场景中，不同的笔者可能会从不同的角度出发，采用不同的代词来表述，作为读者，重要的是：**理解描述背后的含义，而不是死扣字眼；关注概念的本质，而不是纠结于具体的措辞**。
    - 这种思考方式不仅适用于 React 学习，也适用于其他技术的学习。通过理解上下文和本质，能够更高效地掌握复杂的概念。
- 最后，再简单介绍一些开始提到的 `React Component`、`React Element`、`JSX Element`、`HTML Tag` 分别是什么。
  - **React Component**：通常指的是开发者定义的函数组件或类组件，用于封装 UI 的逻辑和结构。
  - **React Element**：通常表示对 UI 的轻量级描述，也就是一个普通的 JavaScript 对象，包含 `type` 和 `props`。
    - 也可以说 React 中用于描述 UI 的（React 组件、JSX 元素、HTML TAG ……）其实都是 React Element。
  - **JSX Element**：JSX 语法中的一部分，最终会被编译为 `React.createElement` 调用，生成 React Element。
  - **HTML Tag**：在 JSX 中使用的类似 HTML 的标签（如 `<div>`、`<span>`），实际上是 React 的内置组件。

