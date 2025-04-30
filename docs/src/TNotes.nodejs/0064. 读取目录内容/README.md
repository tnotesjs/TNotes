# [0064. 读取目录内容](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0064.%20%E8%AF%BB%E5%8F%96%E7%9B%AE%E5%BD%95%E5%86%85%E5%AE%B9)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 读取目录内容 `readdir`](#2--demos1---读取目录内容-readdir)
- [3. 💻 demos.2 - 读取不存在的目录会报错](#3--demos2---读取不存在的目录会报错)

<!-- endregion:toc -->

## 1. 📒 概述

| 方法名          | 功能描述         |
| --------------- | ---------------- |
| `readdir()`     | 异步读取目录内容 |
| `readdirSync()` | 同步读取目录内容 |

## 2. 💻 demos.1 - 读取目录内容 `readdir`

::: code-group

```js [1.cjs] {9}
const fs = require('fs')
const path = require('path')

// 定义要读取的目录路径
const dirPath = path.join(__dirname, 'a')

try {
  // 使用 readdirSync 读取目录内容
  const files = fs.readdirSync(dirPath)

  console.log(`目录 ${dirPath} 的内容:`)
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`)
  })
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`目录不存在: ${dirPath}`)
  } else {
    console.error(`读取目录时出错: ${err.message}`)
  }
}

// 默认目录结构：
// $ tree
// .
// ├── 1.cjs
// └── a
//     ├── 1.txt
//     ├── 2.txt
//     └── b
//         ├── 1.md
//         └── c

// 输出：
// 目录 /Users/huyouda/zm/notes/TNotes.nodejs/notes/0064. 读取目录内容/demos/1/a 的内容:
// 1. 1.txt
// 2. 2.txt
// 3. b

// readdir()
// 会读取指定目录下的内容
// 包括目录下的文件和子目录
```

:::

## 3. 💻 demos.2 - 读取不存在的目录会报错

::: code-group

```js [1.cjs] {9}
const fs = require('fs')
const path = require('path')

// 定义要读取的目录路径
const dirPath = path.join(__dirname, 'abc')

try {
  // 使用 readdirSync 读取目录内容
  const files = fs.readdirSync(dirPath)

  console.log(`目录 ${dirPath} 的内容:`)
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`)
  })
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`目录不存在: ${dirPath}`) // [!code error]
  } else {
    console.error(`读取目录时出错: ${err.message}`)
  }
}

// 输出：
// 目录不存在: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0064. 读取目录内容/demos/2/abc

// 如果读取的目录不存在
// 会报错 ENOENT
```

:::
