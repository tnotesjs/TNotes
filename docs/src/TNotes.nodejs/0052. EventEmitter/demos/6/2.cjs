const { EventEmitter } = require('events')

const eIns = new EventEmitter()

function createCallback(id) {
  return (...args) => {
    console.log(`[Callback ${id}]:`, ...args)
  }
}

eIns.on('event', createCallback(1))
eIns.on('event', createCallback(2))
eIns.on('event', createCallback(3))

eIns.emit('event', 1)

// 输出：
// [Callback 1]: 1
// [Callback 2]: 1
// [Callback 3]: 1

// 触发顺序问题：
// 如果往某个事件上同时注册了多个回调，
// 那么在触发的时候，会按照注册的顺序依次触发。
