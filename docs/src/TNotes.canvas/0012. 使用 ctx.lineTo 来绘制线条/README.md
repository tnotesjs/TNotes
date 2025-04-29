# [0012. 使用 ctx.lineTo 来绘制线条](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0012.%20%E4%BD%BF%E7%94%A8%20ctx.lineTo%20%E6%9D%A5%E7%BB%98%E5%88%B6%E7%BA%BF%E6%9D%A1)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 💻 demo1](#2--demo1)
- [3. 💻 demo2](#3--demo2)

<!-- endregion:toc -->

## 1. 📝 简介

- 学会使用 `ctx.lineTo` 来绘制线条。

## 2. 💻 demo1

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      const cavnas = document.createElement('canvas')
      drawGrid(cavnas, 500, 500, 50)
      document.body.appendChild(cavnas)
      const ctx = cavnas.getContext('2d')
      ctx.beginPath()

      ctx.moveTo(100, 100) // 表示从哪个点开始画
      ctx.lineTo(300, 100) // 表示画到哪个点
      ctx.stroke() // 开始画线
      // 默认情况下，线的颜色是黑色，线的粗细是 1 个单位

      ctx.beginPath()
      ctx.strokeStyle = 'red' // 表示线的颜色设置为红色
      ctx.lineWidth = 100 // 表示线的粗细设置为 100 个单位（以绘制的路径为中心，向两端各扩散 lineWidth / 2 也就是 50 个单位）
      ctx.moveTo(100, 200)
      ctx.lineTo(300, 200)
      ctx.stroke()
    </script>
  </body>
</html>
```

![](assets/2024-10-03-23-13-29.png)

## 3. 💻 demo2

```html
<!-- 2.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      const cavnas = document.createElement('canvas')
      drawGrid(cavnas, 500, 500, 50)
      document.body.appendChild(cavnas)
      const ctx = cavnas.getContext('2d')
      ctx.beginPath()

      // 画一个 Z 字形
      ctx.moveTo(100, 100)

      // 经过下面这些点，画出一个 Z 字形
      ctx.lineTo(200, 100)
      ctx.lineTo(100, 200)
      ctx.lineTo(200, 200)

      ctx.stroke()
    </script>
  </body>
</html>
```

![](assets/2024-10-03-23-13-41.png)
