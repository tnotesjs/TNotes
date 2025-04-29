const fs = require('fs')

// 定义一个路径（可以是相对路径、绝对路径或包含符号链接的路径）
const inputPath = './1.txt' // 可以替换为其他路径

try {
  // 使用 realpathSync 获取真实路径
  const realPath = fs.realpathSync(inputPath)

  console.log(`输入路径: ${inputPath}`)
  console.log(`真实路径: ${realPath}`)

  // 可以进一步检查路径是否是符号链接
  const stats = fs.lstatSync(inputPath)
  if (stats.isSymbolicLink()) {
    console.log(`该路径是一个符号链接，指向: ${fs.readlinkSync(inputPath)}`)
  }
} catch (err) {
  switch (err.code) {
    case 'ENOENT':
      console.error(`路径不存在: ${inputPath}`)
      break
    case 'EACCES':
      console.error(`权限不足，无法访问路径: ${inputPath}`)
      break
    default:
      console.error(`发生未知错误: ${err.message}`)
  }
}
