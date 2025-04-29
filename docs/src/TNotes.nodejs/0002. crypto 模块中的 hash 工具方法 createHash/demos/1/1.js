const { createHash } = require('node:crypto')

function createContentHash(content, hashLSize = 12) {
  const hash = createHash('sha256').update(content);
  return hash.digest('hex').slice(0, hashLSize);
}

console.log(createContentHash('hello world'))
// b94d27b9934d

// 对于相同的内容，将会生成相同的 hash。
// 主要应用场景：模块缓存
// content 通常会传入模块的源码。
