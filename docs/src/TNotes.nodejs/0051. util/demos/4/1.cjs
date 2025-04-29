const util = require('util')

async function fn() {
  return '这是一个函数'
}

const callbackFunction = util.callbackify(fn)

callbackFunction(function (err, ret) {
  if (err) throw err
  console.log(ret) // => 这是一个函数
})
