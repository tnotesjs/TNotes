# [0015. 使用 ctx.font 设置字体样式](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0015.%20%E4%BD%BF%E7%94%A8%20ctx.font%20%E8%AE%BE%E7%BD%AE%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 💻 demo](#2--demo)

<!-- endregion:toc -->

## 1. 📝 简介

- 知道 `ctx.font` 属性有什么用
- 知道 `ctx.font` 属性值的书写规则是什么

## 2. 💻 demo

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>绘制文本</title>
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      const cavnas = document.createElement('canvas')
      drawGrid(cavnas, 500, 500, 50)
      document.body.appendChild(cavnas)
      const ctx = cavnas.getContext('2d')

      // MDN DOC：
      // ctx.font - https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font
      // css font - https://developer.mozilla.org/en-US/docs/Web/CSS/font

      // ctx.font 属性
      // 描述绘制文字时，当前字体样式的属性。
      // 使用和 CSS font 规范相同的字符串值。

      // ctx.font 的值通常按照以下顺序和格式设置：
      // 1. 字体样式  font-style     可选项     如 italic, normal 或 oblique
      // 2. 字体变体  font-variant   可选项     如 small-caps
      // 3. 字体粗细  font-weight    可选项     如 bold, 100, 300 等
      // 4. 字体大小  font-size      必需项     通常以 px, pt, em 等单位表示
      // 5. 行高     line-height    可选项     通常与字体大小一起设置，如 16px/1.5
      // 6. 字体族名  font-family    必需项     可以是具体的字体名称如 Arial，或通用字体族如 serif, sans-serif

      // 其中只有字体的大小和字体的类型是必填项，其他的都是可选项。

      ctx.font = 'bold italic 4rem sans-serif'
      // bold       表示粗体
      // italic     表示斜体
      // 4rem       表示字体大小
      // sans-serif 表示字体

      ctx.fillText('Tdahuyou', 200, 200)
      // 'Tdahuyou'   表示要绘制的文本
      // 200          表示文本的 x 坐标
      // 200          表示文本的 y 坐标
    </script>
  </body>
</html>
```

![](assets/2024-10-03-23-18-51.png)
