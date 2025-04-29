# [0005. canvas 的默认尺寸 300 x 150](https://github.com/Tdahuyou/TNotes.canvas/tree/main/notes/0005.%20canvas%20%E7%9A%84%E9%BB%98%E8%AE%A4%E5%B0%BA%E5%AF%B8%20300%20x%20150)

<!-- region:toc -->

- [1. 📝 简介](#1--简介)
- [2. 📒 notes](#2--notes)
- [3. 💻 demo](#3--demo)

<!-- endregion:toc -->

## 1. 📝 简介

- 知道 `<canvas>` 默认是 300x150 的行盒。

## 2. 📒 notes

如果你仅仅创建了一个 canvas，但是并没有指定它的 width、height，那么这个 canvas 的默认尺寸是 300x150。

## 3. 💻 demo

```html
<!-- 1.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    canvas {
      outline: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <!--
    1. canvas 是一个行内元素
    2. canvas 默认大小是 300 * 150

    打开浏览器查看最终渲染效果会发现俩盒子同行显示。
    打开 devtools，查看盒模型，会发现盒子尺寸是 300 * 150。
   -->
  <canvas></canvas>
  <canvas></canvas>
</body>
</html>
```

**最终的渲染结果**

![](assets/2024-10-03-22-58-50.png)

从最终的渲染结果（并行显示）来看，会发现其实 canvas 并非块盒。

**计算属性及盒模型**

![](assets/2024-10-03-22-59-01.png)
