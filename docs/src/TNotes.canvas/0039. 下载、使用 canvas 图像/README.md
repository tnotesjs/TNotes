# [0039. 下载、使用 canvas 图像](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0039.%20%E4%B8%8B%E8%BD%BD%E3%80%81%E4%BD%BF%E7%94%A8%20canvas%20%E5%9B%BE%E5%83%8F)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 💻 demo1](#2--demo1)

<!-- endregion:toc -->

## 1. 📝 简介

canvas 本身也是图像，可以被下载，可以被引用。
通过一个示例，加深对 canvas 的理解，你可以将其就看做是一个白色的图片，然后通过 canvas 提供的一些 API 在这个白色的图片上绘图，绘图完毕后你可以下载这张图片，也可以引用这张图进行二次创作。

## 2. 💻 demo1

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
        display: block;
        margin-top: 2rem;
      }
    </style>
  </head>
  <body>
    <div>
      <button id="bnt-1">下载 canvas 1</button>
      <button id="bnt-2">下载 canvas 2</button>
      <button id="bnt-3">下载 canvas 3</button>
    </div>
    <script>
      let canvas1
      let canvas2
      let canvas3

      // 【canvas1】
      // 使用 canvas 绘制一个 靶心图标 🎯
      // 可以将其视作一张图片
      // 这张图片可以被下载，也可以被另一个 canvas 绘制。
      {
        canvas1 = document.createElement('canvas')
        canvas1.width = 200
        canvas1.height = 200
        document.body.append(canvas1)

        const ctx = canvas1.getContext('2d')

        // 同心圆
        for (let i = 1; i <= 5; i++) {
          ctx.beginPath()
          ctx.arc(100, 100, 20 * i, 0, Math.PI * 2)
          ctx.stroke()
        }

        // 横线
        ctx.beginPath()
        ctx.moveTo(0, 100)
        ctx.lineTo(200, 100)
        ctx.stroke()

        // 竖线
        ctx.beginPath()
        ctx.moveTo(100, 0)
        ctx.lineTo(100, 200)
        ctx.stroke()
      }

      // 【canvas2】
      // 将 canvas1 图像的一部分，绘制到 canvas2 上。
      {
        canvas2 = document.createElement('canvas')
        canvas2.width = 400
        canvas2.height = 400
        document.body.append(canvas2)
        const ctx = canvas2.getContext('2d')

        ctx.drawImage(canvas1, 0, 0, 100, 100, 150, 150, 100, 100)
        // canvas1 也是图片，所以可以使用 drawImage 方法绘制到 canvas2 上。
      }

      // 【canvas3】
      // 使用 canvas 绘制一张图片。
      {
        const canvas = document.createElement('canvas')
        canvas3 = canvas
        canvas.width = 800
        canvas.height = 400
        document.body.append(canvas)

        const ctx = canvas.getContext('2d')

        const img = new Image()
        img.src = './week.png'
        img.onload = function () {
          ctx.drawImage(img, 0, 0, 600, 300)
        }
      }

      // 【绑定下载的点击事件】
      // 注意：需要使用服务器环境（open with live server）打开，否则在下载 canvas3 时会报跨域错误。
      {
        const bnt1 = document.getElementById('bnt-1')
        bnt1.onclick = function () {
          const url = canvas1.toDataURL()
          const a = document.createElement('a')
          a.href = url
          a.download = 'canvas1'
          a.click()
        }

        const bnt2 = document.getElementById('bnt-2')
        bnt2.onclick = function () {
          const url = canvas2.toDataURL()
          const a = document.createElement('a')
          a.href = url
          a.download = 'canvas2'
          a.click()
        }

        const bnt3 = document.getElementById('bnt-3')
        bnt3.onclick = function () {
          const url = canvas3.toDataURL()

          const a = document.createElement('a')
          a.href = url
          a.download = 'canvas3'
          a.click()
        }
      }
    </script>
  </body>
</html>
```

![](assets/2024-10-04-11-56-45.png)
