console.group('User Details')
console.log('Name: John Doe')
console.log('Age: 30')
console.group('Address')
console.log('Street: 123 Example St')
console.log('City: Sampleville')
console.log('Country: Testland')
console.groupEnd()
console.groupEnd()

// 输出：
// User Details
//   Name: John Doe
//   Age: 30
//   Address
//     Street: 123 Example St
//     City: Sampleville
//     Country: Testland
