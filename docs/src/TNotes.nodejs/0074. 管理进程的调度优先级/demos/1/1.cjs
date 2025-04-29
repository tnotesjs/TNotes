const os = require('os')

// 获取当前进程的优先级
console.log(os.getPriority())
console.log(os.getPriority(process.pid))

// 输出：
// 0
// 0

// os.getPriority() 等效于 os.getPriority(process.pid)
// process.pid 表示当前进程的 PID
