import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    // 下面是 JSX 语法
    <div>
      <h2>title</h2>
      // <p>description</p> // [!code error]
      {/* 这是 JSX 中的注释内容 */}
    </div>
  )
}

// 在这个 .jsx 文件中的 JSX 部分，你可以使用注释快捷方式 ctrl + / 来注释代码。生成的注释格式是满足 JSX 语法要求的。

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)