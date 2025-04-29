const os = require('os')

console.log(`主机名: ${os.hostname()}`) // 输出主机名
console.log(`运行时间: ${os.uptime()} 秒`) // 输出操作系统的运行时间（秒）
console.log(`运行天数：${(os.uptime() / 86400).toFixed(2)} 天`)

// 输出：
// 主机名: Mac-Studio.local
// 运行时间: 1343431 秒
// 运行天数：15.55 天
