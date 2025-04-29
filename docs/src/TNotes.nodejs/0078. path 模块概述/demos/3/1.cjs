const path = require('path')

console.log(path.basename('/foo/bar/baz/file.txt')) // => file.txt
console.log(path.basename('/foo/bar/baz/file.txt', '.txt')) // => file

// path.basename('/foo/bar/baz/file.txt')
// 表示的获取路径中的文件名部分。

// path.basename('/foo/bar/baz/file.txt', '.txt')
// 表示的获取路径中的文件名部分，并去除扩展名部分 .txt。
