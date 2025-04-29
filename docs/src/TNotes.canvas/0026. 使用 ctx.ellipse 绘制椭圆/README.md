# [0026. 使用 ctx.ellipse 绘制椭圆](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0026.%20%E4%BD%BF%E7%94%A8%20ctx.ellipse%20%E7%BB%98%E5%88%B6%E6%A4%AD%E5%9C%86)


<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 💻 demo1](#2--demo1)

<!-- endregion:toc -->

## 1. 📝 简介


- 学会使用 ctx.ellipse 绘制椭圆，它和绘制圆弧是很类似的。
可以对比着圆弧【0024】的绘制原理来理解椭圆的绘制。

## 2. 💻 demo1

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>📝 绘制椭圆</title>
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

      // 绘制椭圆的方法：
      // ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise)

      // x y 表示椭圆中心的坐标。

      // radiusX radiusY 椭圆的主/次半径
      // 也就是椭圆的宽度/高度方向的半径

      // rotation 椭圆的旋转角度

      // startAngle/endAngle 绘制椭圆弧的起始/结束角度
      // 角度的计算以椭圆的主轴方向为起点。（默认 0 度，三点钟 🕒 方向。）

      // counterclockwise 这是一个可选参数，用于指定绘制方向。
      // true  按逆时针方向绘制弧线
      // false 按顺时针方向绘制（默认值）

      // 注意：传递参数时，传递的是弧度而非角度。

      ctx.beginPath()
      ctx.ellipse(200, 100, 100, 50, 0, 0, Math.PI * 2)
      // 200, 100        表示椭圆中心的坐标是 (200, 100)
      // 100, 50         表示椭圆的主半径是 100，次半径是 50
      // 0               表示椭圆的旋转角度是 0
      // 0 Math.PI * 2   表示椭圆弧的起始角度是 0，结束角度是 2π，即 360°。也就是一个完整的圆。
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(100, 300, 100, 50, Math.PI / 2, 0, Math.PI * 2)
      // 100, 300        表示椭圆中心的坐标是 (100, 300)
      // 100, 50         表示椭圆的主半径是 100，次半径是 50
      // Math.PI / 2     表示椭圆的旋转角度是 π/2，即 90°
      // 0 Math.PI * 2   表示椭圆弧的起始角度是 0，结束角度是 2π，即 360°。也就是一个完整的圆。
      ctx.stroke()

      ctx.beginPath()
      ctx.ellipse(350, 300, 100, 50, 0, 0, Math.PI / 2, true)
      // 350, 300        表示椭圆中心的坐标是 (350, 300)
      // 100, 50         表示椭圆的主半径是 100，次半径是 50
      // 0               表示椭圆的旋转角度是 0
      // 0 Math.PI / 2   表示椭圆弧的起始角度是 0，结束角度是 π/2，即 90°。
      //                 这意味着可能是一个 1/4 或者 3/4 的圆
      //                 如果按照顺时针方向绘制，那么是 1/4 的圆
      //                 如果按照逆时针方向绘制，那么是 3/4 的圆
      // true            表示按照逆时针方向绘制弧线
      ctx.stroke()
    </script>
  </body>
</html>
```

![](assets/2024-10-04-10-57-32.png)
