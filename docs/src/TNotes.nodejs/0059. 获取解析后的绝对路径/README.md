# [0059. 获取解析后的绝对路径](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0059.%20%E8%8E%B7%E5%8F%96%E8%A7%A3%E6%9E%90%E5%90%8E%E7%9A%84%E7%BB%9D%E5%AF%B9%E8%B7%AF%E5%BE%84)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 获取解析后的绝对路径 `realpathSync`](#2--demos1---获取解析后的绝对路径-realpathsync)

<!-- endregion:toc -->

## 1. 📒 概述

| 方法名           | 功能描述                         |
| ---------------- | -------------------------------- |
| `realpath()`     | 异步获取指定目录或文件的绝对路径 |
| `realpathSync()` | 同步获取指定目录或文件的绝对路径 |

- `realpath()`、`realpathSync()` 会解析路径中的符号链接、`.`（当前目录）和 `..`（上级目录），并返回标准化后的绝对路径。
- **功能**：获取路径的真实绝对路径，解析符号链接和相对路径。
  - **主要用途**：获取路径的真实绝对路径。
  - **解析内容**：
    - 解析符号链接，返回目标文件或目录的实际路径。
    - 解析相对路径（如 `.` 和 `..`），返回绝对路径。
  - **返回值**：返回一个字符串，表示路径的真实绝对路径。
- **适用场景**：
  - 需要标准化路径（例如在日志记录或配置文件中）。
  - 需要解析符号链接，确保操作的是目标文件或目录。
- **注意事项**：
  - **符号链接的解析**：
    - `realpath()`、`realpathSync()` 会自动解析符号链接，并返回目标文件或目录的真实路径。
    - 如果需要直接操作符号链接本身，可以使用 `fs.lstatSync()` 和 `fs.readlinkSync()`。
  - **相对路径的解析**：
    - 如果传入的是相对路径（如 `./example.txt`），`realpath()`、`realpathSync()` 会将其转换为绝对路径。
  - **跨平台兼容性**：
    - 在不同操作系统上，路径分隔符可能不同（例如 `/` 或 `\`）。`realpath()`、`realpathSync()` 返回的路径始终是标准化的绝对路径。
  - **性能问题**：
    - 如果需要批量解析多个路径，建议使用异步方法（如 `fs.promises.realpath`）以避免阻塞事件循环。

## 2. 💻 demos.1 - 获取解析后的绝对路径 `realpathSync`

::: code-group

```js [1.cjs] {8}
const fs = require('fs')

// 定义一个路径（可以是相对路径、绝对路径或包含符号链接的路径）
const inputPath = './1.txt' // 可以替换为其他路径

try {
  // 使用 realpathSync 获取真实路径
  const realPath = fs.realpathSync(inputPath)

  console.log(`输入路径: ${inputPath}`)
  console.log(`真实路径: ${realPath}`)

  // 可以进一步检查路径是否是符号链接
  const stats = fs.lstatSync(inputPath)
  if (stats.isSymbolicLink()) {
    console.log(`该路径是一个符号链接，指向: ${fs.readlinkSync(inputPath)}`)
  }
} catch (err) {
  switch (err.code) {
    case 'ENOENT':
      console.error(`路径不存在: ${inputPath}`)
      break
    case 'EACCES':
      console.error(`权限不足，无法访问路径: ${inputPath}`)
      break
    default:
      console.error(`发生未知错误: ${err.message}`)
  }
}
```

```txt [1.txt]
test

```

```bash [运行程序]
# 注意：执行 node 1.cjs 时的命令行位置 —— demos/1
$ pwd
# /Users/huyouda/zm/notes/TNotes.nodejs/notes/0059. 获取目录的绝对路径/demos/1
$ node 1.cjs
# 输入路径: ./1.txt
# 真实路径: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0059. 获取目录的绝对路径/demos/1/1.txt
```

:::
