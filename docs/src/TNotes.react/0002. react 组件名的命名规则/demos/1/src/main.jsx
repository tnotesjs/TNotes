import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function MyButton() {
  return <button>I'm a button</button>
}

function App() {
  return (
    <>
      <h1>Welcome to my app</h1>
      <MyButton />

      {/* ❌ */}
      {/* 如果将 h1 改为 H1 会报错 Uncaught ReferenceError: H1 is not defined */}
      {/* <H1>Welcome to my app</H1> */}

      {/* ❌ */}
      {/* 组件名必须以大写字母开头，否则会报错：
      Warning: <myButton /> is using incorrect casing.
      Use PascalCase for React components, or lowercase for HTML elements. */}
      {/* <myButton /> */}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
