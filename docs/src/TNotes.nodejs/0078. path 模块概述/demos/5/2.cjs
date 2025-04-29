const path = require('path')

const filePath = '/foo/bar/baz/file.txt'

console.log(
  `获取路径 ${filePath} 中的文件名（不带后缀）：${path.basename(
    filePath,
    path.extname(filePath) // 将结尾的扩展名去除
  )}`
)

// 输出：
// 获取路径 /foo/bar/baz/file.txt 中的文件名（不带后缀）：file
