# [0068. 文件复制](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0068.%20%E6%96%87%E4%BB%B6%E5%A4%8D%E5%88%B6)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.3 - 复制文件 - 使用流 `stream` 的方式](#2--demos3---复制文件---使用流-stream-的方式)
- [3. 💻 demos.4 - 复制文件 - `copyFile()`](#3--demos4---复制文件---copyfile)

<!-- endregion:toc -->

## 1. 📒 概述

- **复制文件的两种常见做法**：
  - 做法 1：将文件从一个位置复制到另外一个位置；
    - 通过 `fs.copyFile()` 或其同步版本 `fs.copyFileSync()` 来实现文件的复制。
  - 做法 2：从原文件中读取数据并写入一个新文件中；
    - 可以通过流（streams）或结合 `fs.read()` 和 `fs.write()` 方法来实现。
    - 使用流是更常见的方式。

## 2. 💻 demos.3 - 复制文件 - 使用流 `stream` 的方式

::: code-group

<<< ./demos/3/1.cjs {js}

<<< ./demos/3/1.txt {txt}

<<< ./demos/3/2.txt {txt}

:::

## 3. 💻 demos.4 - 复制文件 - `copyFile()`

::: code-group

<<< ./demos/4/1.cjs {10 js}

<<< ./demos/4/1.txt {txt}

<<< ./demos/4/2.txt {txt}

:::
