const people = [
  { name: 'John', age: 24, occupation: 'Engineer' },
  { name: 'Jane', age: 22, occupation: 'Designer' },
  { name: 'Doe', age: 28, occupation: 'Teacher' },
]

console.table(people)
console.table(people, ['name', 'age'])
console.table(people[0])

// 输出：
// ┌─────────┬────────┬─────┬────────────┐
// │ (index) │  name  │ age │ occupation │
// ├─────────┼────────┼─────┼────────────┤
// │    0    │ 'John' │ 24  │ 'Engineer' │
// │    1    │ 'Jane' │ 22  │ 'Designer' │
// │    2    │ 'Doe'  │ 28  │ 'Teacher'  │
// └─────────┴────────┴─────┴────────────┘
// ┌─────────┬────────┬─────┐
// │ (index) │  name  │ age │
// ├─────────┼────────┼─────┤
// │    0    │ 'John' │ 24  │
// │    1    │ 'Jane' │ 22  │
// │    2    │ 'Doe'  │ 28  │
// └─────────┴────────┴─────┘
// ┌────────────┬────────────┐
// │  (index)   │   Values   │
// ├────────────┼────────────┤
// │    name    │   'John'   │
// │    age     │     24     │
// │ occupation │ 'Engineer' │
// └────────────┴────────────┘
