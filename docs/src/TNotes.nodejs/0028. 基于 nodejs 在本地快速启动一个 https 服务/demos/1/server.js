const https = require('https')
const fs = require('fs')
const path = require('path')

// 加载 SSL/TLS 证书和私钥
const options = {
  key: fs.readFileSync(path.join(__dirname, 'key.pem')), // 私钥文件路径
  cert: fs.readFileSync(path.join(__dirname, 'cert.pem')), // 证书文件路径
}

// 创建 HTTPS 服务
https
  .createServer(options, (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello, HTTPS!\n')
  })
  .listen(443, () => {
    console.log('HTTPS Server running at https://localhost:443/')
  })

// 以上是一个基于 Node.js 的简单 HTTPS 服务示例。
