const { EventEmitter } = require('events')

const eIns = new EventEmitter()

function createCallback(id) {
  return (...args) => {
    console.log(`[Callback ${id}]:`, ...args)
  }
}

eIns.setMaxListeners(15) // 设置最大监听数量为 15 个

eIns.on('event', createCallback(1))
eIns.on('event', createCallback(2))
eIns.on('event', createCallback(3))
eIns.on('event', createCallback(4))
eIns.on('event', createCallback(5))
eIns.on('event', createCallback(6))
eIns.on('event', createCallback(7))
eIns.on('event', createCallback(8))
eIns.on('event', createCallback(9))
eIns.on('event', createCallback(10))
eIns.on('event', createCallback(11))
eIns.on('event', createCallback(12))
eIns.on('event', createCallback(13))
eIns.on('event', createCallback(14))
eIns.on('event', createCallback(15))

eIns.emit('event', 'hello world')

// 输出：
// [Callback 1]: hello world
// [Callback 2]: hello world
// [Callback 3]: hello world
// [Callback 4]: hello world
// [Callback 5]: hello world
// [Callback 6]: hello world
// [Callback 7]: hello world
// [Callback 8]: hello world
// [Callback 9]: hello world
// [Callback 10]: hello world
// [Callback 11]: hello world
// [Callback 12]: hello world
// [Callback 13]: hello world
// [Callback 14]: hello world
// [Callback 15]: hello world

// 不会有警告信息。
