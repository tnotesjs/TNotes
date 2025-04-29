const util = require('util')

function Person() {
  this.name = 'Tdahuyou'
  this.age = 25
  this.showName = function () {
    return this.name
  }
}
const author = new Person()

console.log(util.inspect(author))
// Person { name: 'Tdahuyou', age: 25, showName: [Function (anonymous)] }

console.log(util.inspect(author, true)) // 启用颜色编码
// Person {
//   name: 'Tdahuyou',
//   age: 25,
//   showName: <ref *1> [Function (anonymous)] {
//     [length]: 0,
//     [name]: '',
//     [arguments]: null,
//     [caller]: null,
//     [prototype]: { [constructor]: [Circular *1] }
//   }
// }
