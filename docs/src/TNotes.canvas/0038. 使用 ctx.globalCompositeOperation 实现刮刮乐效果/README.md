# [0038. 使用 ctx.globalCompositeOperation 实现刮刮乐效果](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0038.%20%E4%BD%BF%E7%94%A8%20ctx.globalCompositeOperation%20%E5%AE%9E%E7%8E%B0%E5%88%AE%E5%88%AE%E4%B9%90%E6%95%88%E6%9E%9C)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 💻 demo1](#2--demo1)

<!-- endregion:toc -->

## 1. 📝 简介

看懂实现原理即可。
这个效果挺好玩的，不过想要监听结果如何出现，不太容易。
**最终效果展示：**
![](assets/使用%20ctx.globalCompositeOperation%20实现刮刮乐效果.gif)

## 2. 💻 demo1

```css
/* 1.css */
/*
使用绝对定位的方式
让结果和 canvas 绘制在同一块区域
 */
canvas {
  border: 1px solid #ccc;
  margin-right: 5px;
  position: absolute;
}

#result {
  width: 300px;
  height: 200px;
  text-align: center;
  line-height: 200px;
  font-size: 3rem;
  position: absolute;

  /* 防止文本内容被选中 */
  user-select: none;
}
```

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./1.css">
    <title>Document</title>
  </head>
  <body>
    <div id="result">谢谢惠顾</div>
    <script>
      const canvas = document.createElement('canvas')
      canvas.width = 300
      canvas.height = 200
      document.body.append(canvas)

      const ctx = canvas.getContext('2d')

      // 绘制填充矩形，将结果盖住。
      ctx.beginPath()
      ctx.fillStyle = '#ccc'
      ctx.fillRect(0, 0, 300, 200)

      ctx.globalCompositeOperation = 'destination-out'
      // destination-out 旧图形只在与新图形不重叠的部分显示。
      // 这意味着如果在旧图形上绘制新图形，重叠的部分会被删除。

      ctx.beginPath()
      // ctx.strokeStyle = '#fff' // 这里是否设置颜色都可以
      ctx.lineWidth = 20
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      canvas.onmousedown = function (e) {
        ctx.moveTo(e.offsetX, e.offsetY)

        // 按下鼠标之后就不断地画线
        canvas.onmousemove = function (e) {
          ctx.lineTo(e.offsetX, e.offsetY)
          ctx.stroke()
        }

        canvas.onmouseup = canvas.onmouseout = function () {
          canvas.onmousemove = null
          canvas.onmouseout = null
        }
      }
    </script>
  </body>
</html>
```

![](assets/使用%20ctx.globalCompositeOperation%20实现刮刮乐效果.gif)
