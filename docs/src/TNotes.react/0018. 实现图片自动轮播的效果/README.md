# [0018. 实现图片自动轮播的效果](https://github.com/Tdahuyou/TNotes.react/tree/main/notes/0018.%20%E5%AE%9E%E7%8E%B0%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E8%BD%AE%E6%92%AD%E7%9A%84%E6%95%88%E6%9E%9C)

<!-- region:toc -->

- [1. 💻 demos.1 - 图片自动轮播](#1--demos1---图片自动轮播)
- [2. 💻 demos.2 - 来看一个常见的由于定时器混乱错误引发的 bug](#2--demos2---来看一个常见的由于定时器混乱错误引发的-bug)

<!-- endregion:toc -->

## 1. 💻 demos.1 - 图片自动轮播

- 实现一个图片定时切换的 demo，类似轮播效果。
- 功能
  - 间隔 2s 切换图片
  - 鼠标悬停在图片上时，停止切换
  - 鼠标离开图片时，继续切换

::: code-group

```jsx {22} [✅ 正确做法]
import { createRoot } from 'react-dom/client'

import './index.css'

import src1 from './assets/week-1.png'
import src2 from './assets/week-2.png'
import src3 from './assets/week-3.png'

const srcs = [src1, src2, src3] //保存图片路径的数组

let index = 0 // 显示的图片索引

const container = document.getElementById('root')
container.onmouseenter = stop
container.onmouseleave = start

let timer
const root = createRoot(container)

function render() {
  console.log('render')
  root.render(<img src={srcs[index]} alt="" />)
}

function start() {
  console.log('start')
  stop()
  timer = setInterval(() => {
    index = (index + 1) % 3
    render()
  }, 2000)
}

function stop() {
  console.log('stop')
  clearInterval(timer)
}

render()
start()
```

```js {13} [❌ 错误做法]
// 在这个 demo 中，可能会出现下面这样的错误做法。
const img = <img src={srcs[index]} alt="" />
function render() {
  console.log('render')
  root.render(img)
}

function start() {
  console.log('start')
  stop()
  timer = setInterval(() => {
    index = (index + 1) % 3
    img.src = srcs[index]
    render()
  }, 2000)
}
```

:::

- ✅ 正确做法：相当于每次都渲染一个新的 `img`。
- ❌ 错误做法：
  - 如果你这么做了，将会喜提以下报错：
  - ![](assets/2024-10-27-19-10-08.png)
  - 原因分析：
    - `const img = <img src={srcs[index]} alt="" />` 通过这种 jsx 语法创建的 react 元素，在编译的时候，会被转换为由 React.createElement 函数去调用，而这玩意儿返回的对象，是不可变的。
    - 下面是来自官方的原话：
    - ![](assets/2024-10-27-19-14-18.png)
    - https://react.dev/reference/react/createElement#caveats
    - **🤔 `caveats` 是什么意思？**
      - "caveats" 是拉丁语 "caveat" 的复数形式，意思是“注意事项”或“警告”。
      - 它通常用于指出某件事情的潜在问题或限制条件。
      - 在技术文档或代码注释中，"caveats" 一词常用来提醒开发者在使用某个功能或实现某些代码时需要注意的地方。
- **🤔 既然 react 元素不可变，那么如何更新页面呢？每次都要重新创建一个元素对象，然后 render？效率会不会太低了？**
  - 效率并不低，react 在内部会对 render 做优化。
  - **在重新渲染的时候，并非将整个 dom 删了，然后再重新创建，而是尽可能地复用已有的结构，仅改变必要的内容，实现重新渲染。**
    - **🤔 如何验证这一点？**
      - 可以打开浏览器调试工具，在图片切换的时候，查看 dom 的变化，闪烁的部分就是更新的部分，会发现在每次切换图片的时候，之后 img 的 src 发生了变化。由此可见，并非每次渲染，都是将之前的工作全部推翻重来，而是尽可能地复用之前工作的成果，仅更新必要的部分，以实现性能优化。这可以说是大部分前端框架的基操了。
      - ![](assets/2024-10-27-19-21-31.png)
      - 或者，你也可以在任意两个时刻，收集一下 `#root img`，然后比较它们是否是同一个 DOM 对象。
      ```js
      // 在控制台执行这一部分代码，会发现打印的结果依旧是 true。
      const img1 = document.querySelector('#root img')
      setTimeout(() => {
          const img2 = document.querySelector('#root img')
          console.log('img1 === img2', img1 === img2)
          // img1 === img2 true
      }, 3000)
      ```
  - **🤔 为什么这里要重点强调这一点呢？**
    - 这一部分是 react 核心原理之一，也是面试中常问的点。
    - 比如：
      - 请谈谈 react 的一些性能优化点。
      - 你知道 react 中的 diff 算法吗？
      - ……

## 2. 💻 demos.2 - 来看一个常见的由于定时器混乱错误引发的 bug

::: code-group

```js {12,16,24} [❌ 错误的 timer]
import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import src1 from './assets/week-1.png'
import src2 from './assets/week-2.png'
import src3 from './assets/week-3.png'
const srcs = [src1, src2, src3]

function ImageSlider() {
  const [index, setIndex] = useState(0)
  let timer = null

  const start = () => {
    stop()
    timer = setInterval(() => {
      console.log('change')
      setIndex((prevIndex) => (prevIndex + 1) % srcs.length)
    }, 1000)
  }

  const stop = () => {
    console.log('stop')
    clearInterval(timer)
  }

  useEffect(() => {
    start() // 在组件挂载后启动轮播

    return () => {
      stop() // 在组件即将被卸载时停止轮播
    }
  }, [])

  return (
    <div className="card-box" onMouseEnter={stop} onMouseLeave={start}>
      <img src={srcs[index]} alt="" />
      <p>{index}</p>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImageSlider />
  </StrictMode>
)
```

```js {12,16,24} [✅ 正确的 timer]
import { StrictMode, useEffect, useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import src1 from './assets/week-1.png'
import src2 from './assets/week-2.png'
import src3 from './assets/week-3.png'
const srcs = [src1, src2, src3]

function ImageSlider() {
  const [index, setIndex] = useState(0)
  const timer = useRef(null)

  const start = () => {
    stop()
    timer.current = setInterval(() => {
      console.log('change')
      setIndex((prevIndex) => (prevIndex + 1) % srcs.length)
    }, 1000)
  }

  const stop = () => {
    console.log('stop')
    clearInterval(timer.current)
  }

  useEffect(() => {
    start() // 在组件挂载后启动轮播

    return () => {
      stop() // 在组件即将被卸载时停止轮播
    }
  }, [])

  return (
    <div className="card-box" onMouseEnter={stop} onMouseLeave={start}>
      <img src={srcs[index]} alt="" />
      <p>{index}</p>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ImageSlider />
  </StrictMode>
)
```

:::

- ❌ 错误写法
  - `let timer = null` 被定义为一个普通的变量，而不是 React 的状态或引用（如 useRef）。
  - 出现 bug 的根本原因是每次 clear 的 timer 和启动的 timer 不一致。可以在每次启动可清理的时候，将 timer 在控制台打印出来看看。
- ✅ 正确写法
  - 使用 useRef 包裹了一下 timer，让它变成了一个引用类型，这样可以确保每次 clear 的 timer 和启动的 timer 一致。
  - 改变 ref 不会触发重新渲染。
  - 🔗 https://react.dev/reference/react/useRef
    - 有关 useRef 这个 Hook 的更多信息，可查阅官方文档。
