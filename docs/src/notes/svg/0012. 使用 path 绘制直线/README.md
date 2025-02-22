# [0012. 使用 path 绘制直线](https://github.com/Tdahuyou/svg/tree/main/0012.%20%E4%BD%BF%E7%94%A8%20path%20%E7%BB%98%E5%88%B6%E7%9B%B4%E7%BA%BF)

<!-- region:toc -->
- [1. 💻 demos.1 - 绘制直线的多种写法](#1--demos1---绘制直线的多种写法)
- [2. 💻 demos.2 - 一个 `<path>` 允许多个 `M`](#2--demos2---一个-path-允许多个-m)
- [3. 💻 demos.3 - 关键字的大小写有着不同的含义](#3--demos3---关键字的大小写有着不同的含义)
- [4. 💻 demos.4 - H、V、Z 关键字](#4--demos4---hvz-关键字)
<!-- endregion:toc -->
- `<path>` 可以用于绘制直线，涉及到的关键字：`M/m`、`L/l`、`H`、`V`、`Z`。

## 1. 💻 demos.1 - 绘制直线的多种写法


```xml
<!--
<path> 根据点连接，绘制各种图形。

能够绘制直线（线段、折线、矩形、多边形这些都是直线）
能够绘制曲线（贝塞尔曲线，弧线）。

<path> 的 d 属性 ≈ 折线 <polyline> 中的 points 属性
<path> 的 d 属性 ≈ 多边形 <polygon> 中的 points 属性
都是用来设置多个坐标点的。

直线相关的关键字：M/m、L/l

M/m（Move To）
移动到指定的坐标点，设置笔触所在的起始位置（要从哪个坐标位置开始画）。

L/l（Line To）
从当前坐标点到指定的坐标点绘制直线。
-->
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M30 30 L60 30" fill="none" stroke="blue" stroke-width="2" /> <!-- [!code highlight] -->
  <line x1="30" y1="40" x2="60" y2="40" stroke="green" stroke-width="2" />
  <polyline points="30 50,60 50" stroke="red" stroke-width="2" />
  <!--
  上面这 3 种写法都可以绘制直线。
  由此可见，其实在 svg 中，想要绘制某种图形，写法并不是唯一的。
  -->
</svg>
```

![](assets/2024-12-10-09-00-12.png)


## 2. 💻 demos.2 - 一个 `<path>` 允许多个 `M`


```xml
<!--
一个 path 允许多个 M

在一个 path 路径绘制的图形中，可以设置多个 M。
实现移动笔触，从多个点进行绘制。
-->
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path
    d="M30 30 L70 30 M50 30 L50 70" // [!code highlight]
    fill="none" stroke="blue" stroke-width="2"
  />
  <!-- 辅助点 -->
  <circle cx="30" cy="30" r="1" fill="red"/>
  <circle cx="50" cy="30" r="1" fill="red"/>
</svg>
```

![](assets/2025-01-26-14-44-08.png)

## 3. 💻 demos.3 - 关键字的大小写有着不同的含义


```xml
<!--
注意关键字大小写
关键字大写和小写，含义是不同的。

示例：

M10 10 L40 20
表示从 (10,10) 点向 (40,20) 点画直线 — 绝对位置

M10 10 l40 20
表示从 (10,10) 点向 (10 + 40, 10 + 20) 点画直线 — 相对位置
也就是基于 (10, 10) 点偏移，x 轴距离加 40，y 轴距离加 20
-->
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10 L40 20" fill="none" stroke="blue" stroke-width="2" /> <!-- [!code highlight] -->
  <path d="M10 10 l40 20" fill="none" stroke="green" stroke-width="2" /> <!-- [!code highlight] -->
  <path d="M50 50 L60 60 m-10 0 L60 50" fill="none" stroke="red" stroke-width="2" /> <!-- [!code highlight] -->
</svg>
```

![](assets/2024-12-10-09-03-05.png)

## 4. 💻 demos.4 - H、V、Z 关键字


- H 关键字 - horizontal - 表示水平的。
- V 关键字 - vertical - 表示垂直的。
- Z 关键字 - 表示 "Closepath"（闭合路径）。
  - Z 这玩意儿比较奇怪，Closepath 首字母是 C，而这里却使用 Z。
  - 一方面是为了简洁、统一，都使用一个字母来表示关键字；
  - 另一方面也是为了和其他的关键字区分开；
    - 毕竟 C 关键字已经被用了 —— C 代表 "Cubic Bézier Curve"（三次贝塞尔曲线）。
    - 这也是为何不使用 C 来表示闭合路径关键字的原因。

```xml
<!--
H、V、Z 关键字
H 只需要指定横坐标，表示横向画线。
V 只需要指定纵坐标，表示纵向画线。
Z 放在最后，不需要跟坐标，表示首尾坐标闭合。
-->
<svg style="margin: 3rem;" width="500px" height="500px" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M30 30 H70 V70 H30 Z" fill="none" stroke="blue" stroke-width="2" /> <!-- [!code highlight] -->
  <!-- H70 表示从当前位置横向画线到 x=70。 -->
  <!-- V70 表示从当前位置纵向画线到 y=70。 -->
  <!-- H30 表示从当前位置横向画线到 x=30。 -->
  <!-- Z 表示从当前位置画线到起点，形成闭合。 -->
</svg>
```

![](assets/2024-12-10-09-05-19.png)
