# [2804. 数组原型的 forEach 方法【简单】](https://github.com/Tdahuyou/TNotes.leetcode/tree/main/notes/2804.%20%E6%95%B0%E7%BB%84%E5%8E%9F%E5%9E%8B%E7%9A%84%20forEach%20%E6%96%B9%E6%B3%95%E3%80%90%E7%AE%80%E5%8D%95%E3%80%91)

<!-- region:toc -->

- [1. 🔗 links](#1--links)
- [2. 📝 Description](#2--description)
- [3. 💻 题解.1](#3--题解1)

<!-- endregion:toc -->
- [leetcode](https://leetcode.cn/problems/array-prototype-foreach/)


## 1. 🔗 links

- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call - MDN，Function.prototype.call()
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach - MDN，Array.prototype.forEach()

## 2. 📝 Description

编写一个数组方法 `forEach`，使其可以在任何数组上调用 `array.forEach(callback, context)` 方法，它将在数组的每个元素上执行回调函数。`forEach` 方法不应该返回任何内容。

回调函数 `callback` 接受以下参数：

- `value` - 表示数组中当前正在处理的元素的值。
- `index` - 表示数组中当前正在处理的元素的索引。
- `array` - 表示数组本身，在回调函数内部可以访问整个数组。

上下文 `context` 应该是作为函数上下文参数传递给回调函数 `callback` 的对象，确保回调函数 `callback` 内部的 `this` 关键字引用此上下文对象。

尝试在不使用内置数组方法的情况下实现这个方法。

**示例 1：**

输入：
```js
arr = [1,2,3],
callback = (val, i, arr) => arr[i] = val * 2,
context = {"context":true}
```

输出：`[2,4,6]`

解释：
```js
arr.forEach(callback, context) 
console.log(arr) // [2,4,6]
```

回调函数在数组的每个元素上执行。

**示例 2：**

输入：
```js
arr = [true, true, false, false],
callback = (val, i, arr) => arr[i] = this,
context = {"context": false}
```

输出：`[{"context":false},{"context":false},{"context":false},{"context":false}]`

解释：
```js
arr.forEach(callback, context) 
console.log(arr) // [{"context":false},{"context":false},{"context":false},{"context":false}]
```

回调函数在数组的每个元素上以正确的上下文执行。

**示例 3：**

输入：
```js
arr = [true, true, false, false],
callback = (val, i, arr) => arr[i] = !val,
context = {"context": 5}
```

输出：`[false,false,true,true]`

**提示：**

- `arr` 是一个有效的 JSON 数组
- `context` 是一个有效的 JSON 对象
- `fn` 是一个函数
- `0 <= arr.length <= 10^5`

## 3. 💻 题解.1

```javascript
/**
 * @param {Function} callback
 * @param {Object} context
 * @return {void}
 */
Array.prototype.forEach = function(callback, context) {
  for (let i = 0; i < this.length; i++) {
    callback.call(context, this[i], i, this)
  }
}

/**
 *  const arr = [1,2,3];
 *  const callback = (val, i, arr) => arr[i] = val * 2;
 *  const context = {"context":true};
 *
 *  arr.forEach(callback, context)
 *
 *  console.log(arr) // [2,4,6]
 */
```

- 时间复杂度：$O(n)$
- 空间复杂度：$O(1)$

题目要求 `callback` 在调用的时候，`this` 指向 `context`。这可以通过 `Function.prototype.call()` 来实现，将 `context` 作为 `callback.call(context, ...)` 的第一个参数传入即可。至于 `callback` 后续的剩余参数，继续写在后边儿即可。
