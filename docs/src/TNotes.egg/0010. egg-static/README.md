# [0010. egg-static](https://github.com/Tdahuyou/TNotes.egg/tree/main/notes/0010.%20egg-static)

<!-- region:toc -->

- [1. 🔗 `egg-static` github](#1--egg-static-github)
- [2. 🤔 为什么 Egg.js 能够映射静态资源？](#2--为什么-eggjs-能够映射静态资源)
- [3. 📒 `egg-static` 简介](#3--egg-static-简介)
- [4. 📒 `egg-static` 核心功能](#4--egg-static-核心功能)
- [5. 📒 `egg-static` 工作原理简介](#5--egg-static-工作原理简介)
- [6. 📒 使用 `egg-static` 的一些注意事项](#6--使用-egg-static-的一些注意事项)
- [7. 💻 demos.1 - `egg-static` 的基本使用](#7--demos1---egg-static-的基本使用)

<!-- endregion:toc -->

## 1. 🔗 `egg-static` github

https://github.com/eggjs/static

## 2. 🤔 为什么 Egg.js 能够映射静态资源？

- Egg.js 之所以能够映射静态资源，并非它本身具有这样的能力，而是它在内部使用了插件 `egg-static`。
- Egg.js 本身其实只是搭建了一个框架，制定了一套规范，其他的额外功能（静态资源映射、定时任务、消息订阅、后台逻辑等等）都是靠各种插件完成的。

## 3. 📒 `egg-static` 简介

- **`egg-static` 是 Egg.js 内置的静态资源服务插件**，遵循约定优于配置的原则，默认提供简单易用的静态资源服务。
- `egg-static` 是基于 [@eggjs/koa-static-cache](https://github.com/eggjs/koa-static-cache) 实现的。
- `egg-static` 基于 Koa 的中间件机制实现，允许开发者将项目中的静态文件（如 HTML、CSS、JavaScript、图片等）直接暴露给客户端访问。
- 通过 `egg-static` 插件，开发者无需额外配置复杂的静态资源服务器（如 Nginx），即可快速搭建一个支持静态资源的服务环境。这在开发阶段尤其有用，可以显著提高开发效率。
- `egg-static` 适合在开发环境和小型项目中使用，但在生产环境中建议结合 Nginx 或 CDN 提高性能。
- 通过配置文件，可以灵活地自定义静态资源目录、URL 前缀、缓存策略等。

## 4. 📒 `egg-static` 核心功能

- **提供静态资源服务**
  - `egg-static` 会自动将指定目录中的静态文件映射到 HTTP 请求路径。
  - 默认情况下，静态资源存放在 `app/public` 目录下，客户端可以通过 `/public/*` 路径访问这些资源。
    - 请求路径 `/public/*` 中 `*` 位置对应的请求将被映射到 `app/public` 目录。
    - eg. `GET /public/index.html` 将映射到 `app/public/index.html` 文件。
- **支持多环境配置**
  - 在开发环境中，`egg-static` 可以直接提供静态资源服务。
  - 在生产环境中，通常建议使用更高效的静态资源服务（如 Nginx 或 CDN），但 `egg-static` 仍然可以作为备用方案。
- **高度可配置**
  - 开发者可以通过配置文件（如 `config/config.default.js`）自定义：
    - 静态资源的目录
    - 缓存策略
    - 文件匹配规则
    - ……

## 5. 📒 `egg-static` 工作原理简介

`egg-static` 插件的核心是一个 Koa 中间件，它的工作流程如下：

- **拦截请求**：
  - 当客户端发起请求时，`egg-static` 中间件会检查请求路径是否匹配静态资源目录。
- **查找文件**：
  - 如果匹配成功，中间件会在静态资源目录中查找对应的文件。
- **返回文件**：
  - 如果找到文件，中间件会将文件内容返回给客户端，并设置适当的 HTTP 头（如 `Content-Type` 和缓存头）。
- **继续处理**：
  - 如果未找到文件，中间件会调用 `next()`，将请求交给后续的中间件或 Controller 处理。

## 6. 📒 使用 `egg-static` 的一些注意事项

- **安全性问题**
  - 静态资源目录中的文件会直接暴露给客户端，因此不要将敏感文件（如配置文件、源码等）放入静态资源目录。
  - 可以通过配置文件匹配规则限制可访问的文件类型。
- **性能问题**
  - 在高并发场景下，`egg-static` 的性能可能不如专业的静态资源服务器（如 Nginx）。
  - 如果需要更高的性能，建议结合反向代理（如 Nginx）或 CDN 使用。
- **路径问题**
  - 如果你修改了静态资源目录，请确保路径配置正确，否则可能会导致文件无法访问。
  - 如果没有特殊需求，通常是不需要修改静态资源目录的，就默认的 `public` 即可。

## 7. 💻 demos.1 - `egg-static` 的基本使用

- 实用 `npm init egg` 快速初始化一个简单（simple）的 Egg.js 工程结构。

::: code-group

```bash{2-5,8-12,15-16} [ap、config 目录]
app
├── assets # 静态资源目录 2
│   ├── index.css
│   ├── index.html
│   └── we.png
├── controller
│   └── home.js
├── public # 静态资源目录 1
│   ├── index.css
│   ├── index.html
│   └── we.png
└── router.js

config
├── config.default.js # 配置插件参数
└── plugin.js # 配置插件开关
```

```js{25-28} [config.default.js]
/* eslint valid-jsdoc: "off" */
const path = require('path')

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
  config.keys = appInfo.name + '_1741486377742_4102'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  // exports.static = {
  //   prefix: '/static/', // 修改静态资源的 URL 前缀
  //   dir: path.join(appInfo.baseDir, 'app/assets'), // 修改静态资源目录
  // }

  return {
    ...config,
    ...userConfig,
  }
}
```

```js [plugin.js]
/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
}
```

```html [app/public/index.html、app/assets/index.html]
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./index.css">
    <title>Document</title>
</head>
<body>
    <h1>hello we~</h1>
    <img src="./we.png" alt="">
</body>
</html>
```

```css{9} [app/public/index.css]
* {
    margin: 0;
    padding: 0;
}

h1 {
    width: 200px;
    text-align: center;
    background-color: lightblue;
}

img {
    display: block;
    width: 200px;
}
```

```css{9} [app/assets/index.css]
* {
    margin: 0;
    padding: 0;
}

h1 {
    width: 200px;
    text-align: center;
    background-color: lightyellow;
}

img {
    display: block;
    width: 200px;
}
```

:::

- 默认配置的最终效果：

::: swiper
![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-09-10-59-48.png)
![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-09-11-03-07.png)
![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-09-11-02-49.png)
:::

- 修改 prefix 和 dir 参数后的最终效果：

::: swiper
![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-09-11-00-13.png)
![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-09-11-00-41.png)
![](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-03-09-11-01-51.png)
:::

> 更多配置字段，请查阅 https://github.com/eggjs/koa-static-cache
