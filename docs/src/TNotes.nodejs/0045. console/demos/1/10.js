console.count('bob')
console.count('bob')
console.count('alice')
console.count('alice')

console.log('重置 bob 的计数器')
console.countReset('bob')

console.count('bob')
console.count('bob')
console.count('alice')
console.count('alice')

console.log('重置 bob、alice 的计数器')
console.countReset('bob')
console.countReset('alice')

console.count('bob')
console.count('bob')
console.count('alice')
console.count('alice')

// 输出：
// bob: 1
// bob: 2
// alice: 1
// alice: 2
// 重置 bob 的计数器
// bob: 1
// bob: 2
// alice: 3
// alice: 4
// 重置 bob、alice 的计数器
// bob: 1
// bob: 2
// alice: 1
// alice: 2
