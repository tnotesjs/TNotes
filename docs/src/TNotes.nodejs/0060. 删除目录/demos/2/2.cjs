const fs = require('fs')
const path = require('path')

// 递归要删除的目录的路径
const rmDirPath = path.join(__dirname, '1')

try {
  // 使用 rm 删除目录，并启用递归选项
  fs.rmSync(rmDirPath, { recursive: true, force: true })
  console.log(`目录已成功删除: ${rmDirPath}`)
} catch (err) {
  console.error(`递归删除目录时出错: ${err.message}`)
}

// 程序执行前的目录结构：
// .
// ├── 1
// │   └── 2
// │       └── test.md
// ├── 1.cjs
// └── 2.cjs

// 程序执行后的目录结构：
// .
// ├── 1.cjs
// └── 2.cjs

// 官方描述：
// To get a behavior similar to the rm -rf Unix command,
// use fs.rmSync() with options { recursive: true, force: true }.

// 如果你想要获取到跟 Unix 中的 rm -rf 命令一样的行为，可以使用 fs.rmSync() 方法，并设置选项 { recursive: true, force: true }。
// 这将删除目录及其下的所有文件和子目录，并忽略任何可能存在的错误。

// 如果不加 force 的话，那么在递归删除目录的过程中，可能会出现一些错误，比如：ENOENT 要删除的目录不存在，等错误。

// 因此，在需要递归删除目录的时候，一般会同时配置 { recursive: true, force: true }
// 以免出现一些不必要的报错，让目录清理操作更加健壮，适用于更多场景。
