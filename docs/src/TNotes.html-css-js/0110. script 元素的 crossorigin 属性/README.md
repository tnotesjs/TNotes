# [0110. script 元素的 crossorigin 属性](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0110.%20script%20%E5%85%83%E7%B4%A0%E7%9A%84%20crossorigin%20%E5%B1%9E%E6%80%A7)

<!-- region:toc -->

- [1. 📒 crossorigin 属性](#1--crossorigin-属性)

<!-- endregion:toc -->

## 1. 📒 crossorigin 属性

**如果 script 标签引用的资源出现了问题，加上 crossorigin 属性可以让浏览器提供的错误报告更加详细，帮助开发者更好地调试问题。**

---

- `<script>` 标签上的 `crossorigin` 属性用于配置与跨域资源共享（CORS）相关的行为。
- 当你的网页加载第三方资源（如 JavaScript 脚本、字体或其他文件）时，这个属性控制浏览器如何处理跨域请求，特别是在涉及可能含有用户敏感数据的情况下。
- `crossorigin` 属性可以有两个值：
  - `anonymous`
    - 例：`<script src="https://example.com/script.js" crossorigin="anonymous"></script>`
      - 不带凭证的跨域请求
    - 这是最常用的值。
    - 设置此值时，浏览器在发起跨域请求时不会发送用户凭据（如 Cookies 和 HTTP 认证信息）。
    - 如果请求的资源响应没有包含正确的 CORS 头部（`Access-Control-Allow-Origin`），浏览器将不加载这些资源。
    - 即使设置了 `anonymous`，服务器也需要响应包含 `Access-Control-Allow-Origin` 头部，通常其值是 `*` 或者是请求的来源。
  - `use-credentials`
    - 例：`<script src="https://example.com/script.js" crossorigin="use-credentials"></script>`
      - 带凭证的跨域请求
    - 设置此值时，浏览器会在发起跨域请求时包含用户凭据。
    - 这要求服务器的响应不仅包含 `Access-Control-Allow-Origin` 头部，并且其值不能为 `*`（必须指定明确的域名），还必须包含 `Access-Control-Allow-Credentials: true`。
    - 这通常用于需要身份验证的场景，如加载用户特定的数据。
- 如果不设置 `crossorigin` 属性，浏览器会采取与 `anonymous` 相似的行为，但不会发送 `Origin` 头部，这可能会影响 CORS 请求的处理。
- 使用 `crossorigin` 属性的主要原因包括：
  - **安全性和隐私**：控制哪些跨域请求应该发送用户凭据。
  - **错误处理**：对于带有 `crossorigin` 属性的 `<script>` 标签，如果脚本加载失败，浏览器提供的错误报告会更加详细，帮助开发者更好地调试问题。没有这个属性，出于安全考虑，跨域脚本的具体错误详情通常不会被暴露给前端。
  - **性能优化**：某些情况下，正确配置 CORS 可以帮助利用 CDN 的缓存策略，避免不必要的数据重载。
- **实际应用**
  - 在实际应用中，`crossorigin` 属性的使用需要根据资源服务器的 CORS 策略和具体需求来配置。
  - 正确使用可以增强应用的安全性，提高资源加载的灵活性和效率。
