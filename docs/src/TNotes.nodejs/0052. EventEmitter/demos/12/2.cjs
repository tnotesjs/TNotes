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
eIns.on('event', createCallback(4))
eIns.on('event', createCallback(5))
eIns.on('event', createCallback(6))
eIns.on('event', createCallback(7))
eIns.on('event', createCallback(8))
eIns.on('event', createCallback(9))
eIns.on('event', createCallback(10))
eIns.on('event', createCallback(11))

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
// (node:4531) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 event listeners added to [EventEmitter]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
// (Use `node --trace-warnings ...` to show where the warning was created)

// 注意 - 如果监听函数数量超过 10 个，则会出现如下警告：
// (node:4531) MaxListenersExceededWarning:
// Possible EventEmitter memory leak detected.
// 11 event listeners added to [EventEmitter].
// MaxListeners is 10.
// Use emitter.setMaxListeners() to increase limit

// 中：
// (node:4531) MaxListenersExceededWarning:
// 检测到可能的 EventEmitter 内存泄漏。
// 11 个事件监听器添加到 [EventEmitter]。
// MaxListeners 是 10。
// 请使用 emitter.setMaxListeners() 增加限制。
// (使用 `node --trace-warnings ...` 可以显示警告的创建位置)

// 警告信息提示我们：
// 如果要监听的事件数量超过 10 个
// 需要调用 setMaxListeners() 方法来设置最大监听数量
