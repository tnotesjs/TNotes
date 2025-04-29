const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const fileContent = 'Hello, Node.js!'

try {
  fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' })
  console.log('文件写入成功')
} catch (err) {
  console.error('写入文件时出错:', err)
}

// 追加内容 - 异步版本
fs.appendFile(filePath, '\n这是追加的内容 - 1', { encoding: 'utf8' }, (err) => {
  if (err) {
    console.error('追加内容时出错 - 1:', err)
  } else {
    console.log('内容追加成功 - 1')
  }
})

// 追加内容 - 同步版本
try {
  fs.appendFileSync(filePath, '\n这是同步追加的内容 - 2', { encoding: 'utf8' })
  console.log('内容追加成功 - 2')
} catch (err) {
  console.error('追加内容时出错 - 2:', err)
}

// 输出：
// 文件写入成功
// 内容追加成功 - 2
// 内容追加成功 - 1

// 注意：
// 同步代码会先被执行，所以先输出 2 后输出 1。
// 补充：这部分内容关联的知识点 - Node.js 事件循环。

/* 
如果需要向文件末尾追加内容，可以使用以下方法：

  fs.appendFile(file, data, options, callback)
  该方法会在文件末尾追加数据，如果文件不存在，则会创建新文件。

  fs.appendFileSync(file, data, options)
  同步版本的追加写入。
*/
