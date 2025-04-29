# [2621. 睡眠函数【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2621.%20%E7%9D%A1%E7%9C%A0%E5%87%BD%E6%95%B0%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/sleep/)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

请你编写一个异步函数，它接收一个正整数参数 `millis` ，并休眠 `millis` 毫秒。要求此函数可以解析任何值。

**示例 1：**

- 输入：millis = 100
- 输出：100
- 解释：在 100ms 后此异步函数执行完时返回一个 Promise 对象

```js
let t = Date.now();
sleep(100).then(() => {
  console.log(Date.now() - t); // 100
});
```

**示例 2：**

- 输入：millis = 200
- 输出：200
- 解释：在 200ms 后函数执行完时返回一个 Promise 对象

**提示：**

- `1 <= millis <= 1000`

## 2. 💻 题解.1

```javascript
/**
 * @param {number} millis
 */
async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis))
}

/**
 * let t = Date.now()
 * sleep(100).then(() => console.log(Date.now() - t)) // 100
 */
```
