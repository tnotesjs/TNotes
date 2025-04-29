import { StrictMode, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import Editor from '@monaco-editor/react'

function App() {
  const editorRef = useRef(null)

  function handleEditorDidMount(editor) {
    editorRef.current = editor
  }

  function showValue() {
    alert(editorRef.current.getValue())
  }

  function writeValue() {
    editorRef.current.setValue('// new value \n// this is new line')
  }

  return (
    <>
      <button onClick={showValue}>Show value</button>
      <button onClick={writeValue}>Write value</button>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          domReadOnly: true,
        }}
      />
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
