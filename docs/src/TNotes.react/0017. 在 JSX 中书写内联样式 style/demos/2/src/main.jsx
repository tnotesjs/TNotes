import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
const myStyle = {
  color: 'blue',

  fontSize: '20px',
  // 注意：这里使用的是驼峰命名法，对应于 CSS 中的 font-size
  // 如果要写为 font-size，需要加上引号，否则将被视作非法的 key 值，这会导致语法错误。
  // 'font-size': '20px',
  // 这种写法虽然可以正常生效，但是会报警告 Warning: Unsupported style property font-size. Did you mean fontSize?
  // 在 React 中，驼峰命名法是官方推荐的写法。
  // 因此，在 JSX 中书写内联样式 style 时，应该使用驼峰命名法，而不是使用 CSS 的原始写法。

  backgroundColor: '#eee',
  padding: '10px',
  border: '1px solid #000',
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div style={myStyle}>Hello, World!</div>
  </StrictMode>
)
