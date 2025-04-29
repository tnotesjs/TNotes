# [0048. module 对象](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0048.%20module%20%E5%AF%B9%E8%B1%A1)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 打印 module 对象](#2--demos1---打印-module-对象)
- [3. 💻 demos.2 - 使用 module 对象实现模块化编程](#3--demos2---使用-module-对象实现模块化编程)

<!-- endregion:toc -->

## 1. 📒 概述

- **module** 对象常用属性

| 属性       | 说明                                                   |
| ---------- | ------------------------------------------------------ |
| `id`       | 模块的标识符，通常是完全解析后的文件名，默认输出       |
| `path`     | Node.js 运行 js 模块所在的文件路径                     |
| `exports`  | 公开的内容，也就是导出的对象，引入该模块会得到这个对象 |
| `filename` | 当前模块文件名，包含路径                               |
| `loaded`   | 模块是否加载完毕                                       |
| `parent`   | 当前模块的父模块对象                                   |
| `children` | 当前模块的所有子模块对象                               |

## 2. 💻 demos.1 - 打印 module 对象

::: code-group

```js [1.cjs]
console.log('module:', module)

// module: {
//   id: '.',
//   path: 'c:\\notes\\TNotes.nodejs\\notes\\0048. module 对象\\demos\\1',
//   exports: {},
//   filename: 'c:\\notes\\TNotes.nodejs\\notes\\0048. module 对象\\demos\\1\\1.cjs',
//   loaded: false,
//   children: [],
//   paths: [
//     'c:\\notes\\TNotes.nodejs\\notes\\0048. module 对象\\demos\\1\\node_modules',
//     'c:\\notes\\TNotes.nodejs\\notes\\0048. module 对象\\demos\\node_modules',
//     'c:\\notes\\TNotes.nodejs\\notes\\0048. module 对象\\node_modules',
//     'c:\\notes\\TNotes.nodejs\\notes\\node_modules',
//     'c:\\notes\\TNotes.nodejs\\node_modules',
//     'c:\\notes\\node_modules',
//     'c:\\node_modules'
//   ]
// }
```

:::

## 3. 💻 demos.2 - 使用 module 对象实现模块化编程

::: code-group

```js [module.cjs]
function Hello() {
  let name
  this.setName = function (thyName) {
    name = thyName
  }
  this.sayHello = function () {
    console.log(name + '，你好')
  }
}
module.exports = Hello
```

```js [index.cjs]
const Hello = require('./module.cjs')
hello = new Hello()
hello.setName('2025')
hello.sayHello()

// 2025，你好
```

:::
