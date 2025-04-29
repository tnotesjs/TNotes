const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '1.txt')
const fileContent = 'Hello, Node.js!'

fs.writeFile(filePath, fileContent, { encoding: 'utf8' }, (err) => {
  if (err) {
    console.error('写入文件时出错:', err)
  } else {
    console.log('文件写入成功')
  }
})

/* 
fs.writeFile(file, data, options, callback)

参数说明：
  file：文件路径（字符串）或文件描述符（数字）。
  data：要写入的数据，可以是字符串或 Buffer。
  options：可选配置对象，常见的选项包括：
    encoding：指定编码，默认为 'utf8'。
    mode：文件权限，默认为 0o666，表示 rw- 可读可写。
    flag：写入模式，默认为 'w'（覆盖写入）。如果需要追加内容，可以设置为 'a'。
  callback：回调函数，在写入完成后调用，接收 (err) 参数。
*/
