const path = require('path')

console.log(process.platform) // darwin

console.log(path.join('/foo', 'bar', 'baz/file.txt')) // => /foo/bar/baz/file.txt
console.log(path.join('/foo', 'bar', '..')) // => /foo
console.log(path.join('/foo', '../bar')) // => /bar

console.log(path.win32.join('/foo', 'bar', 'baz/file.txt')) // => \foo\bar\baz\file.txt
console.log(path.win32.join('/foo', 'bar', '..')) // => \foo
console.log(path.win32.join('/foo', '../bar')) // => \bar

// path.join()
// 自动处理多余的分隔符（如多余的 / 或 \）。
// 如果传入的路径片段包含 .. 或 .，会正确解析相对路径。
