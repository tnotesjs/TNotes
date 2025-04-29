// 加载 Node.js 内置的 http 模块
const http = require('http')

// 在控制台输出提示信息，引导用户访问指定地址
console.log('请打开浏览器，输入地址 http://127.0.0.1:3000/')

// 使用 http.createServer 创建一个 HTTP 服务器
http
  .createServer((req, res) => {
    // req（请求对象）：包含客户端发送的请求信息，例如 URL、HTTP 方法等。
    // res（响应对象）：用于向客户端发送响应数据。

    // 使用 res.end 方法结束响应，并向页面输出 "Hello World!" 文本
    res.end('Hello World!')

    // 在控制台输出日志提示，表示服务器已正确处理请求
    console.log('请求已处理')
  })
  // 使用 listen 方法启动服务器，监听指定的 IP 地址和端口号
  .listen(3000, '127.0.0.1')
