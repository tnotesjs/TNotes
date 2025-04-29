const util = require('util')

console.log(util.format('%d+%d=%d', 50, 70, 50 + 70))
// => 50+70=120

console.log(util.format('整数：%i', 26.01))
// => 整数：26

console.log(util.format('小数：%f', '26.01'))
// => 小数：26.01

console.log(util.format('百分数：%d%%', 26))
// => 百分数：26%

const author = {
  name: 'Tdahuyou',
  age: 25,
}
console.log(util.format('对象格式化为JSON：%j', author))
// => 对象格式化为JSON：{"name":"Tdahuyou","age":25}
