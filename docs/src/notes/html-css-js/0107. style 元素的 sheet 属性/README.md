# [0107. style 元素的 sheet 属性](https://github.com/Tdahuyou/html-css-js/tree/main/0107.%20style%20%E5%85%83%E7%B4%A0%E7%9A%84%20sheet%20%E5%B1%9E%E6%80%A7)

<!-- region:toc -->
- [1. 📒 `sheet` 属性概述](#1--sheet-属性概述)
- [2. 📒 获取 `<style>` 元素的 `sheet`](#2--获取-style-元素的-sheet)
- [3. 📒 动态添加 CSS 规则](#3--动态添加-css-规则)
- [4. 📒 移除 CSS 规则](#4--移除-css-规则)
- [5. 📒 `sheet` 对象的常见属性和方法](#5--sheet-对象的常见属性和方法)
- [6. 📒 获取所有 CSS 规则](#6--获取所有-css-规则)
- [7. 📒 禁用样式表](#7--禁用样式表)
- [8. 📒 `sheet` 适用于哪些情况？](#8--sheet-适用于哪些情况)
- [9. 📒 `sheet` 属性适用于 `<style>` 还是 `<link>`？](#9--sheet-属性适用于-style-还是-link)
<!-- endregion:toc -->

## 1. 📒 `sheet` 属性概述

- `sheet` 属性是 JavaScript 中 **`<style>` 元素** 的一个只读属性，它返回一个 **`CSSStyleSheet` 对象**，表示该 `style` 元素所包含的 **CSS 样式表**。
- `stylesheet` 是 `CSSStyleSheet` 对象，代表 `<style>` 元素内部的样式规则。
- `style.sheet` **返回 `<style>` 元素的 CSSStyleSheet 对象**。
- 可以 **动态插入、删除、修改 CSS 规则**，从而 **实时更新网页样式**。
- **兼容性良好**，适用于现代浏览器。
- 特别适合 **动态 Web 应用**，如 **Blockly、主题切换、夜间模式** 等场景！

```javascript
var stylesheet = document.querySelector('style').sheet
```

## 2. 📒 获取 `<style>` 元素的 `sheet`

```javascript
// 创建一个 <style> 元素
var style = document.createElement('style')
document.head.appendChild(style)

// 向 <style> 元素中添加 CSS 规则
style.textContent = 'body { background-color: lightblue; }'

// 访问 <style> 元素的 `sheet` 属性
console.log(style.sheet) // 返回 CSSStyleSheet 对象
```

## 3. 📒 动态添加 CSS 规则

我们可以使用 `insertRule()` 方法向 `sheet` 中添加新的 CSS 规则：

```javascript
// 创建 <style> 元素
var style = document.createElement('style')
document.head.appendChild(style)

// 获取 CSS 样式表对象
var sheet = style.sheet

// 添加 CSS 规则
sheet.insertRule('p { color: red; font-size: 20px; }', 0)
```

- 这里 `insertRule()` **在索引 0 处插入 CSS 规则**。
- 结果：页面上的所有 `<p>` 标签的 **颜色变红，字体大小变为 20px**。

## 4. 📒 移除 CSS 规则

如果需要移除样式，可以使用 `deleteRule()`：

```javascript
// 移除第一个 CSS 规则
sheet.deleteRule(0)
```

- `deleteRule(index)` **删除指定索引的 CSS 规则**。

## 5. 📒 `sheet` 对象的常见属性和方法

`style.sheet` 返回一个 `CSSStyleSheet` 对象，该对象包含以下属性和方法：

| **属性/方法**              | **作用**                                                 |
| -------------------------- | -------------------------------------------------------- |
| `.cssRules`                | 获取所有 CSS 规则（返回 `CSSRuleList`）                  |
| `.insertRule(rule, index)` | 在指定位置插入 CSS 规则                                  |
| `.deleteRule(index)`       | 删除指定位置的 CSS 规则                                  |
| `.ownerNode`               | 返回该 `CSSStyleSheet` 关联的 `<style>` 或 `<link>` 元素 |
| `.disabled`                | 设为 `true` 时禁用该样式表                               |

## 6. 📒 获取所有 CSS 规则

```javascript
var sheet = document.styleSheets[0] // 获取第一个样式表
console.log(sheet.cssRules) // 返回所有 CSS 规则
```

- `document.styleSheets` 是 **所有 `<style>` 和 `<link>` 样式表的集合**。

## 7. 📒 禁用样式表

```javascript
sheet.disabled = true // 禁用 CSS
```

- `disabled = true` 可以 **临时关闭该样式表**，恢复时设为 `false`。

## 8. 📒 `sheet` 适用于哪些情况？

- **动态修改 CSS 样式**
- **创建全局样式**
- **控制多个 CSS 规则**
- **禁用/启用某个样式表**

## 9. 📒 `sheet` 属性适用于 `<style>` 还是 `<link>`？

- `sheet` 适用于 **`<style>` 和 `<link>` 元素**。
- `document.styleSheets` 可以获取 **所有样式表**：
  ```javascript
  console.log(document.styleSheets) // 获取所有 CSSStyleSheet
  ```