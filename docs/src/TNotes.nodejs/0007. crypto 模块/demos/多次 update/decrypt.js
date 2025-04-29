const fs = require('fs')
const crypto = require('crypto')
const path = require('path')

const inputFile = path.join(__dirname, 'encryptedFile.txt')
const outputFile = path.join(__dirname, 'decryptedFile.txt')

// 解密配置
const algorithm = 'aes-256-cbc'
const password = 'mySecretKey'
const key = crypto.scryptSync(password, 'salt', 32)

// 创建读取和写入流
const readStream = fs.createReadStream(inputFile)
const writeStream = fs.createWriteStream(outputFile)

let iv
let isFirstChunk = true

// 读取文件并分块解密
readStream.on('data', (chunk) => {
  if (isFirstChunk) {
    // 假设IV存储在文件的前16字节
    iv = chunk.slice(0, 16)
    chunk = chunk.slice(16)
    isFirstChunk = false

    // 创建解密cipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv)

    // 解密第一块数据
    let decrypted = decipher.update(chunk)
    writeStream.write(decrypted)

    // 之后的数据块解密
    readStream.on('data', (chunk) => {
      decrypted = decipher.update(chunk)
      writeStream.write(decrypted)
    })

    readStream.on('end', () => {
      try {
        const finalBuffer = decipher.final()
        writeStream.write(finalBuffer)
        writeStream.end()
        console.log('解密完成，解密后的文件保存在：', outputFile)
      } catch (error) {
        console.error('解密过程中发生错误：', error)
      }
    })
  }
})

readStream.on('error', (err) => {
  console.error('读取加密文件时发生错误：', err)
})

writeStream.on('error', (err) => {
  console.error('写入解密数据时发生错误：', err)
})
