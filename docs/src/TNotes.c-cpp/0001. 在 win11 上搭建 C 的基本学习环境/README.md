# [0001. 在 win11 上搭建 C 的基本学习环境](https://github.com/Tdahuyou/TNotes.c-cpp/tree/main/notes/0001.%20%E5%9C%A8%20win11%20%E4%B8%8A%E6%90%AD%E5%BB%BA%20C%20%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%AD%A6%E4%B9%A0%E7%8E%AF%E5%A2%83)

<!-- region:toc -->

- [1. 📒 基础学习环境简介](#1--基础学习环境简介)
- [2. 📒 安装 GCC](#2--安装-gcc)
- [3. 🤔 安装 GCC 有什么用？](#3--安装-gcc-有什么用)
- [4. 📒 安装 VSCode 插件 - Code Runner](#4--安装-vscode-插件---code-runner)
- [5. 📒 查看 Code Runner 运行 C、CPP 的基本原理](#5--查看-code-runner-运行-ccpp-的基本原理)
- [6. 💻 demos.1 - 第一个 C 语言程序 - 在控制台打印 Hello World](#6--demos1---第一个-c-语言程序---在控制台打印-hello-world)

<!-- endregion:toc -->
- 安装好 GCC 和 VSCode 插件 - Code Runner；
- 编写一个 Hello World 程序，并理解 Code Runner 快速执行 .c 文件的基本原理；

## 1. 📒 基础学习环境简介

- 编译器：GCC
- IDE：VSCode
- 目标：能够运行 C、CPP 程序，学习 C、CPP 语言层面的一些基础知识。

## 2. 📒 安装 GCC

- https://blog.csdn.net/weixin_64064486/article/details/123940266
  - CSDN 文章 - Windows下GCC安装和使用
  - 作者：丸子爱学习！
  - 跟着文章中提到的步骤完成 GCC 的安装即可。
  - 注意：
    - 环境变量配置好以后，需要重启 VSCode。
    - VS Code 启动后会缓存系统环境变量，如果你在配置了 `PATH` 环境变量后没有重新启动 VS Code，它可能仍然无法找到 `gcc`。
- https://sourceforge.net/projects/mingw/files/
  - mingw 下载链接

## 3. 🤔 安装 GCC 有什么用？

- 这玩意儿是 C、C++ 的编译器，C、C++ 和 JS、Python 这些解释型语言不同，是需要编译成可执行程序（`.exe` 文件）执行的，简单来说 GCC 是用来跑咱们写的 C、C++ 的 demo 的。

## 4. 📒 安装 VSCode 插件 - Code Runner

- ![](assets/2025-01-21-11-22-51.png)
- 为了跟方便地直接在 VSCode 中运行 C 程序。
- 注意：
  - 如果不安装 GCC 的话，这玩意儿是没法直接用来跑 C、CPP 程序的。

## 5. 📒 查看 Code Runner 运行 C、CPP 的基本原理

- 打开 VSCode 设置，搜索 `code-runner.executorMap`，在配置文件中查看 `code-runner.executorMap` 的配置。
  - ![](assets/2025-01-21-11-33-53.png)
  - ![](assets/2025-01-21-11-34-45.png)
- `"c": "cd $dir && gcc $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt"`
  1. `cd $dir` 切换到对应的目录；
  2. `&& gcc $fileName -o $fileNameWithoutExt` 使用 gcc 对指定文件进行编译，并且输出的可执行文件名称和当前运行的文件名称相同；
  3. `&& $dir$fileNameWithoutExt` 运行编译后的可执行文件；

## 6. 💻 demos.1 - 第一个 C 语言程序 - 在控制台打印 Hello World

```c
#include <stdio.h>

int main()
{
  printf("Hello World\n");
  return 0;
}
```

- 运行：
  - ![](assets/2025-01-21-13-07-22.png)
- 分析 code runner 的执行原理：

```shell
# cd "c:\Users\Tdahuyou\Desktop\notes\c-cpp\0001. 在 win11 上搭建 C 的基本学习环境\demos\1\" && gcc 1.c -o 1 && "c:\Users\Tdahuyou\Desktop\notes\c-cpp\0001. 在 win11 上搭建 C 的基本学习环境\demos\1\"1
# Hello World

# "c": "cd $dir && gcc $fileName -o $fileNameWithoutExt && $dir$fileNameWithoutExt"
# 相当于执行了下面这些命令：
# 1. cd "c:\Users\Tdahuyou\Desktop\notes\c-cpp\0001. 在 win11 上搭建 C 的基本学习环境\demos\1\"
# 2. gcc 1.c -o 1
# 3. "c:\Users\Tdahuyou\Desktop\notes\c-cpp\0001. 在 win11 上搭建 C 的基本学习环境\demos\1\"1
```

- 在理解了原理之后，其实我们也可以手动输入执行命令：
  1. ![](assets/2025-01-21-13-13-26.png)
  2. ![](assets/2025-01-21-13-19-06.png)
  3. ![](assets/2025-01-21-13-22-18.png)
- 也可以直接合并：
  - powershell 环境：`gcc 1.c -o 1; .\1`
  - CMD 环境：`gcc 1.c -o 1 && .\1`
  - 后缀 .exe 可加可不加
