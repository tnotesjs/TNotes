const url = require('url')

const resolvedUrl = url.resolve('https://example.com/path/', '/newPath')

console.log(resolvedUrl)
// 输出：https://example.com/newPath
