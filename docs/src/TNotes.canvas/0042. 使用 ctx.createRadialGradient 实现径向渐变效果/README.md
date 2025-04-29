# [0042. 使用 ctx.createRadialGradient 实现径向渐变效果](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0042.%20%E4%BD%BF%E7%94%A8%20ctx.createRadialGradient%20%E5%AE%9E%E7%8E%B0%E5%BE%84%E5%90%91%E6%B8%90%E5%8F%98%E6%95%88%E6%9E%9C)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 🔗 links](#2--links)
- [3. 💻 demo1](#3--demo1)

<!-- endregion:toc -->

## 1. 📝 简介

ctx.createRadialGradient 用于创建径向渐变（或称为放射状渐变）。
`createRadialGradient(x0, y0, r0, x1, y1, r1)`
- `x0, y0, r0` 圆1
- `x1, y1, r1` 圆2
从圆 1 的边缘开始渐变到圆 2 的边缘。

## 2. 🔗 links

- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient - MDN - `ctx.createRadialGradient`。

## 3. 💻 demo1

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      canvas {
        border: 1px solid #888;
        margin-right: 5px;
      }
    </style>
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      // createRadialGradient(x0, y0, r0, x1, y1, r1)
      // x0, y0, r0: 渐变的起点坐标和半径
      // x1, y1, r1: 渐变的终点坐标和半径

      // 注意：两个圆是包含关系。
      // 即一个圆在另一个圆的内部。

      {
        const canvas = document.createElement('canvas')
        drawGrid(canvas, 400, 400, 50)
        document.body.append(canvas)
        const ctx = canvas.getContext('2d')

        ctx.beginPath()
        ctx.globalAlpha = 0.8

        const gradient = ctx.createRadialGradient(200, 200, 50, 200, 200, 100)
        // 表示从 (200, 200) 半径为 50 的圆开始渐变
        // 到 (200, 200) 半径为 100 的圆结束渐变

        gradient.addColorStop(0, 'red')
        // 表示渐变的起点颜色为红色
        gradient.addColorStop(0.9, 'yellow')
        // 表示渐变到 90% 的位置时的颜色为黄色
        gradient.addColorStop(1, 'black')
        // 表示渐变的终点颜色为黑色

        ctx.fillStyle = gradient

        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.stroke()
        ctx.fill()
      }

      {
        const canvas = document.createElement('canvas')
        drawGrid(canvas, 400, 400, 50)
        document.body.append(canvas)
        const ctx = canvas.getContext('2d')

        ctx.beginPath()
        ctx.globalAlpha = 0.8

        const gradient = ctx.createRadialGradient(200, 200, 100, 200, 200, 50)
        // 表示从 (200, 200) 半径为 100 的圆开始渐变
        // 到 (200, 200) 半径为 50 的圆结束渐变

        gradient.addColorStop(0, 'red')
        gradient.addColorStop(0.9, 'yellow')
        gradient.addColorStop(1, 'black')
        ctx.fillStyle = gradient

        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.stroke()
        ctx.fill()
      }
    </script>
  </body>
</html>
```

![](assets/2024-10-04-12-01-09.png)
