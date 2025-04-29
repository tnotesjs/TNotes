import { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'
import PropTypes from 'prop-types'
import './my-editor.css'

const DEFAULT_CODES = `// some comment
#include "xxx.h"

void user_main(){
    // gen...
}`

const MyEditor = ({ height, width, onMount, defaultValue, language }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor
    onMount && onMount(editor)
  }

  return (
    <div
      className={`my-editor ${isCollapsed ? 'collapsed' : ''}`}
      style={{ width, height }}
    >
      <button
        className="expand-button"
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        {isCollapsed ? '<' : '>'}
      </button>
      <Editor
        height={height}
        width={width}
        defaultLanguage={language || 'c'}
        defaultValue={defaultValue || DEFAULT_CODES}
        onMount={handleEditorDidMount}
        options={{
          readOnly: true,
          domReadOnly: true,
          // 让光标移动更加平滑，有一个动画过度效果。
          cursorSmoothCaretAnimation: 'on',
          minimap: {
            enabled: false, // 将侧边的代码缩略图隐藏
          },
        }}
      />
    </div>
  )
}

MyEditor.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  onMount: PropTypes.func,
  defaultValue: PropTypes.string,
  language: PropTypes.string,
}

export default MyEditor
