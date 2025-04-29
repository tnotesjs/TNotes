const fs = require('fs')
const { Transform } = require('stream')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

// 创建写入流
const writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' })

// 创建一个 Transform 流，用于监控每个 chunk
const monitorStream = new Transform({
  transform(chunk, encoding, callback) {
    console.log(`正在写入: ${chunk.toString().trim()}`) // 监控 chunk
    this.push(chunk) // 将 chunk 传递下去
    callback()
  },
})

// 将 Transform 流管道连接到写入流
monitorStream.pipe(writeStream)

// 写入数据
monitorStream.write('Chunk 1\n')
monitorStream.write('Chunk 2\n')
monitorStream.write('Chunk 3\n')

// 结束写入
monitorStream.end(() => {
  console.log('写入完成')
})

// 输出：
// 正在写入: Chunk 1
// 正在写入: Chunk 2
// 正在写入: Chunk 3
// 写入完成
