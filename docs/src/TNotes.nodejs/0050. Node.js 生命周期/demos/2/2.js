let i = 0

console.time('setImmediate')

function test() {
  i++
  if (i < 1000) setImmediate(test)
  else console.timeEnd('setImmediate')
}

test()
// setImmediate: 5.162ms
