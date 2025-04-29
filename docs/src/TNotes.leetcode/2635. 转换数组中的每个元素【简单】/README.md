# [2635. 转换数组中的每个元素【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2635.%20%E8%BD%AC%E6%8D%A2%E6%95%B0%E7%BB%84%E4%B8%AD%E7%9A%84%E6%AF%8F%E4%B8%AA%E5%85%83%E7%B4%A0%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/apply-transform-over-each-element-in-array)


- 备注：本题要求 - 实现数组原生 API `Array.map`

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

编写一个函数，这个函数接收一个整数数组 `arr` 和一个映射函数  `fn` ，通过该映射函数返回一个新的数组。

返回数组的创建语句应为 `returnedArray[i] = fn(arr[i], i)` 。

请你在不使用内置方法 `Array.map` 的前提下解决这个问题。

**示例 1:**

- 输入：`arr = [1,2,3], fn = function plusone(n) { return n + 1; }`
- 输出：`[2,3,4]`
- 解释：`const newArray = map(arr, plusone); // [2,3,4]` 此映射函数返回值是将数组中每个元素的值加 1。

**示例 2:**

- 输入：`arr = [1,2,3], fn = function plusI(n, i) { return n + i; }`
- 输出：`[1,3,5]`
- 解释：此映射函数返回值根据输入数组索引增加每个值。

**示例 3:**

- 输入：`arr = [10,20,30], fn = function constant() { return 42; }`
- 输出：`[42,42,42]`
- 解释：此映射函数返回值恒为 `42`。

**提示：**

- `0 <= arr.length <= 1000`
- `-10^9 <= arr[i] <= 10^9`
- `fn` 返回一个数

## 2. 💻 题解.1

```javascript
var map = function(arr, fn) {
  const ans = new Array(arr.length)
  for (let i = 0; i < arr.length; i++) {
    ans[i] = fn(arr[i], i)
  }
  return ans
}
```
