# [0076. exec vs. spawn](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0076.%20exec%20vs.%20spawn)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)

<!-- endregion:toc -->

## 1. 📒 概述

| 特性 | `exec` | `spawn` |
| --- | --- | --- |
| **用途** | 短时间运行的简单命令 | 长时间运行的复杂命令 |
| **输出处理** | 缓冲输出，回调函数中获取结果 | 流式输出，实时传递到父进程 |
| **缓冲区限制** | 默认 200KB，可通过 `maxBuffer` 扩展 | 无缓冲区限制 |
| **适合场景** | 一次性命令（如 `ls`、`echo`） | 持续运行的命令（如 `vitepress dev`） |
| **交互支持** | 不适合需要交互的命令 | 支持交互，可通过 `stdio: 'inherit'` 实现 |
