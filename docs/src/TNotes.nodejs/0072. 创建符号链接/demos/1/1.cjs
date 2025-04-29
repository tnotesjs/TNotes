const fs = require('fs')
const path = require('path')

// 定义目标文件和符号链接路径
const targetPath = path.join(__dirname, '1.txt') // 目标文件
const linkPath = path.join(__dirname, '1_link.txt') // 符号链接

try {
  // 创建符号链接
  fs.symlinkSync(targetPath, linkPath)

  console.log(`符号链接已成功创建: ${linkPath}`)
} catch (err) {
  console.error(`创建符号链接时出错: ${err.message}`)
}
