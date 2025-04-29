# [0009. 在 JSX 中使用 JS 表达式](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0009.%20%E5%9C%A8%20JSX%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20JS%20%E8%A1%A8%E8%BE%BE%E5%BC%8F)

<!-- region:toc -->

- [1. 🔗 官方文档 - 在 JSX 中通过大括号使用 JavaScript](#1--官方文档---在-jsx-中通过大括号使用-javascript)
- [2. 📒 在 JSX 中使用 JS 表达式](#2--在-jsx-中使用-js-表达式)
- [3. 📒 不会显示的一些特殊值](#3--不会显示的一些特殊值)
- [4. 📒 在 JSX 的大括号内使用 JavaScript 对象](#4--在-jsx-的大括号内使用-javascript-对象)
- [5. 💻 demos.1 - 官方示例 - 渲染头像](#5--demos1---官方示例---渲染头像)
  - [5.1. 🔍 扩展 - Hedy Lamarr 是谁？](#51--扩展---hedy-lamarr-是谁)
- [6. 💻 demos.2 - 在表达式中无法渲染的一些特殊值](#6--demos2---在表达式中无法渲染的一些特殊值)
- [7. 💻 demos.3 - 无法渲染普通对象，可以渲染 react 元素对象](#7--demos3---无法渲染普通对象可以渲染-react-元素对象)

<!-- endregion:toc -->

## 1. 🔗 官方文档 - 在 JSX 中通过大括号使用 JavaScript

- https://zh-hans.react.dev/learn/javascript-in-jsx-with-curly-braces
- 介绍了以下这些点：
  - 如何使用引号传递字符串
  - 在 JSX 的大括号内引用 JavaScript 变量
  - 在 JSX 的大括号内调用 JavaScript 函数
  - 在 JSX 的大括号内使用 JavaScript 对象
- [ ] ⏰ 文章还没仔细读过，找时间仔细看看，能整合到笔记中的内容，到时候搬运进来。

## 2. 📒 在 JSX 中使用 JS 表达式

- JSX 让你可以在 Jaavascript 中嵌入 HTML 语法，而大括号可以让你在 JSX 中 “回到” JavaScript 中，这样你就可以从你的代码中嵌入一些变量并展示给用户。
- 嵌入表达式意味着将表达式的返回值作为 JSX 内容的一部分插入到 JSX 中。
  - 类似于 vue 中的指令 v-bind 的作用。
- 嵌入表达式的语法非常简单，使用一对大括号来包裹即可 `{xxx}`，xxx 就是我们嵌入的表达式。
- 例如，下面 👇 这将显示 `user.name`：

```jsx{3}
return (
  <h1>
    {user.name}
  </h1>
);
```

- 你还可以将 JSX 属性 “转义到 JavaScript”，但你必须使用 **大括号** 而非引号。
- 注意：
  - react 中元素的属性名应该使用小驼峰命名法。
  - 需要注意一些特殊属性名（和 js 关键字冲突的一些值）的写法，比如：
    - `class` 属性，需要写为 `className`；
    - 表单中的 `<label>` 的 `for` 属性，需要写为 `htmlFor`；
    - ……
- 例如：
  - `className="avatar"` 是将 "avatar" 字符串传递给 className，作为 CSS 的 class。
  - `src={user.imageUrl}` 会读取 JavaScript 的 `user.imageUrl` 变量，然后将该值作为 src 属性。

```jsx{4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

- 你也可以把更为复杂的表达式放入 JSX 的大括号内。
- 例如：字符串拼接

```jsx{14}
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

## 3. 📒 不会显示的一些特殊值

- 在 JSX 的大括号中插入 `null`、`undefined`、`false`、`ture`、`""`、`[]`、`注释` 这些值是不会显示的。
- 如果要显示的话则不应该丢到大括号中，应该直接书写，将其事做普通的字符串来显示。
- ⚠️ 上述罗列的这些值不一定全，可能还有其它特殊值也是不会显示的。需要掌握的是：**如果想要在页面中展示这些不会渲染的特殊值，应该如何书写 jsx 即可**。

## 4. 📒 在 JSX 的大括号内使用 JavaScript 对象

- ❌ 普通对象，不可以作为子元素。
  - 在 JSX 的大括号中插入普通对象（比如 `{ foo: 123, bar: 'abc' }`）是无法渲染的，会报错。
- ✅ React 元素对象是 ok 的。

## 5. 💻 demos.1 - 官方示例 - 渲染头像

::: code-group

```jsx{16,19-24} [main.jsx]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Profile.css'

// 由于可以在 jsx 中插入表达式，因此我们可以将非常灵活地处理 JSX 中的一些动态值。
// 可以将相关值存储在变量中，然后在 JSX 中通过表达式将其嵌入进去。
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
}

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize,
        }}
      />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Profile />
  </StrictMode>
)
```

```css [Profile.css]
.avatar {
  border-radius: 50%;
}
```

:::

- 最终渲染效果如下：
  - ![](assets/2024-09-24-14-17-10.png)

### 5.1. 🔍 扩展 - Hedy Lamarr 是谁？

> 本节笔记中提到的 Hedy Lamarr 来自于 react 官方文档。由于不认识这个人，就简单搜了一下，总之是个了不起的人就对了。
>
> ![](assets/2025-01-17-17-54-01.png)

- https://www.douban.com/personage/27246464/
  - 豆瓣 - 海蒂·拉玛 Hedy Lamarr
- https://en.wikipedia.org/wiki/Hedy_Lamarr
  - wiki - Hedy Lamarr
- Hedy Lamarr（1914年11月9日—2000年1月19日），原名海德维希·爱娃·玛丽亚·基斯勒（Hedwig Eva Maria Kiesler），是一位奥地利裔美国女演员，同时也是一位发明家。她在电影界的生涯跨越了从无声电影到有声电影的时代，并在好莱坞黄金时代成为了一位著名的影星。
- Lamarr 出生于奥地利维也纳的一个犹太家庭，在她的早期职业生涯中，她在欧洲电影界崭露头角。18岁时，她出演了争议性的电影《狂喜》（Ecstasy, 1933），该片因其大胆的裸露场景而引起了轰动。随后，她与一位比她年长很多的军火商弗里茨·曼德尔结婚，这段婚姻并不幸福，最终她逃离了丈夫，并前往巴黎，后来移居美国。
- 在美国，Lamarr 更名为 Hedy Lamarr 并开始了她的好莱坞生涯。她出演了许多成功的电影，包括《齐格菲女郎》（Ziegfeld Girl, 1941）和《塞缪尔·戈德温的天堂》（Heavenly Partners, 1947）等。
- 除了她的演艺事业外，Lamarr 还是一名才华横溢的发明家。她对技术非常感兴趣，并与音乐家乔治·安泰尔共同开发了一种称为“频率跳变”（frequency hopping）的技术，这项技术最初是为了帮助盟军在第二次世界大战期间对抗德国潜艇的干扰信号。虽然当时这项专利没有被广泛使用，但它的原理后来成为了现代无线通信技术的基础之一，包括Wi-Fi、蓝牙以及手机网络等。
- 直到晚年，Hedy Lamarr 的科学贡献才逐渐被人们所认识。1997年，她获得了电子前沿基金会（Electronic Frontier Foundation, EFF）颁发的先锋奖，以表彰她在扩展频谱通信领域的贡献。尽管她的名字可能不如她的银幕形象那样广为人知，但她作为一位先驱女性科学家的地位是不可否认的。

## 6. 💻 demos.2 - 在表达式中无法渲染的一些特殊值

```jsx{16-22}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 表达式的值如果是以下这些特殊值，则不会渲染。
const x1 = null
const x2 = undefined
const x3 = false
const x4 = true
const x5 = ''
const x6 = <>{/* 注释内容 */}</>
const x7 = []

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 下面这些特殊值不会渲染到页面上 */}
    <div>x1: {x1}</div>
    <div>x2: {x2}</div>
    <div>x3: {x3}</div>
    <div>x4: {x4}</div>
    <div>x5: {x5}</div>
    <div>x6: {x6}</div>
    <div>x7: {x7}</div>

    <hr />

    {/* 如果要在页面上展示这些特殊值，可以直接书写对应的字符串形式。 */}
    <div>x1: null</div>
    <div>x2: undefined</div>
    <div>x3: false</div>
    <div>x4: true</div>
    <div>x5: ''</div>
    <div>x6: {"<>{/* 注释内容 */}</>"}</div>
    <div>x7: []</div>
  </StrictMode>
)
```

- 最终渲染结果如下：
- ![](assets/2025-01-18-07-42-02.png)
- ![](assets/2025-01-18-07-42-31.png)

## 7. 💻 demos.3 - 无法渲染普通对象，可以渲染 react 元素对象

::: code-group

```jsx{11} [❌ 无法渲染普通对象]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const userInfo = {
  name: 'Tdahuyou',
  age: 25,
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {userInfo}
    {/*
      ❌ 这种写法会报错
      Objects are not valid as a React child (found: object with keys {name, age}).
    */}
  </StrictMode>
)
```

```jsx{12-15} [✅ 可以渲染 react 元素对象]
import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'

const userInfo = {
  name: 'Tdahuyou',
  age: 25,
}

// 创建 react element 对象

// 写法 1：jsx 式写法：【更常见】
const userInfoContainer = <div>
  <p>name: {userInfo.name}</p>
  <p>age: {userInfo.age}</p>
</div>

// 写法 2：createElement 式写法：【更写法 1 是等效的】
// const userInfoContainer = createElement('div', null,
//   createElement('p', null, `name: ${userInfo.name}`),
//   createElement('p', null, `age: ${userInfo.age}`),
// )

console.log(typeof userInfoContainer) // => object

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ 可以渲染 react 元素对象 */}
    {userInfoContainer}
  </StrictMode>
)
```

:::

- 最终渲染结果如下：
- ![](assets/2025-01-18-07-52-37.png)
- ![](assets/2025-01-18-07-52-50.png)
