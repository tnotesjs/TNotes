const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const fileContent = 'Hello, Node.js!'

try {
  console.log('1. 开始写入文件')
  fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' })
  console.log('2. 文件写入成功')
} catch (err) {
  console.error('写入文件时出错:', err)
}

// 输出：
// 1. 开始写入文件
// 2. 文件写入成功

// 1 会在 2 之前输出。
// 当 2 输出的时候，文件已经完成写入了。

// fs.writeFileSync(file, data, options)
// 这是 fs.writeFile 的同步版本，会阻塞主线程直到写入完成。
