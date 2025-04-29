const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

const writeStream = fs.createWriteStream(filePath, {
  encoding: 'utf8',
})

const res1 = writeStream.write('第一部分数据\n')

console.log(
  res1
    ? '1 - 同步写入'
    : '1 - 异步写入 - 缓冲区已满，暂停写入，等待 drain 事件触发再继续'
)

const res2 = writeStream.write('第二部分数据\n')
console.log(
  res2
    ? '2 - 同步写入'
    : '2 - 异步写入 - 缓冲区已满，暂停写入，等待 drain 事件触发再继续'
)

// 结束写入
writeStream.end('最后一部分内容')

// 监听完成事件
writeStream.on('finish', () => {
  console.log('流式写入完成')
})

// 监听错误事件
writeStream.on('error', (err) => {
  console.error('写入流时出错:', err)
})

/* 
对于大文件或需要逐步写入数据的场景，可以使用流式写入以提高性能。

fs.createWriteStream(path, options)
这玩意儿会创建一个可写流，允许逐步（分块 chunk）写入数据。

如果想要监听每次写入的 chunk，可以通过手动记录或使用 Transform 流来实现。
  手动记录：比如将需要写入的输出封装到一个数组中，从数组中依次取数据 write，取出的每一条数据都可以在当前循环体中被处理。
  Transform 流：Transform 流提供了更高的灵活性，适合复杂的场景，可以帮助你更好地管理和监控写入过程。
*/
