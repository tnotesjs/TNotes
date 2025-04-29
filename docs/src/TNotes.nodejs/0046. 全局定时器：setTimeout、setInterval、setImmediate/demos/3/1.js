setImmediate(() => {
  console.log('This runs immediately after I/O events')
})

// setImmediate
// 作用: 将回调函数安排在当前事件循环的末尾、I/O 事件处理完成之后立即执行。
// 用途: 适合用于延迟执行某些逻辑，而不阻塞 I/O 操作。
