# [0017. 使用 g 作为容器](https://github.com/Tdahuyou/svg/tree/main/0017.%20%E4%BD%BF%E7%94%A8%20g%20%E4%BD%9C%E4%B8%BA%E5%AE%B9%E5%99%A8)

<!-- region:toc -->
- [1. 🔗 links](#1--links)
- [2. 📒 `<g>` 标签简介](#2--g-标签简介)
- [3. 💻 demos.1 - 使用 `<g>` 包裹多个元素实现多次复用](#3--demos1---使用-g-包裹多个元素实现多次复用)
<!-- endregion:toc -->
- 你可以将 `<g>` 理解为 html 中的 `<div>` 标签，没有任何实际的特殊效果，仅仅是起到一个容器的角色。
- 可以使用 `<g>` 标签，将那些需要复用的元素给一起包裹起来，实现复用多个元素组成的组件。
- `<g>` 通常用于配合 `<use>`、`<defs>` 一起使用。

## 1. 🔗 links

- https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/g
  - mdn svg g

## 2. 📒 `<g>` 标签简介

[`<g>`](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/g) 元素用作一个容器，它可以将多个图形组合在一起作为一个组处理。

这使得你可以对整个组应用变换、样式或事件，而不是单独对每个元素操作，从而提高效率和组织性。

可以将其视作 html 中的 `<div>`，起到的仅仅是一个容器的作用，没有任何特殊效果。

## 3. 💻 demos.1 - 使用 `<g>` 包裹多个元素实现多次复用

```xml
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!--
  g 元素用来组合多个图形的容器。
  g 元素本身没有任何特殊效果。
  g 元素通常用来对一组图形进行一些属性的全局设置。
  -->
  <g id="g1" fill="none" stroke-width=".5">
    <circle cx="20" cy="20" r="10" stroke="red" />
    <rect x="10" y="10" width="20" height="20" stroke="orange" />
  </g>

  <use href="#g1" x="20" y="20" />
  <use href="#g1" x="40" y="40" />
</svg>
```