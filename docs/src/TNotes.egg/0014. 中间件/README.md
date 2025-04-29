# [0014. 中间件](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0014.%20%E4%B8%AD%E9%97%B4%E4%BB%B6)

<!-- region:toc -->

- [1. 📒 中间件概述](#1--中间件概述)
- [2. 💻 demos.1 - 认识默认的内置中间件](#2--demos1---认识默认的内置中间件)
- [3. 💻 demos.2 - 🧅 洋葱模型 - 理解中间件的执行顺序](#3--demos2----洋葱模型---理解中间件的执行顺序)

<!-- endregion:toc -->

## 1. 📒 中间件概述

- Egg.js 中的中间件（Middleware）是其核心机制之一，用于在请求和响应的生命周期中插入自定义逻辑。
- **🧅 洋葱模型**
  - Egg.js 中的中间件（Middleware）基于 **Koa 的洋葱模型**。
  - ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-10-20-23-36.png)
  - **执行顺序**：中间件按照 `config.middleware` 数组的顺序依次执行，形成“洋葱模型”：
    - **请求阶段**：按数组顺序进入中间件。
    - **响应阶段**：按数组逆序返回。
    - 例如，若中间件顺序为 `[A, B, C]`，则执行流程为：`A(请求) → B(请求) → C(请求) → 路由处理 → C(响应) → B(响应) → A(响应)`。
- **作用**：中间件允许开发者通过链式调用的方式处理 HTTP 请求，实现如日志记录、权限校验、错误处理等功能。
  - **请求预处理**：在路由处理前统一处理请求（如解析请求体、校验参数）。
  - **响应后处理**：在响应返回客户端前统一处理（如修改响应格式、添加响应头）。
  - **通用逻辑复用**：将公共逻辑（如鉴权、日志）抽离到中间件中，避免重复代码。
  - **错误处理**：捕获全局异常并返回统一错误格式。
- **常见使用场景**
  - **日志记录**：统计请求耗时、记录请求详情。
  - **权限校验**：检查用户登录状态、接口权限。
  - **错误处理**：统一捕获异常并返回友好的错误信息。
  - **性能监控**：统计接口 QPS、响应时间。
  - **CORS 跨域**：设置跨域响应头。
- **中间件的编写及配置**
  - **1️⃣ 中间件的编写规范**：在 Egg.js 中，中间件是一个返回异步函数的高阶函数，遵循 `(options, app) => async (ctx, next) => {}` 的结构。
  - **2️⃣ 中间件的配置**：在 `config/config.default.js` 中通过 `middleware` 数组声明需要加载的中间件，并可通过 `config` 传递参数。

::: code-group

```javascript{2} [1️⃣ 中间件的编写规范]
// app/middleware/logger.js
module.exports = (options, app) => {
  return async (ctx, next) => {
    const start = Date.now()
    await next() // 等待后续中间件执行完成
    const duration = Date.now() - start
    ctx.logger.info(`请求耗时: ${duration}ms`)
  }
}
// options 是中间件的配置数据
// app 是 Egg 全局应用对象
```

```javascript [2️⃣ 中间件的配置]
// config/config.default.js
// 默认在这个模块中配置全局中间件。
exports.middleware = ['logger', 'auth']

// 配置中间件参数，这些配置数据会传递到对应中间件的 options 参数中。
exports.logger = {
  level: 'info',
}
exports.auth = {
  enable: true,
  exclude: ['/public'], // 排除特定路径
}
```

:::

- **全局中间件 vs. 路由中间件**
  - 全局中间件：
    - 在 `config/config.default.js` 配置全局中间件。
    - 数组中的字符串对应中间件目录 `app/middleware/<中间件名称>.js` 下的文件名。
    - 数组中的顺序对应中间件的运行顺序。
  - 路由中间件：
    - 有些中间件并不需要全局使用，而是仅仅针对某个或某几个路由使用。
    - 此时，就不需要在 `config/config.default.js` 进行配置了，而是直接在路由中添加。

::: code-group

```js [app/router.js]
module.exports = (app) => {
  const { router } = app;
  const mymid = app.middleware.mymid(配置); // 得到中间件
  router.get("/", mymid, "home.index"); // 仅在该路由中应用中间件
  // 其他路由……
};
```

:::

- **中间件通用配置**
  - 在中间件的配置中，有一部分是通用配置，通用配置会影响 egg 是否运行中间件，通用配置包括：`enable`、`match`、`ignore`。
  - `enable`
    - boolean 类型
    - 表示是否启用中间件
  - `match` 和 `ignore`
    - 分别表示匹配和忽略，它们均支持多种类型的配置方式：字符串、字符串数组、正则表达式、函数。
    - 字符串或者字符串数组：
      - 当参数为字符串类型时，配置的是一个 url 的路径前缀，所有以配置的字符串作为前缀的 url 都会匹配上。
    - 正则：
      - 当参数为正则时，直接匹配满足正则验证的 url 的路径。
    - 函数：
      - 当参数为一个函数时，会将请求上下文传递给这个函数，最终取函数返回的结果（true/false）来判断是否匹配。
- **内置中间件**
  - egg 提供了一些内置的中间件，可通过 `app.config.coreMiddlewares` 查看。
  - 这些内置中间件将会和自定义的中间件配置合并，最终形成一个真正的中间件函数数组：`app.middleware`。
    - 最终起作用的是该数组中的一个个中间件函数。

## 2. 💻 demos.1 - 认识默认的内置中间件

- **打印默认的内置中间件**
- 使用 `npm init egg` 快速初始化一个 `simple` Egg.js 工程，然后在 `app/controller/home.js` 中打印一下 `app.config.coreMiddlewares` 查看 Egg.js 默认的内置中间件都有哪些。

```js [app/controller/home.js]
const { Controller } = require('egg')

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this
    console.log(
      '内置中间件 - app.config.coreMiddlewares',
      app.config.coreMiddlewares
    )
    // output:
    // 内置中间件 - app.config.coreMiddlewares [
    //   'meta',
    //   'siteFile',
    //   'notfound',
    //   'static',
    //   'bodyParser',
    //   'overrideMethod',
    //   'session',
    //   'securities',
    //   'i18n',
    //   'eggLoaderTrace'
    // ]
    ctx.body = 'hi, egg'
  }
}

module.exports = HomeController
```

| 中间件名称       | 作用描述                                                                                   |
|------------------|------------------------------------------------------------------------------------------|
| `meta`           | 提供性能监控功能，记录请求耗时等元信息。                                                   |
| `siteFile`       | 处理静态站点文件（如 `favicon.ico`），支持自定义静态资源路径。                               |
| `notfound`       | 处理未匹配到路由的请求，返回 `404` 响应。                                                   |
| `static`         | 提供静态资源服务，用于托管项目中的静态文件（如图片、CSS、JS）。                            |
| `bodyParser`     | 解析 HTTP 请求体，支持 JSON、表单数据等格式，将解析结果挂载到 `ctx.request.body`。         |
| `overrideMethod` | 支持通过请求头或参数覆盖 HTTP 方法（如将 POST 请求模拟为 DELETE 或 PUT）。                |
| `session`        | 提供会话管理功能，基于 Cookie 实现用户会话状态的存储与读取。                               |
| `securities`     | 提供安全防护功能，包括 CSRF 防护、XSS 防护、HSTS 等常见安全策略。                          |
| `i18n`           | 提供国际化支持，允许根据请求的语言偏好返回多语言内容。                                     |
| `eggLoaderTrace` | 用于调试和追踪 Egg.js 加载器的行为，记录加载过程中的详细信息，便于排查问题。               |

- 这些中间件共同构成了 Egg.js 的基础功能框架，满足了大多数 Web 应用的通用需求。
- 这些内置中间件按照数组顺序依次执行，确保功能的正确性和依赖关系，顺序不能随意更改。
- 我们可以通过配置文件 `config/config.default.js` 调整或禁用部分中间件。

## 3. 💻 demos.2 - 🧅 洋葱模型 - 理解中间件的执行顺序

::: code-group

```js [app/middleware/a_mid.js]
module.exports = (options, app) => {
  return async (ctx, next) => {
    console.log('A: 请求开始')
    await next() // 等待后续中间件执行
    console.log('A: 响应结束')
  }
}
```

```js [app/middleware/b_mid.js]
module.exports = (options, app) => {
  return async (ctx, next) => {
    console.log('B: 请求开始')
    await next() // 等待后续中间件执行
    console.log('B: 响应结束')
  }
}
```

```js [app/middleware/b_mid.js]
module.exports = (options, app) => {
  return async (ctx, next) => {
    console.log('C: 请求开始')
    await next() // 等待后续中间件执行
    console.log('C: 响应结束')
  }
}
```

```js{16-17,24-27} [config/config.default.js]
/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1741615691468_6783'

  // add your middleware config here
  config.middleware = ['aMid', 'bMid', 'cMid']

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  // disable default middleware i18n
  config.i18n = {
    enable: false,
  }

  return {
    ...config,
    ...userConfig,
  }
}

```

```js [app/controller/home.js]
const { Controller } = require('egg')

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this
    
    console.log('内置中间件列表：', app.config.coreMiddlewares)
    console.log('最终起作用的中间件处理函数列表：', app.middleware)

    // A: 请求开始
    // B: 请求开始
    // C: 请求开始
    // 内置中间件列表： [
    //   'meta',
    //   'siteFile',
    //   'notfound',
    //   'static',
    //   'bodyParser',
    //   'overrideMethod',
    //   'session',
    //   'securities',
    //   'i18n',
    //   'eggLoaderTrace'
    // ]
    // 最终起作用的中间件处理函数列表： [
    //   [AsyncFunction: meta] { _name: 'meta' },
    //   [AsyncFunction: siteFile] { _name: 'siteFile' },
    //   [AsyncFunction: notfound] { _name: 'notfound' },
    //   [Function (anonymous)] { _name: 'static' },
    //   [AsyncFunction: bodyParser] { _name: 'bodyParser' },
    //   [Function: overrideMethod] { _name: 'overrideMethod' },
    //   [AsyncFunction: session] { _name: 'session' },
    //   [Function (anonymous)] { _name: 'securities' },
    //   [AsyncFunction (anonymous)] { _name: 'eggLoaderTrace' },
    //   [AsyncFunction (anonymous)] { _name: 'aMid' },
    //   [AsyncFunction (anonymous)] { _name: 'bMid' },
    //   [AsyncFunction (anonymous)] { _name: 'cMid' },
    //   [Function: dispatch] {
    //     router: EggRouter {
    //       opts: [Object],
    //       methods: [Array],
    //       params: {},
    //       stack: [Array],
    //       app: [Object],
    //       head: [Function (anonymous)],
    //       options: [Function (anonymous)],
    //       get: [Function (anonymous)],
    //       put: [Function (anonymous)],
    //       patch: [Function (anonymous)],
    //       post: [Function (anonymous)],
    //       delete: [Function (anonymous)],
    //       all: [Function (anonymous)]
    //     }
    //   }
    // ]
    // C: 响应结束
    // B: 响应结束
    // A: 响应结束

    ctx.body = 'hi, egg'
  }
}

module.exports = HomeController
```

:::

- **注意**：Egg.js 框架的加载器会将文件名中的分隔符都转换为驼峰形式的变量名。
  - 中间件的命名，如果按照本 demo 这种下划线的写法来命名，那么在配置的时候不能直接写 `a_mid`，应该写 `aMid`。
- 默认内置的中间件都是启用的，如果有不需要的，可以自行在 `config/config.default.js` 中将 `enable` 字段设置为 `false` 禁用对应的中间件。
