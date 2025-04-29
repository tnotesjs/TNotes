const fs = require('fs')
const path = require('path')

// 定义要删除的目录路径
const dirPath = path.join(__dirname, './test')

try {
  // 使用 mkdirSync 创建目录
  fs.mkdirSync(dirPath)
  console.log(`目录创建成功: ${dirPath}`)

  // 使用 rmdirSync 删除目录
  fs.rmdirSync(dirPath)
  console.log(`目录已成功删除: ${dirPath}`)
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log(`目录不存在: ${dirPath}`)
  } else if (err.code === 'ENOTEMPTY') {
    console.error(`目录非空，无法删除: ${dirPath}`)
  } else {
    console.error(`删除目录时出错: ${err.message}`)
  }
}

// 输出：
// 目录创建成功: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0060. 目录操作/demos/3/test
// 目录已成功删除: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0060. 目录操作/demos/3/test
