const util = require('util')

function par() {
  this.name = '老张'
  this.age = 60
  this.say = function () {
    console.log(this.name + '今年' + this.age + '岁')
  }
}

function ch() {
  this.name = '小张'
}

util.inherits(ch, par) // ch 继承父类 par

const objBase = new par()
const objSub = new ch()

objBase.say()
// => 老张今年60岁

objSub.say()
// => 小张今年undefined岁

// 注意：子类 ch 继承了父类 par 的原型方法，但未继承构造函数内部的属性。
