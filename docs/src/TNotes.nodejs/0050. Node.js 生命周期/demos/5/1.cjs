async function async1() {
  console.log('1')
  await async2()
  console.log('2')
}

async function async2() {
  console.log('3')
}

console.log('4')

setTimeout(function () {
  console.log('5')
}, 0)

setTimeout(function () {
  console.log('6')
}, 3)

setImmediate(() => console.log('7'))

process.nextTick(() => console.log('8'))

async1()

new Promise(function (resolve) {
  console.log('9')
  resolve()
  console.log('10')
}).then(function () {
  console.log('11')
})

console.log('12')
