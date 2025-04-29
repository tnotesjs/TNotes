const { EventEmitter } = require('events')

const eIns = new EventEmitter()

console.log(1)

eIns.on('error', (...args) => {
  console.error('[emit error event]:', ...args)
})

eIns.emit('error', 1, 2, 3)

console.log(2)

// 输出：
// 1
// [emit error event]: 1 2 3
// 2
