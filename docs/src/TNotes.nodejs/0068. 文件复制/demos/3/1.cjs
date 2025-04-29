const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const filePath2 = path.join(__dirname, '2.txt')

fs.writeFileSync(filePath, 'Hello Node.js!')
console.log('文件已被创建！')

// 使用流复制文件
const source = fs.createReadStream(filePath)
const destination = fs.createWriteStream(filePath2)

source.pipe(destination)

source.on('end', function () {
  console.log('文件复制完成')
})

source.on('error', function (err) {
  console.error('出错:', err)
})
