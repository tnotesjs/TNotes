const path = require('path')

console.log(path.posix.join('foo', 'bar')) // => foo/bar
console.log(path.win32.join('foo', 'bar')) // => foo\bar
