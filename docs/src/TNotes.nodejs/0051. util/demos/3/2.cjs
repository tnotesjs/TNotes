const util = require('util')

// 定义一个复杂对象
function Person(name, age) {
  this.name = name
  this.age = age
  this.showName = function () {
    return this.name
  }
}
const author = new Person('Tdahuyou', 25)

console.log('普通输出:')
console.log(util.inspect(author))

console.log('\n启用颜色的输出:')
console.log(util.inspect(author, { colors: true }))

// 更复杂的对象（嵌套结构）
const complexObject = {
  person: author,
  details: {
    hobbies: ['coding', 'running'],
    address: {
      city: 'ShangHai',
      country: 'China',
    },
  },
}

// 普通输出（未启用颜色）
console.log('\n复杂对象的普通输出:')
console.log(util.inspect(complexObject))

// 启用颜色的输出
console.log('\n复杂对象的启用颜色输出:')
console.log(util.inspect(complexObject, { colors: true, depth: null }))
