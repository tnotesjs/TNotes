# [0108. DOMParser](https://github.com/Tdahuyou/html-css-js/tree/main/0108.%20DOMParser)

<!-- region:toc -->
- [1. 📒 DOMParser 概述](#1--domparser-概述)
- [2. 📒 解析 XML 字符串](#2--解析-xml-字符串)
- [3. 📒 代码解析](#3--代码解析)
- [4. 📒 解析 HTML](#4--解析-html)
- [5. 📒 处理 XML 解析错误](#5--处理-xml-解析错误)
- [6. 📒 `DOMParser` 在 Blockly 代码中的应用](#6--domparser-在-blockly-代码中的应用)
- [7. 📒 `DOMParser` vs. `document.createElement`](#7--domparser-vs-documentcreateelement)
- [8. 📒 `DOMParser` vs. `XSLTProcessor`](#8--domparser-vs-xsltprocessor)
<!-- endregion:toc -->

## 1. 📒 DOMParser 概述

- 什么是 DOMParser？
  - `DOMParser` 是 **JavaScript 原生 API**，用于 **将 XML 或 HTML 字符串解析为 DOM 文档对象**。它是 **浏览器内置** 的解析器，支持将 XML/HTML 文本转换成 **DOM 结构**，从而使 JavaScript 可以直接操作这些数据。
- `DOMParser` 适用于：
  - 解析 **XML/HTML 字符串** 并将其转换为 **DOM 文档**。
  - 读取 **远程 XML 数据** 并提取信息（如 Ajax 返回的 XML）。
  - **替代 `XSLTProcessor`**，用于现代 JavaScript 解析 XML。

| **特点**     | **DOMParser**                                                             |
| ------------ | ------------------------------------------------------------------------- |
| **作用**     | 将 **XML/HTML 字符串** 解析为 **DOM**                                     |
| **适用场景** | 解析 **Ajax XML 响应**、读取 **XML 配置**、转换 **HTML 片段**             |
| **兼容性**   | **所有现代浏览器**（包括 IE 9+）                                          |
| **替代方案** | `document.createElement()`（创建 HTML 元素）、`XSLTProcessor`（XML 转换） |
| **常见用途** | 解析 Blockly 工具箱、解析服务器返回的 XML 数据                            |

在 **现代 JavaScript 开发** 中，`DOMParser` 是解析 XML/HTML 的 **首选方法**，它比 `XSLTProcessor` 更易用、更高效，且 **兼容性更好**！

## 2. 📒 解析 XML 字符串

```javascript
var xmlString = `
    <books>
        <book>
            <title>JavaScript 高级程序设计</title>
            <author>Nicholas C. Zakas</author>
        </book>
        <book>
            <title>你不知道的 JavaScript</title>
            <author>Kyle Simpson</author>
        </book>
    </books>`

// 创建 DOMParser 实例
var parser = new DOMParser()

// 解析 XML 字符串
var xmlDoc = parser.parseFromString(xmlString, 'text/xml')

// 访问 XML 数据
var titles = xmlDoc.getElementsByTagName('title')
for (var i = 0; i < titles.length; i++) {
  console.log(titles[i].textContent)
}
// 输出:
// JavaScript 高级程序设计
// 你不知道的 JavaScript
```

## 3. 📒 代码解析

1. `new DOMParser()`：创建一个 **DOM 解析器** 实例。
2. `parseFromString(xmlString, "text/xml")`：
   - 解析 **XML 字符串** 并返回 **XML 文档对象**。
3. `xmlDoc.getElementsByTagName("title")`：
   - 获取 `<title>` 标签的集合，并遍历内容。

## 4. 📒 解析 HTML

除了 XML，`DOMParser` 还可以解析 HTML：

```javascript
var htmlString = `<div><p>Hello, <span>world!</span></p></div>`

// 创建解析器
var parser = new DOMParser()

// 解析 HTML 字符串
var htmlDoc = parser.parseFromString(htmlString, 'text/html')

// 访问 HTML 元素
console.log(htmlDoc.body.innerHTML)
// 输出: <div><p>Hello, <span>world!</span></p></div>
```

- 区别
  - 解析 **XML** 时，`parseFromString` 需要 `"text/xml"`。
  - 解析 **HTML** 时，`parseFromString` 需要 `"text/html"`。
  - **HTML 解析允许容错**，但 **XML 解析遇到错误会报错**。

## 5. 📒 处理 XML 解析错误

如果 XML 格式错误，`DOMParser` 仍然会返回 **一个 XML 文档**，但其中包含 `<parsererror>` 元素。

```javascript
var invalidXml = `<book><title>错误的 XML</title>` // 缺少关闭标签

var parser = new DOMParser()
var xmlDoc = parser.parseFromString(invalidXml, 'text/xml')

// 检查解析错误
var errorNode = xmlDoc.getElementsByTagName('parsererror')
if (errorNode.length > 0) {
  console.error('XML 解析错误:', errorNode[0].textContent)
} else {
  console.log('XML 解析成功')
}
```

**输出：**

```
XML 解析错误: XML parse error: unclosed token at line 1
```

在 XML 解析失败时，可以通过 **`parsererror`** 进行错误检测。

## 6. 📒 `DOMParser` 在 Blockly 代码中的应用

在 Blockly 中，`DOMParser` 主要用于 **解析 XML 工具箱**：

```javascript
Blockly.Options.parseToolboxTree = function (tree) {
  if (typeof tree == 'string') {
    tree = Blockly.Xml.textToDom(tree)
  }
  return tree
}
```

在 `Blockly.Xml.textToDom()` 方法内部，它使用 `DOMParser` 将 XML 字符串转换为 **DOM 树**，然后用于构建 Blockly 的可视化代码块。

## 7. 📒 `DOMParser` vs. `document.createElement`

| 方法                            | 作用                                       | 适用场景                      |
| ------------------------------- | ------------------------------------------ | ----------------------------- |
| **DOMParser.parseFromString()** | 将 **XML/HTML 字符串** 转换为 **DOM 结构** | 适用于从服务器返回的 XML/HTML |
| **document.createElement()**    | **手动创建** HTML 元素                     | 适用于动态生成 HTML 结构      |

```javascript
// 使用 DOMParser 解析 XML
var parser = new DOMParser()
var xmlDoc = parser.parseFromString(
  '<root><item>Hello</item></root>',
  'text/xml'
)
console.log(xmlDoc.getElementsByTagName('item')[0].textContent) // 输出: Hello

// 使用 document.createElement 生成 HTML
var div = document.createElement('div')
div.textContent = 'Hello'
document.body.appendChild(div)
```

**区别：**

- `DOMParser` **适用于解析外部 XML/HTML**。
- `document.createElement` **适用于手动创建 HTML 结构**。

---

## 8. 📒 `DOMParser` vs. `XSLTProcessor`

| API               | 作用                            | 适用场景                      | 兼容性                           |
| ----------------- | ------------------------------- | ----------------------------- | -------------------------------- |
| **DOMParser**     | 解析 **XML/HTML 字符串** 为 DOM | **现代浏览器**，解析 XML/HTML | **所有主流浏览器**（包括 IE 9+） |
| **XSLTProcessor** | 使用 **XSLT** 进行 **XML 转换** | 需要 **转换 XML 数据** 的场景 | **不支持 IE 9+**                 |

在现代 JavaScript 中，**推荐使用 `DOMParser`**，因为：

- `XSLTProcessor` **不兼容 IE 9+**，而 `DOMParser` 兼容所有现代浏览器。
- `DOMParser` 更 **轻量级**，且更易与 JavaScript 交互。
