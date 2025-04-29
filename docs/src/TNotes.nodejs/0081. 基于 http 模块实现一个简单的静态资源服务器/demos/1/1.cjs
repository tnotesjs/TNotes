const http = require('http')
const fs = require('fs/promises')
const path = require('path')

/**
 * 获取文件状态
 * @param {String} filename 文件的绝对路径
 * @returns 文件状态，如果绝对路径没法找到对应的文件，返回 null
 */
async function getFileStat(filename) {
  try {
    const stat = await fs.stat(filename)
    return stat
  } catch (e) {
    return null
  }
}

/**
 * 依据传入的请求资源路径，返回对应的文件内容
 * @param {String} url 请求的资源路径
 * @returns 文件内容，如果文件不存在，返回 null
 */
async function getFileContent(url) {
  // 处理 url
  url = url.replace(/^\//, '').replace(/\/$/, '')
  url = url === '' ? 'index.html' : url
  console.log('请求静态资源：', url)

  // 获取文件信息
  const filename = path.resolve(__dirname, 'resources', url)
  const stat = await getFileStat(filename)
  if (stat) {
    // 资源存在
    if (stat.isDirectory()) {
      // 是目录
      const childFilename = path.resolve(filename, 'index.html')
      const childStat = await getFileStat(childFilename)

      if (!childStat) return null
      else return await fs.readFile(childFilename)
    } else {
      // 是文件
      return await fs.readFile(filename)
    }
  } else {
    // 资源不存在
    return null
  }
}

const server = http.createServer(async (req, res) => {
  const content = await getFileContent(req.url)

  if (content) {
    res.statusCode = 200
    res.write(content)
  } else {
    res.statusCode = 404

    res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
    // charset=UTF-8 在响应中主动告诉浏览器使用UTF-8编码格式来接收数据
    // text/plain 纯文本格式
    res.write('资源不存在')
  }

  res.end()
})

server.on('listening', () => {
  console.log('listen 1012')
  console.log('启动服务，开始监听 1012 端口')
})

server.listen(1012)
