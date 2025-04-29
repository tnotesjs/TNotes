# [0010. 使用 ctx.setLineDash 设置虚线](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0010.%20%E4%BD%BF%E7%94%A8%20ctx.setLineDash%20%E8%AE%BE%E7%BD%AE%E8%99%9A%E7%BA%BF)

<!-- region:toc -->

- [1. 📒 notes](#1--notes)
- [2. 💻 demo](#2--demo)

<!-- endregion:toc -->

## 1. 📒 notes

学会使用 `ctx.setLineDash` 设置虚线，它会根据我们传入的参数数量不同，选择使用不同的行为来设置虚线之间的间隙。

## 2. 💻 demo

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

      ctx.lineWidth = 10
      ctx.strokeStyle = 'red'

      // ctx.setLineDash(array) 方法，用于设置虚线。
      // 其中参数 array 中的数值含义：线段的长度、线段间留白的长度。

      ctx.beginPath()
      ctx.setLineDash([50])
      // 线段长度：50
      // 留白长度：50
      ctx.moveTo(50, 100)
      ctx.lineTo(450, 100)
      ctx.stroke()

      ctx.beginPath()
      ctx.setLineDash([50, 20])
      // 线段长度：50
      // 留白长度：20
      ctx.moveTo(50, 200)
      ctx.lineTo(450, 200)
      ctx.stroke()

      ctx.beginPath()
      ctx.setLineDash([10, 20, 30])
      // 按照数组的数列，无限的延续下去。
      // 【1】数字 10, 20, 30 无限重复     10       20      30        10       20       30        10       20  ...
      // 【2】线段、留白，无限重复          线段     留白     线段      留白      线段      留白      线段      留白  ...
      // 【1】+【2】匹配后的结果           线段10  留白20   线段30    留白10    线段20    留白30    线段10    留白20 ...
      ctx.moveTo(50, 300)
      ctx.lineTo(450, 300)
      ctx.stroke()
    </script>
  </body>
</html>
```

![](assets/2024-10-03-23-08-48.png)
