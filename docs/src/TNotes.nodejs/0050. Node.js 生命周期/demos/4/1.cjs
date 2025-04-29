setImmediate(() => {
  console.log(1)
})

process.nextTick(() => {
  console.log(2)
  process.nextTick(() => {
    console.log(3)
  })
})

console.log(4)

Promise.resolve().then(() => {
  console.log(5)
  process.nextTick(() => {
    console.log(6)
  })
})
