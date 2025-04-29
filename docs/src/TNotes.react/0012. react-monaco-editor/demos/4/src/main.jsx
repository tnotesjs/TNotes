import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Editor from '@monaco-editor/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      options={{
        readOnly: true,

        // 1️⃣ options.readOnlyMessage.value
        // 当编辑器被设置为只读模式后，再尝试去输入内容，会在光标位置弹出提示消息：Cannot edit in read-only editor
        // 可以通过 readOnlyMessage.value 来配置提示的文案。
        // The message to display when the editor is readonly.
        // Defaults to "Cannot edit in read-only editor"
        // readOnlyMessage: {
        //   value: '无法手动编辑' // 修改只读提示框中的提示文案
        // },

        // 2️⃣ options.domReadOnly
        // 如果要隐藏只读提示框，可以将 domReadOnly 设置为 true。
        // domReadOnly: true, // 隐藏只读提示框
      }}
    />
  </StrictMode>
)
