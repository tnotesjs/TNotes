# [2724. 排序方式【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2724.%20%E6%8E%92%E5%BA%8F%E6%96%B9%E5%BC%8F%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/sort-by)

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort - MDN，Array.prototype.sort

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定一个数组 `arr` 和一个函数 `fn`，返回一个排序后的数组 `sortedArr`。你可以假设 `fn` 只返回数字，并且这些数字决定了 `sortedArr` 的排序顺序。`sortedArr` 必须按照 `fn` 的输出值 **升序** 排序。

你可以假设对于给定的数组，`fn` 不会返回重复的数字。

**示例 1：**

- 输入：`arr = [5, 4, 1, 2, 3], fn = (x) => x`
- 输出：`[1, 2, 3, 4, 5]`
- 解释：`fn` 只是返回传入的数字，因此数组按升序排序。

**示例 2：**

- 输入：`arr = [{"x": 1}, {"x": 0}, {"x": -1}], fn = (d) => d.x`
- 输出：`[{"x": -1}, {"x": 0}, {"x": 1}]`
- 解释：`fn` 返回 `"x"` 键的值，因此数组根据该值排序。

**示例 3：**

- 输入：`arr = [[3, 4], [5, 2], [10, 1]], fn = (x) => x[1]`
- 输出：`[[10, 1], [5, 2], [3, 4]]`
- 解释：数组按照索引为 `1` 处的数字升序排序。

**提示：**

- `arr` 是一个有效的 JSON 数组
- `fn` 是一个函数，返回一个数字
- `1 <= arr.length <= 5 * 10^5`

## 2. 💻 题解.1

```javascript
/**
 * @param {Array} arr
 * @param {Function} fn
 * @return {Array}
 */
var sortBy = function(arr, fn) {
  return arr.sort((next, cur) => fn(next) - fn(cur))
};
```

可以通过 `Array.prototype.sort` 快速解题，题目描述中提到：按照 fn 的输出值排序。最先想到的就是数组的 sort 方法，只需要将数组的每一项作为 fn 函数的入参丢给它然后做差即可。
