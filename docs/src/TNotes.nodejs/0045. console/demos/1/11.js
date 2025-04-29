const obj = {
  name: 'Alice',
  age: 25,
  details: {
    city: 'New York',
    hobbies: ['reading', 'traveling'],
    address: {
      street: '123 Main St',
      zip: '10001',
    },
  },
}

console.log('Using console.log:')
console.log(obj)

console.log('Using console.dir with depth: 1')
console.dir(obj, { depth: 1 })

console.log('Using console.dir with depth: null (full expansion)')
console.dir(obj, { depth: null })

// 输出：
// Using console.log:
// {
//   name: 'Alice',
//   age: 25,
//   details: {
//     city: 'New York',
//     hobbies: [ 'reading', 'traveling' ],
//     address: { street: '123 Main St', zip: '10001' }
//   }
// }
// Using console.dir with depth: 1
// {
//   name: 'Alice',
//   age: 25,
//   details: { city: 'New York', hobbies: [Array], address: [Object] }
// }
// Using console.dir with depth: null (full expansion)
// {
//   name: 'Alice',
//   age: 25,
//   details: {
//     city: 'New York',
//     hobbies: [ 'reading', 'traveling' ],
//     address: { street: '123 Main St', zip: '10001' }
//   }
// }
