# [0061. 在浏览器中引入 ESM 模块](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0061.%20%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E5%BC%95%E5%85%A5%20ESM%20%E6%A8%A1%E5%9D%97)


## 📒 notes

- 给 `<script>` 标签加上 `type="module"` 属性
  - 开启模块化：`<script src="./module/index.js" type="module"></script>`
  - 未开启模块化：`<script src="./module/index.js"></script>`
- 带有 `type="module"` 的脚本会自动启用严格模式，不需要显式地声明 `'use strict';`。
- 带有 `type="module"` 的脚本会异步加载，即它们不会阻塞页面的渲染。浏览器会在后台下载这些脚本，并在下载完成后执行它们。
  - 注意：脚本是延迟执行的，这意味着即使你在 HTML 中按顺序放置了多个 `<script type="module">` 标签，浏览器也不会保证它们的执行顺序。如果你需要确保某些脚本在其他脚本之前执行，可以使用 `import` 语句来明确依赖关系。

## 💻 demo - 测试

在浏览器中打开 index.html 文件，打开调试工具，切换到 Console 模块，输入 a

- 未开启模块化 - 成功打印 1 - 意味着没有开启模块化，模块内部定义的成员直接污染到了全局
- 开启模块化 - 报错 Uncaught ReferenceError: a is not defined - 意味着浏览器将 index.js 视作了一个模块来处理，模块内部的成员并没有污染全局

## 🤖 AI - 给 script 标签加上 type="module" 意味着什么？

给 `<script>` 标签加上 `type="module"` 属性意味着你将使用 ECMAScript 模块（ES Modules）来编写和加载 JavaScript 代码。这有几个重要的含义和影响：

### 1. 模块化
- **模块作用域**：默认情况下，JavaScript 代码在全局作用域中运行。但是，当 `type="module"` 时，每个 `<script type="module">` 标签内的代码都处于自己的模块作用域中，这意味着变量、函数等不会污染全局命名空间。
- **导入导出**：你可以使用 `import` 和 `export` 语句来导入和导出功能。这使得代码更加模块化和可维护。

### 2. 严格模式
- **自动启用严格模式**：所有 ES 模块代码都会自动以严格模式执行，不需要显式地声明 `'use strict';`。

### 3. 异步加载
- **异步加载**：带有 `type="module"` 的脚本会异步加载，即它们不会阻塞页面的渲染。浏览器会在后台下载这些脚本，并在下载完成后执行它们。
- **延迟执行**：即使你在 HTML 中按顺序放置了多个 `<script type="module">` 标签，浏览器也不会保证它们的执行顺序。如果你需要确保某些脚本在其他脚本之前执行，可以使用 `import` 语句来明确依赖关系。

### 4. 文件路径
- **相对路径**：当你使用 `import` 语句时，通常需要提供一个相对或绝对的文件路径。例如：
  ```javascript
  import { someFunction } from './path/to/module.js';
  ```

### 5. MIME 类型
- **MIME 类型要求**：服务器必须正确设置响应头中的 `Content-Type` 为 `application/javascript` 或 `text/javascript`。如果服务器返回的是 `text/html` 或其他非 JavaScript 的 MIME 类型，浏览器会拒绝执行该模块。

### 示例

假设你有一个简单的项目结构如下：
```
/project
  /js
    - main.js
    - utils.js
  - index.html
```

#### `utils.js`
```javascript
// utils.js
export function greet(name) {
  return `Hello, ${name}!`;
}
```

#### `main.js`
```javascript
// main.js
import { greet } from './utils.js';

console.log(greet('World'));
```

#### `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <script type="module" src="./js/main.js"></script>
</body>
</html>
```

在这个例子中，`index.html` 文件中的 `<script type="module" src="./js/main.js"></script>` 会异步加载 `main.js` 脚本。`main.js` 通过 `import` 语句从 `utils.js` 导入 `greet` 函数并使用它。

### 注意事项
- **兼容性**：虽然现代浏览器普遍支持 ES 模块，但在一些较旧的浏览器中可能不被支持。你需要确保目标用户使用的浏览器支持 ES 模块，或者使用 Babel 等工具进行转译。
- **CORS**：由于 ES 模块的加载是跨源请求，因此服务器必须正确配置 CORS（跨源资源共享）策略，以允许来自不同源的请求。

通过使用 `type="module"`，你可以充分利用现代 JavaScript 的模块化特性，使代码更加组织化和易于维护。
