# svg

- 如果你学习过 html、css，那么 svg 的很多笔记只需要搂一眼就行了。快速把笔记内容给过一遍，对 svg 中的一些元素有个初步的认识，知道不同元素之间分别可以用来绘制什么图形，当在项目中需要手写 svg 的时候，然后在线搜即可。



<!-- ## 1. svg 在线免费教程 -->

## 1. svg 起步

- [x] [0043. 理解 svg 是什么](https://tdahuyou.github.io/notes/notes/svg/0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html) <!-- [locale](./0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html) -->  
  
  - [1. 📒 SVG 是什么](https://tdahuyou.github.io/notes/notes/svg/0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html#1--svg-是什么)
    - [1.1. Scalable Vector Graphics](https://tdahuyou.github.io/notes/notes/svg/0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html#11-scalable-vector-graphics)
  - [2. 📒 SVG 的一些特点](https://tdahuyou.github.io/notes/notes/svg/0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html#2--svg-的一些特点)
    - [2.1. 易于编辑](https://tdahuyou.github.io/notes/notes/svg/0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html#21-易于编辑)
    - [2.2. 矢量图](https://tdahuyou.github.io/notes/notes/svg/0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html#22-矢量图)
    - [2.3. 和传统的前端技术可以很好地结合](https://tdahuyou.github.io/notes/notes/svg/0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html#23-和传统的前端技术可以很好地结合)
    - [2.4. 滤镜功能](https://tdahuyou.github.io/notes/notes/svg/0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html#24-滤镜功能)
    - [2.5. 兼容性 nice](https://tdahuyou.github.io/notes/notes/svg/0043.%20%E7%90%86%E8%A7%A3%20svg%20%E6%98%AF%E4%BB%80%E4%B9%88/README.html#25-兼容性-nice)
  - 知识点
    - 需要知道 SVG 是什么。
    - 需要知道 SVG 都有哪些特点，适合用来做些什么东西。
    - Scalable Vector Graphics 这是 SVG 的全称，需要理解每个词所表示的含义，别学完了 SVG 之后还不知道 SVG 的全称是什么。
  - 重复：
    - 文中有很多描述其实是重复的，虽然换了种说法，但是实际上描述的都是同样的内容。不过多次重复提到的内容，也恰恰是比较重要的点。
    - 在记录笔记的时候参考较多资料，对于一些比较关注的点，直接将文章内容 c、v 到笔记中，至于重复的部分未做处理。
  

- [x] [0044. 对比 svg 和 canvas](https://tdahuyou.github.io/notes/notes/svg/0044.%20%E5%AF%B9%E6%AF%94%20svg%20%E5%92%8C%20canvas/README.html) <!-- [locale](./0044.%20%E5%AF%B9%E6%AF%94%20svg%20%E5%92%8C%20canvas/README.html) -->  
  - [1. 📒 对比 svg 和 canvas](https://tdahuyou.github.io/notes/notes/svg/0044.%20%E5%AF%B9%E6%AF%94%20svg%20%E5%92%8C%20canvas/README.html#1--对比-svg-和-canvas)
  - [2. 📒 svg、canvas 的应用场景](https://tdahuyou.github.io/notes/notes/svg/0044.%20%E5%AF%B9%E6%AF%94%20svg%20%E5%92%8C%20canvas/README.html#2--svgcanvas-的应用场景)
  - 文档中提供了一张表格，记录了这俩玩意儿之间的一些差异。可以等学完了 svg、canvas 的内容之后再来回看这篇文档中提到的内容。
  - 如何选择 svg、canvas？
    - **如果你需要高质量的图形，如图标和矢量图，且希望它们具有良好的缩放性和可访问性，那么 SVG 可能是更好的选择。**
    - **如果你的项目涉及到复杂的动画、游戏或需要大量动态图形处理，Canvas 将可能提供更好的性能和灵活性。**
  

- [x] [0045. 区分 Image 和 Graphic](https://tdahuyou.github.io/notes/notes/svg/0045.%20%E5%8C%BA%E5%88%86%20Image%20%E5%92%8C%20Graphic/README.html) <!-- [locale](./0045.%20%E5%8C%BA%E5%88%86%20Image%20%E5%92%8C%20Graphic/README.html) -->  
  - [1. 📒 Image vs. Graphic](https://tdahuyou.github.io/notes/notes/svg/0045.%20%E5%8C%BA%E5%88%86%20Image%20%E5%92%8C%20Graphic/README.html#1--image-vs-graphic)
  - 图像（Image）通常指的是 **像素数据的集合**，这些数据以栅格或点阵的形式存储。
  - 图形（Graphic）更多指的是 **通过数学表达式定义的图形**，例如 SVG 中的形状（圆形、矩形、路径等）。
  - 备注：自己能够理解 Image vs. Graphic 之间的区别即可，没必要死扣图形、图像两者的区别。从中文表述层面来看，它们大多时候都是被混用的，图、图形、图像，在书面表达中我们通常会将其视作同样的东西。比如：“A：请使用 canvas 绘制一个图形，要求颜色是……”，“B：不对，canvas 画的是图像（巴拉巴拉）” —— 没必要。
  

- [x] [0046. 理解 svg 的 xmlns 属性](https://tdahuyou.github.io/notes/notes/svg/0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7/README.html) <!-- [locale](./0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7/README.html) -->  
  - [1. 🔗 菜鸟教程 - xml 命名空间](https://tdahuyou.github.io/notes/notes/svg/0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7/README.html#1--菜鸟教程---xml-命名空间)
  - [2. 💻 demos.1 - 带有命名空间 `xmlns="http://www.w3.org/2000/svg"`](https://tdahuyou.github.io/notes/notes/svg/0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7/README.html#2--demos1---带有命名空间-xmlnshttpwwww3org2000svg)
  - [3. 💻 demos.2 - 不带命名空间 `xmlns="http://www.w3.org/2000/svg"`](https://tdahuyou.github.io/notes/notes/svg/0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7/README.html#3--demos2---不带命名空间-xmlnshttpwwww3org2000svg)
  - [4. 📒 结果分析](https://tdahuyou.github.io/notes/notes/svg/0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7/README.html#4--结果分析)
  - [5. 💻 demos.3 - 在 html 中嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7/README.html#5--demos3---在-html-中嵌入-svg)
  - [6. 🤔 知道本节的内容有啥用呢？](https://tdahuyou.github.io/notes/notes/svg/0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7/README.html#6--知道本节的内容有啥用呢)
  - [7. 💻 demos.4 - 在线搬运的 .svg 需要注意 xmlns 声明是否缺失](https://tdahuyou.github.io/notes/notes/svg/0046.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20xmlns%20%E5%B1%9E%E6%80%A7/README.html#7--demos4---在线搬运的-svg-需要注意-xmlns-声明是否缺失)
  - 本节介绍的是 xmlns，这是一个属性，用于指定 XML 文档的命名空间。它决定了 svg 文件是否能够被正常渲染，在正式开始学习 svg 的绘图规则之前，有必要了解一下 `xmlns="http://www.w3.org/2000/svg"` 这条声明的作用。
  - 本节内容：模拟一个要求 - 在 `100*100` 的视口中，渲染一个圆心位置是 `(50, 50)`，半径是 `20` 的红色圆形，然后通过 demos 来对比带命名空间和不带命名空间的区别。
  

- [x] [0047. 理解 svg 的 version 属性](https://tdahuyou.github.io/notes/notes/svg/0047.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20version%20%E5%B1%9E%E6%80%A7/README.html) <!-- [locale](./0047.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20version%20%E5%B1%9E%E6%80%A7/README.html) -->  
  - [1. svg 的 version 属性](https://tdahuyou.github.io/notes/notes/svg/0047.%20%E7%90%86%E8%A7%A3%20svg%20%E7%9A%84%20version%20%E5%B1%9E%E6%80%A7/README.html#1-svg-的-version-属性)
  - version 属性的值只有两种情况：`1.0` 和 `1.1`。
  - **🗑 version 属性已经被抛弃了，你可以认为它是一个无效属性。**
  

- [x] [0009. vscode svg 相关插件](https://tdahuyou.github.io/notes/notes/svg/0009.%20vscode%20svg%20%E7%9B%B8%E5%85%B3%E6%8F%92%E4%BB%B6/README.html) <!-- [locale](./0009.%20vscode%20svg%20%E7%9B%B8%E5%85%B3%E6%8F%92%E4%BB%B6/README.html) -->  
  - [1. 📒 SVG 插件简介](https://tdahuyou.github.io/notes/notes/svg/0009.%20vscode%20svg%20%E7%9B%B8%E5%85%B3%E6%8F%92%E4%BB%B6/README.html#1--svg-插件简介)
  - [2. 📒 SVG Preview 插件简介](https://tdahuyou.github.io/notes/notes/svg/0009.%20vscode%20svg%20%E7%9B%B8%E5%85%B3%E6%8F%92%E4%BB%B6/README.html#2--svg-preview-插件简介)
  - [3. 📒 SVG Snippets 插件简介](https://tdahuyou.github.io/notes/notes/svg/0009.%20vscode%20svg%20%E7%9B%B8%E5%85%B3%E6%8F%92%E4%BB%B6/README.html#3--svg-snippets-插件简介)
  - 记录在 vscode 上推荐安装的一些 svg 相关插件，这些插件的作用是让你在 vscode 中编写 svg 程序有更好的书写体验，安装和使用也非常简单，如果你发现某个插件不好使，完全可以直接删了，或者禁用它。
  - 有关插件的详细描述说明，可自行查阅插件对应的官方文档，文中仅仅是对插件功能的简单描述。
  

- [x] [0001. 在 html 中嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html) <!-- [locale](./0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html) -->  
  - [1. 💻 demos.1 - 准备测试用的 svg 图形](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#1--demos1---准备测试用的-svg-图形)
  - [2. 💻 demos.2 - 通过 img 标签来嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#2--demos2---通过-img-标签来嵌入-svg)
  - [3. 💻 demos.3 - 通过直接嵌入源码的方式来嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#3--demos3---通过直接嵌入源码的方式来嵌入-svg)
  - [4. 💻 demos.4 - 通过 iframe 来嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#4--demos4---通过-iframe-来嵌入-svg)
  - [5. 💻 demos.5 - 通过 object 标签来嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#5--demos5---通过-object-标签来嵌入-svg)
  - 本文介绍了在 html 文件中引入 svg 资源的实现方式，可以通过下面这 4 种方式来在 html 中嵌入 svg：
    1. 通过 img 标签来嵌入 svg
    2. 通过直接嵌入源码的方式来嵌入 svg
    3. 通过 iframe 来嵌入 svg
    4. 通过 object 来嵌入 svg
  - 如果你写好了一个 svg 文件，想要知道如何将其引入到前端页面上，可以参考下文中提到的一些做法。
  

- [x] [0002. 在 .html 和 .svg 文件中，根元素 svg 的数量](https://tdahuyou.github.io/notes/notes/svg/0002.%20%E5%9C%A8%20.html%20%E5%92%8C%20.svg%20%E6%96%87%E4%BB%B6%E4%B8%AD%EF%BC%8C%E6%A0%B9%E5%85%83%E7%B4%A0%20svg%20%E7%9A%84%E6%95%B0%E9%87%8F/README.html) <!-- [locale](./0002.%20%E5%9C%A8%20.html%20%E5%92%8C%20.svg%20%E6%96%87%E4%BB%B6%E4%B8%AD%EF%BC%8C%E6%A0%B9%E5%85%83%E7%B4%A0%20svg%20%E7%9A%84%E6%95%B0%E9%87%8F/README.html) -->  
  - [1. 💻 demos.1 - 在 .html 文件中书写多个 svg](https://tdahuyou.github.io/notes/notes/svg/0002.%20%E5%9C%A8%20.html%20%E5%92%8C%20.svg%20%E6%96%87%E4%BB%B6%E4%B8%AD%EF%BC%8C%E6%A0%B9%E5%85%83%E7%B4%A0%20svg%20%E7%9A%84%E6%95%B0%E9%87%8F/README.html#1--demos1---在-html-文件中书写多个-svg)
  - [2. 💻 demos.2 - 在 .svg 文件中只能书写单个 svg](https://tdahuyou.github.io/notes/notes/svg/0002.%20%E5%9C%A8%20.html%20%E5%92%8C%20.svg%20%E6%96%87%E4%BB%B6%E4%B8%AD%EF%BC%8C%E6%A0%B9%E5%85%83%E7%B4%A0%20svg%20%E7%9A%84%E6%95%B0%E9%87%8F/README.html#2--demos2---在-svg-文件中只能书写单个-svg)
  - 根元素的数量得看你在什么位置写，是写在 `.svg` 中还是 `.html` 中，前者 `.svg` 只能出现一个 `<svg>` 根元素，后者 `.html` 可以有多个 `<svg>` 根元素。
  - svg 标签写在 `.svg` 文件中，作为根标记，要求有且只有一个。
  - svg 标签写在 `.html` 文件中，可以写多个标记，表示嵌入了多个 svg 图片，每一个 svg 都是一个独立的区域。
  

- [x] [0035. 绘制坐标系网格](https://tdahuyou.github.io/notes/notes/svg/0035.%20%E7%BB%98%E5%88%B6%E5%9D%90%E6%A0%87%E7%B3%BB%E7%BD%91%E6%A0%BC/README.html) <!-- [locale](./0035.%20%E7%BB%98%E5%88%B6%E5%9D%90%E6%A0%87%E7%B3%BB%E7%BD%91%E6%A0%BC/README.html) -->  
  - [1. 💻 demos.1 - 绘制坐标系网格](https://tdahuyou.github.io/notes/notes/svg/0035.%20%E7%BB%98%E5%88%B6%E5%9D%90%E6%A0%87%E7%B3%BB%E7%BD%91%E6%A0%BC/README.html#1--demos1---绘制坐标系网格)
  - 这里绘制的网格，是为了又一个更直观的参考坐标系，学习 svg、canvas 之类的内容，很多时候都是在手写一个个坐标，有一个直观的坐标参考系，写起来会方便很多。
  - 想要理解这个坐标是怎么绘制的，涉及到以下知识点：`<line>`、`<text>`、`<g>`、`viewBox`。
  - `<line>`、`<text>`、`<g>`这些内容都很简单，后续对它们都有介绍。即便还没有学习到这些元素，直接结合着注释看源代码，你应该也差不多能够理解文档中的网格是如何绘制出来的了。
  - 至于 `viewBox`，它表示视口，不是一两句话讲得清楚的，这玩意儿后续也会单独介绍。
  

- [x] [0034. 理解 viewBox 视口](https://tdahuyou.github.io/notes/notes/svg/0034.%20%E7%90%86%E8%A7%A3%20viewBox%20%E8%A7%86%E5%8F%A3/README.html) <!-- [locale](./0034.%20%E7%90%86%E8%A7%A3%20viewBox%20%E8%A7%86%E5%8F%A3/README.html) -->  
  - [1. 💻 demos.1 - 省略 `viewBox`](https://tdahuyou.github.io/notes/notes/svg/0034.%20%E7%90%86%E8%A7%A3%20viewBox%20%E8%A7%86%E5%8F%A3/README.html#1--demos1---省略-viewbox)
  - [2. 💻 demos.2 - 指定 viewBox 正好装下图形](https://tdahuyou.github.io/notes/notes/svg/0034.%20%E7%90%86%E8%A7%A3%20viewBox%20%E8%A7%86%E5%8F%A3/README.html#2--demos2---指定-viewbox-正好装下图形)
  - [3. 💻 demos.3 - 指定的 viewBox 区域看不到图形](https://tdahuyou.github.io/notes/notes/svg/0034.%20%E7%90%86%E8%A7%A3%20viewBox%20%E8%A7%86%E5%8F%A3/README.html#3--demos3---指定的-viewbox-区域看不到图形)
  - [4. 💻 demos.4 - 根据 demos.3 中的图形位置修改 viewBox 的值](https://tdahuyou.github.io/notes/notes/svg/0034.%20%E7%90%86%E8%A7%A3%20viewBox%20%E8%A7%86%E5%8F%A3/README.html#4--demos4---根据-demos3-中的图形位置修改-viewbox-的值)
  - [5. 🤔 问：svg 中坐标系有多大？](https://tdahuyou.github.io/notes/notes/svg/0034.%20%E7%90%86%E8%A7%A3%20viewBox%20%E8%A7%86%E5%8F%A3/README.html#5--问svg-中坐标系有多大)
  - [6. 🤔 问：`<svg>` 的 width、height 有什么用？](https://tdahuyou.github.io/notes/notes/svg/0034.%20%E7%90%86%E8%A7%A3%20viewBox%20%E8%A7%86%E5%8F%A3/README.html#6--问svg-的-widthheight-有什么用)
  - [7. 🤔 问：`<svg>` 的 width、height 都设置为 500，那么看到的坐标系是哪块区域呢？](https://tdahuyou.github.io/notes/notes/svg/0034.%20%E7%90%86%E8%A7%A3%20viewBox%20%E8%A7%86%E5%8F%A3/README.html#7--问svg-的-widthheight-都设置为-500那么看到的坐标系是哪块区域呢)
  - viewBox 视口，这是一个对于 svg 初学者来说不那么好理解的属性。
  - 其实 viewBox 这个词已经描述得很到位了，view 看，box 盒子，其中盒子可以理解为一个矩形区域 —— viewBox 表示你要看哪一块矩形区域。
  - 可以结合着 `Q&A` 中提到的问题来理解 viewBox 属性。
  

## 2. 基本图形绘制

- [x] [0005. 使用 line 绘制直线](https://tdahuyou.github.io/notes/notes/svg/0005.%20%E4%BD%BF%E7%94%A8%20line%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF/README.html) <!-- [locale](./0005.%20%E4%BD%BF%E7%94%A8%20line%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF/README.html) -->  
  - [1. 💻 demos.1 - 使用 `<line>` 绘制直线](https://tdahuyou.github.io/notes/notes/svg/0005.%20%E4%BD%BF%E7%94%A8%20line%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF/README.html#1--demos1---使用-line-绘制直线)
  - 绘制直线，只需要明确起点坐标 `(x1, y1)` 和终点坐标 `(x2, y2)` 即可。
  

- [x] [0007. 使用 polyline 绘制折线](https://tdahuyou.github.io/notes/notes/svg/0007.%20%E4%BD%BF%E7%94%A8%20polyline%20%E7%BB%98%E5%88%B6%E6%8A%98%E7%BA%BF/README.html) <!-- [locale](./0007.%20%E4%BD%BF%E7%94%A8%20polyline%20%E7%BB%98%E5%88%B6%E6%8A%98%E7%BA%BF/README.html) -->  
  - [1. 💻 demos.1 - 使用 `<polyline>` 绘制折线](https://tdahuyou.github.io/notes/notes/svg/0007.%20%E4%BD%BF%E7%94%A8%20polyline%20%E7%BB%98%E5%88%B6%E6%8A%98%E7%BA%BF/README.html#1--demos1---使用-polyline-绘制折线)
  - [2. 💻 demos.2 - 使用 `<polyline>` 绘制折线并填充](https://tdahuyou.github.io/notes/notes/svg/0007.%20%E4%BD%BF%E7%94%A8%20polyline%20%E7%BB%98%E5%88%B6%E6%8A%98%E7%BA%BF/README.html#2--demos2---使用-polyline-绘制折线并填充)
  - 绘制折线的写法很简单，挨个标注点，渲染的时候会按照顺序将我们写的点连起来形成折线。
  

- [x] [0008. 使用 rect 绘制矩形](https://tdahuyou.github.io/notes/notes/svg/0008.%20%E4%BD%BF%E7%94%A8%20rect%20%E7%BB%98%E5%88%B6%E7%9F%A9%E5%BD%A2/README.html) <!-- [locale](./0008.%20%E4%BD%BF%E7%94%A8%20rect%20%E7%BB%98%E5%88%B6%E7%9F%A9%E5%BD%A2/README.html) -->  
  - [1. 💻 demos.1 - 绘制矩形](https://tdahuyou.github.io/notes/notes/svg/0008.%20%E4%BD%BF%E7%94%A8%20rect%20%E7%BB%98%E5%88%B6%E7%9F%A9%E5%BD%A2/README.html#1--demos1---绘制矩形)
  - [2. 💻 demos.2 - 绘制圆角矩形](https://tdahuyou.github.io/notes/notes/svg/0008.%20%E4%BD%BF%E7%94%A8%20rect%20%E7%BB%98%E5%88%B6%E7%9F%A9%E5%BD%A2/README.html#2--demos2---绘制圆角矩形)
  - 绘制一个矩形，需要知道两组信息：
    1. 从哪个点开始绘制 `x`、`y`
    2. 绘制矩形的宽度和高度是多少 `width`、`height`
  - 圆角
    - 通过 `rx` `ry` 可以设置矩形的圆角效果。
  

- [x] [0006. 使用 polygon 绘制多边形](https://tdahuyou.github.io/notes/notes/svg/0006.%20%E4%BD%BF%E7%94%A8%20polygon%20%E7%BB%98%E5%88%B6%E5%A4%9A%E8%BE%B9%E5%BD%A2/README.html) <!-- [locale](./0006.%20%E4%BD%BF%E7%94%A8%20polygon%20%E7%BB%98%E5%88%B6%E5%A4%9A%E8%BE%B9%E5%BD%A2/README.html) -->  
  - [1. 💻 demos.1 - 使用 `<polygon>` 绘制多边形](https://tdahuyou.github.io/notes/notes/svg/0006.%20%E4%BD%BF%E7%94%A8%20polygon%20%E7%BB%98%E5%88%B6%E5%A4%9A%E8%BE%B9%E5%BD%A2/README.html#1--demos1---使用-polygon-绘制多边形)
   

- [x] [0003. 使用 circle 绘制圆形](https://tdahuyou.github.io/notes/notes/svg/0003.%20%E4%BD%BF%E7%94%A8%20circle%20%E7%BB%98%E5%88%B6%E5%9C%86%E5%BD%A2/README.html) <!-- [locale](./0003.%20%E4%BD%BF%E7%94%A8%20circle%20%E7%BB%98%E5%88%B6%E5%9C%86%E5%BD%A2/README.html) -->  
  - [1. 💻 demos.1 - 使用 circle 绘制圆形](https://tdahuyou.github.io/notes/notes/svg/0003.%20%E4%BD%BF%E7%94%A8%20circle%20%E7%BB%98%E5%88%B6%E5%9C%86%E5%BD%A2/README.html#1--demos1---使用-circle-绘制圆形)
  - [2. 💻 demos.2 - 使用 circle 绘制圆形](https://tdahuyou.github.io/notes/notes/svg/0003.%20%E4%BD%BF%E7%94%A8%20circle%20%E7%BB%98%E5%88%B6%E5%9C%86%E5%BD%A2/README.html#2--demos2---使用-circle-绘制圆形)
  - 绘制一个圆需要知道的信息：
    1. 圆心的坐标 `cx` `cy`
    2. 绘制的圆的半径 `r`
  

- [x] [0004. 使用 ellipse 绘制椭圆形](https://tdahuyou.github.io/notes/notes/svg/0004.%20%E4%BD%BF%E7%94%A8%20ellipse%20%E7%BB%98%E5%88%B6%E6%A4%AD%E5%9C%86%E5%BD%A2/README.html) <!-- [locale](./0004.%20%E4%BD%BF%E7%94%A8%20ellipse%20%E7%BB%98%E5%88%B6%E6%A4%AD%E5%9C%86%E5%BD%A2/README.html) -->  
  - [1. 💻 demos.1 - 使用 `<ellipse>` 绘制椭圆形](https://tdahuyou.github.io/notes/notes/svg/0004.%20%E4%BD%BF%E7%94%A8%20ellipse%20%E7%BB%98%E5%88%B6%E6%A4%AD%E5%9C%86%E5%BD%A2/README.html#1--demos1---使用-ellipse-绘制椭圆形)
  - 绘制椭圆需要知道的信息：
    1. 椭圆的圆心 cx cy
    2. 椭圆的 x 轴半径 rx
    3. 椭圆的 y 轴半径 ry
  - 如果 rx = ry，那么其实绘制的就是一个圆。
  

- [x] [0031. 使用属性 x、y、dx、dy 控制文本的绘制位置](https://tdahuyou.github.io/notes/notes/svg/0031.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20x%E3%80%81y%E3%80%81dx%E3%80%81dy%20%E6%8E%A7%E5%88%B6%E6%96%87%E6%9C%AC%E7%9A%84%E7%BB%98%E5%88%B6%E4%BD%8D%E7%BD%AE/README.html) <!-- [locale](./0031.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20x%E3%80%81y%E3%80%81dx%E3%80%81dy%20%E6%8E%A7%E5%88%B6%E6%96%87%E6%9C%AC%E7%9A%84%E7%BB%98%E5%88%B6%E4%BD%8D%E7%BD%AE/README.html) -->  
  - [1. 💻 demos.1 - 使用属性 x、y、dx、dy 控制文本的绘制位置](https://tdahuyou.github.io/notes/notes/svg/0031.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20x%E3%80%81y%E3%80%81dx%E3%80%81dy%20%E6%8E%A7%E5%88%B6%E6%96%87%E6%9C%AC%E7%9A%84%E7%BB%98%E5%88%B6%E4%BD%8D%E7%BD%AE/README.html#1--demos1---使用属性-xydxdy-控制文本的绘制位置)
  - x、y、dx、dy 这些属性决定了绘制文本的位置。其中 x、y 属性决定了文本的左上角位置，而 dx、dy 属性决定了文本的偏移量。
  

- [x] [0029. 使用属性 text-anchor 设置文本的水平对齐方式](https://tdahuyou.github.io/notes/notes/svg/0029.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20text-anchor%20%E8%AE%BE%E7%BD%AE%E6%96%87%E6%9C%AC%E7%9A%84%E6%B0%B4%E5%B9%B3%E5%AF%B9%E9%BD%90%E6%96%B9%E5%BC%8F/README.html) <!-- [locale](./0029.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20text-anchor%20%E8%AE%BE%E7%BD%AE%E6%96%87%E6%9C%AC%E7%9A%84%E6%B0%B4%E5%B9%B3%E5%AF%B9%E9%BD%90%E6%96%B9%E5%BC%8F/README.html) -->  
  - [1. 💻 demos.1 - 控制文本的水平对齐方式](https://tdahuyou.github.io/notes/notes/svg/0029.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20text-anchor%20%E8%AE%BE%E7%BD%AE%E6%96%87%E6%9C%AC%E7%9A%84%E6%B0%B4%E5%B9%B3%E5%AF%B9%E9%BD%90%E6%96%B9%E5%BC%8F/README.html#1--demos1---控制文本的水平对齐方式)
  - 属性 `text-anchor` 用于设置文本的水平对齐方式。
  

- [x] [0030. 使用属性 textLength 约束文本长度](https://tdahuyou.github.io/notes/notes/svg/0030.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20textLength%20%E7%BA%A6%E6%9D%9F%E6%96%87%E6%9C%AC%E9%95%BF%E5%BA%A6/README.html) <!-- [locale](./0030.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20textLength%20%E7%BA%A6%E6%9D%9F%E6%96%87%E6%9C%AC%E9%95%BF%E5%BA%A6/README.html) -->  
  - [1. 💻 demos.1 - 约束文本长度](https://tdahuyou.github.io/notes/notes/svg/0030.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20textLength%20%E7%BA%A6%E6%9D%9F%E6%96%87%E6%9C%AC%E9%95%BF%E5%BA%A6/README.html#1--demos1---约束文本长度)
  - 属性 `textLength` 用于设置文本的长度
    - 长度过大，文本拉伸
    - 长度过小，文本压缩
  

- [x] [0032. 通过 text 的其他属性来控制文本样式](https://tdahuyou.github.io/notes/notes/svg/0032.%20%E9%80%9A%E8%BF%87%20text%20%E7%9A%84%E5%85%B6%E4%BB%96%E5%B1%9E%E6%80%A7%E6%9D%A5%E6%8E%A7%E5%88%B6%E6%96%87%E6%9C%AC%E6%A0%B7%E5%BC%8F/README.html) <!-- [locale](./0032.%20%E9%80%9A%E8%BF%87%20text%20%E7%9A%84%E5%85%B6%E4%BB%96%E5%B1%9E%E6%80%A7%E6%9D%A5%E6%8E%A7%E5%88%B6%E6%96%87%E6%9C%AC%E6%A0%B7%E5%BC%8F/README.html) -->  
  - [1. 💻 demos.1 - 设置文本样式](https://tdahuyou.github.io/notes/notes/svg/0032.%20%E9%80%9A%E8%BF%87%20text%20%E7%9A%84%E5%85%B6%E4%BB%96%E5%B1%9E%E6%80%A7%E6%9D%A5%E6%8E%A7%E5%88%B6%E6%96%87%E6%9C%AC%E6%A0%B7%E5%BC%8F/README.html#1--demos1---设置文本样式)
  - fill：设置字体颜色
  - font-size：设置文字大小
  - font-family：设置字体
  - font-style：设置斜体
  - font-weight：设置粗体
  - text-decoration：设置文本装饰
    - 下划线：underline
    - 上划线：overline
    - 删除线：line-through
  - letter-spacing：设置每一个字母之间的距离
  - word-spacing：设置每一个单词之间的距离
  - font-variant：设置文字变体
    - small-caps 转大写，不过是小型的大写字母
  

- [x] [0019. 使用 tspan 更细粒度地控制 text 中的内容](https://tdahuyou.github.io/notes/notes/svg/0019.%20%E4%BD%BF%E7%94%A8%20tspan%20%E6%9B%B4%E7%BB%86%E7%B2%92%E5%BA%A6%E5%9C%B0%E6%8E%A7%E5%88%B6%20text%20%E4%B8%AD%E7%9A%84%E5%86%85%E5%AE%B9/README.html) <!-- [locale](./0019.%20%E4%BD%BF%E7%94%A8%20tspan%20%E6%9B%B4%E7%BB%86%E7%B2%92%E5%BA%A6%E5%9C%B0%E6%8E%A7%E5%88%B6%20text%20%E4%B8%AD%E7%9A%84%E5%86%85%E5%AE%B9/README.html) -->  
  - [1. 💻 demos.1 - tspan 的基本使用](https://tdahuyou.github.io/notes/notes/svg/0019.%20%E4%BD%BF%E7%94%A8%20tspan%20%E6%9B%B4%E7%BB%86%E7%B2%92%E5%BA%A6%E5%9C%B0%E6%8E%A7%E5%88%B6%20text%20%E4%B8%AD%E7%9A%84%E5%86%85%E5%AE%B9/README.html#1--demos1---tspan-的基本使用)
  - [2. 💻 demos.2 - tspan 的基本使用](https://tdahuyou.github.io/notes/notes/svg/0019.%20%E4%BD%BF%E7%94%A8%20tspan%20%E6%9B%B4%E7%BB%86%E7%B2%92%E5%BA%A6%E5%9C%B0%E6%8E%A7%E5%88%B6%20text%20%E4%B8%AD%E7%9A%84%E5%86%85%E5%AE%B9/README.html#2--demos2---tspan-的基本使用)
  - tspan 是 text 中的子元素，可以更细粒度地去控制文本内容。如果有控制一段文本中的一部分内容的需求，这玩意儿还是很有用的。
  

- [x] [0018. 使用 textPath 实现按照指定路径绘制文本](https://tdahuyou.github.io/notes/notes/svg/0018.%20%E4%BD%BF%E7%94%A8%20textPath%20%E5%AE%9E%E7%8E%B0%E6%8C%89%E7%85%A7%E6%8C%87%E5%AE%9A%E8%B7%AF%E5%BE%84%E7%BB%98%E5%88%B6%E6%96%87%E6%9C%AC/README.html) <!-- [locale](./0018.%20%E4%BD%BF%E7%94%A8%20textPath%20%E5%AE%9E%E7%8E%B0%E6%8C%89%E7%85%A7%E6%8C%87%E5%AE%9A%E8%B7%AF%E5%BE%84%E7%BB%98%E5%88%B6%E6%96%87%E6%9C%AC/README.html) -->  
  - [1. 💻 demos.1 - textPath 基本使用](https://tdahuyou.github.io/notes/notes/svg/0018.%20%E4%BD%BF%E7%94%A8%20textPath%20%E5%AE%9E%E7%8E%B0%E6%8C%89%E7%85%A7%E6%8C%87%E5%AE%9A%E8%B7%AF%E5%BE%84%E7%BB%98%E5%88%B6%E6%96%87%E6%9C%AC/README.html#1--demos1---textpath-基本使用)
  - 看下文档中提供的 demo 效果，很容易理解其作用。效果蛮惊艳的，不过不太常见。
  

## 3. path 路径

- [x] [0048. 认识 path 元素](https://tdahuyou.github.io/notes/notes/svg/0048.%20%E8%AE%A4%E8%AF%86%20path%20%E5%85%83%E7%B4%A0/README.html) <!-- [locale](./0048.%20%E8%AE%A4%E8%AF%86%20path%20%E5%85%83%E7%B4%A0/README.html) -->  
  - [1. 📒 近乎万能的 path](https://tdahuyou.github.io/notes/notes/svg/0048.%20%E8%AE%A4%E8%AF%86%20path%20%E5%85%83%E7%B4%A0/README.html#1--近乎万能的-path)
  - [2. 📒 path 中一些常用的命令](https://tdahuyou.github.io/notes/notes/svg/0048.%20%E8%AE%A4%E8%AF%86%20path%20%E5%85%83%E7%B4%A0/README.html#2--path-中一些常用的命令)
  - [3. 📒 手写 SVG 与设计软件导出 SVG 的区别及适用场景](https://tdahuyou.github.io/notes/notes/svg/0048.%20%E8%AE%A4%E8%AF%86%20path%20%E5%85%83%E7%B4%A0/README.html#3--手写-svg-与设计软件导出-svg-的区别及适用场景)
  - [4. 💻 demos.1 - 来看一个由 path 制作的 react logo 的 svg 源码](https://tdahuyou.github.io/notes/notes/svg/0048.%20%E8%AE%A4%E8%AF%86%20path%20%E5%85%83%E7%B4%A0/README.html#4--demos1---来看一个由-path-制作的-react-logo-的-svg-源码)
  - 在学习 path 的相关内容之前，先对 path 有个初步的认知，知道它都能用来干啥。
  - path 这玩意儿有点儿骚，因为它绘制的是路径，这个路径可以是直的也可以是弯的，可以是任意形状，也就是说几乎没有 path 不能绘制的图形。
  - 因此，在众多 svg 元素中，`<path>` 的参数也是最为复杂的。文中提到了不少关键字，这些关键字在后续的 demo 中大多都会结合实际的示例来介绍。要理解关键字，可以把切入点放在关键字的全称上，把英文单词先给看懂，知道每个关键字对应的英文全称是什么。
  

- [x] [0012. 使用 path 绘制直线](https://tdahuyou.github.io/notes/notes/svg/0012.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF/README.html) <!-- [locale](./0012.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF/README.html) -->  
  - [1. 💻 demos.1 - 绘制直线的多种写法](https://tdahuyou.github.io/notes/notes/svg/0012.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF/README.html#1--demos1---绘制直线的多种写法)
  - [2. 💻 demos.2 - 一个 `<path>` 允许多个 `M`](https://tdahuyou.github.io/notes/notes/svg/0012.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF/README.html#2--demos2---一个-path-允许多个-m)
  - [3. 💻 demos.3 - 关键字的大小写有着不同的含义](https://tdahuyou.github.io/notes/notes/svg/0012.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF/README.html#3--demos3---关键字的大小写有着不同的含义)
  - [4. 💻 demos.4 - H、V、Z 关键字](https://tdahuyou.github.io/notes/notes/svg/0012.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF/README.html#4--demos4---hvz-关键字)
  - `<path>` 可以用于绘制直线，涉及到的关键字：`M/m`、`L/l`、`H`、`V`、`Z`。
  

- [x] [0013. 绘制【扫码】图标](https://tdahuyou.github.io/notes/notes/svg/0013.%20%E7%BB%98%E5%88%B6%E3%80%90%E6%89%AB%E7%A0%81%E3%80%91%E5%9B%BE%E6%A0%87/README.html) <!-- [locale](./0013.%20%E7%BB%98%E5%88%B6%E3%80%90%E6%89%AB%E7%A0%81%E3%80%91%E5%9B%BE%E6%A0%87/README.html) -->  
  - [1. 🔗 iconfont 图标库](https://tdahuyou.github.io/notes/notes/svg/0013.%20%E7%BB%98%E5%88%B6%E3%80%90%E6%89%AB%E7%A0%81%E3%80%91%E5%9B%BE%E6%A0%87/README.html#1--iconfont-图标库)
  - [2. 💻 demos.1 - 绘制扫码图标](https://tdahuyou.github.io/notes/notes/svg/0013.%20%E7%BB%98%E5%88%B6%E3%80%90%E6%89%AB%E7%A0%81%E3%80%91%E5%9B%BE%E6%A0%87/README.html#2--demos1---绘制扫码图标)
  - **svg 经常被用来设计一些图标，一些非常简单的可以直接手写，不过更多时候还是使用设计软件制作。**
  - 在学习 svg 的过程中，可以自己找几个简单的图标来自行练习一下。
  - 示例中绘制的扫码图标，使用的是 `<path>` 绘制直线的相关知识来实现的。
  - 能够看懂代码就行。实现方式不唯一，做法有很多种，比如一条条地绘制 `<line>` 也行。
  

- [x] [0011. 使用 path 绘制弧](https://tdahuyou.github.io/notes/notes/svg/0011.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E5%BC%A7/README.html) <!-- [locale](./0011.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E5%BC%A7/README.html) -->  
  - [1. 💻 demos.1 - 使用 `<path>` 绘制弧](https://tdahuyou.github.io/notes/notes/svg/0011.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E5%BC%A7/README.html#1--demos1---使用-path-绘制弧)
  - [2. 💻 demos.2 - 椭圆旋转](https://tdahuyou.github.io/notes/notes/svg/0011.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E5%BC%A7/README.html#2--demos2---椭圆旋转)
  - [3. 💻 demos.3 - 两点决定 4 条弧](https://tdahuyou.github.io/notes/notes/svg/0011.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E5%BC%A7/README.html#3--demos3---两点决定-4-条弧)
  - [4. 🤔 指定一个起点坐标和一个终点坐标，一共可以绘制几条弧呢？](https://tdahuyou.github.io/notes/notes/svg/0011.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E5%BC%A7/README.html#4--指定一个起点坐标和一个终点坐标一共可以绘制几条弧呢)
  - [5. 🤔 如果起点和终点以及半径都保持不变的话，一共可以绘制几条弧呢？](https://tdahuyou.github.io/notes/notes/svg/0011.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E5%BC%A7/README.html#5--如果起点和终点以及半径都保持不变的话一共可以绘制几条弧呢)
  - [6. 🤔 如果 rx ry 是相同的值，那么旋转还有意义吗？](https://tdahuyou.github.io/notes/notes/svg/0011.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E5%BC%A7/README.html#6--如果-rx-ry-是相同的值那么旋转还有意义吗)
  - 涉及到的关键字：`A`
  - A 的参数有些多，可以结合 demos 来理解这些关键字的作用及含义。
  - 通过思考结尾的 `Q&A` 部分提到的一些问题，有助于加深对本节内容的理解。
  

- [x] [0036. 绘制【群】图标](https://tdahuyou.github.io/notes/notes/svg/0036.%20%E7%BB%98%E5%88%B6%E3%80%90%E7%BE%A4%E3%80%91%E5%9B%BE%E6%A0%87/README.html) <!-- [locale](./0036.%20%E7%BB%98%E5%88%B6%E3%80%90%E7%BE%A4%E3%80%91%E5%9B%BE%E6%A0%87/README.html) -->  
  - [1. 💻 demos.1 - 绘制「群」图标](https://tdahuyou.github.io/notes/notes/svg/0036.%20%E7%BB%98%E5%88%B6%E3%80%90%E7%BE%A4%E3%80%91%E5%9B%BE%E6%A0%87/README.html#1--demos1---绘制群图标)
  - 本节涉及的知识点：使用 `path` 标签来绘制弧。
    - `svg.0011`
  - 能够理解这个群的图标其实就是通过几段弧绘制出来的即可。
  

- [x] [0010. 使用 path 绘制二次贝塞尔曲线](https://tdahuyou.github.io/notes/notes/svg/0010.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E4%BA%8C%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF/README.html) <!-- [locale](./0010.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E4%BA%8C%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF/README.html) -->  
  - [1. 💻 demos.1 - Q 绘制一个贝塞尔曲线](https://tdahuyou.github.io/notes/notes/svg/0010.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E4%BA%8C%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF/README.html#1--demos1---q-绘制一个贝塞尔曲线)
  - [2. 💻 demos.2 - Q、T 绘制连续的贝塞尔曲线](https://tdahuyou.github.io/notes/notes/svg/0010.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E4%BA%8C%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF/README.html#2--demos2---qt-绘制连续的贝塞尔曲线)
  - [3. 💻 demos.3 - Q、T 绘制连续的贝塞尔曲线](https://tdahuyou.github.io/notes/notes/svg/0010.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E4%BA%8C%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF/README.html#3--demos3---qt-绘制连续的贝塞尔曲线)
  - 二次、三次贝塞尔曲线绘制原理，见 canvas.0025。
  

- [x] [0014. 使用 path 绘制三次贝塞尔曲线](https://tdahuyou.github.io/notes/notes/svg/0014.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E4%B8%89%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF/README.html) <!-- [locale](./0014.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E4%B8%89%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF/README.html) -->  
  - [1. 💻 demos.1 - C 绘制一个三次贝塞尔曲线](https://tdahuyou.github.io/notes/notes/svg/0014.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E4%B8%89%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF/README.html#1--demos1---c-绘制一个三次贝塞尔曲线)
  - [2. 💻 demos.2 - C、S 绘制连续平滑的三次贝塞尔曲线](https://tdahuyou.github.io/notes/notes/svg/0014.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E4%B8%89%E6%AC%A1%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF/README.html#2--demos2---cs-绘制连续平滑的三次贝塞尔曲线)
  - 二次、三次贝塞尔曲线绘制原理，见 canvas.0025。
  

## 4. stroke 描边和 fill 填充

- [x] [0028. 使用属性 stroke、stroke-width、stroke-opacity、stroke-linecap 设置描边样式](https://tdahuyou.github.io/notes/notes/svg/0028.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke%E3%80%81stroke-width%E3%80%81stroke-opacity%E3%80%81stroke-linecap%20%E8%AE%BE%E7%BD%AE%E6%8F%8F%E8%BE%B9%E6%A0%B7%E5%BC%8F/README.html) <!-- [locale](./0028.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke%E3%80%81stroke-width%E3%80%81stroke-opacity%E3%80%81stroke-linecap%20%E8%AE%BE%E7%BD%AE%E6%8F%8F%E8%BE%B9%E6%A0%B7%E5%BC%8F/README.html) -->  
  - [1. 💻 demos.1 - 使用 stroke 相关属性设置描边样式](https://tdahuyou.github.io/notes/notes/svg/0028.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke%E3%80%81stroke-width%E3%80%81stroke-opacity%E3%80%81stroke-linecap%20%E8%AE%BE%E7%BD%AE%E6%8F%8F%E8%BE%B9%E6%A0%B7%E5%BC%8F/README.html#1--demos1---使用-stroke-相关属性设置描边样式)
  - stroke：设置描边颜色（边框）
  - stroke-width：设置描边粗细
  - stroke-opacity：设置描边颜色的透明度
  - stroke-linecap：设置线段两端的形状
  

- [x] [0027. 使用属性 stroke-linejoin 设置线条连接处样式](https://tdahuyou.github.io/notes/notes/svg/0027.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke-linejoin%20%E8%AE%BE%E7%BD%AE%E7%BA%BF%E6%9D%A1%E8%BF%9E%E6%8E%A5%E5%A4%84%E6%A0%B7%E5%BC%8F/README.html) <!-- [locale](./0027.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke-linejoin%20%E8%AE%BE%E7%BD%AE%E7%BA%BF%E6%9D%A1%E8%BF%9E%E6%8E%A5%E5%A4%84%E6%A0%B7%E5%BC%8F/README.html) -->  
  - [1. 💻 demos.1 - 使用属性 stroke-linejoin 设置线条连接处样式](https://tdahuyou.github.io/notes/notes/svg/0027.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke-linejoin%20%E8%AE%BE%E7%BD%AE%E7%BA%BF%E6%9D%A1%E8%BF%9E%E6%8E%A5%E5%A4%84%E6%A0%B7%E5%BC%8F/README.html#1--demos1---使用属性-stroke-linejoin-设置线条连接处样式)
  - miter	`>`	尖角
  - round `)` 圆角
  - bevel `]`	平角
  

- [x] [0025. 使用属性 stroke-dasharray 设置虚线](https://tdahuyou.github.io/notes/notes/svg/0025.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke-dasharray%20%E8%AE%BE%E7%BD%AE%E8%99%9A%E7%BA%BF/README.html) <!-- [locale](./0025.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke-dasharray%20%E8%AE%BE%E7%BD%AE%E8%99%9A%E7%BA%BF/README.html) -->  
  - [1. 💻 demos.1 - 使用属性 stroke-dasharray 设置虚线](https://tdahuyou.github.io/notes/notes/svg/0025.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke-dasharray%20%E8%AE%BE%E7%BD%AE%E8%99%9A%E7%BA%BF/README.html#1--demos1---使用属性-stroke-dasharray-设置虚线)
  - path 中的 stroke-dasharray 属性可以用虚线设置描边。
  - 属性值设置的是虚线区域的长度和空白区域的长度。
  

- [x] [0026. 使用属性 stroke-dashoffset 设置虚线的偏移](https://tdahuyou.github.io/notes/notes/svg/0026.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke-dashoffset%20%E8%AE%BE%E7%BD%AE%E8%99%9A%E7%BA%BF%E7%9A%84%E5%81%8F%E7%A7%BB/README.html) <!-- [locale](./0026.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke-dashoffset%20%E8%AE%BE%E7%BD%AE%E8%99%9A%E7%BA%BF%E7%9A%84%E5%81%8F%E7%A7%BB/README.html) -->  
  - [1. 💻 demos.1 - 使用属性 stroke-dashoffset 设置虚线的偏移](https://tdahuyou.github.io/notes/notes/svg/0026.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20stroke-dashoffset%20%E8%AE%BE%E7%BD%AE%E8%99%9A%E7%BA%BF%E7%9A%84%E5%81%8F%E7%A7%BB/README.html#1--demos1---使用属性-stroke-dashoffset-设置虚线的偏移)
  - stroke-dashoffset、stroke-dasharray 这两个属性配合使用，可以实现一些常见的线条移动的动画效果。
  

- [x] [0023. 【练习】使用 stroke-dasharray 模拟加载中动画效果](https://tdahuyou.github.io/notes/notes/svg/0023.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E4%BD%BF%E7%94%A8%20stroke-dasharray%20%E6%A8%A1%E6%8B%9F%E5%8A%A0%E8%BD%BD%E4%B8%AD%E5%8A%A8%E7%94%BB%E6%95%88%E6%9E%9C/README.html) <!-- [locale](./0023.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E4%BD%BF%E7%94%A8%20stroke-dasharray%20%E6%A8%A1%E6%8B%9F%E5%8A%A0%E8%BD%BD%E4%B8%AD%E5%8A%A8%E7%94%BB%E6%95%88%E6%9E%9C/README.html) -->  
  - [1. 💻 demos.1 - 使用 stroke-dasharray 模拟加载中动画效果](https://tdahuyou.github.io/notes/notes/svg/0023.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E4%BD%BF%E7%94%A8%20stroke-dasharray%20%E6%A8%A1%E6%8B%9F%E5%8A%A0%E8%BD%BD%E4%B8%AD%E5%8A%A8%E7%94%BB%E6%95%88%E6%9E%9C/README.html#1--demos1---使用-stroke-dasharray-模拟加载中动画效果)
  

- [ ] [0015. 使用属性 fill、fill-opacity 设置填充样式](https://tdahuyou.github.io/notes/notes/svg/0015.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill%E3%80%81fill-opacity%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E6%A0%B7%E5%BC%8F/README.html) <!-- [locale](./0015.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill%E3%80%81fill-opacity%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E6%A0%B7%E5%BC%8F/README.html) -->  
  - [1. demos.1 - 使用属性 fill、fill-opacity 设置填充样式](https://tdahuyou.github.io/notes/notes/svg/0015.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill%E3%80%81fill-opacity%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E6%A0%B7%E5%BC%8F/README.html#1-demos1---使用属性-fillfill-opacity-设置填充样式)
  - fill 设置填充颜色
  - fill-opacity 设置填充透明度
  

- [ ] [0024. 使用属性 fill-rule 设置填充规则](https://tdahuyou.github.io/notes/notes/svg/0024.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill-rule%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E8%A7%84%E5%88%99/README.html) <!-- [locale](./0024.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill-rule%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E8%A7%84%E5%88%99/README.html) -->  
  - [1. 🔗 links](https://tdahuyou.github.io/notes/notes/svg/0024.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill-rule%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E8%A7%84%E5%88%99/README.html#1--links)
  - [2. 📒 fill-rule 简介](https://tdahuyou.github.io/notes/notes/svg/0024.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill-rule%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E8%A7%84%E5%88%99/README.html#2--fill-rule-简介)
  - [3. 💻 demos.1 - nonzero 规则](https://tdahuyou.github.io/notes/notes/svg/0024.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill-rule%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E8%A7%84%E5%88%99/README.html#3--demos1---nonzero-规则)
  - [4. 💻 demos.2 - evenodd 规则](https://tdahuyou.github.io/notes/notes/svg/0024.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill-rule%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E8%A7%84%E5%88%99/README.html#4--demos2---evenodd-规则)
  - [5. 🤔 为什么需要有填充规则，它是为了解决什么场景下的问题？](https://tdahuyou.github.io/notes/notes/svg/0024.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20fill-rule%20%E8%AE%BE%E7%BD%AE%E5%A1%AB%E5%85%85%E8%A7%84%E5%88%99/README.html#5--为什么需要有填充规则它是为了解决什么场景下的问题)
  - 这个 fill-rule 填充规则不太好理解，虽然只有两个值 nonzero、evenodd。填充规则，是一个通用的知识点，不仅仅限于 svg 中，在 canvas 中也是有这玩意儿的。
    这篇文档中的图形，是参照大佬“张鑫旭”的教程绘制的，对于最终的渲染结果，可以参考大佬的教程来对照着学习。
  - 有关 nonzero 和 evenodd 填充规则的讲解说明。
    - 可参考笔记 canvas.0031。
    - 在 YouTube 上也有一些相关的视频教程讲解 nonzero 和 evenodd 填充规则。
  

- [ ] [0037. 绘制【眼睛】图标](https://tdahuyou.github.io/notes/notes/svg/0037.%20%E7%BB%98%E5%88%B6%E3%80%90%E7%9C%BC%E7%9D%9B%E3%80%91%E5%9B%BE%E6%A0%87/README.html) <!-- [locale](./0037.%20%E7%BB%98%E5%88%B6%E3%80%90%E7%9C%BC%E7%9D%9B%E3%80%91%E5%9B%BE%E6%A0%87/README.html) -->  
  - [1. 💻 demos.1 - 绘制【眼睛】图标](https://tdahuyou.github.io/notes/notes/svg/0037.%20%E7%BB%98%E5%88%B6%E3%80%90%E7%9C%BC%E7%9D%9B%E3%80%91%E5%9B%BE%E6%A0%87/README.html#1--demos1---绘制眼睛图标)
  - 绘制眼睛图标时，中心有一个镂空的圆环。要弄清楚为什么这块的内容是镂空的，需要理解填充规则 nonzero 和 evenodd。
  

## 5. 复用

- [ ] [0020. 使用 use 引用图形](https://tdahuyou.github.io/notes/notes/svg/0020.%20%E4%BD%BF%E7%94%A8%20use%20%E5%BC%95%E7%94%A8%E5%9B%BE%E5%BD%A2/README.html) <!-- [locale](./0020.%20%E4%BD%BF%E7%94%A8%20use%20%E5%BC%95%E7%94%A8%E5%9B%BE%E5%BD%A2/README.html) -->  
  - [1. 💻 demos.1 - 使用 use 引用图形](https://tdahuyou.github.io/notes/notes/svg/0020.%20%E4%BD%BF%E7%94%A8%20use%20%E5%BC%95%E7%94%A8%E5%9B%BE%E5%BD%A2/README.html#1--demos1---使用-use-引用图形)
  - `<use>` 元素允许您在不同位置多次重用或引用同一个定义过的图形对象，如符号、形状、组合图形等，可以减少一些重复代码的书写，提高效率和文件的整洁度。在实际开发中，这玩意儿的使用频率是算蛮高的，更多时候会结合 g、defs 元素一起使用。
  - **注意事项**：use 中的 x 和 y 是基于引用图形的坐标，而不是坐标系。
  

- [ ] [0017. 使用 g 作为容器](https://tdahuyou.github.io/notes/notes/svg/0017.%20%E4%BD%BF%E7%94%A8%20g%20%E4%BD%9C%E4%B8%BA%E5%AE%B9%E5%99%A8/README.html) <!-- [locale](./0017.%20%E4%BD%BF%E7%94%A8%20g%20%E4%BD%9C%E4%B8%BA%E5%AE%B9%E5%99%A8/README.html) -->  
  - [1. 🔗 links](https://tdahuyou.github.io/notes/notes/svg/0017.%20%E4%BD%BF%E7%94%A8%20g%20%E4%BD%9C%E4%B8%BA%E5%AE%B9%E5%99%A8/README.html#1--links)
  - [2. 📒 `<g>` 标签简介](https://tdahuyou.github.io/notes/notes/svg/0017.%20%E4%BD%BF%E7%94%A8%20g%20%E4%BD%9C%E4%B8%BA%E5%AE%B9%E5%99%A8/README.html#2--g-标签简介)
  - [3. 💻 demos.1 - 使用 `<g>` 包裹多个元素实现多次复用](https://tdahuyou.github.io/notes/notes/svg/0017.%20%E4%BD%BF%E7%94%A8%20g%20%E4%BD%9C%E4%B8%BA%E5%AE%B9%E5%99%A8/README.html#3--demos1---使用-g-包裹多个元素实现多次复用)
  - 你可以将 `<g>` 理解为 html 中的 `<div>` 标签，没有任何实际的特殊效果，仅仅是起到一个容器的角色。
  - 可以使用 `<g>` 标签，将那些需要复用的元素给一起包裹起来，实现复用多个元素组成的组件。
  - `<g>` 通常用于配合 `<use>`、`<defs>` 一起使用。
  

- [ ] [0016. 使用 defs 定义图形](https://tdahuyou.github.io/notes/notes/svg/0016.%20%E4%BD%BF%E7%94%A8%20defs%20%E5%AE%9A%E4%B9%89%E5%9B%BE%E5%BD%A2/README.html) <!-- [locale](./0016.%20%E4%BD%BF%E7%94%A8%20defs%20%E5%AE%9A%E4%B9%89%E5%9B%BE%E5%BD%A2/README.html) -->  
  - [1. 💻 demos.1 - 使用 defs 定义图形](https://tdahuyou.github.io/notes/notes/svg/0016.%20%E4%BD%BF%E7%94%A8%20defs%20%E5%AE%9A%E4%B9%89%E5%9B%BE%E5%BD%A2/README.html#1--demos1---使用-defs-定义图形)
  - [2. demos.2 - defs + g + use](https://tdahuyou.github.io/notes/notes/svg/0016.%20%E4%BD%BF%E7%94%A8%20defs%20%E5%AE%9A%E4%B9%89%E5%9B%BE%E5%BD%A2/README.html#2-demos2---defs--g--use)
  - `<defs>` 用于定义图形，使用 `<defs>` 定义的元素不会直接显示，除非被其他 SVG 元素通过引用使用，通常配合 `<use>`、`<g>` 一起使用。
  

## 6. svg 与传统前端技术相结合

### 6.1. svg + html

- [x] [0001. 在 html 中嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html) <!-- [locale](./0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html) -->  
  - [1. 💻 demos.1 - 准备测试用的 svg 图形](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#1--demos1---准备测试用的-svg-图形)
  - [2. 💻 demos.2 - 通过 img 标签来嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#2--demos2---通过-img-标签来嵌入-svg)
  - [3. 💻 demos.3 - 通过直接嵌入源码的方式来嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#3--demos3---通过直接嵌入源码的方式来嵌入-svg)
  - [4. 💻 demos.4 - 通过 iframe 来嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#4--demos4---通过-iframe-来嵌入-svg)
  - [5. 💻 demos.5 - 通过 object 标签来嵌入 svg](https://tdahuyou.github.io/notes/notes/svg/0001.%20%E5%9C%A8%20html%20%E4%B8%AD%E5%B5%8C%E5%85%A5%20svg/README.html#5--demos5---通过-object-标签来嵌入-svg)
  - 本文介绍了在 html 文件中引入 svg 资源的实现方式，可以通过下面这 4 种方式来在 html 中嵌入 svg：
    1. 通过 img 标签来嵌入 svg
    2. 通过直接嵌入源码的方式来嵌入 svg
    3. 通过 iframe 来嵌入 svg
    4. 通过 object 来嵌入 svg
  - 如果你写好了一个 svg 文件，想要知道如何将其引入到前端页面上，可以参考下文中提到的一些做法。
  

### 6.2. svg + css

- [ ] [0021. 使用 css 控制 svg 样式](https://tdahuyou.github.io/notes/notes/svg/0021.%20%E4%BD%BF%E7%94%A8%20css%20%E6%8E%A7%E5%88%B6%20svg%20%E6%A0%B7%E5%BC%8F/README.html) <!-- [locale](./0021.%20%E4%BD%BF%E7%94%A8%20css%20%E6%8E%A7%E5%88%B6%20svg%20%E6%A0%B7%E5%BC%8F/README.html) -->  
  - [1. 📒 使用 CSS 控制 SVG 样式的注意事项](https://tdahuyou.github.io/notes/notes/svg/0021.%20%E4%BD%BF%E7%94%A8%20css%20%E6%8E%A7%E5%88%B6%20svg%20%E6%A0%B7%E5%BC%8F/README.html#1--使用-css-控制-svg-样式的注意事项)
  - [2. 💻 demos.1 - 在 svg 中嵌入 style](https://tdahuyou.github.io/notes/notes/svg/0021.%20%E4%BD%BF%E7%94%A8%20css%20%E6%8E%A7%E5%88%B6%20svg%20%E6%A0%B7%E5%BC%8F/README.html#2--demos1---在-svg-中嵌入-style)
  - [3. 💻 demos.2 - 在 svg 上应用 css 中的动画过渡效果 - 1](https://tdahuyou.github.io/notes/notes/svg/0021.%20%E4%BD%BF%E7%94%A8%20css%20%E6%8E%A7%E5%88%B6%20svg%20%E6%A0%B7%E5%BC%8F/README.html#3--demos2---在-svg-上应用-css-中的动画过渡效果---1)
  - [4. 💻 demos.3 - 在 svg 上应用 css 中的动画过渡效果 - 2](https://tdahuyou.github.io/notes/notes/svg/0021.%20%E4%BD%BF%E7%94%A8%20css%20%E6%8E%A7%E5%88%B6%20svg%20%E6%A0%B7%E5%BC%8F/README.html#4--demos3---在-svg-上应用-css-中的动画过渡效果---2)
  - 不是很重要，快速过～
  

### 6.3. svg + js

- [ ] [0022. 使用 js 控制 svg 实现 CRUD 操作](https://tdahuyou.github.io/notes/notes/svg/0022.%20%E4%BD%BF%E7%94%A8%20js%20%E6%8E%A7%E5%88%B6%20svg%20%E5%AE%9E%E7%8E%B0%20CRUD%20%E6%93%8D%E4%BD%9C/README.html) <!-- [locale](./0022.%20%E4%BD%BF%E7%94%A8%20js%20%E6%8E%A7%E5%88%B6%20svg%20%E5%AE%9E%E7%8E%B0%20CRUD%20%E6%93%8D%E4%BD%9C/README.html) -->  
  - [1. 🔗 snapsvg](https://tdahuyou.github.io/notes/notes/svg/0022.%20%E4%BD%BF%E7%94%A8%20js%20%E6%8E%A7%E5%88%B6%20svg%20%E5%AE%9E%E7%8E%B0%20CRUD%20%E6%93%8D%E4%BD%9C/README.html#1--snapsvg)
  - [2. 💻 demos.1 - 使用 js 控制 svg 实现 CRUD 操作](https://tdahuyou.github.io/notes/notes/svg/0022.%20%E4%BD%BF%E7%94%A8%20js%20%E6%8E%A7%E5%88%B6%20svg%20%E5%AE%9E%E7%8E%B0%20CRUD%20%E6%93%8D%E4%BD%9C/README.html#2--demos1---使用-js-控制-svg-实现-crud-操作)
  - [3. 🤔 问：CRUD 是什么？](https://tdahuyou.github.io/notes/notes/svg/0022.%20%E4%BD%BF%E7%94%A8%20js%20%E6%8E%A7%E5%88%B6%20svg%20%E5%AE%9E%E7%8E%B0%20CRUD%20%E6%93%8D%E4%BD%9C/README.html#3--问crud-是什么)
  - 本节的都是一些非常简单的 js 逻辑，快速过一遍即可。
    - 注意点：在读写 svg 标签的属性值的时候（比如 circle 元素的圆心 cx、cy，半径 r），不能直接 `circle.r = xxx` 的方式操作属性，应该使用 `circle.setAttribute(r, xxx)` 和 `svg.getAttribute(r)` 方法操作属性。
  - 实际在使用 js 来管理 svg 时，一般会使用一些现成的库，比如 [snapsvg](http://snapsvg.io/)。
  - 如果不清楚 CRUD 是什么，可以见结尾的 Q&A。
  

## 7. 练习

- 0013
- 0023
- 0036
- 0037


- [ ] [0033. 简易动态坐标系制作](https://tdahuyou.github.io/notes/notes/svg/0033.%20%E7%AE%80%E6%98%93%E5%8A%A8%E6%80%81%E5%9D%90%E6%A0%87%E7%B3%BB%E5%88%B6%E4%BD%9C/README.html) <!-- [locale](./0033.%20%E7%AE%80%E6%98%93%E5%8A%A8%E6%80%81%E5%9D%90%E6%A0%87%E7%B3%BB%E5%88%B6%E4%BD%9C/README.html) -->  
  - [1. 📒 notes](https://tdahuyou.github.io/notes/notes/svg/0033.%20%E7%AE%80%E6%98%93%E5%8A%A8%E6%80%81%E5%9D%90%E6%A0%87%E7%B3%BB%E5%88%B6%E4%BD%9C/README.html#1--notes)
  

- [ ] [0039. 【练习】绘制静态折线图](https://tdahuyou.github.io/notes/notes/svg/0039.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E9%9D%99%E6%80%81%E6%8A%98%E7%BA%BF%E5%9B%BE/README.html) <!-- [locale](./0039.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E9%9D%99%E6%80%81%E6%8A%98%E7%BA%BF%E5%9B%BE/README.html) -->  
  - [1. 📒 notes](https://tdahuyou.github.io/notes/notes/svg/0039.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E9%9D%99%E6%80%81%E6%8A%98%E7%BA%BF%E5%9B%BE/README.html#1--notes)
  

- [ ] [0038. 【练习】绘制动态折线图](https://tdahuyou.github.io/notes/notes/svg/0038.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E5%8A%A8%E6%80%81%E6%8A%98%E7%BA%BF%E5%9B%BE/README.html) <!-- [locale](./0038.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E5%8A%A8%E6%80%81%E6%8A%98%E7%BA%BF%E5%9B%BE/README.html) -->  
  - [1. 📒 notes](https://tdahuyou.github.io/notes/notes/svg/0038.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E5%8A%A8%E6%80%81%E6%8A%98%E7%BA%BF%E5%9B%BE/README.html#1--notes)
  

- [ ] [0040. 【练习】绘制柱状图](https://tdahuyou.github.io/notes/notes/svg/0040.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E6%9F%B1%E7%8A%B6%E5%9B%BE/README.html) <!-- [locale](./0040.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E6%9F%B1%E7%8A%B6%E5%9B%BE/README.html) -->  
  - [1. 📒 notes](https://tdahuyou.github.io/notes/notes/svg/0040.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E6%9F%B1%E7%8A%B6%E5%9B%BE/README.html#1--notes)
  

- [ ] [0042. 【练习】绘制静态的饼图](https://tdahuyou.github.io/notes/notes/svg/0042.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E9%9D%99%E6%80%81%E7%9A%84%E9%A5%BC%E5%9B%BE/README.html) <!-- [locale](./0042.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E9%9D%99%E6%80%81%E7%9A%84%E9%A5%BC%E5%9B%BE/README.html) -->  
  - [1. 📒 notes](https://tdahuyou.github.io/notes/notes/svg/0042.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E9%9D%99%E6%80%81%E7%9A%84%E9%A5%BC%E5%9B%BE/README.html#1--notes)
  

- [ ] [0041. 【练习】绘制动态饼图](https://tdahuyou.github.io/notes/notes/svg/0041.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E5%8A%A8%E6%80%81%E9%A5%BC%E5%9B%BE/README.html) <!-- [locale](./0041.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E5%8A%A8%E6%80%81%E9%A5%BC%E5%9B%BE/README.html) -->  
  - [1. 📒 notes](https://tdahuyou.github.io/notes/notes/svg/0041.%20%E3%80%90%E7%BB%83%E4%B9%A0%E3%80%91%E7%BB%98%E5%88%B6%E5%8A%A8%E6%80%81%E9%A5%BC%E5%9B%BE/README.html#1--notes)
  

## 8. ⏰ 待分组

- [x] [0049. empty](https://tdahuyou.github.io/notes/notes/svg/0049.%20empty/README.html) <!-- [locale](./0049.%20empty/README.html) -->
