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
