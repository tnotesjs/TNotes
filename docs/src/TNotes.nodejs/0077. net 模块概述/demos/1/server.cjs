const net = require('net')

const server = net.createServer()

server.listen(2155, () => {
  console.log('开始监听 2155 端口')
})

server.on('connection', (socket) => {
  console.log('监听到有客户端连接该服务')

  socket.on('data', (chunk) => {
    console.log('接收到来自客户端的数据', '\n=> ', chunk.toString())

    socket.write(
      `你好，我是服务端，我已经收到了你发送来的数据 => ${chunk.toString()}`,
      'utf-8'
    )
  })

  socket.on('end', () => {
    console.log('连接断开了')
  })
})
