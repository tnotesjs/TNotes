import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
      <h1>Hello</h1>
      <p>This is a paragraph.</p>
    </>
  </StrictMode>,
)
