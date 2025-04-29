const fs = require('fs')
const path = require('path')

// 文件路径
const demo1Path = path.join(__dirname, 'demo1.txt')
const demo2Path = path.join(__dirname, 'demo2.txt')

// 创建 demo1.txt 并设置为可写
fs.writeFileSync(demo1Path, 'test', { encoding: 'utf8', mode: 0o666 }) // mode: 默认权限 (可读可写)
console.log('demo1.txt 已创建，并且是可写的')

// 创建 demo2.txt 并设置为不可写
fs.writeFileSync(demo2Path, 'test', { encoding: 'utf8', mode: 0o444 }) // mode: 只读权限
console.log('demo2.txt 已创建，并且是不可写的')

// 验证文件权限
fs.access(demo1Path, fs.constants.W_OK, (err) => {
  if (err) {
    console.log('demo1.txt 不可写')
  } else {
    console.log('demo1.txt 确实是可写的')
  }
})

fs.access(demo2Path, fs.constants.W_OK, (err) => {
  if (err) {
    console.log('demo2.txt 确实是不可写的')
  } else {
    console.log('demo2.txt 可写')
  }
})
