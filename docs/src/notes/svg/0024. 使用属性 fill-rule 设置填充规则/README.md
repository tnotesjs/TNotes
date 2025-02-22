# [0024. 使用属性 fill-rule 设置填充规则](https://github.com/Tdahuyou/svg/tree/main/0024.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill-rule%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E8%A7%84%E5%88%99)

<!-- region:toc -->
- [1. 🔗 links](#1--links)
- [2. 📒 fill-rule 简介](#2--fill-rule-简介)
- [3. 💻 demos.1 - nonzero 规则](#3--demos1---nonzero-规则)
- [4. 💻 demos.2 - evenodd 规则](#4--demos2---evenodd-规则)
- [5. 🤔 为什么需要有填充规则，它是为了解决什么场景下的问题？](#5--为什么需要有填充规则它是为了解决什么场景下的问题)
<!-- endregion:toc -->
- 这个 fill-rule 填充规则不太好理解，虽然只有两个值 nonzero、evenodd。填充规则，是一个通用的知识点，不仅仅限于 svg 中，在 canvas 中也是有这玩意儿的。
  这篇文档中的图形，是参照大佬“张鑫旭”的教程绘制的，对于最终的渲染结果，可以参考大佬的教程来对照着学习。
- 有关 nonzero 和 evenodd 填充规则的讲解说明。
  - 可参考笔记 canvas.0031。
  - 在 YouTube 上也有一些相关的视频教程讲解 nonzero 和 evenodd 填充规则。

## 1. 🔗 links

- https://www.zhangxinxu.com/wordpress/2018/10/nonzero-evenodd-fill-mode-rule/
  - 搞懂 SVG/Canvas 中 nonzero 和 evenodd 填充规则 « 张鑫旭-鑫空间-鑫生活。
  - 文中编写的 demos 是参考这篇文章中的图形来绘制的。
- https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule - Wiki - Even–odd rule
- https://en.wikipedia.org/wiki/Nonzero-rule - Wiki - Nonzero-rule
- https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/fill-rule
  - mdn - fill-rule
  - 最新版的文档中添加了一些示例来辅助说明有关 nonzero、evenodd 属性值的说明，可以结合着文档中的示例来一起学习。

## 2. 📒 fill-rule 简介

[fill-rule](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Attribute/fill-rule) 是一个 SVG 属性，用于确定在填充具有复杂路径（如自相交或重叠的路径）的图形时，哪些部分应该被视为“内部”（填充区域）以及哪些部分应该被视为“外部”（不填充区域）。fill-rule 通过一些规则，确定重叠的区域是否属于当前图形，从而使得填充有效或无效。fill-rule 一共有两个值：

- **nonzero** 这是默认值，表示非零环绕规则。
  - 它使用了所谓的非零缠绕规则。简单来说，对于任意一点，从该点出发画一条任意方向的射线，根据这条射线与路径的交点方向计数。如果线从路径的左边穿过到右边，计数加一；如果是从右边穿过到左边，计数减一。最终，如果总计数非零，该点被认为是内部的，否则是外部的。
- **evenodd** 表示奇偶环绕规则。
  - 与非零缠绕规则类似，从目标点出发画一条射线，并计算它与路径的交点次数。如果交点数是奇数，该点是内部的；如果是偶数，该点是外部的。这种方法不考虑路径的方向，只关注交点的数量。

填充规则：

1. [Even–odd rule](https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule)
2. [Nonzero rule](https://en.wikipedia.org/wiki/Nonzero-rule)

下面截图是来自 wiki 中对于 [Even–odd rule](https://en.wikipedia.org/wiki/Even%E2%80%93odd_rule) 的解释。

![](assets/2024-12-10-13-40-25.png)

当画布上出现多个闭合路径的时候，区分哪些区域是有效区域。

这两种规则在处理复杂的或自相交的图形时非常有用，因为它们帮助定义了哪些区域应该被填充。选择哪种规则取决于您希望如何显示图形。在实际应用中，这些差异通常在设计某些特别的图形效果时才显得重要。例如，使用 evenodd 规则可以更容易地创建某些类型的镂空效果。

## 3. 💻 demos.1 - nonzero 规则

```xml
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M 25 25 L 87.5 37.5 L 56.25 100 L 25 25 L 55 12.5 L 90 90 L 25 25" fill="blue" fill-rule="nonzero" stroke="red" />
</svg>
```

![](assets/2024-12-10-13-44-01.png)

## 4. 💻 demos.2 - evenodd 规则

```xml
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M 25 25 L 87.5 37.5 L 56.25 100 L 25 25 L 55 12.5 L 90 90 L 25 25" fill="blue" fill-rule="evenodd" stroke="red" />
</svg>
```

![](assets/2024-12-10-13-44-07.png)

## 5. 🤔 为什么需要有填充规则，它是为了解决什么场景下的问题？

答：路径重叠，**某些区域可能被路径包裹多次，应该如何区分哪些是有效区域**。
