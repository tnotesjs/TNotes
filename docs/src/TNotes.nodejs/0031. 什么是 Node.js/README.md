# [0031. 什么是 Node.js](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0031.%20%E4%BB%80%E4%B9%88%E6%98%AF%20Node.js)

<!-- region:toc -->

- [1. 📒 Node.js 和 JavaScript](#1--nodejs-和-javascript)
- [2. 📒 Node.js 是什么？](#2--nodejs-是什么)

<!-- endregion:toc -->

## 1. 📒 Node.js 和 JavaScript

- **学习 Node.js 的前提是掌握扎实的 JavaScript 基础知识**
- JavaScript
  - JS 是一种轻量级的脚本语言。
  - 它最初设计用于在浏览器中运行。
  - 主要用于操作和控制 HTML 元素。
  - 作为纯粹的客户端语言，JavaScript 在与服务器端交互时需要依赖其他后端技术（如 Java、C#、PHP 或 Python）来完成相关功能。
- Node.js
  - Node.js 的出现改变了这一局面。
  - 它提供了一个基于 Chrome V8 引擎的服务器端 JavaScript 运行时环境。
  - 使 JavaScript 代码能够脱离浏览器，在主机上直接运行。
  - 这为前端开发人员带来了巨大便利。
  - 因为他们可以利用熟悉的 JavaScript 语法进行全栈开发。
  - 同时提升开发效率和代码可维护性。

## 2. 📒 Node.js 是什么？

- **Node.js 简介**
  - Node.js 是一个开源的服务器端 JavaScript 运行时环境，基于 Google 的 Chrome V8 引擎开发。
  - 它使 JavaScript 代码能够在浏览器之外的主机上运行。
  - 首次发布于 **2009 年 5 月**，由谷歌工程师 Ryan Dahl 创建。
  - 使用与 Chrome、Microsoft Edge 和 Opera 等主流浏览器相同的 V8 JavaScript 引擎，在语言特性和性能上具有高度一致性。
- **Node.js 架构**
  - **由 3 个部分组成**
    - Node.js 的架构分为三个主要部分：**标准库**、**中间层** 和 **底层库**。
    - ![Node.js 架构图](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-03-00-38-54.png)
    - Node.js 的架构设计体现了分层思想。
    - 通过标准库、中间层和底层库的协同工作，实现了高性能、异步非阻塞的服务器端 JavaScript 运行环境。
    - V8 引擎负责 JavaScript 的解析和执行。
    - libuv 提供异步 I/O 支持。
    - 其他底层库则为特定功能（如 DNS、加密、压缩等）提供了强大的支撑。
  - **1️⃣ 标准库 (`Node standard library`)**
    - 提供了一系列可以直接调用的 API，用于开发人员构建应用程序。
    - 包含常见的模块：
      - `http` 模块：处理 HTTP 请求和响应。
      - `stream` 模块：管理数据流。
      - `fs` 模块：操作文件系统。
      - 其他模块（如 `events`、`crypto` 等）。
    - 开发者可以通过 JavaScript 直接调用这些 API，无需额外配置。
  - **2️⃣ 中间层 (`Node Bindings`)**
    - 在标准库和底层库之间起到桥梁作用。
    - 封装了底层库的实现细节，并向标准库提供基础 API 服务。
    - 由于底层库采用 C/C++ 实现，而标准库中的 JavaScript 代码无法直接与 C/C++ 通信，中间层解决了这一问题，实现了跨语言的交互。
  - **3️⃣ 底层库 (`C/C++ 实现`)**
    - 底层库是 Node.js 运行的核心，由 C/C++ 实现，提供了高性能的基础功能。
    - 主要包括以下组件：
      - **V8 引擎**:
        - Google 开源的 JavaScript 和 WebAssembly 引擎，使用 C++ 编写。
        - 用于解析和执行 JavaScript 代码，支持提前编译为原生机器码，显著提升运行效率。
        - 同时应用于 Chrome 浏览器和 Node.js。
      - **libuv**:
        - 专门为 Node.js 设计的跨平台异步 I/O 库，使用 C 语言编写。
        - 提供非阻塞的文件系统、DNS、网络、子进程、管道、信号、轮询和流式处理机制。
        - 节点通过 libuv 实现高效的事件驱动模型，确保高并发性能。
      - **C-ares**:
        - 用于处理异步 DNS 请求的库，使用 C 语言编写。
        - 对应 Node.js 中 `dns` 模块提供的 `resolve()` 系列方法。
      - **OpenSSL**:
        - 通用的加密库，支持 TLS 和 SSL 协议的实现。
        - 对应 Node.js 中的 `tls` 和 `crypto` 模块，用于安全的网络通信。
      - **zlib**:
        - 提供压缩和解压功能的底层模块，支持高效的数据传输和存储。
- **【补充】libuv 在 Node.js 中的重要作用**
  - **异步事件驱动机制**:
    - libuv 使用各平台的事件驱动模块实现异步操作。
    - 支持 Node.js 应用中的非文件 I/O 模块（如网络、信号等）。
    - 将事件及其对应的回调封装为 I/O 观察者，并放入底层事件驱动模块中。
    - 当事件触发时，libuv 负责执行与该事件关联的回调函数。
  - **线程池支持阻塞操作**:
    - libuv 实现了一个线程池，用于处理需要阻塞的操作。
    - 主要支持 Node.js 中的文件 I/O、DNS 查询以及用户自定义的异步任务。
    - 线程池的设计避免了阻塞主事件循环，确保高性能和并发能力。
