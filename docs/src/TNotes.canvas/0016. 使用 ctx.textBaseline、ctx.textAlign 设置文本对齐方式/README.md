# [0016. 使用 ctx.textBaseline、ctx.textAlign 设置文本对齐方式](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0016.%20%E4%BD%BF%E7%94%A8%20ctx.textBaseline%E3%80%81ctx.textAlign%20%E8%AE%BE%E7%BD%AE%E6%96%87%E6%9C%AC%E5%AF%B9%E9%BD%90%E6%96%B9%E5%BC%8F)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 🔗 links](#2--links)
- [3. 💻 demo1](#3--demo1)
- [4. 💻 demo2](#4--demo2)

<!-- endregion:toc -->

## 1. 📝 简介

- ctx.textBaseline 设置文本的 **垂直** 对齐方式
- ctx.textAlign 设置文本的 **水平** 对齐方式

## 2. 🔗 links

- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline - MDN，textBaseline 设置文本的 垂直 对齐方式。
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign - MDN，textAlign 设置文本的 水平 对齐方式。


## 3. 💻 demo1

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ctx.textAlign</title>
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      const cavnas = document.createElement('canvas')
      drawGrid(cavnas, 500, 500, 50)
      document.body.appendChild(cavnas)
      const ctx = cavnas.getContext('2d')

      // MDN DOC textAlign
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textAlign

      // ctx.textAlign 属性用于设置文本基于锚点的水平位置。

      // 常用属性值：
      // left   文本在锚点的左侧
      // right  文本在锚点的右侧
      // center 文本在锚点的中心

      ctx.textAlign = 'center' // 水平居中对齐

      ctx.font = '4rem sans-serif'
      ctx.fillText('Tdahuyou', 200, 200)

      // 锚点
      ctx.beginPath()
      ctx.fillStyle = 'red'
      ctx.arc(200, 200, 8, 0, Math.PI * 2)
      ctx.fill()
    </script>
  </body>
</html>
```

![](assets/2024-10-03-23-20-10.png)

## 4. 💻 demo2

```html
<!-- 2.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ctx.textBaseline</title>
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      const cavnas = document.createElement('canvas')
      drawGrid(cavnas, 500, 500, 50)
      document.body.appendChild(cavnas)
      const ctx = cavnas.getContext('2d')

      // MDN DOC textBaseline
      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textBaseline

      // ctx.textBaseline 属性用于设置文本基于锚点的垂直位置。

      // 常用属性值：
      // top    文本的顶部与指定的 y 坐标对齐。
      // middle 文本的中点与指定的 y 坐标对齐。
      // bottom 文本的底部与指定的 y 坐标对齐。

      ctx.textBaseline = 'middle' // 垂直居中对齐
     ctx.textAlign = 'center' // 水平居中对齐

      ctx.font = '4rem sans-serif'
      ctx.fillText('Tdahuyou', 200, 200)

      // 锚点
      ctx.beginPath()
      ctx.fillStyle = 'red'
      ctx.arc(200, 200, 8, 0, Math.PI * 2)
      ctx.fill()
    </script>
  </body>
</html>
```

![](assets/2024-10-03-23-20-23.png)
