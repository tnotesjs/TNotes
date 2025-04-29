import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const htmlContent = '<p>This is a <strong>bold</strong> text.</p>'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  </StrictMode>
)
