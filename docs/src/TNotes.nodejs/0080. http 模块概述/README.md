# [0080. http 模块概述](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0080.%20http%20%E6%A8%A1%E5%9D%97%E6%A6%82%E8%BF%B0)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - `server` 对象](#2--demos1---server-对象)
- [3. 💻 demos.2 - `response` 对象](#3--demos2---response-对象)
- [4. 💻 demos.3 - 响应 html 文件](#4--demos3---响应-html-文件)
- [5. 💻 demos.4 - 响应媒体资源](#5--demos4---响应媒体资源)
- [6. 💻 demos.5 - 重定向](#6--demos5---重定向)
- [7. 💻 demos.6 - `request` 对象](#7--demos6---request-对象)

<!-- endregion:toc -->

## 1. 📒 概述

- http 模块中主要有 `server` 对象、`response` 对象和 `request` 对象，也是本节笔记主要介绍的内容。

## 2. 💻 demos.1 - `server` 对象

- `server` 对象用来创建一个服务。
- 在 Node.js 中，使用 `http` 模块中的 `createServer()` 方法，可以创建一个 `server` 对象
  - `const server = require('http').createServer()`
- `server` 对象中主要使用的方法有 `listen()` 方法和 `close()` 方法，它们分别控制着服务器的启动和结束。
  - `server.listen(port)` 启动服务器，并监听指定端口。
    - 端口 `port` 是计算机与计算机之间信息的通道。
    - 计算机中的端口从 `0` 开始，一共有 `65535` 个端口。
  - `server.close()` 关闭服务器。

::: code-group

```js [1.cjs]
// 引入 http 模块并创建 server 对象
const http = require('http')

// 辅助函数：获取当前时间的格式化字符串（亚洲上海本地时间）
const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}

const server = http.createServer((req, res) => {
  // 设置响应头，指定字符编码为 UTF-8，以防乱码
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
  // 返回中文消息
  res.end('服务器正在运行中...\n')
})

// 启动服务器并监听指定端口
const PORT = 23523
server.listen(PORT, () => {
  console.log(
    `${getCurrentTime()} 服务器已启动，监听地址是 http://127.0.0.1:${PORT}`
  )
  console.log(`${getCurrentTime()} 服务器将在10秒后关闭...`)
  // 定时关闭服务器
  setTimeout(() => {
    server.close(() => {
      console.log(`${getCurrentTime()} 服务器已成功关闭`)
    })
  }, 10 * 1000)
})

// 输出：
// 2025/4/24 20:57:50 服务器已启动，监听地址是 http://127.0.0.1:23523
// 2025/4/24 20:57:50 服务器将在10秒后关闭...
// 2025/4/24 20:58:00 服务器已成功关闭
```

:::

- 在服务启动期间访问：`http://127.0.0.1:23523`
  - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-24-21-07-01.png)
- 上述程序的大致流程：
  - 引入 `http` 模块并创建服务器对象。
  - 服务器接收到请求时，设置响应头 `Content-Type` 为 `text/plain; charset=utf-8`
    - `Content-Type` 设置为文本类型
    - `text/plain` 设置为纯文本类型
    - `charset=utf-8` 设置为 UTF-8 编码，以避免乱码。
  - `res.end('服务器正在运行中...\n')`
    - 并返回中文消息 "服务器正在运行中..."。
    - 这里的 `res` 其实就是 `response` 对象。
  - 服务器监听端口 `23523`，启动后输出监听地址。
    - `we` 的生日是 `2023.05.23`
  - 启动后 10 秒自动关闭服务器。
  - 关闭服务器后输出 "服务器已成功关闭"。

## 3. 💻 demos.2 - `response` 对象

- `response` 对象用于向客户端发送响应。
- 主要方法：
  - `writeHead(statusCode [,statusMessage]​ [,headers])`：设置响应头。
    - `statusCode`：数字类型的 HTTP 状态码。
    - `statusMessage`：HTTP 状态码对应的消息。
    - `headers`：响应头对象。
  - `end([data], [encoding])`：结束响应并发送数据到客户端。
    - `data`：可选参数，执行完毕后要发送的字符。
    - `encoding`：可选参数，数据编码格式。

::: code-group

```js [1.cjs]
// 创建 Web 服务器，并监听 23523 端口
require('http')
  .createServer(function (request, response) {
    // 返回响应内容
    response.writeHead(200, { 'Content-Type': 'text/html' })
    response.end('<h1>Hello,Node.js</h1>')
  })
  .listen(23523, function () {
    console.log('服务器监听地址是 http://127.0.0.1:23523')
  })
```

:::

- ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-25-10-41-40.png)

