import { useRef } from 'react'
import MyEditor from '../my-editor/my-editor'

const App = () => {
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor) => (editorRef.current = editor)
  const showValue = () => alert(editorRef.current.getValue())
  const writeValue = () =>
    editorRef.current.setValue('// new value \n// this is new line')

  return (
    <>
      <div className="editor-wrapper">
        <button onClick={showValue}>Show value</button>
        <button onClick={writeValue}>Write value</button>
        <MyEditor
          width={'50vw'}
          height={'50vh'}
          onMount={handleEditorDidMount}
          // defaultValue={`// some comment ...`}
          language="c"
        />
      </div>
    </>
  )
}

export default App
