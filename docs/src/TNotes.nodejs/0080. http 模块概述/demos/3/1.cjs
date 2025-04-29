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
