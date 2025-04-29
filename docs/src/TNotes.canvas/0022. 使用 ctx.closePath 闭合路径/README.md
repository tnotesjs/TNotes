# [0022. 使用 ctx.closePath 闭合路径](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0022.%20%E4%BD%BF%E7%94%A8%20ctx.closePath%20%E9%97%AD%E5%90%88%E8%B7%AF%E5%BE%84)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 💻 demo1 - 自动闭合 vs. 手动闭合](#2--demo1---自动闭合-vs-手动闭合)
- [3. 💻 demo2 - 注意 `lineWidth`](#3--demo2---注意-linewidth)

<!-- endregion:toc -->

## 1. 📝 简介

了解手动闭合和自动闭合之间的区别。通过示例，了解路径如果没有设置自动闭合的话，可能会导致什么问题。

## 2. 💻 demo1 - 自动闭合 vs. 手动闭合

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

      // 设置线条和填充样式
      ctx.lineWidth = 20
      ctx.strokeStyle = 'red'
      ctx.fillStyle = 'yellow'

      // 多个连续线条构成的区域，是可以使用 fill() 进行填充的。
      // 如果需要首尾节点自动闭合，可以使用 ctx.closePath() 方法。
      ctx.beginPath()
      ctx.moveTo(50, 50)
      ctx.lineTo(50, 150)
      ctx.lineTo(150, 150)
      ctx.lineTo(50, 50) // 手动闭合
      ctx.stroke()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(200, 200)
      ctx.lineTo(200, 300)
      ctx.lineTo(300, 300)
      ctx.closePath() // 自动闭合
      ctx.stroke()
      ctx.fill()
    </script>
  </body>
</html>
```

![](assets/2024-10-04-00-49-40.png)

## 3. 💻 demo2 - 注意 `lineWidth`

```html
<!-- 2.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>demo</title>
  </head>
  <body>
    <script src="./drawGrid.js"></script>
    <script>
      const cavnas = document.createElement('canvas')
      drawGrid(cavnas, 500, 500, 50)
      document.body.appendChild(cavnas)
      const ctx = cavnas.getContext('2d')

      // 设置线条和填充样式
      ctx.lineWidth = 10
      ctx.strokeStyle = 'red'
      ctx.fillStyle = 'yellow'

      // 多个连续线条构成的区域，是可以使用 fill() 进行填充的。
      // 注意：这里所说的区域，并非一定得闭合。

      // 画一个直角，但是路径并没有闭合。
      // 此时这个直角也是可以正常被填充 fill 的。
      // 因为构成直角的两条线段构成了一个三角形区域。
      ctx.beginPath()
      ctx.moveTo(50, 50)
      ctx.lineTo(50, 150)
      ctx.lineTo(150, 150)

      ctx.stroke() // 描边儿

      ctx.fill() // 将构成的区域填充为黄色
    </script>
  </body>
</html>
```

![](assets/2024-10-04-00-49-54.png)
