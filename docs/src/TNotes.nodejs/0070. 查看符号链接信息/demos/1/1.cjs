const fs = require('fs')
const path = require('path')

// 定义目标文件和符号链接
const targetPath = path.join(__dirname, '1.txt') // 目标文件
const linkPath = path.join(__dirname, '1_link.txt') // 符号链接

try {
  // 创建符号链接
  fs.symlinkSync(targetPath, linkPath)

  // 使用 fs.statSync 检查符号链接
  const statResult = fs.statSync(linkPath)
  console.log(`fs.statSync: 是否为文件: ${statResult.isFile()}`) // true
  console.log(`fs.statSync: 是否为符号链接: ${statResult.isSymbolicLink()}`) // false（已解析为目标文件）

  // 使用 fs.lstatSync 检查符号链接
  const lstatResult = fs.lstatSync(linkPath)
  console.log(`fs.lstatSync: 是否为文件: ${lstatResult.isFile()}`) // false
  console.log(`fs.lstatSync: 是否为符号链接: ${lstatResult.isSymbolicLink()}`) // true（未解析）
} catch (err) {
  console.error(`操作失败: ${err.message}`)
}

// 输出：
// fs.statSync: 是否为文件: true
// fs.statSync: 是否为符号链接: false
// fs.lstatSync: 是否为文件: false
// fs.lstatSync: 是否为符号链接: true

// ⚠️
// 如果符号链接 linkPath 已经被创建，则再次创建会报错：
// 操作失败: EEXIST:
// file already exists, symlink
// '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0070. 查看符号链接信息/demos/1/1.txt'
// -> '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0070. 查看符号链接信息/demos/1/1_link.txt'
