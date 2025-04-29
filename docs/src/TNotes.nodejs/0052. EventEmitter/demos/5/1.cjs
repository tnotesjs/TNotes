const { EventEmitter } = require('events')

const eIns = new EventEmitter()

function cb(...args) {
  console.log('[emit event]:', ...args)
}

eIns.on('event', cb)

eIns.emit('event', 1)
eIns.emit('event', 1, 2)

// eIns.off('event', cb)
eIns.removeListener('event', cb)

eIns.emit('event', 1, 2, 3)

// 输出：
// [emit event]: 1
// [emit event]: 1 2

// off = removeListener
// 与 on、addListener 一样，off 和 removeListener 也是等效的，根据自己习惯，选择一个喜欢的使用即可。

// 注意：匿名函数
// 如果我们在绑定 event 事件的监听器，使用的是匿名函数式的写法，那么 removeListener 是没法用的。
// 因为匿名函数没有函数名，这将导致我们没法找到这个函数引用（监听器）。
