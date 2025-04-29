const path = require('path')

// 解析路径
const parsed = path.parse('/foo/bar/baz/file.txt')
console.log(parsed)
/* => {
  root: '/',
  dir: '/foo/bar/baz',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
}
*/

// 格式化路径
const formatted = path.format({
  dir: '/foo/bar/baz',
  base: 'file.txt',
})
console.log(formatted) // => /foo/bar/baz/file.txt

console.log(path.format(parsed)) // => /foo/bar/baz/file.txt

// path.parse(path) 将路径解析为对象形式。
// path.format(pathObject) 将路径对象重新格式化为字符串。

// path.parse(path)
// 返回一个 path.ParsedPath 对象

// path.format(pathObject)
// 传入的是一个 FormatInputPathObject 对象
