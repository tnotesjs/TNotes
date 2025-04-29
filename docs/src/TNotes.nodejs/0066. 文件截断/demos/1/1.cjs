const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')

const fileContentBeforeTruncate = fs.readFileSync(filePath)
console.log(`截断之前：【${fileContentBeforeTruncate}】`)

fs.truncateSync(filePath, 3)
console.log('完成截断')

const fileContentAfterTruncate = fs.readFileSync(filePath)
console.log(`截断之后：【${fileContentAfterTruncate}】`)

// 输出：
// 截断之前：【123456
// 】
// 完成截断
// 截断之后：【123】
