# [0002. 在 .html 和 .svg 文件中，根元素 svg 的数量](https://github.com/Tdahuyou/svg/tree/main/0002.%20%E5%9C%A8%20.html%20%E5%92%8C%20.svg%20%E6%96%87%E4%BB%B6%E4%B8%AD%EF%BC%8C%E6%A0%B9%E5%85%83%E7%B4%A0%20svg%20%E7%9A%84%E6%95%B0%E9%87%8F)

<!-- region:toc -->
- [1. 💻 demos.1 - 在 .html 文件中书写多个 svg](#1--demos1---在-html-文件中书写多个-svg)
- [2. 💻 demos.2 - 在 .svg 文件中只能书写单个 svg](#2--demos2---在-svg-文件中只能书写单个-svg)
<!-- endregion:toc -->
- 根元素的数量得看你在什么位置写，是写在 `.svg` 中还是 `.html` 中，前者 `.svg` 只能出现一个 `<svg>` 根元素，后者 `.html` 可以有多个 `<svg>` 根元素。
- svg 标签写在 `.svg` 文件中，作为根标记，要求有且只有一个。
- svg 标签写在 `.html` 文件中，可以写多个标记，表示嵌入了多个 svg 图片，每一个 svg 都是一个独立的区域。

## 1. 💻 demos.1 - 在 .html 文件中书写多个 svg

```xml
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- svg 标签写在 .html 文件中可以写多个 -->
    <!-- 每一个 svg 都是一个独立的区域 -->
    
    <!-- 嵌入多个 svg -->
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="green"
        stroke-width="4"
        fill="yellow"
      />
    </svg>
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="green"
        stroke-width="4"
        fill="yellow"
      />
    </svg>
  </body>
</html>
```

- ![](assets/2024-12-09-15-38-48.png)

## 2. 💻 demos.2 - 在 .svg 文件中只能书写单个 svg

```xml
<!-- svg 标签写在 .svg 文件中，作为根标记，要求有且只有一个。 -->

<!-- 如果在一个 .svg 文件中书写两个 svg 元素 -->
<!-- 那么页面上将会报错 -->
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
</svg>
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
</svg>
```

- ![](assets/2024-12-09-15-39-52.png)