# [0061. fs.constants](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0061.%20fs.constants)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - 打印 `fs.constants`](#2--demos1---打印-fsconstants)
- [3. 📒 文件打开模式 (File Open Modes)](#3--文件打开模式-file-open-modes)
- [4. 📒 文件类型 (File Types)](#4--文件类型-file-types)
- [5. 📒 文件权限 (File Permissions)](#5--文件权限-file-permissions)
- [6. 📒 权限检查 (Access Constants)](#6--权限检查-access-constants)
- [7. 📒 复制文件选项 (Copy File Options)](#7--复制文件选项-copy-file-options)
- [8. 📒 目录条目类型 (Directory Entry Types)](#8--目录条目类型-directory-entry-types)
- [9. 📒 符号链接类型 (Symbolic Link Types)](#9--符号链接类型-symbolic-link-types)

<!-- endregion:toc -->

## 1. 📒 概述

- `fs.constants` 是 Node.js 中的一个对象，提供了一组底层常量，这些常量与文件系统操作相关，用于控制文件系统的操作行为。
- 这些常量涵盖了文件打开模式、文件类型、权限检查、创建符号链接、复制选项等多个方面，开发者可以根据需要选择合适的常量来实现特定的功能。
- 它们通常作为参数传递给 `fs` 模块中的方法（如 `fs.open()`、`fs.access()` 等），以控制行为或指定选项。

## 2. 💻 demos.1 - 打印 `fs.constants`

::: code-group

```js [1.cjs]
const fs = require('fs')

console.log(fs.constants)

// 输出：
// [Object: null prototype] {
//   UV_FS_SYMLINK_DIR: 1,
//   UV_FS_SYMLINK_JUNCTION: 2,
//   O_RDONLY: 0,
//   O_WRONLY: 1,
//   O_RDWR: 2,
//   UV_DIRENT_UNKNOWN: 0,
//   UV_DIRENT_FILE: 1,
//   UV_DIRENT_DIR: 2,
//   UV_DIRENT_LINK: 3,
//   UV_DIRENT_FIFO: 4,
//   UV_DIRENT_SOCKET: 5,
//   UV_DIRENT_CHAR: 6,
//   UV_DIRENT_BLOCK: 7,
//   EXTENSIONLESS_FORMAT_JAVASCRIPT: 0,
//   EXTENSIONLESS_FORMAT_WASM: 1,
//   S_IFMT: 61440,
//   S_IFREG: 32768,
//   S_IFDIR: 16384,
//   S_IFCHR: 8192,
//   S_IFBLK: 24576,
//   S_IFIFO: 4096,
//   S_IFLNK: 40960,
//   S_IFSOCK: 49152,
//   O_CREAT: 512,
//   O_EXCL: 2048,
//   UV_FS_O_FILEMAP: 0,
//   O_NOCTTY: 131072,
//   O_TRUNC: 1024,
//   O_APPEND: 8,
//   O_DIRECTORY: 1048576,
//   O_NOFOLLOW: 256,
//   O_SYNC: 128,
//   O_DSYNC: 4194304,
//   O_SYMLINK: 2097152,
//   O_NONBLOCK: 4,
//   S_IRWXU: 448,
//   S_IRUSR: 256,
//   S_IWUSR: 128,
//   S_IXUSR: 64,
//   S_IRWXG: 56,
//   S_IRGRP: 32,
//   S_IWGRP: 16,
//   S_IXGRP: 8,
//   S_IRWXO: 7,
//   S_IROTH: 4,
//   S_IWOTH: 2,
//   S_IXOTH: 1,
//   F_OK: 0,
//   R_OK: 4,
//   W_OK: 2,
//   X_OK: 1,
//   UV_FS_COPYFILE_EXCL: 1,
//   COPYFILE_EXCL: 1,
//   UV_FS_COPYFILE_FICLONE: 2,
//   COPYFILE_FICLONE: 2,
//   UV_FS_COPYFILE_FICLONE_FORCE: 4,
//   COPYFILE_FICLONE_FORCE: 4
// }
```

```js [字段解释说明]
{
  // 符号链接类型
  "UV_FS_SYMLINK_DIR": 1, // 创建指向目录的符号链接。
  "UV_FS_SYMLINK_JUNCTION": 2, // 创建 Windows 上的目录联接（junction）。

  // 文件打开模式
  "O_RDONLY": 0, // 以只读方式打开文件。
  "O_WRONLY": 1, // 以只写方式打开文件。
  "O_RDWR": 2, // 以读写方式打开文件。

  // 目录条目类型
  "UV_DIRENT_UNKNOWN": 0, // 未知类型。
  "UV_DIRENT_FILE": 1, // 普通文件。
  "UV_DIRENT_DIR": 2, // 目录。
  "UV_DIRENT_LINK": 3, // 符号链接。
  "UV_DIRENT_FIFO": 4, // FIFO（命名管道）。
  "UV_DIRENT_SOCKET": 5, // 套接字文件。
  "UV_DIRENT_CHAR": 6, // 字符设备文件。
  "UV_DIRENT_BLOCK": 7, // 块设备文件。

  // 扩展名格式（用于标识文件类型）
  "EXTENSIONLESS_FORMAT_JAVASCRIPT": 0, // JavaScript 文件。
  "EXTENSIONLESS_FORMAT_WASM": 1, // WebAssembly 文件。

  // 文件类型掩码和标识
  "S_IFMT": 61440, // 用于提取文件类型的部分（掩码）。
  "S_IFREG": 32768, // 普通文件。
  "S_IFDIR": 16384, // 目录。
  "S_IFCHR": 8192, // 字符设备文件。
  "S_IFBLK": 24576, // 块设备文件。
  "S_IFIFO": 4096, // FIFO（命名管道）。
  "S_IFLNK": 40960, // 符号链接。
  "S_IFSOCK": 49152, // 套接字文件。

  // 文件打开选项
  "O_CREAT": 512, // 如果文件不存在，则创建文件。
  "O_EXCL": 2048, // 与 O_CREAT 一起使用，确保文件是新建的（如果文件已存在则报错）。
  "UV_FS_O_FILEMAP": 0, // 使用文件映射（仅限 Windows）。
  "O_NOCTTY": 131072, // 如果文件是终端设备，不将其设置为控制终端。
  "O_TRUNC": 1024, // 打开文件时清空文件内容。
  "O_APPEND": 8, // 打开文件时，所有写入操作追加到文件末尾。
  "O_DIRECTORY": 1048576, // 必须是一个目录，否则报错。
  "O_NOFOLLOW": 256, // 如果路径是符号链接，则报错。
  "O_SYNC": 128, // 同步 I/O 操作，确保数据立即写入磁盘。
  "O_DSYNC": 4194304, // 数据同步 I/O 操作（仅同步数据部分）。
  "O_SYMLINK": 2097152, // 打开符号链接本身，而不是其指向的目标文件。
  "O_NONBLOCK": 4, // 非阻塞模式打开文件。

  // 文件权限（所有者、所属组、其他用户）
  "S_IRWXU": 448, // 所有者拥有读、写和执行权限（rwx------）。
  "S_IRUSR": 256, // 所有者拥有读权限（r--------）。
  "S_IWUSR": 128, // 所有者拥有写权限（-w-------）。
  "S_IXUSR": 64, // 所有者拥有执行权限（--x------）。
  "S_IRWXG": 56, // 所属组拥有读、写和执行权限（---rwx---）。
  "S_IRGRP": 32, // 所属组拥有读权限（----r----）。
  "S_IWGRP": 16, // 所属组拥有写权限（-----w---）。
  "S_IXGRP": 8, // 所属组拥有执行权限（------x--）。
  "S_IRWXO": 7, // 其他用户拥有读、写和执行权限（-------rwx）。
  "S_IROTH": 4, // 其他用户拥有读权限（-------r--）。
  "S_IWOTH": 2, // 其他用户拥有写权限（--------w-）。
  "S_IXOTH": 1, // 其他用户拥有执行权限（---------x）。

  // 权限检查
  "F_OK": 0, // 检查文件是否存在。
  "R_OK": 4, // 检查文件是否可读。
  "W_OK": 2, // 检查文件是否可写。
  "X_OK": 1, // 检查文件是否可执行（在 Windows 上始终返回 true）。

  // 复制文件选项
  "UV_FS_COPYFILE_EXCL": 1, // 如果目标文件已存在，则报错。
  "COPYFILE_EXCL": 1, // 同上（UV_FS_COPYFILE_EXCL 的别名）。
  "UV_FS_COPYFILE_FICLONE": 2, // 尝试使用“克隆”操作复制文件（如果支持）。
  "COPYFILE_FICLONE": 2, // 同上（UV_FS_COPYFILE_FICLONE 的别名）。
  "UV_FS_COPYFILE_FICLONE_FORCE": 4, // 强制使用“克隆”操作复制文件（即使不支持也会尝试）。
  "COPYFILE_FICLONE_FORCE": 4 // 同上（UV_FS_COPYFILE_FICLONE_FORCE 的别名）。
}
```

:::

## 3. 📒 文件打开模式 (File Open Modes)

这些常量用于 `fs.open()` 方法，指定文件的打开模式。

| **字段** | **值** | **含义** |
| --- | --- | --- |
| `O_RDONLY` | `0` | 以只读方式打开文件。 |
| `O_WRONLY` | `1` | 以只写方式打开文件。 |
| `O_RDWR` | `2` | 以读写方式打开文件。 |
| `O_CREAT` | `512` | 如果文件不存在，则创建文件。 |
| `O_EXCL` | `2048` | 与 `O_CREAT` 一起使用，确保文件是新建的（如果文件已存在则报错）。 |
| `O_TRUNC` | `1024` | 打开文件时清空文件内容。 |
| `O_APPEND` | `8` | 打开文件时，所有写入操作追加到文件末尾。 |
| `O_NOCTTY` | `131072` | 如果文件是终端设备，不将其设置为控制终端。 |
| `O_DIRECTORY` | `1048576` | 必须是一个目录，否则报错。 |
| `O_NOFOLLOW` | `256` | 如果路径是符号链接，则报错。 |
| `O_SYNC` | `128` | 同步 I/O 操作，确保数据立即写入磁盘。 |
| `O_DSYNC` | `4194304` | 数据同步 I/O 操作（仅同步数据部分）。 |
| `O_SYMLINK` | `2097152` | 打开符号链接本身，而不是其指向的目标文件。 |
| `O_NONBLOCK` | `4` | 非阻塞模式打开文件。 |

## 4. 📒 文件类型 (File Types)

这些常量用于标识文件的类型，通常与 `fs.stat()` 返回的 `mode` 值结合使用。

| **字段**   | **值**  | **含义**                         |
| ---------- | ------- | -------------------------------- |
| `S_IFMT`   | `61440` | 用于提取文件类型的部分（掩码）。 |
| `S_IFREG`  | `32768` | 普通文件。                       |
| `S_IFDIR`  | `16384` | 目录。                           |
| `S_IFCHR`  | `8192`  | 字符设备文件。                   |
| `S_IFBLK`  | `24576` | 块设备文件。                     |
| `S_IFIFO`  | `4096`  | FIFO（命名管道）。               |
| `S_IFLNK`  | `40960` | 符号链接。                       |
| `S_IFSOCK` | `49152` | 套接字文件。                     |

## 5. 📒 文件权限 (File Permissions)

这些常量用于设置或检查文件的权限。

| **字段**  | **值** | **含义**                                       |
| --------- | ------ | ---------------------------------------------- |
| `S_IRWXU` | `448`  | 所有者拥有读、写和执行权限（`rwx------`）。    |
| `S_IRUSR` | `256`  | 所有者拥有读权限（`r--------`）。              |
| `S_IWUSR` | `128`  | 所有者拥有写权限（`-w-------`）。              |
| `S_IXUSR` | `64`   | 所有者拥有执行权限（`--x------`）。            |
| `S_IRWXG` | `56`   | 所属组拥有读、写和执行权限（`---rwx---`）。    |
| `S_IRGRP` | `32`   | 所属组拥有读权限（`----r----`）。              |
| `S_IWGRP` | `16`   | 所属组拥有写权限（`-----w---`）。              |
| `S_IXGRP` | `8`    | 所属组拥有执行权限（`------x--`）。            |
| `S_IRWXO` | `7`    | 其他用户拥有读、写和执行权限（`-------rwx`）。 |
| `S_IROTH` | `4`    | 其他用户拥有读权限（`-------r--`）。           |
| `S_IWOTH` | `2`    | 其他用户拥有写权限（`--------w-`）。           |
| `S_IXOTH` | `1`    | 其他用户拥有执行权限（`---------x`）。         |

## 6. 📒 权限检查 (Access Constants)

这些常量用于 `fs.access()` 方法，检查文件或目录的访问权限。

| **字段** | **值** | **含义**                                             |
| -------- | ------ | ---------------------------------------------------- |
| `F_OK`   | `0`    | 检查文件是否存在。                                   |
| `R_OK`   | `4`    | 检查文件是否可读。                                   |
| `W_OK`   | `2`    | 检查文件是否可写。                                   |
| `X_OK`   | `1`    | 检查文件是否可执行（在 Windows 上始终返回 `true`）。 |

## 7. 📒 复制文件选项 (Copy File Options)

这些常量用于 `fs.copyFile()` 方法，指定复制文件的行为。

| **字段** | **值** | **含义** |
| --- | --- | --- |
| `UV_FS_COPYFILE_EXCL` | `1` | 如果目标文件已存在，则报错。 |
| `COPYFILE_EXCL` | `1` | 同上（`UV_FS_COPYFILE_EXCL` 的别名）。 |
| `UV_FS_COPYFILE_FICLONE` | `2` | 尝试使用“克隆”操作复制文件（如果支持）。 |
| `COPYFILE_FICLONE` | `2` | 同上（`UV_FS_COPYFILE_FICLONE` 的别名）。 |
| `UV_FS_COPYFILE_FICLONE_FORCE` | `4` | 强制使用“克隆”操作复制文件（即使不支持也会尝试）。 |
| `COPYFILE_FICLONE_FORCE` | `4` | 同上（`UV_FS_COPYFILE_FICLONE_FORCE` 的别名）。 |

## 8. 📒 目录条目类型 (Directory Entry Types)

这些常量用于标识目录条目的类型，通常与 `fs.Dirent` 对象结合使用。

| **字段**            | **值** | **含义**           |
| ------------------- | ------ | ------------------ |
| `UV_DIRENT_UNKNOWN` | `0`    | 未知类型。         |
| `UV_DIRENT_FILE`    | `1`    | 普通文件。         |
| `UV_DIRENT_DIR`     | `2`    | 目录。             |
| `UV_DIRENT_LINK`    | `3`    | 符号链接。         |
| `UV_DIRENT_FIFO`    | `4`    | FIFO（命名管道）。 |
| `UV_DIRENT_SOCKET`  | `5`    | 套接字文件。       |
| `UV_DIRENT_CHAR`    | `6`    | 字符设备文件。     |
| `UV_DIRENT_BLOCK`   | `7`    | 块设备文件。       |

## 9. 📒 符号链接类型 (Symbolic Link Types)

这些常量用于创建符号链接时指定类型。

| **字段**                 | **值** | **含义**                                |
| ------------------------ | ------ | --------------------------------------- |
| `UV_FS_SYMLINK_DIR`      | `1`    | 创建指向目录的符号链接。                |
| `UV_FS_SYMLINK_JUNCTION` | `2`    | 创建 Windows 上的目录联接（junction）。 |
