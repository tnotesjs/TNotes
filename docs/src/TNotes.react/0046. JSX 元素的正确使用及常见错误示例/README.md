# [0046. JSX 元素的正确使用及常见错误示例](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0046.%20JSX%20%E5%85%83%E7%B4%A0%E7%9A%84%E6%AD%A3%E7%A1%AE%E4%BD%BF%E7%94%A8%E5%8F%8A%E5%B8%B8%E8%A7%81%E9%94%99%E8%AF%AF%E7%A4%BA%E4%BE%8B)

<!-- region:toc -->

- [1. 💻 demos.1 - JSX 元素的正确使用及常见错误示例](#1--demos1---jsx-元素的正确使用及常见错误示例)

<!-- endregion:toc -->

## 1. 💻 demos.1 - JSX 元素的正确使用及常见错误示例

::: code-group

```jsx{4,13} [1️⃣ ✨]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const divEle = <div>this is a div element</div> // ✨
// 这是一种常见的写法，用于表达 divEle 是一个 React 元素。
// 若我们要使用这个元素，正确的做法是通过 {divEle} 这种写法来引用。
// 注意，它并非一个组件，因此它不能直接使用 <divEle /> 这种写法来引用。
// React 中判断一个组件的逻辑比较简单，只要它以大写字母开头，就认为它是一个组件。

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ 正确写法： */}
    {divEle}      {/* ✨ 推荐写法 */}

    {/* ❌ 错误写法： */}
    {/* <divEle /> */}

    {/* 报错：Warning: <divEle /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements. */}
    {/* 中：<divEle /> 使用了错误的大小写，应该使用 PascalCase（大驼峰）来定义 React 组件，或者使用小写来定义 HTML 元素。 */}
  </StrictMode>
)
```

```jsx{4,12} [2️⃣]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const DivEle2 = <div>this is a div element 2</div>
// 这种写法很不常见。
// 如果你定义了一个这样的 DivEle2，那么它将被 React 视作一个组件，但是实际上你很清楚，它并非 class/function 类型，而是一个普通的 React 元素，压根就不是一个组件。
// 当你通过 {DivEle2} 引用时是 ok 的，但是若采用 <DivEle2 /> 这种写法时，会报错，因为 React 会将其视作一个组件来渲染，但是它并非组件，相当于咱们欺骗了 React。

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ 正确写法： */}
    {DivEle2}     {/* 很不常见 */}

    {/* ❌ 错误写法： */}
    {/* <DivEle2 /> */}
    {/* 报错：
    Warning: React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: <div />. Did you accidentally export a JSX literal instead of a component?
    Uncaught Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object. */}
    {/* 中：
    React.jsx: type 是无效的 -- 预期应该是一个字符串（用于内置组件）或一个类/函数（用于组合组件），但实际是：<div />。 您是否意外导出了一个 JSX 引用，而不是一个组件？
    未捕获的错误：元素类型无效：期望的是字符串（对于内置组件）或类/函数（对于复合组件），但得到了对象。 */}
  </StrictMode>
)
```

```jsx{4,13} [3️⃣]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const divFun = () => <div>this is a div function</div>
// 这种写法不太常见，不过也有这么写的，主要用于表达这是一个简单的模板，几乎没啥额外的逻辑，可能需要在调用的时候需要传入一些参数对模板进行简单的配置。
// 当我们这么写时通常时想要表达 divFun 是一个函数组件，返回一段 jsx 表达式，但是它并不符合 React 中组件名的命名规范（大驼峰）。
// 正确的写法应该是 DivFun，而不是 divFun。
// 当我们采用这种写法时，由于 React 不会将其视作一个函数组件，因此在模板中不能采用 <divFun /> 这种写法，只能将其视作普通的函数调用来使用 {divFun()}。

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ 正确写法： */}
    {divFun()}    {/* 不太常见 */}

    {/* ❌ 错误写法： */}

    {/* <divFun /> */}
    {/* 报错：Warning: <divFun /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements. */}
    {/* 中：<divFun /> 使用了错误的大小写，应该使用 PascalCase（大驼峰）来定义 React 组件，或者使用小写来定义 HTML 元素。 */}

    {/* {divFun} */}
    {/* 报错：Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it. */}
    {/* 中：函数不能作为 React 子元素。这可能是因为您返回了一个组件而不是 <Component /> 而导致。或者您可能想调用此函数，而不是返回它。 */}
  </StrictMode>
)
```

```jsx{4-7,15} [4️⃣ ✨]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const DivComp = () => { // ✨
   // ... 组件内部的其它逻辑
   return <div>this is a div comp</div> // 最终返回一段 jsx 来描述组件 UI
}
// 这种写法是主流的写法，当我们这么写时通常时想要表达 DivComp 是一个函数组件，返回一段 jsx 表达式，符合 React 中组件名的命名规范（大驼峰）。
// 在调用的时候，我们通常会使用组件的形式来调用 <DivComp />。
// 当然，也可以使用 {DivComp()} 这种形式来调用，因为它本质上也是一个函数，不过这种写法并不常见。

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ 正确写法： */}
    <DivComp />   {/* ✨ 推荐写法 */}
    {DivComp()}   {/* 很不常见 */}
  </StrictMode>
)
```

```jsx [5️⃣ 完整示例]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const divEle = <div>this is a div element</div> // ✨
// 这是一种常见的写法，用于表达 divEle 是一个 React 元素。
// 若我们要使用这个元素，正确的做法是通过 {divEle} 这种写法来引用。
// 注意，它并非一个组件，因此它不能直接使用 <divEle /> 这种写法来引用。
// React 中判断一个组件的逻辑比较简单，只要它以大写字母开头，就认为它是一个组件。

const DivEle2 = <div>this is a div element 2</div>
// 这种写法很不常见。
// 如果你定义了一个这样的 DivEle2，那么它将被 React 视作一个组件，但是实际上你很清楚，它并非 class/function 类型，而是一个普通的 React 元素，压根就不是一个组件。
// 当你通过 {DivEle2} 引用时是 ok 的，但是若采用 <DivEle2 /> 这种写法时，会报错，因为 React 会将其视作一个组件来渲染，但是它并非组件，相当于咱们欺骗了 React。

const divFun = () => <div>this is a div function</div>
// 这种写法不太常见，不过也有这么写的，主要用于表达这是一个简单的模板，几乎没啥额外的逻辑，可能需要在调用的时候需要传入一些参数对模板进行简单的配置。
// 当我们这么写时通常时想要表达 divFun 是一个函数组件，返回一段 jsx 表达式，但是它并不符合 React 中组件名的命名规范（大驼峰）。
// 正确的写法应该是 DivFun，而不是 divFun。
// 当我们采用这种写法时，由于 React 不会将其视作一个函数组件，因此在模板中不能采用 <divFun /> 这种写法，只能将其视作普通的函数调用来使用 {divFun()}。

const DivComp = () => <div>this is a div comp</div> // ✨
// 这种写法是主流的写法，当我们这么写时通常时想要表达 DivComp 是一个函数组件，返回一段 jsx 表达式，符合 React 中组件名的命名规范（大驼峰）。
// 在调用的时候，我们通常会使用组件的形式来调用 <DivComp />。
// 当然，也可以使用 {DivComp()} 这种形式来调用，因为它本质上也是一个函数，不过这种写法并不常见。

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ 正确写法： */}
    {divEle}      {/* ✨ 推荐写法 */}
    {DivEle2}     {/* 很不常见 */}
    {divFun()}    {/* 不太常见 */}
    <DivComp />   {/* ✨ 推荐写法 */}
    {DivComp()}   {/* 很不常见 */}

    {/* ❌ 错误写法： */}

    {/* <divEle /> */}

    {/* 报错：Warning: <divEle /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements. */}
    {/* 中：<divEle /> 使用了错误的大小写，应该使用 PascalCase（大驼峰）来定义 React 组件，或者使用小写来定义 HTML 元素。 */}


    {/* <divFun /> */}
    {/* 报错：Warning: <divFun /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements. */}
    {/* 中：<divFun /> 使用了错误的大小写，应该使用 PascalCase（大驼峰）来定义 React 组件，或者使用小写来定义 HTML 元素。 */}

    {/* {divFun} */}
    {/* 报错：Warning: Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it. */}
    {/* 中：函数不能作为 React 子元素。这可能是因为您返回了一个组件而不是 <Component /> 而导致。或者您可能想调用此函数，而不是返回它。 */}

    {/* <DivEle2 /> */}
    {/* 报错：
    Warning: React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: <div />. Did you accidentally export a JSX literal instead of a component?
    Uncaught Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: object. */}
    {/* 中：
    React.jsx: type 是无效的 -- 预期应该是一个字符串（用于内置组件）或一个类/函数（用于组合组件），但实际是：<div />。 您是否意外导出了一个 JSX 引用，而不是一个组件？
    未捕获的错误：元素类型无效：期望的是字符串（对于内置组件）或类/函数（对于复合组件），但得到了对象。 */}
  </StrictMode>
)
```

:::

- jsx 元素包括 div、span、button、img 等等，可以将它们视为 react 中特殊的内置组件，也就是传统的 html 标签。除了特殊的内置组件外，jsx 元素也包括自定义的组件。
- jsx 元素的写法是非常灵活的，不过常见的主流写法并不多，需要重点掌握的是 1️⃣、4️⃣ 中的常见写法，3️⃣ 中的写法偶尔会见到，几乎不会见到有人采用 2️⃣ 这种写法。
