# [0052. EventEmitter](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0052.%20EventEmitter)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 demos.1 - `on`、`addListener`、`emit` 绑定事件和触发事件](#2--demos1---onaddlisteneremit-绑定事件和触发事件)
- [3. 💻 demos.2 - 多次 `emit` 触发多次事件](#3--demos2---多次-emit-触发多次事件)
- [4. 💻 demos.3 - 触发事件的时候可携带参数](#4--demos3---触发事件的时候可携带参数)
- [5. 💻 demos.4 - `once` 绑定的事件只会触发一次](#5--demos4---once-绑定的事件只会触发一次)
- [6. 💻 demos.5 - `off`、`removeListener` 解绑](#6--demos5---offremovelistener-解绑)
- [7. 💻 demos.6 - 多次 `on` 可绑定多个事件](#7--demos6---多次-on-可绑定多个事件)
- [8. 💻 demos.7 - `listenerCount` 获取监听器数量](#8--demos7---listenercount-获取监听器数量)
- [9. 💻 demos.8 - `removeAllListeners` 移除所有的监听器](#9--demos8---removealllisteners-移除所有的监听器)
- [10. 💻 demos.9 - `emit` 是同步的](#10--demos9---emit-是同步的)
- [11. 💻 demos.10 - `emit` 一个不存在的事件](#11--demos10---emit-一个不存在的事件)
- [12. 💻 demos.11 - 特殊的 `error` 事件](#12--demos11---特殊的-error-事件)
- [13. 💻 demos.12 - `setMaxListeners(limit)` 设置可以监听的最大回调函数数量](#13--demos12---setmaxlistenerslimit-设置可以监听的最大回调函数数量)
- [14. 🔗 参考资料](#14--参考资料)

<!-- endregion:toc -->

## 1. 📒 概述

- **事件 `events`**
  - Node.js 是一个事件驱动的运行时环境，所有的任务都可以视为事件处理。
  - `events` 模块是 Node.js 中用于实现事件驱动的核心模块，而 `EventEmitter` 类则是该模块的核心。
  - **事件驱动**：
    - `EventEmitter` 是 Node.js 的核心模块之一，它提供了实现 **事件驱动架构** 的基本工具。在 Node.js 和基于 Node.js 的应用程序（例如 Electron）中，事件驱动架构是一个核心的设计理念。
  - **模块间解耦**：
    - 通过事件，不同的模块可以相互通信，而不需要直接引用对方。
  - **实现观察者模式**：
    - EventEmitter 提供了一种实现观察者模式的机制，观察者模式是一种设计模式，它定义了对象间的一种一对多的关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。
  - **非阻塞 I/O**：
    - 通过使用事件驱动的编程模型，我们可以非阻塞地处理 I/O，这可以让我们的应用程序在等待 I/O（如网络请求或文件读取）完成时做其他事情，从而提高应用程序的性能。
- **EventEmitter**
  - **定义**：`EventEmitter` 是 Node.js 中用于处理事件的核心类，允许对象订阅和触发自定义事件。
  - **作用**：它是 Node.js 事件驱动架构的基础，广泛应用于异步编程中。
  - **使用场景**：
    - 处理用户交互（如点击、键盘输入等）。
    - 自定义事件的发布与订阅。
    - 实现观察者模式。
  - **使用**：要使用 `EventEmitter`，首先需要引入 `events` 模块并创建实例：

```javascript
const EventEmitter = require('events')
const eventEmitter = new EventEmitter()
// 它提供了丰富的事件处理方法，所有可以添加监听事件的对象都继承自 EventEmitter。
```

- **目标**：
  - 通过 demos 对事件驱动架构有个初步的认识。
- **个人评价**：
  - `EventEmitter` 在实际工作中使用相对较少，快速将 demos 给过一遍即可。
  - 重点在于认识“事件驱动架构”是一种什么样的编程体验，这对于我们学习那些基于 NodeJS 实现的框架而言，帮助是很大的。
    - 比如，Electron 就是基于 NodeJS 来实现的，在 Electron 中，用于实现 IPC 通信的模块 `ipcMain`、`ipcRenderer` 都是基于 `EventEmitter` 实现的，了解 `EventEmitter` 的一些常用 API，有助于我们快速上手 `ipcMain`、`ipcRenderer`。
  - 下面是 `EventEmitter` 模块相对常见一些的 API：

| 方法 | 描述 |
| --- | --- |
| `emitter.on(eventName, listener)` | 为指定事件注册一个监听器，监听器会在每次触发事件时执行。 |
| `emitter.emit(eventName[, ...args])` | 触发指定事件，并传递可选参数给监听器。 |
| `emitter.once(eventName, listener)` | 为指定事件注册一个单次监听器，监听器最多只会触发一次，触发后自动移除。 |
| `emitter.removeListener(eventName, listener)` | 移除指定事件的某个监听器。 |
| `emitter.removeAllListeners([eventName])` | 移除所有事件的所有监听器，如果指定了 `eventName`，则仅移除该事件的所有监听器。 |

## 2. 💻 demos.1 - `on`、`addListener`、`emit` 绑定事件和触发事件

::: code-group

```javascript [1.cjs]
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
```

:::

## 3. 💻 demos.2 - 多次 `emit` 触发多次事件

::: code-group

```javascript [1.cjs]
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
```

:::

## 4. 💻 demos.3 - 触发事件的时候可携带参数

::: code-group

```javascript [1.cjs]
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
```

:::

## 5. 💻 demos.4 - `once` 绑定的事件只会触发一次

::: code-group

```javascript [1.cjs]
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
```

:::

## 6. 💻 demos.5 - `off`、`removeListener` 解绑

::: code-group

```javascript {14,15} [1.cjs]
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
```

:::

## 7. 💻 demos.6 - 多次 `on` 可绑定多个事件

::: code-group

```javascript [1.cjs]
const { EventEmitter } = require('events')

const eIns = new EventEmitter()

function cb(...args) {
  console.log('[emit event]:', ...args)
}

eIns.on('event', cb)
eIns.on('event', cb)
eIns.on('event', cb)

eIns.emit('event', 1)

eIns.off('event', cb)

eIns.emit('event', 1, 2)

eIns.off('event', cb)

eIns.emit('event', 1, 2, 3)

// 输出：
// [emit event]: 1
// [emit event]: 1
// [emit event]: 1
// [emit event]: 1 2
// [emit event]: 1 2
// [emit event]: 1 2 3

// off() 方法用于移除监听器。
```

```javascript [2.cjs]
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
```

```javascript [3.cjs]
const { EventEmitter } = require('events')

const eIns = new EventEmitter()

function cb(...args) {
  console.log('[emit event]:', ...args)
}

eIns.on('event', cb) // 第一个 cb
eIns.on('event', cb) // 第二个 cb
eIns.on('event', cb) // 第三个 cb

eIns.emit('event', 1)

eIns.off('event', cb) // 🤔 移除的 cb 是第几个 cb？

eIns.emit('event', 1, 2)

// 输出：
// [emit event]: 1
// [emit event]: 1
// [emit event]: 1
// [emit event]: 1 2
// [emit event]: 1 2

// 扩展 - off 的顺序：
// off 用于移除事件监听器
// 上述程序往 event 身上同时注册了 3 次 cb
// 这 3 次注册的都是同一个函数 cb
// 当我们执行 eIns.off('event', cb) 的时候
// 会删除掉一个 cb
// 🤔 这个被删除的 cb 是第几个 cb 呢？
// 答：第一个被注册的 cb。

// ⚠️ 不知道怎么写 demo 验证上述说法。

// 如果同一个回调 cb 被注册 on 了多次，在移除 off 的时候没必要纠结删的是第几个 cb。
// 这种情况无论是移除最早注册的还是中间注册的还是最后注册的，对最终的逻辑都没啥影响。
// 至少在这个 demo 中，没必要过分纠结到底是哪个 cb 被移除了。
//   在执行 eIns.off('event', cb) 之前，如果触发 event 会打印 3 次。
//   在执行 eIns.off('event', cb) 之后，如果触发 event 会打印 2 次。
```

:::

## 8. 💻 demos.7 - `listenerCount` 获取监听器数量

::: code-group

```javascript [1.cjs]
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

eIns.removeListener('event', cb)

console.log(`[eIns.listenerCount('event')]:`, eIns.listenerCount('event'))
eIns.emit('event', 1, 2)

eIns.removeListener('event', cb)

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
// [eIns.listenerCount('event')]: 1
// [emit event]: 1 2 3
```

:::

## 9. 💻 demos.8 - `removeAllListeners` 移除所有的监听器

::: code-group

```javascript {16,21} [1.cjs]
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
```

```javascript {18} [2.cjs]
const { EventEmitter } = require('events')

const eIns = new EventEmitter()

// 匿名函数
eIns.on('event', (...args) => {
  console.log('[emit event]:', ...args)
})

// 匿名函数
eIns.on('event', (...args) => {
  console.log('[emit event]:', ...args)
})

eIns.emit('event', 1)
eIns.emit('event', 1, 2)

eIns.removeAllListeners('event')

eIns.emit('event', 1, 2, 3)

// 输出：
// [emit event]: 1
// [emit event]: 1
// [emit event]: 1 2
// [emit event]: 1 2
```

:::

## 10. 💻 demos.9 - `emit` 是同步的

::: code-group

```javascript [1.cjs]
const { EventEmitter } = require('events')

const eIns = new EventEmitter()

eIns.on('event1', () => {
  console.log('1')
  eIns.emit('event2') // 会立即执行 event2
  console.log('3')
})

eIns.on('event2', () => {
  console.log('2')
})

eIns.emit('event1') // 会立即执行 event1

console.log('4')

// 输出：
// 1
// 2
// 3
// 4

// emit 是同步的：
// EventEmitter 的 emit 方法是同步的，即当调用 emit 时，事件监听器会立即被执行。
```

:::

## 11. 💻 demos.10 - `emit` 一个不存在的事件

::: code-group

```javascript [1.cjs]
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
```

:::

## 12. 💻 demos.11 - 特殊的 `error` 事件

::: code-group

```javascript [1.cjs]
const { EventEmitter } = require('events')

const eIns = new EventEmitter()

console.log(1)

// eIns.on('error', () => {
//   // ...
// })

eIns.emit('error')

console.log(2)

// 输出：
// 1
// node:events:498
//     throw err; // Unhandled 'error' event
//     ^

// Error [ERR_UNHANDLED_ERROR]: Unhandled error. (undefined)
//     at EventEmitter.emit (node:events:496:17)
//     at Object.<anonymous> (/Users/huyouda/zm/notes/TNotes.nodejs/notes/0052. EventEmitter 对象-2/demos/11/1.cjs:11:6)
//     at Module._compile (node:internal/modules/cjs/loader:1734:14)
//     at Object..js (node:internal/modules/cjs/loader:1899:10)
//     at Module.load (node:internal/modules/cjs/loader:1469:32)
//     at Function._load (node:internal/modules/cjs/loader:1286:12)
//     at TracingChannel.traceSync (node:diagnostics_channel:322:14)
//     at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
//     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:151:5)
//     at node:internal/main/run_main_module:33:47 {
//   code: 'ERR_UNHANDLED_ERROR',
//   context: undefined
// }

// Node.js v23.11.0
```

```javascript [2.cjs]
const { EventEmitter } = require('events')

const eIns = new EventEmitter()

console.log(1)

try {
  eIns.emit('error')
} catch (error) {
  console.error('[emit error event]:', error)
}

console.log(2)

// 输出：
// 1
// [emit error event]: Error [ERR_UNHANDLED_ERROR]: Unhandled error. (undefined)
//     at EventEmitter.emit (node:events:496:17)
//     at Object.<anonymous> (/Users/huyouda/zm/notes/TNotes.nodejs/notes/0052. EventEmitter 对象-2/demos/11/2.cjs:8:8)
//     at Module._compile (node:internal/modules/cjs/loader:1734:14)
//     at Object..js (node:internal/modules/cjs/loader:1899:10)
//     at Module.load (node:internal/modules/cjs/loader:1469:32)
//     at Function._load (node:internal/modules/cjs/loader:1286:12)
//     at TracingChannel.traceSync (node:diagnostics_channel:322:14)
//     at wrapModuleLoad (node:internal/modules/cjs/loader:235:24)
//     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:151:5)
//     at node:internal/main/run_main_module:33:47 {
//   code: 'ERR_UNHANDLED_ERROR',
//   context: undefined
// }
// 2
```

```javascript [3.cjs]
const { EventEmitter } = require('events')

const eIns = new EventEmitter()

console.log(1)

eIns.on('error', (...args) => {
  console.error('[emit error event]:', ...args)
})

eIns.emit('error', 1, 2, 3)

console.log(2)

// 输出：
// 1
// [emit error event]: 1 2 3
// 2
```

```javascript [4.cjs]
const fs = require('fs')
const path = require('path')
const { EventEmitter } = require('events')

const readStream = fs.createReadStream(path.join(__dirname, '4.txt')) // 正确示例
// const readStream = fs.createReadStream(path.join(__dirname, 'xxx.txt')) // 错误示例

console.log(
  '[readStream instanceof EventEmitter]:',
  readStream instanceof EventEmitter
)

readStream.on('error', (error) => {
  console.error('发生错误:', error)
})

readStream.on('data', (data) => {
  console.log('文件内容:', data.toString())
})

// 正确示例 输出：
// [readStream instanceof EventEmitter]: true
// 文件内容: 23.05.18 周四 下午 11:22

// 写完这个 demo 滚去睡觉了

// 这是首次编写这篇笔记的时间。

// --------------------------------------------

// 错误示例 输出：
// [readStream instanceof EventEmitter]: true
// 发生错误: [Error: ENOENT: no such file or directory, open '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0052. EventEmitter 对象-2/demos/11/xxx.txt'] {
//   errno: -2,
//   code: 'ENOENT',
//   syscall: 'open',
//   path: '/Users/huyouda/zm/notes/TNotes.nodejs/notes/0052. EventEmitter 对象-2/demos/11/xxx.txt'
// }

// --------------------------------------------

// 由于 readStream 继承自 EventEmitter
// EventEmitter 默认就注册一个 error 事件用于处理错误
// 因此，当错误发生的时候，如果你想要定义相关的错误处理逻辑，也应该监听 error 事件才对。

// 除了读取流继承自 EventEmitter 之外，在 Node.js 中还有很多模块也都是继承自 EventEmitter 的。
// 比如，网络请求模块 net、http、https，文件 IO 模块 fs、stream 等等。
// 当我们在处理这些的 IO error 的时候，绑定错误处理逻辑时，都会监听 error 事件。
```

```txt [4.txt]
23.05.18 周四 下午 11:22

写完这个 demo 滚去睡觉了

这是首次编写这篇笔记的时间。
```

:::

- **所有的 EventEmitter 实例默认都会注册一个 error 事件监听器**。
- 这意味着如果在 EventEmitter 实例中没有显式地注册 error 事件监听器，当触发了一个错误事件且没有对其进行处理时，Node.js 将会打印错误堆栈信息，并可能导致程序退出。
- 为了避免程序崩溃，我们可以使用 `try-catch` 包裹一下 `eIns.emit('error')`。这样可以保证即使出现错误，程序也能够继续执行，并采取适当的措施来处理错误情况。
- **如果不想使用 try-catch，同时又要避免程序崩溃，建议在使用 EventEmitter 的时候，始终为 error 事件注册一个监听器，以便能够捕获和处理错误。**
- 在 Node.js 中，很多模块的错误处理都是监听 `error` 事件的原因就在于它们都是继承自 `EventEmitter` 的，因此，当错误发生的时候，如果你想要定义相关的错误处理逻辑，也应该监听 `error` 事件才对。

## 13. 💻 demos.12 - `setMaxListeners(limit)` 设置可以监听的最大回调函数数量

::: code-group

```js [1.cjs]
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
```

```js [2.cjs]
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
```

```js [3.cjs]
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
```

:::

## 14. 🔗 参考资料

- https://www.runoob.com/nodejs/nodejs-event.html
  - 菜鸟教程 - Node.js EventEmitter
- https://nodejs.org/dist/latest-v18.x/docs/api/events.html#class-eventemitter
  - Node.js 官方文档 - EventEmitter