## 4. 💻 demos.3 - 响应 html 文件

::: code-group

```js [1.cjs]
const fs = require('fs')
const http = require('http')
const path = require('path')
// 创建服务器
http
  .createServer(function (request, response) {
    // 读取 HTML 文件内容
    fs.readFile(path.resolve(__dirname, '1.html'), function (error, data) {
      response.writeHead(200, { 'Content-Type': 'text/html' })
      response.end(data)
    })
  })
  .listen(23523, function () {
    console.log('服务器监听地址是 http://127.0.0.1:23523')
  })
```

```html [1.html]
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>特殊文字符号</title>
    <style>
      h1,
      pre {
        text-align: center;
      }
    </style>
  </head>
  <body>
    <h1>汪汪！你想找的页面让我吃喽！</h1>
    <!--绘制可爱小狗的字符画-->
    <pre>
          .----.
          _.'__    `.
          .--($)($$)---/#\
          .' @          /###\
          :         ,   #####
          `-..__.-' _.-\###/
          `;_:    `"'
          .'"""""`.
          /,  hi ,\\
          //  你好!  \\
          `-._______.-'
          ___`. | .'___
          (______|______)
     </pre
    >
  </body>
</html>
```

:::

- ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-25-11-00-09.png)

## 5. 💻 demos.4 - 响应媒体资源

::: code-group

```js [1.cjs]
const fs = require('fs')
const http = require('http')
const path = require('path')

const PORT = 23523

http
  .createServer(async (request, response) => {
    let filePath
    let contentType

    if (request.url === '/image') {
      filePath = path.join(__dirname, '1.png')
      contentType = 'image/png'
    } else if (request.url === '/video') {
      filePath = path.join(__dirname, '1.mp4')
      contentType = 'video/mp4'
    } else {
      response.writeHead(404, { 'Content-Type': 'text/plain' })
      response.end('Not Found')
      return
    }

    try {
      // 获取文件元信息
      const stat = await fs.promises.stat(filePath)
      const fileSize = stat.size

      // 设置响应头
      response.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': contentType,
      })

      // 创建文件流并将其管道传输到响应对象
      const fileStream = fs.createReadStream(filePath)
      fileStream.on('error', (err) => {
        console.error('文件流读取错误:', err.message)
        if (!response.headersSent) {
          response.writeHead(500, { 'Content-Type': 'text/plain' })
          response.end('Internal Server Error')
        }
      })
      fileStream.pipe(response)
    } catch (error) {
      console.error('文件元信息获取错误:', error.message)
      if (!response.headersSent) {
        response.writeHead(500, { 'Content-Type': 'text/plain' })
        response.end('Internal Server Error')
      }
    }
  })
  .listen(PORT, () => {
    console.log(`服务器监听位置是 http://127.0.0.1:${PORT}`)
  })

// 写该 demo 的日期：2025年4月25日
```

:::

- 最终效果：
  - 访问：http://127.0.0.1:23523/image
    - ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-26-06-54-02.png)
  - 访问：http://127.0.0.1:23523/video
    - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-26-07-04-25.png)
- 备注：
  - 其中 `1.mp4` 是 `0032. 《Node.js 从入门到精通》` 中的视频 `11.3 http 模块.mp4` 的开头部分。

## 6. 💻 demos.5 - 重定向

::: code-group

```js [1.cjs]
const http = require('http')

