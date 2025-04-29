const os = require('os')

function setProcessPriority(pid, priority) {
  try {
    os.setPriority(pid, priority)
    console.log(`优先级设置成功: PID=${pid}, Priority=${priority}`)
  } catch (err) {
    if (err.code === 'EACCES') {
      console.error('权限不足，无法设置优先级。请尝试以管理员身份运行脚本。')
    } else if (err.code === 'EINVAL') {
      console.error('无效的优先级值。请检查优先级范围是否符合操作系统要求。')
    } else {
      console.error('设置优先级失败:', err.message)
    }
  }
}

// 尝试设置当前进程优先级
setProcessPriority(process.pid, 5) // 使用正数优先级

// 这是一个更安全的实现，避免因权限不足导致程序崩溃。
