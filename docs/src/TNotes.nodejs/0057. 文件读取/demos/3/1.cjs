const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

const stream = fs.createReadStream(filePath, { encoding: 'utf8' })

stream.on('data', (chunk) => {
  console.log('读取到的数据块:', chunk)
})

stream.on('end', () => {
  console.log('文件读取完毕')
})

stream.on('error', (err) => {
  console.error('读取文件失败:', err)
})

// 输出：
// 读取到的数据块: test
// 文件读取完毕

// fs.createReadStream(path[, options])
// 对于大文件，使用流式读取可以避免一次性加载整个文件到内存中，从而提高性能。

// 参数解释：
// path：文件路径。
// options：可选参数，例如指定编码或读取范围。

// 补充：
// demos 中的 1.txt 文件并非大型文件
// 一次就读完了
// 在实际测试的时候可替换为体积大一些的图片资源或者视频资源资源来测试
