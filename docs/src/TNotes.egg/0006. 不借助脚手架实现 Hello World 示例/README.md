# [0006. 不借助脚手架实现 Hello World 示例](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0006.%20%E4%B8%8D%E5%80%9F%E5%8A%A9%E8%84%9A%E6%89%8B%E6%9E%B6%E5%AE%9E%E7%8E%B0%20Hello%20World%20%E7%A4%BA%E4%BE%8B)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - Hello World 示例](#2--demos1---hello-world-示例)

<!-- endregion:toc -->

## 1. 📒 概述

- 搭建 egg 工程的两种方式：
  - 1️⃣ 使用 egg 脚手架 `egg-init`。
    - 在其他笔记 `TNotes.egg.0003` 中介绍过。
  - 2️⃣ 手动从 0 到 1 搭建。
- 本节介绍的是如何不借助 `egg-init` 脚手架来实现一个 Hello World 的 demo。
- 按照下面记录的流程，安装好必要的包，创建好相应的目录结构，简单写几行代码就完事儿了。

## 2. 💻 demos.1 - Hello World 示例

- 安装依赖，并初始化目录结构：

::: code-group

```bash [安装必要的包]
npm init -y # 初始化一个包
npm i egg # 安装 egg 核心库
npm i -D egg-bin # 安装官方提供的 egg CLI 工具，用于开发环境。
```

```json{7,14,17} [package.json]
{
  "name": "1",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "egg-bin dev"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "egg": "^3.30.1"
  },
  "devDependencies": {
    "egg-bin": "^6.13.0"
  }
}
```

```bash{2-7} [准备目录结构]
root
├── app  # 应用程序目录，几乎所有核心代码都在此目录。
│   ├── controller  # 控制器目录 - 这下边的每一个 .js 文件就是一个控制器，控制器是用于处理请求的。
│   │   └── home.js  # home 控制器 - 你可以通过 app.controller.home.xxx 访问到它里边的具体方法（action）。
│   └── router.js # 路由设置 - 将请求映射到控制器，在此决定 xxx 请求应该交由 xxx 控制器来的 xxx action 来处理。
├── config # 配置目录
│   └── config.default.js # 存放一些默认配置
└── package.json
# 高亮的部分是需要手动创建的。
# 🤔 为什么要按照这个结构来创建？
# 答：你可以理解为这是 Egg.js 的约定。
# 大家都遵循这样的约定来搭建，对于一些常见的业务需求，大家写出来的代码都差不太多。
# 多少统一了一些规范，降低了开发成本，以及项目交接时的沟通成本。
```

:::

- 10 几行的核心代码：

::: code-group

```js [app/router.js]
module.exports = (app) => {
  const { router, controller } = app
  router.get('/', controller.home.index)
}
```

```js [app/controller/home.js]
const Controller = require('egg').Controller

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'Hello world'
  }
}

module.exports = HomeController
```

```js [config/config.default.js]
exports.keys = 'TNotes.egg.0006'
// 这里的 keys 是你自己的 Cookie 安全字符串。
```

:::

- 启动开发环境：`npm run dev`
- 最终效果：
  - 访问：http://127.0.0.1:7001/
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-08-20-26-44.png)
- 通过上述流程，Egg.js 实现了从配置加载、服务启动、路由匹配到请求处理的完整生命周期管理。其遵循 MVC 模式的设计，使得代码结构清晰、职责分明，便于开发与维护。
- **🤔 `egg-bin dev` 都经历了哪些流程？**
  - **加载配置**
    - Egg.js 在启动时会自动读取 `config` 文件夹中的配置文件（如 `config.default.js`）以及 `app/router.js` 中的路由信息，并将这些配置解析后生成最终的运行时配置，存储在 `run` 文件夹中。
    - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-08-20-34-59.png)
  - **启动服务**
    - Egg.js 内部基于 Koa 创建了一个应用实例，并完成必要的初始化工作（如加载插件、中间件等）。
    - 随后，默认监听 `7001` 端口，等待接收 HTTP 请求。
    - 请求日志，错误日志啥的，会自动生成到 `logs` 文件夹中。（可以根据需要配置日志记录的规则）
    - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-08-20-38-49.png)
  - **路由匹配**
    - Egg.js 基于 Koa 的中间件机制，通过自身封装实现了路由功能。
    - 当请求到达时，框架会根据路由表中定义的路径和 HTTP 方法，将请求分发到对应的控制器（Controller）中的具体方法（Action）进行处理。
  - **请求处理（MVC 模式）**
    - **Controller**：
      - 控制器是一个类，继承自 Egg.js 提供的 `Controller` 基类，负责处理请求并返回响应。
    - **Action**：
      - Action 是控制器中的实例方法，每个方法对应一个具体的业务逻辑。
      - 例如，`controller.home.index` 表示 `home` 控制器中的 `index` 方法，用于处理特定的请求。
- **❌ 错误说法 - Egg.js 使用 `@koa/router` 实现路由功能。**
  - 这种说法是错误的。
  - 就本节搭建的 demo 来看，egg 并没有对 `@koa/router` 有依赖。
  - 你可以通过 `npm ls @koa/router` 验证 Egg.js 是否直接使用了 `@koa/router`。
    - `npm ls @koa/router` 是用来查看项目的依赖树的一条命令。
    - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-08-20-43-47.png)
    - 输出为空，说明 Egg.js 并未直接依赖该库。
  - Egg.js 的路由功能是框架自身封装的 ，并非直接使用 `@koa/router`。
  - 它基于 Koa 的中间件机制，结合自身的插件系统和约定式设计，提供了一套简单易用的路由 API。
  - 如果你希望了解更底层的实现细节，可自行查阅 Egg.js 的源码。
  - **⏰ 尚未读过……**
