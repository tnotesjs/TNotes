let i = 0

console.time('setTimeout')

function test() {
  i++
  if (i < 1000) setTimeout(test, 0)
  else console.timeEnd('setTimeout')
}

test()
// setTimeout: 15.168s
