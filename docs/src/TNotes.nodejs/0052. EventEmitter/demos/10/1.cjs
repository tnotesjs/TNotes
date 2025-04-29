const { EventEmitter } = require('events')

const eIns = new EventEmitter()

console.log(1)

eIns.emit('event')

console.log(2)

// 输出：
// 1
// 2

// 当我们在 EventEmitter 实例上 emit 一个不存在的事件时
// 不会引发错误或抛出异常
// 相当于什么也没做
