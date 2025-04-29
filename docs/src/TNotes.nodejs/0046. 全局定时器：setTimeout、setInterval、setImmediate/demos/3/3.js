console.log('正常执行1')
const t = setImmediate(function () {
  console.log('我被延迟执行了')
})
console.log('正常执行2')
// clearImmediate(t)

// 上面代码的运行结果如下：
// 正常执行1
// 正常执行2
// 我被延迟执行了

// 如果将最后一行代码 clearImmediate(t) 取消注释，则运行结果如下：
// 正常执行1
// 正常执行2

// 原因分析：

// 【1】
// function () {
//   console.log('我被延迟执行了')
// }
// setImmediate 中的这个 function 会被推入事件循环的 Check 阶段，在同步代码执行完后运行。

// 【2】
// clearImmediate(t)
// 这是同步代码，会先于异步代码【1】被执行。
