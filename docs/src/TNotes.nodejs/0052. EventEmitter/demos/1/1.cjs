const { EventEmitter } = require('events')

const eIns = new EventEmitter()

eIns.on('event', () => {
  console.log('emit event')
})

// eIns.addListener('event', () => {
//   console.log('emit event')
// })

eIns.emit('event')

// 输出：
// emit event

// addListener 和 on
// addListener 和 on 是 EventEmitter 类的两个方法，它们在功能上是完全相同的，用于注册事件监听器。
// 实际上，on 方法就是 addListener 方法的别名，它们可以互换使用，没有实质性的区别。
// 我们可以根据个人喜好和代码风格选择使用 addListener 或 on。
