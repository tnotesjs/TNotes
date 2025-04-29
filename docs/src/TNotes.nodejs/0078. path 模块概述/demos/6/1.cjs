const path = require('path')

console.log(path.isAbsolute('/foo/bar')) // => true
console.log(path.posix.isAbsolute('/foo/bar')) // => true
console.log(path.win32.isAbsolute('/foo/bar')) // => true

console.log('----------------------------------------')

console.log(path.isAbsolute('foo/bar')) // => false
console.log(path.posix.isAbsolute('foo/bar')) // => false
console.log(path.win32.isAbsolute('foo/bar')) // => false

console.log('----------------------------------------')

console.log(path.isAbsolute('D:\\Demo\\js.js')) // => false
console.log(path.posix.isAbsolute('D:\\Demo\\js.js')) // => false
console.log(path.win32.isAbsolute('D:\\Demo\\js.js')) // => true

console.log('----------------------------------------')

console.log(path.isAbsolute('..\\Demo\\js.js')) // => false
console.log(path.posix.isAbsolute('..\\Demo\\js.js')) // => false
console.log(path.win32.isAbsolute('..\\Demo\\js.js')) // => false

console.log('----------------------------------------')

// path.isAbsolute()
// 判断给定路径是否为绝对路径格式。
