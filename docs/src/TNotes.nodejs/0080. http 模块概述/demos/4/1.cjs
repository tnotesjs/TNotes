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
