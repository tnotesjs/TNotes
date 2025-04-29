const { EventEmitter } = require('events')

const eIns = new EventEmitter()

function cb(...args) {
  console.log('[emit event]:', ...args)
}

eIns.on('event', cb)
eIns.on('event', cb)
eIns.on('event', cb)

eIns.emit('event', 1)

eIns.off('event', cb)

eIns.emit('event', 1, 2)

eIns.off('event', cb)

eIns.emit('event', 1, 2, 3)

// 输出：
// [emit event]: 1
// [emit event]: 1
// [emit event]: 1
// [emit event]: 1 2
// [emit event]: 1 2
// [emit event]: 1 2 3

// off() 方法用于移除监听器。
