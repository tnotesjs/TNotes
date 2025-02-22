# [0047. 理解 svg 的 version 属性](https://github.com/Tdahuyou/svg/tree/main/0047.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20version%20%E5%B1%9E%E6%80%A7)

<!-- region:toc -->
- [1. svg 的 version 属性](#1-svg-的-version-属性)
<!-- endregion:toc -->
- version 属性的值只有两种情况：`1.0` 和 `1.1`。
- **🗑 version 属性已经被抛弃了，你可以认为它是一个无效属性。**

## 1. svg 的 version 属性

- 🔍 查看 MDN 对 svg version 属性的描述
  - https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/version
  - Deprecated - version 属性已经被标记为弃用了。
- `version` 属性在 SVG（可缩放矢量图形）中用于指定文档遵循的 SVG 规范版本。
- 然而，随着 Web 技术的发展，特别是 HTML5 的普及，`version` 属性的重要性逐渐减弱，并且在现代浏览器中不再强制要求使用。
- 在 SVG 1.1 及更早版本中，`version` 属性是必需的，用来明确指出 SVG 文档所遵循的标准版本。例如：

```xml
<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
  <!-- SVG content -->
</svg>
```

- 从 SVG 2 开始，W3C 决定移除对 `version` 属性的要求。这是因为：
  - **向后兼容**：SVG 2 旨在与之前的 SVG 版本保持高度兼容，因此不需要通过 `version` 来区分不同版本。
  - **简化**：去除 `version` 可以简化 SVG 文档的编写和解析过程。
  - **HTML5 集成**：在 HTML5 环境中，SVG 可以直接嵌入 HTML 文档中，而无需显式声明 `version`。浏览器会自动处理并正确渲染 SVG 内容。
- **在现代 Web 开发实践中，通常不再需要为 SVG 元素添加 `version` 属性。如果你创建的是一个独立的 SVG 文件或者为了确保最大兼容性，你可能会选择保留它。但在大多数情况下，尤其是在 HTML5 文档中内联使用的 SVG，省略 `version` 是完全可以接受的，并且是推荐的做法。**
- 虽然 `version` 属性曾经是 SVG 文档的重要组成部分，但随着标准的进步和技术的发展，它已经不再是必需的了。对于新的项目，除非有特定的需求或考虑到某些老式环境的支持问题，否则你可以安全地忽略这个属性。
