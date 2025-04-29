import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// const divContainer = (
//   <Fragment>
//     <div>div 1</div>
//     <div>div 2</div>
//     <div>div 3</div>
//   </Fragment>
// )

// 语法糖 - <React.Fragment> 可以简写为 <>
const divContainer = (
  <>
    <div>div 1</div>
    <div>div 2</div>
    <div>div 3</div>
  </>
)
// <React.Fragment> 是一个比较常用的组件，JSX 对此做了一些特殊处理，如果想要使用 <React.Fragment> 的话：
// 反锁：不必每次都导入 import React from 'react'; 再使用。
// 简便：可以直接使用缩写的形式 <>...</>，这么写就相当于写了 import React from 'react'; <React.Fragment>...</React.Fragment>。

const root = createRoot(document.getElementById('root'))

root.render(<StrictMode>{divContainer}</StrictMode>)
