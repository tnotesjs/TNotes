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
