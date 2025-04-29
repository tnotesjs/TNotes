const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('读取文件失败:', err)
    return
  }
  console.log('文件内容:', data)
})

// 输出：
// 文件内容: test

// 注解：
// fs.readFile(path[, options], callback)
// path：文件路径（可以是字符串或 Buffer）。
// options：可选参数，用于指定编码（如 'utf8'）或其他选项。
// callback：回调函数，格式为 (err, data)。
//   如果读取成功，data 包含文件内容。
//   如果读取失败，err 包含错误信息。
