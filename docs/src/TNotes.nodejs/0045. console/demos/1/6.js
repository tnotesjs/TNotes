console.time('myTimer') // 启动名为 'myTimer' 的计时器
for (let i = 0; i < 1000000; i++) {}
console.timeEnd('myTimer') // 停止计时器并打印出耗时

// 输出：
// myTimer: 1.226ms
