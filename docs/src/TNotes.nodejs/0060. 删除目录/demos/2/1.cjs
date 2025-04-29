const fs = require('fs')
const path = require('path')

// 定义要递归创建的目录路径
const dirPath = path.join(__dirname, 'a', 'b', 'c')

// 递归要删除的目录的路径
const rmDirPath = path.join(__dirname, 'a')

try {
  // 使用 mkdirSync 创建目录，并启用递归选项
  const result = fs.mkdirSync(dirPath, { recursive: true })

  if (result === undefined) {
    console.log(`目录已存在: ${dirPath}`)
  } else {
    console.log(`目录已成功创建: ${dirPath}`)
  }

  // 使用 rm 删除目录，并启用递归选项
  fs.rmSync(rmDirPath, { recursive: true })
  // fs.rmdirSync(rmDirPath, { recursive: true })
  console.log(`目录已成功删除: ${dirPath}`)
} catch (err) {
  console.error(`递归创建/删除目录时出错: ${err.message}`)
}

// 输出：
// 目录已成功创建: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0060. 目录操作/demos/4/a/b/c
// 目录已成功删除: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0060. 目录操作/demos/4/a/b/c

// 环境记录：
// $ node -v
// v23.11.0

// 如果使用 fs.rmdirSync(rmDirPath, { recursive: true }) 来递归删除 rmDirPath，可能会出现以下错误：
// In future versions of Node.js, fs.rmdir(path, { recursive: true }) will be removed. Use fs.rm(path, { recursive: true }) instead