const PORT = 23523
const REDIRECT_URL = 'https://tdahuyou.github.io/notes/'

// 创建服务器
const server = http.createServer((request, response) => {
  // 设置响应头：302 重定向
  response.writeHead(302, { Location: REDIRECT_URL })
  response.end() // 结束响应
})

// 启动服务器并监听端口
server.listen(PORT, () => {
  console.log(`服务器已启动，监听地址：http://127.0.0.1:${PORT}`)
})
```

:::

- 访问：http://127.0.0.1:23523
  - 会自动跳转到 https://tdahuyou.github.io/notes/
  - ![图 3](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-26-07-58-33.png)
- `writeHead` 的第一个参数是 `statusCode` 状态码，其数据类型是 `number`。
- **常见的状态码及其含义**：

| 状态码 | 说明         | 举例                      |
| ------ | ------------ | ------------------------- |
| `1**`  | 处理中       | 100 Continue              |
| `2**`  | 成功         | 200 OK                    |
| `3**`  | 重定向       | 302 Temporarily Moved     |
| `4**`  | 客户端错误   | 400 Bad Request           |
| `5**`  | 服务器端错误 | 500 Internal Server Error |

## 7. 💻 demos.6 - `request` 对象

- `request` 对象用于处理客户端请求。
- 主要属性：
  - `method`：请求方法（如 `GET`, `POST` 等）。
  - `url`：请求的 URL。
  - `headers`：请求头对象。
- 主要方法：
  - `on(event, listener)`：监听请求事件。
    - `event`：事件名称，比如 `data`、`end` 等。
    - `listener`：事件处理函数。

::: code-group

```js [1.cjs] {11,16-27}
const http = require('http')
const fs = require('fs').promises
const path = require('path')

const PORT = 23523
const HTML_FILE_PATH = path.resolve(__dirname, '1.html') // 定义 HTML 文件路径

// 创建服务器
const server = http.createServer(async (request, response) => {
  try {
    if (request.method === 'GET') {
      // 处理 GET 请求：返回 HTML 文件内容
      const data = await fs.readFile(HTML_FILE_PATH, 'utf-8')
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      response.end(data)
    } else if (request.method === 'POST') {
      // 处理 POST 请求：接收数据并返回响应
      let body = ''
      request.on('data', (chunk) => {
        body += chunk.toString() // 累积接收到的数据
      })

      request.on('end', () => {
        // 数据接收完成后返回响应
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        response.end(`<h1>${body}</h1>`)
      })
    } else {
      // 不支持的请求方法
      response.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Method Not Allowed')
    }
  } catch (error) {
    console.error('服务器错误:', error.message)
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Internal Server Error')
  }
})

// 启动服务器并监听端口
server.listen(PORT, () => {
  console.log(`服务器已启动，监听地址：http://127.0.0.1:${PORT}`)
})
```

```html [1.html]
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>用户登录</title>
  </head>
  <body>
    <main>
      <section role="form">
        <header>
          <h1>用户登录</h1>
        </header>
        <form method="post" aria-label="用户登录表单">
          <div>
            <input type="text" name="login" placeholder="用户名" required />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="密码"
              required
            />
          </div>
          <div>
            <label>
              <input type="checkbox" name="remember_me" id="remember_me" />
              记住密码
            </label>
          </div>
          <div>
            <button type="submit">登录</button>
          </div>
        </form>
      </section>
    </main>
  </body>
</html>
```

:::

- 测试：
  - 用户名：`111`
  - 密码：`222`
  - 记住密码：`是`
  - ![图 4](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-26-08-42-17.png)
  - 点击【登录】后：
  - ![图 5](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-26-08-42-24.png)
