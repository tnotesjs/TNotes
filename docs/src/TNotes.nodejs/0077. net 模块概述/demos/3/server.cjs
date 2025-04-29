const net = require('net')
const path = require('path')
const fs = require('fs')
const localServer = net.createServer()

localServer.listen(2155, () => {
  console.log('开始监听 2155 端口')
}) // => 监听 2155 端口

localServer.on('connection', (socket) => {
  console.log('有客户端连接到该服务了')

  socket.on('data', async (chunk) => {
    console.log('接收到来自客户端的数据：', chunk.toString('utf-8'))

    const headBuffer = Buffer.from(
      `HTTP/1.1 200 OK
Content-Type: image/jpeg

`,
      'utf-8'
    )

    // 读取本地头像文件 avatar.jpeg
    const filename = path.resolve(__dirname, './avatar.jpeg')
    // const filename = path.resolve(__dirname, "./index.html");
    const bodyBuffer = await fs.promises.readFile(filename)

    socket.write(Buffer.concat([headBuffer, bodyBuffer]))
    socket.end()
  })

  socket.on('end', () => {
    console.log('连接关闭了')
  })
})
