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
