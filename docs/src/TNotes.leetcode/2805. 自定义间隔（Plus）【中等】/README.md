# [2805. 自定义间隔（Plus）【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2805.%20%E8%87%AA%E5%AE%9A%E4%B9%89%E9%97%B4%E9%9A%94%EF%BC%88Plus%EF%BC%89%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.1](#2--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/custom-interval)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

**函数** `customInterval`

给定一个函数 `fn`、一个数字 `delay` 和一个数字 `period`，返回一个数字 `id`。`customInterval` 是一个函数，它应该根据公式 `delay + period * count` 在间隔中执行提供的函数 `fn`，公式中的 `count` 表示从初始值 `0` 开始执行间隔的次数。

**函数** `customClearInterval`

给定 `id`。`id` 是从函数 `customInterval` 返回的值。`customClearInterval` 应该停止在间隔中执行提供的函数 `fn`。

**注意：**在 Node.js 中，`setTimeout` 和 `setInterval` 函数返回一个对象，而不是一个数字。

**示例 1：**
```
输入：delay = 50, period = 20, stopTime = 225
输出：[50,120,210]
解释：
const t = performance.now()  
const result = []
        
const fn = () => {
    result.push(Math.floor(performance.now() - t))
}
const id = customInterval(fn, delay, period)

setTimeout(() => {
    customClearInterval(id)
}, 225)

50 + 20 * 0 = 50 // 50ms - 第一个函数调用
50 + 20 * 1 = 70 // 50ms + 70ms = 120ms - 第二个函数调用
50 + 20 * 2 = 90 // 50ms + 70ms + 90ms = 210ms - 第三个函数调用
```
**示例 2：**
```
输入：delay = 20, period = 20, stopTime = 150
输出：[20,60,120]
解释：
20 + 20 * 0 = 20 // 20ms - 第一个函数调用
20 + 20 * 1 = 40 // 20ms + 40ms = 60ms - 第二个函数调用
20 + 20 * 2 = 60 // 20ms + 40ms + 60ms = 120ms - 第三个函数调用
```
**示例 3：**
```
输入：delay = 100, period = 200, stopTime = 500
输出：[100,400]
解释：
100 + 200 * 0 = 100 // 100ms - 第一个函数调用
100 + 200 * 1 = 300 // 100ms + 300ms = 400ms - 第二个函数调用
```
**提示：**

- `20 <= delay, period <= 250`
- `20 <= stopTime <= 1000`

## 2. 💻 题解.1

```

```
