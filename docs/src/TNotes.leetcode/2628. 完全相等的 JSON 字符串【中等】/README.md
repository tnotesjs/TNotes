# [2628. 完全相等的 JSON 字符串【中等】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2628.%20%E5%AE%8C%E5%85%A8%E7%9B%B8%E7%AD%89%E7%9A%84%20JSON%20%E5%AD%97%E7%AC%A6%E4%B8%B2%E3%80%90%E4%B8%AD%E7%AD%89%E3%80%91)

<!-- region:toc -->

- [1. 📝 Description](#1--description)
- [2. 💻 题解.递归](#2--题解递归)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/json-deep-equal)


## 1. 📝 Description

::: details [leetcode](https://leetcode.cn)

给定两个对象 `o1` 和 `o2` ，请你检查它们是否 **完全相等** 。

对于两个 **完全相等** 的对象，必须满足以下条件：

- 如果两个值都是原始类型，它们通过了 `===` 等式检查，则认为这两个值是 **完全相等** 的。
- 如果两个值都是数组，在它们具有相同元素且顺序相同，并且每个元素在这些条件下也 **完全相等** 时，认为这两个值是 **完全相等** 的。
- 如果两个值都是对象，在它们具有相同键，并且每个键关联的值在这些条件下也 **完全相等** 时，认为这两个值是 **完全相等** 的。

你可以假设这两个对象都是 `JSON.parse` 的输出。换句话说，它们是有效的 `JSON` 。

请你在不使用 lodash 的 `_.isEqual()` 函数的前提下解决这个问题。


**示例 1：**
```
输入：o1 = {"x":1,"y":2}, o2 = {"x":1,"y":2}
输出：true
输入：键和值完全匹配。
```
**示例 2：**
```
输入：o1 = {"y":2,"x":1}, o2 = {"x":1,"y":2}
输出：true
解释：尽管键的顺序不同，但它们仍然完全匹配。
```
**示例 3：**
```
输入：o1 = {"x":null,"L":[1,2,3]}, o2 = {"x":null,"L":["1","2","3"]}
输出：false
解释：数字数组不同于字符串数组。
```
**示例 4：**
```
输入：o1 = true, o2 = false
输出：false
解释：true !== false
```

**提示：**

- `1 <= JSON.stringify(o1).length <= 10^5`
- `1 <= JSON.stringify(o2).length <= 10^5`
- `maxNestingDepth <= 1000`

## 2. 💻 题解.递归

```js
/**
 * @param {null|boolean|number|string|Array|Object} o1
 * @param {null|boolean|number|string|Array|Object} o2
 * @return {boolean}
 */
var areDeeplyEqual = function (o1, o2) {
    // 如果两者都是原始类型，直接使用 === 比较。
    if (typeof o1 !== 'object' || o1 === null || typeof o2 !== 'object' || o2 === null) return o1 === o2;

    // 如果一个是数组而另一个不是，直接返回 false。
    if (Array.isArray(o1) !== Array.isArray(o2)) return false;

    const keys1 = Object.keys(o1).sort();
    const keys2 = Object.keys(o2).sort();

    if (keys1.length !== keys2.length) return false;

    for (let i = 0; i < keys1.length; i++) {
        const key = keys1[i];
        if (!areDeeplyEqual(o1[key], o2[key])) {
            return false;
        }
    }

    return true;
};
```
