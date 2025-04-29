const { EventEmitter } = require('events')

const eIns = new EventEmitter()

eIns.on('event', (...args) => {
  console.log('[emit event]:', ...args)
})

eIns.emit('event', 1)
eIns.emit('event', 1, 2)
eIns.emit('event', 1, 2, 3)

// 输出：
// [emit event]: 1
// [emit event]: 1 2
// [emit event]: 1 2 3

// 在调用 emit 触发事件的时候，是可以传递参数的。
// 想传几个就写几个，写法是非常灵活的。
// 在 on 注册的事件处理函数中可以通过剩余参数来接收动态参数。
