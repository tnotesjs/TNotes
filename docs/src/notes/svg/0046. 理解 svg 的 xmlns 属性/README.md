# [0046. 理解 svg 的 xmlns 属性](https://github.com/Tdahuyou/svg/tree/main/0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7)

<!-- region:toc -->
- [1. 🔗 菜鸟教程 - xml 命名空间](#1--菜鸟教程---xml-命名空间)
- [2. 💻 demos.1 - 带有命名空间 `xmlns="http://www.w3.org/2000/svg"`](#2--demos1---带有命名空间-xmlnshttpwwww3org2000svg)
- [3. 💻 demos.2 - 不带命名空间 `xmlns="http://www.w3.org/2000/svg"`](#3--demos2---不带命名空间-xmlnshttpwwww3org2000svg)
- [4. 📒 结果分析](#4--结果分析)
- [5. 💻 demos.3 - 在 html 中嵌入 svg](#5--demos3---在-html-中嵌入-svg)
- [6. 🤔 知道本节的内容有啥用呢？](#6--知道本节的内容有啥用呢)
- [7. 💻 demos.4 - 在线搬运的 .svg 需要注意 xmlns 声明是否缺失](#7--demos4---在线搬运的-svg-需要注意-xmlns-声明是否缺失)
<!-- endregion:toc -->
- 本节介绍的是 xmlns，这是一个属性，用于指定 XML 文档的命名空间。它决定了 svg 文件是否能够被正常渲染，在正式开始学习 svg 的绘图规则之前，有必要了解一下 `xmlns="http://www.w3.org/2000/svg"` 这条声明的作用。
- 本节内容：模拟一个要求 - 在 `100*100` 的视口中，渲染一个圆心位置是 `(50, 50)`，半径是 `20` 的红色圆形，然后通过 demos 来对比带命名空间和不带命名空间的区别。

## 1. 🔗 菜鸟教程 - xml 命名空间

- https://www.runoob.com/xml/xml-namespaces.html
  - 菜鸟教程 - xml 命名空间
  - 如果不清楚 xml 命名空间是什么，可以快速过一下这篇文章。

## 2. 💻 demos.1 - 带有命名空间 `xmlns="http://www.w3.org/2000/svg"`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"> <!-- [!code highlight] -->
  <circle cx="50" cy="50" r="20" fill="red" />
</svg>
```

- 使用浏览器打开后看到的效果：
  - ![](assets/2024-12-05-14-00-04.png)
  - 可以正常渲染

## 3. 💻 demos.2 - 不带命名空间 `xmlns="http://www.w3.org/2000/svg"`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<svg width="100" height="100"> <!-- [!code highlight] -->
  <circle cx="50" cy="50" r="20" fill="red" />
</svg>
```

- 使用浏览器打开后看到的效果：
  - ![](assets/2024-12-05-14-00-34.png)
  - 无法正常渲染

## 4. 📒 结果分析

- 在 SVG（可缩放矢量图形）中，`xmlns` 属性是命名空间声明的一部分。它告诉浏览器或任何其他解析器这个文档遵循哪个标准，并且如何解释这些标签。对于 SVG 来说，`xmlns="http://www.w3.org/2000/svg"` 声明了根元素 `<svg>` 及其子元素属于 SVG 命名空间。
- 当一个 XML 文件（包括 SVG 文件）没有正确声明其命名空间时，浏览器可能无法识别该文件中的标签为特定格式的一部分（例如 SVG）。因此，在 demos.2 中，如果不包含 `xmlns` 属性，浏览器可能会把 `<svg>` 和 `<circle>` 标签视为普通的未知标签，而不是作为 SVG 图形元素处理，所以不会应用样式或渲染图像。相反，它会显示一个默认的 XML 树结构视图。
- 一旦添加了 `xmlns` 属性，浏览器就能够识别这是一个 SVG 文档，并使用内置的 SVG 渲染引擎来正确地解析和显示图形元素。这就是为什么加上 `xmlns` 后可以正常渲染圆形的原因。

## 5. 💻 demos.3 - 在 html 中嵌入 svg

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div class="svg-box">
      <p>svg-1 带 xmlns</p>
      <?xml version="1.0" encoding="UTF-8"?>
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"> <!-- [!code highlight] -->
        <circle cx="50" cy="50" r="20" fill="red" />
      </svg>
    </div>
    <div class="svg-box">
      <p>svg-2 不带 xmlns</p>
      <?xml version="1.0" encoding="UTF-8"?>
      <svg width="100" height="100"> <!-- [!code highlight] -->
        <circle cx="50" cy="50" r="20" fill="red" />
      </svg>
    </div>
  </body>
</html>
```

- 使用浏览器打开后看到的效果：
  - ![](assets/2024-12-05-14-10-09.png)
  - 会发现两者都能正常渲染。
- 需要知道 `xmlns` 属性对于确保 SVG 内容被正确解释和渲染是非常重要的。**虽然在某些环境中（如 HTML5 文档内嵌入 SVG），可以省略 `xmlns` 属性，因为上下文已经明确了 SVG 的使用，但在独立的 SVG 文件中，最好总是包含这个属性以确保兼容性和正确的渲染。因此在编写 svg 的时候，在 svg 根元素身上都应该加上 `xmlns` 属性声明。**

## 6. 🤔 知道本节的内容有啥用呢？

举一个例子：

比如你现在想要获取某个站点的 logo，这个 logo 又正好是使用 svg 来做的，这时候你只需要打开浏览器的开发者工具，然后在 Elements 面板中找到这个 svg 的源码（或者在 Network 中找加载的资源），然后直接复制到你的项目中，就可以使用了。但是，也有一些情况可能会导致你搬运过来的内容无法正常渲染，比如 svg 的 xmlns 属性没有声明，这时候如果你知道 xmlns 属性的作用，就知道该如何解决该问题了。

## 7. 💻 demos.4 - 在线搬运的 .svg 需要注意 xmlns 声明是否缺失

以 vue 为例：https://cn.vuejs.org/

- ![](assets/2024-12-09-14-53-23.png)
- 假如你要自行去 vue 官网获取 vue 的 logo，只需要把这部分 svg 给复制过来即可，但是复制过来的内容是没法正常渲染的，还需要加上 xlmns 声明。
- 在 vue 官网中之所以可以正常渲染，是因为官网是一个 HTML5 文档，在对应的上下文中已经做了声明。但是在独立的 .svg 文件中是没法正常被浏览器渲染的。
- `1.svg` 是搬运过来的原始内容，用浏览器打开后看到的内容如下：
  - ![](assets/2024-12-09-15-01-53.png)
- `2.svg` 是在 1.svg 的基础上加上了 xmlns 声明，用浏览器打开后看到的内容如下：
  - ![](assets/2024-12-09-15-01-49.png)

::: code-group

```xml [1.svg 无命名空间]
<svg class="logo" viewBox="0 0 128 128" width="24" height="24" data-v-f32e683e="">
    <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" data-v-f32e683e=""></path>
    <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" data-v-f32e683e=""></path>
</svg>
```

```xml [2.svg 有命名空间]
<svg class="logo" viewBox="0 0 128 128" width="24" height="24" data-v-f32e683e=""
  xmlns="http://www.w3.org/2000/svg"> <!-- [!code highlight] -->
    <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110l64-110C128,10,78.8,10,78.8,10z" data-v-f32e683e=""></path>
    <path fill="#35495e" d="M78.8,10L64,35.4L49.2,10H25.6L64,76l38.4-66H78.8z" data-v-f32e683e=""></path>
</svg>
```

:::