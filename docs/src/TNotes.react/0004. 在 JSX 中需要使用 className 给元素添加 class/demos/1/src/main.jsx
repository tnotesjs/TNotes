import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'

// 引入 css
import './test.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* ✅ 正确写法 */}
      <p>
        <button className="card" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </p>

      {/* ❌ 错误写法
      虽然渲染结果是正常的，但是这并不符合规范，并且会抛出警告：
      Warning: Invalid DOM property `class`. Did you mean `className`? Error Component Stack
      */}
      <p>
        <button class="card" onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </p>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
