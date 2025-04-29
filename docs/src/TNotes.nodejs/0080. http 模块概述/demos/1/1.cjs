// 引入 http 模块并创建 server 对象
const http = require('http')

// 辅助函数：获取当前时间的格式化字符串（亚洲上海本地时间）
const getCurrentTime = () => {
  const now = new Date()
  return now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
}

const server = http.createServer((req, res) => {
  // 设置响应头，指定字符编码为 UTF-8，以防乱码
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
  // 返回中文消息
  res.end('服务器正在运行中...\n')
})

// 启动服务器并监听指定端口
const PORT = 23523
server.listen(PORT, () => {
  console.log(
    `${getCurrentTime()} 服务器已启动，监听地址是 http://127.0.0.1:${PORT}`
  )
  console.log(`${getCurrentTime()} 服务器将在10秒后关闭...`)
  // 定时关闭服务器
  setTimeout(() => {
    server.close(() => {
      console.log(`${getCurrentTime()} 服务器已成功关闭`)
    })
  }, 10 * 1000)
})

// 输出：
// 2025/4/24 20:57:50 服务器已启动，监听地址是 http://127.0.0.1:23523
// 2025/4/24 20:57:50 服务器将在10秒后关闭...
// 2025/4/24 20:58:00 服务器已成功关闭
