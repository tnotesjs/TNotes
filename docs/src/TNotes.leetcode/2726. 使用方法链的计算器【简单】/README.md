# [2726. 使用方法链的计算器【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2726.%20%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95%E9%93%BE%E7%9A%84%E8%AE%A1%E7%AE%97%E5%99%A8%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/calculator-with-method-chaining)

- 备注：题目有些长，但逻辑很简单。

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

设计一个类 `Calculator` 。该类应提供加法、减法、乘法、除法和乘方等数学运算功能。同时，它还应支持连续操作的方法链式调用。`Calculator` 类的构造函数应接受一个数字作为 `result` 的初始值。

你的 `Calculator` 类应包含以下方法：

- `add` - 将给定的数字 `value` 与 `result` 相加，并返回更新后的 `Calculator` 对象。
- `subtract` - 从 `result` 中减去给定的数字 `value` ，并返回更新后的 `Calculator` 对象。
- `multiply` - 将 `result` 乘以给定的数字 `value` ，并返回更新后的 `Calculator` 对象。
- `divide` - 将 `result` 除以给定的数字 `value` ，并返回更新后的 `Calculator` 对象。如果传入的值为 `0` ，则抛出错误 `"Division by zero is not allowed"` 。
- `power` - 计算 `result` 的幂，指数为给定的数字 `value` ，并返回更新后的 `Calculator` 对象。（`result = result ^ value` ）
- `getResult` - 返回 `result` 的值。

结果与实际结果相差在 `10^-5` 范围内的解被认为是正确的。

**示例 1：**

输入：
```js
actions = ["Calculator", "add", "subtract", "getResult"],
values = [10, 5, 7]
```

输出：`8`

解释：`new Calculator(10).add(5).subtract(7).getResult() // 10 + 5 - 7 = 8`

**示例 2：**

输入：
```js
actions = ["Calculator", "multiply", "power", "getResult"],
values = [2, 5, 2]
```

输出：`100`

解释：`new Calculator(2).multiply(5).power(2).getResult() // (2 * 5) ^ 2 = 100`

**示例 3：**

输入：
```js
actions = ["Calculator", "divide", "getResult"],
values = [20, 0]
```

输出：`"Division by zero is not allowed"`

解释：`new Calculator(20).divide(0).getResult() // 20 / 0`

由于不能除以零，因此应抛出错误。

**提示：**

- `actions` 是一个有效的 JSON 字符串数组
- `values` 是一个有效的 JSON 字符串数组
- `2 <= actions.length <= 2 * 10^4`
- `1 <= values.length <= 2 * 10^4 - 1`
- `actions[i]` 是 "Calculator", "add", "subtract", "multiply", "divide", "power", 和 "getResult" 其中的元素
- 第一个操作总是 "Calculator"
- 最后一个操作总是 "getResult"

## 2. 💻 题解.1

```javascript
class Calculator {
  /**
   * @param {number} value
   */
  constructor(value) {
    this.val = value
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  add(value) {
    this.val += value
    return this
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  subtract(value) {
    this.val -= value
    return this
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  multiply(value) {
    this.val *= value
    return this
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  divide(value) {
    if (value === 0) throw new Error('Division by zero is not allowed')
    this.val /= value
    return this
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  power(value) {
    this.val **= value
    return this
  }

  /**
   * @return {number}
   */
  getResult() {
    return this.val
  }
}
```

**题解分析**

- 链式调用，每次 `return this` 即可。
- 除法运算时校验 value 不能为 0，否则抛出错误 `throw new Error('Division by zero is not allowed')`
