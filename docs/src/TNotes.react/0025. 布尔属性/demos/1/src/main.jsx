import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'

const Panel = ({ isOpen, children }) => (
  <div style={{ display: isOpen ? 'block' : 'none' }}>{children}</div>
)

const App = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Panel</button>
      <Panel isOpen={isOpen}>
        <p>This is the content of the panel.</p>
      </Panel>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
/* 
Panel 是一个可展开/折叠的面板组件。
布尔属性 isOpen 用来控制内容的显示或隐藏。

自定义的布尔属性在命名上，通常会采用 is、has、can…… 等词汇开头，表示“是否xxx？”、“有xxx？”、“能xxx？”……。
表示一个开关状态，两者选其一。

⚠️ 注意事项：
  1. <Panel isOpen={isOpen}>...</Panel>
  2. <Panel isOpen>...</Panel>

  上述这两种写法是不一样的。
  写法 2 等价于 <Panel isOpen={true}>...</Panel>
  意味着 isOpen 属性被设置为 true。
*/