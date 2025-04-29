const { EventEmitter } = require('events')

const eIns = new EventEmitter()

eIns.on('event', () => {
  console.log('emit event')
})

eIns.emit('event')
eIns.emit('event')
eIns.emit('event')

// 输出：
// emit event
// emit event
// emit event

// on 方法用于注册事件监听器，当事件被触发时，注册的监听器会被调用。
// 每次 emit 触发事件时，都会调用注册的监听器。
