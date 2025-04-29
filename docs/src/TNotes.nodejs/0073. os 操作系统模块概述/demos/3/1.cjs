const os = require('os')

const networkInterfaces = os.networkInterfaces()
console.log(networkInterfaces)

// 输出：
// {
//   lo0: [
//     {
//       address: '127.0.0.1',
//       ...
//     },
//     ...
//   ],
//   ...
// }
