const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

// 错误优先回调风格
fs.readFile(
  filePath,
  'utf8',
  (
    err, // 回调的第一个参数是错误对象
    data // 回调的后续参数才是结果数据
  ) => {
    if (err) {
      console.error('读取文件失败:', err)
      return
    }
    console.log('文件内容：', data)
  }
)

// 输出：
// 问价内容：test

// Node.js 的 fs.readFile 方法就是一个典型的错误优先回调风格的例子。

// 如果文件读取成功：
// err 为 null。
// data 包含文件内容。

// 如果文件读取失败：
// err 包含错误信息。
// data 不会被传递。
