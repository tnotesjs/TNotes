# [0043. 给图像添加阴影](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0043.%20%E7%BB%99%E5%9B%BE%E5%83%8F%E6%B7%BB%E5%8A%A0%E9%98%B4%E5%BD%B1)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 🔗 links](#2--links)
- [3. 📒 notes](#3--notes)
- [4. 💻 demo1](#4--demo1)
- [5. 💻 demo2](#5--demo2)

<!-- endregion:toc -->

## 1. 📝 简介

跟 css 中的 box-shadow 类似，都可以用于给盒子添加阴影。在 canvas 中，可以给阴影添加颜色ctx.shadowColor、模糊半径shadowBlur、偏移shadowOffsetX、shadowOffsetY。

## 2. 🔗 links

- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetY
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowOffsetX
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowBlur
- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/shadowColor

## 3. 📒 notes

shadowColor 设置阴影的颜色。

shadowBlur 设置阴影的模糊程度。值越大，阴影越模糊。

shadowOffsetX 和 shadowOffsetY 属性用于设置阴影的偏移量。

## 4. 💻 demo1

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      // shadowColor: 阴影的颜色
      // shadowBlur: 阴影的模糊程度。值越大，阴影越模糊。

      const canvas = document.createElement('canvas')
      drawGrid(canvas, 400, 400, 50)
      document.body.append(canvas)
      const ctx = canvas.getContext('2d')

      ctx.beginPath()

      ctx.shadowColor = 'yellow'
      // 表示阴影的颜色为黄色

      ctx.shadowBlur = 100
      // 表示阴影的模糊程度为 100

      ctx.fillStyle = 'red'
      ctx.arc(200, 200, 100, 0, Math.PI * 2)
      ctx.fill()
    </script>
  </body>
</html>
```

![](assets/2024-10-04-12-02-11.png)

## 5. 💻 demo2

```html
<!-- 2.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      const canvas = document.createElement('canvas')
      drawGrid(canvas, 400, 400, 50)
      document.body.append(canvas)
      const ctx = canvas.getContext('2d')

      ctx.beginPath()
      ctx.shadowColor = '#888' // 阴影的颜色为灰色
      ctx.shadowBlur = 15

      // shadowOffsetX 和 shadowOffsetY 属性用于设置阴影的偏移量。
      ctx.shadowOffsetX = 8
      ctx.shadowOffsetY = 8

      // 创建一个径向渐变
      const gradient = ctx.createRadialGradient(170, 170, 30, 200, 200, 100)
      // 170, 170, 30 表示渐变的起点是一个圆心为 (170, 170) 半径为 30 的圆。
      // 200, 200, 100 表示渐变的终点是一个圆心为 (200, 200) 半径为 100 的圆。
      gradient.addColorStop(0, 'rgb(221, 0, 0)') // 开始位置更亮红
      gradient.addColorStop(1, 'rgb(136, 0, 0)') // 结束位置更黑红

      ctx.fillStyle = gradient
      ctx.arc(200, 200, 100, 0, Math.PI * 2)
      ctx.fill()

      // 模拟场景：
      // 光源在左上角，阴影在右下角。
    </script>
  </body>
</html>
```

![](assets/2024-10-04-12-02-24.png)
