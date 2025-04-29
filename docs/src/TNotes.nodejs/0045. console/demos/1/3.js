// 来自 mdn 的示例
const errorMsg = 'the # is not even'
for (let number = 2; number <= 5; number += 1) {
  console.log('the # is ' + number)
  console.assert(number % 2 === 0, { number: number, errorMsg: errorMsg })
  // 或者使用 ES2015 对象简写：
  // console.assert(number % 2 === 0, {number, errorMsg});
}
// 输出：
// the # is 2
// the # is 3
// Assertion failed: {number: 3, errorMsg: "the # is not even"}
// the # is 4
// the # is 5
// Assertion failed: {number: 5, errorMsg: "the # is not even"}
