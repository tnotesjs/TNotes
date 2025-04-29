const timer = setTimeout(() => {
  console.log('1s 后被打印')
}, 1000)

// 如果需要，可以取消定时器
clearTimeout(timer)

// setTimeout
// 返回值: 返回一个 Timeout 对象，可以用来取消定时器。

// clearTimeout
// 作用: 取消由 setTimeout() 创建的定时器。
// 参数: 接收 setTimeout() 返回的 Timeout 对象。
