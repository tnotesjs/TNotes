import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Editor from '@monaco-editor/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
    />
  </StrictMode>
)
