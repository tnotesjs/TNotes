# [0002. Hello World 示例](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0002.%20Hello%20World%20%E7%A4%BA%E4%BE%8B)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 准备必要的环境](#2--准备必要的环境)
- [3. 💻 安装 Egg.js 脚手架工具](#3--安装-eggjs-脚手架工具)
- [4. 💻 项目初始化](#4--项目初始化)
- [5. 💻 demos.1 - 实现 `/hello` 接口](#5--demos1---实现-hello-接口)
- [6. 📒 理解 `Router` 和 `Controller`](#6--理解-router-和-controller)
- [7. 📒 理解 `package.json` 中的 `start`、`stop`、`dev` 命令](#7--理解-packagejson-中的-startstopdev-命令)

<!-- endregion:toc -->

## 1. 📒 概述

- 这篇笔记介绍了基于 Egg.js 搭建一个简单的 "Hello World" 示例的详细步骤。
- 在项目搭建的过程中，会用到官方的脚手架 `egg-init`。
- 需要实现的 demo 要求：
  - 实用 `egg-init` 初始化好工程。
  - 实现一个基本的 API 接口 `/hello`，浏览器访问这个接口，返回 "Hello World"。
- 本节要实现的是一个非常简单的示例，借此示例来：
  - 了解 Egg.js 的基本目录结构
  - 了解 router 和 controller 的基本作用和写法
  - 了解几个默认的命令的基本使用

## 2. 💻 准备必要的环境

- 在开始之前，请确保你的开发环境满足以下要求：
  1. 已安装 Node.js（建议使用 LTS 版本，如 v16、v18、v20）。
  2. 已安装 `npm` 或 `yarn` 或 `pnpm` 包管理工具。（或者其他的包管理工具）
- 可以通过以下命令检查版本：

```bash
node -v
npm -v
```

- ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-08-00-06-38.png)

## 3. 💻 安装 Egg.js 脚手架工具

- Egg.js 提供了一个官方的脚手架工具 `egg-init`，用于快速生成项目结构。
- 运行以下命令全局安装 `egg-init`：

```bash
npm install egg-init -g

# 安装完成后，可以通过以下命令验证是否成功：
egg-init --version
```

- `2025年3月6日16:51:12` 目前的最新版本是 `3.1.0`。
- ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-06-16-51-05.png)

## 4. 💻 项目初始化

- 使用 `egg-init` 创建一个新的 Egg.js 项目。假设项目名称为 `helloWorld`：

```bash {2,11,12,16}
# 使用 egg-init 创建一个新的 Egg.js 项目，目名称为 helloWorld。
egg-init helloWorld --type=simple
# 执行后一路回车。


# --type=simple 表示使用简单模板。
# 执行命令后，脚手架会自动生成项目文件夹和初始代码。


# 切换到项目目录，并安装依赖。
cd helloWorld
npm i


# 启动开发服务器（支持热更）
npm run dev

# 启动成功后，终端会显示类似以下内容：
# egg started on http://127.0.0.1:7001
# 此时，你可以打开浏览器访问 http://127.0.0.1:7001，默认会看到一个欢迎页面。
```

- ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-08-00-07-42.png)
- 其实从初始化好的工程来看，已经实现了一个默认的首页访问接口 `/`。
- 要实现本节要求的 demo，找葫芦画瓢新增一个 `/hello` 接口即可，写起来也没几行代码。

## 5. 💻 demos.1 - 实现 `/hello` 接口

> 注：其中高亮的部分是新增的，其余是初始化好的工程中默认的内容。

::: code-group

```javascript {7} [app/router.js]
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app
  router.get('/', controller.home.index)
  router.get('/hello', controller.home.hello) // 定义路由
}

// 这里定义了一个 GET 请求路径 /hello
// 并将其映射到 controller.home.hello 方法
```

```javascript {10-12} [app/controller/home.js]
const { Controller } = require('egg')

class HomeController extends Controller {
  async index() {
    const { ctx } = this
    ctx.body = 'hi, egg'
  }

  // 创建对应的控制器方法
  async hello() {
    this.ctx.body = 'Hello World'
  }
}

module.exports = HomeController
```

:::

- 现在我们去访问 `http://127.0.0.1:7001/hello` 就能看到 "Hello World" 了。
- ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-08-00-17-57.png)

## 6. 📒 理解 `Router` 和 `Controller`

- 完成上述步骤后，项目的目录结构如下：

```bash {1-4}
├── app
│   ├── controller
│   │   └── home.js       # 控制器，包含 index 和 hello 方法
│   ├── router.js         # 路由配置
├── config
│   ├── config.default.js # 默认配置
│   └── plugin.js         # 插件配置
├── logs                  # 日志文件
├── test                  # 测试代码
├── typing                # 类型定义
├── package.json          # 项目依赖
└── README.md             # 项目说明文档
```

- 会发现 Egg.js 中的目录结构是非常清晰的，按照约定好的规则来编写代码也显得非常自然。
- `router.js`
  - 用于定义 URL 和 Controller 方法之间的映射关系。
  - `xxx/xxx` 接口需要交给 `xxx` 控制器来处理。
  - 示例：`router.get('/hello', controller.home.hello)`
    - 表示通过 `get` 请求访问 `/hello` 接口时，将交给控制器 `home` 下的 `hello` Action 方法来处理。
    - 最终处理请求的是对应控制器中具体的 Action 方法。
- `controller`
  - 我们常说的 MVC 模式中的字母 C 指的就是 Controller 控制器的意思。
  - 控制器是专门负责处理用户请求的。
  - 控制器通常用于解析请求参数、调用 Service 层逻辑，并返回响应数据。
- `Service`
  - 在这个 demo 中没有体现出来，它是业务逻辑的核心，负责封装复杂的业务处理逻辑，供 Controller 调用。
  - 跟具体业务相关的代码直接丢到这里边统一管理。

## 7. 📒 理解 `package.json` 中的 `start`、`stop`、`dev` 命令

| 命令 | 工具 | 运行模式 | 是否后台运行 | 热更新支持 | 使用场景 |
| --- | --- | --- | --- | --- | --- |
| `start` | `egg-scripts` | 生产环境 | 是 | 否 | 生产环境服务启动 |
| `stop` | `egg-scripts` | 生产环境 | - | - | 停止生产环境服务 |
| `dev` | `egg-bin` | 开发环境 | 否 | 是 | 开发调试 |

::: code-group

```json {23-25} [package.json]
{
  "name": "helloWorld",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "egg": {
    "declarations": true
  },
  "dependencies": {
    "egg": "^3.17.5",
    "egg-scripts": "2"
  },
  "devDependencies": {
    "egg-bin": "6",
    "egg-mock": "5",
    "eslint": "8",
    "eslint-config-egg": "13"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "egg-scripts start --daemon --title=egg-server-helloWorld",
    "stop": "egg-scripts stop --title=egg-server-helloWorld",
    "dev": "egg-bin dev",
    "test": "npm run lint -- --fix && npm run test:local",
    "test:local": "egg-bin test",
    "cov": "egg-bin cov",
    "lint": "eslint .",
    "ci": "npm run lint && npm run cov"
  },
  "repository": {
    "type": "git",
    "url": ""
  },
  "author": "",
  "license": "MIT"
}
```

```json [start]
"start": "egg-scripts start --daemon --title=egg-server-helloWorld"

// 功能：
// 启动生产环境下的 Egg.js 应用程序
// 使用 egg-scripts 工具来启动服务，并以守护进程（daemon）的方式运行。
// 也就是说不需要实用 pm2 来启动服务
// egg 的主进程在某个进程挂掉之后，会将其重启，完成守护工作。



// 参数说明：
// 1️⃣ egg-scripts start
// 这是 Egg.js 提供的脚本工具，用于启动应用程序。
// 2️⃣ --daemon
// 表示以守护进程的方式运行服务。
// 这种方式会将应用放到后台运行，不会占用当前终端。
// 3️⃣ --title=egg-server-helloWorld
// 为守护进程指定一个标题（title），方便后续通过标题识别和管理该进程。
// 例如，在停止服务时可以通过这个标题找到对应的进程。



// 应用场景：
// 主要用于生产环境，确保服务能够稳定运行并支持后台执行。
// 当然，在丢到生产环境之前，需要先 build 出包。



// 补充：
// 在本地开发环境下，通常直接 dev 就行了。
// 你也可以试着在本地 npm start 一下看看效果，会发现执行之后就退出终端了，但是服务还是在运行的，只不过隐藏到后台去跑了。
// 如果想要停止的话，直接 npm stop 即可。
```

```json [stop]
"stop": "egg-scripts stop --title=egg-server-helloWorld"

// 功能：
// 停止由 egg-scripts start 启动的服务。
// 通过指定的标题（--title）找到对应的守护进程并终止它。



// 参数说明：
// 1️⃣ egg-scripts stop
// 这是 Egg.js 提供的脚本工具，用于停止服务。
// 2️⃣ --title=egg-server-helloWorld
// 与 start 命令中的标题一致，用于定位需要停止的进程。



// 应用场景：
// 当你需要优雅地关闭生产环境中的服务时使用。
// 例如，在部署新版本之前，先停止旧版本的服务。



// 补充：
// 这里所谓的“优雅地关闭生产环境中的服务”是指在停止服务时确保所有正在进行的请求能够被正确处理完毕，而不是直接强制终止进程。
// 如果粗暴的直接杀死进程（kill -9 或类似操作）可能会导致的问题：
// 正在处理的请求会被立即中断，可能导致客户端收到错误响应（如 502 Bad Gateway）。
// 数据库事务可能未提交或回滚，导致数据不一致。
// 日志记录可能未完成，丢失重要的调试信息。
// 如果服务有清理逻辑（如释放资源、保存状态等），这些逻辑将无法执行。
// ……


// ⏰ TODO：
// ⏰ Egg.js 是如何确保服务在停止前完成必要的清理工作？具体做法是如何实现的？
```

```json [dev]
"dev": "egg-bin dev"

// 功能：
// 启动开发环境下的 Egg.js 应用程序 。
// 使用 egg-bin 工具来运行服务，并提供热更新（Hot Reload）功能，便于开发调试。



// 参数说明：
// 1️⃣ egg-bin dev
// 这是 Egg.js 提供的开发工具，专门用于开发环境。
// 它会在本地启动服务，并监听代码的变化，自动重启服务以反映最新的修改。

// 应用场景：
// 主要用于开发阶段，开发者可以快速查看代码改动的效果，而无需手动重启服务。
```

:::
