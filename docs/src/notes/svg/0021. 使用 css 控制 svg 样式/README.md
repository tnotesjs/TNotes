# [0021. 使用 css 控制 svg 样式](https://github.com/Tdahuyou/svg/tree/main/0021.%20%E4%BD%BF%E7%94%A8%20css%20%E6%8E%A7%E5%88%B6%20svg%20%E6%A0%B7%E5%BC%8F)

<!-- region:toc -->
- [1. 📒 使用 CSS 控制 SVG 样式的注意事项](#1--使用-css-控制-svg-样式的注意事项)
- [2. 💻 demos.1 - 在 svg 中嵌入 style](#2--demos1---在-svg-中嵌入-style)
- [3. 💻 demos.2 - 在 svg 上应用 css 中的动画过渡效果 - 1](#3--demos2---在-svg-上应用-css-中的动画过渡效果---1)
- [4. 💻 demos.3 - 在 svg 上应用 css 中的动画过渡效果 - 2](#4--demos3---在-svg-上应用-css-中的动画过渡效果---2)
<!-- endregion:toc -->
- 不是很重要，快速过～

## 1. 📒 使用 CSS 控制 SVG 样式的注意事项

可以使用 css 来控制 svg 元素的样式。但是，**对于 svg 元素自身的属性，最好还是写在对应的元素身上，不要通过 css 选择器的写法来加属性**。通过 css 来写，会存在的问题：

1. 有些 svg 属性写在 css 中无效。
2. 在 css 中书写 svg 属性，可能会会丢失掉 ide 提供的智能提示。

可以暂且认为“通过 css 来书写 svg 属性”这个知识点无需掌握，但需要知道 css 可以用来设置 svg 的部分样式。

- 如果看到有人这么写，能够理解即可。
- 如果你的业务要求你必须要将 svg 的属性分离出来写到 css 中，那么可以是先写一些 demos，验证一下哪些属性会存在问题，再针对性地去想想解决方案。

## 2. 💻 demos.1 - 在 svg 中嵌入 style

```xml
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!--
  .svg 也是使用 xml 语法，就跟 html 一样。
  所以在 .svg 文件中，也可以使用 style 标签来设置样式的。

  需要注意的是，并非所有属性都可以写到 style 中。
  比如 <path> 的 d 属性就不能写到 style 中。
  -->
  <style>
    #c1 {
      cx: 50;
      cy: 50;
      r: 30;
      fill: red;
      stroke: blue;
      fill-opacity: 0.2;
      stroke-width: 1;
      stroke-dasharray: 4 2;
    }
  </style>
  <circle id="c1" />
</svg>
```

![](https://cdn.nlark.com/yuque/0/2024/png/2331396/1714193362844-c5f5478c-124e-4dae-93a5-dc15c83777aa.png)

## 3. 💻 demos.2 - 在 svg 上应用 css 中的动画过渡效果 - 1

```xml
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    #c2 {
      fill: red;
      stroke: green;
      opacity: .3;
      stroke-width: 2;
      r: 30;
      transition: all 1s;
    }

    #c2:hover {
      fill: orange;
      stroke: red;
      opacity: 1;
      r: 40;
    }
  </style>
  <!--
  绝大多数的 css 效果，都可以作用在 svg 上面。
  比如：动画、渐变

  关于背景和边框：
  要使用 SVG 提供的属性 fill 和 stroke
  background和 border 无效

  伪类：
  after 和 before 伪类样式也是不支持的。
  -->
  <circle id="c2" cx="50" cy="50" />
</svg>
```

- 最终效果：
  <!-- - ![](./assets/svg.0050.demos.2.gif) -->
- 初始状态：
  - ![](https://cdn.nlark.com/yuque/0/2024/png/2331396/1714193356502-7603177d-eb39-4048-8e7b-c29a56320c7d.png)
- 把鼠标放到这个圆形上之后，过一段时间会变成下图这样的效果。
  - ![](https://cdn.nlark.com/yuque/0/2024/png/2331396/1714193368892-e583101b-d4a5-498a-8498-aa20c26ca7dc.png)

## 4. 💻 demos.3 - 在 svg 上应用 css 中的动画过渡效果 - 2

```xml
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <style>
    #l1 {
      stroke: blue;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-dasharray: 60;
      stroke-dashoffset: 50;
      transition: 1s;
    }

    #l1:hover {
      stroke-dashoffset: 0;
      stroke: red;
    }
  </style>
  <line id="l1" x1="20" y1="20" x2="80" y2="20" />
</svg>
```

- ![](assets/1.gif)
- 除了上面提到的这两种简单的 css 效果之外，还有很多 css 动画效果都可以直接作用到 svg 元素上。
- 实际上不仅仅可以通过 css 来给 svg 添加动画效果，svg 自身也是有 `<animate>` 的。
