// 【验证预期条件】
// 确保代码的某个部分在特定条件下正常运行。
// 如果条件不成立，这可能表明存在逻辑错误或不期望的状态。
function divide(a, b) {
  console.assert(b !== 0, '除数不能为0')
  return a / b
}

// 【调试和错误定位】
// 在开发过程中，你可能会使用 console.assert 来验证函数的输入参数是否符合预期，或者某个复杂操作的中间状态是否正确。
function processItems(items) {
  console.assert(Array.isArray(items), 'items 应该是一个数组')
  // 处理数组项的代码...
}

// 【单元测试中的简单断言】
// 虽然许多单元测试框架提供了自己的断言库，但在某些简单测试或快速原型开发中，你可能会使用 console.assert 作为轻量级的测试机制。
function add(a, b) {
  return a + b
}

console.assert(add(1, 2) === 3, '1 加 2 应该等于 3')

const user = {
  name: 'xxx',
  isAdmin: false,
}
// 确保代码不达到某些执行路径：在某些情况下，你可能希望代码不要执行某个分支。使用 console.assert 可以帮助你确认这一点。
if (user.isAdmin) {
  // 管理员特定的代码...
} else {
  // 非管理员代码...
  console.assert(false, '非管理员用户不应该执行这段代码')
}

// 输出：
// Assertion failed: 非管理员用户不应该执行这段代码
