const { EventEmitter } = require('events')

const eIns = new EventEmitter()

eIns.once('event', (...args) => {
  console.log('[emit event]:', ...args)
})

console.log(eIns.listenerCount('event')) // 1

eIns.emit('event', 1)

console.log(eIns.listenerCount('event')) // 0

eIns.emit('event', 1, 2)
eIns.emit('event', 1, 2, 3)

// 输出：
// 1
// [emit event]: 1
// 0

// once 和 on 的区别在于：
// on 注册的事件处理函数是可以被多次触发的。
// once 注册的事件处理函数只会被触发一次，触发完之后就会被移除掉。

// eIns.listenerCount(eventName: string): number
// 这个方法可通过事件名称获取对应的事件监听器的数量。

// 会发现执行了 eIns.emit('event', 1) 之后，监听器的数量就从 1 变为 0 了。
// 这其实也就说明通过 once 注册的事件，只会被触发一次，随后就会自动被移除。
