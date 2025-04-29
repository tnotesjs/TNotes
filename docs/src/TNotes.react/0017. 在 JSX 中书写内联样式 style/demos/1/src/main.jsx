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
