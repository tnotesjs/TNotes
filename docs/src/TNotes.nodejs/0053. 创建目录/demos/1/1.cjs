const fs = require('fs')
const path = require('path')

// 定义要创建的目录路径
const dirPath = path.join(__dirname, 'test')

try {
  // 使用 mkdirSync 创建目录
  fs.mkdirSync(dirPath)

  console.log(`目录已成功创建: ${dirPath}`)
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log(`目录已存在: ${dirPath}`)
  } else {
    console.error(`创建目录时出错: ${err.message}`)
  }
}

// 如果 test 不存在，则输出：
// 目录已成功创建: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0060. 目录操作/demos/1/test

// 如果 test 已经存在，则输出：
// 目录已存在: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0060. 目录操作/demos/1/test
