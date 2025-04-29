const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

const inputFile = path.join(__dirname, 'largeFile.txt')
const outputFile = path.join(__dirname, 'encryptedFile.txt')

// 创建加密cipher
const algorithm = 'aes-256-cbc'
const password = 'mySecretKey'
const key = crypto.scryptSync(password, 'salt', 32)
const iv = crypto.randomBytes(16)
const cipher = crypto.createCipheriv(algorithm, key, iv)

// 创建读取和写入流
const readStream = fs.createReadStream(inputFile)
const writeStream = fs.createWriteStream(outputFile)

writeStream.write(iv) // 将IV写入输出文件的开头，用于解密

// 读取文件并分块加密
readStream.on('data', (chunk) => {
  console.count('on data')
  const encrypted = cipher.update(chunk)
  writeStream.write(encrypted)
})

readStream.on('end', () => {
  const finalBuffer = cipher.final()
  writeStream.write(finalBuffer)
  writeStream.end()
  console.log('加密完成，加密后的文件保存在：', outputFile)
})

readStream.on('error', (err) => {
  console.error('读取文件时发生错误：', err)
})

writeStream.on('error', (err) => {
  console.error('写入加密数据时发生错误：', err)
})
