import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function MyFuncComp(props) {
  console.log('received props:', props)
  return <div>hello world</div>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyFuncComp a="1" b={2} c />
    {/* 
    推荐的写法
    这种写法会被 React 视作一个组件。
      【1】
      在 StrictMode 中，组件在开发模式下，会被渲染两次。
      渲染两次的目的是排查一些可能存在的错误，详情查阅官方文档对 StrictMode 的描述：https://react.dev/reference/react/StrictMode
      而普通函数调用，只会被执行一次，若内部存在啥隐患问题，也是没法通过 StrictMode 检测到的。
      
      【2】
      在 React 的调试工具（比如 React DevTools）中，能够检测到 React 组件的存在，并解析出组件树。
      而普通函数调用，是不会被 React DevTools 检测到的，这也就意味着没法使用 React DevTools 为我们提供的调试功能。

      【3】
      传递属性的时候，采用组件的方式传递属性，而非函数调用的形式来传递参数。
    */}

    {MyFuncComp({ a: '1', b: 2, c: true, d: false })}
    {/* 
    不推荐的写法
    这种写法就是将 MyFuncComp 视作一个普通的函数调用。
    通常不会有人这么写（如果你不想收到来自你同事的亲切问候）。

    如果我们想要表达：
      这玩意儿是一个组件，那么就采用大驼峰的形式来命名，并采用组件的形式来调用它。
      这玩意儿是一个普通的函数，那么就不要采用大驼峰的形式来命名，使用的时候直接采用普通函数的形式来调用它。
    */}
  </StrictMode>
)
