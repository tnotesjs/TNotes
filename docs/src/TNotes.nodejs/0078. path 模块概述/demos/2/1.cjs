const path = require('path')

console.log(path.resolve())
console.log(path.resolve('foo', 'bar', 'baz/file.txt'))
console.log(path.resolve(__dirname))

// 输出：
// /Users/huyouda/zm/notes/TNotes.nodejs/notes/0078. path 模块概述
// /Users/huyouda/zm/notes/TNotes.nodejs/notes/0078. path 模块概述/foo/bar/baz/file.txt
// /Users/huyouda/zm/notes/TNotes.nodejs/notes/0078. path 模块概述/demos/2

// path.resolve() 方法将路径或路径片段的序列解析为绝对路径。
// 从右向左解析路径，直到生成一个绝对路径为止。
// 如果所有路径片段都无法形成绝对路径，则默认使用当前工作目录。（也就是运行 node 命令的位置）
