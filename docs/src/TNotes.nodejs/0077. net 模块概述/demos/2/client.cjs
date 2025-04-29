const net = require('net')
const responseData = {
  line: null, // 响应行
  header: null, // 响应头
  body: '', // 响应体
}
const separator = '\r\n' // 分隔符

// 创建客户端
const client = net.createConnection(
  {
    port: 80, // HTTP 协议，默认端口 80
    host: 'www.baidu.com', // default val => 'localhost'
  },
  () => {
    // 连接成功之后的回调
    console.log('连接成功~')
  }
)

// 发送请求
client.write(`GET / HTTP/1.1
Connection: keep-alive
Host: www.baidu.com

`)

// 监听响应
client.on('data', (chunk) => {
  console.log('chunk => ', chunk.toString('utf-8'))
  if (!responseData.line) {
    // 第一次收到的响应消息
    // 解析第一次接收到的 chunk 获取到响应行、响应头以及响应体的部分信息
    parseResponse(chunk.toString('utf-8'))
  } else {
    // 非第一次接收到的响应消息
    responseData.body += chunk.toString('utf-8')
  }
  isOver()
})

// 监听断开
client.on('close', () => {
  console.log('连接断开~')
})

/**
 * 解析响应消息
 * @param {String} response 响应消息
 */
function parseResponse(response) {
  const lineEndIndex = response.indexOf(separator) // => 响应行的结束位置
  const headerEndIndex = response.indexOf(separator + separator) // => 响应头的结束位置

  const lineStr = response.slice(0, lineEndIndex)
  const headerStr = response.slice(lineEndIndex + 2, headerEndIndex)
  const bodyStr = response.slice(headerEndIndex + 4)

  const lineArr = lineStr.split(' ')
  const headerArr = headerStr.split(separator)

  // 响应行
  responseData.line = {
    HTTPVersion: lineArr[0], // => 协议版本
    StatusCode: lineArr[1], // => 状态码
    ReasonPhrase: lineArr[2], // => 状态码描述
  }

  // 响应头
  responseData.header = headerArr
    .map((it) => {
      const keyEndIndex = it.indexOf(': '),
        key = it.slice(0, keyEndIndex),
        val = it.slice(keyEndIndex + 2)
      return [key, val]
    })
    .reduce((a, b) => {
      a[b[0]] = b[1]
      return a
    }, {})

  // 响应体
  responseData.body = bodyStr
}

/**
 * 判断来自服务器的消息是否已经接收完毕
 */
function isOver() {
  const contentLength = +responseData.header['Content-Length'],
    curLen = Buffer.from(responseData.body).byteLength

  // 消息接收完毕
  if (curLen >= contentLength) {
    client.end() // 关闭连接
  }
}
