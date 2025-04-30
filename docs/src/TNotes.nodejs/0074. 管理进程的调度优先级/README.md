# [0074. 管理进程的调度优先级](https://github.com/Tdahuyou/TNotes.nodejs/tree/main/notes/0074.%20%E7%AE%A1%E7%90%86%E8%BF%9B%E7%A8%8B%E7%9A%84%E8%B0%83%E5%BA%A6%E4%BC%98%E5%85%88%E7%BA%A7)

<!-- region:toc -->

- [1. 📒 概述](#1--概述)
- [2. 💻 查看 PID](#2--查看-pid)
- [3. 💻 demos.1 - 获取当前进程的调度优先级](#3--demos1---获取当前进程的调度优先级)
- [4. 💻 demos.2 - 修改进程的调度优先级](#4--demos2---修改进程的调度优先级)
- [5. 💻 demos.3 - 查看电脑的优先级常量](#5--demos3---查看电脑的优先级常量)
- [6. 🔗 References](#6--references)

<!-- endregion:toc -->

## 1. 📒 概述

- 从 Node.js v12.16.0 开始，`os` 模块引入了 `getPriority()` 和 `setPriority()` 方法，用于获取和设置进程或线程的调度优先级。
- `os.getPriority([pid])`
  - 用于获取指定进程的调度优先级。
  - **参数**：
    - `pid`（可选）：目标进程的 ID（Process ID）。
    - 传入指定进程的 PID，可获取指定进程的调度优先级。
    - 如果未提供参数或者传入 `0`，默认返回当前进程的优先级。
  - **返回值**：
    - 返回一个整数，表示目标进程的调度优先级。
    - 具体范围取决于操作系统：
      - 在 Linux 系统中，优先级范围通常是 `-20` 到 `19`，数值越小优先级越高。
      - 在 Windows 系统中，优先级范围可能不同，具体行为依赖于系统实现。
  - **报错**：
    - 如果提供的 `pid` 无效（例如目标进程不存在），会抛出错误。
- `os.setPriority(pid, priority)`
  - 用于设置指定进程的调度优先级。
  - 它允许开发者动态调整优先级以优化系统资源分配。
  - **参数**：
    - `pid`：
      - 目标进程的 ID（Process ID）。
      - 可以是当前进程或其他进程的 PID。
      - 如果未提供参数或者传入 `0` 表示设置当前进程的优先级。
    - `priority`：
      - 新的优先级值，必须是一个整数。
      - 具体范围取决于操作系统。
  - **异常**：
    - 如果 `pid` 无效（例如目标进程不存在），会抛出错误。
    - 如果 `priority` 超出了系统允许的范围，会抛出错误。
    - 在某些操作系统上，修改其他进程的优先级可能需要管理员权限。
- **注意事项**:
  - **平台差异**：
    - 在 Linux 系统中，优先级范围通常是 `-20` 到 `19`，数值越小优先级越高。
    - 在 Windows 系统中，优先级范围和行为可能不同，具体取决于操作系统的线程调度机制。
  - **权限限制**：
    - 修改其他进程的优先级通常需要管理员权限。
    - 如果没有足够的权限，调用 `setPriority()` 会抛出错误。
  - **实验性特性**：
    - 这些方法虽然已经稳定，但在某些场景下仍可能存在兼容性问题。
    - 建议在生产环境中使用前进行充分测试。
  - **潜在风险**：
    - 不恰当的优先级设置可能导致系统资源分配不均，甚至引发性能问题或死锁。应谨慎使用。
- **使用建议**：
  - 如果您的应用运行在生产环境中，直接修改进程优先级可能会引发意外问题（如资源竞争、死锁等）。
  - 建议仅在必要时使用，并确保经过充分测试。
  - **避免直接修改系统级优先级**
    - 或许您可以不用修改进程优先级，以下是一些可能的替代方案：
    - **优化代码逻辑**：通过减少阻塞操作、合理分配任务等方式提高性能。
    - **使用多线程或多进程**：利用 `worker_threads` 或 `child_process` 模块分担任务压力。
- **应用场景**：
  - **实时应用**：对于需要快速响应的任务（如音视频处理、游戏引擎），可以通过提高线程或进程优先级来减少延迟。
  - **后台任务**：对于非关键任务（如日志记录、数据备份），可以降低其优先级以避免抢占重要资源。
  - **多进程优化**：在使用 `child_process` 或其他多进程编程场景中，通过动态调整进程优先级来平衡性能。

## 2. 💻 查看 PID

- 如果你是 macOS 用户，可以直接在【活动监视器】面板中查看进程的 PID。
  - ![图 0](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-20-07-37-48.png)
- 如果你是 Windows 用户，可以直接在【任务管理器】中查看进程的 PID。
  - ![图 1](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-20-07-39-27.png)
- 【示例】修改 chrome.exe 的优先级
  - 修改之前的原优先级：
  - ![图 2](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-20-08-10-36.png)

```js
const os = require('os')
os.getPriority(10904) // => 19
os.setPriority(10904, 10) // [!code highlight]
```

- 执行 `os.setPriority(10904, 10)` 表示将 chrome.exe（PID 为 10904）的的优先级设置为 10，最终会导致它的基本优先级变低。
- 修改之后的新优先级：
  - ![图 3](https://cdn.jsdelivr.net/gh/Tdahuyou/imgs@main/2025-04-20-08-11-55.png)

## 3. 💻 demos.1 - 获取当前进程的调度优先级

::: code-group

```js [1.cjs] {4-5}
const os = require('os')

// 获取当前进程的优先级
console.log(os.getPriority())
console.log(os.getPriority(process.pid))

// 输出：
// 0
// 0

// os.getPriority() 等效于 os.getPriority(process.pid)
// process.pid 表示当前进程的 PID
```

:::

## 4. 💻 demos.2 - 修改进程的调度优先级

::: code-group

```js [1.cjs] {5}
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
```

```js [2.cjs] {5-6}
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
```

```js [3.cjs] {5}
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
```

```js [4.cjs] {3-16}
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
```

:::

## 5. 💻 demos.3 - 查看电脑的优先级常量

::: code-group

```js [1.cjs] {2}
const os = require('os')
console.log(os.constants.priority)

// 输出：
// [Object: null prototype] {
//   PRIORITY_LOW: 19,
//   PRIORITY_BELOW_NORMAL: 10,
//   PRIORITY_NORMAL: 0,
//   PRIORITY_ABOVE_NORMAL: -7,
//   PRIORITY_HIGH: -14,
//   PRIORITY_HIGHEST: -20
// }
```

:::

| 常量名称                | 数值  | 含义                                     |
| ----------------------- | ----- | ---------------------------------------- |
| `PRIORITY_LOW`          | `19`  | 低优先级。                               |
| `PRIORITY_BELOW_NORMAL` | `10`  | 优先级别比低优先级高，但比正常优先级低。 |
| `PRIORITY_NORMAL`       | `0`   | 正常优先级。                             |
| `PRIORITY_ABOVE_NORMAL` | `-7`  | 优先级别比高优先级低，但比正常优先级高。 |
| `PRIORITY_HIGH`         | `-14` | 高优先级。                               |
| `PRIORITY_HIGHEST`      | `-20` | 最高优先级。                             |

- 在使用 `os` 模块的 `setPriority()` 方法设置进程优先级时，我们可以直接将其 `priority` 参数设置为以上 6 个值之一。

## 6. 🔗 References

::: details

- [priority](https://github.com/Tdahuyou/TNotes.en-words/blob/main/priority.md)
  - 优先级
  - 优先权

:::
