# [2723. 两个 Promise 对象相加【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2723.%20%E4%B8%A4%E4%B8%AA%20Promise%20%E5%AF%B9%E8%B1%A1%E7%9B%B8%E5%8A%A0%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/add-two-promises)

- 备注：考察对 Promise 的理解。

## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定两个 promise 对象 `promise1` 和 `promise2`，返回一个新的 promise。`promise1` 和 `promise2` 都会被解析为一个数字。返回的 Promise 应该解析为这两个数字的和。

**示例 1：**

输入：
```js
promise1 = new Promise(resolve => setTimeout(() => resolve(2), 20)),
promise2 = new Promise(resolve => setTimeout(() => resolve(5), 60))
```

输出：`7`

解释：两个输入的 Promise 分别解析为值 2 和 5。返回的 Promise 应该解析为 2 + 5 = 7。返回的 Promise 解析的时间不作为判断条件。

**示例 2：**

输入：
```js
promise1 = new Promise(resolve => setTimeout(() => resolve(10), 50)),
promise2 = new Promise(resolve => setTimeout(() => resolve(-12), 30))
```

输出：`-2`

解释：两个输入的 Promise 分别解析为值 10 和 -12。返回的 Promise 应该解析为 10 + -12 = -2。

**提示：**

- `promise1 和 promise2` 都是被解析为一个数字的 promise 对象

## 2. 💻 题解.1

```javascript
/**
 * @param {Promise} promise1
 * @param {Promise} promise2
 * @return {Promise}
 */
var addTwoPromises = async function(promise1, promise2) {
  return await promise1 + await promise2
};

/**
 * addTwoPromises(Promise.resolve(2), Promise.resolve(2))
 *   .then(console.log); // 4
 */
```
