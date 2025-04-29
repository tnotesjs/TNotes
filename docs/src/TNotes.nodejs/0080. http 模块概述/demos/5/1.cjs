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
