import { StrictMode, createElement } from 'react'
import { createRoot } from 'react-dom/client'

const userInfo = {
  name: 'Tdahuyou',
  age: 25,
}

// 创建 react element 对象

// 写法 1：jsx 式写法：
// const userInfoContainer = <div>
//   <p>name: {userInfo.name}</p>
//   <p>age: {userInfo.age}</p>
// </div>

// 写法 2：createElement 式写法：
const userInfoContainer = createElement('div', null,
  createElement('p', null, `name: ${userInfo.name}`),
  createElement('p', null, `age: ${userInfo.age}`),
)

console.log(typeof userInfoContainer) // => object

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ✅ 可以渲染 react 元素对象 */}
    {userInfoContainer}
  </StrictMode>
)
