# [0110. script 标签](https://github.com/Tdahuyou/html-css-js/tree/main/0110.%20script%20%E6%A0%87%E7%AD%BE)

<!-- region:toc -->
- [1. 📒 type 属性](#1--type-属性)
- [2. 📒 crossorigin 属性](#2--crossorigin-属性)
<!-- endregion:toc -->

## 1. 📒 type 属性

- `<script>` 标签的 `type` 属性用于指定加载或内嵌的脚本语言的 MIME 类型。
- 在 HTML 中使用 `<script>` 标签时，这个属性可以帮助浏览器理解和处理正确的脚本类型。
  
以下是一些关于 `type` 属性的重要点和常见用法：

- **标准用法 - `text/javascript`**: 这是最常用的值，用于 JavaScript 代码。根据 HTML5 的标准，如果不指定 `type` 属性，浏览器默认处理为 `text/javascript`。因此，在大多数现代网页中，你通常会看到省略 `type` 属性的 `<script>` 标签。
- **模块 - `module`**: 随着 ES6 模块的引入，如果你想在浏览器中直接使用模块功能（如 `import` 和 `export` 语句），可以将 `type` 设置为 `module`。这样的脚本会被当作 ECMAScript 模块处理。

```html
<script type="module">
  import { functionName } from './module.js';
  functionName();
</script>
```

- **非 JavaScript 类型 - 其他 MIME 类型**: 如果 `type` 设置为非 `text/javascript` 的其他值，如 `text/plain` 或自定义类型，浏览器不会执行这些脚本，这可以用于内嵌数据或在 JavaScript 库或应用中延迟处理的脚本。
- **非 JavaScript 类型 - `text/babel`**: 这是社区中的一种约定，用于表示脚本内容是用 Babel 编写的 JSX 或 ES6+ 代码，需要在浏览器中动态编译。通常与 Babel 的浏览器版本一起使用，以允许在客户端动态编译 JSX 或最新的 JavaScript 特性。
- **历史用法**：在早期的 HTML 版本中，`type` 属性曾用来区分不同的脚本语言，如 `text/vbscript`。但随着 JavaScript 成为 Web 开发的标准，其他脚本语言的使用逐渐减少。
- **实际应用**
  - 在开发中，正确使用 `type` 属性可以控制脚本的解析和执行，特别是在使用现代 JavaScript 框架和工具（如模块化或 Babel）时。
  - 使用 `type="module"` 还可以提供一些额外好处，比如自动严格模式、更好的浏览器缓存处理和跨域脚本的支持。
    - 在 react v19 中，可以直接采用 esm 的形式来引入 react，此时就需要给 script 标签加上 `type="module"`。
  - 通过合理使用 `<script>` 标签的 `type` 属性，可以更有效地管理和部署 Web 页面上的脚本，提高页面的兼容性和性能。

## 2. 📒 crossorigin 属性

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
