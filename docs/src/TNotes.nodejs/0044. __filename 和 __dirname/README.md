# [0044. __filename 和 __dirname](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0044.%20__filename%20%E5%92%8C%20__dirname)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 打印 `__filename` 和 `__dirname`](#2--demos1---打印-__filename-和-__dirname)

<!-- endregion:toc -->

## 1. 📒 概述

- `__filename`：表示当前正在执行的脚本的文件名，包括文件所在位置的绝对路径，但该路径和命令行参数所指定的文件名不一定相同。如果在模块中，则返回的值是模块文件的路径。
- `__dirname`：表示当前执行的脚本所在的目录。

## 2. 💻 demos.1 - 打印 `__filename` 和 `__dirname`

```js
console.log('当前文件名：', __filename)
console.log('当前目录：', __dirname)

// 当前文件名： c:\notes\TNotes.nodejs\notes\0044. Node.js 全局变量\demos\1\1.cjs
// 当前目录： c:\notes\TNotes.nodejs\notes\0044. Node.js 全局变量\demos\1
```
