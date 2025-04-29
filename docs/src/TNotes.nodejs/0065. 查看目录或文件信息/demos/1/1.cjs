const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

try {
  const stats = fs.statSync(filePath)
  // 输出文件或目录的状态信息
  console.log(`路径: ${filePath}`)
  console.log(`是否为文件: ${stats.isFile()}`)
  console.log(`是否为目录: ${stats.isDirectory()}`)
  console.log(`文件大小: ${stats.size} 字节`)
  console.log(`文件创建时间: ${stats.birthtime}`)
  console.log(`最后修改时间: ${stats.mtime}`)
} catch (err) {
  if (err) {
    if (err.code === 'ENOENT') {
      console.error(`路径不存在: ${filePath}`)
    } else {
      console.error(`获取状态时出错: ${err.message}`)
    }
    return
  }
}

// 输出：
// 路径: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0065. 查看目录或文件信息/demos/1/1.txt
// 是否为文件: true
// 是否为目录: false
// 文件大小: 5 字节
// 文件创建时间: Sat Apr 19 2025 19:10:36 GMT+0800 (China Standard Time)
// 最后修改时间: Sat Apr 19 2025 19:10:38 GMT+0800 (China Standard Time)

// fs.statSync 的返回值是一个 fs.Stats 对象。
// fs.Stats 对象提供了很多属性和方法，用于获取文件或目录的信息。
