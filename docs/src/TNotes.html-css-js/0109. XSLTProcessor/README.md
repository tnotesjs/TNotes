# [0109. XSLTProcessor](https://github.com/Tdahuyou/TNotes.html-css-js/tree/main/notes/0109.%20XSLTProcessor)

<!-- region:toc -->

- [1. 什么是 XSLTProcessor？](#1-什么是-xsltprocessor)
- [2. `XSLTProcessor` 的工作流程](#2-xsltprocessor-的工作流程)
- [3. `XSLTProcessor` 代码示例](#3-xsltprocessor-代码示例)
  - [3.1. 示例：将 XML 转换为 HTML](#31-示例将-xml-转换为-html)
  - [3.2. JavaScript 代码](#32-javascript-代码)
  - [3.3. 转换后 HTML 结果](#33-转换后-html-结果)
- [4. `XSLTProcessor` 主要方法](#4-xsltprocessor-主要方法)
  - [4.1. 示例：使用 transformToFragment](#41-示例使用-transformtofragment)
- [5. `XSLTProcessor` 在 Blockly 代码中的作用](#5-xsltprocessor-在-blockly-代码中的作用)
  - [5.1. `XSLTProcessor` 的优缺点](#51-xsltprocessor-的优缺点)
- [6. ✅ 优点](#6--优点)
- [7. ❌ 缺点](#7--缺点)
  - [7.1. 现代替代方案](#71-现代替代方案)

<!-- endregion:toc -->

## 1. 什么是 XSLTProcessor？

- `XSLTProcessor` 是 **XML 转换语言（XSLT，Extensible Stylesheet Language Transformations）** 的 JavaScript 实现，它用于在浏览器中将 **XML** 数据转换为 **HTML 或其他 XML 格式**。
- XSLT 是一种基于规则的转换语言，它允许使用 **XSL 样式表** 来定义如何转换 XML 结构。例如，可以使用 XSLT **提取**、**重新排列** 或 **格式化** XML 数据，并最终呈现为 HTML 页面或新的 XML 结构。
- `XSLTProcessor` 是 **浏览器内置的 API**，可以在 JavaScript 中使用它来执行 XML 转换。
- `XSLTProcessor` 是一个 **XML 转换工具**，用于将 **XML 转换为 HTML** 或其他 XML 结构。
- `Blockly` 使用 `XSLTProcessor` 解析 **工具箱 XML**，但 **IE 9+ 不支持**，因此需要兼容处理。
- 在现代 JavaScript 中，通常使用 **DOMParser** 或 **前端框架（React/Vue）** 代替 `XSLTProcessor` 进行 XML 解析和渲染。

虽然 `XSLTProcessor` **在某些场景仍然有效**，但由于其 **跨浏览器兼容性问题**，它已经逐渐被 **现代 JavaScript 解析技术** 所取代。
XSLTProcessor 介绍


## 2. `XSLTProcessor` 的工作流程

`XSLTProcessor` 主要通过以下步骤进行 XML 转换：

1. **加载 XSLT 样式表**（定义 XML 如何转换）
2. **解析 XML 数据**
3. **应用 XSLT 规则进行转换**
4. **输出转换后的 HTML 或 XML**

## 3. `XSLTProcessor` 代码示例

### 3.1. 示例：将 XML 转换为 HTML

```xml
<!-- XML 数据（data.xml） -->
<books>
    <book>
        <title>JavaScript 权威指南</title>
        <author>David Flanagan</author>
    </book>
    <book>
        <title>你不知道的 JavaScript</title>
        <author>Kyle Simpson</author>
    </book>
</books>
```

```xml
<!-- XSLT 样式表（style.xsl） -->
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="/">
        <html>
        <body>
            <h2>书籍列表</h2>
            <ul>
                <xsl:for-each select="books/book">
                    <li>
                        <strong><xsl:value-of select="title"/></strong>
                        - <xsl:value-of select="author"/>
                    </li>
                </xsl:for-each>
            </ul>
        </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
```

### 3.2. JavaScript 代码

```javascript
// 加载 XML 和 XSLT 文件
function loadXML(url) {
  return fetch(url)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
}

async function transformXML() {
  const xml = await loadXML('data.xml') // 加载 XML 数据
  const xsl = await loadXML('style.xsl') // 加载 XSLT 样式表

  // 创建 XSLT 处理器
  var xsltProcessor = new XSLTProcessor()
  xsltProcessor.importStylesheet(xsl) // 导入 XSL 样式表

  // 进行 XML 转换
  var resultDocument = xsltProcessor.transformToDocument(xml)

  // 将转换结果插入 HTML 页面
  document.body.appendChild(resultDocument.documentElement)
}

transformXML()
```

### 3.3. 转换后 HTML 结果

```html
<html>
  <body>
    <h2>书籍列表</h2>
    <ul>
      <li><strong>JavaScript 权威指南</strong> - David Flanagan</li>
      <li><strong>你不知道的 JavaScript</strong> - Kyle Simpson</li>
    </ul>
  </body>
</html>
```

---

## 4. `XSLTProcessor` 主要方法

| 方法                                    | 作用                                            |
| --------------------------------------- | ----------------------------------------------- |
| `importStylesheet(xslDoc)`              | 导入 XSLT 样式表（XSL 文档对象）                |
| `transformToFragment(xmlDoc, document)` | 将 XML 转换为 **HTML 片段（DocumentFragment）** |
| `transformToDocument(xmlDoc)`           | 将 XML 转换为 **完整的 HTML 文档（Document）**  |

### 4.1. 示例：使用 transformToFragment

```javascript
var fragment = xsltProcessor.transformToFragment(xml, document)
document.body.appendChild(fragment)
```

此方法返回一个 **HTML 片段**（`DocumentFragment`），可以直接插入 `DOM`。

---

## 5. `XSLTProcessor` 在 Blockly 代码中的作用

在 `Blockly` 代码中，`XSLTProcessor` 主要用于解析 **XML 工具箱（Toolbox）**，并将其转换为 **HTML DOM 结构**。但由于 **IE 9+ 不支持 XSLTProcessor**，所以 `Blockly` 代码中会做兼容性处理：

```javascript
if (typeof XSLTProcessor == 'undefined' && tree.outerHTML) {
  tree = tree.outerHTML
}
```

即：

- **如果浏览器支持 `XSLTProcessor`**，Blockly 可以正常解析 XML 工具箱。
- **如果浏览器不支持 `XSLTProcessor`（如 IE 9+）**，则 Blockly 直接使用 `outerHTML` 作为 XML 字符串，并手动解析。

---

### 5.1. `XSLTProcessor` 的优缺点

## 6. ✅ 优点

- **支持结构化转换**：适用于 XML 到 HTML 的结构化转换。
- **浏览器原生支持**（但不包括 IE9+）。
- **适用于数据模板**：可以用 XSLT 模板渲染 XML 数据，而不依赖 JavaScript。

## 7. ❌ 缺点

- **不支持所有浏览器**（IE 9+ 不支持 `XSLTProcessor`）。
- **性能较低**（相比 JavaScript 操作 DOM）。
- **学习曲线较陡**，XSLT 语法较复杂，不如 JavaScript 直观。

---

### 7.1. 现代替代方案

由于 `XSLTProcessor` 在 **现代 JavaScript 开发中使用较少**，以下是更常见的替代方案：
| 方法 | 说明 |
|------|------|
| **DOMParser** | 使用 `DOMParser().parseFromString(xmlString, "text/xml")` 解析 XML |
| **JavaScript 操作 DOM** | 使用 `document.createElement()` 直接构造 HTML 结构 |
| **JavaScript 模板** | 使用 `Handlebars.js`、`Mustache.js` 进行 XML/HTML 渲染 |
| **React/Vue** | 使用 React/Vue 解析 XML 并渲染组件 |

示例：使用 `DOMParser` 手动解析 XML：

```javascript
var xmlString = '<books><book><title>JS Guide</title></book></books>'
var parser = new DOMParser()
var xmlDoc = parser.parseFromString(xmlString, 'text/xml')

var title = xmlDoc.getElementsByTagName('title')[0].textContent
console.log(title) // 输出: JS Guide
```
