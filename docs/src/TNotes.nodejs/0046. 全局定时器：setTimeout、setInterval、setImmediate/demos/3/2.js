const immediate = setImmediate(() => {
  console.log('This will not run')
})

clearImmediate(immediate) // 立即取消

// clearImmediate
// 作用: 取消由 setImmediate() 创建的 Immediate 对象。
// 参数: 接收 setImmediate() 返回的 Immediate 对象。
