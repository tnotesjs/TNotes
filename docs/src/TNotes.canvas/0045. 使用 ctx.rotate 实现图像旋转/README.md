# [0045. 使用 ctx.rotate 实现图像旋转](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0045.%20%E4%BD%BF%E7%94%A8%20ctx.rotate%20%E5%AE%9E%E7%8E%B0%E5%9B%BE%E5%83%8F%E6%97%8B%E8%BD%AC)

<!-- region:toc -->

- [1. 🔗 links](#1--links)
- [2. 📒 notes](#2--notes)
- [3. 💻 demo1](#3--demo1)
- [4. 💻 demo2](#4--demo2)

<!-- endregion:toc -->


## 1. 🔗 links

- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate - MDN - CanvasRenderingContext2D：rotate() 方法。

## 2. 📒 notes

ctx.rotate 用于旋转画布的当前绘图。

**注意：**
1. 旋转不会对之前绘制好的内容有影响。
2. 旋转的角度单位是弧度。
3. 旋转默认是基于画布的原点来旋转的。
4. 这种旋转会影响到之后所有的绘制操作，直到画布的变换状态被重置或者再次修改。
5. 每次的旋转都是基于当前的坐标轴已旋转的角度进一步旋转的。

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
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      // ctx.rotate 用于旋转画布的当前绘图。

      // 注意：
      // 1. 旋转不会对之前绘制好的内容有影响。
      // 2. 旋转的角度单位是弧度。
      // 3. 旋转默认是基于画布的原点来旋转的。
      // 4. 这种旋转会影响到之后所有的绘制操作，直到画布的变换状态被重置或者再次修改。
      // 5. 每次的旋转都是基于当前的坐标轴已旋转的角度进一步旋转的。

      const canvas = document.createElement('canvas')
      drawGrid(canvas, 300, 300, 50)
      document.body.append(canvas)
      const ctx = canvas.getContext('2d')

      ctx.beginPath()
      ctx.globalAlpha = 0.5

      ctx.fillStyle = 'red'
      ctx.rect(50, 50, 50, 50)
      ctx.fill()

      // 坐标轴旋转 0°
      // 在 (200, 50) 位置绘制一个圆
      ctx.beginPath()
      ctx.arc(200, 50, 10, 0, Math.PI * 2)
      ctx.fill()

      // 坐标轴旋转 10°
      // 坐标旋转 10° 再绘制一个圆
      ctx.rotate(10 * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(200, 50, 10, 0, Math.PI * 2)
      ctx.fill()

      // 坐标轴旋转 20°
      // 坐标旋转 10° 再绘制一个圆
      ctx.rotate(10 * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(200, 50, 10, 0, Math.PI * 2)
      ctx.fill()

      // 坐标轴旋转 30°
      // 坐标旋转 10° 再绘制一个圆
      ctx.rotate(10 * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(200, 50, 10, 0, Math.PI * 2)
      ctx.fill()

      // 坐标轴旋转 40°
      // 坐标旋转 10° 再绘制一个圆
      ctx.rotate(10 * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(200, 50, 10, 0, Math.PI * 2)
      ctx.fill()

      // 坐标轴旋转 50°
      // 坐标旋转 10° 再绘制一个圆
      ctx.rotate(10 * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(200, 50, 10, 0, Math.PI * 2)
      ctx.fill()

      // 坐标轴旋转 60°
      // 坐标旋转 10° 再绘制一个圆
      ctx.rotate(10 * Math.PI / 180)
      ctx.beginPath()
      ctx.arc(200, 50, 10, 0, Math.PI * 2)
      ctx.fill()
    </script>
  </body>
</html>
```

![](assets/2024-10-04-15-03-44.png)

## 4. 💻 demo2

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
      // 需求描述：
      // 画布上有一个正方形，请通过 ctx.rotate 旋转，将这个正方形变为菱形。
      // 要求正方形中心位置和旋转后得到的菱形的中心位置是一样的。
      const canvas = document.createElement('canvas')
      drawGrid(canvas, 150, 150, 50)
      document.body.append(canvas)
      const ctx = canvas.getContext('2d')

      ctx.beginPath()

      // 假设正方形绘制在 (50, 50) 位置，宽高为 50。
      ctx.strokeStyle = 'red'
      ctx.setLineDash([10])
      ctx.strokeRect(50, 50, 50, 50)

      // 1. 将坐标轴的原点设置为旋转矩形的中心
      ctx.translate(75, 75)
      // 2. 坐标轴旋转 45°
      ctx.rotate(45 * Math.PI / 180)

      ctx.fillStyle = 'blue'
      // 3. 绘制矩形
      ctx.rect(50 - 75, 50 - 75, 50, 50)
      // 注意：
      // 坐标轴的位置发生了变化
      // 如果想要在原始图形的中心绘制菱形，需要将矩形的位置设置为 (-25, -25)
      // 这是基于原始图形的位置和坐标偏移位置计算出来的结果 (50 - 75, 50 - 75)
      ctx.fill()
    </script>
  </body>
</html>
```

![](assets/2024-10-04-15-03-54.png)
