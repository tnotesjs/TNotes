# [2666. 只允许一次函数调用【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2666.%20%E5%8F%AA%E5%85%81%E8%AE%B8%E4%B8%80%E6%AC%A1%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/allow-one-function-call)



## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定一个函数 `fn` ，它返回一个新的函数，返回的函数与原始函数完全相同，只不过它确保 `fn` 最多被调用一次。

- 第一次调用返回的函数时，它应该返回与 `fn` 相同的结果。
- 第一次后的每次调用，它应该返回 `undefined` 。

**示例 1：**

- 输入：`fn = (a,b,c) => (a + b + c), calls = [[1,2,3],[2,3,6]]`
- 输出：`[{"calls":1,"value":6}]`
- 解释：
  - `const onceFn = once(fn);`
  - `onceFn(1, 2, 3); // 6`
  - `onceFn(2, 3, 6); // undefined, fn 没有被调用`

**示例 2：**

- 输入：`fn = (a,b,c) => (a _ b _ c), calls = [[5,7,4],[2,3,6],[4,6,8]]`
- 输出：`[{"calls":1,"value":140}]`
- 解释：
  - `const onceFn = once(fn);`
  - `onceFn(5, 7, 4); // 140`
  - `onceFn(2, 3, 6); // undefined, fn 没有被调用`
  - `onceFn(4, 6, 8); // undefined, fn 没有被调用`

**提示：**

- `calls` 是一个有效的 JSON 数组
- `1 <= calls.length <= 10`
- `1 <= calls[i].length <= 100`
- `2 <= JSON.stringify(calls).length <= 1000`

## 2. 💻 题解.1

```javascript
/**
 * @param {Function} fn
 * @return {Function}
 */
var once = function (fn) {
  let isCalled = false
  return function (...args) {
    if (!isCalled) {
      isCalled = true
      return fn(...args)
    } else {
      return undefined
    }
  }
};

/**
 * let fn = (a,b,c) => (a + b + c)
 * let onceFn = once(fn)
 *
 * onceFn(1,2,3); // 6
 * onceFn(2,3,6); // returns undefined without calling fn
 */
```

本题考察的依旧是闭包相关的知识点，只需要在函数 `once` 内部维护一个变量，记录 `fn` 是否被调用过即可。
