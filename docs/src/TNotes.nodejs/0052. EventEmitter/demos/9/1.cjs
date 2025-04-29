const { EventEmitter } = require('events')

const eIns = new EventEmitter()

eIns.on('event1', () => {
  console.log('1')
  eIns.emit('event2') // 会立即执行 event2
  console.log('3')
})

eIns.on('event2', () => {
  console.log('2')
})

eIns.emit('event1') // 会立即执行 event1

console.log('4')

// 输出：
// 1
// 2
// 3
// 4

// emit 是同步的：
// EventEmitter 的 emit 方法是同步的，即当调用 emit 时，事件监听器会立即被执行。
