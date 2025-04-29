const fs = require('fs')
const path = require('path')
const { EventEmitter } = require('events')

const readStream = fs.createReadStream(path.join(__dirname, '4.txt')) // 正确示例
// const readStream = fs.createReadStream(path.join(__dirname, 'xxx.txt')) // 错误示例

console.log(
  '[readStream instanceof EventEmitter]:',
  readStream instanceof EventEmitter
)

readStream.on('error', (error) => {
  console.error('发生错误:', error)
})

readStream.on('data', (data) => {
  console.log('文件内容:', data.toString())
})

// 正确示例 输出：
// [readStream instanceof EventEmitter]: true
// 文件内容: 23.05.18 周四 下午 11:22

// 写完这个 demo 滚去睡觉了

// 这是首次编写这篇笔记的时间。

// --------------------------------------------

// 错误示例 输出：
// [readStream instanceof EventEmitter]: true
// 发生错误: [Error: ENOENT: no such file or directory, open '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0052. EventEmitter 对象-2/demos/11/xxx.txt'] {
//   errno: -2,
//   code: 'ENOENT',
//   syscall: 'open',
//   path: '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0052. EventEmitter 对象-2/demos/11/xxx.txt'
// }

// --------------------------------------------

// 由于 readStream 继承自 EventEmitter
// EventEmitter 默认就注册一个 error 事件用于处理错误
// 因此，当错误发生的时候，如果你想要定义相关的错误处理逻辑，也应该监听 error 事件才对。

// 除了读取流继承自 EventEmitter 之外，在 Node.js 中还有很多模块也都是继承自 EventEmitter 的。
// 比如，网络请求模块 net、http、https，文件 IO 模块 fs、stream 等等。
// 当我们在处理这些的 IO error 的时候，绑定错误处理逻辑时，都会监听 error 事件。
