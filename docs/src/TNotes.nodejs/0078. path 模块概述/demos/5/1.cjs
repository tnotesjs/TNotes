const path = require('path')

console.log(path.extname('/foo/bar/baz/file.txt'))
// => .txt

console.log(path.extname('/foo/bar/baz/file'))
// => ''

// 如果路径中没有扩展名，则返回空字符串 ''。
