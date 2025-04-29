const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const filePath2 = path.join(__dirname, '2.txt')

fs.writeFileSync(filePath, 'Hello Node.js!')
console.log('文件已被创建！')

fs.renameSync(filePath, filePath2)
console.log('文件名已同步更改')
