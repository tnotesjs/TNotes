const net = require('net')

// 创建客户端
const client = net.createConnection(
  {
    port: 2155,
    host: 'localhost',
  },
  () => {
    console.log('成功连接服务端')
  }
)

// 监听来自服务端的消息
client.on('data', (chunk) => {
  console.log('来自服务端的消息：', chunk.toString())
  client.end() // 客户端主动关闭连接
})

// 向服务端发送请求
client.write('你好，我是客户端')

// 注册监听请求断开的事件
client.on('end', () => {
  console.log('连接断开了')
})
