# [0056. 文件检查](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0056.%20%E6%96%87%E4%BB%B6%E6%A3%80%E6%9F%A5)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 📒 文件访问常量 `File access constants`](#2--文件访问常量-file-access-constants)
- [3. 📒 常见的 Error 对象](#3--常见的-error-对象)
  - [3.1. `POSIX` 标准](#31-posix-标准)
- [4. 💻 demos.1 - 检查文件（文件夹）是否存在](#4--demos1---检查文件文件夹是否存在)
- [5. 💻 demos.2 - 同时设置多个 `mode` 参数](#5--demos2---同时设置多个-mode-参数)
- [6. 🔗 References](#6--references)

<!-- endregion:toc -->

## 1. 📒 概述

- **`fs.access()` 使用背景**：
  - `fs` 模块内置许多方法，用以对文件进行相关操作。
  - 具体使用时，有的方法如果发现文件不存在，可以创建文件，而有的方法则不能，这时就会出现错误，为了避免这类错误，在对文件进行操作之前，一般都需要检测文件是否存在，并且根据需要检查文件的可读或可写等属性。
  - 检查文件是否存在及其属性可以通过 `access()` 方法实现。
- **检查文件（或文件夹）是否存在**：
  - 使用 `fs.access()` 方法检查文件是否存在及其可读、可写属性。
  - 参数 `mode` 可以指定访问权限，默认为 `fs.constants.F_OK`（仅检查文件是否存在）。
  - 返回值是通过回调函数传递的错误对象，如果文件存在且符合权限，则返回 `null`。
- **`fs.assess()` 语法格式**：

```js
fs.access(path[, mode], callback)
// path
// 文件路径。

// mode
// 要执行的可访问性检查，默认值为 fs.constants.F_OK。
// 查看【文件访问常量】以获取可能的 mode 值。

// callback
// 回调函数，接收两个参数：error 和 stats。
// 如果检查可访问性失败，则错误参数将是 Error 对象。
```

## 2. 📒 文件访问常量 `File access constants`

| **常量** | **说明** |
| --- | --- |
| `F_OK` | 指示文件对调用进程可见的标志。这对于确定文件是否存在很有用，但没有说明 `rwx` 权限。 |
| `R_OK` | 指示文件可以被调用进程读取的标志。 |
| `W_OK` | 指示文件可以被调用进程写入的标志。 |
| `X_OK` | 指示文件可以被调用进程执行的标志，在 Windows 系统中等效于 `fs.constants.F_OK`。 |

## 3. 📒 常见的 Error 对象

| **值**      | **说明**           | **全称**                           |
| ----------- | ------------------ | ---------------------------------- |
| `EPERM`     | 操作不允许         | `Operation not permitted`          |
| `ENOENT`    | 文件或者路径不存在 | `No such file or directory`        |
| `ESRCH`     | 进程不存在         | `No such process`                  |
| `EINTR`     | 系统调用中断       | `Interrupted system call`          |
| `EIO`       | I/O 错误           | `Input/output error`               |
| `ENXIO`     | 设备或地址不存在   | `No such device or address`        |
| `EBIG`      | 参数列表过长       | `Argument list too long`           |
| `ENOEXEC`   | 执行格式错误       | `Exec format error`                |
| `EBADF`     | 文件编号错误       | `Bad file descriptor`              |
| `ECHILD`    | 子进程不存在       | `No child processes`               |
| `EAGAIN`    | 重试               | `Resource temporarily unavailable` |
| `ENOMEM`    | 内存不足           | `Cannot allocate memory`           |
| `EBUSY`     | 资源繁忙或者被锁定 | `Device or resource busy`          |
| `EACCES`    | 拒绝访问           | `Permission denied`                |
| `EFAULT`    | 地址错误           | `Bad address`                      |
| `EEXIST`    | 文件已经存在       | `File exists`                      |
| `ENODEV`    | 设备不存在         | `No such device`                   |
| `ENOTDIR`   | 路径不存在         | `Not a directory`                  |
| `EISDIR`    | 是一个路径         | `Is a directory`                   |
| `EINVAL`    | 参数无效           | `Invalid argument`                 |
| `ENFILE`    | 文件表溢出         | `Too many open files in system`    |
| `EMFILE`    | 打开的文件过多     | `Too many open files`              |
| `EFBIG`     | 文件太大           | `File too large`                   |
| `ENOSPC`    | 剩余空间不足       | `No space left on device`          |
| `EROFS`     | 只读文件系统       | `Read-only file system`            |
| `ENOTEMPTY` | 非空目录           | `Directory not empty`              |

### 3.1. `POSIX` 标准

- 上述这些缩写的值大多来源于 `POSIX` 标准。
- 广泛用于操作系统（如 Linux 和 Unix）以及相关编程环境（如 Node.js、C 等）。
- 它们通常用于描述系统调用或操作失败的原因，帮助开发者调试程序或处理异常情况。
- 部分错误代码在不同操作系统中可能有不同的实现细节，但其含义基本一致。

## 4. 💻 demos.1 - 检查文件（文件夹）是否存在

::: code-group

```js [1.cjs]
const fs = require('fs').promises
const path = require('path')

async function checkFileExists(filename) {
  try {
    await fs.access(path.join(__dirname, filename), fs.constants.F_OK)
    // await fs.access(path.join(__dirname, filename)) // 等效写法
    console.log(`${filename} 存在`)
  } catch (err) {
    console.log(`${filename} 不存在`)
  }
}

const checkFileList = ['demo.txt', 'demo1', 'demo', 'demo2.txt', 'demo3']

checkFileList.forEach(async (filename) => {
  await checkFileExists(filename)
})

// 输出：
// demo.txt 存在
// demo1 存在
// demo 存在
// demo2.txt 存在
// demo3 不存在

// fs.access(path[, mode], callback)
// 在检查 path 是否存在的时候，不会区分是否是文件、还是文件夹。
// 比如这个示例中，文件和文件夹分别是：
// 文件：demo、demo.txt
// 文件夹：demo1、demos2.txt
```

```bash [tree]
$ tree
# .
# ├── 1.cjs
# ├── demo
# ├── demo.txt
# ├── demo1
# │   └── 1.txt
# └── demo2.txt
#     └── 1.txt
```

:::

## 5. 💻 demos.2 - 同时设置多个 `mode` 参数

::: code-group

```js [1.cjs]
const fs = require('fs').promises
const path = require('path')

/**
 * 查看 filename 是否存在且可写
 * @param {string} filename 文件名
 */
async function checkFile(filename) {
  try {
    await fs.access(
      path.join(__dirname, filename),
      fs.constants.F_OK | fs.constants.W_OK
    )
    console.log(`${filename} 存在，并且可写`)
  } catch (err) {
    console.log(err.message)
    if (err.code == 'ENOENT') {
      console.log(`${filename} 文件不存在`)
    } else if ((err.code = 'EPERM')) {
      console.log(`${filename} 文件存在，但不可写`)
    } else {
      console.log('未知错误')
    }
  }
}

const checkFileList = ['demo.txt', 'demo1.txt', 'demo2.txt']

checkFileList.forEach(async (item) => {
  await checkFile(item)
})

// 输出：
// ENOENT: no such file or directory, access '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0056. 文件检查/demos/2/demo.txt'
// demo.txt 文件不存在
// EACCES: permission denied, access '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0056. 文件检查/demos/2/demo2.txt'
// demo2.txt 文件存在，但不可写
// demo1.txt 存在，并且可写
```

```js [2.cjs（执行后创建测试文件 demo1.txt、demo2.txt）]
const fs = require('fs')
const path = require('path')

// 文件路径
const demo1Path = path.join(__dirname, 'demo1.txt')
const demo2Path = path.join(__dirname, 'demo2.txt')

// 创建 demo1.txt 并设置为可写
fs.writeFileSync(demo1Path, 'test', { encoding: 'utf8', mode: 0o666 }) // mode: 默认权限 (可读可写)
console.log('demo1.txt 已创建，并且是可写的')

// 创建 demo2.txt 并设置为不可写
fs.writeFileSync(demo2Path, 'test', { encoding: 'utf8', mode: 0o444 }) // mode: 只读权限
console.log('demo2.txt 已创建，并且是不可写的')

// 验证文件权限
fs.access(demo1Path, fs.constants.W_OK, (err) => {
  if (err) {
    console.log('demo1.txt 不可写')
  } else {
    console.log('demo1.txt 确实是可写的')
  }
})

fs.access(demo2Path, fs.constants.W_OK, (err) => {
  if (err) {
    console.log('demo2.txt 确实是不可写的')
  } else {
    console.log('demo2.txt 可写')
  }
})
```

```javascript [3.cjs（理解组合权限的书写）]
const fs = require('fs')

// 以 10 进制输出：
console.log(fs.constants.F_OK) // 0
console.log(fs.constants.W_OK) // 2
console.log(fs.constants.F_OK | fs.constants.W_OK) // 2

// 以 2 进制输出：
console.log(fs.constants.F_OK.toString(2)) // 0（相当于 0o000）
console.log(fs.constants.W_OK.toString(2)) // 10（相当于 0o010）
console.log((fs.constants.F_OK | fs.constants.W_OK).toString(2)) // 10（相当于 0o010）

// rwx 权限
// fs.constants.F_OK 检查文件是否存在（跟 rwx 没啥关系）
// fs.constants.R_OK 检查文件是否可读，相当于 r 读权限，八进制值是 4
// fs.constants.W_OK 检查文件是否可写，相当于 w 写权限，八进制值是 2
// fs.constants.X_OK 检查文件是否可执行，相当于 x 执行权限，八进制值是 1

// 组合权限：检查文件是否存在和文件是否可写
// 正确写法：使用按位或 | 运算进行组合
// fs.constants.F_OK | fs.constants.W_OK
// 0o000 | 0o010 = 0o010

// 如果某个位置没有权限，使用 0 表示，如果有权限，用 1 表示，按位或，相当于将 1 保留。

// fs.constants.F_OK | fs.constants.W_OK
// 这种写法等效于 fs.constants.W_OK
// 最终结果都是 2
// 但是从语义上来讲，最好还是写成 fs.constants.F_OK | fs.constants.W_OK 这种形式

// 数值上：
// fs.constants.F_OK | fs.constants.W_OK 的结果等于 fs.constants.W_OK，因为 F_OK 的值为 0。

// 语义上：
// fs.constants.F_OK | fs.constants.W_OK 同时检查文件是否存在和是否可写。
```

:::

## 6. 🔗 References

::: details

- https://zh.wikipedia.org/zh-hans/%E5%8F%AF%E7%A7%BB%E6%A4%8D%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%E6%8E%A5%E5%8F%A3
  - wiki - 可移植操作系统接口 - POSIX - Portable Operating System Interface
- https://nodejs.org/api/fs.html#fsaccesspath-mode-callback
  - `fs.access(path[, mode], callback)`
- https://nodejs.org/api/fs.html#file-access-constants
  - `File access constants`
  - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-14-22-24-24.png)

:::
