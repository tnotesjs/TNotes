const crypto = require('crypto')

const testStr = 'hello world'
const sha256 = crypto.createHash('sha256').update(testStr).digest('hex')
console.log(sha256)

const md5 = crypto.createHash('md5').update(testStr).digest('hex')
console.log(md5)

const sha512 = crypto.createHash('sha512').update(testStr).digest('hex')
console.log(sha512)

// $ node index.js
// b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
// 5eb63bbbe01eeed093cb22bb8f5acdc3
// 309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f

// $ node index.js
// b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
// 5eb63bbbe01eeed093cb22bb8f5acdc3
// 309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f

// $ node index.js
// b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9
// 5eb63bbbe01eeed093cb22bb8f5acdc3
// 309ecc489c12d6eb4cc40f50c902f2b4d0ed77ee511a7c7a9bcd3ca86d4cd86f989dd35bc5ff499670da34255b45b0cfd830e81f605dcf7dc5542e93ae9cd76f

// 执行多次，结果都是一样的。