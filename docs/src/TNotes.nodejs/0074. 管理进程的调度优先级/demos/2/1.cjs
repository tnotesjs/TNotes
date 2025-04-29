const os = require('os')

// 设置当前进程的优先级
try {
  os.setPriority(process.pid, -10) // 尝试将当前进程优先级设置为 -10
  console.log('优先级设置成功')
} catch (err) {
  console.error('设置优先级失败:', err.message) // [!code error]
}

// 输出：
// 设置优先级失败: A system error occurred: uv_os_setpriority returned EACCES (permission denied)

// 错误信息：EACCES (permission denied) 表示操作系统拒绝了权限请求。
// 在尝试使用 os.setPriority() 设置进程优先级时，当前用户没有足够的权限来修改目标进程的优先级。

// 可以尝试通过以【管理员权限运行 Node.js】来解决权限不足的报错问题。

// 在 Linux/macOS 中，可以使用 sudo 提升权限：
// sudo node 1.cjs

// 在 Windows 中，可以通过管理员身份运行命令提示符或 PowerShell，然后执行 node 命令：
// node 1.cjs
