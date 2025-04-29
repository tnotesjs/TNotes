# [0015. app.locals 和 ctx.locals](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0015.%20app.locals%20%E5%92%8C%20ctx.locals)

<!-- region:toc -->

- [1. 🔗 Egg.js 官方文档 > 核心功能 > View 模板渲染](#1--eggjs-官方文档--核心功能--view-模板渲染)
- [2. 📒 `app.locals` 和 `ctx.locals` 概述](#2--applocals-和-ctxlocals-概述)
- [3. 🤔 `app.locals` 和 `ctx.locals` 只能用在 View 模板渲染中吗？](#3--applocals-和-ctxlocals-只能用在-view-模板渲染中吗)
- [4. 📒 `app.locals` - 全局共享数据](#4--applocals---全局共享数据)
- [5. 📒 `ctx.locals` - 跨中间件、控制器通信](#5--ctxlocals---跨中间件控制器通信)
- [6. 📒 自定义模块](#6--自定义模块)
- [7. 📒 最佳实践建议](#7--最佳实践建议)

<!-- endregion:toc -->

## 1. 🔗 Egg.js 官方文档 > 核心功能 > View 模板渲染

- https://www.eggjs.org/zh-CN/core/view
- ![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-11-22-28-22.png)

## 2. 📒 `app.locals` 和 `ctx.locals` 概述

- 在 Egg.js 中，`app.locals` 和 `ctx.locals` 主要用于 View 模板渲染的场景，并且官方文档也只有在“View 模板渲染”的文档中才提到它们。
- **`app.locals`**
  - `app.locals` 是挂载在应用实例上的全局变量，通常用于存储在整个应用程序生命周期内共享的数据。
  - **全局性**：`app.locals` 的数据对所有请求都可见。
  - **生命周期**：`app.locals` 的值在应用启动时初始化，并且在整个应用运行期间保持不变（除非手动修改）。
  - **典型用途**：
    - 存储全局配置信息，例如站点名称、版本号等。
    - 提供模板渲染时需要的全局变量。
- **`ctx.locals`**
  - `ctx.locals` 是挂载在每个请求上下文（`ctx`）中的局部变量，主要用于为当前请求提供特定的数据。
  - **请求级作用域**：`ctx.locals` 的数据仅对当前请求有效。
  - **生命周期**：`ctx.locals` 的值在每次请求开始时初始化，并在请求结束时销毁。
  - **典型用途**：
    - 动态传递与当前请求相关的数据到模板中。
    - 在中间件或控制器中设置模板渲染所需的变量。
- **经典应用场景 - View 模板渲染：**

::: code-group

```javascript [app.locals]
// 在 app/app.js 中设置全局变量
module.exports = (app) => {
  app.locals.siteName = 'My Awesome Site'
}
// 在 View 模板中可以直接访问：
// <h1>Welcome to <%= siteName %></h1>
```

```javascript [ctx.locals]
// 在控制器中设置局部变量
class HomeController extends Controller {
  async index() {
    const { ctx } = this
    ctx.locals.user = { name: 'John Doe' }
    await ctx.render('home.tpl')
  }
}
// 在模板中可以直接访问：
// <p>Hello, <%= user.name %>!</p>
```

:::

## 3. 🤔 `app.locals` 和 `ctx.locals` 只能用在 View 模板渲染中吗？

- 虽然 `app.locals` 和 `ctx.locals` 最常见的用途是为模板渲染提供数据，但它们并不仅限于此。
- **`app.locals`** 主要用于存储全局共享的数据，适合在模板渲染或其他需要全局访问的场景中使用。
- **`ctx.locals`** 主要用于存储与当前请求相关的数据，适合在模板渲染、中间件通信等场景中使用。

## 4. 📒 `app.locals` - 全局共享数据

- `app.locals` 适合用来在应用程序启动时，注入一些“全局级别的”共享数据。

::: code-group

```javascript [动态加载的全局数据]
// 某些全局数据可能需要在应用启动时从数据库或其他外部服务加载，并在整个生命周期内共享。
// 例如：
// 在 app.js 中加载全局菜单数据
module.exports = async (app) => {
  const menuData = await fetchMenuFromDatabase();
  app.locals.menu = menuData;
};

// 在模板中直接使用
<h2>Menu</h2>
<ul>
  <% for (const item of menu) { %>
    <li><%= item.name %></li>
  <% } %>
</ul>

// 或者在控制器中使用
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const menu = ctx.app.locals.menu; // 访问全局菜单数据
    ctx.body = { menu };
  }
}
```

```javascript [全局事件监听器]
// 你可以将全局事件监听器挂载到 app.locals，以便在不同模块中复用。
// 例如：
// 在 app.js 中定义全局事件监听器
module.exports = (app) => {
  const eventEmitter = new EventEmitter()
  app.locals.eventEmitter = eventEmitter

  eventEmitter.on('userLogin', (user) => {
    console.log(`User ${user.name} logged in`)
  })
}

// 在某个控制器中触发事件
class UserController extends Controller {
  async login() {
    const { ctx } = this
    const user = { name: 'John Doe' }
    ctx.app.locals.eventEmitter.emit('userLogin', user)
    ctx.body = { success: true }
  }
}
```

```javascript [全局配置管理]
// app.locals 可以用来存储一些全局配置信息，这些信息可以在应用的任何地方访问。
// 例如：
// 在 app.js 中设置全局配置
module.exports = (app) => {
  app.locals.config = {
    siteName: 'My Awesome Site',
    version: '1.0.0',
    debugMode: true,
  }
}

// 在中间件或控制器中使用
app.use(async (ctx, next) => {
  if (ctx.app.locals.config.debugMode) {
    console.log('Debug mode is enabled')
  }
  await next()
})

// ⚠️ 将常量数据写到 app.locals 身上其实并不不太好，还有更合适的做法。
```

:::

## 5. 📒 `ctx.locals` - 跨中间件、控制器通信

- `ctx.locals` 是请求独立的，在每次请求来的时候，都会重新走一遍，不同的请求之间互相没有关联。
- `ctx.locals` 适合用来在某次请求的整体流程中，在请求命中的中间件以及控制器之间传递一些“请求级别的”共享数据。

::: code-group

```javascript [跨中间件通信]
// ctx.locals 可用于在中间件之间传递请求相关的上下文数据。
// 例如：
// 中间件 A：记录请求开始时间
app.use(async (ctx, next) => {
  ctx.locals.startTime = Date.now()
  await next()
})

// 中间件 B：计算请求耗时
app.use(async (ctx, next) => {
  await next()
  const endTime = Date.now()
  const duration = endTime - ctx.locals.startTime
  console.log(`Request took ${duration}ms`)
})

// 控制器中也可以访问
class HomeController extends Controller {
  async index() {
    const { ctx } = this
    console.log(`Start time: ${ctx.locals.startTime}`)
    ctx.body = { message: 'Hello World' }
  }
}
```

```javascript [动态权限控制]
// 你可以在中间件中根据用户的角色或权限设置 ctx.locals，然后在后续逻辑中使用这些信息进行权限校验。
// 例如：
// 权限检查中间件
app.use(async (ctx, next) => {
  const user = await getUserFromSession(ctx) // 假设从会话中获取用户信息
  ctx.locals.userRole = user.role || 'guest'
  await next()
})

// 控制器中根据角色限制访问
class AdminController extends Controller {
  async dashboard() {
    const { ctx } = this
    if (ctx.locals.userRole !== 'admin') {
      ctx.status = 403
      ctx.body = { error: 'Access denied' }
      return
    }
    ctx.body = { message: 'Welcome to the admin dashboard' }
  }
}
```

```javascript [日志上下文增强]
// 在复杂的系统中，日志记录通常需要包含请求的上下文信息（如用户 ID、请求 ID 等）。
// 你可以利用 ctx.locals 来存储这些信息，便于统一记录日志。
// 例如：
// 日志中间件
app.use(async (ctx, next) => {
  const requestId = generateRequestId() // 假设生成唯一的请求 ID
  ctx.locals.requestId = requestId

  console.log(`[${requestId}] Request started`)
  await next()
  console.log(`[${requestId}] Request completed`)
})

// 在控制器中添加更多日志
class UserController extends Controller {
  async profile() {
    const { ctx } = this
    console.log(`[${ctx.locals.requestId}] Fetching user profile`)
    ctx.body = { profile: 'User data' }
  }
}
```

```javascript [API 数据预处理]
// 在 API 开发中，你可能需要对请求数据进行预处理，并将结果存储在 ctx.locals 中供后续逻辑使用。
// 例如：
// 数据预处理中间件
app.use(async (ctx, next) => {
  const rawBody = ctx.request.body
  ctx.locals.processedData = preprocessData(rawBody) // 假设这是一个数据预处理函数
  await next()
})

// 控制器中直接使用预处理后的数据
class DataController extends Controller {
  async save() {
    const { ctx } = this
    const processedData = ctx.locals.processedData
    await saveToDatabase(processedData) // 假设保存到数据库
    ctx.body = { success: true }
  }
}
```

:::

## 6. 📒 自定义模块

- 注：这里提到的“全局配置”主要是指一些在应用中写死的常量值，如数据库连接信息、环境变量等。
- 虽然你确实可以将这些常量配置一并写到 `app.locals` 身上，但是在实际开发中将这些写死的值单独封装到一个模块中获取更加合适。
  - 比如新建一个模块 `app/common/constants.js` 这里面专门用于存储全局常量配置。
- **🤔 为什么说走自定义模块的方式更加合适呢？**
  - **解耦性更强**
    - 通过模块导出的方式，不依赖框架的上下文对象（如 `app`），可以在任何地方（如工具函数、配置文件、第三方库）直接导入使用。
  - **类型友好**
    - 在 TypeScript 或使用 JSDoc 的项目中，模块导出的常量或配置可以更容易获得类型提示和代码补全。
    - 比如在 VSCode 中，能够方便地一键跳转，如果有 JSDoc 注释，也能方便地预览注释内容。
  - **避免污染全局**
    - 模块化的方式更符合“最小权限原则”（只导入需要的），避免全局变量可能带来的命名冲突或意外修改。
- **示例：**

::: code-group

```js [app/common/constants.js]
/**
 * 站点名称
 */
exports.SITE_NAME = 'My Awesome Site'

/**
 * 最大上传文件的大小
 */
exports.MAX_UPLOAD_SIZE = '10MB'

/**
 * 是否开启调试模式
 */
exports.DEBUG_MODE = true
```

```js [在控制器中使用]
const { SITE_NAME } = require('../common/constants')
class HomeController extends Controller {
  async index() {
    this.ctx.body = `Welcome to ${SITE_NAME}`
  }
}
```

```js [在配置文件中使用]
// config/config.default.js
const { DEBUG_MODE } = require('../app/common/constants')
exports.logger = {
  level: DEBUG_MODE ? 'DEBUG' : 'INFO',
}
```

:::

- **🤔 `app.locals` vs. `自定义模块` 如何选择？**
  - **静态常量或配置**：优先使用自定义模块（比如上面的 `app/common/constants.js`），通过 `require` 或 `import` 导入。
  - **动态全局数据**：使用 `app.locals`，尤其是需要在运行时更新的配置。
  - **模板渲染上下文**：如果模板引擎直接依赖 `app.locals`，可以保留它以简化代码。

## 7. 📒 最佳实践建议

- **全局级别的静态配置**：通过模块导出（如 `constants.js`）。
- **全局级别的动态数据**：通过 `app.locals` 存储。
- **请求级别的共享数据**：在中间件或控制器中通过 `ctx.locals` 存储。
- **View 模板上下文**：在渲染时合并 `app.locals` 和 `ctx.locals`。
