const fs = require('fs')
const path = require('path')

// 定义要删除的目录路径
const dirPath = path.join(__dirname, './1')

try {
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
// 目录非空，无法删除: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0060. 目录操作/demos/3/1

// 注意：
// 如果一个目录中还有内容（比如其它文件或目录），那么这个目录默认是无法被删除的。
