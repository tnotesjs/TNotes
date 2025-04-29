const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

checkIsFileOrDirectory(filePath)
// 这是一个文件，大小为 5 字节。

function checkIsFileOrDirectory(filePath) {
  try {
    const stats = fs.statSync(filePath)

    if (stats.isFile()) {
      console.log(`这是一个文件，大小为 ${stats.size} 字节。`)
    } else if (stats.isDirectory()) {
      console.log(`这是一个目录，最后修改时间为 ${stats.mtime}。`)
    }
  } catch (err) {
    switch (err.code) {
      case 'ENOENT':
        console.error(`路径不存在: ${filePath}`)
        break
      case 'EACCES':
        console.error(`权限不足，无法访问路径: ${filePath}`)
        break
      default:
        console.error(`发生未知错误: ${err.message}`)
    }
  }
}
