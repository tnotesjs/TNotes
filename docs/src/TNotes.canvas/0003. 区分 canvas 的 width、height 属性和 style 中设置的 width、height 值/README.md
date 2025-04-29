# [0003. 区分 canvas 的 width、height 属性和 style 中设置的 width、height 值](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0003.%20%E5%8C%BA%E5%88%86%20canvas%20%E7%9A%84%20width%E3%80%81height%20%E5%B1%9E%E6%80%A7%E5%92%8C%20style%20%E4%B8%AD%E8%AE%BE%E7%BD%AE%E7%9A%84%20width%E3%80%81height%20%E5%80%BC)

<!-- region:toc -->

- [1. ⏰ TODO 待整理](#1--todo-待整理)

<!-- endregion:toc -->

## 1. ⏰ TODO 待整理

在设置画布尺寸的时候，直接设置 canvas 的 width、height 属性值，不要通过 css 来设置 width、height。
- 【推荐】直接设置 canvas 的 wdith 和 height：`<canvas width="400" height="400"></canvas>`
- 【不推荐】通过 css 来设置 width 和 height：`canvas { width: 400, height: 400 }`
**style 设置的是容器的尺寸、canvas 的 width、height 设置的是画布坐标系的尺寸。如果两者的尺寸不一致，那么坐标系的最小单位将会自动缩小/放大，以适应容器尺寸。**
- 如果容器是 400x400 坐标系是 200x200，那么坐标系中的一个单位意味着 2px。（放大）
- 如果容器是 400x400 坐标系也是 400x400，那么坐标系中的一个单位意味着 1px。（正常）
**在设置画布尺寸的时候，为了方式坐标被拉伸，通常都是直接设置 canvas 的 width、height 而不是通过 style 来设置。**
[1.html](./1.html) 文件内容如下：
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      canvas {
        outline: 1px solid #ddd;
      }
      #c1 {
        width: 400px;
        height: 400px;
      }
      .box {
        width: 50px;
        height: 50px;
        background-color: black;
      }
    </style>
  </head>
  <body>
    <h1>50*50 盒子的大小（作为参照）</h1>
    <div class="box"></div>
    <!--
    1. canvas 可以使用 style 样式设置宽高
    2. canvas 也可以使用 width 和 height 属性设置宽高
    区别：
    1. style 的 width、height 设置的是画布容器尺寸
    2. canvas 的 width、height 设置的是画布坐标系
   -->
    <!--
    c1 容器的尺寸是 400 * 400
    c1 画布的坐标系是 200 * 200
    相当于 1 个单位是 2px
    意味着图像的大小被放大到原来的两倍
    -->
    <h1>c1 坐标系中的一个单位按比例放大两倍</h1>
    <canvas id="c1" width="200" height="200"></canvas>
    <!--
    c2 容器的尺寸是 400 * 400
    c2 画布的坐标系是 400 * 400
    相当于 1 个单位是 1px
     -->
    <h1>c2 坐标系比例保持不变</h1>
    <!--
    如果没有设置 style 的 width 和 height
    那么容器的尺寸就是 canvas 的 width、height 属性值
    也就是说 #c2 的容器尺寸就是 400 x 400
     -->
    <canvas id="c2" width="400" height="400"></canvas>
  </body>
  <script>
    {
      /** @type {HTMLCanvasElement} */
      const canvas = document.querySelector('#c1')
      const ctx = canvas.getContext('2d')
      ctx.fillRect(0, 0, 50, 50)
      // 表示在 (0, 0) 位置绘制一个宽高为 50 的矩形
    }
    {
      /** @type {HTMLCanvasElement} */
      const canvas = document.querySelector('#c2')
      const ctx = canvas.getContext('2d')
      ctx.fillRect(0, 0, 50, 50)
    }
  </script>
</html>
```
![](assets/2024-09-19-09-40-34.png)
