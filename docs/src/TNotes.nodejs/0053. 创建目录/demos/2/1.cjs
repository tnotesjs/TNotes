const fs = require('fs')
const path = require('path')

// 定义要递归创建的目录路径
const dirPath = path.join(__dirname, 'a', 'b', 'c')

try {
  // 使用 mkdirSync 创建目录，并启用递归选项
  const result = fs.mkdirSync(dirPath, { recursive: true })

  if (result === undefined) {
    console.log(`目录已存在: ${dirPath}`)
  } else {
    console.log(`目录已成功创建: ${dirPath}`)
  }
} catch (err) {
  // 发生错误会被 catch，通常都是权限问题，比如 EACCES: permission denied ...
  console.error(`创建目录时出错: ${err.message}`)
}

// 目录 a/b/c 不存在时，输出：
// 目录已成功创建: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0060. 目录操作/demos/2/a/b/c

// 目录 a/b/c 存在时，输出：
// 目录已存在: /Users/huyouda/zm/notes/TNotes.nodejs/notes/0060. 目录操作/demos/2/a/b/c

// 注意：
// 目录 a/b/c 必须都要有才算是存在，如果只有 a/b 或者 a 都算是 a/b/c 不存在。
// 使用 { recursive: true } 时，fs.mkdirSync 不会在目录已存在的情况下抛出错误，而是静默成功（即不会触发异常），并返回 undefined。

// 目录原有文件会被保留：
// 比如在创建递归创建目录之前，结构如下：
// └── a
//     └── b
//         ├── 1.md

// 递归创建目录后，结果如下：
// └── a
//     └── b
//         ├── 1.md # 这个文件在原始目录结构中就存在，它不会被移除。
//         └── c # 新增的目录 c
