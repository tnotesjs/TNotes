const path = require('path')

const p1 = '/foo/bar//baz/../../file.txt'
const p2 = 'D:/demo/11/js.js'
const p3 = 'D:/\\demo\\/11/\\js.js'
const p4 = 'D:\\demo\\11\\js.js'
const p5 = '..\\demo\\a.mp4'
const p6 = '.\\demo\\a.mp4'
const p7 = '../demo/a.mp4'
const p8 = './demo/a.mp4'

console.log(p1, '👉', path.normalize(p1))
console.log(p2, '👉', path.normalize(p2))
console.log(p3, '👉', path.normalize(p3))
console.log(p4, '👉', path.normalize(p4))
console.log(p5, '👉', path.normalize(p5))
console.log(p6, '👉', path.normalize(p6))
console.log(p7, '👉', path.normalize(p7))
console.log(p8, '👉', path.normalize(p8))

console.log('---------------------------------------------')

console.log(p1, '👉', path.win32.normalize(p1))
console.log(p2, '👉', path.win32.normalize(p2))
console.log(p3, '👉', path.win32.normalize(p3))
console.log(p4, '👉', path.win32.normalize(p4))
console.log(p5, '👉', path.win32.normalize(p5))
console.log(p6, '👉', path.win32.normalize(p6))
console.log(p7, '👉', path.win32.normalize(p7))
console.log(p8, '👉', path.win32.normalize(p8))

// 输出：
// /foo/bar//baz/../../file.txt 👉 /foo/file.txt
// D:/demo/11/js.js 👉 D:/demo/11/js.js
// D:/\demo\/11/\js.js 👉 D:/\demo\/11/\js.js
// D:\demo\11\js.js 👉 D:\demo\11\js.js
// ..\demo\a.mp4 👉 ..\demo\a.mp4
// .\demo\a.mp4 👉 .\demo\a.mp4
// ../demo/a.mp4 👉 ../demo/a.mp4
// ./demo/a.mp4 👉 demo/a.mp4
// ---------------------------------------------
// /foo/bar//baz/../../file.txt 👉 \foo\file.txt
// D:/demo/11/js.js 👉 D:\demo\11\js.js
// D:/\demo\/11/\js.js 👉 D:\demo\11\js.js
// D:\demo\11\js.js 👉 D:\demo\11\js.js
// ..\demo\a.mp4 👉 ..\demo\a.mp4
// .\demo\a.mp4 👉 demo\a.mp4
// ../demo/a.mp4 👉 ..\demo\a.mp4
// ./demo/a.mp4 👉 demo\a.mp4

// 规范化路径，去除多余的 .. 或 . 和重复的分隔符。
