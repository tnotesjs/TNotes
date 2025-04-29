# [0047. exports 对象](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0047.%20exports%20%E5%AF%B9%E8%B1%A1)

<!-- region:toc -->

- [1. 💻 demos.1 - 使用 exports 对象实现模块化编程](#1--demos1---使用-exports-对象实现模块化编程)

<!-- endregion:toc -->

## 1. 💻 demos.1 - 使用 exports 对象实现模块化编程

::: code-group

```js [module.cjs]
// 求绝对值的方法 abs
exports.abs = function (number) {
  if (0 < number) {
    return number
  } else {
    return -number
  }
}
// 求圆面积的方法 circleArea
exports.circleArea = function (radius) {
  return radius * radius * Math.PI
}
```

```js [index.cjs]
// 加载 module.cjs 模块文件
const module = require('./module.cjs')
// 使用模块方法
console.log('abs(-273) = %d', module.abs(-273))
console.log('circleArea(3) = %d', module.circleArea(3))

// 上面代码中，通过使用 require() 导入了创建的 module.js 模块文件。运行 main.js 文件，结果如下：
// abs(-273) = 273
// circleArea(3) = 28.274333882308138
```

:::
