# [0009. 使用 ctx.lineDashOffset 设置虚线的偏移量](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0009.%20%E4%BD%BF%E7%94%A8%20ctx.lineDashOffset%20%E8%AE%BE%E7%BD%AE%E8%99%9A%E7%BA%BF%E7%9A%84%E5%81%8F%E7%A7%BB%E9%87%8F)

<!-- region:toc -->

- [1. 📒 notes](#1--notes)
- [2. 💻 demo](#2--demo)

<!-- endregion:toc -->

## 1. 📒 notes

`lineDashOffset` 这个属性常用于实现线条相关的动画效果。有不少跟 **线条移动相关的动画**，就是使用这个属性来实现的。

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

      // ctx.lineDashOffset 属性，用于设置虚线起始位置的偏移量。

      // 正数，向左偏移 ←
      // 负数，向右偏移 →

      // 偏移后的图形，如果超出了边界，那么会自动被截断隐藏。

      ctx.beginPath()
      ctx.setLineDash([50])
      ctx.moveTo(50, 100)
      ctx.lineTo(450, 100)
      ctx.stroke()

      ctx.beginPath()
      ctx.setLineDash([50])
      ctx.lineDashOffset = -50 // 向右偏移 →
      ctx.moveTo(50, 200)
      ctx.lineTo(450, 200)
      ctx.stroke()

      ctx.beginPath()
      ctx.setLineDash([50])
      ctx.lineDashOffset = 20 // 向左偏移 ←
      ctx.moveTo(50, 300)
      ctx.lineTo(450, 300)
      ctx.stroke()
    </script>
  </body>
</html>
```

一共 3 根线：
- 第 1 根线作为参考
- 第 2 根线向右偏移 50 个单位
- 第 3 根线向左偏移 20 个单位

这 3 根线绘制的横向（x 轴）有效区域是 [50, 450]，越界的部分将会自动截断隐藏。

![](assets/2024-10-03-23-07-43.png)
