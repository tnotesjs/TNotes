const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

try {
  // 创建文件
  fs.writeFileSync(filePath, 'Hello Node.js!')
  console.log('文件已被创建！')

  // 读取文件内容
  const data = fs.readFileSync(filePath, 'utf8')
  console.log(`文件内容：${data}`)

  // 删除文件
  fs.unlinkSync(filePath)
  console.log('文件已被删除！')

  // 再次尝试读取文件（此时文件已经被删除了，读取一个不存在的文件会报错。）
  fs.readFileSync(filePath)
} catch (error) {
  console.log(`错误码：【${error.code}】`)
  if (error.code === 'ENOENT') {
    console.error('文件不存在！')
  } else {
    console.error(error)
  }
}

// 输出：
// 文件已被创建！
// 文件内容：Hello Node.js!
// 文件已被删除！
// 错误码：【ENOENT】
// 文件不存在！

// 备注：
// ENOENT
// 表示 Error No Entry
// 表示 错误了，没找到入口。
// No such file or directory
// 文件或者路径不存在
