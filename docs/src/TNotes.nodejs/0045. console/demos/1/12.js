console.log('变量的值是：%d', 57)
console.log('%d+%d=%d', 273, 52, 273 + 52)
console.log('%d+%d=%d', 273, 52, 273 + 52, 52273)
console.log('%d+%d=%d & %d', 273, 52, 273 + 52)
console.log('字符串 %s', 'hello world', '和顺序无关')
console.log('JSON %j', { name: 'Node.js' })

// 输出：
// 变量的值是：57
// 273+52=325
// 273+52=325 52273
// 273+52=325 & %d
// 字符串 hello world 和顺序无关
// JSON {"name":"Node.js"}
