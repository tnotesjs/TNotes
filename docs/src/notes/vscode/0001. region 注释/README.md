# [0001. region 注释](https://github.com/Tdahuyou/vscode/tree/main/0001.%20region%20%E6%B3%A8%E9%87%8A)

<!-- region:toc -->
- [1. 📒 region 注释](#1--region-注释)
<!-- endregion:toc -->
- 介绍了 region 注释是什么，有什么作用。
- 介绍了在 vsocde 中编写 region 注释的基本语法。

## 1. 📒 region 注释

- region 注释的格式非常简单，只需要在开始位置加上 region，结束位置加上 endregion 即可。
- region 注释的作用：
  - 如果一个模块中含有的代码量比较多（比如大于 100 行），可以考虑使用区域注释的方式，对代码进行分组，方便阅读。
  - 区域注释的内容可以被折叠，对于那些逻辑已经清晰的代码块或者不那么重要的代码块，都可以使用区域注释进行折叠，这样或许可以更好地集中精力关注核心的代码块。
- 下面以 js 为例：

```js
// #region 描述信息
// ...（这部分是代码）
// #endregion 描述信息
```

![](md-imgs/2024-10-09-22-46-18.png)

