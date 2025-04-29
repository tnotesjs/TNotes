const os = require('os')
console.log(os.constants.priority)

// 输出：
// [Object: null prototype] {
//   PRIORITY_LOW: 19,
//   PRIORITY_BELOW_NORMAL: 10,
//   PRIORITY_NORMAL: 0,
//   PRIORITY_ABOVE_NORMAL: -7,
//   PRIORITY_HIGH: -14,
//   PRIORITY_HIGHEST: -20
// }
