# [0066. 文件截断](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0066.%20%E6%96%87%E4%BB%B6%E6%88%AA%E6%96%AD)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 截断文件 - `truncate()`](#2--demos1---截断文件---truncate)

<!-- endregion:toc -->

## 1. 📒 概述

- 截断文件意味着改变文件的大小。
- 使用 `fs.truncate()` 或其同步版本 `fs.truncateSync()` 可以实现这一功能。
- 截断的两种情况：
  - 如果指定的新长度小于文件当前的长度，则文件会被裁剪；
  - 如果新长度大于当前长度，文件会扩展并在末尾填充空字节；

## 2. 💻 demos.1 - 截断文件 - `truncate()`

::: code-group

<<< ./demos/1/1.cjs {9 js}

<<< ./demos/1/1.txt {txt}

<<< ./demos/1/2.cjs {9 js}

<<< ./demos/1/2.txt {txt}

:::

- `1.cjs` 截断的长度 3 小于文件内容长度 6。
  - 指定的新长度小于文件当前的长度，则文件会被裁剪。
- `2.cjs` 截断的长度 10 大于文件内容长度 6。
  - 新长度大于当前长度，文件会扩展并在末尾填充空字节。
  - 这些空字节在以 UTF-8 编码打开预览时会以乱码的形式呈现。
  - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-16-21-28-54.png)
