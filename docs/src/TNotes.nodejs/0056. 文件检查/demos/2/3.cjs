const fs = require('fs')

// 以 10 进制输出：
console.log(fs.constants.F_OK) // 0
console.log(fs.constants.W_OK) // 2
console.log(fs.constants.F_OK | fs.constants.W_OK) // 2

// 以 2 进制输出：
console.log(fs.constants.F_OK.toString(2)) // 0（相当于 0o000）
console.log(fs.constants.W_OK.toString(2)) // 10（相当于 0o010）
console.log((fs.constants.F_OK | fs.constants.W_OK).toString(2)) // 10（相当于 0o010）

// rwx 权限
// fs.constants.F_OK 检查文件是否存在（跟 rwx 没啥关系）
// fs.constants.R_OK 检查文件是否可读，相当于 r 读权限，八进制值是 4
// fs.constants.W_OK 检查文件是否可写，相当于 w 写权限，八进制值是 2
// fs.constants.X_OK 检查文件是否可执行，相当于 x 执行权限，八进制值是 1

// 组合权限：检查文件是否存在和文件是否可写
// 正确写法：使用按位或 | 运算进行组合
// fs.constants.F_OK | fs.constants.W_OK
// 0o000 | 0o010 = 0o010

// 如果某个位置没有权限，使用 0 表示，如果有权限，用 1 表示，按位或，相当于将 1 保留。

// fs.constants.F_OK | fs.constants.W_OK
// 这种写法等效于 fs.constants.W_OK
// 最终结果都是 2
// 但是从语义上来讲，最好还是写成 fs.constants.F_OK | fs.constants.W_OK 这种形式

// 数值上：
// fs.constants.F_OK | fs.constants.W_OK 的结果等于 fs.constants.W_OK，因为 F_OK 的值为 0。

// 语义上：
// fs.constants.F_OK | fs.constants.W_OK 同时检查文件是否存在和是否可写。
