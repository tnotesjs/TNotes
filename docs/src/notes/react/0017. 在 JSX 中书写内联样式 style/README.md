# [0017. 在 JSX 中书写内联样式 style](https://github.com/Tdahuyou/react/tree/main/0017.%20%E5%9C%A8%20JSX%20%E4%B8%AD%E4%B9%A6%E5%86%99%E5%86%85%E8%81%94%E6%A0%B7%E5%BC%8F%20style)

<!-- region:toc -->
- [1. 📒 在 JSX 中书写内联样式 style](#1--在-jsx-中书写内联样式-style)
- [2. 💻 demos.1 - ❌ 错误写法 - 在 JSX 中的 style 写成字符串形式](#2--demos1----错误写法---在-jsx-中的-style-写成字符串形式)
- [3. 💻 demos.2 - ✅ 正确写法 - 采用对象的形式来写，属性名使用小驼峰的形式](#3--demos2----正确写法---采用对象的形式来写属性名使用小驼峰的形式)
- [4. 💻 demos.3 - 动态样式](#4--demos3---动态样式)
<!-- endregion:toc -->
- 本文介绍了在 JSX 中书写内联样式 style 的一些注意事项。

## 1. 📒 在 JSX 中书写内联样式 style

- 在 React 中使用 JSX 时，你可以通过 `style` 属性来直接应用内联样式到你的组件。
- 与 HTML 不同的是，在 JSX 中 `style` 属性需要一个 JavaScript 对象而不是 CSS 字符串。
- 这个对象的键通常采用驼峰命名法（camelCase），因为它们是作为 JavaScript 对象的属性，虽然采用 `-` 连接符（kebab-case）的属性名再包裹一层引号也是可以正常识别的，不过 react 会对此抛出警告。
- 如果你想要根据某些条件动态地改变样式，你可以在定义样式对象时使用表达式来控制样式的值。
- 注意：虽然内联样式非常方便，但大量使用可能会导致代码难以维护。对于更复杂的样式需求，推荐使用 CSS 类或 CSS-in-JS 库（如 styled-components 或 emotion）来实现。

## 2. 💻 demos.1 - ❌ 错误写法 - 在 JSX 中的 style 写成字符串形式

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style="color: red">Hello, World!</div>
    {/* JSX 中的 style 不能写成普通的字符串形式，否则会报错： */}
    {/* Uncaught Error: The `style` prop expects a mapping from */}
    {/* style properties to values, not a string. For example, */}
    {/* style={{marginRight: spacing + 'em'}} when using JSX. */}
  </StrictMode>
)
```

![](assets/2024-09-29-09-12-33.png)

## 3. 💻 demos.2 - ✅ 正确写法 - 采用对象的形式来写，属性名使用小驼峰的形式

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
const myStyle = {
  color: 'blue',

  fontSize: '20px', // [!code highlight]
  // 注意：这里使用的是驼峰命名法，对应于 CSS 中的 font-size
  // 如果要写为 font-size，需要加上引号，否则将被视作非法的 key 值，这会导致语法错误。
  // 'font-size': '20px',
  // 这种写法虽然可以正常生效，但是会报警告 Warning: Unsupported style property font-size. Did you mean fontSize?
  // 在 React 中，驼峰命名法是官方推荐的写法。
  // 因此，在 JSX 中书写内联样式 style 时，应该使用驼峰命名法，而不是使用 CSS 的原始写法。

  backgroundColor: '#eee', // [!code highlight]
  padding: '10px',
  border: '1px solid #000',
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={myStyle}>Hello, World!</div>
  </StrictMode>
)
```

- 最终渲染结果如下：
- ![](assets/2024-09-29-09-09-42.png)

## 4. 💻 demos.3 - 动态样式

```jsx
import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'

function MyDynamicComponent({ isActive }) {
  const dynamicStyle = {
    color: isActive ? 'green' : 'red',
    fontWeight: isActive ? 'bold' : 'normal',
  }

  return <p style={dynamicStyle}>This is a dynamically styled paragraph.</p>
}

function App() {
  const [isActive, setIsActive] = useState(true)
  return (
    <>
      <p>
        <button onClick={() => setIsActive(!isActive)}>
          Toggle Active State
        </button>
      </p>
      <MyDynamicComponent isActive={isActive} />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- 最终效果：
  - ![](assets/1.gif)

