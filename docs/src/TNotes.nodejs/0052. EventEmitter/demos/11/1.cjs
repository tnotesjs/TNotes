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
