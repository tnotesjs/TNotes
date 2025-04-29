# [0509. 斐波那契数【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/0509.%20%E6%96%90%E6%B3%A2%E9%82%A3%E5%A5%91%E6%95%B0%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1 - 递归](#2--题解1---递归)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/fibonacci-number/)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

**斐波那契数** （通常用 `F(n)` 表示）形成的序列称为 **斐波那契数列** 。该数列由 `0` 和 `1` 开始，后面的每一项数字都是前面两项数字的和。也就是：

F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1

给定 `n` ，请计算 `F(n)` 。

**示例 1：**
```
输入：n = 2
输出：1
解释：F(2) = F(1) + F(0) = 1 + 0 = 1
```
**示例 2：**
```
输入：n = 3
输出：2
解释：F(3) = F(2) + F(1) = 1 + 1 = 2
```
**示例 3：**
```
输入：n = 4
输出：3
解释：F(4) = F(3) + F(2) = 2 + 1 = 3
```
**提示：**

- `0 <= n <= 30`

## 2. 💻 题解.1 - 递归

```js
var fib = function (n) {
  if (n === 0) return 0;
  if (n === 1 || n === 2) return 1;
  return fib(n - 1) + fib(n - 2);
};
```

- ![](assets/2024-11-16-19-07-29.png)
