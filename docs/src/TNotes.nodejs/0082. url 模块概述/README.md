# [0082. url 模块概述](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0082.%20url%20%E6%A8%A1%E5%9D%97%E6%A6%82%E8%BF%B0)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - `url` 模块核心方法 `url.parse`、`url.format`、`url.resolve`](#2--demos1---url-模块核心方法-urlparseurlformaturlresolve)
- [3. 💻 demos.2 - 新版 URL API](#3--demos2---新版-url-api)
- [4. 🔗 References](#4--references)

<!-- endregion:toc -->

## 1. 📒 概述

- **`url` 模块**：
  - Node.js 的 `url` 模块是内置的核心模块之一，用于解析和处理 URL 字符串，适用于各种 URL 操作场景。
  - `url` 模块提供了一系列方法和类来帮助开发者轻松地操作 URL，包括解析、格式化和解析查询参数等。
  - 如果你需要解析、构建或操作 URL，可以根据需求选择使用旧版的 `url.parse()` 或新版的 `URL` 类。
- **主要作用**：
  - `url` 模块最常用的功能是解析 URL 字符串为对象，或者将 URL 对象转换回字符串。
- **新版的 URL 类**：
  - 从 Node.js 10 开始，推荐使用新的 `URL` 类来替代旧的 `url.parse()` 和 `url.format()` 方法。
  - 对于新项目，建议优先使用 `URL` 类，因为它更现代化且易于维护。
- **操作查询参数**：
  - 无论是使用旧版的 `url.parse()` 还是新版的 `URL` 类，都可以方便地操作查询参数。
  - 从管理查询参数这一需求角度来看，用 `url` 模块还是直接使用新版的 `URL` 类几乎是没差的。
- **兼容性和注意事项**：
  - **兼容性**：`url.parse()` 是旧版 API，虽然仍然可用，但官方推荐使用新的 `URL` 类。
  - **安全性**：在处理用户输入的 URL 时，请注意验证和清理数据，避免潜在的安全问题（如 XSS 攻击）。
  - **编码问题**：`URL` 类会自动处理 URL 编码和解码，因此比手动处理更安全。

## 2. 💻 demos.1 - `url` 模块核心方法 `url.parse`、`url.format`、`url.resolve`

| 方法名        | 作用                             |
| ------------- | -------------------------------- |
| `url.parse`   | 将 URL 字符串解析为一个 URL 对象 |
| `url.format`  | 将一个 URL 对象转换为 URL 字符串 |
| `url.resolve` | 解析相对路径，生成一个完整的 URL |

::: code-group

<<< ./demos/1/1.cjs {js 8,30} [parse、format]

<<< ./demos/1/2.cjs {js} [resolve]

:::

- `url.parse(urlString, [parseQueryString], [slashesDenoteHost])`
  - **作用**：将 URL 字符串解析为一个 URL 对象。
  - **参数**：
    - `urlString`：要解析的 URL 字符串。
    - `parseQueryString`（可选，默认为 `false`）：如果为 `true`，则会将查询字符串解析为键值对对象。
    - `slashesDenoteHost`（可选，默认为 `false`）：如果为 `true`，则会将 `//` 后的内容视为主机名。
  - **返回值**：一个包含 URL 各部分信息的对象。
- `url.format(urlObject)`
  - **作用**：将一个 URL 对象转换为 URL 字符串。
  - **参数**：
    - `urlObject`：一个包含 URL 各部分信息的对象。
  - **返回值**：一个完整的 URL 字符串。
- `url.resolve(from, to)`
  - **作用**：解析相对路径，生成一个完整的 URL。
  - **参数**：
    - `from`：基础 URL。
    - `to`：相对路径或目标 URL。
  - **返回值**：解析后的完整 URL。
- **URL 对象的属性说明**：

| 属性名 | 描述 |
| --- | --- |
| `auth` | 用户认证信息（如 `user:password`）。 |
| `hash` | 哈希部分（包括 `#`，如 `#section1`）。 |
| `host` | 主机名（包括端口号，如 `example.com:8080`）。 |
| `hostname` | 主机名（不包括端口号，如 `example.com`）。 |
| `href` | 完整的 URL 字符串。 |
| `path` | 路径部分（包括查询字符串，如 `/path/to/resource?name=John&age=30`）。 |
| `pathname` | 路径部分（如 `/path/to/resource`）。 |
| `port` | 端口号（如 `8080`）。 |
| `protocol` | 协议（如 `http:` 或 `https:`）。 |
| `query` | 查询参数（如果 `parseQueryString` 为 `true`，则为对象；否则为字符串）。 |
| `search` | 查询字符串（包括 `?`，如 `?name=John&age=30`）。 |
| `slashes` | 是否包含 `//`（通常为 `true`）。 |

## 3. 💻 demos.2 - 新版 URL API

::: code-group

<<< ./demos/2/1.cjs {js} [解析 url]

<<< ./demos/2/2.cjs {js} [操作查询参数]

:::

## 4. 🔗 References

::: details

- https://nodejs.org/api/url.html

:::
