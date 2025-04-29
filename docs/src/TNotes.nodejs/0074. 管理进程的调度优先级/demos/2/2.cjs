const os = require('os')

// 设置当前进程的优先级
try {
  os.setPriority(process.pid, 5)
  console.log('优先级设置成功')
} catch (err) {
  console.error('设置优先级失败:', err.message)
}

// 输出：
// 设置优先级失败: 优先级设置成功

// os.setPriority(process.pid, -10) 👈 这需要更高的权限
// os.setPriority(process.pid, 5) 👈 普通用户权限可能就够了
// 降低优先级调整的范围或许也能解决权限不足的报错。
// 某些操作系统对普通用户允许的优先级范围有限制。
// 例如，在 Linux 中，普通用户通常只能将优先级设置为正值（较低优先级），而负值（较高优先级）通常需要管理员权限。
// 您可以尝试将优先级设置为一个正数（例如 5 或 10），而不是负数（例如 -10）。

// 也可以自行设置操作系统的限制
// 不同的操作系统对线程/进程优先级的支持范围和行为不同：
// - Linux
//   - 普通用户可以将优先级设置为 0 到 19（较低优先级）。
//   - 设置负值（较高优先级）需要 CAP_SYS_NICE 权限（通常需要管理员权限）。
// - Windows
//   - Windows 的线程优先级分为多个级别（如 IDLE_PRIORITY_CLASS, BELOW_NORMAL_PRIORITY_CLASS, NORMAL_PRIORITY_CLASS 等）。
//   - 修改其他进程的优先级可能需要管理员权限。
// 可以查阅操作系统文档，了解具体的优先级范围和支持情况。
