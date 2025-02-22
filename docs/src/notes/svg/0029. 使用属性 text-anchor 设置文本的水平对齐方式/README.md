# [0029. 使用属性 text-anchor 设置文本的水平对齐方式](https://github.com/Tdahuyou/svg/tree/main/0029.%20%E4%BD%BF%E7%94%A8%E5%B1%9E%E6%80%A7%20text-anchor%20%E8%AE%BE%E7%BD%AE%E6%96%87%E6%9C%AC%E7%9A%84%E6%B0%B4%E5%B9%B3%E5%AF%B9%E9%BD%90%E6%96%B9%E5%BC%8F)

<!-- region:toc -->
- [1. 💻 demos.1 - 控制文本的水平对齐方式](#1--demos1---控制文本的水平对齐方式)
<!-- endregion:toc -->
- 属性 `text-anchor` 用于设置文本的水平对齐方式。

## 1. 💻 demos.1 - 控制文本的水平对齐方式

```xml
<!--
text-anchor：基于 (x, y) 坐标位置设置文本锚点。

属性值：
start   以 (x, y) 坐标为【开始】位置
middle  以 (x, y) 坐标为【中间】位置
end     以 (x, y) 坐标为【结束】位置
-->
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">

  <text font-size="8" x="50" y="30" text-anchor="start">Tdahuyou</text> <!-- [!code highlight] -->
  <text font-size="8" x="50" y="50" text-anchor="middle">Tdahuyou</text> <!-- [!code highlight] -->
  <text font-size="8" x="50" y="70" text-anchor="end">Tdahuyou</text> <!-- [!code highlight] -->

  <!-- 辅助点 -->
  <circle cx="50" cy="30" r="1" fill="red" />
  <circle cx="50" cy="50" r="1" fill="red" />
  <circle cx="50" cy="70" r="1" fill="red" />
</svg>
```

![](assets/2024-12-09-17-00-13.png)
