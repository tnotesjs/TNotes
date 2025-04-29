const interval = setInterval(() => {
  console.log('This will stop after 3 seconds')
}, 1000)

setTimeout(() => {
  console.log('定时器已停止')
  clearInterval(interval) // 停止定时器
}, 3000)

// setInterval
// 返回值: 返回一个 Timeout 对象，可以用来取消定时器。

// clearInterval
// 作用: 取消由 setInterval() 创建的定时器。
// 参数: 接收 setInterval() 返回的 Timeout 对象。
