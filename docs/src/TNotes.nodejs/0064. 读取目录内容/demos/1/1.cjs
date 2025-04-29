const fs = require('fs')
const path = require('path')

// 定义要读取的目录路径
const dirPath = path.join(__dirname, 'a')

try {
  // 使用 readdirSync 读取目录内容
  const files = fs.readdirSync(dirPath)

  console.log(`目录 ${dirPath} 的内容:`)
  files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`)
  })
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`目录不存在: ${dirPath}`)
  } else {
    console.error(`读取目录时出错: ${err.message}`)
  }
}

// 默认目录结构：
// $ tree
// .
// ├── 1.cjs
// └── a
//     ├── 1.txt
//     ├── 2.txt
//     └── b
//         ├── 1.md
//         └── c

// 输出：
// 目录 /Users/huyouda/zm/notes/TNotes.nodejs/notes/0064. 读取目录内容/demos/1/a 的内容:
// 1. 1.txt
// 2. 2.txt
// 3. b

// readdir()
// 会读取指定目录下的内容
// 包括目录下的文件和子目录
