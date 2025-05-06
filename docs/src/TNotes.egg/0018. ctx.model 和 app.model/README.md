# [0018. ctx.model 和 app.model](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0018.%20ctx.model%20%E5%92%8C%20app.model)

<!-- region:toc -->

- [1. 📝 概述](#1--概述)
- [2. 📒 `app.model`](#2--appmodel)
- [3. 📒 `ctx.model`](#3--ctxmodel)
- [4. 🤔 问：为什么设计成两个接口？](#4--问为什么设计成两个接口)
- [5. 🤔 问：为了保持统一，在整个项目中全都使用 `ctx.model.xxx` 或者 `app.model.xxx` 可以吗？](#5--问为了保持统一在整个项目中全都使用-ctxmodelxxx-或者-appmodelxxx-可以吗)

<!-- endregion:toc -->

## 1. 📝 概述

- 在 Egg.js 中，`app.model` 和 `ctx.model` 都是用来访问模型（Model）的，但它们的 **使用场景和来源不同**。
  - `ctx.model` 是 `app.model` 的一个便捷别名，在 Controller 中使用更方便；
  - 在 Service 中通常通过 `app.model` 调用模型；

| 特性 | `app.model` | `ctx.model` |
| --- | --- | --- |
| 来源 | Application 实例 | Context 实例 |
| 是否等价 | ✅ 是 | ✅ 是（底层是 `app.model` 的代理） |
| 使用场景 | Service、Helper、Middleware 等 | Controller |
| 推荐用法 | ✅ Service 中使用 `app.model` | ✅ Controller 中使用 `ctx.model` |

## 2. 📒 `app.model`

- `app.model`
  - `app` 是一个 `Application` 实例。
  - `app.model` 是由 [egg-sequelize](https://github.com/eggjs/egg-sequelize) 插件自动挂载的一个属性，它包含了所有你定义的 Sequelize 模型。
- 使用时机：
  - 在 **Service 类中**（因为 Service 的构造函数可以通过 `this.app` 获取到 app）
  - 在 **Helper 函数中**
  - 在 **中间件中**
  - 在 **自定义类或工具方法中**
- 示例：

```js
class CourseCategoryService extends Service {
  async getAllCategories() {
    const { app } = this
    return await app.model.CourseCategories.findAll() // ✅ 正确用法
  }
}
```

## 3. 📒 `ctx.model`

- `ctx.model`
  - `ctx` 是 `Context` 对象，代表一次请求的上下文。
  - `ctx.model` 是 `egg-sequelize` 提供的一个代理属性，**本质上也是指向 `app.model`**。
  - 它只是为了让开发者在 Controller 中更方便地访问模型。
- 使用时机：
  - 主要用于 **Controller 层**，处理 HTTP 请求时快速访问 Model
- 示例：

```js
class CourseCategoryController extends Controller {
  async getAll() {
    const { ctx } = this
    const categories = await ctx.model.CourseCategories.findAll() // ✅ 正确用法
    ctx.body = categories
  }
}
```

## 4. 🤔 问：为什么设计成两个接口？

- 可能是为了适应 Egg.js 的分层结构设计思想：
  - `app`：全局应用对象，适用于不需要依赖请求上下文的逻辑（如定时任务、后台服务）
  - `ctx`：请求级上下文对象，适用于每个 HTTP 请求的独立处理流程
- 因此：
  - 在 **Controller** 中推荐使用 `ctx.model`
  - 在 **Service** 中推荐使用 `app.model`

## 5. 🤔 问：为了保持统一，在整个项目中全都使用 `ctx.model.xxx` 或者 `app.model.xxx` 可以吗？

- 可以
- 不过从语义层面来讲，跟单次请求相关的逻辑应该使用 `ctx.model`（请求级），跟服务应用相关的应该使用 `app.model`（全局级）。
  - 每次一个请求打过来，通常都会丢给对应的 Controller 处理，因此说 Controller 是请求级的。
  - Service 中定义的服务相关的业务逻辑，可以被任何需要它的 Controller 调用，因此说 Service 是全局级的。
