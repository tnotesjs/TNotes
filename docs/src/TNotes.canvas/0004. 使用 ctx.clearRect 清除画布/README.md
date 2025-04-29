# [0004. 使用 ctx.clearRect 清除画布](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0004.%20%E4%BD%BF%E7%94%A8%20ctx.clearRect%20%E6%B8%85%E9%99%A4%E7%94%BB%E5%B8%83)

<!-- region:toc -->

- [1. 📒 notes](#1--notes)
- [2. 💻 demo1](#2--demo1)
- [3. 💻 demo2](#3--demo2)
- [4. 💻 demo3](#4--demo3)
- [5. 💻 demo4](#5--demo4)

<!-- endregion:toc -->

## 1. 📒 notes

需要理解 ctx.clearRect 清除画布的本质是让指定区域 **透明**，而非真的将路径给擦掉了。

---

**理解擦除的本质**

`ctx.clearRect(x, y, width, height)` 用于在 canvas 上清除指定的矩形区域，使该区域完全透明。

---

**了解应用场景**

这个方法对于动画和游戏开发中的图形更新特别有用，因为它允许开发者清除旧的图像帧，从而在同一位置绘制新的帧。

- **动画**：在每个动画帧开始时清除旧的画面内容。
- **游戏开发**：清除移动对象留下的轨迹，比如角色、弹药或其他元素。
- **用户界面**：在用户界面元素变动时，清除旧元素的区域以更新界面。

## 2. 💻 demo1

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>📝 ctx.clearRect 方法</title>
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

      // 使用 ctx.clearRect(x, y, width, height) 方法
      // 清除画布中的指定矩形区域

      // 【1】绘制一条横线
      ctx.beginPath()
      ctx.moveTo(0, 100)
      ctx.lineTo(400, 100)
      ctx.stroke()

      // 【2】绘制一条竖线
      ctx.beginPath()
      ctx.moveTo(100, 0)
      ctx.lineTo(100, 400)
      ctx.stroke()
    </script>
  </body>
</html>
```

![](assets/2024-10-03-22-50-14.png)

## 3. 💻 demo2

```html
<!-- 2.html -->
 <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>📝 ctx.clearRect 方法</title>
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

      // 【1】绘制一条横线
      ctx.beginPath()
      ctx.moveTo(0, 100)
      ctx.lineTo(400, 100)
      ctx.stroke()

      ctx.clearRect(0, 0, 100, 400) // 【1】 的一部分会被擦掉。

      // 【2】绘制一条竖线
      ctx.beginPath()
      ctx.moveTo(100, 0)
      ctx.lineTo(100, 400)
      ctx.stroke()
    </script>
  </body>
</html>
```

![](assets/2024-10-03-22-51-05.png)

## 4. 💻 demo3

```html
<!-- 3.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>📝 ctx.clearRect 方法</title>
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

      // 【1】绘制一条横线
      ctx.beginPath()
      ctx.moveTo(0, 100)
      ctx.lineTo(400, 100)
      ctx.stroke()

      ctx.clearRect(0, 0, cavnas.width, cavnas.height) // 擦除整个画布

      // 【2】绘制一条竖线
      ctx.beginPath()
      ctx.moveTo(100, 0)
      ctx.lineTo(100, 400)
      ctx.stroke()
    </script>
  </body>
</html>
```

![](assets/2024-10-03-22-51-24.png)

## 5. 💻 demo4

```html
<!-- 4.html -->
 <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>📝 ctx.clearRect 方法</title>
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

      // 清除画布的本质就是将指定的矩形区域的透明度设置为 0
      // 之前的路径依然是存在的

      // 如果在开始绘制新的路径时不希望之前的路径出现
      // 别忘了调用 beginPath() 方法

      // 【1】绘制一条横线
      ctx.beginPath() // 假如将这个 beginPath 和下面的都注释掉的话，那么最后调用 stroke() 时，会将之前的网格路径也一起绘制出来。（不过 lineWidth 和 strokeStyle 不再是 drawGrid 方法中封装的值了。）
      ctx.moveTo(0, 100)
      ctx.lineTo(400, 100)
      ctx.stroke()

      ctx.clearRect(0, 0, cavnas.width, cavnas.height) // 擦除整个画布

      // 【2】绘制一条竖线
      // ctx.beginPath() // 如果没有 beginPath()，绘制【2】竖线的时候，之前的【1】横线也会出现。
      ctx.moveTo(100, 0)
      ctx.lineTo(100, 400)
      ctx.stroke() // 绘制路径，此时会同时绘制出【1】、【2】
    </script>
  </body>
</html>
```

![](assets/2024-10-03-22-51-38.png)
