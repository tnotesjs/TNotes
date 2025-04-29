# [0070. 查看符号链接信息](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0070.%20%E6%9F%A5%E7%9C%8B%E7%AC%A6%E5%8F%B7%E9%93%BE%E6%8E%A5%E4%BF%A1%E6%81%AF)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 对比：`fs.stat` 和 `fs.lstat`](#2--demos1---对比fsstat-和-fslstat)

<!-- endregion:toc -->

## 1. 📒 概述

- 要区分普通文件、目录和符号链接，可以使用 `fs.lstat()` 或 `fs.lstatSync()` 方法。
- 这些方法 **不会解析符号链接，而是直接返回符号链接本身的信息**。
- **对比：`fs.stat` 和 `fs.lstat`**

| 方法 | 是否解析符号链接 | 返回值描述 |
| --- | --- | --- |
| `fs.stat` | 是（解析符号链接） | 返回符号链接指向的目标文件或目录的状态信息。 |
| `fs.lstat` | 否（不解析符号链接） | 返回符号链接本身的状态信息，不会解析目标路径。 |

- **🤔 什么叫“解析符号链接”？**
  - **“解析符号链接”**：方法会自动跟随符号链接，返回目标文件或目录的状态信息。
    - 当操作系统或程序访问一个符号链接时，默认情况下会自动跟随（resolve）这个符号链接，找到它指向的目标文件或目录。这种行为称为“解析符号链接”。
    - 假设有一个符号链接 `exampleLink.txt`，它指向目标文件 `example.txt`。
    - 如果你使用 `fs.stat()` 或 `fs.statSync()` 方法检查 `exampleLink.txt`，Node.js 会自动解析符号链接，并返回目标文件 `example.txt` 的状态信息。
    - 换句话说，`fs.stat()` 和 `fs.statSync()` 不会告诉你 `exampleLink.txt` 是一个符号链接，而是直接告诉你它指向的目标文件的状态。
    - 此时，你可以理解为 `exampleLink.txt` 就是 `example.txt`，它们是等价的。
  - **“不会解析符号链接”**：方法不会跟随符号链接，而是直接返回符号链接本身的状态信息。
    - 某些方法（如 `fs.lstat()` 或 `fs.lstatSync()`）不会自动解析符号链接，而是直接返回符号链接本身的信息。
    - 也就是说，它们会告诉你路径是一个符号链接，而不是去检查符号链接指向的目标。
    - 假设有一个符号链接 `exampleLink.txt`，它指向目标文件 `example.txt`。
    - 如果你使用 `fs.lstat()` 或 `fs.lstatSync()` 方法检查 `exampleLink.txt`，Node.js 会返回符号链接本身的状态信息，而不会去解析它指向的目标文件。
    - 通过这种方式，你可以区分路径是普通文件、目录还是符号链接。
- **注意**：
  - 如果传入的链接不存在，会报错 `ENOENT`。
- **最佳实践**：
  - 如果你需要知道符号链接指向的目标是什么，可以使用 `fs.stat()` 或 `fs.statSync()`。
  - 如果你需要判断路径是否是符号链接本身，应该使用 `fs.lstat()` 或 `fs.lstatSync()`。

## 2. 💻 demos.1 - 对比：`fs.stat` 和 `fs.lstat`

::: code-group

<<< ./demos/1/1.cjs {js}

<<< ./demos/1/1.txt {txt}

:::

- **`fs.statSync`**：
  - 自动解析符号链接，返回目标文件 `1.txt` 的状态信息。
  - 因此，`isFile()` 返回 `true`，`isSymbolicLink()` 返回 `false`。
- **`fs.lstatSync`**：
  - 不解析符号链接，返回符号链接本身的状态信息。
  - 因此，`isFile()` 返回 `false`，`isSymbolicLink()` 返回 `true`。
