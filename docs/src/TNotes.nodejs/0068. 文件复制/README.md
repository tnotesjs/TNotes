# [0068. 文件复制](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0068.%20%E6%96%87%E4%BB%B6%E5%A4%8D%E5%88%B6)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 复制文件 - 使用流 `stream` 的方式](#2--demos1---复制文件---使用流-stream-的方式)
- [3. 💻 demos.2 - 复制文件 - `copyFile()`](#3--demos2---复制文件---copyfile)

<!-- endregion:toc -->

## 1. 📒 概述

- **复制文件的两种常见做法**：
  - 做法 1：将文件从一个位置复制到另外一个位置；
    - 通过 `fs.copyFile()` 或其同步版本 `fs.copyFileSync()` 来实现文件的复制。
  - 做法 2：从原文件中读取数据并写入一个新文件中；
    - 可以通过流（streams）或结合 `fs.read()` 和 `fs.write()` 方法来实现。
    - 使用流是更常见的方式。

## 2. 💻 demos.1 - 复制文件 - 使用流 `stream` 的方式

::: code-group

```js [1.cjs]
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const filePath2 = path.join(__dirname, '2.txt')

fs.writeFileSync(filePath, 'Hello Node.js!')
console.log('文件已被创建！')

// 使用流复制文件
const source = fs.createReadStream(filePath)
const destination = fs.createWriteStream(filePath2)

source.pipe(destination)

source.on('end', function () {
  console.log('文件复制完成')
})

source.on('error', function (err) {
  console.error('出错:', err)
})
```

```txt [1.txt]
Hello Node.js!
```

```txt [2.txt]
Hello Node.js!
```

:::

## 3. 💻 demos.2 - 复制文件 - `copyFile()`

::: code-group

```js [1.cjs] {10}
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const filePath2 = path.join(__dirname, '2.txt')

fs.writeFileSync(filePath, 'Hello Node.js!')
console.log('文件已被创建！')

fs.copyFileSync(filePath, filePath2)
console.log('文件已被复制！')
```

```txt [1.txt]
Hello Node.js!
```

```txt [2.txt]
Hello Node.js!
```

:::
