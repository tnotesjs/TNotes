# [0060. 删除目录](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0060.%20%E5%88%A0%E9%99%A4%E7%9B%AE%E5%BD%95)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 🤔 对于新版的 `rm` 和旧版的 `rmDir`，应该如何选择？](#2--对于新版的-rm-和旧版的-rmdir应该如何选择)
- [3. 💻 demos.1 - 删除目录 `rmdir`](#3--demos1---删除目录-rmdir)
- [4. 💻 demos.2 - 递归删除目录 `rm`](#4--demos2---递归删除目录-rm)

<!-- endregion:toc -->

## 1. 📒 概述

| 方法名        | 功能描述             |
| ------------- | -------------------- |
| `rmdir()`     | 异步删除空目录       |
| `rmdirSync()` | 同步删除空目录       |
| `rm()`        | 同步删除空文件或目录 |
| `rmSync()`    | 同步删除空文件或目录 |

- **参数配置**：

| 选项 | 描述 | 默认值 |
| --- | --- | --- |
| **recursive** | 如果为 `true`，则执行递归目录删除操作。在递归模式下，操作将在失败时重试。 | `false` |
| **retryDelay** | 重试之间等待的时间（以毫秒为单位）。如果 `recursive` 选项不为 `true`，则忽略此选项。 | `100` |
| **maxRetries** | 表示重试次数。如果遇到 `EBUSY`、`EMFILE`、`ENFILE`、`ENOTEMPTY` 或 `EPERM` 错误，Node.js 将在每次尝试时，以 `retryDelay` 毫秒的线性退避等待时间重试该操作。如果 `recursive` 选项不为 `true`，则忽略此选项。 | `0` |

## 2. 🤔 对于新版的 `rm` 和旧版的 `rmDir`，应该如何选择？

| 特性 | `fs.rmdir` | `fs.rm` |
| --- | --- | --- |
| **主要用途** | 删除空目录（支持递归删除非空目录）。 | 删除文件或目录（支持递归删除）。 |
| **递归删除支持** | 从 Node.js v12.10.0 开始支持 `{ recursive: true }`。 | 默认支持 `{ recursive: true }`。 |
| **忽略路径不存在** | 仅在 Node.js v16+ 支持 `{ force: true }`。 | 默认支持 `{ force: true }`。 |
| **是否推荐** | 不推荐用于新项目（逐步被 `fs.rm` 替代）。 | 推荐用于删除文件或目录的场景。 |
| **适用版本** | 所有 Node.js 版本。 | Node.js v14.14.0+。 |

- **优先使用 `fs.rm` 的场景**：
  - 如果你的项目运行在 Node.js v14.14.0 或更高版本上，推荐使用 `fs.rm()` 或 `fs.rmSync()`，因为它们是更现代的 API，并且功能更强大。
- **需要兼容旧版本的场景**：
  - 如果需要兼容较低版本的 Node.js（如 v12.x），可以继续使用 `fs.rmdir()`，并结合 `{ recursive: true }` 选项。
- **清理目录的最佳实践**：
  - 使用 `{ recursive: true, force: true }` 确保操作更加健壮，避免因路径不存在或权限问题导致的错误。
  - 加上这个配置就类似于 Unix 中的 `rm -rf` 命令效果。

## 3. 💻 demos.1 - 删除目录 `rmdir`

::: code-group

```bash [初始默认的目录结构]
tree
# .
# ├── 1
# │   └── 2
# ├── 1.cjs
# ├── 2.cjs
# └── 3.cjs
```

:::

::: code-group

<<< ./demos/1/1.cjs {js 9,13}

<<< ./demos/1/2.cjs {js 8,12}

<<< ./demos/1/3.cjs {js 8,14}

:::

- `1.cjs`，可以删除一个已存在的空目录。
- `2.cjs`，无法删除一个不存在的目录。
- `3.cjs`，无法删除一个非空目录。

## 4. 💻 demos.2 - 递归删除目录 `rm`

::: code-group

<<< ./demos/2/1.cjs {js 21}

<<< ./demos/2/2.cjs {js 9}

:::
