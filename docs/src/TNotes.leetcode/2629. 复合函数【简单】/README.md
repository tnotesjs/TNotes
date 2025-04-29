# [2629. 复合函数【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2629.%20%E5%A4%8D%E5%90%88%E5%87%BD%E6%95%B0%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/function-composition)



## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

请你编写一个函数，它接收一个函数数组 `[f1, f2, f3，…， fn]` ，并返回一个新的函数 `fn` ，它是函数数组的 **复合函数** 。

`[f(x)， g(x)， h(x)]` 的 **复合函数** 为 `fn(x) = f(g(h(x)))` 。

一个空函数列表的 **复合函数** 是 **恒等函数** `f(x) = x` 。

你可以假设数组中的每个函数接受一个整型参数作为输入，并返回一个整型作为输出。

**示例 1：**

- 输入：`functions = [x => x + 1, x => x * x, x => 2 * x], x = 4`
- 输出：`65`
- 解释：
  - 从右向左计算......
  - Starting with x = 4.
  - `2 * (4) = 8`
  - `(8) * (8) = 64`
  - `(64) + 1 = 65`

**示例 2：**

- 输入：`functions = [x => 10 * x, x => 10 * x, x => 10 * x], x = 1`
- 输出：`1000`
- 解释：
  - 从右向左计算......
  - `10 * (1) = 10`
  - `10 * (10) = 100`
  - `10 * (100) = 1000`

**示例 3：**

- 输入：`functions = [], x = 42`
- 输出：`42`
- 解释：空函数列表的复合函数就是恒等函数

**提示：**

- `-1000 <= x <= 1000`
- `0 <= functions.length <= 1000`
- 所有函数都接受并返回一个整型

## 2. 💻 题解.1

```javascript
/**
 * @param {Function[]} functions
 * @return {Function}
 */
var compose = function (functions) {

  return function (x) {

    let ans, i = functions.length - 1

    while (i >= 0) {
      const func = functions[i]
      ans = ans ? func(ans) : func(x)
      i--
    }

    return ans ? ans : x
  }
};

/**
 * const fn = compose([x => x + 1, x => 2 * x])
 * fn(4) // 9
 */
```

**【复杂度分析】**

- 时间复杂度：$O(n)$
- 空间复杂度：$O(1)$

**【流程分析】**

1. **入参：**输入的参数 `functions` 是一个函数数组，每个函数接收一个整型数据作为参数并返回一个整型数据作为输出。
2. **返回：**最终返回一个整数。
- `compose` 函数返回一个复合函数，这个复合函数接受一个参数 `x`，并 **从最后一个开始** 依次调用 `functions` 数组中的函数。
- 将第 `i` 个函数的输出作为第 `i - 1` 个函数的输入，直到将 `functions` 中的函数都遍历完，将最终的结果返回。

**【注意】**

- **空函数列表的复合函数就是恒等函数：**若入参 `functions` 为空数组 `[]`，那么直接将传入的 `x` 返回即可。
