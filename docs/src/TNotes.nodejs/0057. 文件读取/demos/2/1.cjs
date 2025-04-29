const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

try {
  const data1 = fs.readFileSync(filePath, 'utf8')
  const data2 = fs.readFileSync(filePath)
  console.log(data1) // test
  console.log(typeof data1) // string
  console.log(data2) // <Buffer 74 65 73 74 0a>
  console.log(typeof data2) // object
} catch (err) {
  console.error('读取文件失败:', err)
}

// fs.readFileSync(path[, options])

// 参数解释：
// path：文件路径。
// options：可选参数，用于指定编码。

// 返回值：
// 如果指定了编码（如 'utf8'），返回字符串。
// 如果未指定编码，返回 Buffer 对象。
