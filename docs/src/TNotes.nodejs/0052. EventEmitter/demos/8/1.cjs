const { EventEmitter } = require('events')

const eIns = new EventEmitter()

function cb(...args) {
  console.log('[emit event]:', ...args)
}

eIns.on('event', cb)
eIns.on('event', cb)
eIns.on('event', cb)

console.log(`[eIns.listenerCount('event')]:`, eIns.listenerCount('event'))
eIns.emit('event', 1)

eIns.removeListener('event', cb) // 移除指定的监听器，只会移除一个。

console.log(`[eIns.listenerCount('event')]:`, eIns.listenerCount('event'))
eIns.emit('event', 1, 2)

eIns.removeAllListeners('event') // 移除所有监听器

console.log(`[eIns.listenerCount('event')]:`, eIns.listenerCount('event'))
eIns.emit('event', 1, 2, 3)

// 输出：
// [eIns.listenerCount('event')]: 3
// [emit event]: 1
// [emit event]: 1
// [emit event]: 1
// [eIns.listenerCount('event')]: 2
// [emit event]: 1 2
// [emit event]: 1 2
// [eIns.listenerCount('event')]: 0
