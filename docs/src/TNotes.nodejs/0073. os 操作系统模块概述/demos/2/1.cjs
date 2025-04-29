const os = require('os')

console.log(`CPU 核心数: ${os.cpus().length}`)
console.log(`总内存: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`)
console.log(`空闲内存: ${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`)
console.log(
  `内存使用率：${(
    ((os.totalmem() - os.freemem()) / os.totalmem()) *
    100
  ).toFixed(2)}%`
)

// 输出：
// CPU 核心数: 12
// 总内存: 32.00 GB
// 空闲内存: 0.93 GB
// 内存使用率：97.09%
