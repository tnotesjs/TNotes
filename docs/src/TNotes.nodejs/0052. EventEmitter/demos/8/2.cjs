const { EventEmitter } = require('events')

const eIns = new EventEmitter()

// 匿名函数
eIns.on('event', (...args) => {
  console.log('[emit event]:', ...args)
})

// 匿名函数
eIns.on('event', (...args) => {
  console.log('[emit event]:', ...args)
})

eIns.emit('event', 1)
eIns.emit('event', 1, 2)

eIns.removeAllListeners('event')

eIns.emit('event', 1, 2, 3)

// 输出：
// [emit event]: 1
// [emit event]: 1
// [emit event]: 1 2
// [emit event]: 1 2
