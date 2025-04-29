const fs = require('fs')
const path = require('path')

// 定义要读取的目录路径
const dirPath = path.join(__dirname, 'abc')

try {
  // 使用 readdirSync 读取目录内容
  const files = fs.readdirSync(dirPath)

  console.log(`目录 ${dirPath} 的内容:`)
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`)
  })
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`目录不存在: ${dirPath}`) // [!code error]
  } else {
    console.error(`读取目录时出错: ${err.message}`)
  }
}

// 输出：
// 目录不存在: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0064. 读取目录内容/demos/2/abc

// 如果读取的目录不存在
// 会报错 ENOENT
