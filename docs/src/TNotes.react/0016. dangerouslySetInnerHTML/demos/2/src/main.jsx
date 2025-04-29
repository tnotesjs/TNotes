import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DOMPurify from 'dompurify';

// 创建一个净化函数
const purify = (dirty) => DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } }); // 使用默认的 HTML 清理配置

function MyComponent() {
  const unsafeHtmlContent = '<p>This is a <strong>bold</strong> text. <script>alert("XSS attack!");</script></p>';
  
  console.time('purify')
  const safeHtmlContent = purify(unsafeHtmlContent);
  console.timeEnd('purify')

  console.log(safeHtmlContent); // => <p>This is a <strong>bold</strong> text. </p>

  return (
    <div dangerouslySetInnerHTML={{ __html: safeHtmlContent }} />
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyComponent />
  </StrictMode>,
)
