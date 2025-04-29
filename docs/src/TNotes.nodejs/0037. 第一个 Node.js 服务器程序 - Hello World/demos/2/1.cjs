const http = require('http')
console.log('请打开浏览器，输入地址 http://127.0.0.1:3000/')
http
  .createServer((req, res) => {
    res.end('你好，世界。')
    console.log('请求已处理')
  })
  .listen(3000, '127.0.0.1')
