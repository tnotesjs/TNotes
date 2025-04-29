const os = require('os')

// 设置不存在的进程会报错
try {
  os.setPriority(666666, 5)
  console.log('优先级设置成功')
} catch (err) {
  console.error('设置优先级失败:', err.message) // [!code error]
}

// 输出：
// 设置优先级失败: A system error occurred: uv_os_setpriority returned ESRCH (no such process)
