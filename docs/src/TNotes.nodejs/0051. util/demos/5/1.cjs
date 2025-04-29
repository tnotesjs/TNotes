const util = require('util')
const fs = require('fs')
const path = require('path')

// 原始的错误优先回调风格函数
function readFileCallback(path, callback) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      return callback(err)
    }
    callback(null, data)
  })
}

// 使用 util.promisify 转换为返回 Promise 的函数
const readFilePromise = util.promisify(readFileCallback)

// 调用返回 Promise 的函数
readFilePromise(path.join(__dirname, '1.txt'))
  .then((data) => {
    console.log('文件内容:', data)
  })
  .catch((err) => {
    console.error('读取文件失败:', err)
  })

// 输出：
// 文件内容: test
