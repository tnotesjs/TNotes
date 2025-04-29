const http = require('http')
console.log('请打开浏览器，输入地址 http://127.0.0.1:3000/')
http
  .createServer((req, res) => {
    // 要想让 Node.js 程序输出中文，只需要在输出内容之前将要显示网页的编码方式设置为 UTF-8。
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })

    res.end('你好，世界。')
    console.log('请求已处理')
  })
  .listen(3000, '127.0.0.1')
