let i = 0 // 记录执行程序的次数
const timer = setInterval(function () {
  i += 1
  console.log('已执行' + i + '次')
  if (i >= 5) {
    clearInterval(timer) // 执行 5 次后，取消定时器
    console.log('执行完毕')
  }
}, 2000)

// 运行上面的代码，每隔2秒会显示一次执行函数的次数，直到执行5次以后，取消定时器，最终输出结果如下：
// 已执行1次
// 已执行2次
// 已执行3次
// 已执行4次
// 已执行5次
// 执行完毕
